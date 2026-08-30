import type pg from 'pg'
import { embedQuery } from '../llm/client.js'
import { denseSearch } from './dense.js'
import { lexicalSearch } from './lexical.js'
import { rrfFuse } from './fuse.js'
import { rerank } from './rerank.js'
import { rewriteQuery } from './rewrite.js'
import { applyDateFilter, boostPrecedence } from './filter.js'
import type { RetrievalConfig } from './configs.js'
import type { ArticleTable, Hit } from './types.js'

/** How many candidates each retriever contributes before fusion and reranking. */
export const CANDIDATE_POOL = 30

export function tableFor(config: RetrievalConfig): ArticleTable {
  return config.chunking === 'fixed' ? 'articles_fixed' : 'articles'
}

export async function retrieve(
  pool: pg.Pool,
  question: string,
  config: RetrievalConfig,
  asOf: string | null,
): Promise<Hit[]> {
  const table = tableFor(config)
  const queries = config.rewrite ? await rewriteQuery(question) : [question]
  const lists: Hit[][] = []

  for (const query of queries) {
    if (config.dense) {
      const vector = await embedQuery(query)
      lists.push(await denseSearch(pool, vector, CANDIDATE_POOL, table))
    }
    if (config.lexical) lists.push(await lexicalSearch(pool, query, CANDIDATE_POOL, table))
  }

  let hits = rrfFuse(lists)
  if (config.filter) hits = boostPrecedence(applyDateFilter(hits, asOf))
  if (config.rerank) hits = await rerank(question, hits.slice(0, CANDIDATE_POOL), config.k)
  return hits.slice(0, config.k)
}
