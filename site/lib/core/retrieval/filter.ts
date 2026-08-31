import type { Hit } from './types'

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
 * How many places of head start a convention article gets over the code.
 *
 * The bonus is expressed in ranks, not in score. Two earlier attempts failed on scale:
 * a flat +0.15 against reciprocal-rank-fusion scores of about 0.016 was ten times the
 * whole range, so every convention article outranked every code article regardless of the
 * question — the ladder's top rung scored recall 37.5% against 88.3% for the rung below,
 * and every miss had retrieved five convention articles for a question the code answers.
 * A relative +15% failed too, for the opposite reason: RRF compresses ranks 1 to 10 into a
 * 15% spread, so a percentage bonus silently buys nine places.
 *
 * A rank head start is scale-free and says exactly what it does: the convention wins a
 * near tie and cannot displace a code article that ranked well clear of it.
 */
export const PRECEDENCE_RANK_BONUS = 2

export function boostPrecedence(hits: Hit[]): Hit[] {
  return hits
    .map((hit, index) => ({ hit, adjustedRank: index - hit.precedence * PRECEDENCE_RANK_BONUS, index }))
    // A tie on adjusted rank goes to the convention: that is the whole point of precedence,
    // and without it the head start is one place short of what it says.
    .sort((a, b) => a.adjustedRank - b.adjustedRank || b.hit.precedence - a.hit.precedence || a.index - b.index)
    .map(({ hit }) => hit)
}
