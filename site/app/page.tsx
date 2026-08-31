import Demo from '@/app/components/Demo'
import { delta, loadSummary, pct, range } from '@/lib/results'

const DEMO_COPY = {
  heading: 'Essayez-le',
  intro:
    "Posez une question de droit du travail français. Le système ne répond qu'à partir des articles qu'il a retrouvés, et vous voyez lesquels : ceux qu'il a cités et ceux qu'il a écartés. S'il ne trouve pas de quoi répondre, il refuse au lieu d'inventer.",
  placeholder: "Ex. : je démissionne, quel préavis dois-je respecter comme cadre ?",
  submit: 'Poser la question',
  running: 'Recherche…',
  examples: 'Ou essayez :',
  refused: "Le système a refusé de répondre : les articles retrouvés ne permettent pas de trancher. C'est le comportement attendu, pas une panne.",
  sourcesShown: 'Articles retrouvés et donnés au modèle :',
  cited: 'cité dans la réponse',
  notCited: 'non cité',
  metaTemplate: '{cost} € · {seconds} s · pipeline « filtered », le même que dans le tableau ci-dessous',
  errors: {
    'daily-cap': "Le budget quotidien de la démo est atteint. Il se réinitialise à minuit UTC — c'est un plafond volontaire, pas une panne.",
    'rate-limit': 'Trop de questions depuis cette adresse. Réessayez dans une heure.',
    'question-too-short': 'La question est trop courte.',
    'question-too-long': 'La question est trop longue (300 caractères maximum).',
    'demo-unavailable': 'La démo est momentanément indisponible. Les résultats ci-dessus restent consultables.',
  },
}

const DEMO_EXAMPLES = [
  "durée de la période d'essai d'un cadre ?",
  'combien de jours pour un forfait-jours ?',
  'quel est le taux de TVA applicable ?',
]

const REPO = 'https://github.com/fbenfraj/syntec-rag-eval'

