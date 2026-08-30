import { describe, expect, it } from 'vitest'
import { EUR_PER_USD, PRICES_USD_PER_MTOK, costEur, priceEurPerMtok } from './pricing.js'

describe('costEur', () => {
  it('prices a completion from its token counts', () => {
    const cost = costEur({ model: 'test-model', inputTokens: 1_000_000, outputTokens: 0 })
    expect(cost).toBeCloseTo(1, 6)
  })

  it('throws on an unknown model rather than silently pricing at zero', () => {
    expect(() => costEur({ model: 'nope', inputTokens: 1, outputTokens: 1 })).toThrow(/unknown model/i)
  })

  it('converts a real model to euros', () => {
    const cost = costEur({ model: 'claude-haiku-4-5-20251001', inputTokens: 1_000_000, outputTokens: 1_000_000 })
    expect(cost).toBeCloseTo(6 * EUR_PER_USD, 6)
  })

  it('charges nothing for output on an embedding model', () => {
    expect(costEur({ model: 'voyage-law-2', inputTokens: 0, outputTokens: 1_000_000 })).toBe(0)
  })

  it('prices every model in the table without throwing', () => {
    for (const model of Object.keys(PRICES_USD_PER_MTOK)) {
      expect(() => priceEurPerMtok(model)).not.toThrow()
    }
  })
})
