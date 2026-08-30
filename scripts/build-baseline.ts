/**
 * Populate `articles_fixed`, the naive baseline corpus: the same content re-chunked at a
 * fixed character count. Rung 1 of the ladder reads this table, so the baseline is what
 * someone would actually build first rather than a crippled version of the good pipeline.
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { CHUNK_OVERLAP, CHUNK_SIZE, toFixedChunks } from '../src/corpus/chunk.js'
import { loadArticles } from '../src/db/load.js'
import { getPool } from '../src/db/pool.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const chunks = toFixedChunks(articles)
const pool = getPool()

try {
  await pool.query('TRUNCATE articles_fixed')
  const written = await loadArticles(pool, chunks, 'articles_fixed')
  console.log(`articles_fixed: ${written} chunks from ${articles.length} articles (${CHUNK_SIZE} chars, ${CHUNK_OVERLAP} overlap)`)
} finally {
  await pool.end()
}
