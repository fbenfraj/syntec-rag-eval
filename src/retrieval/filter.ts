import type { Hit } from './types.js'

/**
 * Keep only articles in force on a given date. Dates are compared as ISO strings, which
 * sorts correctly and avoids a timezone shift silently moving an article in or out of
 * force. A null bound means open-ended in that direction.
 */
export function applyDateFilter(hits: Hit[], asOf: string | null): Hit[] {
  if (asOf === null) return hits
  return hits.filter(
    (hit) =>
      (hit.effectiveFrom === null || hit.effectiveFrom <= asOf) &&
      (hit.effectiveTo === null || hit.effectiveTo >= asOf),
  )
}

/**
 * A convention article overrides the code where it is more favourable, so it gets a fixed
 * rank bonus. The bonus is deliberately small: it must break a near-tie without burying a
 * code article that is clearly the better match, which would be a worse failure than the
 * one it fixes.
 */
export const PRECEDENCE_BONUS = 0.15

export function boostPrecedence(hits: Hit[]): Hit[] {
  return hits
    .map((hit) => ({ ...hit, score: hit.score + hit.precedence * PRECEDENCE_BONUS }))
    .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1))
}
