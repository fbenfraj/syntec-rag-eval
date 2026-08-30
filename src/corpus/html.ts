const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  agrave: 'à', eacute: 'é', egrave: 'è', ecirc: 'ê', ccedil: 'ç',
  ugrave: 'ù', ocirc: 'ô', icirc: 'î', deg: '°', euro: '€',
  laquo: '«', raquo: '»', rsquo: '’', hellip: '…', ndash: '–', mdash: '—',
}

export function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body.startsWith('#')) {
      const code = body[1] === 'x' || body[1] === 'X'
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return NAMED[body.toLowerCase()] ?? match
  })
}

/**
 * Normalise whitespace without joining paragraphs. Each block element already
 * contributes one newline, so runs of newlines collapse back to a single one:
 * an alinéa boundary is one line break, never a blank line.
 */
function tidy(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

/** HTML to plain text, preserving paragraph and list-item boundaries as newlines. */
export function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|li|tr|h[1-6])\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '\n- ')
  return tidy(decodeEntities(withBreaks.replace(/<[^>]*>/g, ' ')))
}

function cellsOf(row: string, tagName: 'td' | 'th'): string[] {
  const pattern = new RegExp(`<\\s*${tagName}[^>]*>([\\s\\S]*?)<\\s*/\\s*${tagName}\\s*>`, 'gi')
  return [...row.matchAll(pattern)].map((m) => htmlToText(m[1] ?? '').replace(/\n+/g, ' ').replace(/\|/g, '\\|'))
}

/** Render one HTML table as a GitHub-flavoured markdown table. */
export function tableToMarkdown(tableHtml: string): string {
  const rows = [...tableHtml.matchAll(/<\s*tr[^>]*>([\s\S]*?)<\s*\/\s*tr\s*>/gi)]
    .map((m) => {
      const body = m[1] ?? ''
      const header = cellsOf(body, 'th')
      return header.length > 0 ? { cells: header, header: true } : { cells: cellsOf(body, 'td'), header: false }
    })
    .filter((row) => row.cells.length > 0)

  if (rows.length === 0) return ''
  const width = Math.max(...rows.map((r) => r.cells.length))
  const pad = (cells: string[]) => [...cells, ...Array<string>(width - cells.length).fill('')]
  const line = (cells: string[]) => `| ${pad(cells).join(' | ')} |`

  const first = rows[0]!
  const body = rows.slice(1)
  return [line(first.cells), `| ${Array<string>(width).fill('---').join(' | ')} |`, ...body.map((r) => line(r.cells))].join('\n')
}

export interface SplitContent {
  prose: string
  tables: string[]
}

/**
 * Separate an HTML fragment into prose and markdown tables. A salary grid must never be
 * split across a prose chunk boundary, so tables leave the prose entirely.
 */
export function splitProseAndTables(html: string): SplitContent {
  const tables: string[] = []
  const withoutTables = html.replace(/<\s*table[^>]*>[\s\S]*?<\s*\/\s*table\s*>/gi, (table) => {
    const markdown = tableToMarkdown(table)
    if (markdown.length > 0) tables.push(markdown)
    return '\n'
  })
  return { prose: htmlToText(withoutTables), tables }
}
