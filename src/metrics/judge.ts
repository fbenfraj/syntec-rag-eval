import { complete } from '../llm/client.js'

const SYSTEM = `Tu compares une réponse candidate à une réponse de référence en droit du travail.

La réponse candidate est CORRECTE si elle affirme la même chose que la référence sur le fond,
même avec une formulation différente ou des détails supplémentaires exacts.

Elle est INCORRECTE si elle contredit la référence, omet l'élément central, donne un chiffre
ou une durée différente, ou reste vague au point de ne pas répondre.

Un refus de répondre n'est jamais CORRECT face à une référence qui, elle, répond.

Compare le fond, pas le style. Vérifie les chiffres et les durées caractère par caractère.

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
