import { describe, expect, it } from 'vitest'
import { lexicalOverlap, validateGoldSet } from './validate.js'
import { GoldQuestionSchema, type GoldQuestion } from './types.js'

const known = new Set(['code:L1221-19', 'convention:47513825'])

const q = (over: Partial<GoldQuestion> = {}): GoldQuestion =>
  GoldQuestionSchema.parse({
    id: 'q001',
    question: "Quelle est la durée de la période d'essai d'un cadre Syntec ?",
    answer: 'Quatre mois, renouvelable une fois.',
    requiredArticles: ['convention:47513825'],
    tier: 2,
    category: 'override',
    asOf: null,
    ...over,
  })

describe('validateGoldSet', () => {
  it('accepts a well-formed set', () => {
    expect(validateGoldSet([q()], known)).toEqual([])
  })

  it('rejects an answerable question with no required articles', () => {
    expect(validateGoldSet([q({ requiredArticles: [] })], known)[0]).toMatch(/requires at least one article/i)
  })

  it('rejects an unanswerable question that names required articles', () => {
    const bad = q({ category: 'unanswerable', requiredArticles: ['convention:47513825'] })
    expect(validateGoldSet([bad], known)[0]).toMatch(/unanswerable/i)
  })

  it('accepts an unanswerable question with no citations', () => {
    expect(validateGoldSet([q({ category: 'unanswerable', requiredArticles: [] })], known)).toEqual([])
  })

  it('rejects a required article that is not in the corpus', () => {
    expect(validateGoldSet([q({ requiredArticles: ['code:L9999-1'] })], known)[0]).toMatch(/not in the corpus/i)
  })

  it('rejects a dated question with no as-of date', () => {
    expect(validateGoldSet([q({ category: 'dated' })], known)[0]).toMatch(/asOf/i)
  })

  it('rejects duplicate ids', () => {
    expect(validateGoldSet([q(), q()], known)[0]).toMatch(/duplicate id/i)
  })

  it('rejects the same article cited twice', () => {
    const bad = q({ requiredArticles: ['convention:47513825', 'convention:47513825'] })
    expect(validateGoldSet([bad], known)[0]).toMatch(/twice/i)
  })

  it('requires an article number to be a corpus id, not a bare number', () => {
    // "4" is an article number, and 94 different articles carry it.
    expect(validateGoldSet([q({ requiredArticles: ['4'] })], known)[0]).toMatch(/not in the corpus/i)
  })
})

describe('lexicalOverlap', () => {
  it('is high when the question copies the article wording', () => {
    const article = "La période d'essai des ingénieurs et cadres est de quatre mois."
    expect(lexicalOverlap("période d'essai des ingénieurs et cadres", [article])).toBeGreaterThan(0.9)
  })

  it('is low when the question is asked in ordinary words', () => {
    const article = "La période d'essai des ingénieurs et cadres est de quatre mois."
    expect(lexicalOverlap('combien de temps mon patron peut-il me tester avant embauche ferme', [article])).toBeLessThan(0.3)
  })

  it('ignores accents, so "periode" and "période" count as the same word', () => {
    expect(lexicalOverlap('periode essai', ["période d'essai"])).toBe(1)
  })

  it('is zero for a question with no substantial words', () => {
    expect(lexicalOverlap('et le ?', ['article'])).toBe(0)
  })
})
