import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { parseConventionMarkdown } from './parseConvention.js'

const md = await readFile(new URL('./fixtures/convention-extract.md', import.meta.url), 'utf8')

describe('parseConventionMarkdown', () => {
  it('splits on article headings', () => {
    const articles = parseConventionMarkdown(md)
    expect(articles.map((a) => a.articleId)).toEqual(['4', '4', '5'])
  })

  it('emits tables as their own article with contentKind table', () => {
    const table = parseConventionMarkdown(md).find((a) => a.contentKind === 'table')
    expect(table?.id).toBe('convention:4#table-1')
    expect(table?.content).toContain('| 2.1 | 105 | 24 500 |')
  })

  it('keeps the table out of the prose chunk', () => {
    const prose = parseConventionMarkdown(md).find((a) => a.id === 'convention:4')
    expect(prose?.content).toBe('La période d\'essai des ingénieurs et cadres est de trois mois.')
  })

  it('marks convention articles as overriding the code', () => {
    expect(parseConventionMarkdown(md).every((a) => a.precedence === 1)).toBe(true)
  })
})
