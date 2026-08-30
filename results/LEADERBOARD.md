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

| rung | answer correctness | citation F1 | refusal accuracy | false-refusal rate |
|---|---|---|---|---|
| `baseline` | 76.7% | 58.7% | 77.3% | 15.0% |
| `article` | 80.8% (+4.2) | 57.9% (−0.9) | 100.0% | 10.8% (−4.2) |
| `hybrid` | 74.2% (−6.7) | 58.2% (+0.3) | 100.0% | 16.7% (+5.8) |
| `rerank` | 81.7% (+7.5) | 59.9% (+1.7) | 100.0% | 5.8% (−10.8) |
| `rewrite` | 81.7% (=) | 58.2% (−1.7) | 100.0% | 8.3% (+2.5) |
| `filtered` | 80.0% (−1.7) | 69.7% (+11.4) | 100.0% | 8.3% (=) |

Refusal accuracy and false-refusal rate are always shown together. Either alone is easy to
optimise and meaningless: a system that refuses every question scores 100% on the first and
100% on the second.

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
