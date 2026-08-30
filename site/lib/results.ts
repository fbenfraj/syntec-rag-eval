import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Read at build time from the committed results, so the page cannot drift from the data. */
const resultsDir = join(process.cwd(), '..', 'results')

export interface RungSummary {
  name: string
  adds: string
  recallAt5: number
  mrr: number
  answerCorrectness: number
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

export const pct = (value: number | null): string => (value === null ? 'n/a' : `${(value * 100).toFixed(1)} %`)

export function delta(current: number, previous: number): string {
  const difference = (current - previous) * 100
  if (Math.abs(difference) < 0.05) return '='
  return `${difference > 0 ? '+' : '−'}${Math.abs(difference).toFixed(1)}`
}
