import type pg from 'pg'
import { HIT_COLUMNS, type ArticleTable, type Hit } from './types.js'

/**
 * Stem a natural-language question into an OR query.
 *
 * `plainto_tsquery` conjoins every term, which is right for a search box and wrong here: a
 * gold question like "quelle est la durée du préavis pour un cadre ?" would demand all six
 * stems in one article and match nothing. Rewriting the conjunction as a disjunction keeps
 * the French stemming and stop-word removal, and lets `ts_rank` do the discriminating —
 * an article carrying more of the query's terms simply ranks higher.
 */
const OR_QUERY = `replace(plainto_tsquery('french', $1)::text, ' & ', ' | ')::tsquery`

/** French full-text search, so "périodes" matches "période" and stop words are dropped. */
export async function lexicalSearch(
  pool: pg.Pool,
  query: string,
  k: number,
  table: ArticleTable = 'articles',
): Promise<Hit[]> {
  const { rows } = await pool.query<Hit>(
    `WITH q AS (SELECT ${OR_QUERY} AS query)
     SELECT ${HIT_COLUMNS}, ts_rank(tsv, q.query) AS score
       FROM ${table}, q
      WHERE q.query IS NOT NULL AND tsv @@ q.query
      ORDER BY score DESC, id
      LIMIT $2`,
    [query, k],
  )
  return rows
}
