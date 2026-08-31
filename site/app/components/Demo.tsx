'use client'

import { useEffect, useRef, useState } from 'react'

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

/**
 * Every string the component renders, supplied by the page.
 *
 * Templates rather than functions: props crossing into a client component must be
 * serialisable, so substitution happens here on `{name}` tokens.
 */
export interface DemoCopy {
  placeholder: string
  submit: string
  running: string
  examplesLabel: string
  stageNames: Record<StageName, string>
  stageDetails: Record<StageName, string>
  droppedNote: string
  noDrop: string
  refusalTitle: string
  refusalBody: string
  sourcesTitle: string
  sourcesNote: string
  cited: string
  notCited: string
  inForce: string
  since: string
  conventionWins: string
  articleWord: string
  readout: { cost: string; latency: string; generation: string; model: string }
  errors: Record<string, string>
}

export type StageName =
  | 'rewrite' | 'dense' | 'lexical' | 'fuse' | 'filter' | 'precedence' | 'rerank' | 'generate'

/* --- rendered stage ------------------------------------------------------ */

interface Stage {
  name: StageName
  ms: number | null
  detail: string
  queries?: string[]
  dropped?: DroppedHit[]
}

const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))

/** One rendered row per pipeline stage, built from the event that stage emitted. */
function toStage(event: RetrievalEvent, copy: DemoCopy): Stage {
  const detail = copy.stageDetails[event.stage]
  switch (event.stage) {
    case 'rewrite':
      return { name: 'rewrite', ms: event.ms, detail: fill(detail, { n: event.queries.length }), queries: event.queries }
    case 'dense':
    case 'lexical':
      return { name: event.stage, ms: event.ms, detail: fill(detail, { c: event.candidates, q: event.queries }) }
    case 'fuse':
      return { name: 'fuse', ms: event.ms, detail: fill(detail, { c: event.candidates }) }
    case 'filter':
      return {
        name: 'filter',
        ms: event.ms,
        detail:
          event.droppedCount === 0
            ? fill(copy.noDrop, { kept: event.kept, asOf: event.asOf })
            : fill(detail, { kept: event.kept, dropped: event.droppedCount, asOf: event.asOf }),
        dropped: event.dropped,
      }
    case 'precedence':
      return { name: 'precedence', ms: event.ms, detail: fill(detail, { n: event.promoted }) }
    case 'rerank':
      return { name: 'rerank', ms: event.ms, detail: fill(detail, { from: event.from, kept: event.kept }) }
  }
}

/* --- component ----------------------------------------------------------- */

const MAX_CHARS = 300

