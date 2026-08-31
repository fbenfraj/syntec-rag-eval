# Ablation leaderboard

Gold set: **142 questions**. Generator: `claude-haiku-4-5-20251001`. Judge: `claude-sonnet-4-5-20250929`.
Prices converted at 0.92 EUR/USD as of 2026-08-30.

Each rung adds exactly one capability to the rung above it, so the change in a column is
attributable to that one capability. Deltas are percentage points against the previous rung.

## Retrieval

| rung | adds | recall@5 | full recall@5 | MRR | repealed retrieved |
|---|---|---|---|---|---|
| `baseline` | fixed chunks | 84.2% | 84.2% | 0.572 | 66.7% |
| `article` | article chunks | 85.8% (+1.7) | 85.8% | 0.600 | 67.5% (+0.8) |
| `hybrid` | article chunks + lexical | 78.3% (−7.5) | 78.3% | 0.552 | 61.7% (−5.8) |
| `rerank` | article chunks + lexical + rerank | 87.5% (+9.2) | 87.5% | 0.705 | 62.5% (+0.8) |
| `rewrite` | article chunks + lexical + rerank + rewrite | 88.3% (+0.8) | 88.3% | 0.703 | 63.3% (+0.8) |
| `filtered` | article chunks + lexical + rerank + rewrite + date filter + precedence | 90.8% (+2.5) | 90.8% | 0.823 | 0.0% (−63.3) |

`repealed retrieved` is the share of answerable questions where an article that had already
ceased to apply reached the top 5. It is the failure that matters most in legal search, and
lower is better.

## Answer quality

Answer correctness is a **range**, not a number: the same answers graded by a strict and a
lenient rubric. The two disagree on about a third of answers, and no qualified annotator has
adjudicated between them, so the spread is the honest uncertainty. `wrong under both` is the
part that does not depend on the rubric — answers that are wrong on any reading.

| rung | answer correctness | wrong under both | rubric-dependent | citation F1 | refusal accuracy | false-refusal rate |
|---|---|---|---|---|---|---|
| `baseline` | 45.0% – 76.7% | 23.3% | 31.7% | 58.7% | 77.3% | 15.0% |
| `article` | 46.7% – 80.8% | 19.2% | 34.2% | 57.9% (−0.9) | 100.0% | 10.8% (−4.2) |
| `hybrid` | 45.8% – 74.2% | 25.8% | 28.3% | 58.2% (+0.3) | 100.0% | 16.7% (+5.8) |
| `rerank` | 49.2% – 81.7% | 18.3% | 32.5% | 59.9% (+1.7) | 100.0% | 5.8% (−10.8) |
| `rewrite` | 50.0% – 81.7% | 18.3% | 31.7% | 58.2% (−1.7) | 100.0% | 8.3% (+2.5) |
| `filtered` | 44.2% – 80.0% | 20.0% | 35.8% | 69.7% (+11.4) | 100.0% | 8.3% (=) |

Refusal accuracy and false-refusal rate are always shown together. Either alone is easy to
optimise and meaningless: a system that refuses every question scores 100% on the first and
100% on the second.

### Why correctness is a range and the other columns are not

Every other number here is checkable without knowing French labour law. Gold citations are
correct by construction — each question was written from the article it cites — so recall,
MRR and citation F1 rest on nothing anyone had to remember. The unanswerable questions were
verified mechanically against the corpus, so the refusal columns stand on the same footing.

Answer correctness is the exception: deciding whether an answer matches the reference needs
someone who knows the domain, and no such annotator worked on this. A first calibration
attempt scored Cohen's kappa 0.489 against a non-expert reader, which is not a usable
agreement, so the judge was left unvalidated rather than certified on a bad sample.

What it would take to close this: about two hours from someone who works with the Syntec
agreement, grading 60 sampled answers. Until then the range stands.

## Cost and latency

| rung | EUR / query | input tok | output tok | p50 ms | p95 ms |
|---|---|---|---|---|---|
| `baseline` | 0.00162 | 1248 | 102 | 1606 | 2197 |
| `article` | 0.00205 | 1747 | 95 | 1613 | 2307 |
| `hybrid` | 0.00770 | 7873 | 98 | 1875 | 2730 |
| `rerank` | 0.00405 | 2004 | 102 | 1685 | 2328 |
| `rewrite` | 0.00424 | 2293 | 104 | 1728 | 2353 |
| `filtered` | 0.00450 | 2411 | 102 | 1778 | 2497 |

Cost is derived from token counts, not from what this particular run was billed: a cached
replay is free to re-run but is not free to operate, and this column reports the cost of
operating the system.

---

Generated from 6 result file(s) in `results/`. Every run is committed, so the
score history is in git and no number here can be quietly revised.
