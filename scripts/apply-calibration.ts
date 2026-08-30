/** Fold the marked calibration sheet back into the JSONL the scorer reads. */
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const runId = process.argv[2]
if (runId === undefined) throw new Error('usage: pnpm judge:apply-calibration <runId>')

const base = join(root, 'data', 'calibration', runId)
const sheet = await readFile(`${base}.md`, 'utf8')

const verdicts = new Map<string, boolean>()
for (const block of sheet.split(/^## /m).slice(1)) {
  const id = block.match(/^(q\d{3})/)?.[1]
  const mark = block.match(/^- \[(.)\] matches/m)?.[1]?.trim()
  if (id !== undefined && mark !== undefined && mark.length > 0) verdicts.set(id, mark === 'x')
}
if (verdicts.size === 0) throw new Error(`no rows marked in ${base}.md — replace a "[ ]" with [x] or [!]`)

const rows = (await readFile(`${base}.jsonl`, 'utf8'))
  .split('\n')
  .filter((line) => line.trim().length > 0)
  .map((line) => JSON.parse(line) as { questionId: string; humanVerdict: boolean | null })

const filled = rows.map((row) => ({ ...row, humanVerdict: verdicts.get(row.questionId) ?? row.humanVerdict }))
const remaining = filled.filter((row) => typeof row.humanVerdict !== 'boolean').length

await writeFile(`${base}.jsonl`, `${filled.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8')
console.log(`${verdicts.size} verdicts applied${remaining > 0 ? `, ${remaining} row(s) still unmarked` : ' — all rows marked'}`)
