/**
 * Phase one of two-phase judge calibration: build a pack for a second, independent model.
 *
 *   pnpm judge:prescreen <runId>            write the pack
 *   pnpm judge:prescreen <runId> --apply    read verdicts back and emit the human sheet
 *
 * The second model never gets the last word. Its only job is to say where it disagrees
 * with the judge, so a human's time goes to the rows where a judgement actually decides
 * something instead of being spread evenly over rows nobody disputes.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const runId = process.argv[2]
const applying = process.argv.includes('--apply')
/** How many of the rows the two models agree on a human still reads. */
const AGREEMENT_SAMPLE = 10

if (runId === undefined) throw new Error('usage: pnpm judge:prescreen <runId> [--apply]')

interface Row {
  questionId: string
  question: string
  expected: string
  actual: string
  judgeVerdict: boolean
  humanVerdict: boolean | null
}

const base = join(root, 'data', 'calibration', runId)
const rows = (await readFile(`${base}.jsonl`, 'utf8'))
  .split('\n')
  .filter((line) => line.trim().length > 0)
  .map((line) => JSON.parse(line) as Row)

const PROMPT = `Tu compares une réponse candidate à une réponse de référence en droit du travail français.

Pour CHAQUE item, une seule question : la candidate dit-elle la même chose que la référence ?

- Une formulation différente ne change rien. Une négation qui exprime la même règle non plus
  ("oui, seulement si X" et "non, sauf si X" disent la même chose).
- Un chiffre ou une durée différente : INCORRECT.
- Un élément central absent, ou une réponse si vague qu'elle n'engage rien : INCORRECT.
- Un refus de répondre face à une référence qui répond : INCORRECT.

Vérifie les chiffres caractère par caractère.

FORMAT — impératif. Uniquement du JSONL, un objet par ligne, rien autour :
{"id":"q001","correct":true,"confidence":"high","note":""}

confidence : "high" ou "low". Mets "low" au moindre doute — ces lignes seront relues.
note : une phrase courte, seulement si correct est false.`

if (!applying) {
  await mkdir(`${base}-prescreen`, { recursive: true })
  await writeFile(join(`${base}-prescreen`, 'PROMPT.md'), `${PROMPT}\n`, 'utf8')

  const items = rows.flatMap((row) => [
    `### ${row.questionId}`,
    '',
    `**Question.** ${row.question}`,
    '',
    `**Référence.** ${row.expected}`,
    '',
    `**Candidate.** ${row.actual.replace(/\n/g, ' ') || '(refus de répondre)'}`,
    '',
  ])
  await writeFile(
    join(`${base}-prescreen`, 'items.md'),
    [`# Calibration — ${rows.length} items`, '', 'Consigne dans PROMPT.md. Sortie : JSONL, une ligne par item.', '', '---', '', ...items].join('\n'),
    'utf8',
  )
  await writeFile(join(`${base}-prescreen`, 'verdicts.jsonl'), '# Colle ici les réponses JSONL. Les lignes non-JSON sont ignorées.\n', 'utf8')
  console.log(`wrote ${base}-prescreen/ — PROMPT.md, items.md, verdicts.jsonl`)
  console.log(`Paste the prompt, upload items.md, save the reply into verdicts.jsonl, then rerun with --apply.`)
} else {
  const path = join(`${base}-prescreen`, 'verdicts.jsonl')
  if (!existsSync(path)) throw new Error(`no verdicts at ${path}`)
  const screened = new Map<string, boolean>()
  for (const line of (await readFile(path, 'utf8')).split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('{')) continue
    try {
      const verdict = JSON.parse(trimmed) as { id: string; correct: boolean }
      if (typeof verdict.id === 'string' && typeof verdict.correct === 'boolean') screened.set(verdict.id, verdict.correct)
    } catch {
      // A malformed line is skipped; the missing-rows check below will catch the loss.
    }
  }

  const missing = rows.filter((row) => !screened.has(row.questionId))
  if (missing.length > 0) {
    throw new Error(`${missing.length} row(s) have no screening verdict: ${missing.slice(0, 6).map((r) => r.questionId).join(', ')}`)
  }

  const disagree = rows.filter((row) => screened.get(row.questionId) !== row.judgeVerdict)
  const agree = rows.filter((row) => screened.get(row.questionId) === row.judgeVerdict)
  // Evenly spaced rather than random, so rerunning picks the same rows.
  const step = Math.max(1, Math.floor(agree.length / AGREEMENT_SAMPLE))
  const sampled = agree.filter((_, index) => index % step === 0).slice(0, AGREEMENT_SAMPLE)

  const lines: string[] = [
    `# Judge calibration — rows for a human`,
    '',
    `A second model screened all ${rows.length} answers. It disagreed with the judge on **${disagree.length}**.`,
    `Below: every disagreement, then **${sampled.length}** rows the two models agreed on.`,
    '',
    'The agreed rows are not padding. Without them, this would assume the judge is right',
    'wherever a second model happens to concur — and whether the two share a blind spot is the',
    'entire question calibration asks. They are reweighted to the size of the group they',
    'represent, so kappa is estimated over all ' + rows.length + ' rows, not just the ones read.',
    '',
    'Mark `[x]` if the candidate says the same thing as the reference, `[!]` if it does not.',
    'Neither model\'s verdict is shown, on purpose.',
    '',
    `Then: \`pnpm judge:apply-calibration ${runId}\` and \`pnpm judge:calibrate ${runId} --score\``,
    '',
    '---',
    '',
  ]
  const render = (row: Row) => {
    lines.push(`## ${row.questionId}`, '', '- [ ] matches the reference', '')
    lines.push(`**Question.** ${row.question}`, '')
    lines.push(`**Reference.** ${row.expected}`, '')
    lines.push(`**Produced.** ${row.actual.replace(/\n/g, ' ') || '_(refused)_'}`, '')
    lines.push('---', '')
  }
  for (const row of [...disagree, ...sampled]) render(row)

  await writeFile(`${base}.md`, lines.join('\n'), 'utf8')
  await writeFile(
    `${base}-strata.json`,
    `${JSON.stringify({ disagree: disagree.map((r) => r.questionId), agree: agree.map((r) => r.questionId), sampled: sampled.map((r) => r.questionId) }, null, 2)}\n`,
    'utf8',
  )
  console.log(`${disagree.length} disagreement(s), ${agree.length} agreement(s), ${sampled.length} sampled`)
  console.log(`wrote ${base}.md — ${disagree.length + sampled.length} rows for you (was ${rows.length})`)
}
