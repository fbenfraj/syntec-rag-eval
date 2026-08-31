import { delta, loadSummary, pct, range } from '@/lib/results'

const REPO = 'https://github.com/fbenfraj/syntec-rag-eval'

export const metadata = {
  title: 'syntec-rag-eval — measured retrieval over French labour law',
  description:
    'A retrieval system over the French Labour Code and the Syntec agreement, measured on 142 labelled questions, with retrieval and generation failures counted separately.',
}

export default function Page() {
  const summary = loadSummary()
  const { best, rungs } = summary

  return (
    <main>
      <p className="small muted"><a href="/">Français</a></p>

      <h1>Answering labour-law questions without inventing the law</h1>

      <p className="lede">
        An employee asks how long their trial period lasts. Two texts apply, one overrides the
        other, and a repealed version is still sitting in the database. This project measures how
        often a retrieval system finds the article that decides the question — and separates what it
        failed to find from what it wrote badly.
      </p>

      <div className="headline">
        <div>
          <span className="n">{pct(best.recallAt5)}</span>
          <span className="k">recall@5 · the governing article is retrieved</span>
        </div>
        <div>
          <span className="n">{pct(best.answerWrongUnderBoth)}</span>
          <span className="k">answers wrong under either grading rubric</span>
        </div>
        <div>
          <span className="n">{pct(best.supersededRate)}</span>
          <span className="k">repealed articles served ({pct(rungs[4]!.supersededRate)} without the date filter)</span>
        </div>
        <div>
          <span className="n">{pct(best.falseRefusalRate)}</span>
          <span className="k">false refusals · {pct(best.refusalAccuracy)} correct refusals</span>
        </div>
      </div>

      <p className="small muted">
        {summary.goldSetSize} labelled questions · generator <code>{summary.model}</code> · judge{' '}
        <code>{summary.judgeModel}</code> · €{best.costEurPerQuery.toFixed(4)} per question · p95{' '}
        {best.latencyP95Ms} ms
      </p>

      <h2>The ablation ladder</h2>

      <p>
        Each rung adds <em>exactly one</em> capability to the rung above it, so the change between
        two rows is attributable to that capability rather than to a bundle of them.
      </p>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>rung</th><th>adds</th><th>recall@5</th><th>answers</th>
              <th>citations</th><th>repealed</th><th>€ / question</th>
            </tr>
          </thead>
          <tbody>
            {rungs.map((rung, index) => {
              const previous = index === 0 ? null : rungs[index - 1]!
              const change = previous === null ? null : delta(rung.recallAt5, previous.recallAt5)
              return (
                <tr key={rung.name} className={rung.name === best.name ? 'best' : undefined}>
                  <td><code>{rung.name}</code></td>
                  <td className="muted">{rung.adds}</td>
                  <td className="num">
                    {pct(rung.recallAt5)}{' '}
                    {change !== null && change !== '=' && (
                      <span className={change.startsWith('+') ? 'up' : 'down'}>({change})</span>
                    )}
                  </td>
                  <td className="num">{range(rung.answerCorrectness, rung.answerCorrectnessLenient)}</td>
                  <td className="num">{pct(rung.citationCorrectness)}</td>
                  <td className="num">{pct(rung.supersededRate)}</td>
                  <td className="num">{rung.costEurPerQuery.toFixed(4)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="note">
        Hybrid search made recall <strong>worse</strong>, by{' '}
        {delta(rungs[2]!.recallAt5, rungs[1]!.recallAt5)} points. It is published as measured: a
        table where every row improves on the last is a table nobody really measured.
      </p>

      <h2>Why answer correctness is a range</h2>

      <p>
        Every other number on this page is checkable without knowing French labour law. The expected
        citations are correct by construction — each question was written from the article it cites —
        so recall and citation F1 rest on nothing anyone had to remember, and the unanswerable
        questions were verified mechanically against the corpus.
      </p>

      <p>
        Answer correctness is the exception. Deciding whether an answer says the same thing as the
        reference needs someone who knows the domain, and no qualified annotator worked on this set.
        A first calibration scored Cohen’s kappa 0.489 against a non-expert reader — too weak an
        agreement to validate anything — so the judge was left unvalidated rather than certified on
        a bad sample.
      </p>

      <p>
        The published range is the gap between a strict and a lenient rubric applied to the same
        answers. They disagree on about a third of cases ({pct(best.answerRubricDependent)} here).
        What does not depend on the rubric: <strong>{pct(best.answerWrongUnderBoth)}</strong> of
        answers are wrong under both readings. Closing this would take roughly two hours from
        someone who works with the Syntec agreement, grading 60 sampled answers.
      </p>

      <h2>What the date filter changes</h2>

      <p>
        Without it, {pct(rungs[4]!.supersededRate)} of questions retrieve at least one article that
        has already been repealed. The model then answers correctly — from text that no longer
        applies. No accuracy metric sees that error, and in law it is the one that matters most.
        With the filter: {pct(best.supersededRate)}.
      </p>

      <h2>What fails, and why</h2>

      <p>
        {summary.totalFailures} of {summary.goldSetSize} questions go wrong on the shipped
        configuration. They are grouped by cause rather than counted together.
      </p>

      <div className="scroll">
        <table>
          <thead><tr><th>failure</th><th>n</th><th>share</th></tr></thead>
          <tbody>
            {summary.failures.map((failure) => (
              <tr key={failure.kind}>
                <td><code>{failure.kind}</code></td>
                <td className="num">{failure.n}</td>
                <td className="num">{pct(failure.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="note">
        <code>retrieval-miss</code>: the governing article never reached the model — an indexing
        problem no prompt will fix. <code>generation-miss</code>: it was in context and the answer
        was wrong anyway. A single accuracy number merges the two and points at neither.
      </p>

      <h2>How it is measured</h2>

      <p>
        The 142 questions are built from the corpus: an article is chosen first, then a question it
        answers is written, so the expected citation is correct by construction. The answers were
        then reviewed by a model from a different vendor, which flagged 12.7 % of rows; the flagged
        rows were adjudicated by hand, alongside a control sample drawn from the rows it passed — to
        check the reviewer itself.
      </p>

      <p>
        Refusal accuracy and false-refusal rate are always published together: a system that refuses
        every question scores 100 % on the first and 100 % on the second.
      </p>

      <hr />

      <div className="links small">
        <a href={REPO}>Source</a>
        <a href={`${REPO}/blob/main/results/LEADERBOARD.md`}>Full leaderboard</a>
        <a href={`${REPO}/blob/main/results/FAILURES.md`}>Failure catalogue</a>
        <a href={`${REPO}/blob/main/data/gold`}>Question set</a>
        <a href={`${REPO}/blob/main/docs/decisions.md`}>Decisions</a>
      </div>

      <p className="small muted">
        Corpus: the French Labour Code and the Syntec collective agreement (IDCC 1486), from DILA
        open data under the Licence Ouverte. Every run is committed, so the score history is in git
        and no number can be quietly revised.
      </p>
    </main>
  )
}
