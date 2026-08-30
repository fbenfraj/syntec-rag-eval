import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * A hard ceiling on what this project may spend, enforced in code rather than remembered.
 *
 * Every billed call appends a line here and every call checks the running total first, so
 * a runaway loop stops at the cap instead of at the invoice. Cache hits cost nothing and
 * are not recorded, which is what makes the ledger a record of real money.
 *
 * The ledger lives beside the cache and is not committed: it is this machine's spend, not
 * a property of the repository.
 */
export const DEFAULT_BUDGET_EUR = 20

export interface SpendEntry {
  at: string
  model: string
  inputTokens: number
  outputTokens: number
  eur: number
}

export function budgetEur(): number {
  const configured = Number(process.env.BUDGET_EUR)
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_BUDGET_EUR
}

export function ledgerPath(): string {
  return process.env.SPEND_LEDGER ?? `${process.env.LLM_CACHE_DIR ?? '.cache'}/spend.jsonl`
}

export function readLedger(): SpendEntry[] {
  const path = ledgerPath()
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as SpendEntry)
}

export function totalSpentEur(): number {
  return readLedger().reduce((sum, entry) => sum + entry.eur, 0)
}

export class BudgetExceededError extends Error {
  constructor(spent: number, cap: number) {
    super(
      `budget reached: ${spent.toFixed(4)} EUR of ${cap.toFixed(2)} EUR spent. ` +
        'Raise BUDGET_EUR deliberately, or delete the ledger to start a new budget.',
    )
    this.name = 'BudgetExceededError'
  }
}

/**
 * Refuse to make another billed call once the cap is reached. Checked before the call,
 * because the cost is only known after it: the overshoot is bounded by one call.
 */
export function assertWithinBudget(): void {
  const spent = totalSpentEur()
  const cap = budgetEur()
  if (spent >= cap) throw new BudgetExceededError(spent, cap)
}

export function recordSpend(entry: Omit<SpendEntry, 'at'>): void {
  const path = ledgerPath()
  mkdirSync(dirname(path), { recursive: true })
  appendFileSync(path, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`, 'utf8')
}
