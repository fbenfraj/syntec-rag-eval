import { BookOpen, ExternalLink, Info, MessageSquareText, Ruler, TriangleAlert } from 'lucide-react'
import { FR, GB } from 'country-flag-icons/react/3x2'
import { Wordmark } from '@/app/components/Brand'
import type { ChromeCopy } from '@/app/copy/types'

/** Icons are named in the copy so a translator never has to touch a component. */
const NAV_ICONS = {
  demo: MessageSquareText,
  method: Ruler,
  limits: TriangleAlert,
} as const

export type NavKey = keyof typeof NAV_ICONS

export function Masthead({ copy, current }: { copy: ChromeCopy; current: NavKey }) {
  return (
    <header>
      <div className="masthead">
        <div className="shell masthead-inner">
          <a className="brand" href={copy.home.href}>
            <Wordmark subtitle={copy.home.subtitle} />
          </a>
          <nav aria-label={copy.navLabel}>
            {copy.nav.map((item) => {
              const Icon = NAV_ICONS[item.key]
              return (
                <a
                  key={item.key}
                  className="navlink"
                  href={item.href}
                  aria-current={item.key === current ? 'page' : undefined}
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </a>
              )
            })}
            {/*
              Language switch. The flag shows the language it leads TO, matching `lang`
              and the accessible name: on the French page, a British flag going to English.
              A flag alone does not tell a screen reader which language it means, so it is
              aria-hidden and the name comes from `ariaLabel`. Same pattern as frajtech.com,
              so the two sites behave alike.
            */}
            <a
              className="navlink navlink-flag"
              href={copy.otherLocale.href}
              hrefLang={copy.otherLocale.lang}
              lang={copy.otherLocale.lang}
              aria-label={copy.otherLocale.ariaLabel}
            >
              {copy.otherLocale.lang === 'en' ? (
                <GB aria-hidden="true" className="flag" />
              ) : (
                <FR aria-hidden="true" className="flag" />
              )}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export function Footer({ copy }: { copy: ChromeCopy }) {
  return (
    <>
      <footer className="footer">
        <div className="shell footer-inner">
          <div>
            <a className="brand" href={copy.home.href} style={{ marginBottom: '.75rem' }}>
              <Wordmark subtitle={copy.home.subtitle} />
            </a>
            <p>{copy.footerBlurb}</p>
          </div>

          {copy.footerColumns.map((column) => (
            <div key={column.heading}>
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      {link.external === true && (
                        <ExternalLink
                          size={13}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          style={{ verticalAlign: '-2px', marginRight: '.35rem' }}
                        />
                      )}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

      {/*
        Permanent, on every page. The surface deliberately reads as an official document,
        so the one thing it must never let a visitor conclude is that it is one.
      */}
      <div className="disclaimer">
        <div className="shell" style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start' }}>
          <Info size={15} strokeWidth={1.75} aria-hidden="true" style={{ marginTop: '.15rem', flex: 'none' }} />
          <p>
            {copy.disclaimer}{' '}
            {/* The sentence above sends the reader to Légifrance; until now nothing took
                them there. Article-level deep links would have to be guessed, since the
                corpus keeps article numbers rather than Légifrance identifiers, and a
                guessed citation link is worse than none. */}
            <a href={copy.disclaimerLink.href} target="_blank" rel="noopener noreferrer">
              {copy.disclaimerLink.label}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

/** The two cards that carry a reader from the demo into the measurement, and back. */
export function Onward({ items }: { items: { href: string; icon: NavKey | 'source'; title: string; body: string }[] }) {
  const ICONS = { ...NAV_ICONS, source: BookOpen }
  return (
    <div className="onward">
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <a className="onward-card" key={item.href} href={item.href}>
            <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
