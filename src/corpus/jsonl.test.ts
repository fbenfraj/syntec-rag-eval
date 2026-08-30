import { describe, expect, it } from 'vitest'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArticleLine, readArticles, writeArticles } from './jsonl.js'
import type { Article } from './types.js'

const article: Article = {
  id: 'code:L1221-19',
  source: 'code',
  articleId: 'L1221-19',
  title: 'Période d\'essai',
  content: 'Le contrat de travail à durée indéterminée peut comporter une période d\'essai.',
  contentKind: 'prose',
  effectiveFrom: '2008-05-01',
  effectiveTo: null,
  precedence: 0,
}

describe('article jsonl', () => {
  it('round-trips articles through a file', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'corpus-'))
    const path = join(dir, 'articles.jsonl')
    await writeArticles(path, [article])
    expect(await readArticles(path)).toEqual([article])
  })

  it('writes one article per line', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'corpus-'))
    const path = join(dir, 'articles.jsonl')
    await writeArticles(path, [article, { ...article, id: 'code:L1221-20' }])
    const raw = await readFile(path, 'utf8')
    expect(raw.trimEnd().split('\n')).toHaveLength(2)
  })

  it('rejects a record with an unknown source', () => {
    const line = JSON.stringify({ ...article, source: 'wikipedia' })
    expect(() => parseArticleLine(line)).toThrow()
  })

  it('rejects a record missing required articles metadata', () => {
    const { articleId, ...rest } = article
    expect(() => parseArticleLine(JSON.stringify(rest))).toThrow()
  })
})
