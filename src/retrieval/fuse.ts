import type { Hit } from './types.js'

/**
 * Reciprocal rank fusion. Uses rank only, never the raw score: a cosine similarity of 0.76
 * and a ts_rank of 0.9 are not on the same scale, and normalising them would invent a
 * relationship that does not exist.
 */
export function rrfFuse(lists: Hit[][], k = 60): Hit[] {
  const scores = new Map<string, { hit: Hit; score: number }>()
  for (const list of lists) {
    list.forEach((hit, index) => {
      const entry = scores.get(hit.id) ?? { hit, score: 0 }
      entry.score += 1 / (k + index + 1)
      scores.set(hit.id, entry)
    })
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || (a.hit.id < b.hit.id ? -1 : 1))
    .map(({ hit, score }) => ({ ...hit, score }))
}