export default function Demo({ copy, examples }: { copy: DemoCopy; examples: string[] }) {
  const [question, setQuestion] = useState('')
  const [running, setRunning] = useState(false)
  const [stages, setStages] = useState<Stage[]>([])
  const [result, setResult] = useState<AnswerPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => () => abort.current?.abort(), [])

  const ask = async (asked: string) => {
    const trimmed = asked.trim()
    if (trimmed.length < 8 || running) return

    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    setRunning(true)
    setError(null)
    setResult(null)
    setStages([])

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      })

      // A refusal decided before any work started arrives as a plain JSON body: the cap and
      // the rate limit are answers, not failures, and they cost nothing to report.
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
          if (frame.type === 'stage') {
            setStages((current) => [...current, toStage(frame.event, copy)])
          } else if (frame.type === 'generating') {
            setStages((current) => [...current, { name: 'generate', ms: null, detail: copy.stageDetails.generate }])
          } else if (frame.type === 'answer') {
            const payload = frame.payload
            setStages((current) =>
              current.map((stage) =>
                stage.name === 'generate'
                  ? { ...stage, ms: payload.generationMs, detail: fill(copy.stageDetails.generate, { k: payload.sources.length }) }
                  : stage,
              ),
            )
            setResult(payload)
          } else if (frame.type === 'error') {
            setError(copy.errors[frame.error] ?? copy.errors['demo-unavailable']!)
          }
        }
      }
    } catch (failure) {
      if ((failure as Error).name !== 'AbortError') setError(copy.errors['demo-unavailable']!)
    } finally {
      setRunning(false)
    }
  }

  const tooShort = question.trim().length < 8

  return (
    <>
      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault()
          void ask(question)
        }}
      >
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
        <div className="ask-row">
          <button type="submit" className="button" disabled={running || tooShort}>
            {running ? copy.running : copy.submit}
          </button>
          <span className="counter" data-near={question.length > MAX_CHARS - 40}>
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
            {example}
          </button>
        ))}
      </div>

      {error !== null && (
        <p className="note" style={{ marginTop: '1.75rem' }} role="status">
          {error}
        </p>
      )}

      {stages.length > 0 && (
        <div className="trace" aria-live="polite">
          {stages.map((stage, index) => (
            <div
              className="stage"
              key={`${stage.name}-${index}`}
              data-live={running && index === stages.length - 1}
            >
              <span className="node" aria-hidden="true" />
              <span className="stage-name">{copy.stageNames[stage.name]}</span>
              <div className="stage-detail">
                {stage.detail}
                {stage.queries !== undefined && (
                  <ul className="queries">
                    {stage.queries.slice(1).map((query) => (
                      <li key={query}>{query}</li>
                    ))}
                  </ul>
                )}
                {stage.dropped !== undefined && stage.dropped.length > 0 && (
                  <>
                    <ul className="dropped">
                      {stage.dropped.map((hit, position) => (
                        <li key={hit.id} style={{ '--i': position } as React.CSSProperties}>
                          {hit.source} {hit.articleId}
                          <span>
                            {' '}
                            #{hit.rank}
                            {hit.effectiveTo !== null ? ` · fin ${hit.effectiveTo}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="label" style={{ marginTop: '.35rem' }}>
                      {copy.droppedNote}
                    </p>
                  </>
                )}
              </div>
              <span className="stage-ms">{stage.ms === null ? '…' : `${stage.ms} ms`}</span>
            </div>
          ))}
        </div>
      )}

      {result !== null && (
        <div className="answer">
          {result.refused ? (
            <div className="refusal">
              <strong className="refusal-token">{copy.refusalTitle}</strong>
              <p className="muted" style={{ margin: 0 }}>
                {copy.refusalBody}
              </p>
            </div>
          ) : (
            <p className="answer-text">{result.answer}</p>
          )}

          <p className="readout">
            <span>
              {copy.readout.cost} <b>{result.costEur.toFixed(4)} €</b>
            </span>
            <span>
              {copy.readout.latency} <b>{(result.latencyMs / 1000).toFixed(2)} s</b>
            </span>
            <span>
              {copy.readout.generation} <b>{(result.generationMs / 1000).toFixed(2)} s</b>
            </span>
            <span>
              {copy.readout.model} <b>{result.model}</b>
            </span>
          </p>

          <h3>{copy.sourcesTitle}</h3>
          <p className="small muted" style={{ maxWidth: '52ch' }}>
            {copy.sourcesNote}
          </p>

          <ul className="slips">
            {result.sources.map((source, index) => (
              <li
                className="slip"
                key={source.id}
                data-cited={source.cited}
                style={{ '--i': index } as React.CSSProperties}
              >
                <div className="slip-head">
                  <span className="slip-where">
                    {source.source} · {copy.articleWord} {source.articleId}
                    {source.precedence === 1 ? ` · ${copy.conventionWins}` : ''}
                  </span>
                  {/* The token the answer cites, so a reader can match the two by eye. */}
                  <span className="slip-id">{source.id}</span>
                  <span className="slip-flag" data-cited={source.cited}>
                    {source.cited ? copy.cited : copy.notCited}
                  </span>
                </div>
                <p className="slip-body">{source.excerpt}</p>
                <p className="slip-dates">
                  {copy.inForce}
                  {source.effectiveFrom !== null ? ` · ${copy.since} ${source.effectiveFrom}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
