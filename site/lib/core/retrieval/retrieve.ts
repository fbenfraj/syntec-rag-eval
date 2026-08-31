import type pg from 'pg'
import { embedQuery } from '../llm/client'
import { denseSearch } from './dense'
import { lexicalSearch } from './lexical'
import { rrfFuse } from './fuse'
import { rerank } from './rerank'
import { rewriteQuery } from './rewrite'
import { applyDateFilter, boostPrecedence } from './filter'
import { EMBEDDING_MODEL, RERANK_MODEL } from '../llm/client'
import { costEur } from '../llm/pricing'
import { droppedFrom, promotedBy } from './trace'
import type { TraceSink } from './trace'
import type { RetrievalConfig } from './configs'
import type { ArticleTable, Hit } from './types'

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
  /**
   * Optional observer. It is called with what each stage did and can neither read nor
   * change a result, so the traced pipeline is the same pipeline the leaderboard measured.
   */
  onEvent?: TraceSink,
): Promise<Retrieval> {
  const table = tableFor(config)
  // A wall clock per stage rather than one total: the demo shows where the time goes, and
  // an aggregate would hide that reranking costs more than every database query together.
  let mark = Date.now()
  const since = () => {
    const elapsed = Date.now() - mark
    mark = Date.now()
    return elapsed
  }

  const queries = config.rewrite ? await rewriteQuery(question) : [question]
  if (config.rewrite) onEvent?.({ stage: 'rewrite', ms: since(), queries })

  const lists: Hit[][] = []
  let embeddingTokens = 0
  const dense: Hit[][] = []
  const lexical: Hit[][] = []
  // The two retrievers alternate inside one loop, so each keeps its own accumulator.
  // Reporting one combined figure would hide that the vector search is the slow half.
  let denseMs = 0
  let lexicalMs = 0

  for (const query of queries) {
    if (config.dense) {
      embeddingTokens += tokensOf([query])
      const startedDense = Date.now()
      const vector = await embedQuery(query)
      const found = await denseSearch(pool, vector, CANDIDATE_POOL, table)
      denseMs += Date.now() - startedDense
      dense.push(found)
      lists.push(found)
    }
    if (config.lexical) {
      const startedLexical = Date.now()
      const found = await lexicalSearch(pool, query, CANDIDATE_POOL, table)
      lexicalMs += Date.now() - startedLexical
      lexical.push(found)
      lists.push(found)
    }
  }
  since()
  const distinct = (found: Hit[][]) => new Set(found.flat().map((hit) => hit.id)).size
  if (config.dense) {
    onEvent?.({ stage: 'dense', ms: denseMs, queries: dense.length, candidates: distinct(dense) })
  }
  if (config.lexical) {
    onEvent?.({ stage: 'lexical', ms: lexicalMs, queries: lexical.length, candidates: distinct(lexical) })
  }

  let hits = rrfFuse(lists)
  onEvent?.({ stage: 'fuse', ms: since(), candidates: hits.length })

  if (config.filter) {
    const inForce = applyDateFilter(hits, asOf)
    onEvent?.({
      stage: 'filter',
      ms: since(),
      kept: inForce.length,
      droppedCount: hits.length - inForce.length,
      dropped: droppedFrom(hits, inForce),
      asOf: asOf ?? '',
    })
    const boosted = boostPrecedence(inForce)
    onEvent?.({ stage: 'precedence', ms: since(), promoted: promotedBy(inForce, boosted) })
    hits = boosted
  }

  let rerankTokens = 0
  if (config.rerank) {
    const candidates = hits.slice(0, CANDIDATE_POOL)
    rerankTokens = tokensOf([question, ...candidates.map((hit) => hit.content)])
    hits = await rerank(question, candidates, config.k)
    onEvent?.({ stage: 'rerank', ms: since(), from: candidates.length, kept: Math.min(hits.length, config.k) })
  }

  return {
    hits: hits.slice(0, config.k),
    costEur:
      costEur({ model: EMBEDDING_MODEL, inputTokens: embeddingTokens, outputTokens: 0 }) +
      costEur({ model: RERANK_MODEL, inputTokens: rerankTokens, outputTokens: 0 }),
  }
}
