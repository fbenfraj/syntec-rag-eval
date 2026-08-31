# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

*(inferred from the project brief and the parent site's positioning; not confirmed in an interview)*

Two readers, arriving from the same link on frajtech.com:

- **A technical buyer** — CTO, head of engineering, or founder evaluating whether FrajTech
  can be trusted with an applied-AI build. They are sceptical of demos and have seen many.
  Their job on this page is to decide, in under two minutes, whether the person behind it
  measures their own work or just ships it.
- **An engineer** who wants to read the method: the ablation, the failure taxonomy, why
  answer correctness is published as a range. They will click through to the repository.

Neither is a labour-law professional. The legal subject is the test bed, not the audience.

## Product Purpose

syntec-rag-eval answers French labour-law questions from retrieved articles of the Code du
travail and the Syntec collective agreement, and refuses when the corpus cannot support an
answer. The product is not the pipeline — it is the **measurement around** the pipeline: a
hand-labelled gold set, an ablation leaderboard, and a catalogue of what it gets wrong.

Success on this surface: a visitor asks a question, watches the system retrieve and answer,
can check the citation against the source text themselves, and leaves believing the
published numbers.

## Positioning

Publishes results that make the system look worse, because they are what was measured:
hybrid search lowered recall by 7.5 points, and answer correctness is a range rather than a
number because no qualified annotator adjudicated it. The demo runs the **same source** as
the eval harness — CI fails if the copy drifts — so the numbers describe a system a visitor
can try.

## Operating Context

Reached from the "Réalisations / Selected work" carousel on frajtech.com — the whole card
is the link — in French and English. Read on a laptop, most often in daylight, alongside other tabs. Visitors will not
read linearly; they will try the demo, then scan for whether the numbers hold up.

## Capabilities and Constraints

- Live demo: one question → retrieval over 3,030 indexed articles → grounded answer or an
  explicit refusal, with every retrieved extract shown, cited or not. The index deliberately
  holds repealed articles; keeping them out is the date filter's job, and the demo shows it
  doing that work.
- The shipped pipeline is the `filtered` rung: query rewrite → dense + lexical retrieval →
  RRF fusion → date filter and precedence → rerank → generation.
- **Spend is capped in code**: €0.50 per day across all visitors, 12 questions per IP per
  hour, held in Postgres so the cap survives serverless recycling. When the ceiling is
  reached the API says so rather than billing.
- Question length 8–300 characters. Answer latency p95 ≈ 2.5 s; ≈ €0.0045 per question.
- No token streaming: the provider client is memoised on the exact request and returns a
  whole completion. Anything the page streams must be pipeline progress, not tokens.
- The demo database is a free Neon instance. If it goes away the report must still render;
  only the demo reports itself unavailable.
- No authentication, no conversation memory, no multi-tenancy.

## Brand Commitments

- The **product** is called **Le Bon Article**. `syntec-rag-eval` remains the repository and
  the eval harness; the demonstration a visitor sees is the product, and a repo slug in the
  masthead read as a weekend project rather than something shipped.
- The surface borrows an official French register but must never be mistaken for a public
  service: no Marianne, no state wordmark, and a disclaimer in the chrome of every page.
- French is the primary language; `/en` is a full translation, not a summary.
- Voice: plain, exact, unhedged. States what was measured and what was not. Never claims a
  number it cannot show. Never apologises for a bad result.
- Part of FrajTech, whose site is dark, restrained, mono-labelled. This page may have its
  own world but must not read as a different company.

## Evidence on Hand

- `results/summary.json` — every published number, generated from six committed eval runs.
- `results/LEADERBOARD.md`, `results/FAILURES.md` — full tables, in the repository.
- `data/gold/` — the 142 labelled questions.
- `docs/decisions.md` — the two bugs the ablation caught in the system it measures.
- The live demo itself, against a real corpus.
- **Absent, and never to be invented:** clients, users, testimonials, adoption, any claim
  that a lawyer validated the answers. A first judge calibration scored Cohen's κ 0.489
  against a non-expert reader; the judge is published as unvalidated.

## Product Principles

1. **Retrieval failure and generation failure are never merged into one number.** They have
   different fixes.
2. **Refusal accuracy is always published next to the false-refusal rate.** A system that
   refuses everything scores 100 % on the first.
3. **A visitor must be able to check the answer, not trust it.** Every extract the model saw
   is shown, with which ones it cited.
4. **Bad results are published as measured.** A ladder where every rung improves is a ladder
   nobody really measured.
5. **The demo runs the measured code.** A reimplementation would drift, and then the page
   would report numbers about a system nobody can try.

## Accessibility & Inclusion

Keyboard-operable demo, visible focus, and a readable result without colour as the only
signal (in-force vs repealed must carry text, not just hue). Motion is an enhancement: the
pipeline trace must reach its final state without animation, since the reveal bug this
codebase already paid for was an animation that never ran.
