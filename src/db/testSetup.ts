import pg from 'pg'
import { applyEnvFile, testDatabaseUrl } from '../env.js'

/**
 * Create the test database if it does not exist.
 *
 * The database tests call `applySchema`, which drops and recreates the article tables.
 * Pointed at the working database that silently destroys the embedded corpus, with a green
 * test run as the only evidence. The tests are pointed at their own database by
 * `vitest.config.ts`; this only makes sure it exists.
 */
export default async function setup(): Promise<void> {
  applyEnvFile()
  const working = process.env.DATABASE_URL
  if (working === undefined || working.length === 0) throw new Error('DATABASE_URL is not set — see .env.example')

  const { url, database, adminUrl } = testDatabaseUrl(working)

  const admin = new pg.Client({ connectionString: adminUrl })
  await admin.connect()
  try {
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])
    if (rowCount === 0) await admin.query(`CREATE DATABASE "${database}"`)
  } finally {
    await admin.end()
  }

  const test = new pg.Client({ connectionString: url })
  await test.connect()
  try {
    await test.query('CREATE EXTENSION IF NOT EXISTS vector')
  } finally {
    await test.end()
  }
}
