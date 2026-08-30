import { describe, expect, it } from 'vitest'
import { citationCorrectness, refusalOutcome, refusalRates } from './answer.js'
import { GoldQuestionSchema, type GoldQuestion } from '../gold/types.js'
import type { Answer } from '../answer/answer.js'

const completion = { model: 'test-model', text: '', inputTokens: 0, outputTokens: 0, latencyMs: 0 }
const ans = (over: Partial<Answer> = {}): Answer => ({ text: '', citations: [], refused: false, completion, ...over })
const gold = (over: Partial<GoldQuestion> = {}): GoldQuestion =>
  GoldQuestionSchema.parse({
    id: 'q001', question: 'x'.repeat(12), answer: 'a', requiredArticles: ['convention:4'],
    tier: 1, category: 'general', asOf: null, ...over,
  })

describe('citationCorrectness', () => {
  it('is 1 when the cited articles are exactly the required ones', () => {
    expect(citationCorrectness(['convention:4'], ['convention:4'])).toBe(1)
  })

  it('penalises a missing required citation', () => {
    expect(citationCorrectness(['convention:4'], ['convention:4', 'code:L1221-19'])).toBeCloseTo(0.666, 2)
  })

  it('penalises a citation that was not required', () => {
    expect(citationCorrectness(['convention:4', 'code:L9999-1'], ['convention:4'])).toBeCloseTo(0.666, 2)
  })

  it('is 1 when nothing was required and nothing was cited', () => {
    expect(citationCorrectness([], [])).toBe(1)
  })

  it('is 0 when an answer cites nothing but an article was required', () => {
    expect(citationCorrectness([], ['convention:4'])).toBe(0)
  })

  it('is 0 when every citation is wrong', () => {
    expect(citationCorrectness(['code:L9999-1'], ['convention:4'])).toBe(0)
  })
})

describe('refusalOutcome', () => {
  it('names a correct refusal on an unanswerable question', () => {
    expect(refusalOutcome(gold({ category: 'unanswerable', requiredArticles: [] }), ans({ refused: true })))
      .toBe('correct-refusal')
  })

  it('names a false refusal on an answerable question', () => {
    expect(refusalOutcome(gold(), ans({ refused: true }))).toBe('false-refusal')
  })

  it('names a missed refusal when the system answers an unanswerable question', () => {
    expect(refusalOutcome(gold({ category: 'unanswerable', requiredArticles: [] }), ans())).toBe('missed-refusal')
  })

  it('names a plain answer otherwise', () => {
    expect(refusalOutcome(gold(), ans())).toBe('answered')
  })
})

describe('refusalRates', () => {
  it('reports a system that refuses everything as perfectly accurate and uselessly so', () => {
    // The exact pathology the pair of numbers exists to expose.
    const rates = refusalRates(['correct-refusal', 'correct-refusal', 'false-refusal', 'false-refusal'])
    expect(rates.refusalAccuracy).toBe(1)
    expect(rates.falseRefusalRate).toBe(1)
  })

  it('reports a system that never refuses as zero on both', () => {
    const rates = refusalRates(['missed-refusal', 'answered', 'answered'])
    expect(rates.refusalAccuracy).toBe(0)
    expect(rates.falseRefusalRate).toBe(0)
  })

  it('counts each denominator from its own kind of question', () => {
    const rates = refusalRates(['correct-refusal', 'missed-refusal', 'answered'])
    expect(rates.unanswerable).toBe(2)
    expect(rates.answerable).toBe(1)
    expect(rates.refusalAccuracy).toBe(0.5)
  })
})

describe('citationCorrectness on chunked retrieval', () => {
  it('credits a citation of a fixed-size chunk of the required article', () => {
    // The baseline rung shows the model chunks, so this is what it can cite.
    expect(citationCorrectness(['code:L1221-19#chunk-2'], ['code:L1221-19'])).toBe(1)
  })

  it('credits a citation of a table lifted out of the required article', () => {
    expect(citationCorrectness(['convention:47513825#table-1'], ['convention:47513825'])).toBe(1)
  })

  it('still refuses to credit a superseded version', () => {
    expect(citationCorrectness(['code:L1221-19@6902466'], ['code:L1221-19'])).toBe(0)
  })

  it('counts two chunks of one article as one citation', () => {
    expect(citationCorrectness(['code:a#chunk-1', 'code:a#chunk-2'], ['code:a'])).toBe(1)
  })
})
