/**
 * Apply the schema and load `data/corpus/articles.jsonl` into Postgres.
 *
 * Destructive: the schema drops and recreates the article tables, which discards any
 * embeddings already computed. Run `pnpm embed` afterwards.
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { applySchema, loadArticles } from '../src/db/load.js'
import { getPool } from '../src/db/pool.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const pool = getPool()

try {
  await applySchema(pool)
  const written = await loadArticles(pool, articles)
  const { rows } = await pool.query<{ source: string; count: string }>(
    'SELECT source, count(*)::text AS count FROM articles GROUP BY source ORDER BY source',
  )
  console.log(`loaded ${written} articles`)
  for (const row of rows) console.log(`  ${row.source}: ${row.count}`)
} finally {
  await pool.end()
}
