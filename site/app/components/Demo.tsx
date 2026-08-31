'use client'

import { useState } from 'react'

interface Source {
  id: string
  articleId: string
  source: string
  cited: boolean
  excerpt: string
}

interface Answer {
  answer: string | null
  refused: boolean
  citations: string[]
  sources: Source[]
  costEur: number
  latencyMs: number
}

export interface DemoCopy {
  heading: string
  intro: string
  placeholder: string
  submit: string
  running: string
  examples: string
  refused: string
  sourcesShown: string
  cited: string
  notCited: string
  /**
   * A template rather than a function: props crossing into a client component must be
   * serialisable, and a formatter is not. `{cost}` and `{seconds}` are substituted here.
   */
  metaTemplate: string
  errors: Record<string, string>
}

export default function Demo({ copy, examples }: { copy: DemoCopy; examples: string[] }) {
  const [question, setQuestion] = useState('')
  const [state, setState] = useState<'idle' | 'loading'>('idle')
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ask = async (asked: string) => {
    if (asked.trim().length < 8 || state === 'loading') return
    setState('loading')
    setError(null)
    setAnswer(null)
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: asked }),
      })
      const data = (await response.json()) as Answer & { error?: string }
      if (!response.ok) {
        setError(copy.errors[data.error ?? 'demo-unavailable'] ?? copy.errors['demo-unavailable']!)
        return
      }
      setAnswer(data)
    } catch {
      setError(copy.errors['demo-unavailable']!)
    } finally {
      setState('idle')
    }
  }

  return (
    <section className="demo">
      <h2>{copy.heading}</h2>
      <p>{copy.intro}</p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void ask(question)
        }}
      >
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={copy.placeholder}
          maxLength={300}
          rows={2}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              void ask(question)
            }
          }}
        />
        <button type="submit" disabled={state === 'loading' || question.trim().length < 8}>
          {state === 'loading' ? copy.running : copy.submit}
        </button>
      </form>

      <p className="small muted">
        {copy.examples}{' '}
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            className="example"
            onClick={() => {
              setQuestion(example)
              void ask(example)
            }}
          >
            {example}
          </button>
        ))}
      </p>

      {error !== null && <p className="note">{error}</p>}

      {answer !== null && (
        <div className="result">
          <p className={answer.refused ? 'muted' : 'answerText'}>
            {answer.refused ? copy.refused : answer.answer}
          </p>
          <p className="small muted">
            {copy.metaTemplate
              .replace('{cost}', answer.costEur.toFixed(4))
              .replace('{seconds}', (answer.latencyMs / 1000).toFixed(1))}
          </p>

          <p className="small muted">{copy.sourcesShown}</p>
          <ol className="sources">
            {answer.sources.map((source) => (
              <li key={source.id} className={source.cited ? 'cited' : undefined}>
                <div className="small">
                  <code>{source.id}</code>{' '}
                  <span className="muted">
                    ({source.source} {source.articleId}) — {source.cited ? copy.cited : copy.notCited}
                  </span>
                </div>
                <p className="small excerpt">{source.excerpt}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
