import { defineConfig } from 'vitest/config'
import { readEnvFile, testDatabaseUrl } from './src/env.js'

const env = { ...readEnvFile(), ...process.env } as Record<string, string>

// Tests get their own database. This must be decided here, not in globalSetup: this `env`
// is what the worker threads receive, and it is evaluated before setup runs.
if (env.DATABASE_URL !== undefined && env.DATABASE_URL.length > 0) {
  env.DATABASE_URL = testDatabaseUrl(env.DATABASE_URL).url
}

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // The database tests share one Postgres, and each rebuilds the schema. Running test
    // files in parallel lets one file's DROP TABLE run under another file's assertions.
    fileParallelism: false,
    globalSetup: ['./src/db/testSetup.ts'],
    env,
  },
})
