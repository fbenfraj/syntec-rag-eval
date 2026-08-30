/**
 * Check that both providers answer, and report what the call cost. Kept out of the test
 * suite deliberately: `pnpm test` must never spend money or need a network.
 */
import { EMBEDDING_DIMENSIONS, GENERATION_MODEL, complete, embed, embedQuery, rerankScores } from '../src/llm/client.js'
import { costEur } from '../src/llm/pricing.js'

const answer = await complete({
  model: GENERATION_MODEL,
  system: 'Tu réponds en une phrase, en français.',
  user: "Selon le code du travail, quelle est la durée maximale de la période d'essai d'un cadre en CDI ?",
  maxTokens: 100,
})
console.log(`generation (${answer.model}): ${answer.text.trim()}`)
console.log(`  ${answer.inputTokens} in / ${answer.outputTokens} out, ${answer.latencyMs} ms, ${costEur(answer).toFixed(6)} EUR`)

const [documentVector] = await embed(["La période d'essai des cadres est de quatre mois."])
const queryVector = await embedQuery("durée de la période d'essai d'un cadre")
console.log(`embeddings: ${documentVector?.length} dimensions (schema expects ${EMBEDDING_DIMENSIONS})`)

const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * (b[i] ?? 0), 0)
console.log(`  cosine(question, passage) = ${dot(queryVector, documentVector ?? []).toFixed(4)}`)

const scores = await rerankScores("durée de la période d'essai d'un cadre", [
  "La période d'essai des cadres est de quatre mois.",
  'Les congés payés sont de cinq semaines par an.',
])
console.log(`rerank: relevant ${scores[0]?.toFixed(4)}, irrelevant ${scores[1]?.toFixed(4)}`)
