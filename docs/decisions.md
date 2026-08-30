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
