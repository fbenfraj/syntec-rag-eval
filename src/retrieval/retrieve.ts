import type pg from 'pg'
import { embedQuery } from '../llm/client.js'
import { denseSearch } from './dense.js'
import { lexicalSearch } from './lexical.js'
import { rrfFuse } from './fuse.js'
import { rerank } from './rerank.js'
import { rewriteQuery } from './rewrite.js'
import { applyDateFilter, boostPrecedence } from './filter.js'
import { EMBEDDING_MODEL, RERANK_MODEL } from '../llm/client.js'
import { costEur } from '../llm/pricing.js'
import type { RetrievalConfig } from './configs.js'
import type { ArticleTable, Hit } from './types.js'

/** How many candidates each retriever contributes before fusion and reranking. */
export const CANDIDATE_POOL = 30

export function tableFor(config: RetrievalConfig): ArticleTable {
  return config.chunking === 'fixed' ? 'articles_fixed' : 'articles'
}

/** French averages close to 3.2 characters per token for these models. */
const CHARS_PER_TOKEN = 3.2
const tokensOf = (texts: string[]) => Math.round(texts.reduce((sum, text) => sum + text.length, 0) / CHARS_PER_TOKEN)

export interface Retrieval {
  hits: Hit[]
  /**
   * What the retrieval side of this query costs to operate, derived from token counts
   * rather than from the spend ledger. A cached call is free to re-run but is not free to
   * operate, and the leaderboard reports the cost of running the system, not the cost of
   * this particular replay.
   */
  costEur: number
}

export async function retrieve(
  pool: pg.Pool,
  question: string,
  config: RetrievalConfig,
  asOf: string | null,
): Promise<Hit[]> {
  return (await retrieveWithCost(pool, question, config, asOf)).hits
}

export async function retrieveWithCost(
  pool: pg.Pool,
  question: string,
  config: RetrievalConfig,
  asOf: string | null,
): Promise<Retrieval> {
  const table = tableFor(config)
  const queries = config.rewrite ? await rewriteQuery(question) : [question]
  const lists: Hit[][] = []
  let embeddingTokens = 0

  for (const query of queries) {
    if (config.dense) {
      embeddingTokens += tokensOf([query])
      const vector = await embedQuery(query)
      lists.push(await denseSearch(pool, vector, CANDIDATE_POOL, table))
    }
    if (config.lexical) lists.push(await lexicalSearch(pool, query, CANDIDATE_POOL, table))
  }

  let hits = rrfFuse(lists)
  if (config.filter) hits = boostPrecedence(applyDateFilter(hits, asOf))

  let rerankTokens = 0
  if (config.rerank) {
    const candidates = hits.slice(0, CANDIDATE_POOL)
    rerankTokens = tokensOf([question, ...candidates.map((hit) => hit.content)])
    hits = await rerank(question, candidates, config.k)
  }

  return {
    hits: hits.slice(0, config.k),
    costEur:
      costEur({ model: EMBEDDING_MODEL, inputTokens: embeddingTokens, outputTokens: 0 }) +
      costEur({ model: RERANK_MODEL, inputTokens: rerankTokens, outputTokens: 0 }),
  }
}
