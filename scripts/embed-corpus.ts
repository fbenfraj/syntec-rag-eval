/**
 * Embed every article that has no vector yet, then build the ANN index.
 *
 * Resumable: only rows with a null embedding are read, so an interrupted run continues
 * where it stopped, and the client's cache means a repeat costs nothing.
 */
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL, embed } from '../src/llm/client.js'
import { costEur } from '../src/llm/pricing.js'
import { getPool } from '../src/db/pool.js'

/**
 * Batch and pacing are tunable because Voyage's free tier is capped at 3 requests and
 * 10,000 tokens per minute. A batch has to stay under the token cap or it can never
 * succeed, however often it is retried. With a payment method on the account the standard
 * limits apply and this runs in a couple of minutes; the defaults here are sized for the
 * free tier so the pass completes either way.
 */
const BATCH = Number(process.env.EMBED_BATCH ?? 24)
const REQUESTS_PER_MINUTE = Number(process.env.EMBED_RPM ?? 3)
const MIN_GAP_MS = Math.ceil(60_000 / REQUESTS_PER_MINUTE)
const table = process.argv.includes('--fixed') ? 'articles_fixed' : 'articles'
const pool = getPool()

try {
  const { rows } = await pool.query<{ id: string; title: string; content: string }>(
    `SELECT id, title, content FROM ${table} WHERE embedding IS NULL ORDER BY id`,
  )
  if (rows.length === 0) {
    console.log(`${table}: every article already has an embedding`)
  } else {
    console.log(`${table}: embedding ${rows.length} articles with ${EMBEDDING_MODEL}`)
  }

  let characters = 0
  let previousCallAt = 0
  const startedAt = Date.now()

  for (let start = 0; start < rows.length; start += BATCH) {
    const batch = rows.slice(start, start + BATCH)
    const texts = batch.map((row) => `${row.title}\n${row.content}`)
    characters += texts.reduce((sum, text) => sum + text.length, 0)

    const wait = previousCallAt + MIN_GAP_MS - Date.now()
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
    previousCallAt = Date.now()

    const vectors = await embed(texts)
    for (const [index, row] of batch.entries()) {
      const vector = vectors[index]
      if (vector === undefined || vector.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(`${row.id}: expected ${EMBEDDING_DIMENSIONS} dimensions, got ${vector?.length}`)
      }
      await pool.query(`UPDATE ${table} SET embedding = $1::vector WHERE id = $2`, [JSON.stringify(vector), row.id])
    }
    const done = Math.min(start + BATCH, rows.length)
    const elapsed = (Date.now() - startedAt) / 1000
    const remaining = Math.round((elapsed / done) * (rows.length - done))
    console.log(`  ${done}/${rows.length}${remaining > 0 ? ` (~${Math.ceil(remaining / 60)} min left)` : ''}`)
  }

  // Built after the column is populated: an HNSW index over an empty table is wasted work.
  await pool.query(
    `CREATE INDEX IF NOT EXISTS ${table}_embedding_idx ON ${table} USING hnsw (embedding vector_cosine_ops)`,
  )

  const estimatedTokens = Math.round(characters / 3.2)
  console.log(`indexed. ~${estimatedTokens.toLocaleString()} tokens, about ${costEur({ model: EMBEDDING_MODEL, inputTokens: estimatedTokens, outputTokens: 0 }).toFixed(4)} EUR`)
} finally {
  await pool.end()
}
