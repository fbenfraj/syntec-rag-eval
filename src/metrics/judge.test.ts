import { describe, expect, it } from 'vitest'
import { parseJudgement } from './judge.js'

describe('parseJudgement', () => {
  it('reads a correct verdict and its reason', () => {
    expect(parseJudgement('VERDICT: CORRECT\nRAISON: même durée annoncée.')).toEqual({
      correct: true,
      reason: 'même durée annoncée.',
    })
  })

  it('reads an incorrect verdict', () => {
    expect(parseJudgement('VERDICT: INCORRECT\nRAISON: durée différente.').correct).toBe(false)
  })

  it('does not mistake INCORRECT for CORRECT by substring', () => {
    expect(parseJudgement('VERDICT: INCORRECT\nRAISON: x').correct).toBe(false)
  })

  it('counts a response with no verdict as incorrect rather than silently correct', () => {
    const judgement = parseJudgement("Je ne sais pas trancher cette comparaison.")
    expect(judgement.correct).toBe(false)
    expect(judgement.reason).toContain('Je ne sais pas')
  })
})
