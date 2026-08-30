/** Freeze the leaderboard into `results/summary.json`, which the report site renders. */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSummary } from '../src/report/summary.js'
import type { RunResult } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resultsDir = join(root, 'results')
const runs = await Promise.all(
  (await readdir(resultsDir))
    .filter((name) => name.endsWith('.json') && name !== 'summary.json')
    .map(async (name) => JSON.parse(await readFile(join(resultsDir, name), 'utf8')) as RunResult),
)

const summary = buildSummary(runs)
await writeFile(join(resultsDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
console.log(`wrote results/summary.json — ${summary.rungs.length} rungs, ${summary.totalFailures} failures`)
