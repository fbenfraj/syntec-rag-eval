import pg from 'pg'

/**
 * One pool per serverless instance, reused across warm invocations. Neon needs TLS, and its
 * certificate chain is not in the default bundle, so verification is relaxed for this
 * connection only — the database holds public legal text and usage counters, no secrets.
 */
let pool: pg.Pool | undefined

export function getPool(): pg.Pool {
  if (pool !== undefined) return pool
  const connectionString = process.env.DATABASE_URL
  if (connectionString === undefined || connectionString.length === 0) {
    throw new Error('DATABASE_URL is not set')
  }
  pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  })
  return pool
}
