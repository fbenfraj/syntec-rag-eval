import type { ChromeCopy, DemoPageCopy, LimitsPageCopy, MethodPageCopy } from '@/app/copy/types'

export const REPO = 'https://github.com/fbenfraj/syntec-rag-eval'

/**
 * The French surface.
 *
 * Written for someone who runs a company or an engineering team, not for someone who reads
 * retrieval papers. Every published figure is a `{token}` filled from the committed
 * results, so a sentence cannot assert a number the tables no longer show.
 */
const chrome: ChromeCopy = {
  home: { href: '/', subtitle: 'Droit du travail · Syntec' },
  navLabel: 'Navigation principale',
  nav: [
    { key: 'demo', href: '/', label: 'La démo' },
    { key: 'method', href: '/methode', label: 'Comment c’est mesuré' },
    { key: 'limits', href: '/limites', label: 'Ce qu’il rate' },
  ],
  otherLocale: { href: '/en', label: 'English' },
  footerBlurb:
    'Une démonstration de recherche documentaire mesurée, construite par FrajTech sur le Code du travail et la convention collective Syntec.',
  footerColumns: [
    {
      heading: 'Le projet',
      links: [
        { href: '/methode', label: 'Comment c’est mesuré' },
        { href: '/limites', label: 'Ce qu’il rate' },
        { href: REPO, label: 'Code source', external: true },
      ],
    },
    {
      heading: 'FrajTech',
      links: [
        { href: 'https://frajtech.com', label: 'frajtech.com' },
        { href: 'https://frajtech.com/#contact', label: 'Nous parler' },
      ],
    },
  ],
  disclaimer:
    'Démonstration technique privée réalisée par FrajTech. Ce site n’est pas un service public, n’émane d’aucune administration et ne constitue pas un conseil juridique. Les textes cités proviennent des données ouvertes DILA (Licence Ouverte) ; vérifiez toujours sur Légifrance avant de vous en servir.',
}

