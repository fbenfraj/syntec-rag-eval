// Copy the committed results this page renders into the app, so it deploys standalone.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
mkdirSync(join(here, 'data'), { recursive: true })
for (const name of ['summary.json', 'LEADERBOARD.md', 'FAILURES.md']) {
  copyFileSync(join(here, '..', 'results', name), join(here, 'data', name))
  console.log(`synced ${name}`)
}
