/**
 * Run one rung of the ablation ladder over the gold set and commit the numbers.
 *
 *   pnpm eval [config] [--limit N] [--all]
 *
 * Every run writes `results/<runId>.json`, which is committed, so score history lives in
 * git and a number can never be quietly revised.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readGoldSet } from '../src/gold/validate.js'
import { getPool } from '../src/db/pool.js'
import { GENERATION_MODEL, JUDGE_MODEL } from '../src/llm/client.js'
import { budgetEur, totalSpentEur } from '../src/llm/budget.js'
import { LADDER, getConfig } from '../src/retrieval/configs.js'
import { runEval } from '../src/eval/run.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const limitFlag = args.indexOf('--limit')
const limit = limitFlag === -1 ? Infinity : Number(args[limitFlag + 1])
const runAll = args.includes('--all')
const named = args.find((arg) => !arg.startsWith('--') && arg !== String(limit))

const configs = runAll ? LADDER : [getConfig(named ?? 'filtered')]
const all = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))
const questions = Number.isFinite(limit) ? all.slice(0, limit) : all

// A timestamp is passed in rather than taken inside, so every rung of one ladder shares a
// run id and the leaderboard can group them.
const startedAt = new Date().toISOString().replace(/[:.]/g, '-')
// Questions without their own date are taken as asked today, so the date filter applies to
// the whole set rather than only to the 23 explicitly dated ones.
const asOfDefault = new Date().toISOString().slice(0, 10)
const pool = getPool()

console.log(`${questions.length} questions · ${configs.length} config(s) · ${GENERATION_MODEL} · judge ${JUDGE_MODEL}`)
console.log(`as-of date for undated questions: ${asOfDefault}`)
console.log(`budget: ${totalSpentEur().toFixed(4)} of ${budgetEur().toFixed(2)} EUR spent\n`)

try {
  for (const config of configs) {
    const before = totalSpentEur()
    const result = await runEval({
      pool,
      questions,
      config,
      model: GENERATION_MODEL,
      judgeModel: JUDGE_MODEL,
      startedAt,
      asOfDefault,
      onProgress: (done, total) => {
        if (done % 25 === 0 || done === total) process.stdout.write(`  ${config.name}: ${done}/${total}\r`)
      },
    })

    await mkdir(join(root, 'results'), { recursive: true })
    await writeFile(join(root, 'results', `${result.runId}.json`), `${JSON.stringify(result, null, 2)}\n`, 'utf8')

    const a = result.aggregates
    const pct = (value: number | null) => (value === null ? '  n/a' : `${(value * 100).toFixed(1)}%`)
    console.log(
      `\n${config.name.padEnd(9)} recall@5 ${pct(a.recallAt5)} · answer ${pct(a.answerCorrectness)} · ` +
        `cite ${pct(a.citationCorrectness)} · refusal ${pct(a.refusalAccuracy)} · false-refusal ${pct(a.falseRefusalRate)}`,
    )
    console.log(
      `${' '.repeat(9)} repealed-retrieved ${pct(a.supersededRate)} · ${a.costEurPerQuery.toFixed(5)} EUR/q · ` +
        `p95 ${a.latencyP95Ms} ms · billed ${(totalSpentEur() - before).toFixed(4)} EUR`,
    )
  }
} finally {
  await pool.end()
}

console.log(`\ntotal spent: ${totalSpentEur().toFixed(4)} of ${budgetEur().toFixed(2)} EUR`)
