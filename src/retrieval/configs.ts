/**
 * The ablation ladder. Each rung adds exactly one capability to the one below it, so the
 * difference between two rows of the leaderboard is attributable to one change rather than
 * to a bundle of them. That constraint is enforced by a test.
 */
export interface RetrievalConfig {
  name: string
  chunking: 'fixed' | 'article'
  dense: boolean
  lexical: boolean
  rerank: boolean
  rewrite: boolean
  filter: boolean
  k: number
}

export const LADDER: RetrievalConfig[] = [
  { name: 'baseline', chunking: 'fixed',   dense: true, lexical: false, rerank: false, rewrite: false, filter: false, k: 5 },
  { name: 'article',  chunking: 'article', dense: true, lexical: false, rerank: false, rewrite: false, filter: false, k: 5 },
  { name: 'hybrid',   chunking: 'article', dense: true, lexical: true,  rerank: false, rewrite: false, filter: false, k: 5 },
  { name: 'rerank',   chunking: 'article', dense: true, lexical: true,  rerank: true,  rewrite: false, filter: false, k: 5 },
  { name: 'rewrite',  chunking: 'article', dense: true, lexical: true,  rerank: true,  rewrite: true,  filter: false, k: 5 },
  { name: 'filtered', chunking: 'article', dense: true, lexical: true,  rerank: true,  rewrite: true,  filter: true,  k: 5 },
]

export function getConfig(name: string): RetrievalConfig {
  const config = LADDER.find((candidate) => candidate.name === name)
  if (config === undefined) throw new Error(`unknown config: ${name}`)
  return config
}
