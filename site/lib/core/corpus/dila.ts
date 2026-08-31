import { splitProseAndTables } from './html'
import type { Article, Source } from './types'

/** DILA writes "still in force" as a sentinel far-future end date. */
export const OPEN_ENDED = '2999-01-01'

export function tagText(xml: string, tag: string): string | undefined {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return match?.[1]?.trim()
}

export function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

function contentHtml(xml: string): string {
  const bloc = xml.match(/<BLOC_TEXTUEL>([\s\S]*?)<\/BLOC_TEXTUEL>/)?.[1] ?? ''
  return bloc.match(/<CONTENU[^>]*>([\s\S]*?)<\/CONTENU>/)?.[1] ?? ''
}

function isoDate(date: string | undefined): string | null {
  return date !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
}

/** An end date of the sentinel means the article has no end date, not a date in 2999. */
function endDate(date: string | undefined): string | null {
  return date === OPEN_ENDED ? null : isoDate(date)
}

interface Coordinates {
  source: Source
  articleId: string
  title: string
  precedence: 0 | 1
}

/**
 * Turn one DILA article XML file into articles. Prose and each table become separate
 * records: a salary grid must never be split across a prose chunk boundary, and a table
 * retrieved on its own is still readable because it carries the article title.
 */
function toArticles(xml: string, coordinates: Coordinates): Article[] {
  const { prose, tables } = splitProseAndTables(contentHtml(xml))
  const base = {
    source: coordinates.source,
    articleId: coordinates.articleId,
    title: coordinates.title,
    effectiveFrom: isoDate(tagText(xml, 'DATE_DEBUT')),
    effectiveTo: endDate(tagText(xml, 'DATE_FIN')),
    precedence: coordinates.precedence,
  }
  const prefix = `${coordinates.source}:${coordinates.articleId}`
  const articles: Article[] = []
  if (prose.length > 0) {
    articles.push({ ...base, id: prefix, content: prose, contentKind: 'prose' })
  }
  tables.forEach((markdown, index) => {
    articles.push({
      ...base,
      id: `${prefix}#table-${index + 1}`,
      content: coordinates.title.length > 0 ? `${coordinates.title}\n${markdown}` : markdown,
      contentKind: 'table',
    })
  })
  return articles
}

/** The states DILA uses for text that is currently applicable. */
export function isInForce(etat: string | undefined): boolean {
  return etat === 'VIGUEUR' || etat === 'VIGUEUR_ETEN' || etat === 'VIGUEUR_NON_ETEN'
}

/**
 * States for a version that once applied and no longer does: replaced by a later wording,
 * or repealed outright.
 *
 * These are kept in the corpus on purpose. Citing law that has been superseded is the
 * characteristic failure of a legal retrieval system, and a corpus of only current text
 * makes that failure impossible to observe — the date filter would have nothing to filter
 * and would score as a no-op whether it worked or not.
 */
export function isSuperseded(etat: string | undefined): boolean {
  return etat === 'MODIFIE' || etat === 'ABROGE' || etat === 'ABROGE_DIFF' || etat === 'PERIME'
}

/**
 * One in-force Code du travail article. Returns [] for repealed, superseded or future
 * versions, of which the LEGI dump holds several for every article number.
 */
export function parseLegiArticleXml(xml: string, options: { includeSuperseded?: boolean } = {}): Article[] {
  const etat = tagText(xml, 'ETAT')
  const superseded = isSuperseded(etat)
  if (!isInForce(etat) && !(options.includeSuperseded === true && superseded)) return []

  const articleId = tagText(xml, 'NUM')
  if (articleId === undefined || articleId.length === 0) return []
  // A superseded version has no usable end date unless DILA gives one; without it the
  // version cannot be placed in time and is worse than useless as a distractor.
  if (superseded && endDate(tagText(xml, 'DATE_FIN')) === null) return []

  const titles = [...xml.matchAll(/<TITRE_TM[^>]*>([\s\S]*?)<\/TITRE_TM>/g)].map((m) => m[1]!.trim())
  const articles = toArticles(xml, {
    source: 'code',
    articleId,
    title: titles.at(-1) ?? 'Code du travail',
    precedence: 0,
  })
  // Superseded versions share an article number with the current one, so the id carries
  // the version's own Légifrance id to stay unique and traceable.
  if (!superseded) return articles
  const versionId = tagText(xml, 'ID')?.replace(/^LEGIARTI0*/, '') ?? 'unknown'
  return articles.map((article) => ({
    ...article,
    id: article.id.replace(`code:${articleId}`, `code:${articleId}@${versionId}`),
  }))
}

/**
 * The identity of a convention article is its Légifrance article id, not its number.
 * Article numbers are not unique even within one text: a text with three annexes has
 * three "Article 1er", and 84 numbers collide across the convention as a whole. The
 * Légifrance id is unique by construction and resolves to a public URL, so a citation
 * can always be checked: legifrance.gouv.fr/conv_coll/id/KALIARTI000044253026
 *
 * The human number survives on `articleId`, and the text it belongs to on `title`.
 */
export function conventionArticleId(articleXmlId: string): string {
  return `convention:${articleXmlId.replace(/^KALIARTI0*/, '')}`
}

export function parseKaliArticleXml(xml: string): Article[] {
  if (!isInForce(tagText(xml, 'ETAT'))) return []
  const xmlId = tagText(xml, 'ID')
  if (xmlId === undefined) return []
  const textTitle = xml.match(/<TITRE_TXT\b[^>]*>/)?.[0] ?? ''
  const shortTitle = attr(textTitle, 'c_titre_court') ?? ''
  const articleTitle = tagText(xml, 'TITRE') ?? ''
  const num = tagText(xml, 'NUM')

  const { prose, tables } = splitProseAndTables(contentHtml(xml))
  const base = {
    source: 'convention' as const,
    articleId: num !== undefined && num.length > 0 ? num : xmlId,
    title: [shortTitle, articleTitle].filter((part) => part.length > 0).join(' — '),
    effectiveFrom: isoDate(tagText(xml, 'DATE_DEBUT')),
    effectiveTo: endDate(tagText(xml, 'DATE_FIN')),
    precedence: 1 as const,
  }
  const id = conventionArticleId(xmlId)
  const articles: Article[] = []
  if (prose.length > 0) articles.push({ ...base, id, content: prose, contentKind: 'prose' })
  tables.forEach((markdown, index) => {
    articles.push({
      ...base,
      id: `${id}#table-${index + 1}`,
      content: base.title.length > 0 ? `${base.title}\n${markdown}` : markdown,
      contentKind: 'table',
    })
  })
  return articles
}
