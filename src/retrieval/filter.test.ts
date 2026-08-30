import { describe, expect, it } from 'vitest'
import { applyDateFilter, boostPrecedence } from './filter.js'
import type { Hit } from './types.js'

const hit = (id: string, over: Partial<Hit> = {}): Hit => ({
  id, articleId: id, source: 'code', content: id, score: 1,
  precedence: 0, effectiveFrom: null, effectiveTo: null, ...over,
})

describe('applyDateFilter', () => {
  it('drops articles that ended before the as-of date', () => {
    const hits = [hit('old', { effectiveTo: '2020-01-01' }), hit('current')]
    expect(applyDateFilter(hits, '2026-01-01').map((h) => h.id)).toEqual(['current'])
  })

  it('drops articles that had not started at the as-of date', () => {
    const hits = [hit('future', { effectiveFrom: '2027-01-01' }), hit('current')]
    expect(applyDateFilter(hits, '2026-01-01').map((h) => h.id)).toEqual(['current'])
  })

  it('is a no-op when as-of is null', () => {
    const hits = [hit('old', { effectiveTo: '2020-01-01' })]
    expect(applyDateFilter(hits, null)).toEqual(hits)
  })

  it('keeps an article on the day it takes effect and the day it ends', () => {
    const hits = [hit('a', { effectiveFrom: '2026-01-01', effectiveTo: '2026-01-01' })]
    expect(applyDateFilter(hits, '2026-01-01')).toHaveLength(1)
  })
})

describe('boostPrecedence', () => {
  it('ranks a convention article above a code article of equal score', () => {
    const hits = [hit('code', { score: 0.5 }), hit('conv', { score: 0.5, precedence: 1 })]
    expect(boostPrecedence(hits)[0]?.id).toBe('conv')
  })

  it('does not override a clearly better code match', () => {
    const hits = [hit('code', { score: 0.9 }), hit('conv', { score: 0.1, precedence: 1 })]
    expect(boostPrecedence(hits)[0]?.id).toBe('code')
  })

  it('does not mutate the list it is given', () => {
    const hits = [hit('code', { score: 0.5 }), hit('conv', { score: 0.5, precedence: 1 })]
    boostPrecedence(hits)
    expect(hits.map((h) => h.id)).toEqual(['code', 'conv'])
  })
})
