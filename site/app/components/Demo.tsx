'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CalendarX2,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleSlash,
  FileText,
  ListFilter,
  PenLine,
  Search,
  Send,
  Stamp,
} from 'lucide-react'

/* --- what the stream carries --------------------------------------------- */

interface DroppedHit {
  id: string
  articleId: string
  source: string
  rank: number
  effectiveTo: string | null
}

type RetrievalEvent =
  | { stage: 'rewrite'; ms: number; queries: string[] }
  | { stage: 'dense'; ms: number; queries: number; candidates: number }
  | { stage: 'lexical'; ms: number; queries: number; candidates: number }
  | { stage: 'fuse'; ms: number; candidates: number }
  | { stage: 'filter'; ms: number; kept: number; droppedCount: number; dropped: DroppedHit[]; asOf: string }
  | { stage: 'precedence'; ms: number; promoted: number }
  | { stage: 'rerank'; ms: number; from: number; kept: number }

interface Source {
  id: string
  articleId: string
  source: string
  cited: boolean
  excerpt: string
  truncated: boolean
  effectiveFrom: string | null
  effectiveTo: string | null
  precedence: number
}

interface AnswerPayload {
  answer: string | null
  refused: boolean
  citations: string[]
  sources: Source[]
  costEur: number
  latencyMs: number
  generationMs: number
  model: string
}

type Frame =
  | { type: 'open'; asOf: string; config: string; model: string }
  | { type: 'stage'; event: RetrievalEvent }
  | { type: 'generating' }
  | { type: 'answer'; payload: AnswerPayload }
  | { type: 'error'; error: string }

/* --- copy ---------------------------------------------------------------- */

export type RawStage =
  | 'rewrite' | 'dense' | 'lexical' | 'fuse' | 'filter' | 'precedence' | 'rerank' | 'generate'

/**
 * Every string the component renders, supplied by the page.
 *
 * Templates rather than functions: props crossing into a client component must be
 * serialisable, so substitution happens here on `{name}` tokens.
 */
export interface DemoCopy {
  /** French writes 0,0040 € and 6,2 s; English uses the point. */
  locale: 'fr' | 'en'
  placeholder: string
  submit: string
  running: string
  examplesLabel: string
  hint: string

  /** The four plain-language steps a visitor sees while it works. */
  steps: {
    search: { title: string; detail: string }
    filter: { title: string; detail: string; none: string; note: string }
    select: { title: string; detail: string }
    write: { title: string; detail: string }
  }

  /** The same run, named the way an engineer would name it. */
  techLabel: string
  techNote: string
  techStages: Record<RawStage, string>

  answered: string
  refusedLabel: string
  refusedBody: string
  citedHeading: string
  citedNote: string
  othersHeading: string
  cited: string
  inForce: string
  since: string
  articleWord: string
  precedenceNote: string

  readFull: string
  readLess: string
  truncatedNote: string
  strokeMore: string
  receipt: { cost: string; latency: string; model: string }
  whyHardHeading: string
  whyHard: string

  errors: Record<string, string>
}

/** A synchronous stage really does take under a millisecond; "0.0 s" reads as a missing
 *  measurement rather than a fast one. */
const formatMs = (ms: number, locale: 'fr' | 'en'): string =>
  ms < 1000 ? `${ms} ms` : `${decimal((ms / 1000).toFixed(1), locale)} s`

/** A French official document does not write 0.0040 €. */
const decimal = (value: string, locale: 'fr' | 'en'): string =>
  locale === 'fr' ? value.replace('.', ',') : value

const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))

/** What each raw stage reports, for the technical disclosure. */
function describe(event: RetrievalEvent): { name: RawStage; detail: string; ms: number } {
  switch (event.stage) {
    case 'rewrite':
      return { name: 'rewrite', ms: event.ms, detail: event.queries.slice(1).join(' · ') }
    case 'dense':
      return { name: 'dense', ms: event.ms, detail: `${event.candidates} / ${event.queries}q` }
    case 'lexical':
      return { name: 'lexical', ms: event.ms, detail: `${event.candidates} / ${event.queries}q` }
    case 'fuse':
      return { name: 'fuse', ms: event.ms, detail: `${event.candidates}` }
    case 'filter':
      return { name: 'filter', ms: event.ms, detail: `${event.kept} in force, ${event.droppedCount} dropped, as of ${event.asOf}` }
    case 'precedence':
      return { name: 'precedence', ms: event.ms, detail: `${event.promoted} moved` }
    case 'rerank':
      return { name: 'rerank', ms: event.ms, detail: `${event.from} rescored, ${event.kept} kept` }
  }
}

