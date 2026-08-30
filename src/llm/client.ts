import { cached, readCached, writeCached } from './cache.js'
import { assertWithinBudget, recordSpend } from './budget.js'
import { costEur } from './pricing.js'
import type { Completion } from './pricing.js'

export const GENERATION_MODEL = process.env.GENERATION_MODEL ?? 'claude-haiku-4-5-20251001'
export const JUDGE_MODEL = process.env.JUDGE_MODEL ?? 'claude-sonnet-4-5-20250929'
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? 'voyage-law-2'
export const RERANK_MODEL = process.env.RERANK_MODEL ?? 'rerank-2'

/** voyage-law-2 returns 1024 dimensions. The schema's vector column must agree. */
export const EMBEDDING_DIMENSIONS = 1024

function requireEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined || value.length === 0) throw new Error(`${name} is not set — see .env.example`)
  return value
}

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504, 529])

/**
 * One HTTP attempt with bounded retries. Embedding the corpus is thousands of calls, so a
 * single rate limit must not end the run; a non-retryable error is raised immediately so a
 * bad request is not mistaken for a flaky network.
 */
async function postJson(url: string, headers: Record<string, string>, body: unknown, attempts = 8): Promise<unknown> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
    if (response.ok) return response.json()

    const detail = (await response.text()).slice(0, 500)
    lastError = new Error(`${url} returned ${response.status}: ${detail}`)
    if (!RETRYABLE.has(response.status) || attempt === attempts) throw lastError

    const retryAfter = Number(response.headers.get('retry-after'))
    // Capped exponential backoff. A free-tier rate limit resets on a one-minute window,
    // so the ceiling is well above a minute rather than a few seconds.
    const backoffMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(2 ** attempt * 500, 90_000)
    await new Promise((resolve) => setTimeout(resolve, backoffMs))
  }
  throw lastError ?? new Error(`${url} failed`)
}

interface AnthropicResponse {
  content: { type: string; text?: string }[]
  usage: { input_tokens: number; output_tokens: number }
}

/**
 * The Anthropic key is organization-scoped, so every request must name the workspace it
 * bills to. Sending it explicitly keeps this project's spend off any other workspace.
 */
async function callProvider(args: { model: string; system: string; user: string; maxTokens: number }) {
  assertWithinBudget()
  const headers: Record<string, string> = {
    'x-api-key': requireEnv('ANTHROPIC_API_KEY'),
    'anthropic-version': '2023-06-01',
  }
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID
  if (workspace !== undefined && workspace.length > 0) headers['anthropic-workspace-id'] = workspace

  const response = (await postJson('https://api.anthropic.com/v1/messages', headers, {
    model: args.model,
    max_tokens: args.maxTokens,
    temperature: 0,
    system: args.system,
    messages: [{ role: 'user', content: args.user }],
  })) as AnthropicResponse

  const usage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens }
  recordSpend({ model: args.model, ...usage, eur: costEur({ model: args.model, ...usage }) })
  return {
    text: response.content.filter((block) => block.type === 'text').map((block) => block.text ?? '').join(''),
    ...usage,
  }
}

interface VoyageEmbeddings {
  data: { embedding: number[]; index: number }[]
  usage?: { total_tokens: number }
}

async function callEmbeddings(texts: string[], inputType: 'document' | 'query') {
  assertWithinBudget()
  const response = (await postJson(
    'https://api.voyageai.com/v1/embeddings',
    { authorization: `Bearer ${requireEnv('VOYAGE_API_KEY')}` },
    { model: EMBEDDING_MODEL, input: texts, input_type: inputType },
  )) as VoyageEmbeddings
  const inputTokens = response.usage?.total_tokens ?? 0
  recordSpend({
    model: EMBEDDING_MODEL,
    inputTokens,
    outputTokens: 0,
    eur: costEur({ model: EMBEDDING_MODEL, inputTokens, outputTokens: 0 }),
  })
  return [...response.data].sort((a, b) => a.index - b.index).map((row) => row.embedding)
}

interface VoyageRerank {
  data: { index: number; relevance_score: number }[]
  usage?: { total_tokens: number }
}

export interface CompleteArgs {
  model: string
  system: string
  user: string
  maxTokens?: number
}

/** A completion, memoised on the exact request. temperature is 0, so this is reproducible. */
export async function complete(args: CompleteArgs): Promise<Completion> {
  const request = { ...args, maxTokens: args.maxTokens ?? 1024 }
  return cached(['complete', request], async () => {
    const started = Date.now()
    const result = await callProvider(request)
    return { ...result, model: request.model, latencyMs: Date.now() - started }
  })
}

const documentKey = (text: string) => ['embed', EMBEDDING_MODEL, 'document', text]

/**
 * Embed documents for indexing. `input_type` matters: Voyage embeds a question and a
 * passage differently, and mixing them costs real recall.
 *
 * Cached per text rather than per batch. Batching is a rate-limit detail, and keying the
 * cache on the whole batch meant that re-running with a different batch size re-billed the
 * entire corpus — which is exactly what a cache is supposed to prevent.
 */
export async function embed(texts: string[]): Promise<number[][]> {
  const vectors = await Promise.all(texts.map((text) => readCached<number[]>(documentKey(text))))
  const missing = texts.map((text, index) => ({ text, index })).filter(({ index }) => vectors[index] === undefined)
  if (missing.length === 0) return vectors as number[][]

  const fetched = await callEmbeddings(missing.map(({ text }) => text), 'document')
  await Promise.all(
    missing.map(async ({ text, index }, position) => {
      const vector = fetched[position]
      if (vector === undefined) throw new Error('embedding provider returned fewer vectors than texts')
      vectors[index] = vector
      await writeCached(documentKey(text), vector)
    }),
  )
  return vectors as number[][]
}

/** Embed a question for searching. */
export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await cached(['embed', EMBEDDING_MODEL, 'query', [text]], () => callEmbeddings([text], 'query'))
  if (vector === undefined) throw new Error('embedding provider returned no vector')
  return vector
}

/**
 * Relevance scores for each document, in the order given. A dedicated reranker rather than
 * an LLM: scoring 20 candidates per question with a chat model would cost more than
 * generating the answers.
 */
export async function rerankScores(query: string, documents: string[]): Promise<number[]> {
  if (documents.length === 0) return []
  return cached(['rerank', RERANK_MODEL, query, documents], async () => {
    assertWithinBudget()
    const response = (await postJson(
      'https://api.voyageai.com/v1/rerank',
      { authorization: `Bearer ${requireEnv('VOYAGE_API_KEY')}` },
      { model: RERANK_MODEL, query, documents, return_documents: false },
    )) as VoyageRerank
    const rerankTokens = response.usage?.total_tokens ?? 0
    recordSpend({
      model: RERANK_MODEL,
      inputTokens: rerankTokens,
      outputTokens: 0,
      eur: costEur({ model: RERANK_MODEL, inputTokens: rerankTokens, outputTokens: 0 }),
    })
    const scores = Array<number>(documents.length).fill(0)
    for (const row of response.data) scores[row.index] = row.relevance_score
    return scores
  })
}
