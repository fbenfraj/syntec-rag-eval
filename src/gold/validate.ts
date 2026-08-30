import { readFile } from 'node:fs/promises'
import { GoldQuestionSchema, type GoldQuestion } from './types.js'

export async function readGoldSet(path: string): Promise<GoldQuestion[]> {
  const raw = await readFile(path, 'utf8')
  return raw
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => GoldQuestionSchema.parse(JSON.parse(line)))
}

/**
 * Mechanical checks on the gold set, returning human-readable problems. Empty means valid.
 *
 * These are the mistakes that silently corrupt a metric rather than crash a run: an
 * unanswerable question that secretly cites an article scores a correct refusal as a
 * retrieval miss, and a citation that is not in the corpus makes recall unreachable by
 * construction, so a rung looks broken when the label is at fault.
 */
export function validateGoldSet(questions: GoldQuestion[], knownArticleIds: Set<string>): string[] {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const question of questions) {
    if (seen.has(question.id)) problems.push(`${question.id}: duplicate id`)
    seen.add(question.id)

    if (question.category === 'unanswerable') {
      if (question.requiredArticles.length > 0) {
        problems.push(`${question.id}: unanswerable questions must have no required articles`)
      }
    } else if (question.requiredArticles.length === 0) {
      problems.push(`${question.id}: an answerable question requires at least one article`)
    }

    if (question.category === 'dated' && question.asOf === null) {
      problems.push(`${question.id}: a dated question must carry an asOf date`)
    }

    if (new Set(question.requiredArticles).size !== question.requiredArticles.length) {
      problems.push(`${question.id}: the same article is required twice`)
    }

    for (const articleId of question.requiredArticles) {
      if (!knownArticleIds.has(articleId)) {
        problems.push(`${question.id}: required article ${articleId} is not in the corpus`)
      }
    }
  }
  return problems
}

/**
 * The share of the question's words that also appear in the articles it cites.
 *
 * A gold set built by generating questions from articles risks reusing their wording, which
 * flatters retrieval. Measuring the overlap means the leakage is reported rather than
 * hidden: a set whose questions are near-copies of the corpus is not measuring retrieval.
 */
export function lexicalOverlap(question: string, articleTexts: string[]): number {
  const words = (text: string) =>
    new Set(
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3),
    )
  const asked = words(question)
  if (asked.size === 0) return 0
  const source = words(articleTexts.join(' '))
  let shared = 0
  for (const word of asked) if (source.has(word)) shared += 1
  return shared / asked.size
}