export const FR_DEMO: DemoPageCopy = {
  locale: 'fr',
  chrome,
  title: 'Le Bon Article — la réponse, et le texte qui la fonde',
  metaDescription:
    'Posez une question de droit du travail. Vous obtenez une réponse, l’article du Code du travail ou de la convention Syntec qui la fonde, et la date à laquelle il s’applique. Démonstration FrajTech.',

  headline: 'La réponse, et l’article qui la fonde.',
  lede:
    'Posez une question sur le Code du travail ou la convention Syntec. Vous obtenez une réponse courte, l’article exact sur lequel elle repose, et la garantie qu’il est encore en vigueur. S’il ne trouve pas de quoi trancher, il vous le dit.',

  // Verified against the live pipeline: the first two answer, the third refuses. A demo
  // whose first example refuses teaches the visitor the wrong thing about it.
  examples: [
    'Quelle est la durée de la période d’essai d’un cadre Syntec ?',
    'Combien de jours travaillés au maximum pour un forfait-jours ?',
    'Quel est le taux de TVA applicable ?',
  ],

  demo: {
    placeholder: 'Ex. : je démissionne, quel préavis dois-je respecter comme cadre ?',
    submit: 'Chercher',
    running: 'Recherche…',
    examplesLabel: 'Essayez',
    hint: 'Entrée pour envoyer · Maj + Entrée pour aller à la ligne',

    steps: {
      search: {
        title: 'Il cherche dans {corpus} articles',
        detail:
          'La question est reformulée en {queries} recherches, en vocabulaire juridique, puis confrontée au texte de deux manières complémentaires. {candidates} articles ressortent.',
      },
      filter: {
        title: 'Il écarte les textes qui ne s’appliquent plus',
        detail:
          '{dropped} articles retirés : ils ont été abrogés ou remplacés et ne sont plus en vigueur au {asOf}. Il en reste {kept}.',
        none: 'Les {kept} articles trouvés sont tous en vigueur au {asOf}. Rien à écarter cette fois.',
        note: 'ces textes existent encore dans les bases et disent souvent autre chose',
      },
      select: {
        title: 'Il garde les 5 articles les plus pertinents',
        detail:
          'Sur {from} candidats, {kept} sont retenus. À pertinence égale, la convention collective passe devant le Code du travail quand elle est plus favorable au salarié.',
      },
      write: {
        title: 'Il rédige la réponse à partir de ces articles',
        detail: 'À partir de ces extraits, et de rien d’autre : ni mémoire, ni culture générale.',
      },
    },

    techLabel: 'Voir le détail technique de cette recherche',
    techNote:
      'Le pipeline exact, dans l’ordre, avec le temps réel de chaque étape. C’est le même code que celui évalué sur les {gold} questions annotées.',
    techStages: {
      rewrite: 'reformulation de la question en requêtes',
      dense: 'recherche vectorielle',
      lexical: 'recherche lexicale',
      fuse: 'fusion par rang réciproque',
      filter: 'filtre de date sur les articles',
      precedence: 'précédence convention / code',
      rerank: 'reclassement par reranker dédié',
      generate: 'génération de la réponse',
    },

    answered: 'Réponse fondée sur les textes',
    refusedLabel: 'Aucune réponse : le corpus ne permet pas de trancher',
    refusedBody:
      'Les articles retrouvés ne répondent pas à la question, donc le système s’arrête là plutôt que d’inventer. C’est voulu : sur le jeu de test, {refusalAccuracy} des refus sont justifiés, pour {falseRefusal} de refus à tort.',

    citedHeading: 'Les textes cités',
    citedNote:
      'Voici les articles sur lesquels la réponse s’appuie, avec leur date d’entrée en vigueur. Vous pouvez les lire vous-même plutôt que nous croire.',
    othersHeading: 'Voir les {n} autres articles consultés mais non retenus',
    cited: 'Cité',
    inForce: 'En vigueur',
    since: 'En vigueur depuis le',
    articleWord: 'Article',
    precedenceNote: 'prioritaire sur le code',

    receipt: { cost: 'Coût de cette requête', latency: 'Durée', model: 'Modèle' },
    whyHardHeading: 'Pourquoi c’est le point difficile',
    whyHard:
      'Les {dropped} articles écartés à l’instant existent toujours dans les bases juridiques, et un système qui les cite produit une réponse parfaitement rédigée, correctement sourcée — et fausse. Sans ce filtre de date, {supersededNoFilter} des questions du jeu de test remontaient au moins un texte abrogé. Avec : {superseded}.',

    errors: {
      'daily-cap':
        'La démo a atteint son budget du jour. Il repart à zéro à minuit UTC — c’est un plafond posé volontairement dans le code, pas une panne.',
      'rate-limit': 'Trop de questions depuis cette connexion. Réessayez dans une heure.',
      'question-too-short': 'La question est trop courte.',
      'question-too-long': 'La question dépasse 300 caractères.',
      'demo-unavailable': 'La démo est momentanément indisponible. Les pages de méthode restent consultables.',
    },
  },

  trustHeading: 'Trois choses qu’il fait, et que la plupart des démos ne font pas',
  trustPoints: [
    {
      icon: 'source',
      title: 'Chaque réponse montre son texte',
      body:
        'Pas de résumé sans source. L’article est affiché sous la réponse, avec sa référence, pour que vous puissiez vérifier au lieu de faire confiance. Sur le jeu de test, l’article qui tranche est retrouvé dans {recall} des cas.',
    },
    {
      icon: 'date',
      title: 'Les textes périmés sont écartés',
      body:
        'Le droit change, et les versions abrogées restent dans les bases. Un système qui les cite a l’air juste et ne l’est pas. Ici : {superseded} d’articles abrogés servis, contre {supersededNoFilter} sans ce filtre.',
    },
    {
      icon: 'refuse',
      title: 'Il refuse plutôt que d’inventer',
      body:
        'Posez-lui une question de TVA : il répond qu’il ne sait pas. {refusalAccuracy} des refus sont justifiés, pour {falseRefusal} de refus à tort — les deux chiffres publiés ensemble, parce qu’un système qui refuse tout obtiendrait 100 % au premier.',
    },
  ],

  onwardHeading: 'Aller plus loin',
  onward: [
    {
      href: '/methode',
      icon: 'method',
      title: 'Comment c’est mesuré',
      body:
        '{gold} questions annotées à la main, six configurations comparées, et un résultat qui va dans le mauvais sens publié tel quel.',
    },
    {
      href: '/limites',
      icon: 'limits',
      title: 'Ce qu’il rate',
      body: 'Les questions qui posent problème, classées par cause, et ce que ce système ne doit pas servir à faire.',
    },
  ],
}

