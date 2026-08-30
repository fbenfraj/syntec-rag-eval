# syntec-rag-eval

Measured retrieval over French labour law: the **Code du travail** and the **Syntec
convention collective**.

The system answers questions from retrieved articles and refuses when the corpus does
not contain the answer. The point of the project is not the pipeline — it is the
measurement around it:

- a **gold set** of 150 hand-labelled questions, ~15% of them unanswerable
- an **ablation leaderboard** comparing named retrieval configurations
- a **failure catalogue** describing what it gets wrong and why

Two rules hold throughout:

- retrieval failure (wrong articles fetched) and generation failure (right articles,
  wrong answer) are always scored and reported separately
- refusal accuracy is always published next to the false-refusal rate, never alone

Every eval run writes a results file that is committed, so score history lives in git.

## Scope

Four themes: contract and trial periods; notice and termination; working time and
forfait-jours; classification and minimum salaries.

Out of scope: authentication, multi-tenancy, conversation memory, streaming, a polished
chat UI.

## Stack

Node 22, pnpm, TypeScript, vitest, zod, Postgres 16 + pgvector, Next.js 15.

## Corpus

Built from the two DILA open-data dumps (Licence Ouverte, no API key):

| Source | Dump | What is kept |
|---|---|---|
| Code du travail | LEGI (`LEGITEXT000006072050`) | in-force articles in the four themes — 1,019 |
| Syntec, IDCC 1486 | KALI (`KALICONT000005635173`) | every in-force article — 1,089 |

```bash
pnpm corpus:fetch   # download and unpack the dumps into data/raw (gitignored)
pnpm corpus:build   # write data/corpus/articles.jsonl (committed)
```

The dumps are pinned to the `20250713-140000` snapshot, so a rebuild reproduces the same
2,108 articles and any corpus change shows up as a diff. Convention articles are
identified by their Légifrance id rather than their article number, because numbers
collide — see `docs/decisions.md`.

## Development

```bash
nvm use          # Node 22
pnpm install
pnpm test        # vitest
pnpm typecheck   # tsc --noEmit
```

## Status

In progress. The corpus is built and committed (2,108 articles). Indexing, the eval
harness, the gold set and the report page are next.

## Licence

MIT. Corpus content is French public law and the Syntec convention collective, quoted
for evaluation purposes.
