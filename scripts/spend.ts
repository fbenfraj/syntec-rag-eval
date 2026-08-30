/** What this project has actually spent, by model. */
import { budgetEur, ledgerPath, readLedger, totalSpentEur } from '../src/llm/budget.js'

const entries = readLedger()
const byModel = new Map<string, { calls: number; inputTokens: number; outputTokens: number; eur: number }>()
for (const entry of entries) {
  const row = byModel.get(entry.model) ?? { calls: 0, inputTokens: 0, outputTokens: 0, eur: 0 }
  row.calls += 1
  row.inputTokens += entry.inputTokens
  row.outputTokens += entry.outputTokens
  row.eur += entry.eur
  byModel.set(entry.model, row)
}

console.log(`ledger: ${ledgerPath()}`)
for (const [model, row] of [...byModel].sort((a, b) => b[1].eur - a[1].eur)) {
  console.log(
    `  ${model.padEnd(28)} ${String(row.calls).padStart(5)} calls  ` +
      `${row.inputTokens.toLocaleString().padStart(11)} in / ${row.outputTokens.toLocaleString().padStart(8)} out  ` +
      `${row.eur.toFixed(4)} EUR`,
  )
}
const spent = totalSpentEur()
const cap = budgetEur()
console.log(`\ntotal ${spent.toFixed(4)} EUR of ${cap.toFixed(2)} EUR cap — ${(cap - spent).toFixed(4)} EUR left`)
if (entries.length === 0) console.log('(nothing recorded yet)')
