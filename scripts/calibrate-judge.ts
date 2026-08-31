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
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MINIMUM_KAPPA, cohensKappa } from '../src/metrics/kappa.js'
import type { RunResult } from '../src/eval/run.js'
import { stratifiedKappa } from '../src/metrics/calibration.js'

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
  const results = JSON.parse(await readFile(resultsPath, 'utf8')) as RunResult

  // Answerable rows only: a refusal is scored by the refusal metrics, not by the judge.
  let judged = results.rows.filter((row) => row.category !== 'unanswerable')

  // A rubric revised from an earlier calibration must be measured on rows it was not fitted
  // to. Otherwise kappa reports how well the rubric memorised its own training sample.
  const archive = join(root, 'data', 'calibration', 'round-1')
  if (existsSync(archive)) {
    const used = new Set<string>()
    for (const name of readdirSync(archive)) {
      if (!name.endsWith('.jsonl')) continue
      for (const line of readFileSync(join(archive, name), 'utf8').split('\n')) {
        if (line.trim().length === 0) continue
        const row = JSON.parse(line) as { questionId: string; humanVerdict: boolean | null }
        if (typeof row.humanVerdict === 'boolean') used.add(row.questionId)
      }
    }
    const before = judged.length
    judged = judged.filter((row) => !used.has(row.questionId))
    console.log(`excluding ${before - judged.length} row(s) a human already labelled in an earlier round`)
  }
  // Every nth row rather than the first n, so the sample spans the whole set.
  const step = Math.max(1, Math.floor(judged.length / SAMPLE))
  const sample = judged.filter((_, index) => index % step === 0).slice(0, SAMPLE)

  const rows: Row[] = sample.map((row) => {
    if (typeof row.answerCorrect !== 'boolean') {
      throw new Error(`${row.questionId}: the run has no judge verdict — the results file is from an older format`)
    }
    return ({
    questionId: row.questionId,
    question: row.question,
    expected: row.expected,
    actual: row.actual,
    judgeVerdict: row.answerCorrect,
    humanVerdict: null,
  })})

  await mkdir(dirname(samplePath), { recursive: true })
  await writeFile(samplePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8')

  // A markdown sheet as well as the JSONL: editing 60 JSON lines by hand invites a typo
  // that silently drops a row from the sample. The judge's own verdict is deliberately not
  // shown — seeing it first turns the exercise into agreeing with it.
  const sheet: string[] = [
    `# Judge calibration — ${runId}`,
    '',
    `${rows.length} answers. For each, decide one thing: **does the produced answer say the same`,
    'thing as the reference?** Different wording is fine. A different number, a missing central',
    'element, or vagueness that dodges the question is not.',
    '',
    'Mark `[x]` if it matches the reference, `[!]` if it does not. Then run:',
    '',
    '```',
    `pnpm judge:apply-calibration ${runId}`,
    `pnpm judge:calibrate ${runId} --score`,
    '```',
    '',
    'The judge\'s own verdict is hidden on purpose. This sample is the one place in the project',
    'where a human is not replaceable: agreement between two models would measure whether they',
    'share a bias, which is exactly what calibration exists to rule out.',
    '',
    '---',
    '',
  ]
  for (const row of rows) {
    sheet.push(`## ${row.questionId}`, '')
    sheet.push('- [ ] matches the reference', '')
    sheet.push(`**Question.** ${row.question}`, '')
    sheet.push(`**Reference.** ${row.expected}`, '')
    sheet.push(`**Produced.** ${row.actual.replace(/\n/g, ' ') || '_(refused)_'}`, '')
    sheet.push('---', '')
  }
  await writeFile(samplePath.replace(/\.jsonl$/, '.md'), sheet.join('\n'), 'utf8')

  console.log(`wrote ${samplePath}`)
  console.log(`wrote ${samplePath.replace(/\.jsonl$/, '.md')} — ${rows.length} rows to mark`)
  console.log('Mark the markdown sheet, then run pnpm judge:apply-calibration <runId>.')
} else {
  if (!existsSync(samplePath)) throw new Error(`no sample at ${samplePath} — run without --score first`)
  const rows = (await readFile(samplePath, 'utf8'))
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as Row)

  // With a two-phase split, most rows are deliberately unread; without one, every row must
  // be read or the sample is not the sample that was designed.
  const twoPhase = existsSync(`${samplePath.replace(/\.jsonl$/, '')}-strata.json`)
  const unfilled = rows.filter((row) => typeof row.humanVerdict !== 'boolean')
  if (!twoPhase && unfilled.length > 0) {
    throw new Error(`${unfilled.length} of ${rows.length} rows still have humanVerdict null: ${unfilled.slice(0, 5).map((r) => r.questionId).join(', ')}`)
  }

  const labelled = rows.filter((row) => typeof row.humanVerdict === 'boolean')
  const judge = labelled.map((row) => row.judgeVerdict)
  const human = labelled.map((row) => row.humanVerdict as boolean)

  // Two-phase sampling if a screening split exists: a human read every disagreement and a
  // sample of the agreements, and each group is weighted to its true size. Otherwise every
  // row was read and plain Cohen's kappa is the same thing.
  const strataPath = `${samplePath.replace(/\.jsonl$/, '')}-strata.json`
  let kappa: number
  let agreement: number
  let note = `all ${labelled.length} rows read by a human`

  if (existsSync(strataPath)) {
    const split = JSON.parse(await readFile(strataPath, 'utf8')) as { disagree: string[]; agree: string[] }
    const pick = (ids: string[]) =>
      labelled
        .filter((row) => ids.includes(row.questionId))
        .map((row) => ({ judge: row.judgeVerdict, human: row.humanVerdict as boolean }))
    const estimate = stratifiedKappa([
      { size: split.disagree.length, labelled: pick(split.disagree) },
      { size: split.agree.length, labelled: pick(split.agree) },
    ])
    kappa = estimate.kappa
    agreement = estimate.agreement
    note =
      `two-phase: ${estimate.labelled} rows read of ${estimate.population}; ` +
      `${split.disagree.length} screened as disagreements (all read), ` +
      `${split.agree.length} as agreements (${pick(split.agree).length} sampled). ` +
      `Kappa on read rows alone: ${estimate.kappaOnLabelled.toFixed(3)}`
  } else {
    kappa = cohensKappa(judge, human)
    agreement = judge.filter((verdict, index) => verdict === human[index]).length / labelled.length
  }

  const disagreements = labelled.filter((row) => row.judgeVerdict !== row.humanVerdict)
  console.log(note)
  console.log(`  judge says correct : ${judge.filter(Boolean).length} of ${labelled.length} read`)
  console.log(`  human says correct : ${human.filter(Boolean).length} of ${labelled.length} read`)
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
