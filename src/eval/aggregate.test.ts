import { describe, expect, it } from 'vitest'
import { aggregate, percentile } from './aggregate.js'
import type { EvalRow } from './run.js'

const row = (over: Partial<EvalRow> = {}): EvalRow => ({
  questionId: 'q001', category: 'general', tier: 1,
  question: 'q', expected: 'e', actual: 'a',
  recallAtK: 1, mrr: 1, answerCorrect: true, judgeReason: '',
  citationCorrectness: 1, refusalOutcome: 'answered',
  retrievedIds: [], requiredArticles: [], citations: [], supersededRetrieved: [],
  costEur: 0.01, inputTokens: 2000, outputTokens: 120, latencyMs: 1000,
  ...over,
})

describe('aggregate', () => {
  it('computes refusal accuracy over the unanswerable subset only', () => {
    const rows = [
      row({ category: 'unanswerable', refusalOutcome: 'correct-refusal' }),
      row({ category: 'unanswerable', refusalOutcome: 'missed-refusal' }),
      row(),
    ]
    expect(aggregate(rows).refusalAccuracy).toBe(0.5)
  })

  it('computes false refusal rate over the answerable subset only', () => {
    const rows = [
      row({ refusalOutcome: 'false-refusal' }),
      row(),
      row({ category: 'unanswerable', refusalOutcome: 'correct-refusal' }),
    ]
    expect(aggregate(rows).falseRefusalRate).toBe(0.5)
  })

  it('reports refusal accuracy as null when there is no unanswerable subset', () => {
    expect(aggregate([row()]).refusalAccuracy).toBeNull()
  })

  it('excludes unanswerable questions from retrieval recall', () => {
    const rows = [row({ recallAtK: 1 }), row({ category: 'unanswerable', recallAtK: 0 })]
    expect(aggregate(rows).recallAt5).toBe(1)
  })

  it('distinguishes partial recall from full recall', () => {
    const rows = [row({ recallAtK: 0.5 }), row({ recallAtK: 1 })]
    expect(aggregate(rows).recallAt5).toBe(0.75)
    expect(aggregate(rows).fullRecallAt5).toBe(0.5)
  })

  it('reports how often a repealed article reached the top k', () => {
    const rows = [row({ supersededRetrieved: ['code:x@1'] }), row()]
    expect(aggregate(rows).supersededRate).toBe(0.5)
  })

  it('averages cost per query', () => {
    expect(aggregate([row({ costEur: 0.02 }), row({ costEur: 0.04 })]).costEurPerQuery).toBeCloseTo(0.03, 6)
  })

  it('exposes the refuse-everything pathology in both directions at once', () => {
    const rows = [
      row({ category: 'unanswerable', refusalOutcome: 'correct-refusal' }),
      row({ refusalOutcome: 'false-refusal' }),
    ]
    const aggregates = aggregate(rows)
    expect(aggregates.refusalAccuracy).toBe(1)
    expect(aggregates.falseRefusalRate).toBe(1)
  })
})

describe('percentile', () => {
  it('takes the nearest-rank value', () => {
    expect(percentile([10, 20, 30, 40], 0.95)).toBe(40)
    expect(percentile([10, 20, 30, 40], 0.5)).toBe(20)
  })

  it('is 0 for an empty list', () => {
    expect(percentile([], 0.5)).toBe(0)
  })
})
