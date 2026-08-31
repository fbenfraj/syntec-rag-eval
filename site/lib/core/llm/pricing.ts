export interface Completion {
  model: string
  text: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
}

/**
 * USD per million tokens, copied from the providers' public price pages on 2026-08-30.
 *
 * These numbers are published in the leaderboard, so they are kept here rather than
 * inferred, and `costEur` throws on a model that is missing rather than pricing it at
 * zero — a silent zero would make a rung look free.
 *
 * Verify against the provider before publishing a result: prices change and this table
 * does not update itself.
 */
export const PRICES_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 1, output: 5 },
  'claude-sonnet-4-5-20250929': { input: 3, output: 15 },
  // Embedding and reranking models bill on input only.
  'voyage-law-2': { input: 0.12, output: 0 },
  'voyage-3-lite': { input: 0.02, output: 0 },
  'rerank-2': { input: 0.05, output: 0 },
  // Used by the tests, priced at exactly 1 so arithmetic is checkable by eye.
  'test-model': { input: 1, output: 1 },
}

/**
 * EUR per USD, fixed rather than fetched. A live rate would make two runs of the same
 * configuration report different costs, which would be indistinguishable from a real
 * change in the leaderboard.
 */
export const EUR_PER_USD = 0.92
export const RATE_DATE = '2026-08-30'

export function costEur(completion: Pick<Completion, 'model' | 'inputTokens' | 'outputTokens'>): number {
  const price = PRICES_USD_PER_MTOK[completion.model]
  if (price === undefined) throw new Error(`unknown model in price table: ${completion.model}`)
  const usd = (completion.inputTokens * price.input + completion.outputTokens * price.output) / 1_000_000
  return completion.model === 'test-model' ? usd : usd * EUR_PER_USD
}

/** EUR per million tokens, for the leaderboard's cost column. */
export function priceEurPerMtok(model: string): { input: number; output: number } {
  const price = PRICES_USD_PER_MTOK[model]
  if (price === undefined) throw new Error(`unknown model in price table: ${model}`)
  return { input: price.input * EUR_PER_USD, output: price.output * EUR_PER_USD }
}
