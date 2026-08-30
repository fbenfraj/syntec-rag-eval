/**
 * Fold the reviewed verdicts in `data/gold/review.md` back into the gold set.
 *
 * A row marked `[x]` becomes `human-verified`. A row marked `[!]` takes the corrected
 * answer from its `Fix:` line and also becomes `human-verified` — a corrected row is a
 * checked row. A row marked `[-]` is removed from the set entirely.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readGoldSet } from '../src/gold/validate.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const review = await readFile(join(root, 'data', 'gold', 'review.md'), 'utf8')
const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))

const verdicts = new Map<string, { mark: string; fix: string }>()
const blocks = review.split(/^## /m).slice(1)
for (const block of blocks) {
  const id = block.match(/^(q\d{3})/)?.[1]
  const mark = block.match(/^- \[(.)\] verdict/m)?.[1]?.trim() ?? ''
  const fix = block.match(/^- Fix:(.*)$/m)?.[1]?.trim() ?? ''
  if (id !== undefined) verdicts.set(id, { mark, fix })
}

let verified = 0
let corrected = 0
let dropped = 0
const kept = questions.flatMap((question) => {
  const verdict = verdicts.get(question.id)
  if (verdict === undefined || verdict.mark === '') return [question]
  if (verdict.mark === '-') {
    dropped += 1
    return []
  }
  if (verdict.mark === '!') {
    if (verdict.fix.length === 0) throw new Error(`${question.id}: marked [!] but no Fix: line was written`)
    corrected += 1
    return [{ ...question, answer: verdict.fix, provenance: 'human-verified' as const }]
  }
  verified += 1
  return [{ ...question, provenance: 'human-verified' as const }]
})

await writeFile(
  join(root, 'data', 'gold', 'questions.jsonl'),
  `${kept.map((question) => JSON.stringify(question)).join('\n')}\n`,
  'utf8',
)
console.log(`${verified} confirmed, ${corrected} corrected, ${dropped} dropped — ${kept.length} questions remain`)
console.log(`${kept.filter((q) => q.provenance === 'human-verified').length} of ${kept.length} are now human-verified`)
