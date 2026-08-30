/** Mechanical checks on the gold set. Exits non-zero if anything is wrong. */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { readGoldSet, lexicalOverlap, validateGoldSet } from '../src/gold/validate.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))
const byId = new Map(articles.map((article) => [article.id, article]))
const problems = validateGoldSet(questions, new Set(byId.keys()))

const share = (count: number) => `${count} (${Math.round((count / questions.length) * 100)}%)`
const tally = <T>(values: T[]) => {
  const counts = new Map<T, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts].sort((a, b) => String(a[0]).localeCompare(String(b[0])))
}

console.log(`${questions.length} questions`)
for (const [category, count] of tally(questions.map((q) => q.category))) console.log(`  ${category}: ${share(count)}`)
console.log('tier')
for (const [tier, count] of tally(questions.map((q) => q.tier))) console.log(`  ${tier}: ${share(count)}`)
console.log('provenance')
for (const [provenance, count] of tally(questions.map((q) => q.provenance))) console.log(`  ${provenance}: ${share(count)}`)

const answerable = questions.filter((q) => q.requiredArticles.length > 0)
const overlaps = answerable.map((q) =>
  lexicalOverlap(q.question, q.requiredArticles.map((id) => byId.get(id)?.content ?? '')),
)
const mean = overlaps.reduce((sum, value) => sum + value, 0) / Math.max(1, overlaps.length)
const high = overlaps.filter((value) => value > 0.7).length
console.log(`\nlexical overlap with the cited article: mean ${(mean * 100).toFixed(1)}%, ${high} question(s) above 70%`)
console.log('(high overlap means the question borrows the article\'s wording, which flatters retrieval)')

if (problems.length > 0) {
  console.error(`\n${problems.length} problems:`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log('\ngold set valid')
