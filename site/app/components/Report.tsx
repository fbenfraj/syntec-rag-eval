import type { Locale, RungSummary, Summary } from '@/lib/results'
import { delta, pct, range } from '@/lib/results'

/* --- ladder -------------------------------------------------------------- */

export interface LadderCopy {
  recall: string
  repealed: string
  adds: Record<string, string>
}

/**
 * The ablation drawn as two series on the same rung: what the configuration retrieves, and
 * what it retrieves that no longer applies.
 *
 * Both bars are scaled over the full 0–100 % range. A tighter domain would make the 12-point
 * spread between rungs look like a chasm, which is the chart equivalent of the single
 * accuracy number this project refuses to publish.
 */
export function Ladder({
  rungs,
  best,
  copy,
  locale,
}: {
  rungs: RungSummary[]
  best: RungSummary
  copy: LadderCopy
  locale: Locale
}) {
  return (
    <>
      <p className="legend label">
        <span>
          <i style={{ background: 'var(--blue)' }} />
          {copy.recall}
        </span>
        <span>
          <i style={{ background: 'var(--red)' }} />
          {copy.repealed}
        </span>
      </p>

      <div className="ladder">
        {rungs.map((rung, index) => {
          const previous = index === 0 ? null : rungs[index - 1]!
          const change = previous === null ? null : delta(rung.recallAt5, previous.recallAt5, locale)
          return (
            <div className="rung" key={rung.name} data-best={rung.name === best.name}>
              <div>
                <div className="rung-name">{rung.name}</div>
                <div className="rung-adds">{copy.adds[rung.name] ?? rung.adds}</div>
              </div>

              <div className="bars">
                <div className="bar">
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      data-series="recall"
                      style={{ width: `${rung.recallAt5 * 100}%` }}
                    />
                  </span>
                  <span className="bar-value">
                    <span>{pct(rung.recallAt5, locale)}</span>
                    {change !== null && change !== '=' && (
                      <span className="delta" data-dir={change.startsWith('+') ? 'up' : 'down'}>
                        {change}
                      </span>
                    )}
                  </span>
                </div>

                <div className="bar">
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      data-series="repealed"
                      style={{ width: `${rung.supersededRate * 100}%` }}
                    />
                  </span>
                  <span className="bar-value">
                    <span>{pct(rung.supersededRate, locale)}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* --- leaderboard table --------------------------------------------------- */

export interface TableCopy {
  headers: [string, string, string, string, string, string, string]
  adds: Record<string, string>
}

export function LeaderboardTable({
  rungs,
  best,
  copy,
  locale,
}: {
  rungs: RungSummary[]
  best: RungSummary
  copy: TableCopy
  locale: Locale
}) {
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            {copy.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rungs.map((rung, index) => {
            const previous = index === 0 ? null : rungs[index - 1]!
            const change = previous === null ? null : delta(rung.recallAt5, previous.recallAt5, locale)
            return (
              <tr key={rung.name} data-best={rung.name === best.name}>
                <td>{rung.name}</td>
                <td>{copy.adds[rung.name] ?? rung.adds}</td>
                <td className="num">
                  {pct(rung.recallAt5, locale)}{' '}
                  {change !== null && change !== '=' && (
                    <span className={change.startsWith('+') ? 'up' : 'down'}>({change})</span>
                  )}
                </td>
                <td className="num">{range(rung.answerCorrectness, rung.answerCorrectnessLenient, locale)}</td>
                <td className="num">{pct(rung.citationCorrectness, locale)}</td>
                <td className="num">{pct(rung.supersededRate, locale)}</td>
                <td className="num">{rung.costEurPerQuery.toFixed(4)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* --- correctness band ---------------------------------------------------- */

export interface BandCopy {
  wrong: string
  wrongNote: string
  dependent: string
  dependentNote: string
  correct: string
  correctNote: string
  caption: string
}

/**
 * The published correctness range, drawn as one bar rather than two numbers.
 *
 * The solid block is what is wrong under a strict *and* a lenient rubric — the part of the
 * result that does not depend on whose reading you accept. The hatched block is where the
 * two rubrics disagree, and hatching is the point: it is the region nobody qualified has
 * adjudicated.
 */
export function CorrectnessBand({ best, copy, locale }: { best: RungSummary; copy: BandCopy; locale: Locale }) {
  const wrong = best.answerWrongUnderBoth
  const dependent = best.answerRubricDependent
  const correct = Math.max(0, 1 - wrong - dependent)

  return (
    <div className="band">
      <div
        className="band-track"
        role="img"
        aria-label={`${copy.wrong} ${pct(wrong, locale)}, ${copy.dependent} ${pct(dependent, locale)}, ${copy.correct} ${pct(correct, locale)}`}
      >
        <span className="band-part" data-part="wrong" style={{ width: `${wrong * 100}%` }} />
        <span className="band-part" data-part="dependent" style={{ width: `${dependent * 100}%` }} />
        <span className="band-part" data-part="correct" style={{ width: `${correct * 100}%` }} />
      </div>

      <div className="band-key">
        <div>
          <i style={{ background: 'var(--red)' }} />
          <b>{pct(wrong, locale)}</b>
          <span>
            <strong>{copy.wrong}</strong> — {copy.wrongNote}
          </span>
        </div>
        <div>
          <i
            style={{
              background:
                'repeating-linear-gradient(-45deg, #b9c1de 0 4px, var(--paper-3) 4px 8px)',
              border: '1px solid var(--rule-strong)',
            }}
          />
          <b>{pct(dependent, locale)}</b>
          <span>
            <strong>{copy.dependent}</strong> — {copy.dependentNote}
          </span>
        </div>
        <div>
          <i style={{ background: '#4c8f70' }} />
          <b>{pct(correct, locale)}</b>
          <span>
            <strong>{copy.correct}</strong> — {copy.correctNote}
          </span>
        </div>
      </div>

      <p className="label" style={{ marginTop: '1rem' }}>
        {copy.caption}
      </p>
    </div>
  )
}

/* --- failure taxonomy ---------------------------------------------------- */

/** Cause, not severity: two failures of the same size can need entirely different fixes. */
const KIND_COLOUR: Record<string, string> = {
  'rubric-dependent': '#b9c1de',
  'false-refusal': 'var(--blue-2)',
  'generation-miss': 'var(--red)',
  'retrieval-miss': '#7a4a12',
  'citation-miss': 'var(--ink-3)',
}

export function Failures({
  failures,
  copy,
  locale,
}: {
  failures: Summary['failures']
  copy: { kinds: Record<string, string> }
  locale: Locale
}) {
  return (
    <>
      <div className="stack" role="presentation">
        {failures.map((failure) => (
          <span
            key={failure.kind}
            style={{
              width: `${(failure.n / failures.reduce((sum, f) => sum + f.n, 0)) * 100}%`,
              background: KIND_COLOUR[failure.kind] ?? 'var(--ink-3)',
            }}
          />
        ))}
      </div>

      <ul className="taxonomy">
        {failures.map((failure) => (
          <li key={failure.kind}>
            <i style={{ background: KIND_COLOUR[failure.kind] ?? 'var(--ink-3)' }} />
            <b>{failure.kind}</b>
            <span>{copy.kinds[failure.kind]}</span>
            <em>
              {failure.n} · {pct(failure.share, locale)}
            </em>
          </li>
        ))}
      </ul>
    </>
  )
}
