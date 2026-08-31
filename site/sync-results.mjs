/**
 * Make the app self-contained so it deploys on its own.
 *
 * Two things are copied in: the committed results the report renders, and the pipeline
 * source itself. The demo must run the code that was measured — a reimplementation would
 * drift, and then the page would report numbers about a system nobody can try. CI fails if
 * either copy is stale, so the drift cannot happen quietly.
 */
import { cpSync, copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

mkdirSync(join(here, 'data'), { recursive: true })
for (const name of ['summary.json', 'LEADERBOARD.md', 'FAILURES.md']) {
  copyFileSync(join(here, '..', 'results', name), join(here, 'data', name))
}
console.log('synced results')

const core = join(here, 'lib', 'core')
rmSync(core, { recursive: true, force: true })
cpSync(join(here, '..', 'src'), core, {
  recursive: true,
  filter: (source) => !source.endsWith('.test.ts') && !source.includes('fixtures') && !source.includes('testSetup'),
})
/**
 * The core is written for NodeNext, so its relative imports carry a `.js` extension that
 * resolves to a `.ts` file. The bundler here resolves extensionless paths instead, so the
 * suffix is stripped on the way in. Nothing else about the code is touched: the demo has to
 * run what was measured.
 */
function stripJsExtensions(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) {
      stripJsExtensions(path)
      continue
    }
    if (!path.endsWith('.ts')) continue
    const rewritten = readFileSync(path, 'utf8').replace(
      /(from\s+['"])(\.[^'"]*?)\.js(['"])/g,
      (_match, before, specifier, after) => `${before}${specifier}${after}`,
    )
    writeFileSync(path, rewritten, 'utf8')
  }
}
stripJsExtensions(core)
console.log('synced pipeline source into lib/core')
