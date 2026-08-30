import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { complete, embed, embedQuery, rerankScores } from './client.js'
import { totalSpentEur } from './budget.js'

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers })

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(async () => {
  process.env.LLM_CACHE_DIR = await mkdtemp(join(tmpdir(), 'client-'))
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
  process.env.VOYAGE_API_KEY = 'test-voyage-key'
  process.env.ANTHROPIC_WORKSPACE_ID = 'wrkspc_test'
  process.env.SPEND_LEDGER = join(process.env.LLM_CACHE_DIR!, 'spend.jsonl')
  delete process.env.BUDGET_EUR
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const headersOf = (call: number) => (fetchMock.mock.calls[call]![1] as RequestInit).headers as Record<string, string>
const bodyOf = (call: number) => JSON.parse((fetchMock.mock.calls[call]![1] as RequestInit).body as string)

describe('complete', () => {
  const reply = { content: [{ type: 'text', text: 'trois mois' }], usage: { input_tokens: 12, output_tokens: 3 } }

  it('returns the text with its token counts', async () => {
    fetchMock.mockResolvedValueOnce(json(reply))
    const result = await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(result.text).toBe('trois mois')
    expect(result.inputTokens).toBe(12)
    expect(result.outputTokens).toBe(3)
    expect(result.model).toBe('test-model')
  })

  it('bills the workspace named in the environment', async () => {
    fetchMock.mockResolvedValueOnce(json(reply))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(headersOf(0)['anthropic-workspace-id']).toBe('wrkspc_test')
    expect(headersOf(0)['x-api-key']).toBe('test-anthropic-key')
  })

  it('asks for a deterministic answer', async () => {
    fetchMock.mockResolvedValueOnce(json(reply))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(bodyOf(0).temperature).toBe(0)
  })

  it('does not call the provider twice for an identical request', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(reply)))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('re-bills when the prompt changes', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(reply)))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    await complete({ model: 'test-model', system: 's', user: 'autre' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('joins several text blocks and ignores non-text ones', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ content: [{ type: 'text', text: 'a' }, { type: 'thinking' }, { type: 'text', text: 'b' }], usage: { input_tokens: 1, output_tokens: 1 } }),
    )
    expect((await complete({ model: 'test-model', system: 's', user: 'u' })).text).toBe('ab')
  })

  it('retries a rate limit and then succeeds', async () => {
    fetchMock.mockResolvedValueOnce(json({ error: 'slow down' }, 429)).mockResolvedValueOnce(json(reply))
    expect((await complete({ model: 'test-model', system: 's', user: 'u' })).text).toBe('trois mois')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry a bad request', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json({ error: 'bad model' }, 400)))
    await expect(complete({ model: 'test-model', system: 's', user: 'u' })).rejects.toThrow(/400/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('embed', () => {
  it('returns vectors in the order the texts were given', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ data: [{ index: 1, embedding: [3, 4] }, { index: 0, embedding: [1, 2] }], usage: { total_tokens: 4 } }),
    )
    expect(await embed(['un', 'deux'])).toEqual([[1, 2], [3, 4]])
  })

  it('marks corpus text as documents and a question as a query', async () => {
    fetchMock.mockResolvedValueOnce(json({ data: [{ index: 0, embedding: [1] }], usage: { total_tokens: 1 } }))
    await embed(['un'])
    expect(bodyOf(0).input_type).toBe('document')

    fetchMock.mockResolvedValueOnce(json({ data: [{ index: 0, embedding: [1] }], usage: { total_tokens: 1 } }))
    await embedQuery('une question')
    expect(bodyOf(1).input_type).toBe('query')
  })

  it('caches a question separately from the same text as a document', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(json({ data: [{ index: 0, embedding: [1] }], usage: { total_tokens: 1 } })),
    )
    await embed(['même texte'])
    await embedQuery('même texte')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

describe('rerankScores', () => {
  it('puts each score back on its own document', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ data: [{ index: 2, relevance_score: 0.9 }, { index: 0, relevance_score: 0.1 }] }),
    )
    expect(await rerankScores('q', ['a', 'b', 'c'])).toEqual([0.1, 0, 0.9])
  })

  it('does not call the provider for an empty candidate list', async () => {
    expect(await rerankScores('q', [])).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('the budget guard', () => {
  const reply = { content: [{ type: 'text', text: 'ok' }], usage: { input_tokens: 1_000_000, output_tokens: 0 } }

  it('records what a real call cost', async () => {
    fetchMock.mockResolvedValueOnce(json(reply))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(totalSpentEur()).toBeCloseTo(1, 6)
  })

  it('records nothing for a cache hit, because a cache hit is free', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(reply)))
    await complete({ model: 'test-model', system: 's', user: 'u' })
    await complete({ model: 'test-model', system: 's', user: 'u' })
    expect(totalSpentEur()).toBeCloseTo(1, 6)
  })

  it('refuses to call the provider once the cap is reached', async () => {
    process.env.BUDGET_EUR = '1'
    fetchMock.mockImplementation(() => Promise.resolve(json(reply)))
    await complete({ model: 'test-model', system: 's', user: 'first' })
    await expect(complete({ model: 'test-model', system: 's', user: 'second' })).rejects.toThrow(/budget reached/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('caps embeddings and reranking too, not only generation', async () => {
    process.env.BUDGET_EUR = '1'
    fetchMock.mockImplementation(() => Promise.resolve(json(reply)))
    await complete({ model: 'test-model', system: 's', user: 'first' })
    await expect(embed(['texte'])).rejects.toThrow(/budget reached/)
    await expect(rerankScores('q', ['a'])).rejects.toThrow(/budget reached/)
  })
})
