import { describe, expect, it } from 'vitest'
import { CHUNK_OVERLAP, CHUNK_SIZE, articleIdOfChunk, fixedChunks, toFixedChunks } from './chunk.js'
import type { Article } from './types.js'

const article: Article = {
  id: 'code:L1221-19', source: 'code', articleId: 'L1221-19', title: 'Période d\'essai',
  content: 'x'.repeat(2000), contentKind: 'prose',
  effectiveFrom: null, effectiveTo: null, precedence: 0,
}

describe('fixedChunks', () => {
  it('returns one chunk when the text is shorter than the window', () => {
    expect(fixedChunks('court')).toEqual(['court'])
  })

  it('returns nothing for empty text', () => {
    expect(fixedChunks('')).toEqual([])
  })

  it('advances by size minus overlap', () => {
    const chunks = fixedChunks('abcdefghij', 4, 1)
    expect(chunks).toEqual(['abcd', 'defg', 'ghij'])
  })

  it('overlaps consecutive chunks, so a sentence on a boundary survives somewhere', () => {
    const text = 'y'.repeat(CHUNK_SIZE * 2)
    const chunks = fixedChunks(text)
    expect(chunks[0]?.slice(-CHUNK_OVERLAP)).toBe(chunks[1]?.slice(0, CHUNK_OVERLAP))
  })

  it('refuses a configuration that would never advance', () => {
    expect(() => fixedChunks('abc', 4, 4)).toThrow(/never advances/)
  })
})

describe('toFixedChunks', () => {
  it('splits a long article into several chunks', () => {
    const chunks = toFixedChunks([article])
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.every((c) => c.content.length <= CHUNK_SIZE)).toBe(true)
  })

  it('keeps the article metadata on every chunk', () => {
    for (const chunk of toFixedChunks([article])) {
      expect(chunk.articleId).toBe('L1221-19')
      expect(chunk.source).toBe('code')
    }
  })

  it('gives each chunk an id that traces back to its article', () => {
    const chunks = toFixedChunks([article])
    expect(chunks[0]?.id).toBe('code:L1221-19#chunk-1')
    expect(articleIdOfChunk(chunks[2]!.id)).toBe('code:L1221-19')
  })

  it('leaves an id without a chunk suffix alone', () => {
    expect(articleIdOfChunk('code:L1221-19')).toBe('code:L1221-19')
  })
})
