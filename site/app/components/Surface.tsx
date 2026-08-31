import Demo, { type DemoCopy } from '@/app/components/Demo'
import { CorrectnessBand, Failures, Ladder, LeaderboardTable, type BandCopy, type LadderCopy, type TableCopy } from '@/app/components/Report'
import { delta, loadSummary, pct, type Locale } from '@/lib/results'

export const REPO = 'https://github.com/fbenfraj/syntec-rag-eval'

export interface SurfaceCopy {
  /** Sets the `lang` of this document's subtree and the decimal separator in every number. */
  locale: Locale
  otherHref: string
  otherLabel: string

  headline: string
  /** The lede, split so the one display-sized number can sit inside the sentence. */
  ledeBefore: string
  ledeAfter: string

  colophon: { label: string; value: string }[]

  demoHeading: string
  demoIntro: string
  demo: DemoCopy
  examples: string[]

  ladderHeading: string
  ladderIntro: string
  ladder: LadderCopy
  table: TableCopy
  hybridNote: string
  filterNote: string

  bandHeading: string
  bandIntro: string
  bandWhy: string
  band: BandCopy

  failureHeading: string
  failureIntro: string
  failureKinds: Record<string, string>
  failureNote: string

  methodHeading: string
  methodBody: string[]

  links: { label: string; href: string }[]
  licence: string
}

/**
 * Both translations render this one surface. The numbers are read from the committed
 * summary and substituted into the copy, so a re-run of the eval cannot leave a sentence
 * asserting a figure the tables no longer show.
 */
export default function Surface({ copy }: { copy: SurfaceCopy }) {
  const summary = loadSummary()
  const { best, rungs } = summary
  const noFilter = rungs[4]!
  const hybrid = delta(rungs[2]!.recallAt5, rungs[1]!.recallAt5, copy.locale)

  const locale = copy.locale
  const values: Record<string, string | number> = {
    recall: pct(best.recallAt5, locale),
    superseded: pct(best.supersededRate, locale),
    supersededNoFilter: pct(noFilter.supersededRate, locale),
    wrongBoth: pct(best.answerWrongUnderBoth, locale),
    rubricDependent: pct(best.answerRubricDependent, locale),
    falseRefusal: pct(best.falseRefusalRate, locale),
    refusalAccuracy: pct(best.refusalAccuracy, locale),
    citations: pct(best.citationCorrectness, locale),
    gold: summary.goldSetSize,
    failures: summary.totalFailures,
    model: summary.model,
    judge: summary.judgeModel,
    cost: locale === 'fr' ? best.costEurPerQuery.toFixed(4).replace('.', ',') : best.costEurPerQuery.toFixed(4),
    p95: best.latencyP95Ms,
    hybrid: hybrid.replace('−', ''),
  }

  const t = (template: string): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))

  /**
   * Substitution plus the two marks the copy actually needs: `*emphasis*` and `` `code` ``.
   * Not a markdown renderer — a translator writing anything else should see it come out as
   * itself rather than silently disappear.
   */
  const rich = (template: string) =>
    t(template)
      .split(/(\*[^*]+\*|`[^`]+`)/g)
      .map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={index}>{part.slice(1, -1)}</em>
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return <code key={index}>{part.slice(1, -1)}</code>
        }
        return part
      })

  /**
   * Copy handed to a child component is substituted here, because the child has no access
   * to the summary. Tokens the demo fills from a live run (`{c}`, `{kept}`, `{asOf}`…) are
   * left alone, because `t` returns an unknown token unchanged.
   */
  const substituted = <T,>(value: T): T => {
    if (typeof value === 'string') return t(value) as T
    if (Array.isArray(value)) return value.map(substituted) as T
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, substituted(inner)])) as T
    }
    return value
  }

  return (
    <div lang={copy.locale}>
      <header className="topbar">
        <div className="shell">
          <span className="mono label wordmark">syntec-rag-eval</span>
          <nav>
            <a className="label" href={copy.otherHref}>
              {copy.otherLabel}
            </a>
            <a className="label" href={REPO}>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="opening">
          <div className="shell">
            <h1>{copy.headline}</h1>
            <div className="opening-grid">
              <p className="lede">
                {t(copy.ledeBefore)}
                <span className="figure figure-seal">{values.recall}</span>
                {t(copy.ledeAfter)}
              </p>

              <dl className="colophon small">
                {copy.colophon.map((entry) => (
                  <div key={entry.label}>
                    <dt className="label">{entry.label}</dt>
                    <dd>{t(entry.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="instrument" id="demo">
          <div className="shell">
            <div className="section-head">
              <h2>{copy.demoHeading}</h2>
              <p>{t(copy.demoIntro)}</p>
            </div>
            <Demo copy={substituted(copy.demo)} examples={copy.examples} />
          </div>
        </section>

        <section id="ladder">
          <div className="shell">
            <div className="section-head">
              <h2>{copy.ladderHeading}</h2>
              <p>{t(copy.ladderIntro)}</p>
            </div>

            <Ladder rungs={rungs} best={best} copy={substituted(copy.ladder)} locale={locale} />

            <p className="note" style={{ marginTop: '2rem' }}>
              {rich(copy.hybridNote)}
            </p>
            <p className="note">{rich(copy.filterNote)}</p>

            <LeaderboardTable rungs={rungs} best={best} copy={substituted(copy.table)} locale={locale} />
          </div>
        </section>

        <section id="correctness">
          <div className="shell">
            <div className="section-head">
              <h2>{copy.bandHeading}</h2>
              <p>{t(copy.bandIntro)}</p>
            </div>

            <CorrectnessBand best={best} copy={substituted(copy.band)} locale={locale} />

            <p style={{ marginTop: '2rem' }}>{rich(copy.bandWhy)}</p>
          </div>
        </section>

        <section id="failures">
          <div className="shell">
            <div className="section-head">
              <h2>{copy.failureHeading}</h2>
              <p>{t(copy.failureIntro)}</p>
            </div>

            <Failures failures={summary.failures} copy={{ kinds: substituted(copy.failureKinds) }} locale={locale} />

            <p className="note" style={{ marginTop: '2rem' }}>
              {rich(copy.failureNote)}
            </p>
          </div>
        </section>

        <section id="method">
          <div className="shell">
            <div className="section-head">
              <h2>{copy.methodHeading}</h2>
            </div>
            {copy.methodBody.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{rich(paragraph)}</p>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="shell">
            <div className="footer-links">
              {copy.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <p>{t(copy.licence)}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
