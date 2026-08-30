import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { ArticleSchema } from './types.js'
import { conventionArticleId, isInForce, parseKaliArticleXml, parseLegiArticleXml } from './dila.js'

const fixture = (name: string) => readFile(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')

const codeXml = await fixture('legi-L1221-19.xml')
const conventionProseXml = await fixture('kali-prose-article.xml')
const conventionTableXml = await fixture('kali-table-article.xml')

describe('isInForce', () => {
  it('accepts the three in-force states', () => {
    expect(['VIGUEUR', 'VIGUEUR_ETEN', 'VIGUEUR_NON_ETEN'].every(isInForce)).toBe(true)
  })

  it('rejects superseded, repealed and unknown states', () => {
    expect(['MODIFIE', 'ABROGE', 'REMPLACE', undefined].some(isInForce)).toBe(false)
  })
})

describe('parseLegiArticleXml', () => {
  const articles = parseLegiArticleXml(codeXml)

  it('produces one prose article for a code article with no table', () => {
    expect(articles).toHaveLength(1)
    expect(articles[0]?.contentKind).toBe('prose')
  })

  it('identifies it by article number and marks it as the code', () => {
    expect(articles[0]?.id).toBe('code:L1221-19')
    expect(articles[0]?.articleId).toBe('L1221-19')
    expect(articles[0]?.source).toBe('code')
  })

  it('gives the code lower precedence than the convention', () => {
    expect(articles[0]?.precedence).toBe(0)
  })

  it('keeps each alinéa on its own line', () => {
    const lines = articles[0]!.content.split('\n')
    expect(lines[0]).toContain("période d'essai dont la durée maximale est")
    expect(lines).toContain('1° Pour les ouvriers et les employés, de deux mois ;')
    expect(lines).toContain('3° Pour les cadres, de quatre mois.')
  })

  it('reports an open-ended article as having no end date', () => {
    expect(articles[0]?.effectiveTo).toBeNull()
    expect(articles[0]?.effectiveFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('drops an article version that is no longer in force', () => {
    expect(parseLegiArticleXml(codeXml.replace('<ETAT>VIGUEUR</ETAT>', '<ETAT>ABROGE</ETAT>'))).toEqual([])
  })

  it('keeps a superseded version when asked, under a version-specific id', () => {
    const old = codeXml
      .replace('<ETAT>VIGUEUR</ETAT>', '<ETAT>ABROGE</ETAT>')
      .replace('<DATE_FIN>2999-01-01</DATE_FIN>', '<DATE_FIN>2016-08-10</DATE_FIN>')
    const [article] = parseLegiArticleXml(old, { includeSuperseded: true })
    expect(article?.articleId).toBe('L1221-19')
    expect(article?.effectiveTo).toBe('2016-08-10')
    expect(article?.id).toMatch(/^code:L1221-19@\d+$/)
    expect(article?.id).not.toBe('code:L1221-19')
  })

  it('drops a superseded version that has no end date, since it cannot be placed in time', () => {
    const undatable = codeXml.replace('<ETAT>VIGUEUR</ETAT>', '<ETAT>ABROGE</ETAT>')
    expect(parseLegiArticleXml(undatable, { includeSuperseded: true })).toEqual([])
  })
})

describe('conventionArticleId', () => {
  it('identifies an article by its Légifrance id, not its number', () => {
    expect(conventionArticleId('KALIARTI000044253026')).toBe('convention:44253026')
  })

  it('separates two articles that share a number', () => {
    // Both are "Article 1er", in the same text, both in force.
    expect(conventionArticleId('KALIARTI000005851634')).not.toBe(conventionArticleId('KALIARTI000005851636'))
  })
})

describe('parseKaliArticleXml', () => {
  it('marks convention articles as overriding the code', () => {
    expect(parseKaliArticleXml(conventionProseXml).every((a) => a.precedence === 1)).toBe(true)
  })

  it('uses the Légifrance article id, keeping the human number on articleId', () => {
    expect(parseKaliArticleXml(conventionProseXml)[0]?.id).toBe('convention:44253026')
    expect(parseKaliArticleXml(conventionProseXml)[0]?.articleId).toBe('4')
  })

  it('names the article by its text and its own title', () => {
    const article = parseKaliArticleXml(conventionProseXml)[0]!
    expect(article.title).toContain('Convention collective nationale des bureaux')
    expect(article.title).toContain("Conditions de révision de l'avenant")
  })

  it('emits a table as its own article, carrying the title so it reads alone', () => {
    const articles = parseKaliArticleXml(conventionTableXml)
    const table = articles.find((a) => a.contentKind === 'table')
    expect(table?.id).toBe('convention:47513825#table-1')
    const lines = table!.content.split('\n')
    expect(lines[0]).toContain("Période d'essai")
    expect(lines.some((line) => line.startsWith('| ---'))).toBe(true)
  })

  it('keeps the table out of the prose article', () => {
    const prose = parseKaliArticleXml(conventionTableXml).find((a) => a.contentKind === 'prose')
    expect(prose?.id).toBe('convention:47513825')
    expect(prose?.content).not.toContain('| ---')
    expect(prose?.content).toContain("La période d'essai et la possibilité de la renouveler ne se présument pas.")
  })

  it('produces records the corpus schema accepts', () => {
    for (const article of [...parseKaliArticleXml(conventionTableXml), ...parseLegiArticleXml(codeXml)]) {
      expect(() => ArticleSchema.parse(article)).not.toThrow()
    }
  })
})
