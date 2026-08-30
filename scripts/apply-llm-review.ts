/**
 * Fold a cross-vendor review back into the gold set.
 *
 * Reads `data/gold/review/verdicts.jsonl` — the JSONL replies, concatenated — and:
 *   - `ok`                     marks the row `llm-reviewed`
 *   - `wrong` / `unsupported`  takes the corrected answer when one was given, else flags
 *                              the row for a human
 *   - `bad_question`           flags the row for a human, never drops it silently
 *
 * Nothing here produces `human-verified`. A model's agreement is evidence, not
 * verification, and the distinction is the reason the provenance field exists.
 *
 * Writes `data/gold/review/for-human.md`: every flagged row plus a random control sample
 * of rows the reviewer passed. The control is what measures the reviewer — without it,
 * "the model agreed with itself" is all anyone can say.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { readGoldSet } from '../src/gold/validate.js'
import type { GoldQuestion } from '../src/gold/types.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTROL_SAMPLE = Number(process.argv[2] ?? 8)

interface Verdict {
  id: string
  status: 'ok' | 'wrong' | 'unsupported' | 'bad_question'
  confidence?: string
  note?: string
  corrected?: string
}

const raw = await readFile(join(root, 'data', 'gold', 'review', 'verdicts.jsonl'), 'utf8')
const verdicts = new Map<string, Verdict>()
const malformed: string[] = []
for (const line of raw.split('\n')) {
  const trimmed = line.trim().replace(/^```(?:json|jsonl)?$/, '')
  if (trimmed.length === 0 || !trimmed.startsWith('{')) continue
  try {
    const verdict = JSON.parse(trimmed) as Verdict
    if (typeof verdict.id === 'string') verdicts.set(verdict.id, verdict)
  } catch {
    malformed.push(trimmed.slice(0, 80))
  }
}

const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))
const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const byId = new Map(articles.map((article) => [article.id, article]))

const missing = questions.filter((question) => !verdicts.has(question.id)).map((question) => question.id)
const flagged: { question: GoldQuestion; verdict: Verdict }[] = []
let reviewed = 0
let corrected = 0

const updated = questions.map((question) => {
  const verdict = verdicts.get(question.id)
  if (verdict === undefined) return question

  if (verdict.status === 'ok' && (verdict.confidence ?? 'high') === 'high') {
    reviewed += 1
    return { ...question, provenance: 'llm-reviewed' as const }
  }

  // Low confidence, or any non-ok status, goes to a human. A correction is applied so the
  // human reads the improved wording, but the row stays llm-reviewed until they sign off.
  flagged.push({ question, verdict })
  const fix = (verdict.corrected ?? '').trim()
  if (fix.length > 0 && verdict.status !== 'bad_question') {
    corrected += 1
    return { ...question, answer: fix, provenance: 'llm-reviewed' as const }
  }
  return { ...question, provenance: 'llm-reviewed' as const }
})

await writeFile(
  join(root, 'data', 'gold', 'questions.jsonl'),
  `${updated.map((question) => JSON.stringify(question)).join('\n')}\n`,
  'utf8',
)

/** Evenly spaced rather than random, so the control sample is the same on a rerun. */
const passed = updated.filter((question) => !flagged.some((entry) => entry.question.id === question.id))
const step = Math.max(1, Math.floor(passed.length / CONTROL_SAMPLE))
const control = passed.filter((_, index) => index % step === 0).slice(0, CONTROL_SAMPLE)

const lines: string[] = [
  '# Gold set — rows needing a human',
  '',
  `A second vendor's model reviewed all ${questions.length} rows. It flagged **${flagged.length}**`,
  `and passed the rest. Below are the flagged rows, then **${control.length} rows it passed**, as a control.`,
  '',
  'The control is the point: if you agree with all of them, that is evidence the reviewer works.',
  'If you disagree with any, the reviewer is not trustworthy and the flagged list is not the whole story.',
  '',
  'Mark each: `[x]` the answer follows from the article · `[!]` it does not, write the right one on `Fix:` ·',
  '`[-]` drop the question. Then run `pnpm gold:apply-review`.',
  '',
  '---',
  '',
]

const render = (question: GoldQuestion, verdict?: Verdict) => {
  lines.push(`## ${question.id} · ${question.category}${verdict ? ` · reviewer says **${verdict.status}** (${verdict.confidence ?? '?'})` : ' · reviewer passed it (control)'}`, '')
  if (verdict?.note !== undefined && verdict.note.length > 0) lines.push(`> ${verdict.note}`, '')
  lines.push('- [ ] verdict', '- Fix: ', '')
  lines.push(`**Question.** ${question.question}`, '')
  lines.push(`**Answer on file.** ${question.answer}`, '')
  for (const id of question.requiredArticles) {
    const article = byId.get(id)
    lines.push(`**Source — \`${id}\`** (${article?.source ?? '?'} ${article?.articleId ?? ''})`, '')
    lines.push('```', (article?.content ?? '(missing)').slice(0, 2200), '```', '')
  }
  if (question.requiredArticles.length === 0) lines.push('**Source.** _None — meant to be unanswerable._', '')
  lines.push('---', '')
}

for (const { question, verdict } of flagged) render(question, verdict)
for (const question of control) render(question)

await writeFile(join(root, 'data', 'gold', 'review', 'for-human.md'), lines.join('\n'), 'utf8')

console.log(`${verdicts.size} verdicts read${malformed.length > 0 ? `, ${malformed.length} malformed line(s) ignored` : ''}`)
if (missing.length > 0) console.log(`WARNING: no verdict for ${missing.length} question(s): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`)
console.log(`${reviewed} passed, ${flagged.length} flagged, ${corrected} answer(s) rewritten from the reviewer's correction`)
console.log(`wrote data/gold/review/for-human.md — ${flagged.length + control.length} rows for you (${control.length} of them controls)`)
