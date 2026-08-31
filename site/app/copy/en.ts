import type { ChromeCopy, DemoPageCopy, LimitsPageCopy, MethodPageCopy } from '@/app/copy/types'
import { REPO } from '@/app/copy/fr'

/** The English surface. A full translation of the French one, not a summary of it. */
const chrome: ChromeCopy = {
  home: { href: '/en', subtitle: 'French labour law · Syntec' },
  navLabel: 'Main navigation',
  nav: [
    { key: 'demo', href: '/en', label: 'The demo' },
    { key: 'method', href: '/en/method', label: 'How it is measured' },
    { key: 'limits', href: '/en/limits', label: 'What it gets wrong' },
  ],
  otherLocale: { href: '/', label: 'Français', lang: 'fr', ariaLabel: 'Passer en français' },
  footerBlurb:
    'A measured document-retrieval demonstration built by FrajTech over the French labour code and the Syntec collective agreement.',
  footerColumns: [
    {
      heading: 'The project',
      links: [
        { href: '/en/method', label: 'How it is measured' },
        { href: '/en/limits', label: 'What it gets wrong' },
        { href: REPO, label: 'Source code', external: true },
      ],
    },
    {
      heading: 'FrajTech',
      links: [
        { href: 'https://frajtech.com/en', label: 'frajtech.com' },
        { href: 'https://frajtech.com/en#contact', label: 'Talk to us' },
      ],
    },
  ],
  disclaimer:
    'A private technical demonstration by FrajTech. This site is not a public service, does not come from any government body, and is not legal advice. The texts quoted come from DILA open data under the Licence Ouverte; always check Légifrance before relying on them.',
  disclaimerLink: { href: 'https://www.legifrance.gouv.fr', label: 'Open Légifrance' },
}

export const EN_DEMO: DemoPageCopy = {
  locale: 'en',
  chrome,
  title: 'Le Bon Article · The answer, and the article it rests on',
  metaDescription:
    'Ask a French labour-law question. You get an answer, the article of the labour code or the Syntec agreement it rests on, and the date from which it applies. A FrajTech demonstration.',

  headline: 'The answer, and the article it rests on.',
  lede:
    'Ask a question about the French labour code or the Syntec agreement. You get a short answer, the exact article it rests on, and an assurance that the article is still in force. If it cannot settle the question, it says so.',

  // Verified against the live pipeline: the first two answer, the third refuses.
  examples: [
    'What is the trial period for a Syntec cadre?',
    'How much notice must an engineer give when resigning?',
    'What is the applicable VAT rate?',
  ],

  demo: {
    locale: 'en',
    readFull: 'Read the full article',
    readLess: 'Collapse the article',
    truncatedNote: 'This article is exceptionally long and the end has been cut. The full text is on Légifrance.',
    strokeMore: '+ {n} more',
    placeholder: 'Ex.: I am resigning — what notice do I owe as a cadre?',
    submit: 'Search',
    running: 'Searching…',
    examplesLabel: 'Try',
    hint: 'Enter to send · Shift + Enter for a new line · ask in English or French — the corpus and the prompt are French, so it sometimes answers in French',

    steps: {
      search: {
        title: 'It searches {corpus} articles',
        detail:
          'The question is rewritten into {queries} searches in legal vocabulary, then matched against the text in two complementary ways. {candidates} articles come back.',
      },
      filter: {
        title: 'It drops the texts that no longer apply',
        detail:
          '{dropped} articles removed: they were repealed or replaced and are not in force on {asOf}. {kept} remain.',
        none: 'All {kept} articles found are in force on {asOf}. Nothing to drop this time.',
        note: 'these texts are still in the databases and often say something different',
      },
      select: {
        title: 'It keeps the 5 most relevant articles',
        detail:
          'Out of {from} candidates, {kept} are kept. At equal relevance the collective agreement goes ahead of the labour code where it is more favourable to the employee.',
      },
      write: {
        title: 'It writes the answer from those articles',
        detail: 'From those extracts and nothing else: no memory, no general knowledge.',
      },
    },

    techLabel: 'Show the technical detail of this search',
    techNote:
      'The exact pipeline, in order, with the real time each stage took. This is the same code evaluated over the {gold} labelled questions.',
    techStages: {
      rewrite: 'question rewritten into search queries',
      dense: 'vector search',
      lexical: 'lexical search',
      fuse: 'reciprocal rank fusion',
      filter: 'date filter over articles',
      precedence: 'agreement / code precedence',
      rerank: 'rescoring by a dedicated reranker',
      generate: 'answer generation',
    },

    answered: 'Answer grounded in the texts',
    refusedLabel: 'No answer: the corpus cannot settle this',
    refusedBody:
      'The retrieved articles do not answer the question, so the system stops rather than inventing. That is by design: on the test set, {refusalAccuracy} of refusals are justified, against {falseRefusal} refused in error.',

    citedHeading: 'The texts it cited',
    citedNote:
      'These are the articles the answer rests on, with the date each came into force. You can read them yourself rather than believe us.',
    othersHeading: 'Show the {n} other articles it looked at but did not use',
    cited: 'Cited',
    inForce: 'In force',
    since: 'In force since',
    articleWord: 'Article',
    precedenceNote: 'takes precedence over the code',

    receipt: { cost: 'Cost of this query', latency: 'Time', model: 'Model' },
    whyHardHeading: 'Why this is the hard part',
    whyHard:
      'The {dropped} articles just dropped still exist in the legal databases, and a system that cites them produces an answer that is well written, properly sourced — and wrong. Without this date filter, {supersededNoFilter} of the test questions retrieved at least one repealed text. With it: {superseded}.',

    errors: {
      'daily-cap':
        'The demo has reached its budget for today. It resets at midnight UTC — a ceiling deliberately written into the code, not a fault.',
      'rate-limit': 'Too many questions from this connection. Try again in an hour.',
      'question-too-short': 'That question is too short.',
      'question-too-long': 'That question is over 300 characters.',
      'demo-unavailable': 'The demo is unavailable right now. The method pages still read.',
    },
  },

  trustHeading: 'Three things it does that most demos do not',
  trustPoints: [
    {
      icon: 'source',
      title: 'Every answer shows its text',
      body:
        'No summary without a source. The article is shown under the answer, with its reference, so you can check instead of trusting. On the test set, the article that settles the question is retrieved {recall} of the time.',
    },
    {
      icon: 'date',
      title: 'Out-of-date texts are dropped',
      body:
        'The law changes, and repealed versions stay in the databases. A system that cites them looks right and is not. Here: {superseded} repealed articles served, against {supersededNoFilter} without this filter.',
    },
    {
      icon: 'refuse',
      title: 'It refuses rather than invents',
      body:
        'Ask it about VAT and it says it does not know. {refusalAccuracy} of refusals are justified, against {falseRefusal} refused in error — both published together, because a system that refused everything would score 100 % on the first.',
    },
  ],

  onwardHeading: 'Go further',
  onward: [
    {
      href: '/en/method',
      icon: 'method',
      title: 'How it is measured',
      body:
        '{gold} hand-labelled questions, six configurations compared, and a result that went the wrong way published as it came.',
    },
    {
      href: '/en/limits',
      icon: 'limits',
      title: 'What it gets wrong',
      body: 'The questions that fail, sorted by cause, and what this system must not be used for.',
    },
  ],
}

