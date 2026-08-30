# syntec-rag-eval — agent guardrails

@~/.claude/product-os/guardrails.md

## Coordinates

Kind: artifact
Spec: `frajtech-landing/docs/superpowers/specs/2026-08-30-portfolio-credibility-design.md`
Plan: `frajtech-landing/docs/superpowers/plans/2026-08-30-syntec-rag-eval.md`

## Repo rules

- This repo is public. Git commits credit Farouk Ben Fraj only — no AI co-author or
  generated-by trailers, in commit messages or PR bodies.
- Node 22 (`.nvmrc`). pnpm. `pnpm test` and `pnpm typecheck` must pass before a commit.

## Lessons this product paid for

**Tests that rebuild a schema must own their database.** `applySchema` drops and recreates
the article tables. Pointed at the working database, `pnpm test` destroyed the embedded
corpus twice — silently, with a green test run as the only evidence. The first fix moved
the redirect into vitest's `globalSetup`, which was not enough: `test.env` is evaluated
before setup runs, so the workers were still handed the working database. The test database
is now derived in `vitest.config.ts` itself. Any future test that writes to Postgres must
go through that path, and a change here needs the before/after row count checked, not
assumed.

**A cache keyed on a batch is not a cache.** Embeddings were first cached per API call, so
re-running with a different batch size re-billed the whole corpus — the exact thing the
cache exists to prevent. Keys are per text now. Re-embedding 3,756 chunks at a new batch
size costs nothing, and that is checked by test rather than remembered.
