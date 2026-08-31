/**
 * Cohen's kappa: agreement corrected for the agreement two raters would reach by chance.
 *
 * Raw agreement flatters a judge on a skewed set — if 85% of answers are correct, a judge
 * that always says "correct" agrees 85% of the time and knows nothing. Kappa is what makes
 * "the judge agrees with the human" a claim rather than an artefact of the base rate.
 */
export function cohensKappa(a: boolean[], b: boolean[]): number {
  if (a.length !== b.length) throw new Error('rating arrays must have the same length')
  const n = a.length
  if (n === 0) return 1

  const agree = a.filter((value, index) => value === b[index]).length / n
  const aTrue = a.filter(Boolean).length / n
  const bTrue = b.filter(Boolean).length / n
  const chance = aTrue * bTrue + (1 - aTrue) * (1 - bTrue)
  if (chance === 1) return agree === 1 ? 1 : 0
  return (agree - chance) / (1 - chance)
}

/** The threshold below which a judge's verdicts are not fit to publish. From the spec. */
export const MINIMUM_KAPPA = 0.7
