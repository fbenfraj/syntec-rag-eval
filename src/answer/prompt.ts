import type { Hit } from '../retrieval/types.js'

export const REFUSAL_TOKEN = 'INSUFFISANT'

export const SYSTEM = `Tu réponds à des questions de droit du travail français en t'appuyant
UNIQUEMENT sur les extraits fournis.

Règles:
- Si les extraits ne permettent pas de répondre, réponds exactement ${REFUSAL_TOKEN} et rien d'autre.
- Ne complète jamais par tes connaissances générales, même si tu connais la réponse.
- Quand la convention collective et le code se contredisent, la convention l'emporte si elle est plus favorable au salarié.
- Réponds en deux phrases au maximum, en donnant le chiffre ou la durée exacte quand le texte en donne un.
- Termine toujours une réponse par une ligne "SOURCES: " suivie des identifiants exacts entre crochets des extraits utilisés, séparés par des virgules.`

/**
 * Extracts are labelled with the corpus id, not the article number.
 *
 * Citation correctness is scored by matching what the model cites against the gold set's
 * article ids, and a convention article number is not unique — "Article 2" occurs 94 times.
 * Labelling by number would make a citation unscoreable and let a wrong article count as
 * right.
 */
export function buildUserPrompt(question: string, hits: Hit[]): string {
  if (hits.length === 0) return `Extraits: aucun.\n\nQuestion: ${question}`
  const extracts = hits.map((hit) => `[${hit.id}] (${hit.source}, article ${hit.articleId})\n${hit.content}`).join('\n\n')
  return `Extraits:\n\n${extracts}\n\nQuestion: ${question}`
}
