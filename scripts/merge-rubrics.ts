/**
 * Fold a second rubric's verdicts into the results, so correctness can be published as a
 * range rather than as a number nobody validated.
 *
 *   pnpm merge-rubrics <directory-of-earlier-results>
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { aggregate } from '../src/eval/aggregate.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = process.argv[2]
if (source === undefined) throw new Error('usage: pnpm merge-rubrics <directory>')

const resultsDir = join(root, 'results')
for (const name of (await readdir(resultsDir)).filter((n) => n.endsWith('.json') && n !== 'summary.json')) {
  const earlierPath = join(source, name)
  if (!existsSync(earlierPath)) {
    console.log(`${name}: no earlier verdicts, skipped`)
    continue
  }
  const earlier = JSON.parse(await readFile(earlierPath, 'utf8')) as RunResult
  const lenient = new Map(earlier.rows.map((row) => [row.questionId, row.answerCorrect]))

  const path = join(resultsDir, name)
  const run = JSON.parse(await readFile(path, 'utf8')) as RunResult
  for (const row of run.rows) {
    const verdict = lenient.get(row.questionId)
    if (typeof verdict === 'boolean') row.answerCorrectLenient = verdict
  }
  run.aggregates = aggregate(run.rows)
  await writeFile(path, `${JSON.stringify(run, null, 2)}\n`, 'utf8')

  const a = run.aggregates
  console.log(
    `${run.config.padEnd(9)} correctness ${(a.answerCorrectness * 100).toFixed(1)}–${((a.answerCorrectnessLenient ?? 0) * 100).toFixed(1)}% · ` +
      `wrong under both ${(a.answerWrongUnderBoth * 100).toFixed(1)}% · rubric-dependent ${(a.answerRubricDependent * 100).toFixed(1)}%`,
  )
}
