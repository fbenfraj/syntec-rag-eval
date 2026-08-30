import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { getPool } from './pool.js'
import { applySchema, loadArticles } from './load.js'
import type { Article } from '../corpus/types.js'

const pool = getPool()

const article: Article = {
  id: 'convention:47513825',
  source: 'convention',
  articleId: '3.4',
  title: 'Période d\'essai',
  content: 'La période d\'essai des ingénieurs et cadres est de trois mois.',
  contentKind: 'prose',
  effectiveFrom: null,
  effectiveTo: null,
  precedence: 1,
}

beforeEach(async () => {
  await applySchema(pool)
})

afterAll(async () => {
  await pool.end()
})

describe('loadArticles', () => {
  it('inserts articles and returns the count', async () => {
    expect(await loadArticles(pool, [article])).toBe(1)
    const { rows } = await pool.query('SELECT id, precedence FROM articles')
    expect(rows).toEqual([{ id: 'convention:47513825', precedence: 1 }])
  })

  it('is idempotent on re-load', async () => {
    await loadArticles(pool, [article])
    await loadArticles(pool, [{ ...article, content: 'Texte révisé.' }])
    const { rows } = await pool.query('SELECT content FROM articles')
    expect(rows).toEqual([{ content: 'Texte révisé.' }])
  })

  it('builds a French tsvector that stems accented words', async () => {
    await loadArticles(pool, [article])
    const { rows } = await pool.query(
      "SELECT id FROM articles WHERE tsv @@ plainto_tsquery('french', 'périodes essai')",
    )
    expect(rows).toHaveLength(1)
  })

  it('stores dates and leaves the embedding for the indexing step', async () => {
    await loadArticles(pool, [{ ...article, effectiveFrom: '2023-05-01' }])
    const { rows } = await pool.query('SELECT effective_from, effective_to, embedding FROM articles')
    expect(rows[0].effective_from).toBeInstanceOf(Date)
    expect(rows[0].effective_to).toBeNull()
    expect(rows[0].embedding).toBeNull()
  })

  it('loads prose and table records side by side', async () => {
    const table: Article = { ...article, id: `${article.id}#table-1`, contentKind: 'table', content: '| a | b |' }
    expect(await loadArticles(pool, [article, table])).toBe(2)
    const { rows } = await pool.query('SELECT content_kind FROM articles ORDER BY id')
    expect(rows.map((r) => r.content_kind)).toEqual(['prose', 'table'])
  })
})
