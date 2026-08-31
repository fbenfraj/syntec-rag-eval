# Design

Visual world for **Le Bon Article**, the public demonstration of this eval harness.

Replaces two earlier looks: a default-serif document, then a dark "instrument". Both were
built for a reader who already knew what retrieval is. The audience is a founder, a CTO or
a head of engineering deciding whether FrajTech can be trusted with a build — technical
enough to ask hard questions, not an ML researcher.

## The idea

**An official record.**

The subject is French law: texts published by the State that decide real employment
contracts. The surface borrows that register — paper white, article references set like legal
citations, an *En vigueur* stamp carrying a date. Someone weighing whether to believe an
answer about the Code du travail reads an official document more readily than a terminal.

It borrows the register and stops there. No Marianne, no state wordmark, no *République
Française* block: those belong to public services. The mark is a **cockade**, a civic emblem
free for anyone to wear, and a disclaimer sits in the chrome of every page saying in plain
French that this is a private demonstration and not legal advice. A surface that dresses as
officialdom carries a duty not to be mistaken for it.

## Structure

Three pages per language, not one scroll.

| Route | Job |
|---|---|
| `/`, `/en` | The demo. Input above the fold, answer, cited articles. Nothing else competes. |
| `/methode`, `/en/method` | How the numbers were produced: the ablation, the accuracy range. |
| `/limites`, `/en/limits` | What it gets wrong, and what it must not be used for. |

The measurement is the point of the project but not the point of the *landing*: a visitor
arriving from frajtech.com came to try the thing. Everything that explains or qualifies it
is one click away and named in the masthead.

## Two registers, one run

The demo narrates itself in four plain steps — it searches, it drops what no longer applies,
it keeps five, it writes from those five — each with an icon and a real duration. The eight
actual pipeline stages, with their real names and per-stage timings, sit behind a closed
`<details>` labelled *Voir le détail technique*.

Non-technical by default, fully technical on demand. Naming `rrf fusion` on the surface buys
nothing from a buyer and costs them the thread; hiding it entirely would insult the engineer
they will forward the link to.

## Type

Self-hosted through `next/font/google`.

- **Spectral** — headings, the answer, and the article extracts. A text face with a French
  commission behind it that sets law the way law is set.
- **Archivo** — the interface: labels, buttons, navigation, body.
- **JetBrains Mono** — corpus identifiers only, where fixed width is the point.

Marianne, the State's own face, is deliberately absent.

## Colour

```
--paper #ffffff   --paper-2 #f5f4f1   --paper-3 #ecebe6
--ink   #14141a   --ink-2   #4a4a56   --ink-3   #6d6d7a
--rule  #dedcd5   --rule-strong #c3c1b8
--blue  #17265e   --blue-2  #2c3f8f   --blue-wash #eef0f8
--red   #b8202e   --red-wash #fbeeef
--green #1c6b45   --green-wash #ecf5f0
```

Blue carries authority and every affirmative state; red carries the repealed and the
regressive; green is reserved for the *En vigueur* stamp. The blue is deliberately **not**
`#000091`, the State's own.

Light, and not by category habit: the use scene is a sceptical reader on a laptop in
daylight, and the material being quoted is paper.

## Materials

- **The cockade** carries the identity on its own. A tricolour rule ran across the top of
  every page in the first version and was removed: a 4px bar pinned to the top edge is
  exactly where browsers put loading indicators, and it read as a progress bar stuck at
  100 %. The palette and the mark say *French* without borrowing a shape that already means
  something else.
- **Stamps** rather than badges. *En vigueur* is bordered, uppercase, and carries the date.
- **Struck chips** for repealed candidates: red, line-through, with the date the article
  stopped applying. The demo's one dramatic moment, and it shows a real result.
- Hairline rules and generous space carry structure. No nested cards, no glass, no gradient
  text, no drop shadows standing in for hierarchy.

## Icons

`lucide-react`, one stroke weight (1.75), sized 13–22. Icons name a step or a state; they
never decorate a heading.

## Motion

The pipeline running is the only authored moment: steps arrive as their events land, and the
active step's icon pulses. Every animation runs *toward* the resting state and the resting
state is the default, so a frame that never paints still shows the finished result — this
codebase has already paid once for a reveal that left a page invisible when nothing painted.
