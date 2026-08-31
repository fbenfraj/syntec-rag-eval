/**
 * Re-judge stored answers after a rubric change, without re-running retrieval or generation.
 *
 *   pnpm rejudge [config]
 *
 * The answers are already in the results file, so changing how they are graded costs only
 * the judge calls. That matters: if fixing the rubric meant paying for a whole run, the
 * incentive would be to leave a known-bad rubric in place.
 *
 * Unanswerable questions are untouched — they are scored by whether the system refused,
 * which no rubric change affects.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JUDGE_MODEL } from '../src/llm/client.js'
import { budgetEur, totalSpentEur } from '../src/llm/budget.js'
import { judgeAnswer } from '../src/metrics/judge.js'
import { aggregate } from '../src/eval/aggregate.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resultsDir = join(root, 'results')
const only = process.argv[2]

const files = (await readdir(resultsDir)).filter(
  (name) => name.endsWith('.json') && name !== 'summary.json' && (only === undefined || name.startsWith(`${only}-`)),
)
if (files.length === 0) throw new Error(`no result files${only === undefined ? '' : ` for config '${only}'`}`)

console.log(`re-judging ${files.length} run(s) with ${JUDGE_MODEL}`)
console.log(`budget: ${totalSpentEur().toFixed(4)} of ${budgetEur().toFixed(2)} EUR\n`)

for (const name of files) {
  const path = join(resultsDir, name)
  const run = JSON.parse(await readFile(path, 'utf8')) as RunResult
  const before = run.aggregates.answerCorrectness
  let changed = 0

  for (const [index, row] of run.rows.entries()) {
    if (row.category === 'unanswerable') continue
    const verdict = await judgeAnswer({
      question: row.question,
      expected: row.expected,
      actual: row.actual,
      model: JUDGE_MODEL,
    })
    if (verdict.correct !== row.answerCorrect) changed += 1
    row.answerCorrect = verdict.correct
    row.judgeReason = verdict.reason
    if ((index + 1) % 40 === 0) process.stdout.write(`  ${run.config}: ${index + 1}/${run.rows.length}\r`)
  }

  run.aggregates = aggregate(run.rows)
  await writeFile(path, `${JSON.stringify(run, null, 2)}\n`, 'utf8')
  console.log(
    `${run.config.padEnd(9)} answer correctness ${(before * 100).toFixed(1)}% -> ` +
      `${(run.aggregates.answerCorrectness * 100).toFixed(1)}% (${changed} verdict(s) changed)`,
  )
}

console.log(`\ntotal spent: ${totalSpentEur().toFixed(4)} of ${budgetEur().toFixed(2)} EUR`)
