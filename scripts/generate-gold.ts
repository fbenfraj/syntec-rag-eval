/**
 * Draft gold questions from the corpus.
 *
 * The construction runs backwards from the usual direction: an article is chosen first,
 * then a question that article answers is written. The citation is therefore correct by
 * construction rather than by anyone's recall of the law, which is what makes a gold set
 * possible without a labour-law specialist.
 *
 * What this does not give away for free is answer wording, so every drafted answer is
 * marked `constructed` until a human confirms it. Nor does it give away difficulty:
 * questions generated from an article tend to borrow its vocabulary, so lexical overlap
 * with the source is measured and reported. A set whose questions are near-copies of the
 * corpus measures matching, not retrieval.
 *
 * Usage: pnpm gold:generate [count]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { themeOfCodeArticle } from '../src/corpus/themes.js'
import { GENERATION_MODEL, complete, embedQuery, rerankScores } from '../src/llm/client.js'
import { getPool } from '../src/db/pool.js'
import { denseSearch } from '../src/retrieval/dense.js'
import { lexicalSearch } from '../src/retrieval/lexical.js'
import { rrfFuse } from '../src/retrieval/fuse.js'
import { totalSpentEur } from '../src/llm/budget.js'
import { lexicalOverlap } from '../src/gold/validate.js'
import { GoldQuestionSchema, type GoldQuestion } from '../src/gold/types.js'
import type { Article } from '../src/corpus/types.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const TARGET = Number(process.argv[2] ?? 150)

// Matches the plan's mix: most questions ordinary, a third about the convention overriding
// the code, and a sixth each dated and unanswerable.
const MIX = { general: 0.4, override: 0.3, dated: 0.15, unanswerable: 0.15 } as const

const SYSTEM = `Tu écris des questions d'évaluation pour un système de recherche juridique français.

Règles absolues :
- La question doit être posée comme un salarié ou un RH la poserait, en langage ordinaire.
- N'utilise PAS le vocabulaire exact de l'article. Si l'article dit "période d'essai",
  la question peut dire "avant que l'embauche soit définitive". C'est essentiel :
  une question qui recopie l'article ne teste rien.
- Ne mentionne jamais le numéro de l'article.
- La réponse doit être entièrement contenue dans l'article fourni, et tenir en une ou
  deux phrases, avec le chiffre ou la durée exacte si l'article en donne un.

Réponds uniquement en JSON, sans balises de code :
{"question": "...", "answer": "...", "tier": 1|2|3}
tier 1 = la réponse est presque mot pour mot dans l'article
tier 2 = il faut un raisonnement simple ou une comparaison
tier 3 = il faut synthétiser plusieurs éléments de l'article`

const UNANSWERABLE_SYSTEM = `Tu écris des questions d'évaluation pour un système de recherche juridique français.

Écris une question de droit du travail qui semble tout à fait plausible et qui est dans le
domaine (contrat, préavis, temps de travail, rémunération), mais dont la réponse ne se
trouve NI dans le code du travail NI dans la convention collective Syntec (IDCC 1486) :
par exemple une question sur une autre convention collective, sur la fiscalité, sur le
droit d'un autre pays, ou sur un chiffre qu'aucun texte ne fixe.

La question ne doit jamais être absurde : un bon système doit refuser d'y répondre parce
qu'il ne sait pas, pas parce que la question est ridicule.

Réponds uniquement en JSON, sans balises de code :
{"question": "...", "answer": "Le corpus ne permet pas de répondre à cette question."}`

function parseJson(text: string): Record<string, unknown> {
  const cleaned = text.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim()
  return JSON.parse(cleaned) as Record<string, unknown>
}

/** Substantial articles only: a two-line cross-reference cannot support a real question. */
function isUsable(article: Article): boolean {
  return article.contentKind === 'prose' && article.content.length >= 400 && article.content.length <= 4000
}

/** Deterministic spread across the corpus, so a rerun picks the same articles. */
function pick<T>(items: T[], count: number, offset = 0): T[] {
  if (items.length === 0) return []
  const step = Math.max(1, Math.floor(items.length / count))
  const chosen: T[] = []
  for (let i = 0; chosen.length < count && i < items.length; i += step) {
    chosen.push(items[(i + offset) % items.length]!)
  }
  return chosen
}

const articles = (await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))).filter(isUsable)
const code = articles.filter((a) => a.source === 'code')
const convention = articles.filter((a) => a.source === 'convention')
console.log(`${articles.length} usable articles (${code.length} code, ${convention.length} convention)`)

const counts = {
  general: Math.round(TARGET * MIX.general),
  override: Math.round(TARGET * MIX.override),
  dated: Math.round(TARGET * MIX.dated),
  unanswerable: Math.round(TARGET * MIX.unanswerable),
}

// A `dated` question is only meaningful if the corpus also holds an older wording of the
// same article: that superseded version is the distractor the date filter has to reject.
// Assigning the label to an article with no history would make the category decorative.
const supersededNumbers = new Set(
  articles.filter((article) => article.effectiveTo !== null).map((article) => article.articleId),
)
const datable = code.filter((article) => article.effectiveTo === null && supersededNumbers.has(article.articleId))
console.log(`${datable.length} in-force articles have a superseded predecessor (usable for dated questions)`)

