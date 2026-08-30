import { describe, expect, it } from 'vitest'
import { decodeEntities, htmlToText, splitProseAndTables, tableToMarkdown } from './html.js'

describe('decodeEntities', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeEntities('p&eacute;riode d&#39;essai &amp; co')).toBe("période d'essai & co")
  })

  it('leaves an unknown entity alone', () => {
    expect(decodeEntities('a &bogus; b')).toBe('a &bogus; b')
  })
})

describe('htmlToText', () => {
  it('keeps paragraphs on separate lines', () => {
    const html = '<p>Premier alinéa.</p><p>Deuxième alinéa.</p>'
    expect(htmlToText(html)).toBe('Premier alinéa.\nDeuxième alinéa.')
  })

  it('turns list items into markdown bullets', () => {
    expect(htmlToText('<ul><li>un</li><li>deux</li></ul>')).toBe('- un\n- deux')
  })

  it('collapses runs of whitespace inside a line', () => {
    expect(htmlToText('<p>a   \t b</p>')).toBe('a b')
  })
})

describe('tableToMarkdown', () => {
  const table =
    '<table><tr><th>Position</th><th>Coefficient</th></tr>' +
    '<tr><td>1.1</td><td>95</td></tr><tr><td>2.1</td><td>105</td></tr></table>'

  it('renders a header row and a separator', () => {
    expect(tableToMarkdown(table).split('\n')).toEqual([
      '| Position | Coefficient |',
      '| --- | --- |',
      '| 1.1 | 95 |',
      '| 2.1 | 105 |',
    ])
  })

  it('pads short rows to the widest row', () => {
    const ragged = '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td></tr></table>'
    expect(tableToMarkdown(ragged)).toContain('| c |  |')
  })

  it('returns an empty string for a table with no rows', () => {
    expect(tableToMarkdown('<table></table>')).toBe('')
  })
})

describe('splitProseAndTables', () => {
  const html =
    '<p>La grille est la suivante.</p>' +
    '<table><tr><td>1.1</td><td>22000</td></tr></table>' +
    '<p>Elle est révisée chaque année.</p>'

  it('keeps the table out of the prose', () => {
    const { prose } = splitProseAndTables(html)
    expect(prose).toBe('La grille est la suivante.\nElle est révisée chaque année.')
    expect(prose).not.toContain('22000')
  })

  it('returns each table as its own markdown block', () => {
    const { tables } = splitProseAndTables(html)
    expect(tables).toHaveLength(1)
    expect(tables[0]).toContain('| 1.1 | 22000 |')
  })

  it('reports no tables when there are none', () => {
    expect(splitProseAndTables('<p>rien</p>').tables).toEqual([])
  })
})
