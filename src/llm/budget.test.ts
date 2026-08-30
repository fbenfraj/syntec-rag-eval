import { beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BudgetExceededError, assertWithinBudget, budgetEur, recordSpend, totalSpentEur } from './budget.js'

beforeEach(async () => {
  const directory = await mkdtemp(join(tmpdir(), 'budget-'))
  process.env.SPEND_LEDGER = join(directory, 'spend.jsonl')
  delete process.env.BUDGET_EUR
})

describe('the spend ledger', () => {
  it('starts empty', () => {
    expect(totalSpentEur()).toBe(0)
  })

  it('sums what has been recorded', () => {
    recordSpend({ model: 'test-model', inputTokens: 1, outputTokens: 1, eur: 0.25 })
    recordSpend({ model: 'test-model', inputTokens: 1, outputTokens: 1, eur: 0.75 })
    expect(totalSpentEur()).toBeCloseTo(1, 6)
  })

  it('defaults to a 20 EUR cap', () => {
    expect(budgetEur()).toBe(20)
  })

  it('takes the cap from the environment when it is set', () => {
    process.env.BUDGET_EUR = '2.5'
    expect(budgetEur()).toBe(2.5)
  })

  it('ignores a nonsensical cap rather than running uncapped', () => {
    process.env.BUDGET_EUR = 'lots'
    expect(budgetEur()).toBe(20)
    process.env.BUDGET_EUR = '-5'
    expect(budgetEur()).toBe(20)
  })

  it('allows a call while under the cap', () => {
    process.env.BUDGET_EUR = '1'
    recordSpend({ model: 'test-model', inputTokens: 1, outputTokens: 1, eur: 0.99 })
    expect(() => assertWithinBudget()).not.toThrow()
  })

  it('refuses the next call once the cap is reached', () => {
    process.env.BUDGET_EUR = '1'
    recordSpend({ model: 'test-model', inputTokens: 1, outputTokens: 1, eur: 1 })
    expect(() => assertWithinBudget()).toThrow(BudgetExceededError)
  })

  it('names the amounts in the error, so the cap can be raised knowingly', () => {
    process.env.BUDGET_EUR = '1'
    recordSpend({ model: 'test-model', inputTokens: 1, outputTokens: 1, eur: 1.5 })
    expect(() => assertWithinBudget()).toThrow(/1\.5000 EUR of 1\.00 EUR/)
  })
})
