# Decisions

`artifact` projects keep their decisions here instead of in Notion's Decision Log,
because for an artifact the reasoning is part of what is published.

Append-only. Superseding a row keeps it and adds a new one saying what the old answer
got right — see `/pos-retro` step 6. Do not edit history to look decisive.

Tags, the same five `/pos-discover` uses:

- **Decision** — committed; changing it requires a new row that supersedes this one
- **Preference** — leaning, not committed; may be traded away
- **Hypothesis** — believed, needs validation by a real run
- **Idea** — mentioned, not evaluated. Mentioning is not committing
- **Open** — explicitly unresolved, with what it blocks

---

## D-005 — The eval database listens on port 57557

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L1

**Decision.** `docker-compose.yml` publishes Postgres on 57557, not 5432 or the 5433 the
plan named, and the compose project is named `syntec-rag-eval`.

**Why.** Development machines usually already run a Postgres, often several — this one
has a Supabase stack on 54321-54324. A collision on a well-known port either fails the
container start or, worse, points `DATABASE_URL` at somebody else's database, and the
schema here begins with `DROP TABLE`. An unusual port makes that mistake impossible.
`getPool()` refuses to default the connection string for the same reason.

---

## D-006 — Haiku generates, Sonnet judges, Voyage embeds and reranks

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** `claude-haiku-4-5` writes answers, `claude-sonnet-4-5` runs the judge,
`voyage-law-2` embeds (1024 dimensions) and `rerank-2` reranks. All four are overridable
by environment variable, and every one has a published price in `src/llm/pricing.ts`.

**Why.** The split follows what each number is worth. A cheaper generator makes retrieval
quality *more* visible, which is the point of an ablation: if a strong model papers over a
bad retrieval rung, the ladder stops measuring anything. The judge is the opposite case —
it decides whether every other number is true, so it gets the better model and is
calibrated against human labels. A dedicated reranker rather than an LLM scoring
candidates cuts roughly €3-10 off every full run for about €0.20; that alone pays for the
second provider.

Anthropic sells no embedding endpoint, so a second provider was not optional. Voyage is
Anthropic's recommended partner and sells the reranker too, so it is one key rather than
two.

**Considered and rejected.** Sonnet for generation as well would roughly triple the bill
per run and weaken the ablation's signal. OpenAI `text-embedding-3-small` would have kept
the schema at 1536 dimensions and is a strong generalist; it is still worth adding later
as a second leaderboard row, since a second embedding pass over the corpus costs about six
cents. Whether legal-domain training actually helps on French statute is a measurable
question, and this repo is the instrument that measures it — asserting it would have been
the weaker move.

---

## D-007 — The gold set is constructed from the corpus, then spot-checked

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** Answerable questions are produced by choosing an article first and writing a
question it answers, so `requiredArticles` is correct by construction. Every row carries a
`provenance` field, and only rows a human has read are marked `human-verified`.

**Why.** Hand-labelling 150 questions requires a labour-law specialist, and there isn't
one. Construction removes that requirement for the part that matters most: retrieval
metrics are scored against the citation, and the citation is the article the question was
written from — it cannot be wrong. What construction does not certify is the wording of
the reference answer, so that is checked on a sample and the counts are published rather
than glossed.

**Considered and rejected.** Asserting a hand-labelled set would have been a stronger
claim and a false one. Skipping human review entirely was cheaper but leaves nothing
verified. A smaller fully-reviewed set was the alternative; it trades wider error bars on
every leaderboard number for tighter confidence per row, and at 60 questions the bars get
wide enough to hide the differences between adjacent rungs.

---

## D-008 — Unanswerable questions are verified against the corpus, not asserted

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** Every drafted `unanswerable` question is retrieved against the real corpus
and scored by the reranker. Any question the corpus in fact answers is discarded and
redrafted. Ten drafts were rejected this way while building the set.

**Why.** Asked for an unanswerable question, the model produced "what is the maximum number
of overtime hours per week?" — which the code answers in full. Left in, that row scores a
correct answer as a false refusal, corrupting both refusal accuracy and the false-refusal
rate: the two numbers this project exists to publish honestly, and the two that are
meaningless if either is contaminated.

