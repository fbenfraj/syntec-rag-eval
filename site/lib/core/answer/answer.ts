import { complete } from '../llm/client'
import type { Completion } from '../llm/pricing'
import type { Hit } from '../retrieval/types'
import { REFUSAL_TOKEN, SYSTEM, buildUserPrompt } from './prompt'

export { REFUSAL_TOKEN, SYSTEM, buildUserPrompt }

export interface Answer {
  text: string
  citations: string[]
  refused: boolean
  completion: Completion
}

/**
 * Split a raw completion into an answer, its citations, and whether it refused.
 *
 * Refusal is checked first and wins: a response containing the refusal token is a refusal
 * even if the model also produced prose, because a half-refusal that still asserts a fact
 * is the failure mode this whole design exists to avoid.
 */
export function parseAnswer(raw: string): Omit<Answer, 'completion'> {
  const trimmed = raw.trim()
  if (trimmed.includes(REFUSAL_TOKEN)) return { text: trimmed, citations: [], refused: true }

  const lines = trimmed.split('\n')
  const sourcesIndex = lines.findIndex((line) => line.trim().toUpperCase().startsWith('SOURCES:'))
  if (sourcesIndex === -1) return { text: trimmed, citations: [], refused: false }

  const citations = [
    ...new Set(
      lines[sourcesIndex]!
        .replace(/SOURCES:/i, '')
        .split(',')
        .map((entry) => entry.trim().replace(/^\[|\]$/g, '').trim())
        .filter((entry) => entry.length > 0),
    ),
  ]
  return { text: lines.slice(0, sourcesIndex).join('\n').trim(), citations, refused: false }
}

/**
 * Answer from retrieved extracts alone.
 *
 * With no extracts the model is not called at all: there is nothing it could ground an
 * answer in, so the only correct behaviour is to refuse, and paying to be told that would
 * be waste.
 */
export async function answer(question: string, hits: Hit[], model: string): Promise<Answer> {
  const completion = await complete({ model, system: SYSTEM, user: buildUserPrompt(question, hits) })
  return { ...parseAnswer(completion.text), completion }
}

/** Citations the model produced that were not among the extracts it was given. */
export function fabricatedCitations(citations: string[], hits: Hit[]): string[] {
  const offered = new Set(hits.map((hit) => hit.id))
  return citations.filter((citation) => !offered.has(citation))
}
