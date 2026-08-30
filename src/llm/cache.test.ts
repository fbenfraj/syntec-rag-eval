import { describe, expect, it, vi } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { cached } from './cache.js'

const freshCacheDir = async () => {
  process.env.LLM_CACHE_DIR = await mkdtemp(join(tmpdir(), 'cache-'))
}

describe('cached', () => {
  it('calls the function once for the same key', async () => {
    await freshCacheDir()
    const fn = vi.fn(async () => ({ text: 'bonjour' }))
    expect(await cached({ prompt: 'a' }, fn)).toEqual({ text: 'bonjour' })
    expect(await cached({ prompt: 'a' }, fn)).toEqual({ text: 'bonjour' })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('misses when any part of the key changes', async () => {
    await freshCacheDir()
    const fn = vi.fn(async () => ({ text: 'bonjour' }))
    await cached({ prompt: 'a' }, fn)
    await cached({ prompt: 'b' }, fn)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('is insensitive to key property order', async () => {
    await freshCacheDir()
    const fn = vi.fn(async () => ({ a: 1 }))
    await cached({ a: 1, b: 2 }, fn)
    await cached({ b: 2, a: 1 }, fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('distinguishes nested keys that stringify alike', async () => {
    await freshCacheDir()
    const fn = vi.fn(async () => 1)
    await cached(['a', ['b', 'c']], fn)
    await cached([['a', 'b'], 'c'], fn)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('does not cache a failure, so a transient error can be retried', async () => {
    await freshCacheDir()
    let calls = 0
    const fn = async () => {
      calls += 1
      if (calls === 1) throw new Error('rate limited')
      return 'ok'
    }
    await expect(cached({ k: 1 }, fn)).rejects.toThrow('rate limited')
    expect(await cached({ k: 1 }, fn)).toBe('ok')
    expect(calls).toBe(2)
  })
})