export const EN_METHOD: MethodPageCopy = {
  locale: 'en',
  chrome,
  title: 'How it is measured · Le Bon Article',
  metaDescription:
    'Six configurations compared over 142 hand-labelled French labour-law questions. Retrieval failure and generation failure counted separately.',

  headline: 'How it is measured',
  lede:
    'Any system of this kind can look like it works on three well-chosen questions. This one was measured over {gold} questions written and labelled by hand, and the awkward results are published with the rest.',

  ladderHeading: 'Each rung adds exactly one thing',
  ladderIntro:
    'Six versions of the same system, each adding exactly one capability to the one before it. The gap between two rows is therefore attributable to that capability rather than to a bundle of changes. Two measurements per row: what it retrieves, and what it retrieves that no longer applies.',
  ladder: {
    recall: 'The article that settles the question is retrieved',
    repealed: 'Repealed articles are served to the model (lower is better)',
    adds: {
      baseline: 'fixed-size chunks',
      article: 'article-sized chunks',
      hybrid: '+ lexical search',
      rerank: '+ reranking',
      rewrite: '+ query rewriting',
      filtered: '+ date filter and precedence',
    },
  },
  table: {
    headers: ['rung', 'what it adds', 'article found', 'answers right', 'citations', 'repealed', '€ / question'],
    adds: {
      baseline: 'fixed-size chunks',
      article: 'article-sized chunks',
      hybrid: '+ lexical search',
      rerank: '+ reranking',
      rewrite: '+ query rewriting',
      filtered: '+ date filter and precedence',
    },
  },

  hybridNote:
    'Lexical search, added at the "hybrid" rung, made performance *worse* by {hybrid} points. It is published as measured. A table where every row improves on the one above it is a table nobody really measured: only the flattering runs were kept. Reranking then recovered that loss, and more.',
  filterNote:
    'The date filter is the change that matters most. Without it, {supersededNoFilter} of questions retrieved at least one repealed article, and the model answered correctly from a text that no longer applies. No accuracy metric sees that error: the answer is well written and properly sourced, simply wrong. With the filter: {superseded}.',

  bandHeading: 'Why accuracy is published as a range',
  bandIntro:
    'Every other number on this page can be checked without knowing labour law. Deciding whether an answer says the same thing as its reference cannot — and nobody qualified has done it.',
  band: {
    wrong: 'Wrong either way',
    wrongNote: 'wrong at any severity of marking',
    dependent: 'Arguable',
    dependentNote: 'a strict and a lenient marking scheme disagree',
    correct: 'Right either way',
    correctNote: 'counted correct under both readings',
    caption: 'Shipped configuration · {gold} questions',
  },
  bandWhy:
    'Expected citations are correct by construction: each question was written from the article that answers it, so the retrieval measurement rests on nobody’s memory. Answer accuracy is the one exception. A first calibration attempt scored Cohen’s kappa 0.489 against a non-expert reader — too weak an agreement to validate anything. So the automatic judge is published as *unvalidated* rather than certified on a bad sample.',

  methodHeading: 'Where the questions come from',
  methodBody: [
    'The {gold} questions are built from the corpus: start from an article, then write a question it answers. The expected citation is therefore correct by construction, and the retrieval measurement depends on nobody’s memory. About 15 % of the questions deliberately have no answer in the corpus, to measure refusals.',
    'The answers were then reviewed by a model from a different vendor, which flagged 12.7 % of rows. Flagged rows were adjudicated by hand, with a control sample drawn from the rows it passed — to check the reviewer as much as the answers.',
    'Justified refusals and false refusals are always published together: a system that refused everything would score 100 % on the first and 100 % on the second. Here, {refusalAccuracy} justified refusals against {falseRefusal} refused in error.',
    'The demo runs the exact code that produced these numbers, and CI fails if the two drift apart. Every eval run is committed to the repository: no number can be revised quietly.',
  ],

  onwardHeading: 'Go further',
  onward: [
    { href: '/en', icon: 'demo', title: 'Try the demo', body: 'Ask your own question and watch the system work.' },
    { href: '/en/limits', icon: 'limits', title: 'What it gets wrong', body: 'The failures, sorted by cause, and the uses to avoid.' },
  ],
}

