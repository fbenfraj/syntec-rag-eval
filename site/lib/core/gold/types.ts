import { z } from 'zod'

/**
 * - `general`      the answer is in one place and nothing overrides it
 * - `override`     the convention and the code disagree; the convention governs
 * - `dated`        the answer depends on the date the question is asked about
 * - `unanswerable` in-domain and plausible, but the corpus does not answer it
 */
export const CATEGORIES = ['general', 'override', 'dated', 'unanswerable'] as const

/**
 * - tier 1  one article, answer close to verbatim
 * - tier 2  one hop, or a comparison between two articles
 * - tier 3  multi-article synthesis, or reasoning about dates
 */
export const TIERS = [1, 2, 3] as const

export const GoldQuestionSchema = z.object({
  id: z.string().regex(/^q\d{3}$/),
  question: z.string().min(10),
  answer: z.string().min(1),
  /**
   * Corpus article ids, not article numbers. A convention article number is not unique —
   * "Article 2" occurs 94 times across the convention's texts — so citing by number would
   * make a retrieval hit unscoreable.
   */
  requiredArticles: z.array(z.string()),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: z.enum(CATEGORIES),
  asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  /** How the row was produced, so the write-up can describe the set honestly. */
  provenance: z.enum(['constructed', 'llm-reviewed', 'human-verified', 'human-written']).default('constructed'),
  theme: z.enum(['contract', 'termination', 'working-time', 'pay']).nullable().default(null),
})

export type GoldQuestion = z.infer<typeof GoldQuestionSchema>
export type Category = (typeof CATEGORIES)[number]
