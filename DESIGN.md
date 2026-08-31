# Design

Visual world for the syntec-rag-eval report and live demo. Replaces the previous
default-serif document look, which was evidence of the subject and not authority over it.

## The idea

**The machine is dark. The law is paper.**

The page is an instrument: near-black, hairline-ruled, mono-labelled, tabular. The corpus it
reaches into is warm paper. Every retrieved article arrives as a physical slip — light,
grained, with its own ink — laid on the dark instrument surface. Repealed slips are struck
and desaturated. That single material contrast carries the project's whole argument: the
machine's job is to fetch the right piece of paper, and the measurement is about how often
it does.

Committed to dark. Not chosen by category: the use scene is a sceptical technical reader
scanning one of several tabs, and the paper slips need a dark ground to read as objects
rather than as page background.

## Type

Self-hosted through `next/font/google`. No system fallback carries the display voice.

- **Instrument Serif** — display only. Headline sizes, one weight, italic reserved for the
  one emphasis per section. High contrast, editorial, legal-adjacent.
- **Newsreader** — running prose, at 300–500. A text face, low contrast: it pairs with
  Instrument by *difference*, not by family resemblance.
- **JetBrains Mono** — anything the machine produced or measured: article ids, percentages,
  timings, stage names, buttons, labels. Mono here is data, not costume.

Measure 62–70ch. Display tracking −0.02em and tighter as size grows; mono labels +0.08em
uppercase at 11px only. Tabular numerals everywhere a number can change.

## Colour

```
--ink        #08080A   page
--ink-r      #101013   raised surface
--ink-rr     #17171B   inset / field
--rule       #24242A   hairline
--rule-warm  #2E2A22   hairline under paper
--fg         #EFEBE3   primary, warm off-white
--fg-2       #A9A398   secondary
--fg-3       #746F66   tertiary (never body text)
--paper      #F2EDE3   article slip
--paper-2    #E7E0D2   slip edge
--paper-ink  #17150F   text on paper
--seal       #E0A33C   accent: cited, focus, links, the live stage
--seal-dim   #7A5A20
--verdigris  #79B195   in force, improvement
--rust       #CE6A45   repealed, regression
```

Colour is never the only signal: in-force and repealed both carry a word.

## Materials

- **Hairlines, not cards.** Structure comes from 1px rules and space. Where a container is
  unavoidable it is a rule box, not a shadowed card, and never nested.
- **Paper slips** get a real shadow (offset + soft blur, warm), a 1px warm edge, and a
  faint grain. They are the only lit objects on the page.
- **The trace rail** — a vertical hairline down the demo's left edge that the pipeline
  stages hang from. The active stage's node fills with `--seal`.
- No glass, no gradient text, no glow halos, no rounded soft-shadow rectangles standing in
  for content.

## Motion

One authored moment: **the pipeline running.** Stage rows arrive one at a time as their
events land, each on an exponential ease-out over 380ms — a small rise plus a blur release,
from an already-visible default. The date-filter stage strikes its repealed candidates in a
staggered 40ms cascade; that is the page's single piece of drama, and it is showing a real
result.

Everything else is still. No section entrances, no parallax, no counters ticking up.

Under `prefers-reduced-motion: reduce` every stage lands in its final state instantly. The
final state is the default state and animation only moves *toward* it — this codebase has
already paid once for a reveal that left a page invisible when no frames were painted.

## Components

- `TraceRail` — stage list with node, name, detail, and a right-aligned mono duration.
- `Slip` — a paper article extract: id, source, article number, in-force/repealed status
  with dates, body text, cited marker.
- `Ladder` — the ablation as a staircase of horizontal steps; a rung that regresses steps
  visibly down and is labelled in `--rust`. The full numeric table sits underneath it,
  scrollable, for readers who want the columns.
- `Band` — the strict/lenient correctness range drawn as one bar with three regions:
  wrong-under-both (solid), rubric-dependent (hatched), correct-under-both.
- `Readout` — a mono key/value line used for colophon-style facts.

## Browser surfaces

Selection `--seal-dim` on paper-ink; caret `--seal`; scrollbars themed on `--ink-r` with a
`--rule` thumb; focus ring is a 2px `--seal` outline with a 2px offset, on every interactive
element; underline offset 0.18em with a `--rule` decoration colour that warms to `--seal` on
hover.

## Refused here

No hero-metric tile grid — the headline number is set inline, at display size, inside the
sentence that gives it meaning. No eyebrows, no section numbers, no icon-heading-text cards.
