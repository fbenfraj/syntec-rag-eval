import { describe, expect, it } from 'vitest'
import { LADDER, getConfig } from './configs.js'

describe('LADDER', () => {
  it('has six rungs with unique names', () => {
    expect(LADDER).toHaveLength(6)
    expect(new Set(LADDER.map((c) => c.name)).size).toBe(6)
  })

  it('starts from a naive dense-only fixed-chunk baseline', () => {
    expect(LADDER[0]).toMatchObject({
      name: 'baseline', chunking: 'fixed', dense: true,
      lexical: false, rerank: false, rewrite: false, filter: false,
    })
  })

  it('each rung adds exactly one capability to the previous one', () => {
    const flags = (c: (typeof LADDER)[number]) =>
      [c.chunking === 'article', c.lexical, c.rerank, c.rewrite, c.filter].filter(Boolean).length
    LADDER.slice(1).forEach((c, i) => expect(flags(c)).toBe(flags(LADDER[i]!) + 1))
  })

  it('never turns a capability off once a rung has turned it on', () => {
    LADDER.slice(1).forEach((c, i) => {
      const previous = LADDER[i]!
      for (const key of ['lexical', 'rerank', 'rewrite', 'filter'] as const) {
        if (previous[key]) expect(c[key]).toBe(true)
      }
    })
  })

  it('retrieves the same k everywhere, so recall is comparable across rungs', () => {
    expect(new Set(LADDER.map((c) => c.k)).size).toBe(1)
  })

  it('throws on an unknown config name', () => {
    expect(() => getConfig('nope')).toThrow(/unknown config/i)
  })
})