/* --- component ----------------------------------------------------------- */

const MAX_CHARS = 300

export default function Demo({ copy, examples }: { copy: DemoCopy; examples: string[] }) {
  const [question, setQuestion] = useState('')
  const [running, setRunning] = useState(false)
  const [events, setEvents] = useState<RetrievalEvent[]>([])
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<AnswerPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)
  const verdict = useRef<HTMLDivElement>(null)

  useEffect(() => () => abort.current?.abort(), [])

  /*
   * Bring the answer to the reader.
   *
   * The steps carry aria-live while the pipeline runs, but the result itself was never
   * announced, focused or scrolled to: on a narrow viewport the four steps push the verdict
   * entirely below the fold, so the visitor watched the machine finish and then had to go
   * looking for the payoff.
   */
  useEffect(() => {
    if (result === null) return
    const node = verdict.current
    if (node === null) return
    node.focus({ preventScroll: true })
    node.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [result])

  const ask = async (asked: string) => {
    const trimmed = asked.trim()
    if (trimmed.length < 8 || running) return

    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    setRunning(true)
    setError(null)
    setResult(null)
    setEvents([])
    setGenerating(false)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      })

      // A refusal decided before any work started arrives as a plain JSON body: the daily
      // cap and the rate limit are answers, not failures, and cost nothing to report.
      if (!response.ok || response.body === null) {
        const failed = (await response.json().catch(() => ({}))) as { error?: string }
        setError(copy.errors[failed.error ?? 'demo-unavailable'] ?? copy.errors['demo-unavailable']!)
        return
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += value
        // Newline-delimited JSON: a chunk can split a line, so only whole lines are parsed
        // and the remainder is carried into the next read.
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const raw of lines) {
          if (raw.trim().length === 0) continue
          const frame = JSON.parse(raw) as Frame
          if (frame.type === 'stage') setEvents((current) => [...current, frame.event])
          else if (frame.type === 'generating') setGenerating(true)
          else if (frame.type === 'answer') setResult(frame.payload)
          else if (frame.type === 'error') setError(copy.errors[frame.error] ?? copy.errors['demo-unavailable']!)
        }
      }
    } catch (failure) {
      if ((failure as Error).name !== 'AbortError') setError(copy.errors['demo-unavailable']!)
    } finally {
      setRunning(false)
    }
  }

  const tooShort = question.trim().length < 8
  const find = <K extends RetrievalEvent['stage']>(stage: K) =>
    events.find((event): event is Extract<RetrievalEvent, { stage: K }> => event.stage === stage)

  const rewrite = find('rewrite')
  const fuse = find('fuse')
  const filter = find('filter')
  const rerank = find('rerank')

  /*
   * Four steps, not eight.
   *
   * The pipeline really does have eight stages, and an engineer can open the disclosure
   * below and read every one with its own timing. But a visitor deciding whether this is
   * worth a conversation needs the shape of the work, not its parts list: it searches, it
   * throws away what no longer applies, it picks five, it writes from those five. Naming
   * `rrf fusion` and `precedence boost` on the surface buys nothing from them and costs
   * them the thread.
   */
  const searchMs = events
    .filter((event) => ['rewrite', 'dense', 'lexical', 'fuse'].includes(event.stage))
    .reduce((total, event) => total + event.ms, 0)
  const selectMs = (find('precedence')?.ms ?? 0) + (rerank?.ms ?? 0)

  const steps = [
    {
      key: 'search',
      icon: Search,
      tone: undefined as 'alert' | 'done' | undefined,
      title: copy.steps.search.title,
      detail: fill(copy.steps.search.detail, {
        queries: rewrite?.queries.length ?? 0,
        candidates: fuse?.candidates ?? 0,
      }),
      ms: fuse === undefined ? null : searchMs,
      struck: undefined as DroppedHit[] | undefined,
      strokeMore: 0,
      note: undefined as string | undefined,
      // Shown only once fusion has landed. The detail interpolates the candidate count, and
      // rendering it earlier made every run open by announcing "0 articles ressortent" —
      // the first thing a new visitor read about the system was a false zero.
      shown: fuse !== undefined,
    },
    {
      key: 'filter',
      icon: CalendarX2,
      tone: 'alert' as const,
      title: copy.steps.filter.title,
      detail:
        filter === undefined
          ? ''
          : filter.droppedCount === 0
            ? fill(copy.steps.filter.none, { kept: filter.kept, asOf: filter.asOf })
            : fill(copy.steps.filter.detail, {
                dropped: filter.droppedCount,
                kept: filter.kept,
                asOf: filter.asOf,
              }),
      ms: filter?.ms ?? null,
      struck: filter?.dropped,
      strokeMore: filter === undefined ? 0 : Math.max(0, filter.droppedCount - filter.dropped.length),
      note: filter !== undefined && filter.droppedCount > 0 ? copy.steps.filter.note : undefined,
      shown: filter !== undefined,
    },
    {
      key: 'select',
      icon: ListFilter,
      tone: undefined as 'alert' | 'done' | undefined,
      title: copy.steps.select.title,
      detail: fill(copy.steps.select.detail, { from: rerank?.from ?? 0, kept: rerank?.kept ?? 5 }),
      ms: rerank === undefined ? null : selectMs,
      struck: undefined as DroppedHit[] | undefined,
      strokeMore: 0,
      note: undefined as string | undefined,
      shown: rerank !== undefined,
    },
    {
      key: 'write',
      icon: PenLine,
      tone: (result === null ? undefined : 'done') as 'alert' | 'done' | undefined,
      title: copy.steps.write.title,
      detail: copy.steps.write.detail,
      ms: result?.generationMs ?? null,
      struck: undefined as DroppedHit[] | undefined,
      strokeMore: 0,
      note: undefined as string | undefined,
      shown: generating,
    },
  ]

  const visible = steps.filter((step) => step.shown)
  const liveKey = running ? visible[visible.length - 1]?.key : undefined

  const citedSources = result?.sources.filter((source) => source.cited) ?? []
  const otherSources = result?.sources.filter((source) => !source.cited) ?? []

  return (
    <>
      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault()
          void ask(question)
        }}
      >
        <div className="ask-field">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value.slice(0, MAX_CHARS))}
            placeholder={copy.placeholder}
            maxLength={MAX_CHARS}
            rows={2}
            aria-label={copy.placeholder}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void ask(question)
              }
            }}
          />
          <button type="submit" className="button" disabled={running || tooShort}>
            <Send size={16} strokeWidth={1.75} aria-hidden="true" />
            {running ? copy.running : copy.submit}
          </button>
        </div>
        <div className="ask-foot">
          <span className="small muted">{copy.hint}</span>
          <span className="counter">
            {question.length} / {MAX_CHARS}
          </span>
        </div>
      </form>

      <div className="examples">
        <span className="label">{copy.examplesLabel}</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            className="chip"
            disabled={running}
            onClick={() => {
              setQuestion(example)
              void ask(example)
            }}
          >
            <FileText size={13} strokeWidth={1.75} aria-hidden="true" />
            {example}
          </button>
        ))}
      </div>

      {error !== null && (
        <div className="callout" data-tone="alert" role="status">
          <CircleAlert size={20} strokeWidth={1.75} aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {visible.length > 0 && (
        <>
          <ul className="steps" aria-live="polite">
            {visible.map((step) => {
              const Icon = step.icon
              return (
                <li className="step" key={step.key} data-tone={step.tone} data-live={step.key === liveKey}>
                  <span className="step-icon">
                    <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="step-title">{step.title}</span>
                  <span className="step-ms">{step.ms === null ? '…' : formatMs(step.ms, copy.locale)}</span>
                  <div className="step-detail">
                    {step.detail}
                    {step.struck !== undefined && step.struck.length > 0 && (
                      <>
                        <ul className="struck">
                          {step.struck.map((hit) => (
                            <li key={hit.id}>
                              {hit.articleId}
                              {hit.effectiveTo !== null && <span> · {hit.effectiveTo}</span>}
                            </li>
                          ))}
                          {/* The sentence above counts every removal; only the highest-ranked
                              few are listed, so the remainder is stated rather than dropped. */}
                          {step.strokeMore > 0 && (
                            <li className="struck-more">{fill(copy.strokeMore, { n: step.strokeMore })}</li>
                          )}
                        </ul>
                        {step.note !== undefined && (
                          <p className="label" style={{ marginTop: '.45rem' }}>
                            {step.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {/*
            The same run, for the reader who wants the parts list. Closed by default: it is
            the second question a technical visitor asks, and never the first thing anyone
            needs.
          */}
          <details className="tech">
            <summary>
              <ChevronRight className="chev" size={15} strokeWidth={2} aria-hidden="true" />
              {copy.techLabel}
            </summary>
            <div className="tech-body">
              {events.map((event, index) => {
                const row = describe(event)
                return (
                  <div className="tech-row" key={`${row.name}-${index}`}>
                    <b>{row.name}</b>
                    <span>
                      {copy.techStages[row.name]}
                      {row.detail.length > 0 && <> — {row.detail}</>}
                    </span>
                    <em>{row.ms} ms</em>
                  </div>
                )
              })}
              {result !== null && (
                <div className="tech-row">
                  <b>generate</b>
                  <span>
                    {copy.techStages.generate} — {result.model}
                  </span>
                  <em>{result.generationMs} ms</em>
                </div>
              )}
            </div>
            <p className="small muted" style={{ marginTop: '.7rem' }}>
              {copy.techNote}
            </p>
          </details>
        </>
      )}

      {result !== null && (
        <div className="verdict" data-refused={result.refused} ref={verdict} tabIndex={-1} role="status" aria-atomic="false">
          <div className="verdict-head">
            {result.refused ? (
              <CircleSlash size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <CircleCheck size={16} strokeWidth={2} aria-hidden="true" />
            )}
            {result.refused ? copy.refusedLabel : copy.answered}
          </div>

          <div className="verdict-body">
            {result.refused ? (
              <p className="muted" style={{ margin: 0, maxWidth: '52ch' }}>
                {copy.refusedBody}
              </p>
            ) : (
              <>
                <p className="answer-text">{result.answer}</p>

                <h2 className="cited-heading">{copy.citedHeading}</h2>
                <p className="small muted">
                  {copy.citedNote}
                </p>
                <ul className="articles">
                  {citedSources.map((source, index) => (
                    <ArticleCard key={source.id} source={source} copy={copy} index={index} />
                  ))}
                </ul>
              </>
            )}

            {otherSources.length > 0 && (
              <details className="others" open={result.refused}>
                <summary>
                  <ChevronRight className="chev" size={15} strokeWidth={2} aria-hidden="true" />
                  {fill(copy.othersHeading, { n: otherSources.length })}
                </summary>
                <ul className="articles">
                  {otherSources.map((source, index) => (
                    <ArticleCard key={source.id} source={source} copy={copy} index={index} />
                  ))}
                </ul>
              </details>
            )}

            <p className="receipt">
              <span>
                {copy.receipt.cost} <b>{decimal(result.costEur.toFixed(4), copy.locale)} €</b>
              </span>
              <span>
                {copy.receipt.latency} <b>{decimal((result.latencyMs / 1000).toFixed(1), copy.locale)} s</b>
              </span>
              <span>
                {copy.receipt.model} <b>{result.model}</b>
              </span>
            </p>
          </div>

          {filter !== undefined && filter.droppedCount > 0 && (
            <div className="callout">
              <Stamp size={20} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p>
                  <strong>{copy.whyHardHeading}</strong>
                </p>
                <p>{fill(copy.whyHard, { dropped: filter.droppedCount, asOf: filter.asOf })}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

/** One retrieved article, set the way a legal extract is set: reference, stamp, then text. */
function ArticleCard({ source, copy, index }: { source: Source; copy: DemoCopy; index: number }) {
  const [open, setOpen] = useState(false)
  /*
   * Long articles are clamped, never cut.
   *
   * The text sent to the browser is the whole article; only its rendered height is limited,
   * and one click restores it. Slicing the string instead is what put "2 mois maximum" on
   * screen under an answer saying four months.
   */
  const long = source.excerpt.length > 620
  return (
    <li className="article" data-cited={source.cited} style={{ '--i': index } as React.CSSProperties}>
      <div className="article-head">
        <span className="article-ref">
          {copy.articleWord} {source.articleId}
        </span>
        <span className="article-src">
          {source.source}
          {source.precedence === 1 ? ` · ${copy.precedenceNote}` : ''}
        </span>
        {source.cited && (
          <span className="badge-cited">
            <CircleCheck size={11} strokeWidth={2.5} aria-hidden="true" />
            {copy.cited}
          </span>
        )}
        <span className="stamp">
          <Stamp size={11} strokeWidth={2.5} aria-hidden="true" />
          {copy.inForce}
        </span>
      </div>
      <p className="article-text" data-clamped={long && !open}>
        {source.excerpt}
      </p>
      {long && (
        <button type="button" className="article-more" onClick={() => setOpen((was) => !was)}>
          <ChevronRight className="chev" size={14} strokeWidth={2} aria-hidden="true" data-open={open} />
          {open ? copy.readLess : copy.readFull}
        </button>
      )}
      {source.truncated && <p className="article-cut">{copy.truncatedNote}</p>}
      <p className="article-foot">
        {source.effectiveFrom !== null && (
          <span>
            {copy.since} {source.effectiveFrom}
          </span>
        )}
        <span className="mono">{source.id}</span>
      </p>
    </li>
  )
}
