import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { parseCodeArticle } from './parseCode.js'

const raw = JSON.parse(
  await readFile(new URL('./fixtures/code-article.json', import.meta.url), 'utf8'),
)

describe('parseCodeArticle', () => {
  it('maps identity fields', () => {
    const article = parseCodeArticle(raw)
    expect(article.id).toBe('code:L1221-19')
    expect(article.source).toBe('code')
    expect(article.articleId).toBe('L1221-19')
    expect(article.precedence).toBe(0)
    expect(article.contentKind).toBe('prose')
  })

  it('strips html and decodes entities', () => {
    expect(parseCodeArticle(raw).content).toBe(
      "Le contrat de travail à durée indéterminée peut comporter une période d'essai.",
    )
  })

  it('treats the sentinel end date as still in force', () => {
    expect(parseCodeArticle(raw).effectiveTo).toBeNull()
    expect(parseCodeArticle(raw).effectiveFrom).toBe('2008-05-01')
  })
})
