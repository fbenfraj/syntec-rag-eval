import type pg from 'pg'
import { HIT_COLUMNS, type ArticleTable, type Hit } from './types.js'

/** Cosine similarity over pgvector. Score is 1 - distance, so higher is better. */
export async function denseSearch(
  pool: pg.Pool,
  queryEmbedding: number[],
  k: number,
  table: ArticleTable = 'articles',
): Promise<Hit[]> {
  const { rows } = await pool.query<Hit>(
    `SELECT ${HIT_COLUMNS}, 1 - (embedding <=> $1::vector) AS score
       FROM ${table}
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector, id
      LIMIT $2`,
    [JSON.stringify(queryEmbedding), k],
  )
  return rows
}
