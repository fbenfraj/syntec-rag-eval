import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

/**
 * Database tests need DATABASE_URL. Read `.env` directly so `pnpm test` works with no
 * shell setup and no dotenv dependency. A value already in the environment wins, so CI
 * can point the tests at its own database.
 */
function envFile(path = '.env'): Record<string, string> {
  if (!existsSync(path)) return {}
  const entries = readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] as const
    })
    .filter(([key]) => key.length > 0)
  return Object.fromEntries(entries)
}

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // The database tests share one Postgres, and each rebuilds the schema. Running test
    // files in parallel lets one file's DROP TABLE run under another file's assertions.
    fileParallelism: false,
    env: { ...envFile(), ...process.env } as Record<string, string>,
  },
})
