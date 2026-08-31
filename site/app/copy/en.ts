import type { SurfaceCopy } from '@/app/components/Surface'
import { REPO } from '@/app/components/Surface'

/** The English surface. A full translation of the French one, not a summary of it. */
export const EN: SurfaceCopy = {
  locale: 'en',
  otherHref: '/',
  otherLabel: 'Français',

  headline: 'Answering labour law without making it up',
  ledeBefore:
    'A Syntec employee asks how long their trial period runs. Two texts apply, one overrides the other, and a repealed version is still sitting in the databases. Across {gold} hand-labelled questions, this system retrieves the article that settles it ',
  ledeAfter: ' of the time — and serves no text that no longer applies, against two thirds before the date filter.',

  colophon: [
    { label: 'corpus', value: '3,030 indexed articles · labour code + Syntec' },
    { label: 'labelled set', value: '{gold} questions, ~15 % unanswerable' },
    { label: 'generation', value: '{model}' },
    { label: 'judge', value: '{judge} · unvalidated' },
    { label: 'cost', value: '{cost} € per question, on average' },
    { label: 'p95 latency', value: '{p95} ms · on the eval bench' },
  ],

  demoHeading: 'Ask it something',
  demoIntro:
    'The system answers only from the articles it has just retrieved. You watch the pipeline run: the queries it writes, what it finds, and what it throws away because the text is no longer in force. If it cannot settle the question, it refuses.',

  examples: [
    'trial period for a Syntec cadre?',
    'notice period when an engineer resigns?',
    'what is the applicable VAT rate?',
  ],

  demo: {
    placeholder: "Ex.: I'm resigning — what notice do I owe as a cadre?",
    submit: 'Ask',
    running: 'Retrieving…',
    examplesLabel: 'or',

    stageNames: {
      rewrite: 'rewrite',
      dense: 'dense',
      lexical: 'lexical',
      fuse: 'fuse',
      filter: 'filter',
      precedence: 'precedence',
      rerank: 'rerank',
      generate: 'generate',
    },

    stageDetails: {
      rewrite: 'The question is rewritten into {n} search queries in legal vocabulary. The original is always kept.',
      dense: 'Vector search over {q} queries — {c} distinct articles.',
      lexical: 'Lexical search over the same queries — {c} distinct articles.',
      fuse: 'Reciprocal rank fusion: {c} candidates, ranked on position and never on scores that are not on the same scale.',
      filter: '{kept} candidates in force on {asOf}. {dropped} dropped: the text no longer applies.',
      precedence: 'The agreement overrides the code where it is more favourable: a two-place head start, which moved {n} candidates.',
      rerank: '{from} candidates rescored by a dedicated reranker, {kept} kept.',
      generate: 'Answered from these extracts, and from nothing else.',
    },
    droppedNote: 'repealed articles that were competing for a place in the answer',
    noDrop: 'All {kept} candidates are in force on {asOf}. Nothing to drop.',

    refusalTitle: 'INSUFFISANT',
    refusalBody:
      'The retrieved articles cannot settle the question, so the system does not answer. That is the designed behaviour: {refusalAccuracy} of refusals are correct, against {falseRefusal} refused in error.',

    sourcesTitle: 'What the model was looking at',
    sourcesNote:
      'The five extracts it was handed, cited or not. Nothing else was used, and you can check the citation instead of believing it.',
    cited: 'cited',
    notCited: 'not cited',
    inForce: 'in force',
    since: 'since',
    articleWord: 'article',
    conventionWins: 'agreement takes precedence',

    readout: { cost: 'cost', latency: 'total', generation: 'generation', model: 'model' },

    errors: {
      'daily-cap':
        'The demo has reached its daily budget. It resets at midnight UTC — a ceiling written into the code, not a fault.',
      'rate-limit': 'Too many questions from this address. Try again in an hour.',
      'question-too-short': 'That question is too short.',
      'question-too-long': 'That question is over 300 characters.',
      'demo-unavailable': 'The demo is unavailable right now. The report below still reads.',
    },
  },

  ladderHeading: 'Each rung adds exactly one thing',
  ladderIntro:
    'The gap between two rows is therefore attributable to that one thing rather than to a bundle of changes. Two measurements per rung: what it retrieves, and what it retrieves that no longer applies.',

  ladder: {
    recall: 'recall@5 — the article that settles it is retrieved',
    repealed: 'repealed articles served to the model',
    adds: {
      baseline: 'fixed-size chunks',
      article: 'article chunks',
      hybrid: '+ lexical search',
      rerank: '+ reranking',
      rewrite: '+ query rewriting',
      filtered: '+ date filter and precedence',
    },
  },

  table: {
    headers: ['rung', 'adds', 'recall@5', 'answers correct', 'citations', 'repealed', '€ / question'],
    adds: {
      baseline: 'fixed-size chunks',
      article: 'article chunks',
      hybrid: '+ lexical search',
      rerank: '+ reranking',
      rewrite: '+ query rewriting',
      filtered: '+ date filter and precedence',
    },
  },

  hybridNote:
    'Hybrid search made recall *worse*, by {hybrid} points. Published as measured: a table where every row improves on the one above it is a table nobody really measured. Reranking then recovered it, and more.',
  filterNote:
    'Without the date filter, {supersededNoFilter} of questions retrieve at least one already-repealed article. The model then answers correctly, from a text that no longer applies — an error no accuracy metric can see, and the one that matters most in law. With the filter: {superseded}.',

  bandHeading: 'Why accuracy is a range',
  bandIntro:
    'Every other number on this page is checkable without knowing labour law. Deciding whether an answer says the same thing as its reference is not.',

  band: {
    wrong: 'wrong under both readings',
    wrongNote: 'the part that depends on no rubric at all',
    dependent: 'depends on the rubric',
    dependentNote: 'the strict and lenient rubrics disagree',
    correct: 'right under both readings',
    correctNote: 'counted correct at either severity',
    caption: '“filtered” rung · {gold} questions',
  },

  bandWhy:
    'Expected citations are correct by construction — each question was written from the article it cites — so recall rests on nobody’s memory, and the unanswerable questions were verified mechanically. Answer accuracy is the one exception: nobody qualified annotated this set, and a first calibration scored Cohen’s kappa 0.489 against a non-expert reader, too weak an agreement to validate anything. So the judge is published as unvalidated rather than certified on a bad sample. What would settle it: about two hours from someone who works with the Syntec agreement, over 60 randomly drawn answers.',

  failureHeading: 'What fails, and why',
  failureIntro:
    '{failures} of {gold} questions have a problem on the shipped configuration. They are classed by cause, not counted together.',

  failureKinds: {
    'rubric-dependent': 'the answer holds or does not, depending on rubric severity',
    'false-refusal': 'refused although the corpus contained the answer',
    'generation-miss': 'the right article was in context and the answer is wrong',
    'retrieval-miss': 'the article that settles it never reached the model',
    'citation-miss': 'the answer is right, the cited source is not',
  },

  failureNote:
    'A `retrieval-miss` is an indexing problem, and no prompt will fix it. A `generation-miss` is the opposite: everything was there and the answer is wrong anyway. A single accuracy number merges the two and points at neither.',

  methodHeading: 'How this is measured',
  methodBody: [
    'The {gold} questions are built from the corpus: start from an article, then write a question it answers. The expected citation is correct by construction, so recall depends on nobody’s memory.',
    'The answers were then reviewed by a model from a different vendor, which flagged 12.7 % of rows; flagged rows were adjudicated by hand, with a control sample drawn from the rows it passed, to check the reviewer itself.',
    'Correct refusals and false refusals are always published together: a system that refuses everything scores 100 % on the first and 100 % on the second. Here, {refusalAccuracy} correct refusals against {falseRefusal} refused in error.',
    'The demo above runs the exact code that produced these numbers — CI fails if the copy drifts. A demo that had drifted from the harness would be publishing measurements about a system nobody can try.',
  ],

  links: [
    { label: 'Source code', href: REPO },
    { label: 'Full leaderboard', href: `${REPO}/blob/main/results/LEADERBOARD.md` },
    { label: 'Failure catalogue', href: `${REPO}/blob/main/results/FAILURES.md` },
    { label: 'Question set', href: `${REPO}/blob/main/data/gold` },
    { label: 'Decisions', href: `${REPO}/blob/main/docs/decisions.md` },
  ],

  licence:
    'Corpus: the French labour code and the Syntec collective agreement (IDCC 1486), DILA open data under the Licence Ouverte. Every eval run is committed to the repository, so no number can be revised quietly. Built by Farouk Ben Fraj.',
}
