/**
 * Build `data/corpus/articles.jsonl` from the unpacked DILA dumps.
 *
 * Run `scripts/fetch-corpus.sh` first. Deterministic: the same dumps produce the same
 * file, byte for byte, so a corpus change always shows up as a reviewable diff.
 */
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseKaliArticleXml, parseLegiArticleXml } from '../src/corpus/dila.js'
import { isCodeArticleInScope, themeOfCodeArticle } from '../src/corpus/themes.js'
import { writeArticles } from '../src/corpus/jsonl.js'
import type { Article } from '../src/corpus/types.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const RAW = join(ROOT, 'data', 'raw', 'ext')
const SYNTEC_CONTAINER = 'KALICONT000005635173' // IDCC 1486
const CODE_ARTICLES = join(
  RAW,
  'legi/global/code_et_TNC_en_vigueur/code_en_vigueur/LEGI/TEXT/00/00/06/07/20/LEGITEXT000006072050/article',
)

/** DILA files live at a path derived from their id: KALIARTI000044253026 -> 00/00/44/25/30. */
function kaliPath(subdirectory: string, prefix: string, id: string): string {
  const digits = id.replace(/^KALI[A-Z]{4}/, '')
  const parts = digits.match(/.{1,2}/g)?.slice(0, 5) ?? []
  return join(RAW, 'kali', 'global', subdirectory, 'KALI', prefix, ...parts, `${id}.xml`)
}

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

function filesUnder(directory: string): string[] {
  const found: string[] = []
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.name.endsWith('.xml')) found.push(path)
    }
  }
  walk(directory)
  return found
}

/**
 * Collect every in-force article of the Syntec convention. Articles hang off 208 separate
 * texts, and off sections nested inside them, so this walks the tree rather than reading a
 * flat list. Only links marked in force are followed: the dump also holds every repealed
 * version of every text.
 */
function syntecArticleIds(): string[] {
  const visited = new Set<string>()
  const articles = new Set<string>()

  const scan = (xml: string) => {
    for (const tag of xml.match(/<LIEN_ART\b[^>]*>/g) ?? []) {
      const id = attr(tag, 'id')
      if (id !== undefined && (attr(tag, 'etat') ?? '').startsWith('VIGUEUR')) articles.add(id)
    }
    for (const tag of xml.match(/<LIEN_SECTION_TA\b[^>]*>/g) ?? []) {
      if ((attr(tag, 'etat') ?? '').startsWith('VIGUEUR')) walkSection(attr(tag, 'id'))
    }
  }

  const walkSection = (id: string | undefined) => {
    if (id === undefined || visited.has(id)) return
    visited.add(id)
    const path = kaliPath('section_ta', 'SCTA', id)
    if (existsSync(path)) scan(readFileSync(path, 'utf8'))
  }

  const container = readFileSync(kaliPath('conteneur', 'CONT', SYNTEC_CONTAINER), 'utf8')
  for (const match of container.matchAll(/idtxt="(KALITEXT\d+)"/g)) {
    const path = kaliPath('texte/struct', 'TEXT', match[1]!)
    if (existsSync(path)) scan(readFileSync(path, 'utf8'))
  }
  return [...articles].sort()
}

function buildConvention(): Article[] {
  const articles: Article[] = []
  for (const id of syntecArticleIds()) {
    const path = kaliPath('article', 'ARTI', id)
    if (existsSync(path)) articles.push(...parseKaliArticleXml(readFileSync(path, 'utf8')))
  }
  return articles
}

function buildCode(): Article[] {
  const articles: Article[] = []
  for (const path of filesUnder(CODE_ARTICLES).sort()) {
    for (const article of parseLegiArticleXml(readFileSync(path, 'utf8'), { includeSuperseded: true })) {
      if (isCodeArticleInScope(article.articleId)) articles.push(article)
    }
  }
  return articles
}

function summarise(articles: Article[]): void {
  const byKind = new Map<string, number>()
  for (const article of articles) {
    const key = `${article.source}/${article.contentKind}`
    byKind.set(key, (byKind.get(key) ?? 0) + 1)
  }
  for (const [key, count] of [...byKind].sort()) console.log(`  ${key}: ${count}`)

  const superseded = articles.filter((article) => article.effectiveTo !== null).length
  console.log(`  superseded versions (carry an end date): ${superseded}`)

  const byTheme = new Map<string, number>()
  for (const article of articles.filter((a) => a.source === 'code')) {
    const theme = themeOfCodeArticle(article.articleId) ?? 'none'
    byTheme.set(theme, (byTheme.get(theme) ?? 0) + 1)
  }
  for (const [theme, count] of [...byTheme].sort()) console.log(`  code theme ${theme}: ${count}`)
}

const convention = buildConvention()
const code = buildCode()
const articles = [...code, ...convention]

const duplicates = articles.length - new Set(articles.map((a) => a.id)).size
if (duplicates > 0) throw new Error(`${duplicates} duplicate article ids — the id scheme is not unique`)

const outputDirectory = join(ROOT, 'data', 'corpus')
mkdirSync(outputDirectory, { recursive: true })
await writeArticles(join(outputDirectory, 'articles.jsonl'), articles)

console.log(`corpus: ${articles.length} articles`)
summarise(articles)
