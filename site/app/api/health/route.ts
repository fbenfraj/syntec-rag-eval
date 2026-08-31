import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { DAILY_CAP_EUR, PER_IP_PER_HOUR } from '@/lib/demo-limits'

export const runtime = 'nodejs'

/** Lets the page tell "the demo is off for today" apart from "the demo is broken". */
export async function GET() {
  try {
    const pool = getPool()
    const { rows } = await pool.query<{ articles: string; spent: string }>(
      `SELECT (SELECT count(*) FROM articles WHERE embedding IS NOT NULL)::text AS articles,
              coalesce((SELECT sum(eur) FROM demo_usage WHERE day = (now() AT TIME ZONE 'utc')::date), 0)::text AS spent`,
    )
    const spent = Number(rows[0]?.spent ?? 0)
    return NextResponse.json({
      ok: true,
      articles: Number(rows[0]?.articles ?? 0),
      spentTodayEur: Number(spent.toFixed(4)),
      dailyCapEur: DAILY_CAP_EUR,
      perIpPerHour: PER_IP_PER_HOUR,
      capReached: spent >= DAILY_CAP_EUR,
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 })
  }
}