const sources: { category: keyof typeof counts; article: Article | null }[] = [
  ...pick(code.filter((a) => a.effectiveTo === null), counts.general).map((article) => ({ category: 'general' as const, article })),
  ...pick(convention, counts.override).map((article) => ({ category: 'override' as const, article })),
  ...pick(datable, counts.dated).map((article) => ({ category: 'dated' as const, article })),
  ...Array.from({ length: counts.unanswerable }, () => ({ category: 'unanswerable' as const, article: null })),
]

/**
 * Reject an "unanswerable" draft that the corpus can in fact answer.
 *
 * A model asked for an unanswerable question will happily produce one the corpus answers
 * well — the first sample asked about maximum weekly overtime, which the code covers. Left
 * in, such a row scores a correct answer as a false refusal and quietly ruins the two
 * metrics this project exists to publish honestly. So each draft is retrieved for real and
 * scored by the reranker; a strong match means the question was not unanswerable.
 */
const UNANSWERABLE_MAX_RELEVANCE = 0.55

async function corpusAnswers(question: string): Promise<{ answers: boolean; score: number; id: string }> {
  const [dense, lexical] = await Promise.all([
    embedQuery(question).then((vector) => denseSearch(pool, vector, 10)),
    lexicalSearch(pool, question, 10),
  ])
  const candidates = rrfFuse([dense, lexical]).slice(0, 8)
  if (candidates.length === 0) return { answers: false, score: 0, id: '' }
  const scores = await rerankScores(question, candidates.map((hit) => hit.content))
  const best = Math.max(...scores)
  const bestIndex = scores.indexOf(best)
  return { answers: best >= UNANSWERABLE_MAX_RELEVANCE, score: best, id: candidates[bestIndex]?.id ?? '' }
}

const pool = getPool()

/**
 * Draft an unanswerable question and keep trying until the corpus really cannot answer it.
 * Rejected drafts are counted, so the write-up can say how often the model's idea of
 * "unanswerable" was wrong — on the first sample it was wrong about maximum weekly
 * overtime, which the code covers in full.
 */
async function draftUnanswerable(index: number): Promise<Record<string, unknown>> {
  const themes = ['contrat', 'préavis', 'temps de travail', 'rémunération']
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const draft = parseJson(
      (await complete({
        model: GENERATION_MODEL,
        system: UNANSWERABLE_SYSTEM,
        // Varying the user turn keeps the cache from collapsing every unanswerable
        // question onto one identical request.
        user: `Question numéro ${index + 1}, variante ${attempt + 1}. Thème : ${themes[(index + attempt) % themes.length]}.`,
        maxTokens: 400,
      })).text,
    )
    const question = String(draft.question ?? '')
    if (question.length < 10) continue
    const verdict = await corpusAnswers(question)
    if (!verdict.answers) return draft
    rejectedUnanswerable += 1
    console.error(`    rejected (corpus answers it: ${verdict.id} at ${verdict.score.toFixed(2)}) — ${question.slice(0, 70)}`)
  }
  throw new Error('could not draft an unanswerable question the corpus does not answer')
}

const questions: GoldQuestion[] = []
let failures = 0
let rejectedUnanswerable = 0

for (const [index, { category, article }] of sources.entries()) {
  const id = `q${String(questions.length + 1).padStart(3, '0')}`
  try {
    const draft = article === null
      ? await draftUnanswerable(index)
      : parseJson((await complete({
          model: GENERATION_MODEL,
          system: SYSTEM,
          user: `Article (${article.source}, ${article.articleId}) — ${article.title}\n\n${article.content}`,
          maxTokens: 500,
        })).text)

    const question = String(draft.question ?? '')
    const answer = String(draft.answer ?? '')
    if (question.length < 10 || answer.length < 1) throw new Error('empty draft')


    questions.push(
      GoldQuestionSchema.parse({
        id,
        question,
        answer,
        requiredArticles: article === null ? [] : [article.id],
        tier: article === null ? 1 : Number(draft.tier ?? 2),
        category,
        asOf: category === 'dated' ? '2026-08-30' : null,
        provenance: 'constructed',
        theme: article === null ? null : (article.source === 'code' ? themeOfCodeArticle(article.articleId) : null),
      }),
    )
  } catch (error) {
    failures += 1
    console.error(`  ${id} (${category}): ${(error as Error).message.slice(0, 120)}`)
  }
  if ((index + 1) % 25 === 0) console.log(`  drafted ${questions.length}/${sources.length}`)
}

const byArticle = new Map(articles.map((article) => [article.id, article]))
const overlaps = questions
  .filter((question) => question.requiredArticles.length > 0)
  .map((question) =>
    lexicalOverlap(question.question, question.requiredArticles.map((id) => byArticle.get(id)?.content ?? '')),
  )
const meanOverlap = overlaps.reduce((sum, value) => sum + value, 0) / Math.max(1, overlaps.length)

await mkdir(join(root, 'data', 'gold'), { recursive: true })
await writeFile(
  join(root, 'data', 'gold', 'questions.jsonl'),
  `${questions.map((question) => JSON.stringify(question)).join('\n')}\n`,
  'utf8',
)

await pool.end()

console.log(`\nwrote ${questions.length} questions (${failures} drafts failed, ${rejectedUnanswerable} unanswerable drafts rejected because the corpus answered them)`)
console.log(`mean lexical overlap with the source article: ${(meanOverlap * 100).toFixed(1)}%`)
console.log(`spent: ${totalSpentEur().toFixed(4)} EUR`)
