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
    /*
     * Long enough to outlast a cold start.
     *
     * The demo database is a free Neon instance that suspends when idle, and waking it
     * measured 13s. At the previous 8s ceiling the pool gave up first, so the first visitor
     * after any quiet period was told the demo was unavailable while the database was
     * merely waking. That is the worst possible visitor to fail, and it fails silently:
     * every later request that hour succeeds, so the fault never reproduces when checked.
     *
     * The route allows 30s, and a woken database answers the whole pipeline in about six,
     * so the slow path still lands inside the budget.
     */
    connectionTimeoutMillis: 22_000,
  })
  return pool
}
