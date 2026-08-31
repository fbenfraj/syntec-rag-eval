import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Read at build time from a copy inside the app, so the page cannot drift from the data and
 * the site stays deployable on its own. `pnpm sync` refreshes it from `../results`; the
 * copy is committed so a deployment never depends on files outside this directory.
 */
const resultsDir = join(process.cwd(), 'data')

export interface RungSummary {
  name: string
  adds: string
  recallAt5: number
  mrr: number
  answerCorrectness: number
  answerCorrectnessLenient: number | null
  answerWrongUnderBoth: number
  answerRubricDependent: number
  citationCorrectness: number
  refusalAccuracy: number | null
  falseRefusalRate: number | null
  supersededRate: number
  costEurPerQuery: number
  latencyP95Ms: number
}

export interface Summary {
  generatedFrom: number
  goldSetSize: number
  model: string
  judgeModel: string
  startedAt: string
  rungs: RungSummary[]
  best: RungSummary
  baseline: RungSummary
  failures: { kind: string; n: number; share: number }[]
  totalFailures: number
}

export function loadSummary(): Summary {
  return JSON.parse(readFileSync(join(resultsDir, 'summary.json'), 'utf8')) as Summary
}

/**
 * French writes 90,8 % and English writes 90.8 %. The separator is passed down rather than
 * read from a global, because both translations are rendered by the same process and a
 * module-level locale would make one of them wrong.
 */
export type Locale = 'fr' | 'en'

const decimal = (value: string, locale: Locale): string =>
  locale === 'fr' ? value.replace('.', ',') : value

export const pct = (value: number | null, locale: Locale = 'en'): string =>
  value === null ? 'n/a' : `${decimal((value * 100).toFixed(1), locale)} %`

/** Correctness is a range because two rubrics disagree and nobody qualified has adjudicated. */
export function range(strict: number, lenient: number | null, locale: Locale = 'en'): string {
  return lenient === null ? pct(strict, locale) : `${pct(strict, locale)} – ${pct(lenient, locale)}`
}

export function delta(current: number, previous: number, locale: Locale = 'en'): string {
  const difference = (current - previous) * 100
  if (Math.abs(difference) < 0.05) return '='
  return `${difference > 0 ? '+' : '−'}${decimal(Math.abs(difference).toFixed(1), locale)}`
}