**Known limitation, to be published.** The check rejects on topical similarity, not on
answerability. A question about a different collective agreement is genuinely unanswerable
here, yet retrieves topically similar Syntec articles and gets rejected. The surviving
unanswerable questions are therefore topically distant from the corpus, which makes
refusing them easier than refusing a near-miss. Refusal accuracy from this set is an
optimistic estimate, and the failure catalogue must say so rather than let the number
stand unqualified.

---

## D-009 — Precedence is a rank head start, not a score bonus

- **Tag:** Decision
- **Date:** 2026-08-31
- **Status:** active
- **Level:** L2

**Decision.** `boostPrecedence` moves a convention article `PRECEDENCE_RANK_BONUS = 2`
places up the list. It does not add anything to the score.

**Why.** Two score-based versions failed on scale, and the ablation is what caught it.
A flat `+0.15` is reasonable against a cosine similarity in [0, 1] and meaningless against
a reciprocal-rank-fusion score of about 0.016 — the bonus was ten times the entire range,
so every convention article outranked every code article whatever the question. The
`filtered` rung scored **recall 37.5% against 88.3%** for the rung below it, and every miss
had retrieved five convention articles for a question the Code answers. The obvious repair,
a relative `+15%`, failed for the opposite reason: RRF compresses ranks 1 to 10 into a 15%
spread, so a percentage bonus quietly buys nine places.

Ranks are the unit the ordering is actually in, so a head start expressed in ranks behaves
identically whatever produced the scores. After the fix the same rung scores **recall
90.8%**, the best on the ladder.

**What it cost, and what it bought.** One rung re-run, EUR 0.50. The bug was invisible in
every unit test written against cosine-scale scores and would have shipped as a published
result claiming that date filtering and precedence make retrieval worse.

---

## D-010 — An undated question is asked today

- **Tag:** Decision
- **Date:** 2026-08-31
- **Status:** active
- **Level:** L2

**Decision.** `runEval` passes `asOfDefault`, the run date, for any gold question without
its own `asOf`.

**Why.** 119 of 142 questions carry no date, and treating that as "no date constraint" made
the date filter a no-op for 84% of the set — the rung could not be measured at all. Somebody
asking a labour-law question today wants the law as it stands today. With the default in
place, retrieval of repealed articles drops from **63.3% to 0.0%**.

---

## D-011 — The demo runs the measured source, not a reimplementation

- **Tag:** Decision
- **Date:** 2026-08-31
- **Status:** active
- **Level:** L2

**Decision.** `site/sync-results.mjs` copies `src/answer`, `src/corpus`, `src/llm` and
`src/retrieval` into `site/lib/core`, and CI fails if that copy differs from `src/`. The
demo's API route calls `retrieveWithCost` and `answer` directly, on the `filtered` config.

**Why.** The page publishes numbers about a pipeline and invites a visitor to try it. If the
two were separate implementations they would drift, and the invitation would become a lie
that nobody could detect from the outside. Copying rather than importing is forced by the
deployment: the host uploads `site/` alone, so anything outside it does not exist at build
time. The staleness check is what makes the copy safe.

**Considered and rejected.** Importing across the package boundary needed either a monorepo
build root or a published package, both more machinery than a staleness check. Writing a
small standalone pipeline for the demo would have been quicker and is exactly the drift this
decision exists to prevent.

---

## D-012 — Demo spend is capped in Postgres, not on disk

- **Tag:** Decision
- **Date:** 2026-08-31
- **Status:** active
- **Level:** L2

**Decision.** The public demo counts spend and requests in a `demo_usage` table: €0.50 per
day across all visitors, twelve questions per IP per hour. IPs are hashed with a
server-side salt.

**Why.** The CLI's budget guard writes to a file, which on a serverless host is per-instance
and discarded between requests — it would reset whenever the platform recycled a container,
which is not a ceiling but the appearance of one. The limits are checked before each call,
so the overshoot is bounded by a single question, and the API returns a plain "budget
reached, resets at midnight UTC" rather than quietly spending more. Hashing the IP is enough
to tell visitors apart for rate limiting, which is all rate limiting needs.

**Known expiry.** The demo database is a free Neon instance. It does not expire on a timer,
but it is a free tier and it holds nothing that cannot be rebuilt: `pnpm demo:seed` restores
the whole corpus from the local eval database in about a minute.

---

