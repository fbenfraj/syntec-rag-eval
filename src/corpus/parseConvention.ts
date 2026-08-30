import type { Article } from './types.js'

const HEADING = /^##\s+Article\s+([\w.-]+)\s*-\s*(.+)$/

function isTableLine(line: string): boolean {
  return line.trimStart().startsWith('|')
}

export function parseConventionMarkdown(markdown: string): Article[] {
  const articles: Article[] = []
  let articleId: string | null = null
  let title = ''
  let prose: string[] = []
  let tables: string[][] = []
  let currentTable: string[] | null = null

  const flush = () => {
    if (articleId === null) return
    const base = {
      source: 'convention' as const,
      articleId,
      title,
      effectiveFrom: null,
      effectiveTo: null,
      precedence: 1,
    }
    const text = prose.join('\n').trim()
    if (text.length > 0) {
      articles.push({ ...base, id: `convention:${articleId}`, content: text, contentKind: 'prose' })
    }
    tables.forEach((rows, i) => {
      articles.push({
        ...base,
        id: `convention:${articleId}#table-${i + 1}`,
        content: `${title}\n${rows.join('\n')}`,
        contentKind: 'table',
      })
    })
    prose = []
    tables = []
    currentTable = null
  }

  for (const line of markdown.split('\n')) {
    const heading = HEADING.exec(line.trim())
    if (heading) {
      flush()
      articleId = heading[1]!
      title = heading[2]!
      continue
    }
    if (isTableLine(line)) {
      if (currentTable === null) {
        currentTable = []
        tables.push(currentTable)
      }
      currentTable.push(line.trim())
      continue
    }
    currentTable = null
    prose.push(line)
  }
  flush()
  return articles
}
