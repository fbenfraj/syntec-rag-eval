import type { GoldQuestion } from '../gold/types.js'
import type { Answer } from '../answer/answer.js'

/**
 * F1 between cited and required articles, so both omissions and inventions are penalised.
 *
 * Precision alone would reward citing one article and ignoring the rest; recall alone would
 * reward citing everything retrieved. A legal answer is wrong in both directions.
 */
export function citationCorrectness(citations: string[], required: string[]): number {
  if (citations.length === 0 && required.length === 0) return 1
  const cited = new Set(citations)
  const needed = new Set(required)
  if (cited.size === 0 || needed.size === 0) return 0
  const overlap = [...cited].filter((citation) => needed.has(citation)).length
  if (overlap === 0) return 0
  const precision = overlap / cited.size
  const recall = overlap / needed.size
  return (2 * precision * recall) / (precision + recall)
}

/**
 * - `correct-refusal` refused a question the corpus does not answer
 * - `false-refusal`   refused a question it should have answered
 * - `missed-refusal`  answered a question the corpus does not answer
 * - `answered`        answered an answerable question
 *
 * The four are reported together, never one alone. Refusal accuracy can be driven to 1 by
 * refusing everything, and that same system has a false-refusal rate of 1 — publishing
 * either number without the other describes a useless system as a perfect one.
 */
export type RefusalOutcome = 'correct-refusal' | 'false-refusal' | 'missed-refusal' | 'answered'

export function refusalOutcome(question: GoldQuestion, answer: Answer): RefusalOutcome {
  const unanswerable = question.category === 'unanswerable'
  if (answer.refused) return unanswerable ? 'correct-refusal' : 'false-refusal'
  return unanswerable ? 'missed-refusal' : 'answered'
}

export interface RefusalRates {
  refusalAccuracy: number
  falseRefusalRate: number
  unanswerable: number
  answerable: number
}

/** Both rates, computed together so neither can be published on its own. */
export function refusalRates(outcomes: RefusalOutcome[]): RefusalRates {
  const unanswerable = outcomes.filter((o) => o === 'correct-refusal' || o === 'missed-refusal').length
  const answerable = outcomes.filter((o) => o === 'false-refusal' || o === 'answered').length
  return {
    refusalAccuracy: unanswerable === 0 ? 1 : outcomes.filter((o) => o === 'correct-refusal').length / unanswerable,
    falseRefusalRate: answerable === 0 ? 0 : outcomes.filter((o) => o === 'false-refusal').length / answerable,
    unanswerable,
    answerable,
  }
}
