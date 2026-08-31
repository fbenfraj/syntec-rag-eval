/**
 * Load the corpus and its embeddings into the public demo database.
 *
 * Reads the vectors out of the local eval database rather than recomputing them: they are
 * already paid for, deterministic, and the demo must run over exactly the corpus the
 * leaderboard was measured on.
 *
 * Only `articles` is copied. `articles_fixed` exists to make the naive baseline rung
 * genuinely naive, and the demo ships the winning configuration, which never reads it.
 */
import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyEnvFile } from '../src/env.js'
import { SCHEMA } from '../site/lib/demo-limits.js'

applyEnvFile()
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const target = process.env.DEMO_DATABASE_URL
if (target === undefined || target.length === 0) throw new Error('DEMO_DATABASE_URL is not set')

const source = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const demo = new pg.Pool({ connectionString: target, ssl: { rejectUnauthorized: false }, max: 4 })

try {
  const schema = await readFile(join(root, 'sql', 'schema.sql'), 'utf8')
  // The demo needs only the article table; the baseline table is dropped and left empty.
  await demo.query(schema)
  await demo.query('DROP TABLE IF EXISTS articles_fixed')
  await demo.query(SCHEMA)
  console.log('schema applied')

  const { rows } = await source.query<{
    id: string; source: string; article_id: string; title: string; content: string
    content_kind: string; effective_from: Date | null; effective_to: Date | null
    precedence: number; embedding: string | null
  }>('SELECT id, source, article_id, title, content, content_kind, effective_from, effective_to, precedence, embedding::text FROM articles ORDER BY id')
  console.log(`copying ${rows.length} articles`)

  const iso = (value: Date | null) => (value === null ? null : value.toISOString().slice(0, 10))
  const BATCH = 200
  for (let start = 0; start < rows.length; start += BATCH) {
    const batch = rows.slice(start, start + BATCH)
    const values: unknown[] = []
    const placeholders = batch.map((row, index) => {
      const base = index * 10
      values.push(row.id, row.source, row.article_id, row.title, row.content, row.content_kind,
        iso(row.effective_from), iso(row.effective_to), row.precedence, row.embedding)
      return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10}::vector)`
    })
    await demo.query(
      `INSERT INTO articles (id, source, article_id, title, content, content_kind, effective_from, effective_to, precedence, embedding)
       VALUES ${placeholders.join(',')}
       ON CONFLICT (id) DO NOTHING`,
      values,
    )
    process.stdout.write(`  ${Math.min(start + BATCH, rows.length)}/${rows.length}\r`)
  }

  await demo.query('CREATE INDEX IF NOT EXISTS articles_embedding_idx ON articles USING hnsw (embedding vector_cosine_ops)')
  const { rows: check } = await demo.query<{ total: string; embedded: string }>(
    'SELECT count(*)::text AS total, count(*) FILTER (WHERE embedding IS NOT NULL)::text AS embedded FROM articles',
  )
  console.log(`\ndemo database: ${check[0]?.embedded} of ${check[0]?.total} articles embedded and indexed`)
} finally {
  await source.end()
  await demo.end()
}
