import { describe, expect, it } from 'vitest'
import { codeChapterOf, isCodeArticleInScope, themeOfCodeArticle } from './themes.js'

describe('codeChapterOf', () => {
  it('reads the chapter out of a legislative or regulatory number', () => {
    expect(codeChapterOf('L1221-19')).toBe('1221')
    expect(codeChapterOf('R1234-1')).toBe('1234')
    expect(codeChapterOf('D3121-25')).toBe('3121')
  })

  it('returns null for something that is not an article number', () => {
    expect(codeChapterOf('Annexe I')).toBeNull()
    expect(codeChapterOf('4')).toBeNull()
  })
})

describe('themeOfCodeArticle', () => {
  it('places each theme\'s landmark article', () => {
    expect(themeOfCodeArticle('L1221-19')).toBe('contract')
    expect(themeOfCodeArticle('L1234-1')).toBe('termination')
    expect(themeOfCodeArticle('L3121-1')).toBe('working-time')
    expect(themeOfCodeArticle('L3231-2')).toBe('pay')
  })

  it('leaves an out-of-scope chapter out', () => {
    expect(themeOfCodeArticle('L4121-1')).toBeNull()
    expect(isCodeArticleInScope('L4121-1')).toBe(false)
  })
})
