import { rerankScores } from '../llm/client'
import type { Hit } from './types'

/**
 * Rerank with a cross-encoder, which reads the question and the passage together rather
 * than comparing two independently-computed vectors. Slower per candidate, so it runs on a
 * shortlist rather than the corpus.
 */
export async function rerank(query: string, hits: Hit[], k: number): Promise<Hit[]> {
  if (hits.length === 0) return hits
  const scores = await rerankScores(query, hits.map((hit) => hit.content))
  return hits
    .map((hit, index) => ({ ...hit, score: scores[index] ?? 0 }))
    .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1))
    .slice(0, k)
}
