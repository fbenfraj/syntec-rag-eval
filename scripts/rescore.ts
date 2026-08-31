/**
 * Recompute metrics from committed result files, without calling any provider.
 *
 * Every row stores what it retrieved, cited and required, so a metric can be corrected
 * after the fact for free. That is the reason the rows are stored rather than just the
 * aggregates: a scoring bug found later should cost nothing to fix, and re-billing a run
 * to repair arithmetic would be an incentive to leave the bug alone.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { citationCorrectness } from '../src/metrics/answer.js'
import { aggregate } from '../src/eval/aggregate.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resultsDir = join(root, 'results')
// summary.json is generated from the runs, not one of them.
const files = (await readdir(resultsDir)).filter((name) => name.endsWith('.json') && name !== 'summary.json')

for (const name of files) {
  const path = join(resultsDir, name)
  const run = JSON.parse(await readFile(path, 'utf8')) as RunResult
  const before = run.aggregates.citationCorrectness

  run.rows = run.rows.map((row) => ({
    ...row,
    citationCorrectness: citationCorrectness(row.citations, row.requiredArticles),
  }))
  run.aggregates = aggregate(run.rows)

  await writeFile(path, `${JSON.stringify(run, null, 2)}\n`, 'utf8')
  const after = run.aggregates.citationCorrectness
  console.log(`${run.config.padEnd(9)} citation F1 ${(before * 100).toFixed(1)}% -> ${(after * 100).toFixed(1)}%`)
}
