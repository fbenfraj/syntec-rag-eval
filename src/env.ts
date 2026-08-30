import { existsSync, readFileSync } from 'node:fs'

/**
 * Minimal `.env` reader, so `pnpm test` and the scripts work with no shell setup and
 * without a dotenv dependency. A value already in the environment always wins, so CI can
 * override any of it.
 */
export function readEnvFile(path = '.env'): Record<string, string> {
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=')
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] as const
      })
      .filter(([key]) => key.length > 0),
  )
}

/** Apply `.env` to `process.env` without overwriting anything already set. */
export function applyEnvFile(path = '.env'): void {
  for (const [key, value] of Object.entries(readEnvFile(path))) {
    if (process.env[key] === undefined) process.env[key] = value
  }
}

/**
 * The database the tests run against: the working database's name with `_test` appended.
 *
 * Derived in one place and used both by the vitest config and by the setup that creates
 * it. Computing it only in `globalSetup` is not enough — the config's `env` is evaluated
 * before setup runs, so the workers would still be handed the working database and the
 * first `applySchema` would drop the embedded corpus.
 */
export function testDatabaseUrl(workingUrl: string): { url: string; database: string; adminUrl: string } {
  const url = new URL(workingUrl)
  const database = `${url.pathname.replace(/^\//, '')}_test`
  const adminUrl = new URL(workingUrl)
  adminUrl.pathname = '/postgres'
  url.pathname = `/${database}`
  return { url: url.toString(), database, adminUrl: adminUrl.toString() }
}
