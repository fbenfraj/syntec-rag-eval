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
  // The list arrives already sorted, so position is rank. The bonus is in ranks, which
  // makes it independent of whatever score scale produced the ordering.
  it('lifts a convention article above a code article just ahead of it', () => {
    const hits = [hit('code', { score: 0.5 }), hit('conv', { score: 0.49, precedence: 1 })]
    expect(boostPrecedence(hits)[0]?.id).toBe('conv')
  })

  it('does not override a code article ranked well clear of it', () => {
    const hits = [hit('code'), hit('x1'), hit('x2'), hit('x3'), hit('conv', { precedence: 1 })]
    expect(boostPrecedence(hits)[0]?.id).toBe('code')
  })

  it('behaves the same on fusion scores as on cosine scores', () => {
    // The bug this replaces: a flat bonus was ten times the whole RRF range, and a
    // relative bonus bought nine places, because RRF compresses ranks 1 to 10 into 15%.
    const rrf = (rank: number) => 1 / (60 + rank)
    const byRrf = [hit('code:top', { score: rrf(1) }), ...Array.from({ length: 8 }, (_, i) => hit(`x${i}`, { score: rrf(i + 2) })), hit('conv:tenth', { score: rrf(10), precedence: 1 })]
    const byCosine = [hit('code:top', { score: 0.9 }), ...Array.from({ length: 8 }, (_, i) => hit(`x${i}`, { score: 0.8 - i / 100 })), hit('conv:tenth', { score: 0.1, precedence: 1 })]
    expect(boostPrecedence(byRrf)[0]?.id).toBe('code:top')
    expect(boostPrecedence(byCosine)[0]?.id).toBe('code:top')
  })

  it('gives the convention exactly the documented head start, no more', () => {
    const hits = [hit('a'), hit('b'), hit('conv', { precedence: 1 })]
    // Two places ahead: from index 2 to index 0.
    expect(boostPrecedence(hits).map((h) => h.id)).toEqual(['conv', 'a', 'b'])
  })

  it('does not mutate the list it is given', () => {
    const hits = [hit('code', { score: 0.5 }), hit('conv', { score: 0.5, precedence: 1 })]
    boostPrecedence(hits)
    expect(hits.map((h) => h.id)).toEqual(['code', 'conv'])
  })
})
