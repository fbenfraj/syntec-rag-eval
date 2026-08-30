/**
 * Print a review sheet for human spot-checking.
 *
 * Every row shows the question, the drafted answer, and the text of the article the
 * question was built from — so the check is "does this article actually say that?", which
 * is reading comprehension, not legal expertise. The citation itself needs no checking: it
 * is correct by construction.
 *
 * Mark each row, then run `pnpm gold:apply-review` to fold the verdicts back in.
 *
 * Usage: pnpm gold:review [count]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { readGoldSet } from '../src/gold/validate.js'
import type { GoldQuestion } from '../src/gold/types.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const COUNT = Number(process.argv[2] ?? 30)

const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const byId = new Map(articles.map((article) => [article.id, article]))
const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))

/** Sample evenly within each category, so the review covers every kind of question. */
function sample(items: GoldQuestion[], count: number): GoldQuestion[] {
  if (items.length <= count) return items
  const step = items.length / count
  return Array.from({ length: count }, (_, i) => items[Math.floor(i * step)]!)
}

const categories = [...new Set(questions.map((question) => question.category))].sort()
const perCategory = Math.max(1, Math.round(COUNT / categories.length))
const chosen = categories.flatMap((category) =>
  sample(questions.filter((question) => question.category === category), perCategory),
)

const lines: string[] = [
  '# Gold set review',
  '',
  `${chosen.length} of ${questions.length} questions, sampled across all ${categories.length} categories.`,
  '',
  'For each row, decide **one thing**: does the source article below actually support the',
  'drafted answer? You are not being asked to know French labour law — the article is right',
  'there. The citation itself needs no checking; the question was written from that article.',
  '',
  'Mark each row by replacing `[ ]` with:',
  '',
  '- `[x]` — the answer follows from the article. Becomes `human-verified`.',
  '- `[!]` — the answer is wrong or unsupported. Write the correct answer on the `Fix:` line.',
  '- `[-]` — the question itself is bad (ambiguous, or not really unanswerable). It gets dropped.',
  '',
  'For `unanswerable` rows there is no article: judge whether the question is plausible,',
  'in-domain, and something this corpus genuinely does not cover.',
  '',
  'Then run `pnpm gold:apply-review`.',
  '',
  '---',
  '',
]

for (const question of chosen) {
  lines.push(`## ${question.id} · ${question.category} · tier ${question.tier}`, '')
  lines.push('- [ ] verdict', `- Fix: `, '')
  lines.push(`**Question.** ${question.question}`, '')
  lines.push(`**Drafted answer.** ${question.answer}`, '')
  if (question.requiredArticles.length === 0) {
    lines.push('**Source.** _None — this question is meant to be unanswerable._', '')
  }
  for (const id of question.requiredArticles) {
    const article = byId.get(id)
    lines.push(`**Source — \`${id}\`** (${article?.source ?? '?'} ${article?.articleId ?? ''} — ${article?.title ?? ''})`, '')
    lines.push('```', (article?.content ?? '(missing)').slice(0, 2200), '```', '')
  }
  lines.push('---', '')
}

const path = join(root, 'data', 'gold', 'review.md')
await mkdir(dirname(path), { recursive: true })
await writeFile(path, lines.join('\n'), 'utf8')
console.log(`wrote ${path} — ${chosen.length} questions to review`)