export default function Page() {
  const summary = loadSummary()
  const { best, baseline, rungs } = summary

  return (
    <main>
      <p className="small muted">
        <a href="/en">English</a>
      </p>

      <h1>Répondre en droit du travail sans inventer</h1>

      <p className="lede">
        Un salarié Syntec demande la durée de sa période d’essai. Deux textes s’appliquent, l’un
        remplace l’autre, et une version abrogée traîne encore dans les bases. Ce projet mesure à
        quelle fréquence un système de recherche trouve le bon article — et sépare ce qu’il n’a pas
        trouvé de ce qu’il a mal rédigé.
      </p>

      <div className="headline">
        <div>
          <span className="n">{pct(best.recallAt5)}</span>
          <span className="k">recall@5 · l’article qui tranche est retrouvé</span>
        </div>
        <div>
          <span className="n">{pct(best.answerWrongUnderBoth)}</span>
          <span className="k">réponses fausses quelle que soit la grille de correction</span>
        </div>
        <div>
          <span className="n">{pct(best.supersededRate)}</span>
          <span className="k">articles abrogés servis ({pct(rungs[4]!.supersededRate)} sans filtre de date)</span>
        </div>
        <div>
          <span className="n">{pct(best.falseRefusalRate)}</span>
          <span className="k">refus à tort · {pct(best.refusalAccuracy)} de refus justes</span>
        </div>
      </div>

      <p className="small muted">
        {summary.goldSetSize} questions annotées à la main · génération <code>{summary.model}</code> ·
        juge <code>{summary.judgeModel}</code> · coût {best.costEurPerQuery.toFixed(4)} € par question ·
        p95 {best.latencyP95Ms} ms
      </p>

      <Demo copy={DEMO_COPY} examples={DEMO_EXAMPLES} />

      <h2>L’échelle d’ablation</h2>

      <p>
        Chaque palier ajoute <em>une seule</em> capacité au palier précédent. L’écart entre deux
        lignes est donc imputable à cette capacité, et non à un ensemble de changements.
      </p>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>palier</th>
              <th>ajoute</th>
              <th>recall@5</th>
              <th>réponses correctes</th>
              <th>citations</th>
              <th>abrogés</th>
              <th>€ / question</th>
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
        La recherche hybride fait <strong>baisser</strong> le recall de{' '}
        {delta(rungs[2]!.recallAt5, rungs[1]!.recallAt5)} points. Le résultat est publié tel quel :
        un tableau où chaque ligne améliore la précédente est un tableau qu’on n’a pas vraiment
        mesuré.
      </p>

      <h2>Pourquoi l’exactitude des réponses est une fourchette</h2>

      <p>
        Tous les autres chiffres de cette page sont vérifiables sans connaître le droit du travail.
        Les citations attendues sont justes par construction — chaque question a été écrite à partir
        de l’article qu’elle cite — donc le recall et le F1 de citation ne reposent sur la mémoire de
        personne. Les questions sans réponse ont été vérifiées mécaniquement contre le corpus.
      </p>

      <p>
        L’exactitude des réponses est la seule exception : décider si une réponse dit la même chose
        que la référence demande quelqu’un qui connaît le domaine, et personne de qualifié n’a
        annoté ce jeu. Une première tentative de calibration a donné un kappa de Cohen de 0,489
        face à un lecteur non spécialiste — un accord trop faible pour valider quoi que ce soit.
        Le juge est donc resté non validé plutôt que certifié sur un mauvais échantillon.
      </p>

      <p>
        La fourchette publiée est l’écart entre une grille stricte et une grille indulgente
        appliquées aux mêmes réponses. Les deux divergent sur environ un tiers des cas
        ({pct(best.answerRubricDependent)} ici). Ce qui ne dépend pas de la grille :{' '}
        <strong>{pct(best.answerWrongUnderBoth)}</strong> des réponses sont fausses dans les deux
        lectures. Ce qu’il faudrait pour trancher : environ deux heures d’une personne qui pratique
        la convention Syntec, sur 60 réponses tirées au sort.
      </p>

      <h2>Ce que le filtre de date change</h2>

      <p>
        Sans lui, {pct(rungs[4]!.supersededRate)} des questions remontent au moins un article déjà
        abrogé. Le modèle répond alors correctement — à partir d’un texte qui ne s’applique plus.
        Aucune mesure d’exactitude ne voit cette erreur ; c’est celle qui compte le plus en droit.
        Avec le filtre : {pct(best.supersededRate)}.
      </p>

      <h2>Ce qui échoue, et pourquoi</h2>

      <p>
        {summary.totalFailures} questions sur {summary.goldSetSize} posent un problème sur la
        configuration retenue. Elles sont classées par cause, pas comptées ensemble.
      </p>

      <div className="scroll">
        <table>
          <thead>
            <tr><th>type d’échec</th><th>n</th><th>part</th></tr>
          </thead>
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
        <code>retrieval-miss</code> : l’article qui tranche n’est jamais arrivé au modèle — un
        problème d’indexation, qu’aucun prompt ne corrigera. <code>generation-miss</code> : il était
        dans le contexte et la réponse est fausse quand même. Un chiffre d’exactitude unique
        fusionne les deux et ne désigne ni l’un ni l’autre.
      </p>

      <h2>Comment c’est mesuré</h2>

      <p>
        Les 142 questions sont construites à partir du corpus : on part d’un article, puis on écrit
        une question à laquelle il répond. La citation attendue est donc juste par construction.
        Les réponses ont ensuite été relues par un modèle d’un autre éditeur, qui a signalé 12,7 %
        des lignes, puis les lignes signalées ont été tranchées à la main — avec un échantillon de
        contrôle tiré des lignes validées, pour vérifier le relecteur lui-même.
      </p>

      <p>
        Refus justes et refus à tort sont toujours publiés ensemble : un système qui refuse tout
        obtient 100 % au premier et 100 % au second.
      </p>

      <hr />

      <div className="links small">
        <a href={REPO}>Code source</a>
        <a href={`${REPO}/blob/main/results/LEADERBOARD.md`}>Tableau complet</a>
        <a href={`${REPO}/blob/main/results/FAILURES.md`}>Catalogue d’échecs</a>
        <a href={`${REPO}/blob/main/data/gold`}>Jeu de questions</a>
        <a href={`${REPO}/blob/main/docs/decisions.md`}>Décisions</a>
      </div>

      <p className="small muted">
        Corpus : code du travail et convention collective Syntec (IDCC 1486), données ouvertes DILA,
        Licence Ouverte. Chaque exécution est versionnée dans le dépôt, donc aucun chiffre ne peut
        être révisé en silence.
      </p>
    </main>
  )
}
