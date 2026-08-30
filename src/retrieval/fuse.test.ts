import { describe, expect, it } from 'vitest'
import { rrfFuse } from './fuse.js'
import type { Hit } from './types.js'

const hit = (id: string, score: number): Hit => ({
  id,
  articleId: id,
  source: 'code',
  content: id,
  score,
  precedence: 0,
  effectiveFrom: null,
  effectiveTo: null,
})

describe('rrfFuse', () => {
  it('ranks a document appearing in both lists above one appearing in either alone', () => {
    const dense = [hit('a', 0.9), hit('b', 0.8)]
    const lexical = [hit('c', 5), hit('a', 4)]
    expect(rrfFuse([dense, lexical])[0]?.id).toBe('a')
  })

  it('deduplicates by id', () => {
    expect(rrfFuse([[hit('a', 1)], [hit('a', 1)]])).toHaveLength(1)
  })

  it('ignores the raw scores, using only rank', () => {
    const dense = [hit('a', 0.001), hit('b', 0.0009)]
    const lexical = [hit('a', 999)]
    expect(rrfFuse([dense, lexical]).map((h) => h.id)).toEqual(['a', 'b'])
  })

  it('keeps every document from every list', () => {
    expect(rrfFuse([[hit('a', 1), hit('b', 1)], [hit('c', 1)]]).map((h) => h.id).sort()).toEqual(['a', 'b', 'c'])
  })

  it('is deterministic when two documents tie', () => {
    const once = rrfFuse([[hit('b', 1)], [hit('a', 1)]]).map((h) => h.id)
    const twice = rrfFuse([[hit('b', 1)], [hit('a', 1)]]).map((h) => h.id)
    expect(once).toEqual(twice)
  })

  it('returns an empty list when every input is empty', () => {
    expect(rrfFuse([[], []])).toEqual([])
  })
})
