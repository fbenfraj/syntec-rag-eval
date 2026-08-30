# Gold set

142 questions with verified article citations, used to score every rung of the ablation
ladder. `questions.jsonl` is one JSON object per line.

## What review actually found

The set was drafted at 150 questions, then reviewed in two passes.

| pass | who | outcome |
|---|---|---|
| cross-vendor | a different vendor's model, all 150 rows | 139 ok, 9 bad question, 2 wrong; 10 at low confidence → **19 rows flagged** |
| human | the 19 flagged rows, plus 8 the reviewer had passed, as a control | 17 confirmed, 2 corrected, 8 dropped |

Result: **142 questions, 19 of them human-verified.**

Two numbers are worth stating plainly, because they are the evidence that the review was
worth running at all:

- **The reviewer flagged 12.7% of the set.** Roughly one row in eight was wrong or badly
  posed. Published unreviewed, every metric would have carried that error silently.
- **The human agreed with all 8 controls.** The rows the reviewer passed held up under
  inspection, which is what makes its 131 other passes worth anything. Had even one control
  failed, the flagged list would not have been the whole story and the honest move would
  have been to review the set by hand.

## How this set was built, and what that means

The citations are correct **by construction**, not by recall. Each answerable question was
produced by choosing an article first and then writing a question that article answers, so
the `requiredArticles` field cannot be wrong about *which* article governs — it is the
article the question was written from. No knowledge of French labour law is needed to trust
that part, and none was assumed.

What construction does not guarantee is the wording of the reference answer, or that a
question is natural. Those are checked by a human on a sample. Every row carries its own
`provenance`, so no claim is made beyond what was actually checked:

| `provenance` | meaning |
|---|---|
| `constructed` | drafted from its cited article, citation correct by construction, answer unreviewed |
| `llm-reviewed` | checked against its source article by a **different vendor's** model; disagreements were flagged for a human |
| `human-verified` | a human read the question, the drafted answer and the source article, and confirmed the answer follows from it |
| `human-written` | written by hand from the start |

Report the counts. A leaderboard computed on a set that is 80% `constructed` is still a
real measurement of retrieval — the citations are sound — but it is a weaker claim about
answer correctness, and saying so is cheaper than being caught not saying it.

## Fields

| field | meaning |
|---|---|
| `id` | `q001`… |
| `question` | asked as a salarié or an RH would ask it, not in the article's own words |
| `answer` | the reference answer, one or two sentences, with the exact figure where there is one |
| `requiredArticles` | **corpus ids** (`code:L1221-19`, `convention:47513825`), never article numbers — a convention article number is not unique, "Article 2" occurs 94 times |
| `tier` | 1 single article near-verbatim · 2 one hop or a comparison · 3 multi-article synthesis or date reasoning |
| `category` | see below |
| `asOf` | the date the question is asked about; required for `dated`, otherwise null |
| `theme` | contract · termination · working-time · pay |

## Categories

**`general`** — the answer is in one place and nothing overrides it.
> *"Mon employeur peut-il me demander de signer un contrat rédigé uniquement en anglais ?"* → `code:L1221-3`

**`override`** — the convention and the code disagree, and the convention governs. Only use
this where the Syntec answer genuinely differs from the code's.
> *"Combien de temps peut durer ma période d'essai comme ingénieur dans un cabinet de conseil ?"* → `convention:47513825`

**`dated`** — the answer depends on when the question is asked. Only used where the corpus
holds a superseded wording of the same article, so a system that ignores dates has
something wrong to retrieve. `asOf` is mandatory.

**`unanswerable`** — plausible, in-domain, and genuinely not answered by this corpus. Never
nonsense: a good system must refuse because it does not know, not because the question is
absurd. **These are verified, not asserted**: each draft is retrieved against the real
corpus and scored by the reranker, and any question the corpus actually answers is thrown
away. On the first sample the model proposed "maximum weekly overtime", which the code
covers in full — exactly the mistake that would score a correct answer as a false refusal.

## Rules that matter

- `requiredArticles` names the article that **governs** the answer, not every article that
  mentions the topic. Recall is measured against it, so a padded list makes a rung look
  worse than it is.
- An `unanswerable` question must have **no** required articles. The validator enforces it.
- Questions must not reuse the article's vocabulary. `pnpm gold:validate` reports the mean
  lexical overlap with the cited article; a set of near-copies measures string matching
  rather than retrieval, and the number is published rather than hidden.

## Working on it

```bash
pnpm gold:generate 150      # draft from the corpus (overwrites questions.jsonl)
pnpm gold:validate          # mechanical checks, category mix, overlap
pnpm gold:review-pack       # build data/gold/review/ for a cross-vendor check
pnpm gold:apply-llm-review  # fold the verdicts in, emit the short human sheet
pnpm gold:review            # or: sample a sheet for direct human review
pnpm gold:apply-review      # fold human verdicts in
```

## Why the review is cross-vendor

The set is drafted by one model. Having a second model from the *same* vendor check it
measures self-consistency, not correctness: two models sharing training data and training
method tend to misread the same sentence the same way, and they agree most confidently
exactly where the first one was confidently wrong.

So the check is run by a different vendor's model, and it never produces
`human-verified` — a model's agreement is evidence, not verification. What anchors the
chain is a small **control sample**: rows the reviewer passed, read by a human. If the
human agrees with all of them, the reviewer's passes mean something. If not, the flagged
list was never the whole story, and the number to publish is that disagreement rate.
