import type { EvalRow } from './run.js'

export type FailureKind =
  | 'retrieval-miss'
  | 'generation-miss'
  | 'partial-retrieval-miss'
  | 'citation-miss'
  | 'stale-law'
  | 'false-refusal'
  | 'missed-refusal'

/** Citation F1 below this counts as a citation failure even when the answer is right. */
export const CITATION_THRESHOLD = 0.5

/**
 * Name what went wrong on one row, or null if nothing did.
 *
 * The distinction the whole project rests on is between the first two: a wrong answer that
 * never saw the governing article is a retrieval failure, and a wrong answer that had it in
 * context is a generation failure. They have different fixes — one is an indexing problem,
 * the other a prompting or model problem — and reporting them merged as "accuracy" tells
 * you nothing about which to work on.
 *
 * Refusal outcomes are checked first: a refusal is not a wrong answer, it is a different
 * behaviour, and folding it into answer correctness hides it.
 */
export function classifyFailure(row: EvalRow): FailureKind | null {
  if (row.refusalOutcome === 'false-refusal') return 'false-refusal'
  if (row.refusalOutcome === 'missed-refusal') return 'missed-refusal'

  if (!row.answerCorrect) {
    if (row.recallAtK === 0) return 'retrieval-miss'
    if (row.recallAtK < 1) return 'partial-retrieval-miss'
    return 'generation-miss'
  }

  // Right answer, but resting on law that no longer applies, or citing the wrong article.
  // Both are wrong in a way a correctness score alone will never show.
  if (row.supersededRetrieved.length > 0) return 'stale-law'
  if (row.citationCorrectness < CITATION_THRESHOLD) return 'citation-miss'
  return null
}

export const FAILURE_DESCRIPTIONS: Record<FailureKind, string> = {
  'retrieval-miss': 'the governing article never reached the model — an indexing problem, not a model problem',
  'partial-retrieval-miss': 'some of the governing articles were retrieved, not all',
  'generation-miss': 'the governing article was in context and the answer was still wrong',
  'citation-miss': 'the answer was right but cited the wrong articles',
  'stale-law': 'the answer was right but rested on an article that had already been repealed',
  'false-refusal': 'refused a question the corpus answers',
  'missed-refusal': 'answered a question the corpus does not answer',
}

export function catalogue(rows: EvalRow[]): Map<FailureKind, EvalRow[]> {
  const byKind = new Map<FailureKind, EvalRow[]>()
  for (const row of rows) {
    const kind = classifyFailure(row)
    if (kind === null) continue
    byKind.set(kind, [...(byKind.get(kind) ?? []), row])
  }
  return byKind
}
