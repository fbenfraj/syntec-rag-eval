import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * JSON with object keys sorted, so a cache key does not depend on property order.
 * Arrays keep their order, and their nesting is preserved: ['a',['b','c']] and
 * [['a','b'],'c'] must not collide.
 */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`
}

export function cacheKey(key: unknown): string {
  return createHash('sha256').update(stableStringify(key)).digest('hex')
}

/**
 * Memoise an API call on disk. This is what makes re-running the suite after a retrieval
 * change cheap: only the calls whose request actually changed are re-billed. The key is a
 * hash of the whole request, so any prompt edit misses deliberately.
 *
 * Failures are never cached — a rate limit must not be remembered as an answer.
 */
export async function cached<T>(key: unknown, fn: () => Promise<T>): Promise<T> {
  const directory = process.env.LLM_CACHE_DIR ?? '.cache'
  const path = join(directory, `${cacheKey(key)}.json`)
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    const value = await fn()
    await mkdir(directory, { recursive: true })
    await writeFile(path, JSON.stringify(value), 'utf8')
    return value
  }
}
