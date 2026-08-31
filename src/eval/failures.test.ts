import { describe, expect, it } from 'vitest'
import { catalogue, classifyFailure } from './failures.js'
import type { EvalRow } from './run.js'

const row = (over: Partial<EvalRow> = {}): EvalRow => ({
  questionId: 'q001', category: 'general', tier: 1,
  question: 'q', expected: 'e', actual: 'a',
  recallAtK: 1, mrr: 1, answerCorrect: true, judgeReason: '',
  citationCorrectness: 1, refusalOutcome: 'answered',
  retrievedIds: [], requiredArticles: [], citations: [], supersededRetrieved: [],
  costEur: 0, inputTokens: 0, outputTokens: 0, latencyMs: 0,
  ...over,
})

describe('classifyFailure', () => {
  it('returns null for a fully correct row', () => {
    expect(classifyFailure(row())).toBeNull()
  })

  it('calls a wrong answer with zero recall a retrieval miss', () => {
    expect(classifyFailure(row({ answerCorrect: false, recallAtK: 0 }))).toBe('retrieval-miss')
  })

  it('calls a wrong answer with full recall a generation miss', () => {
    expect(classifyFailure(row({ answerCorrect: false, recallAtK: 1 }))).toBe('generation-miss')
  })

  it('separates a partial retrieval miss from both', () => {
    expect(classifyFailure(row({ answerCorrect: false, recallAtK: 0.5 }))).toBe('partial-retrieval-miss')
  })

  it('calls a correct answer with bad citations a citation miss', () => {
    expect(classifyFailure(row({ citationCorrectness: 0.4 }))).toBe('citation-miss')
  })

  it('flags a right answer that rested on repealed law', () => {
    expect(classifyFailure(row({ supersededRetrieved: ['code:x@1'] }))).toBe('stale-law')
  })

  it('names refusal failures directly, before looking at correctness', () => {
    expect(classifyFailure(row({ refusalOutcome: 'false-refusal', answerCorrect: false }))).toBe('false-refusal')
    expect(classifyFailure(row({ category: 'unanswerable', refusalOutcome: 'missed-refusal', answerCorrect: false })))
      .toBe('missed-refusal')
  })

  it('does not call a correct refusal a failure', () => {
    expect(classifyFailure(row({ category: 'unanswerable', refusalOutcome: 'correct-refusal' }))).toBeNull()
  })
})

describe('catalogue', () => {
  it('groups rows by what went wrong and omits the clean ones', () => {
    const grouped = catalogue([
      row(),
      row({ questionId: 'q002', answerCorrect: false, recallAtK: 0 }),
      row({ questionId: 'q003', answerCorrect: false, recallAtK: 1 }),
      row({ questionId: 'q004', answerCorrect: false, recallAtK: 0 }),
    ])
    expect(grouped.get('retrieval-miss')?.map((r) => r.questionId)).toEqual(['q002', 'q004'])
    expect(grouped.get('generation-miss')).toHaveLength(1)
    expect(grouped.size).toBe(2)
  })
})

describe('rubric-dependent answers', () => {
  const base = (over: Partial<EvalRow> = {}) => row(over)

  it('is not called a generation miss when the two rubrics disagree', () => {
    expect(classifyFailure(base({ answerCorrect: false, answerCorrectLenient: true, recallAtK: 1 })))
      .toBe('rubric-dependent')
  })

  it('is still a generation miss when both rubrics call it wrong', () => {
    expect(classifyFailure(base({ answerCorrect: false, answerCorrectLenient: false, recallAtK: 1 })))
      .toBe('generation-miss')
  })

  it('is still a retrieval miss when both agree and nothing was retrieved', () => {
    expect(classifyFailure(base({ answerCorrect: false, answerCorrectLenient: false, recallAtK: 0 })))
      .toBe('retrieval-miss')
  })

  it('flags disagreement even when the strict rubric passed the answer', () => {
    expect(classifyFailure(base({ answerCorrect: true, answerCorrectLenient: false }))).toBe('rubric-dependent')
  })

  it('behaves as before when only one rubric ran', () => {
    expect(classifyFailure(base({ answerCorrect: false, recallAtK: 1 }))).toBe('generation-miss')
  })
})
