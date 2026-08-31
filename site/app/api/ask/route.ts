import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { DAILY_CAP_EUR, MAX_QUESTION_CHARS, checkLimits, recordUsage } from '@/lib/demo-limits'
import { getConfig } from '@/lib/core/retrieval/configs'
import { retrieveWithCost } from '@/lib/core/retrieval/retrieve'
import type { RetrievalEvent } from '@/lib/core/retrieval/trace'
import { answer } from '@/lib/core/answer/answer'
import { GENERATION_MODEL } from '@/lib/core/llm/client'
import { costEur } from '@/lib/core/llm/pricing'

export const runtime = 'nodejs'
export const maxDuration = 30

/** The shipped configuration — the same rung the leaderboard reports. */
const CONFIG = getConfig('filtered')

/** IPs are hashed with a server-side secret: rate limiting needs to tell visitors apart, not identify them. */
function hashIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0]?.trim() || 'unknown'
  return createHash('sha256').update(`${process.env.IP_SALT ?? 'syntec'}:${ip}`).digest('hex').slice(0, 32)
}

/**
 * What the client receives, one JSON object per line.
 *
 * The response streams because the interesting part of this system is the part that takes
 * the time: which queries it wrote, what it found, and what it threw away for being
 * repealed. A single JSON body at the end would deliver the same facts and show none of
 * the work.
 *
 * The answer itself is not token-streamed. The provider client memoises whole completions,
 * and faking a token stream out of a finished string would be a lie told in the one place
 * this project exists to avoid telling them.
 */
type Frame =
  | { type: 'open'; asOf: string; config: string; model: string }
  | { type: 'stage'; event: RetrievalEvent }
  | { type: 'generating' }
  | { type: 'answer'; payload: AnswerPayload }
  | { type: 'error'; error: string; dailyCapEur?: number; spentTodayEur?: number }

interface AnswerPayload {
  answer: string | null
  refused: boolean
  citations: string[]
  sources: {
    id: string
    articleId: string
    source: string
    cited: boolean
    excerpt: string
    effectiveFrom: string | null
    effectiveTo: string | null
    precedence: number
  }[]
  costEur: number
  latencyMs: number
  generationMs: number
  model: string
}

const encoder = new TextEncoder()
const line = (frame: Frame) => encoder.encode(`${JSON.stringify(frame)}\n`)

/** Errors that are the demo working as designed get their own status; the client reads the code. */
function refuse(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status })
}

export async function POST(request: Request) {
  const started = Date.now()
  let body: { question?: unknown }
  try {
    body = (await request.json()) as { question?: unknown }
  } catch {
    return refuse('invalid-json', 400)
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (question.length < 8) return refuse('question-too-short', 400)
  if (question.length > MAX_QUESTION_CHARS) return refuse('question-too-long', 400, { max: MAX_QUESTION_CHARS })

  const pool = getPool()
  const ipHash = hashIp(request)

  let limits
  try {
    limits = await checkLimits(pool, ipHash)
  } catch {
    return refuse('demo-unavailable', 503)
  }
  if (!limits.allowed) {
    return refuse(limits.reason!, 429, {
      dailyCapEur: DAILY_CAP_EUR,
      spentTodayEur: Number(limits.spentToday.toFixed(4)),
    })
  }

  const asOf = new Date().toISOString().slice(0, 10)

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (frame: Frame) => controller.enqueue(line(frame))
      try {
        send({ type: 'open', asOf, config: CONFIG.name, model: GENERATION_MODEL })

        const retrieval = await retrieveWithCost(pool, question, CONFIG, asOf, (event) =>
          send({ type: 'stage', event }),
        )

        send({ type: 'generating' })
        const generationStarted = Date.now()
        const result = await answer(question, retrieval.hits, GENERATION_MODEL)
        const generationMs = Date.now() - generationStarted

        const eur = costEur(result.completion) + retrieval.costEur
        const latencyMs = Date.now() - started
        await recordUsage(pool, { ipHash, eur, question, refused: result.refused, latencyMs })

        send({
          type: 'answer',
          payload: {
            answer: result.refused ? null : result.text,
            refused: result.refused,
            citations: result.citations,
            // Everything the answer was allowed to see, so a visitor can check the citation
            // rather than take it on trust. That is the whole point of the demo.
            sources: retrieval.hits.map((hit) => ({
              id: hit.id,
              articleId: hit.articleId,
              source: hit.source,
              cited: result.citations.includes(hit.id),
              excerpt: hit.content.length > 900 ? `${hit.content.slice(0, 900)}…` : hit.content,
              effectiveFrom: hit.effectiveFrom,
              effectiveTo: hit.effectiveTo,
              precedence: hit.precedence,
            })),
            costEur: Number(eur.toFixed(6)),
            latencyMs,
            generationMs,
            model: GENERATION_MODEL,
          },
        })
      } catch (error) {
        console.error('ask failed', error)
        // The status line is already sent, so a failure has to arrive inside the stream.
        send({ type: 'error', error: 'demo-unavailable' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store, no-transform',
      // Proxies that buffer would collect the whole trace and deliver it at the end,
      // which is the one thing this response exists not to do.
      'x-accel-buffering': 'no',
    },
  })
}
