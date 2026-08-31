import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { DAILY_CAP_EUR, MAX_QUESTION_CHARS, checkLimits, recordUsage } from '@/lib/demo-limits'
import { getConfig } from '@/lib/core/retrieval/configs'
import { retrieveWithCost } from '@/lib/core/retrieval/retrieve'
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

export async function POST(request: Request) {
  const started = Date.now()
  let body: { question?: unknown }
  try {
    body = (await request.json()) as { question?: unknown }
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (question.length < 8) {
    return NextResponse.json({ error: 'question-too-short' }, { status: 400 })
  }
  if (question.length > MAX_QUESTION_CHARS) {
    return NextResponse.json({ error: 'question-too-long', max: MAX_QUESTION_CHARS }, { status: 400 })
  }

  const pool = getPool()
  const ipHash = hashIp(request)

  let limits
  try {
    limits = await checkLimits(pool, ipHash)
  } catch {
    return NextResponse.json({ error: 'demo-unavailable' }, { status: 503 })
  }
  if (!limits.allowed) {
    return NextResponse.json(
      { error: limits.reason, dailyCapEur: DAILY_CAP_EUR, spentTodayEur: Number(limits.spentToday.toFixed(4)) },
      { status: 429 },
    )
  }

  try {
    const retrieval = await retrieveWithCost(pool, question, CONFIG, new Date().toISOString().slice(0, 10))
    const result = await answer(question, retrieval.hits, GENERATION_MODEL)
    const eur = costEur(result.completion) + retrieval.costEur
    const latencyMs = Date.now() - started

    await recordUsage(pool, { ipHash, eur, question, refused: result.refused, latencyMs })

    return NextResponse.json({
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
        excerpt: hit.content.length > 700 ? `${hit.content.slice(0, 700)}…` : hit.content,
      })),
      costEur: Number(eur.toFixed(6)),
      latencyMs,
      model: GENERATION_MODEL,
    })
  } catch (error) {
    console.error('ask failed', error)
    return NextResponse.json({ error: 'demo-unavailable' }, { status: 503 })
  }
}
