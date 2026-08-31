import { describe, expect, it } from 'vitest'
import { kappaFromTable, stratifiedKappa } from './calibration.js'

const rows = (spec: [boolean, boolean][]) => spec.map(([judge, human]) => ({ judge, human }))

describe('kappaFromTable', () => {
  it('matches Cohen for perfect agreement', () => {
    expect(kappaFromTable({ bothCorrect: 5, judgeOnly: 0, humanOnly: 0, neither: 5 })).toBe(1)
  })

  it('is 0 when the judge always says correct on a skewed set', () => {
    expect(kappaFromTable({ bothCorrect: 9, judgeOnly: 1, humanOnly: 0, neither: 0 })).toBe(0)
  })

  it('accepts fractional counts from reweighting', () => {
    expect(kappaFromTable({ bothCorrect: 7.5, judgeOnly: 0, humanOnly: 0, neither: 2.5 })).toBe(1)
  })
})

describe('stratifiedKappa', () => {
  it('reduces to plain kappa when every row is labelled', () => {
    const all = rows([[true, true], [false, false], [true, false], [false, true]])
    const result = stratifiedKappa([{ size: 4, labelled: all }])
    expect(result.kappa).toBeCloseTo(result.kappaOnLabelled, 10)
  })

  it('weights a sampled stratum up to its true size', () => {
    // 40 rows where the models agreed; 4 of them read, all confirming the judge.
    // 8 rows where they disagreed; all read, judge wrong on 4.
    const result = stratifiedKappa([
      { size: 40, labelled: rows([[true, true], [true, true], [false, false], [false, false]]) },
      { size: 8, labelled: rows([[true, false], [true, false], [false, true], [false, true], [true, true], [false, false], [true, true], [false, false]]) },
    ])
    expect(result.population).toBe(48)
    expect(result.labelled).toBe(12)
    const total = Object.values(result.table).reduce((sum, value) => sum + value, 0)
    expect(total).toBeCloseTo(48, 6)
  })

  it('does not let an unread stratum be assumed correct', () => {
    // The shortcut this design exists to prevent: counting the agreements as
    // judge-is-right without reading any of them.
    expect(() => stratifiedKappa([{ size: 40, labelled: [] }, { size: 8, labelled: rows([[true, false]]) }]))
      .toThrow(/cannot be estimated/i)
  })

  it('reports a lower kappa than the labelled-only view when the sample is adverse', () => {
    // Reading only disagreements makes the judge look terrible; the weighted estimate
    // corrects for the many agreements it was not shown.
    const result = stratifiedKappa([
      { size: 50, labelled: rows([[true, true], [false, false]]) },
      { size: 10, labelled: rows([[true, false], [false, true]]) },
    ])
    expect(result.kappaOnLabelled).toBeLessThan(result.kappa)
  })
})
