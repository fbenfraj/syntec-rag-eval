import { describe, expect, it } from 'vitest'
import { DROPPED_SHOWN, droppedFrom, promotedBy } from './trace.js'
import type { Hit } from './types.js'

const hit = (id: string, over: Partial<Hit> = {}): Hit => ({
  id, articleId: id, source: 'code', content: id, score: 1,
  precedence: 0, effectiveFrom: null, effectiveTo: null, ...over,
})

describe('droppedFrom', () => {
  it('reports what the filter removed, with the rank it held before', () => {
    const before = [hit('a'), hit('repealed', { effectiveTo: '2019-12-31' }), hit('c')]
    const after = [before[0]!, before[2]!]
    expect(droppedFrom(before, after)).toEqual([
      { id: 'repealed', articleId: 'repealed', source: 'code', rank: 2, effectiveTo: '2019-12-31' },
    ])
  })

  it('is empty when nothing was removed', () => {
    const hits = [hit('a'), hit('b')]
    expect(droppedFrom(hits, hits)).toEqual([])
  })

  /**
   * The point of showing removed candidates is that repealed law was competing for a place
   * in the answer. A candidate ranked ninetieth was not, so the list is capped rather than
   * shipped whole.
   */
  it('carries only the highest-ranked few', () => {
    const before = Array.from({ length: 40 }, (_, index) => hit(`h${index}`))
    expect(droppedFrom(before, [])).toHaveLength(DROPPED_SHOWN)
    expect(droppedFrom(before, [])[0]!.rank).toBe(1)
  })
})

describe('promotedBy', () => {
  it('counts hits that moved up, not hits that merely survived', () => {
    const [a, b, c] = [hit('a'), hit('b'), hit('c')]
    expect(promotedBy([a, b, c], [c!, a!, b!])).toBe(1)
  })

  it('is zero when the order is unchanged', () => {
    const hits = [hit('a'), hit('b')]
    expect(promotedBy(hits, hits)).toBe(0)
  })
})
