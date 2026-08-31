import type { SurfaceCopy } from '@/app/components/Surface'
import { REPO } from '@/app/components/Surface'

/**
 * Every string of the French surface. Numbers are written as `{token}` and substituted from
 * the committed results, so no sentence can assert a figure the tables no longer show.
 */
export const FR: SurfaceCopy = {
  locale: 'fr',
  otherHref: '/en',
  otherLabel: 'English',

  headline: 'Répondre en droit du travail sans inventer',
  ledeBefore:
    "Un salarié Syntec demande la durée de sa période d'essai. Deux textes s'appliquent, l'un l'emporte sur l'autre, et une version abrogée traîne encore dans les bases. Sur {gold} questions annotées à la main, ce système retrouve l'article qui tranche ",
  ledeAfter:
    " du temps — et ne sert aucun texte qui ne s'applique plus, contre deux tiers avant le filtre de date.",

  colophon: [
    { label: 'corpus', value: '2 108 articles en vigueur · code du travail + Syntec' },
    { label: 'jeu annoté', value: '{gold} questions, ~15 % sans réponse' },
    { label: 'génération', value: '{model}' },
    { label: 'juge', value: '{judge} · non validé' },
    { label: 'coût', value: '{cost} € par question' },
    { label: 'latence p95', value: '{p95} ms' },
  ],

  demoHeading: 'Posez-lui une question',
  demoIntro:
    "Le système ne répond qu'à partir des articles qu'il vient de retrouver. Vous voyez le pipeline se dérouler : les requêtes qu'il écrit, ce qu'il trouve, ce qu'il écarte parce que le texte n'est plus en vigueur. S'il ne trouve pas de quoi trancher, il refuse.",

  examples: [
    "période d'essai d'un cadre Syntec ?",
    'préavis de démission pour un ingénieur ?',
    'quel est le taux de TVA applicable ?',
  ],

  demo: {
    placeholder: 'Ex. : je démissionne, quel préavis dois-je respecter comme cadre ?',
    submit: 'Interroger',
    running: 'Recherche…',
    examplesLabel: 'ou',

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
      rewrite: 'La question est reformulée en {n} requêtes, en vocabulaire juridique. L’originale est toujours gardée.',
      dense: 'Recherche vectorielle sur {q} requêtes — {c} articles distincts.',
      lexical: 'Recherche lexicale sur les mêmes requêtes — {c} articles distincts.',
      fuse: 'Fusion par rang réciproque : {c} candidats, classés sur le rang et jamais sur des scores qui ne sont pas à la même échelle.',
      filter: '{kept} candidats en vigueur au {asOf}. {dropped} écartés : le texte ne s’applique plus.',
      precedence: 'La convention l’emporte sur le code quand elle est plus favorable : deux places d’avance, ce qui a déplacé {n} candidats.',
      rerank: '{from} candidats reclassés par un reranker dédié, {kept} retenus.',
      generate: 'Réponse produite à partir de ces extraits, et de rien d’autre.',
    },
    droppedNote: 'articles abrogés qui concouraient pour une place dans la réponse',
    noDrop: 'Les {kept} candidats sont tous en vigueur au {asOf}. Rien à écarter.',

    refusalTitle: 'INSUFFISANT',
    refusalBody:
      "Les articles retrouvés ne permettent pas de trancher, donc le système ne répond pas. C'est le comportement attendu : {refusalAccuracy} des refus sont justes, pour {falseRefusal} de refus à tort.",

    sourcesTitle: 'Ce que le modèle avait sous les yeux',
    sourcesNote:
      'Les cinq extraits transmis, cités ou non. Rien d’autre n’a été utilisé, et vous pouvez vérifier la citation au lieu de la croire.',
    cited: 'cité',
    notCited: 'non cité',
    inForce: 'en vigueur',
    since: 'depuis le',
    articleWord: 'article',
    conventionWins: 'convention prioritaire',

    readout: { cost: 'coût', latency: 'total', generation: 'génération', model: 'modèle' },

    errors: {
      'daily-cap':
        "Le budget quotidien de la démo est atteint. Il repart à zéro à minuit UTC — c'est un plafond posé dans le code, pas une panne.",
      'rate-limit': 'Trop de questions depuis cette adresse. Réessayez dans une heure.',
      'question-too-short': 'La question est trop courte.',
      'question-too-long': 'La question dépasse 300 caractères.',
      'demo-unavailable': 'La démo est momentanément indisponible. Le rapport ci-dessous reste consultable.',
    },
  },

  ladderHeading: 'Chaque palier ajoute une seule chose',
  ladderIntro:
    "L'écart entre deux lignes est donc imputable à cette chose, et non à un paquet de changements. Deux mesures par palier : ce qu'il retrouve, et ce qu'il retrouve qui ne s'applique plus.",

  ladder: {
    recall: 'recall@5 — l’article qui tranche est retrouvé',
    repealed: 'articles abrogés servis au modèle',
    adds: {
      baseline: 'chunks de taille fixe',
      article: 'chunks par article',
      hybrid: '+ recherche lexicale',
      rerank: '+ reranking',
      rewrite: '+ reformulation de requête',
      filtered: '+ filtre de date et précédence',
    },
  },

  table: {
    headers: ['palier', 'ajoute', 'recall@5', 'réponses correctes', 'citations', 'abrogés', '€ / question'],
    adds: {
      baseline: 'chunks de taille fixe',
      article: 'chunks par article',
      hybrid: '+ recherche lexicale',
      rerank: '+ reranking',
      rewrite: '+ reformulation de requête',
      filtered: '+ filtre de date et précédence',
    },
  },

  hybridNote:
    'La recherche hybride fait *baisser* le recall de {hybrid} points. Le résultat est publié tel quel : un tableau où chaque ligne améliore la précédente est un tableau qu’on n’a pas vraiment mesuré. Le reranking l’a ensuite récupéré, et au-delà.',
  filterNote:
    'Sans filtre de date, {supersededNoFilter} des questions remontent au moins un article déjà abrogé. Le modèle répond alors correctement, à partir d’un texte qui ne s’applique plus — une erreur qu’aucune mesure d’exactitude ne voit, et celle qui compte le plus en droit. Avec le filtre : {superseded}.',

  bandHeading: 'Pourquoi l’exactitude est une fourchette',
  bandIntro:
    'Tous les autres chiffres de cette page sont vérifiables sans connaître le droit du travail. Décider si une réponse dit la même chose que la référence, non.',

  band: {
    wrong: 'faux dans les deux lectures',
    wrongNote: 'ce qui ne dépend d’aucune grille de correction',
    dependent: 'dépend de la grille',
    dependentNote: 'la grille stricte et la grille indulgente ne sont pas d’accord',
    correct: 'juste dans les deux lectures',
    correctNote: 'compté correct quelle que soit la sévérité',
    caption: 'palier « filtered » · {gold} questions',
  },

  bandWhy:
    'Les citations attendues sont justes par construction — chaque question a été écrite à partir de l’article qu’elle cite — donc le recall ne repose sur la mémoire de personne, et les questions sans réponse ont été vérifiées mécaniquement. L’exactitude des réponses est la seule exception : personne de qualifié n’a annoté ce jeu, et une première calibration a donné un kappa de Cohen de 0,489 face à un lecteur non spécialiste, un accord trop faible pour valider quoi que ce soit. Le juge est donc publié comme non validé plutôt que certifié sur un mauvais échantillon. Ce qu’il faudrait pour trancher : environ deux heures d’une personne qui pratique la convention Syntec, sur 60 réponses tirées au sort.',

  failureHeading: 'Ce qui échoue, et pourquoi',
  failureIntro:
    '{failures} questions sur {gold} posent un problème sur la configuration retenue. Elles sont classées par cause, pas comptées ensemble.',

  failureKinds: {
    'rubric-dependent': 'la réponse tient ou ne tient pas selon la sévérité de la grille',
    'false-refusal': 'refus alors que le corpus contenait de quoi répondre',
    'generation-miss': 'le bon article était dans le contexte, la réponse est fausse',
    'retrieval-miss': 'l’article qui tranche n’est jamais arrivé au modèle',
    'citation-miss': 'la réponse est juste, la source citée ne l’est pas',
  },

  failureNote:
    'Un `retrieval-miss` est un problème d’indexation, qu’aucun prompt ne corrigera. Un `generation-miss` est l’inverse : tout était là et la réponse est fausse quand même. Un chiffre d’exactitude unique fusionne les deux et ne désigne ni l’un ni l’autre.',

  methodHeading: 'Comment c’est mesuré',
  methodBody: [
    'Les {gold} questions sont construites à partir du corpus : on part d’un article, puis on écrit une question à laquelle il répond. La citation attendue est donc juste par construction, et le recall ne dépend de la mémoire de personne.',
    'Les réponses ont ensuite été relues par un modèle d’un autre éditeur, qui a signalé 12,7 % des lignes ; les lignes signalées ont été tranchées à la main, avec un échantillon de contrôle tiré des lignes validées pour vérifier le relecteur lui-même.',
    'Refus justes et refus à tort sont toujours publiés ensemble : un système qui refuse tout obtient 100 % au premier et 100 % au second. Ici, {refusalAccuracy} de refus justes pour {falseRefusal} de refus à tort.',
    'La démo ci-dessus fait tourner le code exact qui a produit ces chiffres — l’intégration continue échoue si la copie diverge. Une démo qui aurait dérivé du harnais publierait des mesures sur un système que personne ne peut essayer.',
  ],

  links: [
    { label: 'Code source', href: REPO },
    { label: 'Tableau complet', href: `${REPO}/blob/main/results/LEADERBOARD.md` },
    { label: 'Catalogue d’échecs', href: `${REPO}/blob/main/results/FAILURES.md` },
    { label: 'Jeu de questions', href: `${REPO}/blob/main/data/gold` },
    { label: 'Décisions', href: `${REPO}/blob/main/docs/decisions.md` },
  ],

  licence:
    'Corpus : code du travail et convention collective Syntec (IDCC 1486), données ouvertes DILA, Licence Ouverte. Chaque exécution de l’évaluation est versionnée dans le dépôt, donc aucun chiffre ne peut être révisé en silence. Construit par Farouk Ben Fraj.',
}
