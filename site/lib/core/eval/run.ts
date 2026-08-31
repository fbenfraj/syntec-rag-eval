import type pg from 'pg'
import { answer } from '../answer/answer'
import type { Category, GoldQuestion } from '../gold/types'
import { costEur } from '../llm/pricing'
import { citationCorrectness, refusalOutcome, type RefusalOutcome } from '../metrics/answer'
import { judgeAnswer } from '../metrics/judge'
import { mrr, recallAtK, supersededInTopK } from '../metrics/retrieval'
import type { RetrievalConfig } from '../retrieval/configs'
import { retrieveWithCost } from '../retrieval/retrieve'
import { aggregate, type Aggregates } from './aggregate'

export interface EvalRow {
  questionId: string
  category: Category
  tier: number
  question: string
  expected: string
  actual: string
  recallAtK: number
  mrr: number
  /**
   * The strict rubric's verdict. Kept as `answerCorrect` for continuity, but it is one of
   * two: see `answerCorrectLenient`. Neither is validated against a qualified annotator,
   * which is why they are published as a range rather than as a number.
   */
  answerCorrect: boolean
  /** The lenient rubric's verdict on the same answer, where one was recorded. */
  answerCorrectLenient?: boolean
  judgeReason: string
  citationCorrectness: number
  refusalOutcome: RefusalOutcome
  retrievedIds: string[]
  requiredArticles: string[]
  citations: string[]
  /** Repealed articles that reached the top k. The characteristic legal-search failure. */
  supersededRetrieved: string[]
  /** Generation plus retrieval, derived from tokens so a cache hit is not reported as free. */
  costEur: number
  inputTokens: number
  outputTokens: number
  latencyMs: number
}

export interface RunResult {
  runId: string
  config: string
  configDetail: RetrievalConfig
  model: string
  judgeModel: string
  goldSetSize: number
  asOfDefault: string
  startedAt: string
  rows: EvalRow[]
  aggregates: Aggregates
}

export async function runEval(args: {
  pool: pg.Pool
  questions: GoldQuestion[]
  config: RetrievalConfig
  model: string
  judgeModel: string
  startedAt: string
  /**
   * The date a question without its own `asOf` is taken to be asked on.
   *
   * Most gold questions carry no date, and treating that as "no date constraint" made the
   * date filter a no-op for 119 of 142 questions — the rung could not be measured. Someone
   * asking a labour-law question today wants the law as it stands today, so today is the
   * honest default, and a `dated` question still overrides it.
   */
  asOfDefault: string
  onProgress?: (done: number, total: number) => void
}): Promise<RunResult> {
  const rows: EvalRow[] = []

  for (const [index, question] of args.questions.entries()) {
    const asOf = question.asOf ?? args.asOfDefault
    const retrieval = await retrieveWithCost(args.pool, question.question, args.config, asOf)
    const result = await answer(question.question, retrieval.hits, args.model)

    // An unanswerable question is scored by whether the system refused, not by a judge:
    // there is no reference answer to compare against, and asking a model to grade a
    // refusal against "the corpus cannot answer this" measures nothing.
    const verdict =
      question.category === 'unanswerable'
        ? { correct: result.refused, reason: 'scored by refusal, not by the judge' }
        : await judgeAnswer({
            question: question.question,
            expected: question.answer,
            actual: result.text,
            model: args.judgeModel,
          })

    rows.push({
      questionId: question.id,
      category: question.category,
      tier: question.tier,
      question: question.question,
      expected: question.answer,
      actual: result.text,
      recallAtK: recallAtK(retrieval.hits, question.requiredArticles, args.config.k),
      mrr: mrr(retrieval.hits, question.requiredArticles),
      answerCorrect: verdict.correct,
      judgeReason: verdict.reason,
      citationCorrectness: citationCorrectness(result.citations, question.requiredArticles),
      refusalOutcome: refusalOutcome(question, result),
      retrievedIds: retrieval.hits.map((hit) => hit.id),
      requiredArticles: question.requiredArticles,
      citations: result.citations,
      supersededRetrieved: supersededInTopK(retrieval.hits, args.config.k, asOf),
      costEur: costEur(result.completion) + retrieval.costEur,
      inputTokens: result.completion.inputTokens,
      outputTokens: result.completion.outputTokens,
      latencyMs: result.completion.latencyMs,
    })
    args.onProgress?.(index + 1, args.questions.length)
  }

  return {
    runId: `${args.config.name}-${args.startedAt}`,
    config: args.config.name,
    configDetail: args.config,
    model: args.model,
    judgeModel: args.judgeModel,
    goldSetSize: args.questions.length,
    asOfDefault: args.asOfDefault,
    startedAt: args.startedAt,
    rows,
    aggregates: aggregate(rows),
  }
}
