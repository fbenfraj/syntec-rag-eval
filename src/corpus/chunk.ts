import type { Article } from './types.js'

export const CHUNK_SIZE = 800
export const CHUNK_OVERLAP = 100

/**
 * Split text at a fixed character count, with overlap. Deliberately naive: it knows
 * nothing about sentences, articles or tables, and will cut a salary grid in half. That is
 * the point — it is the baseline the rest of the ladder is measured against, so it has to
 * be the thing people actually build first, not a strawman.
 */
export function fixedChunks(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  if (size <= overlap) throw new Error('chunk size must exceed the overlap, or chunking never advances')
  if (text.length === 0) return []
  const step = size - overlap
  const chunks: string[] = []
  for (let start = 0; start < text.length; start += step) {
    chunks.push(text.slice(start, start + size))
    if (start + size >= text.length) break
  }
  return chunks
}

/**
 * Re-chunk the corpus for the baseline rung. Each chunk keeps its article's metadata so
 * that a hit can still be scored against the gold set's article ids: the baseline must be
 * judged on whether it found the right law, not on how it happened to slice it.
 */
export function toFixedChunks(articles: Article[]): Article[] {
  return articles.flatMap((article) => {
    const pieces = fixedChunks(`${article.title}\n${article.content}`)
    return pieces.map((content, index) => ({
      ...article,
      id: `${article.id}#chunk-${index + 1}`,
      content,
    }))
  })
}

/** The article a baseline chunk came from, for scoring against the gold set. */
export function articleIdOfChunk(chunkId: string): string {
  return chunkId.replace(/#chunk-\d+$/, '')
}
