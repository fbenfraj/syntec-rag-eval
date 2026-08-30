/**
 * Fold the reviewed verdicts in `data/gold/review.md` back into the gold set.
 *
 * A row marked `[x]` becomes `human-verified`. A row marked `[!]` takes the corrected
 * answer from its `Fix:` line and also becomes `human-verified` — a corrected row is a
 * checked row. A row marked `[-]` is removed from the set entirely.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readGoldSet } from '../src/gold/validate.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The short sheet produced after a cross-vendor review is the usual input; the full sheet
 * from `pnpm gold:review` is the fallback. An explicit path wins over both.
 */
const candidates = [
  process.argv[2],
  join(root, 'data', 'gold', 'review', 'for-human.md'),
  join(root, 'data', 'gold', 'review.md'),
].filter((path): path is string => path !== undefined)

const sheet = candidates.find((path) => existsSync(path))
if (sheet === undefined) throw new Error(`no review sheet found; looked for:\n  ${candidates.join('\n  ')}`)
console.log(`reading ${sheet.replace(`${root}/`, '')}`)
const review = await readFile(sheet, 'utf8')
const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))

const verdicts = new Map<string, { mark: string; fix: string }>()
const blocks = review.split(/^## /m).slice(1)
for (const block of blocks) {
  const id = block.match(/^(q\d{3})/)?.[1]
  const mark = block.match(/^- \[(.)\] verdict/m)?.[1]?.trim() ?? ''
  const fix = block.match(/^- Fix:(.*)$/m)?.[1]?.trim() ?? ''
  if (id !== undefined) verdicts.set(id, { mark, fix })
}

const marked = [...verdicts.values()].filter((verdict) => verdict.mark.length > 0)
if (marked.length === 0) {
  // Silence here would look like success and quietly leave the set unverified.
  throw new Error(`no rows are marked in ${sheet}. Replace a "[ ]" with [x], [!] or [-] first.`)
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
