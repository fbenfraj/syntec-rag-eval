import { GENERATION_MODEL, complete } from '../llm/client.js'

const SYSTEM = `Tu reformules une question de droit du travail français en requêtes de recherche.
Réponds uniquement par 3 lignes, une requête par ligne, sans numérotation.
Utilise le vocabulaire juridique exact (par exemple "période d'essai", "préavis", "forfait-jours").`

/**
 * Expand a question into several search queries. A user asks "je peux partir quand ?"; the
 * corpus says "préavis". The original question is always kept, so a rewrite that drifts
 * can only add candidates, never remove the ones the question itself would have found.
 */
export async function rewriteQuery(question: string): Promise<string[]> {
  const model = process.env.REWRITE_MODEL ?? GENERATION_MODEL
  const { text } = await complete({ model, system: SYSTEM, user: question, maxTokens: 200 })
  const queries = text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length > 0)
  return [question, ...queries.slice(0, 3)]
}
