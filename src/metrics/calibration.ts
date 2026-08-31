import { cohensKappa } from './kappa.js'

/**
 * Two-phase verification sampling for judge calibration.
 *
 * Labelling every row by hand is the rigorous option and the slow one. This is the cheap
 * option that stays honest: a second, independent model pre-screens every row, the human
 * then labels every row where the two models disagree plus a random sample of the rows
 * where they agree, and the agreement stratum is reweighted to its true size.
 *
 * What makes it unbiased is the sample of agreements. Labelling only the disagreements and
 * assuming the judge is right everywhere else would inflate kappa for free — the whole
 * question is whether the two models share a blind spot, and only rows a human actually
 * read can answer it.
 */
export interface Stratum {
  /** Rows in this stratum in the whole sample, labelled or not. */
  size: number
  /** The rows a human labelled: the judge's verdict against the human's. */
  labelled: { judge: boolean; human: boolean }[]
}

export interface StratifiedKappa {
  kappa: number
  /** Kappa over only the rows a human labelled, ignoring the weighting. */
  kappaOnLabelled: number
  agreement: number
  labelled: number
  population: number
  /** Estimated judge-vs-human table over the whole sample, reweighted. */
  table: { bothCorrect: number; judgeOnly: number; humanOnly: number; neither: number }
}

function counts(rows: { judge: boolean; human: boolean }[]) {
  return {
    bothCorrect: rows.filter((r) => r.judge && r.human).length,
    judgeOnly: rows.filter((r) => r.judge && !r.human).length,
    humanOnly: rows.filter((r) => !r.judge && r.human).length,
    neither: rows.filter((r) => !r.judge && !r.human).length,
  }
}

/** Cohen's kappa from a 2x2 table of counts, which may be fractional after reweighting. */
export function kappaFromTable(table: StratifiedKappa['table']): number {
  const n = table.bothCorrect + table.judgeOnly + table.humanOnly + table.neither
  if (n === 0) return 1
  const agree = (table.bothCorrect + table.neither) / n
  const judgeTrue = (table.bothCorrect + table.judgeOnly) / n
  const humanTrue = (table.bothCorrect + table.humanOnly) / n
  const chance = judgeTrue * humanTrue + (1 - judgeTrue) * (1 - humanTrue)
  if (chance === 1) return agree === 1 ? 1 : 0
  return (agree - chance) / (1 - chance)
}

export function stratifiedKappa(strata: Stratum[]): StratifiedKappa {
  const table = { bothCorrect: 0, judgeOnly: 0, humanOnly: 0, neither: 0 }
  const everything: { judge: boolean; human: boolean }[] = []

  for (const stratum of strata) {
    if (stratum.labelled.length === 0) {
      if (stratum.size > 0) throw new Error('a stratum with rows but no labels cannot be estimated')
      continue
    }
    // Each labelled row stands for size/labelled rows of its stratum.
    const weight = stratum.size / stratum.labelled.length
    const observed = counts(stratum.labelled)
    table.bothCorrect += observed.bothCorrect * weight
    table.judgeOnly += observed.judgeOnly * weight
    table.humanOnly += observed.humanOnly * weight
    table.neither += observed.neither * weight
    everything.push(...stratum.labelled)
  }

  return {
    kappa: kappaFromTable(table),
    kappaOnLabelled: cohensKappa(everything.map((r) => r.judge), everything.map((r) => r.human)),
    agreement: everything.length === 0 ? 1 : everything.filter((r) => r.judge === r.human).length / everything.length,
    labelled: everything.length,
    population: strata.reduce((sum, stratum) => sum + stratum.size, 0),
    table,
  }
}
