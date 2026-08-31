import type { EvalRow } from './run'

export interface Aggregates {
  n: number
  recallAt5: number
  fullRecallAt5: number
  mrr: number
  /**
   * Answer correctness under the strict rubric.
   *
   * Published as a range with `answerCorrectnessLenient`, never alone. The two rubrics
   * disagree on roughly a third of answers, and no qualified annotator has adjudicated
   * between them, so the spread is the honest uncertainty rather than a number to pick
   * from.
   */
  answerCorrectness: number
  answerCorrectnessLenient: number | null
  /** Answers both rubrics call wrong: wrong on any reading. */
  answerWrongUnderBoth: number
  /** Answers the two rubrics disagree about: correctness here is a matter of rubric. */
  answerRubricDependent: number
  citationCorrectness: number
  /** Over the unanswerable subset. Null when the set has none. */
  refusalAccuracy: number | null
  /** Over the answerable subset. Null when the set has none. */
  falseRefusalRate: number | null
  /** Share of answerable questions where a repealed article reached the top k. */
  supersededRate: number
  costEurPerQuery: number
  inputTokensPerQuery: number
  outputTokensPerQuery: number
  latencyP50Ms: number
  latencyP95Ms: number
}

const mean = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length

/** Nearest-rank percentile: always an observed value, never an interpolation. */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.max(0, Math.ceil(p * sorted.length) - 1)]!
}

/**
 * Retrieval and answer quality are averaged over answerable questions only: an
 * unanswerable question has no article to retrieve, so including it would score a system
 * for finding nothing. Refusal behaviour is the mirror image, and each rate takes its
 * denominator from its own subset.
 */
export function aggregate(rows: EvalRow[]): Aggregates {
  const answerable = rows.filter((row) => row.category !== 'unanswerable')
  const unanswerable = rows.filter((row) => row.category === 'unanswerable')

  return {
    n: rows.length,
    recallAt5: mean(answerable.map((row) => row.recallAtK)),
    fullRecallAt5: mean(answerable.map((row) => (row.recallAtK === 1 ? 1 : 0))),
    mrr: mean(answerable.map((row) => row.mrr)),
    answerCorrectness: mean(answerable.map((row) => (row.answerCorrect ? 1 : 0))),
    answerCorrectnessLenient: answerable.some((row) => typeof row.answerCorrectLenient === 'boolean')
      ? mean(answerable.map((row) => ((row.answerCorrectLenient ?? row.answerCorrect) ? 1 : 0)))
      : null,
    answerWrongUnderBoth: mean(
      answerable.map((row) => (!row.answerCorrect && !(row.answerCorrectLenient ?? row.answerCorrect) ? 1 : 0)),
    ),
    answerRubricDependent: mean(
      answerable.map((row) =>
        typeof row.answerCorrectLenient === 'boolean' && row.answerCorrectLenient !== row.answerCorrect ? 1 : 0,
      ),
    ),
    citationCorrectness: mean(answerable.map((row) => row.citationCorrectness)),
    refusalAccuracy:
      unanswerable.length === 0
        ? null
        : unanswerable.filter((row) => row.refusalOutcome === 'correct-refusal').length / unanswerable.length,
    falseRefusalRate:
      answerable.length === 0
        ? null
        : answerable.filter((row) => row.refusalOutcome === 'false-refusal').length / answerable.length,
    supersededRate: mean(answerable.map((row) => (row.supersededRetrieved.length > 0 ? 1 : 0))),
    costEurPerQuery: mean(rows.map((row) => row.costEur)),
    inputTokensPerQuery: mean(rows.map((row) => row.inputTokens)),
    outputTokensPerQuery: mean(rows.map((row) => row.outputTokens)),
    latencyP50Ms: percentile(rows.map((row) => row.latencyMs), 0.5),
    latencyP95Ms: percentile(rows.map((row) => row.latencyMs), 0.95),
  }
}
