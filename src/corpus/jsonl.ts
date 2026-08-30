import { readFile, writeFile } from 'node:fs/promises'
import { ArticleSchema, type Article } from './types.js'

export function parseArticleLine(line: string): Article {
  return ArticleSchema.parse(JSON.parse(line))
}

export async function readArticles(path: string): Promise<Article[]> {
  const raw = await readFile(path, 'utf8')
  return raw
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map(parseArticleLine)
}

export async function writeArticles(path: string, articles: Article[]): Promise<void> {
  const body = articles.map((a) => JSON.stringify(ArticleSchema.parse(a))).join('\n')
  await writeFile(path, `${body}\n`, 'utf8')
}
