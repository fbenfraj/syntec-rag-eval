import { describe, expect, it } from 'vitest'
import { buildSummary, capabilitiesOf, latestPerConfig } from './summary.js'
import type { RunResult } from '../eval/run.js'
import type { EvalRow } from '../eval/run.js'

const row = (over: Partial<EvalRow> = {}): EvalRow => ({
  questionId: 'q001', category: 'general', tier: 1, question: 'q', expected: 'e', actual: 'a',
  recallAtK: 1, mrr: 1, answerCorrect: true, judgeReason: '', citationCorrectness: 1,
  refusalOutcome: 'answered', retrievedIds: [], requiredArticles: [], citations: [],
  supersededRetrieved: [], costEur: 0, inputTokens: 0, outputTokens: 0, latencyMs: 0, ...over,
})

const run = (config: string, startedAt: string, recall: number, rows: EvalRow[] = [row()]): RunResult =>
  ({
    runId: `${config}-${startedAt}`, config, configDetail: {} as never, model: 'm', judgeModel: 'j',
    goldSetSize: rows.length, asOfDefault: '2026-08-31', startedAt, rows,
    aggregates: {
      n: rows.length, recallAt5: recall, fullRecallAt5: recall, mrr: 0.8, answerCorrectness: 0.9,
      answerCorrectnessLenient: 0.95, answerWrongUnderBoth: 0.05, answerRubricDependent: 0.05,
      citationCorrectness: 0.95, refusalAccuracy: 0.9, falseRefusalRate: 0.04, supersededRate: 0,
      costEurPerQuery: 0.018, inputTokensPerQuery: 2400, outputTokensPerQuery: 140,
      latencyP50Ms: 900, latencyP95Ms: 2100,
    },
  }) as RunResult

describe('latestPerConfig', () => {
  it('keeps only the most recent run for each config', () => {
    const runs = [run('hybrid', '2026-09-01', 0.8), run('hybrid', '2026-09-05', 0.9)]
    expect(latestPerConfig(runs).map((r) => r.aggregates.recallAt5)).toEqual([0.9])
  })

  it('returns rungs in ladder order, not file order', () => {
    const runs = [run('filtered', '2026-09-01', 0.9), run('baseline', '2026-09-01', 0.5)]
    expect(latestPerConfig(runs).map((r) => r.config)).toEqual(['baseline', 'filtered'])
  })

  it('ignores a config that is not on the ladder', () => {
    expect(latestPerConfig([run('experimental', '2026-09-01', 0.9)])).toEqual([])
  })
})

describe('capabilitiesOf', () => {
  it('describes what a rung adds', () => {
    expect(capabilitiesOf('baseline')).toBe('fixed chunks')
    expect(capabilitiesOf('filtered')).toContain('date filter')
  })
})

describe('buildSummary', () => {
  it('takes the headline from the last rung, not the best-scoring one', () => {
    // Advertising would quote the 0.99; the ladder only means something if the top is
    // the system as shipped.
    const runs = [run('baseline', '2026-09-01', 0.99), run('filtered', '2026-09-01', 0.7)]
    expect(buildSummary(runs).best.name).toBe('filtered')
    expect(buildSummary(runs).baseline.name).toBe('baseline')
  })

  it('counts failures on the winning rung by kind', () => {
    const rows = [row(), row({ questionId: 'q2', answerCorrect: false, recallAtK: 0 })]
    const summary = buildSummary([run('filtered', '2026-09-01', 0.9, rows)])
    expect(summary.totalFailures).toBe(1)
    expect(summary.failures[0]).toEqual({ kind: 'retrieval-miss', n: 1, share: 0.5 })
  })

  it('throws rather than render an empty page', () => {
    expect(() => buildSummary([])).toThrow(/no runs/i)
  })
})
