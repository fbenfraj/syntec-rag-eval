/**
 * Measure whether the LLM judge agrees with a human, and refuse to bless it if it does not.
 *
 *   pnpm judge:calibrate <runId>           write a sample for a human to fill in
 *   pnpm judge:calibrate <runId> --score   read it back and compute Cohen's kappa
 *
 * The judge decides every answer-correctness number this project publishes. Without a
 * measured agreement, "the judge said so" is an assertion, and a judge that simply says
 * CORRECT often enough scores well on a set where most answers are correct — which is why
 * the statistic here is kappa rather than raw agreement.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MINIMUM_KAPPA, cohensKappa } from '../src/metrics/kappa.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const runId = process.argv[2]
const scoring = process.argv.includes('--score')
const SAMPLE = 60

if (runId === undefined) throw new Error('usage: pnpm judge:calibrate <runId> [--score]')

interface Row {
  questionId: string
  question: string
  expected: string
  actual: string
  judgeVerdict: boolean
  humanVerdict: boolean | null
}

const samplePath = join(root, 'data', 'calibration', `${runId}.jsonl`)

if (!scoring) {
  const resultsPath = join(root, 'results', `${runId}.json`)
  if (!existsSync(resultsPath)) throw new Error(`no results at ${resultsPath} — run pnpm eval first`)
  const results = JSON.parse(await readFile(resultsPath, 'utf8')) as {
    rows: { questionId: string; question: string; expected: string; actual: string; judgeCorrect: boolean; category: string }[]
  }

  // Answerable rows only: a refusal is scored by the refusal metrics, not by the judge.
  const judged = results.rows.filter((row) => row.category !== 'unanswerable')
  // Every nth row rather than the first n, so the sample spans the whole set.
  const step = Math.max(1, Math.floor(judged.length / SAMPLE))
  const sample = judged.filter((_, index) => index % step === 0).slice(0, SAMPLE)

  const rows: Row[] = sample.map((row) => ({
    questionId: row.questionId,
    question: row.question,
    expected: row.expected,
    actual: row.actual,
    judgeVerdict: row.judgeCorrect,
    humanVerdict: null,
  }))

  await mkdir(dirname(samplePath), { recursive: true })
  await writeFile(samplePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8')
  console.log(`wrote ${samplePath} — ${rows.length} rows`)
  console.log('Set "humanVerdict" to true or false on every row, then run with --score.')
  console.log('Judge the candidate against the reference only. Do not look at judgeVerdict first.')
} else {
  if (!existsSync(samplePath)) throw new Error(`no sample at ${samplePath} — run without --score first`)
  const rows = (await readFile(samplePath, 'utf8'))
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as Row)

  const unfilled = rows.filter((row) => typeof row.humanVerdict !== 'boolean')
  if (unfilled.length > 0) {
    throw new Error(`${unfilled.length} of ${rows.length} rows still have humanVerdict null: ${unfilled.slice(0, 5).map((r) => r.questionId).join(', ')}`)
  }

  const judge = rows.map((row) => row.judgeVerdict)
  const human = rows.map((row) => row.humanVerdict as boolean)
  const kappa = cohensKappa(judge, human)
  const agreement = judge.filter((verdict, index) => verdict === human[index]).length / rows.length

  const disagreements = rows.filter((row) => row.judgeVerdict !== row.humanVerdict)
  console.log(`${rows.length} rows`)
  console.log(`  judge says correct : ${judge.filter(Boolean).length}`)
  console.log(`  human says correct : ${human.filter(Boolean).length}`)
  console.log(`  raw agreement      : ${(agreement * 100).toFixed(1)}%`)
  console.log(`  Cohen's kappa      : ${kappa.toFixed(3)}`)
  if (disagreements.length > 0) {
    console.log('\ndisagreements:')
    for (const row of disagreements.slice(0, 12)) {
      console.log(`  ${row.questionId}: judge ${row.judgeVerdict ? 'CORRECT' : 'INCORRECT'}, human ${row.humanVerdict ? 'CORRECT' : 'INCORRECT'}`)
      console.log(`    q: ${row.question.slice(0, 90)}`)
      console.log(`    ref: ${row.expected.slice(0, 90)}`)
      console.log(`    got: ${row.actual.slice(0, 90)}`)
    }
  }

  if (kappa < MINIMUM_KAPPA) {
    console.error(`\nkappa ${kappa.toFixed(3)} is below the ${MINIMUM_KAPPA} threshold.`)
    console.error('Revise the rubric in src/metrics/judge.ts and re-run the eval before publishing any')
    console.error('answer-correctness number. Publishing now would mean publishing the judge\'s bias.')
    process.exit(1)
  }
  console.log(`\nkappa clears the ${MINIMUM_KAPPA} threshold — answer correctness is fit to publish`)
}
