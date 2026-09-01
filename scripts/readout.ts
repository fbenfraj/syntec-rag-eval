/**
 * The 2026-09-15 readout for FrajTech's measurement window (see
 * ~/.claude/skills/decide/decisions.md, entry 2026-09-01).
 *
 * The threshold has two halves and they come from different places on purpose:
 *
 *   - "ran a query" is counted HERE, from `demo_usage` in Postgres, because the route
 *     already writes a row per question. It is server-side, so ad blockers cannot suppress
 *     it — and the audience for this page is engineers, who block beacons far above the
 *     population rate. This half is authoritative.
 *   - "unique visitors" comes from Umami, which is a client beacon and therefore an
 *     UNDERCOUNT. Read it as a floor, never as the number.
 *
 * Distinct people are approximated by distinct `ip_hash`, which conflates everyone behind
 * one NAT and splits anyone on a changing mobile IP. At the scale this threshold operates
 * on — single digits — that error is real and unquantified. Do not report it as exact.
 */
import pg from 'pg'
import { applyEnvFile } from '../src/env.js'

applyEnvFile()

const SINCE = process.env.READOUT_SINCE ?? '2026-09-01'

const connectionString = process.env.DEMO_DATABASE_URL ?? process.env.DATABASE_URL
if (connectionString === undefined || connectionString.length === 0) {
  throw new Error('Set DEMO_DATABASE_URL (or DATABASE_URL) to the demo database')
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 22_000,
})

const { rows } = await pool.query<{
  askers: string
  questions: string
  refused: string
  first_at: string | null
  last_at: string | null
}>(
  `SELECT count(DISTINCT ip_hash)::text            AS askers,
          count(*)::text                            AS questions,
          count(*) FILTER (WHERE refused)::text     AS refused,
          min(at)::text                             AS first_at,
          max(at)::text                             AS last_at
     FROM demo_usage
    WHERE at >= $1::date`,
  [SINCE],
)

const r = rows[0]
const askers = Number(r?.askers ?? 0)
const questions = Number(r?.questions ?? 0)

const { rows: byDay } = await pool.query<{ day: string; askers: string; questions: string }>(
  `SELECT day::text, count(DISTINCT ip_hash)::text AS askers, count(*)::text AS questions
     FROM demo_usage
    WHERE at >= $1::date
    GROUP BY day
    ORDER BY day`,
  [SINCE],
)

console.log(`\nLe Bon Article — demo usage since ${SINCE}\n`)
console.log(`  distinct askers (by ip_hash)  ${askers}`)
console.log(`  questions asked               ${questions}`)
console.log(`  of which refused              ${Number(r?.refused ?? 0)}`)
console.log(`  first / last                  ${r?.first_at ?? '—'} / ${r?.last_at ?? '—'}\n`)

if (byDay.length > 0) {
  console.log('  by day:')
  for (const d of byDay) console.log(`    ${d.day}  askers ${d.askers}  questions ${d.questions}`)
  console.log('')
}

console.log('  Threshold half A — ">= 8 ran a query":', askers >= 8 ? 'MET' : `NOT MET (${askers}/8)`)
console.log('  Threshold half B — ">= 25 unique visitors": read from Umami; this script cannot')
console.log('  see arrivals. Remember the beacon undercounts, so treat its number as a floor.\n')
console.log('  Branches (decisions.md, 2026-09-01):')
console.log('    >=25 visitors AND >=8 askers  -> asset works; improving it earns the next allocation')
console.log('    >=25 visitors AND  <8 askers  -> reached and ignored; THAT is the case for improving it')
console.log('     <25 visitors                 -> distribution is the bottleneck, not the asset\n')

await pool.end()
