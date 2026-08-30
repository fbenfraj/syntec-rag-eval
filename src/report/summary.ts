import { LADDER } from '../retrieval/configs.js'
import { classifyFailure, type FailureKind } from '../eval/failures.js'
import type { RunResult } from '../eval/run.js'

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
  failures: { kind: FailureKind; n: number; share: number }[]
  totalFailures: number
}

/** Keep only the most recent run of each config, so re-running one rung supersedes it. */
export function latestPerConfig(runs: RunResult[]): RunResult[] {
  const latest = new Map<string, RunResult>()
  for (const run of [...runs].sort((a, b) => a.startedAt.localeCompare(b.startedAt))) latest.set(run.config, run)
  return LADDER.map((config) => latest.get(config.name)).filter((run): run is RunResult => run !== undefined)
}

export function capabilitiesOf(name: string): string {
  const config = LADDER.find((rung) => rung.name === name)
  if (config === undefined) return ''
  return [
    config.chunking === 'article' ? 'article chunks' : 'fixed chunks',
    config.lexical ? 'lexical' : null,
    config.rerank ? 'rerank' : null,
    config.rewrite ? 'rewrite' : null,
    config.filter ? 'date filter + precedence' : null,
  ].filter(Boolean).join(' + ')
}

function toRung(run: RunResult): RungSummary {
  const a = run.aggregates
  return {
    name: run.config,
    adds: capabilitiesOf(run.config),
    recallAt5: a.recallAt5,
    mrr: a.mrr,
    answerCorrectness: a.answerCorrectness,
    citationCorrectness: a.citationCorrectness,
    refusalAccuracy: a.refusalAccuracy,
    falseRefusalRate: a.falseRefusalRate,
    supersededRate: a.supersededRate,
    costEurPerQuery: a.costEurPerQuery,
    latencyP95Ms: a.latencyP95Ms,
  }
}

/**
 * The headline configuration is the last rung that ran, not the highest-scoring one.
 *
 * A page that quotes whichever number happened to come out best is advertising; the ladder
 * is only meaningful if the top of it is the system as shipped.
 */
export function buildSummary(runs: RunResult[]): Summary {
  const ordered = latestPerConfig(runs)
  if (ordered.length === 0) throw new Error('no runs to summarise')

  const best = toRung(ordered.at(-1)!)
  const winner = ordered.at(-1)!
  const counts = new Map<FailureKind, number>()
  for (const row of winner.rows) {
    const kind = classifyFailure(row)
    if (kind !== null) counts.set(kind, (counts.get(kind) ?? 0) + 1)
  }
  const totalFailures = [...counts.values()].reduce((sum, n) => sum + n, 0)

  return {
    generatedFrom: ordered.length,
    goldSetSize: winner.goldSetSize,
    model: winner.model,
    judgeModel: winner.judgeModel,
    startedAt: winner.startedAt,
    rungs: ordered.map(toRung),
    best,
    baseline: toRung(ordered[0]!),
    failures: [...counts]
      .sort((a, b) => b[1] - a[1])
      .map(([kind, n]) => ({ kind, n, share: n / winner.rows.length })),
    totalFailures,
  }
}
