import pg from 'pg'

/**
 * The eval database. `DATABASE_URL` is required rather than defaulted, so a run can never
 * silently write to the wrong Postgres — the local one is on a deliberately unusual port.
 */
export function getPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL
  if (connectionString === undefined || connectionString.length === 0) {
    throw new Error('DATABASE_URL is not set — copy .env.example to .env and run `docker compose up -d`')
  }
  return new pg.Pool({ connectionString })
}
