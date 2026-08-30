import { readFile } from 'node:fs/promises'
import type pg from 'pg'
import type { Article } from '../corpus/types.js'

/** Recreate the schema. Destructive: `schema.sql` drops the tables it creates. */
export async function applySchema(pool: pg.Pool): Promise<void> {
  const sql = await readFile(new URL('../../sql/schema.sql', import.meta.url), 'utf8')
  await pool.query(sql)
}

const INSERT = `INSERT INTO articles
    (id, source, article_id, title, content, content_kind, effective_from, effective_to, precedence)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  ON CONFLICT (id) DO UPDATE SET
    source = EXCLUDED.source,
    article_id = EXCLUDED.article_id,
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    content_kind = EXCLUDED.content_kind,
    effective_from = EXCLUDED.effective_from,
    effective_to = EXCLUDED.effective_to,
    precedence = EXCLUDED.precedence`

/**
 * Insert or update articles, returning how many were written. Idempotent, so a rebuilt
 * corpus can be re-loaded over the old one. Embeddings are left untouched: they are
 * written by the indexing step and cost money to regenerate.
 */
export async function loadArticles(pool: pg.Pool, articles: Article[]): Promise<number> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const article of articles) {
      await client.query(INSERT, [
        article.id,
        article.source,
        article.articleId,
        article.title,
        article.content,
        article.contentKind,
        article.effectiveFrom,
        article.effectiveTo,
        article.precedence,
      ])
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
  return articles.length
}
