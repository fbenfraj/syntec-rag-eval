import { describe, expect, it } from 'vitest'
import { articlesInTopK, fullRecallAtK, mrr, precisionAtK, recallAtK, supersededInTopK } from './retrieval.js'
import type { Hit } from '../retrieval/types.js'

const hits = (...ids: string[]): Hit[] =>
  ids.map((id) => ({
    id, articleId: id, source: 'code', content: '', score: 1,
    precedence: 0, effectiveFrom: null, effectiveTo: null,
  }))

describe('recallAtK', () => {
  it('is 1 when every required article is in the top k', () => {
    expect(recallAtK(hits('code:a', 'code:b', 'code:c'), ['code:a', 'code:b'], 3)).toBe(1)
  })

  it('is a fraction when only some required articles are retrieved', () => {
    expect(recallAtK(hits('code:a', 'code:x', 'code:y'), ['code:a', 'code:b'], 3)).toBe(0.5)
  })

  it('ignores hits beyond k', () => {
    expect(recallAtK(hits('code:x', 'code:y', 'code:a'), ['code:a'], 2)).toBe(0)
  })

  it('is 1 for a question with no required articles', () => {
    expect(recallAtK(hits('code:x'), [], 3)).toBe(1)
  })

  it('counts a fixed-size chunk as its article', () => {
    expect(recallAtK(hits('code:a#chunk-3'), ['code:a'], 5)).toBe(1)
  })

  it('counts a table lifted out of an article as its article', () => {
    expect(recallAtK(hits('convention:47513825#table-1'), ['convention:47513825'], 5)).toBe(1)
  })

  it('does NOT count a superseded version as the article in force', () => {
    // Citing repealed law is the failure this project exists to catch, not a near miss.
    expect(recallAtK(hits('code:L1221-19@6902466'), ['code:L1221-19'], 5)).toBe(0)
  })
})

describe('fullRecallAtK', () => {
  it('is true only when every governing article is retrieved', () => {
    expect(fullRecallAtK(hits('code:a', 'code:b'), ['code:a', 'code:b'], 5)).toBe(true)
    expect(fullRecallAtK(hits('code:a'), ['code:a', 'code:b'], 5)).toBe(false)
  })
})

describe('articlesInTopK', () => {
  it('counts an article retrieved twice, as prose and as a table, once', () => {
    expect(articlesInTopK(hits('convention:x', 'convention:x#table-1'), 5).size).toBe(1)
  })
})

describe('precisionAtK', () => {
  it('measures the share of the top k that is required', () => {
    expect(precisionAtK(hits('code:a', 'code:x'), ['code:a'], 2)).toBe(0.5)
  })

  it('is 0 when nothing was retrieved', () => {
    expect(precisionAtK([], ['code:a'], 5)).toBe(0)
  })
})

describe('mrr', () => {
  it('is the reciprocal of the first required article rank', () => {
    expect(mrr(hits('code:x', 'code:a'), ['code:a'])).toBe(0.5)
  })

  it('is 0 when no required article is retrieved', () => {
    expect(mrr(hits('code:x', 'code:y'), ['code:a'])).toBe(0)
  })

  it('rewards ranking the governing article first', () => {
    expect(mrr(hits('code:a', 'code:x'), ['code:a'])).toBeGreaterThan(mrr(hits('code:x', 'code:a'), ['code:a']))
  })
})

describe('supersededInTopK', () => {
  const dated = (id: string, effectiveTo: string | null): Hit => ({
    id, articleId: id, source: 'code', content: '', score: 1,
    precedence: 0, effectiveFrom: null, effectiveTo,
  })

  it('reports an article that had already ceased to apply', () => {
    expect(supersededInTopK([dated('code:old', '2016-08-10')], 5, '2026-08-30')).toEqual(['code:old'])
  })

  it('does not report an article still in force', () => {
    expect(supersededInTopK([dated('code:current', null)], 5, '2026-08-30')).toEqual([])
  })

  it('does not report a version that was still in force on the as-of date', () => {
    expect(supersededInTopK([dated('code:old', '2016-08-10')], 5, '2015-01-01')).toEqual([])
  })
})
