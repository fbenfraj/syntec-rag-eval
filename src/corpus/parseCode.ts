import type { Article } from './types.js'

export interface LegifranceArticle {
  num: string
  titre: string
  texte: string
  dateDebut: string
  dateFin: string
}

const ENTITIES: Record<string, string> = {
  '&agrave;': 'à', '&eacute;': 'é', '&egrave;': 'è', '&ecirc;': 'ê',
  '&ccedil;': 'ç', '&ugrave;': 'ù', '&ocirc;': 'ô', '&icirc;': 'î',
  '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'",
}

export function stripHtml(html: string): string {
  const withoutTags = html.replace(/<[^>]+>/g, ' ')
  const decoded = withoutTags.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m)
  return decoded.replace(/\s+/g, ' ').trim()
}

export function parseCodeArticle(raw: LegifranceArticle): Article {
  return {
    id: `code:${raw.num}`,
    source: 'code',
    articleId: raw.num,
    title: raw.titre,
    content: stripHtml(raw.texte),
    contentKind: 'prose',
    effectiveFrom: raw.dateDebut,
    effectiveTo: raw.dateFin === '2999-01-01' ? null : raw.dateFin,
    precedence: 0,
  }
}
