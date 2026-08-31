import type pg from 'pg'

/**
 * Spend and rate limits for the public demo, held in Postgres.
 *
 * The CLI's budget guard writes to a file, which on a serverless host is per-instance and
 * discarded between requests — a cap that resets whenever the platform feels like it is not
 * a cap. These live in the database, so every request counts against the same total no
 * matter which instance serves it.
 */
export const DAILY_CAP_EUR = Number(process.env.DEMO_DAILY_CAP_EUR ?? 0.5)
export const PER_IP_PER_HOUR = Number(process.env.DEMO_PER_IP_PER_HOUR ?? 12)
export const MAX_QUESTION_CHARS = 300

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS demo_usage (
  id          bigserial PRIMARY KEY,
  at          timestamptz NOT NULL DEFAULT now(),
  day         date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  ip_hash     text NOT NULL,
  eur         numeric(10, 6) NOT NULL DEFAULT 0,
  question    text,
  refused     boolean,
  latency_ms  integer
);
CREATE INDEX IF NOT EXISTS demo_usage_day_idx ON demo_usage (day);
CREATE INDEX IF NOT EXISTS demo_usage_ip_idx ON demo_usage (ip_hash, at DESC);
`

export interface LimitVerdict {
  allowed: boolean
  reason?: 'daily-cap' | 'rate-limit'
  spentToday: number
  remainingToday: number
}

export async function checkLimits(pool: pg.Pool, ipHash: string): Promise<LimitVerdict> {
  const { rows } = await pool.query<{ spent: string; recent: string }>(
    `SELECT
       coalesce((SELECT sum(eur) FROM demo_usage WHERE day = (now() AT TIME ZONE 'utc')::date), 0)::text AS spent,
       (SELECT count(*) FROM demo_usage WHERE ip_hash = $1 AND at > now() - interval '1 hour')::text AS recent`,
    [ipHash],
  )
  const spentToday = Number(rows[0]?.spent ?? 0)
  const recent = Number(rows[0]?.recent ?? 0)
  const remainingToday = Math.max(0, DAILY_CAP_EUR - spentToday)

  // Checked before the call, because the cost is only known after it: the overshoot is
  // bounded by one question.
  if (spentToday >= DAILY_CAP_EUR) return { allowed: false, reason: 'daily-cap', spentToday, remainingToday }
  if (recent >= PER_IP_PER_HOUR) return { allowed: false, reason: 'rate-limit', spentToday, remainingToday }
  return { allowed: true, spentToday, remainingToday }
}

export async function recordUsage(
  pool: pg.Pool,
  entry: { ipHash: string; eur: number; question: string; refused: boolean; latencyMs: number },
): Promise<void> {
  await pool.query(
    `INSERT INTO demo_usage (ip_hash, eur, question, refused, latency_ms) VALUES ($1, $2, $3, $4, $5)`,
    [entry.ipHash, entry.eur, entry.question.slice(0, 300), entry.refused, entry.latencyMs],
  )
}