export const EN_LIMITS: LimitsPageCopy = {
  locale: 'en',
  chrome,
  title: 'What it gets wrong · Le Bon Article',
  metaDescription:
    'The system’s failures, sorted by cause: retrieval, generation, false refusal, citation. And what this demonstration must not be used for.',

  headline: 'What it gets wrong',
  lede:
    'A system that answers labour-law questions and cannot say where it fails has no business in front of an employee. Here are the {failures} questions out of {gold} that go wrong, and why.',

  notForHeading: 'What this must not be used for',
  notFor: [
    'This is not legal advice. No lawyer has validated this system’s answers.',
    'This is not a public service and does not come from any government body.',
    'The corpus covers four themes only: contract and trial period, notice and termination, working time and forfait-jours, classification and minimum salaries. Everything else is out of scope.',
    'No company-level agreement is taken into account, although one can change what the branch agreement says.',
    'Before acting on an answer, open the cited article on Légifrance and read it.',
  ],

  taxonomyHeading: 'The failures, sorted by cause',
  taxonomyIntro:
    'They are not counted together, because they do not have the same remedy. An article never retrieved is an indexing problem that no improvement in writing will fix; a wrong answer from the right article is exactly the opposite.',
  failureKinds: {
    'rubric-dependent': 'the answer holds or does not, depending on how strictly it is marked',
    'false-refusal': 'refused although the corpus contained the answer',
    'generation-miss': 'the right article was in front of the model and the answer is wrong',
    'retrieval-miss': 'the article that settles it never reached the model',
    'citation-miss': 'the answer is right, the cited source is not',
  },
  taxonomyNote:
    'This is why there is no single "accuracy rate" on this site. One number would merge a `retrieval-miss` with a `generation-miss` and so would not say what to fix. On a client engagement, that distinction is what decides whether the next sprint is about indexing or about writing.',

  judgeHeading: 'The judge is not validated, and it says so',
  judgeBody: [
    'Answers are marked automatically by a second model ({judge}). For an automatic mark to mean anything, it has to be shown to agree with a competent human. The first calibration scored Cohen’s kappa 0.489 against a non-expert reader — too weak an agreement to validate anything.',
    'There were two options: present an accuracy figure anyway, or say the judge is not validated. The second was chosen, and accuracy is published as a range between a strict and a lenient marking scheme. What depends on no scheme at all: {wrongBoth} of answers are wrong under both readings.',
    'What it would cost to settle: about two hours from someone who works with the Syntec agreement, over 60 randomly drawn answers. That is the kind of trade-off worth writing down rather than rounding away.',
  ],

  onwardHeading: 'Go further',
  onward: [
    { href: '/en', icon: 'demo', title: 'Try the demo', body: 'Ask your own question and watch the system work.' },
    { href: '/en/method', icon: 'method', title: 'How it is measured', body: 'The protocol, the six configurations and the accuracy range.' },
  ],
}
