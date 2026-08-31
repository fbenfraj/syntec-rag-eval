import { complete } from '../llm/client'

/**
 * The rubric, v2.
 *
 * v1 said only "same thing on the substance, extra exact details allowed". Calibration
 * against a human scored kappa 0.489: seven of eight disagreements were the judge passing
 * an answer the human rejected, and two of them exposed cases the rubric never decided —
 * an answer that adds a procedural condition the reference does not state, and an answer
 * that gives the same rule with the polarity inverted. Both now have an explicit rule,
 * taken from how the human actually marked them.
 */
const SYSTEM = `Tu compares une réponse candidate à une réponse de référence en droit du travail.

La candidate est CORRECTE seulement si elle affirme la même chose que la référence, et rien
de plus qui engage le lecteur.

Elle est INCORRECTE dans chacun de ces cas :

1. Elle contredit la référence, ou donne un chiffre, une durée ou un montant différent.
2. Elle omet l'élément central de la référence.
3. Elle ajoute une condition, un délai ou une étape de procédure que la référence ne
   mentionne pas. Même si cette condition existe ailleurs dans la loi, la référence est la
   seule autorité ici : une candidate qui ajoute "puis attendre sept jours" à une référence
   qui n'en parle pas est INCORRECTE.
4. Elle commence par affirmer le contraire de la référence, même si une réserve rétablit
   ensuite l'équivalence logique. "Non, sauf si X" face à une référence "Oui, si X" est
   INCORRECTE : un lecteur qui lit la première phrase en retient l'inverse de la règle.
5. Elle reste si vague qu'elle n'engage rien, ou elle refuse de répondre alors que la
   référence répond.

Une simple reformulation, un ordre différent des éléments, ou un vocabulaire plus courant
ne rendent pas la candidate incorrecte.

Vérifie les chiffres et les durées caractère par caractère.

Réponds exactement dans ce format, sans rien d'autre:
VERDICT: CORRECT ou INCORRECT
RAISON: une phrase`

export interface Judgement {
  correct: boolean
  reason: string
}

/**
 * Ask a model whether a candidate answer matches the reference.
 *
 * Deliberately a separate, stronger model from the one that generated the answer: a model
 * grading its own output agrees with itself. Its agreement with a human is measured by
 * `scripts/calibrate-judge.ts`, and no correctness number is published until that kappa
 * clears the threshold.
 */
export async function judgeAnswer(args: {
  question: string
  expected: string
  actual: string
  model: string
}): Promise<Judgement> {
  const user = `Question: ${args.question}\n\nRéférence: ${args.expected}\n\nCandidate: ${args.actual}`
  const { text } = await complete({ model: args.model, system: SYSTEM, user, maxTokens: 200 })
  return parseJudgement(text)
}

/** A response that does not state a verdict is counted incorrect, never silently correct. */
export function parseJudgement(text: string): Judgement {
  const verdict = /VERDICT:\s*(CORRECT|INCORRECT)/i.exec(text)?.[1]?.toUpperCase()
  const reason = /RAISON:\s*(.+)/i.exec(text)?.[1]?.trim() ?? ''
  return { correct: verdict === 'CORRECT', reason: reason.length > 0 ? reason : text.trim().slice(0, 200) }
}
