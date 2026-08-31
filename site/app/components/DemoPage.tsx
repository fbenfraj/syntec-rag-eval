import { CalendarX2, CircleSlash, Quote } from 'lucide-react'
import Demo from '@/app/components/Demo'
import { Footer, Masthead, Onward } from '@/app/components/Chrome'
import { loadSummary, pct } from '@/lib/results'
import type { DemoPageCopy } from '@/app/copy/types'

const TRUST_ICONS = { source: Quote, date: CalendarX2, refuse: CircleSlash } as const

/**
 * The landing surface, and the only one a visitor is guaranteed to see.
 *
 * It opens on the input. Everything that explains, qualifies or measures the system lives
 * on another page and is linked from the bottom — important, but never between a visitor
 * and the thing they came to try.
 */
export default function DemoPage({ copy }: { copy: DemoPageCopy }) {
  const summary = loadSummary()
  const { best, rungs } = summary
  const locale = copy.locale

  const values: Record<string, string | number> = {
    recall: pct(best.recallAt5, locale),
    superseded: pct(best.supersededRate, locale),
    supersededNoFilter: pct(rungs[4]!.supersededRate, locale),
    refusalAccuracy: pct(best.refusalAccuracy, locale),
    falseRefusal: pct(best.falseRefusalRate, locale),
    gold: summary.goldSetSize,
    corpus: locale === 'fr' ? '3 030' : '3,030',
  }
  const t = (template: string): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))

  /** Copy crossing into the client component is substituted here; run-time tokens survive. */
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
      <Masthead copy={copy.chrome} current="demo" />

      <main>
        <section>
          <div className="shell">
            <h1>{copy.headline}</h1>
            <p className="lede" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              {t(copy.lede)}
            </p>

            <Demo copy={substituted(copy.demo)} examples={copy.examples} />
          </div>
        </section>

        <section style={{ background: 'var(--paper)', borderBlock: '1px solid var(--rule)' }}>
          <div className="shell">
            <h2>{copy.trustHeading}</h2>
            <ul className="steps" style={{ marginTop: '1.25rem' }}>
              {copy.trustPoints.map((point) => {
                const Icon = TRUST_ICONS[point.icon]
                return (
                  <li className="step" key={point.title}>
                    <span className="step-icon">
                      <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="step-title">{point.title}</span>
                    <span className="step-ms" />
                    <div className="step-detail">{t(point.body)}</div>
                  </li>
                )
              })}
            </ul>
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
