import { describe, expect, it } from 'vitest'
import { cohensKappa } from './kappa.js'

describe('cohensKappa', () => {
  it('is 1 for perfect agreement', () => {
    expect(cohensKappa([true, false, true], [true, false, true])).toBe(1)
  })

  it('is near 0 for chance-level agreement', () => {
    expect(cohensKappa([true, true, false, false], [true, false, true, false])).toBeCloseTo(0, 6)
  })

  it('is negative for systematic disagreement', () => {
    expect(cohensKappa([true, true, false, false], [false, false, true, true])).toBeLessThan(0)
  })

  it('gives no credit to a judge that always says correct on a skewed set', () => {
    // 9 of 10 truly correct; a judge that never says otherwise agrees 90% of the time.
    const human = [true, true, true, true, true, true, true, true, true, false]
    const lazyJudge = Array<boolean>(10).fill(true)
    expect(cohensKappa(human, lazyJudge)).toBe(0)
  })

  it('throws on mismatched lengths', () => {
    expect(() => cohensKappa([true], [true, false])).toThrow(/same length/i)
  })
})