export const FR_METHOD: MethodPageCopy = {
  locale: 'fr',
  chrome,
  title: 'Comment c’est mesuré — Le Bon Article',
  metaDescription:
    'Six configurations comparées sur 142 questions de droit du travail annotées à la main. Échecs de recherche et de rédaction comptés séparément.',

  headline: 'Comment c’est mesuré',
  lede:
    'N’importe quel système de ce type peut avoir l’air de marcher sur trois questions bien choisies. Celui-ci a été mesuré sur {gold} questions écrites et annotées à la main, et les résultats gênants sont publiés avec les autres.',

  ladderHeading: 'Chaque palier ajoute une seule chose',
  ladderIntro:
    'Six versions du même système, chacune ajoutant exactement une capacité à la précédente. L’écart entre deux lignes est donc attribuable à cette capacité, et pas à un paquet de changements. Deux mesures par ligne : ce qu’il retrouve, et ce qu’il retrouve qui ne s’applique plus.',
  ladder: {
    recall: 'L’article qui tranche est retrouvé',
    repealed: 'Des articles abrogés sont servis au modèle',
    adds: {
      baseline: 'découpage à taille fixe',
      article: 'découpage par article',
      hybrid: '+ recherche lexicale',
      rerank: '+ reclassement',
      rewrite: '+ reformulation',
      filtered: '+ filtre de date et précédence',
    },
  },
  table: {
    headers: ['palier', 'ce qu’il ajoute', 'article trouvé', 'réponses justes', 'citations', 'abrogés', '€ / question'],
    adds: {
      baseline: 'découpage à taille fixe',
      article: 'découpage par article',
      hybrid: '+ recherche lexicale',
      rerank: '+ reclassement',
      rewrite: '+ reformulation',
      filtered: '+ filtre de date et précédence',
    },
  },

  hybridNote:
    'La recherche lexicale, ajoutée au palier « hybrid », a fait *baisser* la performance de {hybrid} points. C’est publié tel quel. Un tableau où chaque ligne améliore la précédente est un tableau que personne n’a vraiment mesuré : on y a seulement gardé ce qui arrangeait. Le reclassement a ensuite récupéré cette perte, et davantage.',
  filterNote:
    'Le filtre de date est le changement qui compte le plus. Sans lui, {supersededNoFilter} des questions remontaient au moins un article abrogé, et le modèle répondait correctement à partir d’un texte qui ne s’applique plus. Aucune mesure d’exactitude ne voit cette erreur : la réponse est bien rédigée et bien sourcée, simplement fausse. Avec le filtre : {superseded}.',

  bandHeading: 'Pourquoi l’exactitude est publiée comme une fourchette',
  bandIntro:
    'Tous les autres chiffres de cette page se vérifient sans connaître le droit du travail. Décider si une réponse dit la même chose que la référence, non — et personne de qualifié ne l’a fait.',
  band: {
    wrong: 'Faux à coup sûr',
    wrongNote: 'faux quelle que soit la sévérité de la correction',
    dependent: 'Discutable',
    dependentNote: 'une correction stricte et une correction indulgente ne sont pas d’accord',
    correct: 'Juste à coup sûr',
    correctNote: 'compté correct dans les deux lectures',
    caption: 'Configuration retenue · {gold} questions',
  },
  bandWhy:
    'Les citations attendues sont justes par construction : chaque question a été écrite à partir de l’article qui y répond, donc la mesure de recherche ne repose sur la mémoire de personne. L’exactitude des réponses est la seule exception. Une première tentative de calibration a donné un kappa de Cohen de 0,489 face à un lecteur non spécialiste — un accord trop faible pour valider quoi que ce soit. Le juge automatique est donc publié comme *non validé* plutôt que certifié sur un mauvais échantillon.',

  methodHeading: 'D’où viennent les questions',
  methodBody: [
    'Les {gold} questions sont construites à partir du corpus : on part d’un article, puis on écrit une question à laquelle il répond. La citation attendue est donc juste par construction, et la mesure de recherche ne dépend de la mémoire de personne. Environ 15 % des questions n’ont volontairement aucune réponse dans le corpus, pour mesurer les refus.',
    'Les réponses ont ensuite été relues par un modèle d’un autre éditeur, qui a signalé 12,7 % des lignes. Les lignes signalées ont été tranchées à la main, avec un échantillon de contrôle tiré des lignes validées — pour vérifier le relecteur autant que les réponses.',
    'Les refus justifiés et les refus à tort sont toujours publiés ensemble : un système qui refuse tout obtiendrait 100 % au premier et 100 % au second. Ici, {refusalAccuracy} de refus justifiés pour {falseRefusal} de refus à tort.',
    'La démo fait tourner le code exact qui a produit ces chiffres, et l’intégration continue échoue si les deux divergent. Chaque exécution de l’évaluation est versionnée dans le dépôt : aucun chiffre ne peut être révisé en silence.',
  ],

  onwardHeading: 'Aller plus loin',
  onward: [
    { href: '/', icon: 'demo', title: 'Essayer la démo', body: 'Posez votre propre question et regardez le système travailler.' },
    { href: '/limites', icon: 'limits', title: 'Ce qu’il rate', body: 'Les échecs, classés par cause, et les usages à éviter.' },
  ],
}

