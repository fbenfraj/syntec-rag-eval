/**
 * Write `results/FAILURES.md`: every question the winning configuration got wrong, grouped
 * by what went wrong, with an empty analysis line under each for the human root cause.
 *
 * A leaderboard says how often the system is wrong. This says how, which is the only form
 * that tells you what to fix.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { FAILURE_DESCRIPTIONS, catalogue, type FailureKind } from '../src/eval/failures.js'
import { LADDER } from '../src/retrieval/configs.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resultsDir = join(root, 'results')

const runs = await Promise.all(
  (await readdir(resultsDir))
    .filter((name) => name.endsWith('.json'))
    .map(async (name) => JSON.parse(await readFile(join(resultsDir, name), 'utf8')) as RunResult),
)

const latest = new Map<string, RunResult>()
for (const run of runs.sort((a, b) => a.startedAt.localeCompare(b.startedAt))) latest.set(run.config, run)

// The winning rung is the last one on the ladder that actually ran, not the best-scoring
// one: the catalogue documents the system as shipped, not its most flattering variant.
const winner = [...LADDER].reverse().map((config) => latest.get(config.name)).find((run) => run !== undefined)
if (winner === undefined) throw new Error('no results — run pnpm eval first')

const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const byId = new Map(articles.map((article) => [article.id, article]))
const label = (id: string) => {
  const article = byId.get(id)
  return article === undefined ? id : `${id} (${article.source} ${article.articleId})`
}

const grouped = catalogue(winner.rows)
const failed = [...grouped.values()].reduce((sum, rows) => sum + rows.length, 0)

const ORDER: FailureKind[] = [
  'retrieval-miss', 'partial-retrieval-miss', 'generation-miss', 'rubric-dependent',
  'false-refusal', 'missed-refusal', 'stale-law', 'citation-miss',
]

const lines: string[] = [
  '# Failure catalogue',
  '',
  `Configuration \`${winner.config}\`, ${winner.rows.length} questions, ${failed} with something wrong (${((failed / winner.rows.length) * 100).toFixed(1)}%).`,
  `Generator \`${winner.model}\`, judge \`${winner.judgeModel}\`.`,
  '',
  '## What went wrong, and how often',
  '',
  '| failure | n | share | what it means |',
  '|---|---|---|---|',
]

for (const kind of ORDER) {
  const rows = grouped.get(kind) ?? []
  if (rows.length === 0) continue
  lines.push(`| \`${kind}\` | ${rows.length} | ${((rows.length / winner.rows.length) * 100).toFixed(1)}% | ${FAILURE_DESCRIPTIONS[kind]} |`)
}

lines.push(
  '',
  'The split between `retrieval-miss` and `generation-miss` is the one that matters. The first',
  'means the governing article never reached the model, and no amount of prompting will fix it.',
  'The second means it was there and the answer was still wrong. A single accuracy number',
  'merges the two and points at neither.',
  '',
)

for (const kind of ORDER) {
  const rows = grouped.get(kind) ?? []
  if (rows.length === 0) continue
  lines.push(`## \`${kind}\` — ${rows.length}`, '', `_${FAILURE_DESCRIPTIONS[kind]}_`, '')
  for (const row of rows) {
    lines.push(`### ${row.questionId} · ${row.category} · tier ${row.tier}`, '')
    lines.push(`**Question.** ${row.question}`, '')
    lines.push(`**Expected.** ${row.expected}`, '')
    lines.push(`**Produced.** ${row.actual.replace(/\n/g, ' ').slice(0, 600) || '_(refused)_'}`, '')
    if (row.requiredArticles.length > 0) lines.push(`**Required.** ${row.requiredArticles.map(label).join(', ')}`, '')
    lines.push(`**Retrieved.** ${row.retrievedIds.length > 0 ? row.retrievedIds.map(label).join(', ') : '_(nothing)_'}`, '')
    if (row.citations.length > 0) lines.push(`**Cited.** ${row.citations.join(', ')}`, '')
    if (row.supersededRetrieved.length > 0) lines.push(`**Repealed articles retrieved.** ${row.supersededRetrieved.join(', ')}`, '')
    lines.push(`**recall@5** ${row.recallAtK.toFixed(2)} · **citation F1** ${row.citationCorrectness.toFixed(2)}`, '')
    if (row.judgeReason.length > 0) lines.push(`**Judge.** ${row.judgeReason}`, '')
    lines.push('**Analyse:**', '', '---', '')
  }
}

await writeFile(join(resultsDir, 'FAILURES.md'), lines.join('\n'), 'utf8')
console.log(`wrote results/FAILURES.md — ${failed} failures across ${grouped.size} kind(s) for config '${winner.config}'`)
for (const kind of ORDER) {
  const rows = grouped.get(kind) ?? []
  if (rows.length > 0) console.log(`  ${kind.padEnd(24)} ${rows.length}`)
}
