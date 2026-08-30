/**
 * Build a review pack for checking the gold set in a chat UI.
 *
 * Splits the set into parts small enough to upload comfortably, and writes the prompt
 * beside them. The reviewer is asked for strict JSONL so the verdicts can be folded back
 * in by `pnpm gold:apply-llm-review` — a review that cannot be applied mechanically will
 * not survive contact with a second run of the eval.
 *
 * Usage: pnpm gold:review-pack [rowsPerPart]
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from '../src/corpus/jsonl.js'
import { readGoldSet } from '../src/gold/validate.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PER_PART = Number(process.argv[2] ?? 50)
const MAX_ARTICLE_CHARS = 2600

const articles = await readArticles(join(root, 'data', 'corpus', 'articles.jsonl'))
const byId = new Map(articles.map((article) => [article.id, article]))
const questions = await readGoldSet(join(root, 'data', 'gold', 'questions.jsonl'))

const PROMPT = `Tu es un vérificateur méticuleux. On te donne des paires question/réponse tirées d'un
jeu d'évaluation pour un système de recherche juridique français, avec, pour chacune,
l'extrait de texte de loi dont la réponse est censée découler.

Ta tâche, pour CHAQUE item, est de trancher UNE SEULE question :

  **La réponse proposée découle-t-elle du texte fourni ?**

Règles impératives :

1. Le texte fourni est la SEULE autorité. N'utilise jamais tes connaissances du droit
   français. Si la réponse est juridiquement vraie mais absente du texte fourni, elle
   n'est PAS supportée.
2. Inversement, ne rejette pas une réponse parce qu'elle te semble incomplète : il suffit
   qu'elle soit exacte et contenue dans le texte.
3. Vérifie particulièrement les CHIFFRES, DURÉES et MONTANTS caractère par caractère.
   C'est là que se cachent la plupart des erreurs.
4. Vérifie aussi que la question est répondable à partir du texte, et qu'elle n'est pas
   ambiguë au point d'admettre plusieurs réponses contradictoires.
5. Certains items sont marqués \`category: unanswerable\` et n'ont PAS de texte source.
   Pour ceux-là, la seule chose à juger est : la question est-elle plausible, réaliste,
   et bien dans le domaine du droit du travail ? (L'absence de réponse dans le corpus a
   déjà été vérifiée mécaniquement — ne cherche pas à la juger.) Réponds "supported": true
   si la question est plausible et sérieuse, false si elle est absurde ou hors domaine.

Verdicts possibles pour \`status\` :

- \`"ok"\`          la réponse découle du texte, chiffres compris
- \`"wrong"\`       la réponse contredit le texte, ou avance un chiffre que le texte ne donne pas
- \`"unsupported"\` la réponse va au-delà du texte : plausible, mais pas dans l'extrait
- \`"bad_question"\` la question est ambiguë, mal posée, ou impossible à répondre depuis ce texte

FORMAT DE SORTIE — impératif. Réponds UNIQUEMENT par du JSONL : un objet JSON par ligne,
une ligne par item, sans texte autour, sans numérotation, sans bloc de code markdown.

{"id":"q001","status":"ok","confidence":"high","note":"","corrected":""}

- \`confidence\` : "high" ou "low". Mets "low" dès que tu hésites — ces lignes seront
  relues par un humain, donc l'hésitation est utile, pas gênante.
- \`note\` : une phrase courte, uniquement si le statut n'est pas "ok".
- \`corrected\` : si le statut est "wrong" ou "unsupported" ET que le texte permet
  d'écrire une bonne réponse, écris-la ici (une ou deux phrases, avec le chiffre exact).
  Sinon laisse la chaîne vide.

N'omets aucun item. Il doit y avoir exactement autant de lignes que d'items.`

await mkdir(join(root, 'data', 'gold', 'review'), { recursive: true })
await rm(join(root, 'data', 'gold', 'review'), { recursive: true, force: true })
await mkdir(join(root, 'data', 'gold', 'review'), { recursive: true })
await writeFile(join(root, 'data', 'gold', 'review', 'PROMPT.md'), `${PROMPT}\n`, 'utf8')

const parts: string[][] = []
for (let start = 0; start < questions.length; start += PER_PART) {
  parts.push([])
  const part = parts.at(-1)!
  for (const question of questions.slice(start, start + PER_PART)) {
    part.push(`### ${question.id} — category: ${question.category}`, '')
    part.push(`**Question.** ${question.question}`, '')
    part.push(`**Réponse proposée.** ${question.answer}`, '')
    if (question.requiredArticles.length === 0) {
      part.push('**Texte source.** _(aucun — item `unanswerable`, juge seulement la plausibilité de la question)_', '')
    }
    for (const id of question.requiredArticles) {
      const article = byId.get(id)
      const content = (article?.content ?? '(manquant)').slice(0, MAX_ARTICLE_CHARS)
      part.push(`**Texte source** — ${article?.source ?? '?'} article ${article?.articleId ?? '?'} — ${article?.title ?? ''}`, '')
      part.push('```', content, '```', '')
    }
  }
}

let totalChars = 0
for (const [index, part] of parts.entries()) {
  const header = [
    `# Vérification du jeu d'évaluation — partie ${index + 1}/${parts.length}`,
    '',
    `${part.filter((line) => line.startsWith('### ')).length} items.`,
    'La consigne complète est dans `PROMPT.md`. Rappel du format de sortie : du JSONL, une ligne par item, rien d\'autre.',
    '',
    '---',
    '',
  ]
  const body = [...header, ...part].join('\n')
  totalChars += body.length
  await writeFile(join(root, 'data', 'gold', 'review', `part-${index + 1}.md`), body, 'utf8')
}

console.log(`wrote data/gold/review/: PROMPT.md + ${parts.length} part file(s), ${questions.length} items, ${Math.round(totalChars / 1024)} KB total`)
console.log('Paste PROMPT.md once, then upload or paste each part. Save the JSONL replies to')
console.log('data/gold/review/verdicts.jsonl (all parts appended), then run: pnpm gold:apply-llm-review')
