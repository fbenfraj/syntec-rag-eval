import { Ruler } from 'lucide-react'
import { Footer, Masthead, Onward } from '@/app/components/Chrome'
import { CorrectnessBand, Ladder, LeaderboardTable } from '@/app/components/Report'
import { delta, loadSummary, pct } from '@/lib/results'
import type { MethodPageCopy } from '@/app/copy/types'

/** How the numbers were produced. The page a sceptical reader opens second. */
export default function MethodPage({ copy }: { copy: MethodPageCopy }) {
  const summary = loadSummary()
  const { best, rungs } = summary
  const locale = copy.locale

  const values: Record<string, string | number> = {
    recall: pct(best.recallAt5, locale),
    superseded: pct(best.supersededRate, locale),
    supersededNoFilter: pct(rungs[4]!.supersededRate, locale),
    wrongBoth: pct(best.answerWrongUnderBoth, locale),
    rubricDependent: pct(best.answerRubricDependent, locale),
    falseRefusal: pct(best.falseRefusalRate, locale),
    refusalAccuracy: pct(best.refusalAccuracy, locale),
    gold: summary.goldSetSize,
    model: summary.model,
    judge: summary.judgeModel,
    hybrid: delta(rungs[2]!.recallAt5, rungs[1]!.recallAt5, locale).replace('−', ''),
  }
  const t = (template: string): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))

  const rich = (template: string) =>
    t(template)
      .split(/(\*[^*]+\*|`[^`]+`)/g)
      .map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={index}>{part.slice(1, -1)}</code>
        return part
      })

  const substituted = <T,>(value: T): T => {
    if (typeof value === 'string') return t(value) as T
    if (Array.isArray(value)) return value.map(substituted) as T
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, substituted(inner)])) as T
    }
    return value
  }

  return (
    <div lang={locale}>
      <Masthead copy={copy.chrome} current="method" />

      <main>
        <section>
          <div className="shell">
            <h1>{copy.headline}</h1>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {t(copy.lede)}
            </p>
          </div>
        </section>

        <section style={{ background: 'var(--paper)', borderBlock: '1px solid var(--rule)' }}>
          <div className="shell">
            <h2>{copy.ladderHeading}</h2>
            <p className="muted">{t(copy.ladderIntro)}</p>

            <Ladder rungs={rungs} best={best} copy={substituted(copy.ladder)} locale={locale} />

            <div className="callout">
              <Ruler size={20} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p>{rich(copy.hybridNote)}</p>
              </div>
            </div>
            <div className="callout" data-tone="alert">
              <Ruler size={20} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p>{rich(copy.filterNote)}</p>
              </div>
            </div>

            <LeaderboardTable rungs={rungs} best={best} copy={substituted(copy.table)} locale={locale} />
          </div>
        </section>

        <section>
          <div className="shell">
            <h2>{copy.bandHeading}</h2>
            <p className="muted">{t(copy.bandIntro)}</p>

            <CorrectnessBand best={best} copy={substituted(copy.band)} locale={locale} />

            <p style={{ marginTop: '1.75rem' }}>{rich(copy.bandWhy)}</p>
          </div>
        </section>

        <section style={{ background: 'var(--paper)', borderBlock: '1px solid var(--rule)' }}>
          <div className="shell">
            <h2>{copy.methodHeading}</h2>
            {copy.methodBody.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{rich(paragraph)}</p>
            ))}
          </div>
        </section>

        <section>
          <div className="shell">
            <h2>{copy.onwardHeading}</h2>
            <Onward items={copy.onward} />
          </div>
        </section>
      </main>

      <Footer copy={copy.chrome} />
    </div>
  )
}
