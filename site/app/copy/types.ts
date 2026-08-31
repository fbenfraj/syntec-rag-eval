import type { Locale } from '@/lib/results'
import type { DemoCopy } from '@/app/components/Demo'
import type { NavKey } from '@/app/components/Chrome'

export interface ChromeCopy {
  home: { href: string; subtitle: string }
  navLabel: string
  nav: { key: NavKey; href: string; label: string }[]
  otherLocale: { href: string; label: string; lang: string; ariaLabel: string }
  footerBlurb: string
  footerColumns: { heading: string; links: { href: string; label: string; external?: boolean }[] }[]
  disclaimer: string
}

export interface OnwardItem {
  href: string
  icon: NavKey | 'source'
  title: string
  body: string
}

/** The demo page: the only page a visitor is guaranteed to see. */
export interface DemoPageCopy {
  locale: Locale
  chrome: ChromeCopy
  title: string
  metaDescription: string
  headline: string
  lede: string
  demo: DemoCopy
  examples: string[]
  trustHeading: string
  trustPoints: { icon: 'source' | 'date' | 'refuse'; title: string; body: string }[]
  onwardHeading: string
  onward: OnwardItem[]
}

export interface MethodPageCopy {
  locale: Locale
  chrome: ChromeCopy
  title: string
  metaDescription: string
  headline: string
  lede: string
  ladderHeading: string
  ladderIntro: string
  ladder: { recall: string; repealed: string; adds: Record<string, string> }
  table: { headers: [string, string, string, string, string, string, string]; adds: Record<string, string> }
  hybridNote: string
  filterNote: string
  bandHeading: string
  bandIntro: string
  band: {
    wrong: string
    wrongNote: string
    dependent: string
    dependentNote: string
    correct: string
    correctNote: string
    caption: string
  }
  bandWhy: string
  methodHeading: string
  methodBody: string[]
  onwardHeading: string
  onward: OnwardItem[]
}

export interface LimitsPageCopy {
  locale: Locale
  chrome: ChromeCopy
  title: string
  metaDescription: string
  headline: string
  lede: string
  taxonomyHeading: string
  taxonomyIntro: string
  failureKinds: Record<string, string>
  taxonomyNote: string
  notForHeading: string
  notFor: string[]
  judgeHeading: string
  judgeBody: string[]
  onwardHeading: string
  onward: OnwardItem[]
}
