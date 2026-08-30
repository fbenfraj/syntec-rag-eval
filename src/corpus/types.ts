import { z } from 'zod'

export const SOURCES = ['code', 'convention', 'circular'] as const
export const CONTENT_KINDS = ['prose', 'table'] as const

export const ArticleSchema = z.object({
  id: z.string().min(1),
  source: z.enum(SOURCES),
  articleId: z.string().min(1),
  title: z.string(),
  content: z.string().min(1),
  contentKind: z.enum(CONTENT_KINDS),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  precedence: z.number().int().min(0).max(1),
})

export type Article = z.infer<typeof ArticleSchema>
export type Source = (typeof SOURCES)[number]
export type ContentKind = (typeof CONTENT_KINDS)[number]
