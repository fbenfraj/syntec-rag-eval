/**
 * The corpus is deliberately narrow. Four themes were chosen because each one is a real
 * question a Syntec employee asks, and each one is a place where the convention and the
 * code say different things — which is what makes precedence worth measuring.
 */
export const THEMES = ['contract', 'termination', 'working-time', 'pay'] as const
export type Theme = (typeof THEMES)[number]

/**
 * Which Code du travail articles belong to a theme, by number.
 *
 * Numbering in the code is hierarchical: L1221-19 is book 1, title 2, chapter 21. Matching
 * on the chapter prefix therefore selects a coherent chapter rather than a keyword guess,
 * and can be checked against the code's own table of contents by anyone reviewing this.
 */
const CODE_CHAPTERS: Record<Theme, readonly string[]> = {
  // Formation of the contract, trial periods, and fixed-term contracts.
  contract: ['1221', '1222', '1223', '1224', '1225', '1241', '1242', '1243', '1244', '1245', '1246', '1247', '1248'],
  // Notice, dismissal, resignation, and termination by agreement.
  termination: ['1231', '1232', '1233', '1234', '1235', '1236', '1237', '1238', '1239'],
  // Working time, overtime, and the forfait-jours regime.
  'working-time': ['3111', '3121', '3122', '3123', '3131', '3132', '3133', '3134'],
  // Classification, the minimum wage, and how pay must be settled.
  pay: ['3221', '3231', '3232', '3241', '3242', '3243', '3244', '3245', '3246'],
}

/** `L1221-19` and `R1234-1` both carry the chapter `1221` / `1234`. */
export function codeChapterOf(articleId: string): string | null {
  return articleId.match(/^[LRD](\d{4})-/)?.[1] ?? null
}

/** The theme a Code du travail article belongs to, or null if it is out of scope. */
export function themeOfCodeArticle(articleId: string): Theme | null {
  const chapter = codeChapterOf(articleId)
  if (chapter === null) return null
  for (const theme of THEMES) {
    if (CODE_CHAPTERS[theme].includes(chapter)) return theme
  }
  return null
}

export function isCodeArticleInScope(articleId: string): boolean {
  return themeOfCodeArticle(articleId) !== null
}
