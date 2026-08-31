import type { Hit } from './types'

/**
 * Stage-by-stage record of one retrieval.
 *
 * This exists so the public demo can show what the pipeline did rather than only what it
 * returned. It is emitted by `retrieveWithCost` through an optional sink: with no sink the
 * pipeline runs exactly as the eval harness runs it, and with one it runs exactly the same
 * and also reports. Nothing here influences a result — a trace that changed the thing it
 * traces would make the demo a different system from the measured one.
 */
export type RetrievalEvent =
  | { stage: 'rewrite'; ms: number; queries: string[] }
  | { stage: 'dense'; ms: number; queries: number; candidates: number }
  | { stage: 'lexical'; ms: number; queries: number; candidates: number }
  | { stage: 'fuse'; ms: number; candidates: number }
  | { stage: 'filter'; ms: number; kept: number; droppedCount: number; dropped: DroppedHit[]; asOf: string }
  | { stage: 'precedence'; ms: number; promoted: number }
  | { stage: 'rerank'; ms: number; from: number; kept: number }

/**
 * A candidate removed because it was not in force. Only the highest-ranked few are carried
 * — the point is to show that repealed law was competing for a place in the answer, and a
 * candidate ranked sixtieth was never going to get one.
 */
export interface DroppedHit {
  id: string
  articleId: string
  source: string
  rank: number
  effectiveTo: string | null
}

export const DROPPED_SHOWN = 6

export type TraceSink = (event: RetrievalEvent) => void

/** Which of the removed candidates are worth showing, in the order they were ranked. */
export function droppedFrom(before: Hit[], after: Hit[]): DroppedHit[] {
  const kept = new Set(after.map((hit) => hit.id))
  return before
    .map((hit, rank) => ({ hit, rank }))
    .filter(({ hit }) => !kept.has(hit.id))
    .slice(0, DROPPED_SHOWN)
    .map(({ hit, rank }) => ({
      id: hit.id,
      articleId: hit.articleId,
      source: hit.source,
      rank: rank + 1,
      effectiveTo: hit.effectiveTo,
    }))
}

/**
 * How many hits the precedence bonus actually moved.
 *
 * Counted as positions changed rather than as a boolean, because the bonus is a rank head
 * start and "it ran" is not the same claim as "it changed the order".
 */
export function promotedBy(before: Hit[], after: Hit[]): number {
  const positionBefore = new Map(before.map((hit, index) => [hit.id, index]))
  return after.filter((hit, index) => (positionBefore.get(hit.id) ?? index) > index).length
}
