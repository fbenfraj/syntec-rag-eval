import { describe, expect, it } from 'vitest'
import { REFUSAL_TOKEN, buildUserPrompt, fabricatedCitations, parseAnswer } from './answer.js'
import type { Hit } from '../retrieval/types.js'

const hit = (id: string, articleId = id): Hit => ({
  id, articleId, source: 'code', content: `contenu de ${id}`, score: 1,
  precedence: 0, effectiveFrom: null, effectiveTo: null,
})

describe('parseAnswer', () => {
  it('extracts citations from the sources line', () => {
    const raw = "La période d'essai est de trois mois.\nSOURCES: convention:47513825, code:L1221-19"
    expect(parseAnswer(raw)).toEqual({
      text: "La période d'essai est de trois mois.",
      citations: ['convention:47513825', 'code:L1221-19'],
      refused: false,
    })
  })

  it('flags a refusal and returns no citations', () => {
    const parsed = parseAnswer(REFUSAL_TOKEN)
    expect(parsed.refused).toBe(true)
    expect(parsed.citations).toEqual([])
  })

  it('flags a refusal even when the model adds a sentence around the token', () => {
    expect(parseAnswer(`${REFUSAL_TOKEN} - le corpus ne couvre pas ce point.`).refused).toBe(true)
  })

  it('treats a half-refusal that still asserts a fact as a refusal', () => {
    const raw = `Les extraits sont ${REFUSAL_TOKEN}, mais la durée est de trois mois.\nSOURCES: code:L1221-19`
    const parsed = parseAnswer(raw)
    expect(parsed.refused).toBe(true)
    expect(parsed.citations).toEqual([])
  })

  it('returns no citations when the sources line is absent', () => {
    expect(parseAnswer('Trois mois.').citations).toEqual([])
  })

  it('strips the brackets the prompt uses to label extracts', () => {
    expect(parseAnswer('Trois mois.\nSOURCES: [code:L1221-19], [convention:47513825]').citations).toEqual([
      'code:L1221-19',
      'convention:47513825',
    ])
  })

  it('does not count the same citation twice', () => {
    expect(parseAnswer('Trois mois.\nSOURCES: code:L1221-19, code:L1221-19').citations).toEqual(['code:L1221-19'])
  })

  it('keeps the answer text free of the sources line', () => {
    expect(parseAnswer('Trois mois.\nSOURCES: code:L1221-19').text).toBe('Trois mois.')
  })
})

describe('buildUserPrompt', () => {
  it('labels each extract with its corpus id, not its article number', () => {
    // Two different convention articles both numbered 2 must stay distinguishable.
    const prompt = buildUserPrompt('q', [hit('convention:5851634', '2'), hit('convention:5851636', '2')])
    expect(prompt).toContain('[convention:5851634]')
    expect(prompt).toContain('[convention:5851636]')
  })

  it('says plainly that there are no extracts rather than sending an empty block', () => {
    expect(buildUserPrompt('q', [])).toContain('aucun')
  })
})

describe('fabricatedCitations', () => {
  it('finds a citation that was never among the extracts', () => {
    expect(fabricatedCitations(['code:L1221-19', 'code:L9999-1'], [hit('code:L1221-19')])).toEqual(['code:L9999-1'])
  })

  it('is empty when every citation was offered', () => {
    expect(fabricatedCitations(['code:L1221-19'], [hit('code:L1221-19')])).toEqual([])
  })
})
