import { CircleX, TriangleAlert } from 'lucide-react'
import { Footer, Masthead, Onward } from '@/app/components/Chrome'
import { Failures } from '@/app/components/Report'
import { loadSummary, pct } from '@/lib/results'
import type { LimitsPageCopy } from '@/app/copy/types'

/**
 * What it gets wrong.
 *
 * Its own page rather than a paragraph at the bottom of another one. A system that answers
 * questions about employment law and cannot say where it fails is not a system anyone
 * should put in front of an employee, and burying that at the end of a long scroll is the
 * same as not publishing it.
 */
export default function LimitsPage({ copy }: { copy: LimitsPageCopy }) {
  const summary = loadSummary()
  const { best } = summary
  const locale = copy.locale

  const values: Record<string, string | number> = {
    gold: summary.goldSetSize,
    failures: summary.totalFailures,
    wrongBoth: pct(best.answerWrongUnderBoth, locale),
    rubricDependent: pct(best.answerRubricDependent, locale),
    falseRefusal: pct(best.falseRefusalRate, locale),
    refusalAccuracy: pct(best.refusalAccuracy, locale),
    judge: summary.judgeModel,
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

  const kinds = Object.fromEntries(
    Object.entries(copy.failureKinds).map(([key, value]) => [key, t(value)]),
  )

  return (
    <div lang={locale}>
      <Masthead copy={copy.chrome} current="limits" />

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
            <h2>{copy.notForHeading}</h2>
            <ul className="steps" style={{ marginTop: '1.25rem' }}>
              {copy.notFor.map((item) => (
                <li className="step" data-tone="alert" key={item.slice(0, 24)}>
                  <span className="step-icon">
                    <CircleX size={17} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="step-title" style={{ fontWeight: 400 }}>
                    {t(item)}
                  </span>
                  <span className="step-ms" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="shell">
            <h2>{copy.taxonomyHeading}</h2>
            <p className="muted">{t(copy.taxonomyIntro)}</p>

            <Failures failures={summary.failures} copy={{ kinds }} locale={locale} />

            <div className="callout">
              <TriangleAlert size={20} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p>{rich(copy.taxonomyNote)}</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--paper)', borderBlock: '1px solid var(--rule)' }}>
          <div className="shell">
            <h2>{copy.judgeHeading}</h2>
            {copy.judgeBody.map((paragraph) => (
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
