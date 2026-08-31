# syntec-rag-eval

**Live: [syntec-rag-eval.vercel.app](https://syntec-rag-eval.vercel.app)** — the report, and a
demo you can ask questions of. [English](https://syntec-rag-eval.vercel.app/en).

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

## Cost control

Provider spend is capped in code, not by intention. Every billed call appends to a ledger
and checks the running total first, so a runaway loop stops at the cap rather than at the
invoice. Cache hits cost nothing and are not recorded.

```bash
pnpm spend        # what has been spent, by model, and what is left
```

The cap is `BUDGET_EUR` (default 20). Raising it is a deliberate edit.

## Development

```bash
nvm use                       # Node 22
pnpm install
cp .env.example .env
pnpm db:up                    # Postgres 16 + pgvector on port 57557
pnpm corpus:fetch             # download the DILA dumps (once, ~1.3 GB)
pnpm corpus:build             # write data/corpus/articles.jsonl
pnpm corpus:load              # apply the schema and load it
pnpm embed                    # embed the corpus (~0.07 EUR, resumable)
pnpm test                     # vitest, including the database tests
pnpm typecheck                # tsc --noEmit
```

The database uses port 57557 rather than 5432 so it cannot collide with another Postgres
on the machine — `pnpm corpus:load` starts by dropping tables, so pointing it at the
wrong database would be expensive.

## Results

Six configurations, 142 labelled questions. Full tables in
[`results/LEADERBOARD.md`](results/LEADERBOARD.md); every run is committed, so the score
history is in git.

| rung | adds | recall@5 | answers correct | wrong either way | repealed retrieved |
|---|---|---|---|---|---|
| `baseline` | fixed chunks | 84.2 % | 45.0–76.7 % | 23.3 % | 66.7 % |
| `article` | article chunks | 85.8 % | 46.7–80.8 % | 19.2 % | 67.5 % |
| `hybrid` | + lexical | 78.3 % | 45.8–74.2 % | 25.8 % | 61.7 % |
| `rerank` | + rerank | 87.5 % | 49.2–81.7 % | 18.3 % | 62.5 % |
| `rewrite` | + query rewrite | 88.3 % | 50.0–81.7 % | 18.3 % | 63.3 % |
| `filtered` | + date filter and precedence | **90.8 %** | 44.2–80.0 % | 20.0 % | **0.0 %** |

Three things worth reading the tables for:

- **Hybrid search made retrieval worse**, by 7.5 points. Published as measured. Reranking
  then recovered it and more.
- **Two thirds of queries retrieved repealed law** until the date filter, which takes it to
  zero. The model answers correctly from text that no longer applies — an error no accuracy
  metric can see, and the one that matters most in law.
- **Answer correctness is published as a range, on purpose.** Every other number here is
  checkable without knowing labour law: gold citations are correct by construction, and the
  unanswerable questions were verified mechanically. Deciding whether an *answer* matches
  its reference is the one judgement that needs a domain expert, and none worked on this
  set — a first calibration scored Cohen's kappa 0.489 against a non-expert reader, too weak
  to validate anything. So the same answers are graded by a strict and a lenient rubric and
  both are shown. What does not depend on the rubric: **about 20 % of answers are wrong
  under either reading**. Closing the gap needs roughly two hours from someone who works
  with the Syntec agreement.

- **Failures are split by cause** in [`results/FAILURES.md`](results/FAILURES.md): 4
  retrieval misses, 10 generation misses, 43 rubric-dependent, 10 false refusals, 1 citation
  miss. Retrieval and generation failures have different fixes, which is why they are never
  merged into one number.

The ablation also caught two real bugs in the system it measures — a precedence bonus that
was ten times the score range, and a date filter that was a no-op on 84 % of the set. Both
are written up in [`docs/decisions.md`](docs/decisions.md) with what they cost.

## Report site and live demo

`site/` renders the committed results and hosts the demo, in French with an English version.

```bash
pnpm site:data                     # freeze results/summary.json
pnpm demo:seed                     # copy corpus + embeddings into DEMO_DATABASE_URL
cd site && pnpm install && pnpm sync && pnpm build
```

The demo runs the **same source** as the eval: `pnpm sync` copies `src/` into the app and CI
fails if the copy is stale. A demo that drifted from the harness would be reporting numbers
about a system nobody can try.

Spend and rate limits live in Postgres rather than on disk — a file-based cap is
per-instance on a serverless host and resets whenever the platform recycles, which is not a
cap. Defaults: **€0.50 per day** across all visitors, twelve questions per IP per hour,
checked before each call so the overshoot is bounded by one question. When the ceiling is
reached the API says so plainly instead of billing.

The demo database is a free Neon instance holding only public legal text and usage counters.
If it goes away, the report pages still render; only the demo section reports itself
unavailable.

## Status

Complete through the eval harness, leaderboard, failure catalogue and report site.

## Licence

MIT. Corpus content is French public law and the Syntec convention collective, quoted
for evaluation purposes.