export const FR_LIMITS: LimitsPageCopy = {
  locale: 'fr',
  chrome,
  title: 'Ce qu’il rate — Le Bon Article',
  metaDescription:
    'Les échecs du système, classés par cause : recherche, rédaction, refus à tort, citation. Et ce à quoi cette démonstration ne doit pas servir.',

  headline: 'Ce qu’il rate',
  lede:
    'Un système qui répond sur le droit du travail sans pouvoir dire où il se trompe n’a rien à faire devant un salarié. Voici les {failures} questions sur {gold} qui posent problème, et pourquoi.',

  notForHeading: 'Ce à quoi ça ne doit pas servir',
  notFor: [
    'Ce n’est pas un conseil juridique. Aucun avocat ni juriste n’a validé les réponses de ce système.',
    'Ce n’est pas un service public et ça n’émane d’aucune administration.',
    'Le corpus couvre quatre thèmes seulement : contrat et période d’essai, préavis et rupture, temps de travail et forfait-jours, classification et salaires minimaux. Tout le reste est hors champ.',
    'Aucun accord d’entreprise n’est pris en compte, alors qu’il peut modifier ce que dit la convention de branche.',
    'Avant d’agir sur une réponse, ouvrez l’article cité sur Légifrance et lisez-le.',
  ],

  taxonomyHeading: 'Les échecs, classés par cause',
  taxonomyIntro:
    'Ils ne sont pas comptés ensemble, parce qu’ils n’ont pas le même remède. Un article jamais retrouvé est un problème d’indexation, qu’aucune amélioration de rédaction ne corrigera ; une réponse fausse à partir du bon article est exactement l’inverse.',
  failureKinds: {
    'rubric-dependent': 'la réponse tient ou non selon la sévérité de la correction',
    'false-refusal': 'refus alors que le corpus contenait de quoi répondre',
    'generation-miss': 'le bon article était sous les yeux du modèle, la réponse est fausse',
    'retrieval-miss': 'l’article qui tranche n’est jamais arrivé jusqu’au modèle',
    'citation-miss': 'la réponse est juste, la source citée ne l’est pas',
  },
  taxonomyNote:
    'C’est la raison pour laquelle il n’y a pas de « taux d’exactitude » unique sur ce site. Un seul chiffre fusionnerait un `retrieval-miss` et un `generation-miss`, et ne dirait donc pas quoi réparer. Chez un client, c’est cette distinction qui décide si le prochain sprint porte sur l’indexation ou sur la rédaction.',

  judgeHeading: 'Le juge n’est pas validé, et c’est écrit',
  judgeBody: [
    'Les réponses sont notées automatiquement par un second modèle ({judge}). Pour qu’une note automatique veuille dire quelque chose, il faut montrer qu’elle est d’accord avec un humain compétent. La première calibration a donné un kappa de Cohen de 0,489 face à un lecteur non spécialiste — un accord trop faible pour valider quoi que ce soit.',
    'Deux options existaient : présenter quand même un chiffre d’exactitude, ou dire que le juge n’est pas validé. C’est la seconde qui a été retenue, et l’exactitude est publiée comme une fourchette entre une correction stricte et une correction indulgente. Ce qui ne dépend d’aucune correction : {wrongBoth} des réponses sont fausses dans les deux lectures.',
    'Ce que ça coûterait de trancher : environ deux heures d’une personne qui pratique la convention Syntec, sur 60 réponses tirées au sort. C’est le genre d’arbitrage qu’on préfère écrire noir sur blanc plutôt que d’arrondir.',
  ],

  onwardHeading: 'Aller plus loin',
  onward: [
    { href: '/', icon: 'demo', title: 'Essayer la démo', body: 'Posez votre propre question et regardez le système travailler.' },
    { href: '/methode', icon: 'method', title: 'Comment c’est mesuré', body: 'Le protocole, les six configurations et la fourchette d’exactitude.' },
  ],
}
