import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getPool } from '../db/pool.js'
import { applySchema, loadArticles } from '../db/load.js'
import { lexicalSearch } from './lexical.js'
import { denseSearch } from './dense.js'
import type { Article } from '../corpus/types.js'

const pool = getPool()

const articles: Article[] = [
  {
    id: 'code:L1221-19', source: 'code', articleId: 'L1221-19', title: 'Période d\'essai',
    content: 'Le contrat à durée indéterminée peut comporter une période d\'essai.',
    contentKind: 'prose', effectiveFrom: null, effectiveTo: null, precedence: 0,
  },
  {
    id: 'code:L1234-1', source: 'code', articleId: 'L1234-1', title: 'Préavis',
    content: 'Le salarié licencié a droit à un préavis dont la durée dépend de son ancienneté.',
    contentKind: 'prose', effectiveFrom: '2008-05-01', effectiveTo: null, precedence: 0,
  },
]

beforeAll(async () => {
  await applySchema(pool)
  await loadArticles(pool, articles)
})

afterAll(async () => {
  await pool.end()
})

describe('lexicalSearch', () => {
  it('finds the article matching the query terms', async () => {
    const hits = await lexicalSearch(pool, 'durée du préavis', 5)
    expect(hits[0]?.id).toBe('code:L1234-1')
  })

  it('stems, so a plural query matches a singular article', async () => {
    const hits = await lexicalSearch(pool, 'périodes', 5)
    expect(hits.map((h) => h.id)).toContain('code:L1221-19')
  })

  it('matches a question that no single article contains every word of', async () => {
    // plainto_tsquery would conjoin these and return nothing; the OR rewrite is what
    // makes natural-language gold questions retrievable at all.
    const hits = await lexicalSearch(pool, 'quelle est la durée du préavis pour un cadre ?', 5)
    expect(hits[0]?.id).toBe('code:L1234-1')
  })

  it('ranks the article carrying more of the query terms first', async () => {
    const hits = await lexicalSearch(pool, 'préavis licenciement ancienneté période essai', 5)
    expect(hits[0]?.id).toBe('code:L1234-1')
    expect(hits.map((h) => h.id)).toContain('code:L1221-19')
  })

  it('returns nothing for a query of only stop words', async () => {
    expect(await lexicalSearch(pool, 'le la les de du', 5)).toEqual([])
  })

  it('returns at most k hits', async () => {
    expect(await lexicalSearch(pool, 'période préavis contrat', 1)).toHaveLength(1)
  })

  it('returns an empty list when nothing matches', async () => {
    expect(await lexicalSearch(pool, 'blockchain cryptomonnaie', 5)).toEqual([])
  })

  it('reads dates back as plain strings, not timezone-shifted dates', async () => {
    const [hit] = await lexicalSearch(pool, 'préavis ancienneté', 1)
    expect(hit?.effectiveFrom).toBe('2008-05-01')
    expect(hit?.effectiveTo).toBeNull()
  })
})

describe('denseSearch', () => {
  it('skips articles that have no embedding yet', async () => {
    expect(await denseSearch(pool, Array<number>(1024).fill(0.1), 5)).toEqual([])
  })
})