## D-001 — Source the corpus from DILA open data, not the Légifrance API

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** The corpus is built from the LEGI and KALI bulk dumps published at
`echanges.dila.gouv.fr/OPENDATA`, pinned to the `20250713-140000` snapshot.

**Why.** The dumps are Licence Ouverte and need no account, no API key and no rate
budget, so anyone can reproduce the corpus with one script. That matters more here than
freshness: this repo publishes derived legal text, and a reader has to be able to check
it against the same source. Pinning the snapshot means a rebuild produces the same
articles, so a corpus change is always a reviewable diff rather than a silent drift.

**Considered and rejected.** The Légifrance PISTE API returns the same content and is
fresher, but it requires registering an OAuth client, which makes the corpus
irreproducible for anyone who has not registered — the opposite of what a portfolio
artifact needs. Scraping the HTML site was rejected as both fragile and rude.

---

## D-002 — A convention article is identified by its Légifrance id, not its number

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** Convention article ids are `convention:<Légifrance article id>`, for
example `convention:47513825`. The human article number stays on `articleId` and the
text it belongs to stays in `title`.

**Why.** Article numbers are not unique. The Syntec convention is 208 separate texts and
numbering restarts in each, so "Article 2" occurs 94 times; worse, a single text with
several annexes contains several distinct in-force "Article 1er". The first id scheme
scoped the number to its text and still produced 13 collisions, caught by the
uniqueness guard in `scripts/build-corpus.ts`. A colliding id silently merges two
articles, which would corrupt every retrieval metric that counts a hit by id. The
Légifrance id is unique by construction and resolves to a public URL, so a citation
stays checkable: `legifrance.gouv.fr/conv_coll/id/KALIARTI000047513825`.

**Considered and rejected.** Appending a disambiguating suffix only to colliding numbers
keeps ids readable but makes them depend on iteration order, so the same corpus could
build twice with different ids. Readability is recovered for free by `articleId` and
`title`, which are what a reader actually sees.

---

## D-003 — Filter the code to four themes; keep the convention whole

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** Code du travail articles are kept only if their chapter belongs to one of
the four themes (`src/corpus/themes.ts`). Every in-force Syntec article is kept, whatever
its subject. Result: 1,019 code articles and 1,089 convention articles.

**Why.** The asymmetry is deliberate. Dropping out-of-theme code articles is safe —
11,433 in-force articles are mostly irrelevant, and the ones removed could only act as
distractors. Dropping convention articles is not safe: there is no reliable way to decide
a Syntec article is off-theme without reading it, and a wrongly dropped one turns an
answerable question into a false `unanswerable` label. That corrupts the refusal metrics,
which are the ones this project exists to report honestly. The convention is small enough
that keeping it whole costs almost nothing.

**Considered and rejected.** Keyword-filtering the convention by title would have made the
two sources symmetrical and the corpus smaller, at the price of a silent, unmeasurable
error in the gold set. Keeping the whole code as well would have made retrieval harder in
a more realistic way, but multiplies embedding cost by five for distractors that no gold
question asks about.

---

## D-004 — Tables leave the prose and become their own articles

- **Tag:** Decision
- **Date:** 2026-08-30
- **Status:** active
- **Level:** L2

**Decision.** An HTML table inside an article is rendered as markdown and emitted as a
separate record with `contentKind: 'table'` and an id suffix `#table-N`, carrying the
article title so it reads on its own. 66 of 2,108 records are tables.

**Why.** Salary grids and notice-period grids are exactly the content the pay and
termination themes ask about, and they are the content a fixed-size chunker destroys: a
grid split across a chunk boundary loses the header row and becomes unreadable, so the
answer is present in the corpus but unretrievable. Keeping the grid whole means a
retrieval miss on a salary question is a real retrieval failure and not an artefact of
chunking.

**Considered and rejected.** Leaving tables inline is simpler and is what a naive
pipeline does — which is the point: this is one of the ablation rungs worth measuring
rather than assuming.

---

## D-001 — <short title>

- **Tag:** Decision
- **Date:** YYYY-MM-DD
- **Status:** active | superseded by D-0NN
- **Level:** L1 | L2 | L3

**Decision.** One sentence, in the present tense.

**Why.** The reasoning, including what it forecloses.

**Considered and rejected.** What else was on the table and what it would have cost.
