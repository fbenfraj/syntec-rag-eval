import type { Source } from '../corpus/types'

export interface Hit {
  id: string
  articleId: string
  source: Source
  content: string
  score: number
  precedence: number
  effectiveFrom: string | null
  effectiveTo: string | null
}

/**
 * Every search returns the same shape, so hits from different retrievers can be fused.
 * Dates are read back as strings rather than Date objects: they are compared against the
 * gold set's `asOf` string, and a timezone-shifted Date would silently move an article in
 * or out of force.
 */
export const HIT_COLUMNS = `
  id, article_id AS "articleId", source, content, precedence,
  to_char(effective_from, 'YYYY-MM-DD') AS "effectiveFrom",
  to_char(effective_to, 'YYYY-MM-DD') AS "effectiveTo"
`

/** Rung 1 of the ablation ladder reads the fixed-size chunks instead of whole articles. */
export type ArticleTable = 'articles' | 'articles_fixed'
