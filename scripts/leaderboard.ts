/**
 * Render every committed result into `results/LEADERBOARD.md`.
 *
 * One row per rung, in ladder order, with the delta against the rung below. The delta is
 * the point: each rung adds exactly one capability, so the difference between two rows is
 * what that capability bought.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LADDER } from '../src/retrieval/configs.js'
import { EUR_PER_USD, RATE_DATE } from '../src/llm/pricing.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resultsDir = join(root, 'results')
if (!existsSync(resultsDir)) throw new Error('no results/ directory — run pnpm eval first')

const files = (await readdir(resultsDir)).filter((name) => name.endsWith('.json'))
if (files.length === 0) throw new Error('no result files — run pnpm eval first')

const runs = await Promise.all(
  files.map(async (name) => JSON.parse(await readFile(join(resultsDir, name), 'utf8')) as RunResult),
)

// Latest run per config, so re-running one rung supersedes it without deleting history.
const latest = new Map<string, RunResult>()
for (const run of runs.sort((a, b) => a.startedAt.localeCompare(b.startedAt))) latest.set(run.config, run)

const ordered = LADDER.map((config) => latest.get(config.name)).filter((run): run is RunResult => run !== undefined)
if (ordered.length === 0) throw new Error('no results matched a ladder rung')

const pct = (value: number | null) => (value === null ? 'n/a' : `${(value * 100).toFixed(1)}%`)
/**
 * Signed change in percentage points against the rung below. Always signed, never
 * annotated as good or bad: which direction is an improvement depends on the column, and
 * the columns say so themselves.
 */
const delta = (current: number | null, previous: number | null) => {
  if (current === null || previous === null) return ''
  const difference = (current - previous) * 100
  if (Math.abs(difference) < 0.05) return ' (=)'
  return ` (${difference > 0 ? '+' : '−'}${Math.abs(difference).toFixed(1)})`
}

const capabilities = (name: string) => {
  const config = LADDER.find((rung) => rung.name === name)
  if (config === undefined) return ''
  return [
    config.chunking === 'article' ? 'article chunks' : 'fixed chunks',
    config.lexical ? 'lexical' : null,
    config.rerank ? 'rerank' : null,
    config.rewrite ? 'rewrite' : null,
    config.filter ? 'date filter + precedence' : null,
  ].filter(Boolean).join(' + ')
}

const first = ordered[0]!
const lines: string[] = [
  '# Ablation leaderboard',
  '',
  `Gold set: **${first.goldSetSize} questions**. Generator: \`${first.model}\`. Judge: \`${first.judgeModel}\`.`,
  `Prices converted at ${EUR_PER_USD} EUR/USD as of ${RATE_DATE}.`,
  '',
  'Each rung adds exactly one capability to the rung above it, so the change in a column is',
  'attributable to that one capability. Deltas are percentage points against the previous rung.',
  '',
  '## Retrieval',
  '',
  '| rung | adds | recall@5 | full recall@5 | MRR | repealed retrieved |',
  '|---|---|---|---|---|---|',
]

ordered.forEach((run, index) => {
  const previous = index === 0 ? null : ordered[index - 1]!.aggregates
  const a = run.aggregates
  lines.push(
    `| \`${run.config}\` | ${capabilities(run.config)} | ${pct(a.recallAt5)}${delta(a.recallAt5, previous?.recallAt5 ?? null)} | ` +
      `${pct(a.fullRecallAt5)} | ${a.mrr.toFixed(3)} | ${pct(a.supersededRate)}${delta(a.supersededRate, previous?.supersededRate ?? null)} |`,
  )
})

lines.push(
  '',
  '`repealed retrieved` is the share of answerable questions where an article that had already',
  'ceased to apply reached the top 5. It is the failure that matters most in legal search, and',
  'lower is better.',
  '',
  '## Answer quality',
  '',
  '| rung | answer correctness | citation F1 | refusal accuracy | false-refusal rate |',
  '|---|---|---|---|---|',
)

ordered.forEach((run, index) => {
  const previous = index === 0 ? null : ordered[index - 1]!.aggregates
  const a = run.aggregates
  lines.push(
    `| \`${run.config}\` | ${pct(a.answerCorrectness)}${delta(a.answerCorrectness, previous?.answerCorrectness ?? null)} | ` +
      `${pct(a.citationCorrectness)}${delta(a.citationCorrectness, previous?.citationCorrectness ?? null)} | ${pct(a.refusalAccuracy)} | ${pct(a.falseRefusalRate)}${delta(a.falseRefusalRate, previous?.falseRefusalRate ?? null)} |`,
  )
})

lines.push(
  '',
  'Refusal accuracy and false-refusal rate are always shown together. Either alone is easy to',
  'optimise and meaningless: a system that refuses every question scores 100% on the first and',
  '100% on the second.',
  '',
  '## Cost and latency',
  '',
  '| rung | EUR / query | input tok | output tok | p50 ms | p95 ms |',
  '|---|---|---|---|---|---|',
)

for (const run of ordered) {
  const a = run.aggregates
  lines.push(
    `| \`${run.config}\` | ${a.costEurPerQuery.toFixed(5)} | ${Math.round(a.inputTokensPerQuery)} | ` +
      `${Math.round(a.outputTokensPerQuery)} | ${a.latencyP50Ms} | ${a.latencyP95Ms} |`,
  )
}

lines.push(
  '',
  'Cost is derived from token counts, not from what this particular run was billed: a cached',
  'replay is free to re-run but is not free to operate, and this column reports the cost of',
  'operating the system.',
  '',
  '---',
  '',
  `Generated from ${ordered.length} result file(s) in \`results/\`. Every run is committed, so the`,
  'score history is in git and no number here can be quietly revised.',
  '',
)

await writeFile(join(resultsDir, 'LEADERBOARD.md'), lines.join('\n'), 'utf8')
console.log(`wrote results/LEADERBOARD.md from ${ordered.length} rung(s)`)
