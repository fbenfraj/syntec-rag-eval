import { canonicalArticleId } from '../corpus/chunk'
import type { Hit } from '../retrieval/types'

/**
 * The articles present in the top k results, as corpus ids.
 *
 * Chunks and tables of an article collapse to the article; superseded versions do not.
 * Deduplicating matters because a rung that returns the same article as prose and as a
 * table has effectively retrieved fewer distinct articles, and pretending otherwise would
 * flatter it.
 */
export function articlesInTopK(hits: Hit[], k: number): Set<string> {
  return new Set(hits.slice(0, k).map((hit) => canonicalArticleId(hit.id)))
}

/**
 * The share of the governing articles that reached the top k.
 *
 * This is the load-bearing metric of the whole project: it answers whether the article
 * that decides the question entered the model's context at all. A wrong answer with recall
 * 0 is a retrieval failure; a wrong answer with recall 1 is a generation failure. Reporting
 * one number for both hides which half is broken.
 */
export function recallAtK(hits: Hit[], required: string[], k: number): number {
  if (required.length === 0) return 1
  const top = articlesInTopK(hits, k)
  return required.filter((id) => top.has(id)).length / required.length
}

/** True only when every governing article was retrieved — the stricter, all-or-nothing view. */
export function fullRecallAtK(hits: Hit[], required: string[], k: number): boolean {
  return recallAtK(hits, required, k) === 1
}

/** The share of the top k that was actually needed. Low precision means a padded context. */
export function precisionAtK(hits: Hit[], required: string[], k: number): number {
  const top = hits.slice(0, k)
  if (top.length === 0) return 0
  const needed = new Set(required)
  return top.filter((hit) => needed.has(canonicalArticleId(hit.id))).length / top.length
}

/**
 * Reciprocal rank of the first governing article. Rewards putting it first rather than
 * fifth, which matters when the answer is generated from a truncated context.
 */
export function mrr(hits: Hit[], required: string[]): number {
  if (required.length === 0) return 1
  const needed = new Set(required)
  const rank = hits.findIndex((hit) => needed.has(canonicalArticleId(hit.id)))
  return rank === -1 ? 0 : 1 / (rank + 1)
}

/** Retrieved articles that are no longer in force: the characteristic legal-search failure. */
export function supersededInTopK(hits: Hit[], k: number, asOf: string | null): string[] {
  return hits
    .slice(0, k)
    .filter((hit) => hit.effectiveTo !== null && (asOf === null || hit.effectiveTo < asOf))
    .map((hit) => hit.id)
}
