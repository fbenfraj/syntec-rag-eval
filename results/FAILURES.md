# Failure catalogue

Configuration `filtered`, 142 questions, 68 with something wrong (47.9%).
Generator `claude-haiku-4-5-20251001`, judge `claude-sonnet-4-5-20250929`.

## What went wrong, and how often

| failure | n | share | what it means |
|---|---|---|---|
| `retrieval-miss` | 5 | 3.5% | the governing article never reached the model — an indexing problem, not a model problem |
| `generation-miss` | 52 | 36.6% | the governing article was in context and the answer was still wrong |
| `false-refusal` | 10 | 7.0% | refused a question the corpus answers |
| `citation-miss` | 1 | 0.7% | the answer was right but cited the wrong articles |

The split between `retrieval-miss` and `generation-miss` is the one that matters. The first
means the governing article never reached the model, and no amount of prompting will fix it.
The second means it was there and the answer was still wrong. A single accuracy number
merges the two and points at neither.

## `retrieval-miss` — 5

_the governing article never reached the model — an indexing problem, not a model problem_

### q035 · general · tier 1

**Question.** Dans quels cas un salarié peut-il travailler plus de 8 heures par jour, selon la négociation collective ?

**Expected.** Un salarié peut dépasser 8 heures par jour s'il exerce des activités caractérisées par l'éloignement entre son domicile et son lieu de travail, des activités de garde ou de surveillance nécessitant la protection des biens et des personnes, ou des activités nécessitant d'assurer la continuité du service ou de la production.

**Produced.** Selon les extraits fournis, un salarié peut travailler plus de 8 heures par jour en cas d'activité accrue ou pour des motifs liés à l'organisation de l'entreprise, à condition que ce dépassement ne porte pas la durée quotidienne à plus de 12 heures. Un accord d'entreprise ou de branche peut également prévoir d'autres conditions de dépassement déterminées par décret.

**Required.** code:R3122-7 (code R3122-7)

**Retrieved.** code:L3121-19 (code L3121-19), code:L3122-17 (code L3122-17), code:D3131-6 (code D3131-6), code:L3121-23 (code L3121-23), convention:5851878 (convention KALIARTI000005851878)

**Cited.** code:L3121-19, code:L3122-17

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate mentionne des motifs différents (activité accrue, organisation de l'entreprise) alors que la référence liste des cas spécifiques (éloignement domicile-travail, garde/surveillance, continuité service/production), ce qui constitue une contradiction sur les conditions permettant le dépassement.

**Analyse:**

---

### q073 · override · tier 1

**Question.** Pendant combien de temps cet accord sur les CQP s'applique-t-il ?

**Expected.** Cet accord s'applique pour une durée indéterminée.

**Produced.** Cet accord s'applique pour une durée indéterminée à compter du lendemain de sa signature, mais cessera de produire ses effets au 31 décembre 2025.

**Required.** convention:22017900 (convention 9)

**Retrieved.** convention:22017903 (convention KALIARTI000022017903), convention:42668886 (convention 9), convention:22017899 (convention 8), convention:48150742 (convention 6), convention:41549542 (convention 12)

**Cited.** convention:42668886, convention:48150742

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate ajoute une date de fin (31 décembre 2025) alors que la référence affirme une durée indéterminée sans limitation temporelle, ce qui constitue une contradiction substantielle.

**Analyse:**

---

### q084 · override · tier 1

**Question.** À partir de quand cet avenant sur la complémentaire santé devient-il applicable ?

**Expected.** L'avenant prend effet à compter de la date de sa signature, sous réserve de la mise en œuvre du droit d'opposition.

**Produced.** L'avenant le plus récent sur la complémentaire santé devient applicable à partir du 1er avril 2025.

**Required.** convention:32730115 (convention 4)

**Retrieved.** convention:47551145 (convention 4), convention:49300383 (convention 4), convention:51447098 (convention 2), convention:51537726 (convention KALIARTI000051537726), convention:39748322 (convention KALIARTI000039748322)

**Cited.** convention:51537726

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate donne une date précise (1er avril 2025) alors que la référence indique que l'avenant prend effet à compter de la date de sa signature, sous réserve du droit d'opposition, sans mentionner cette date spécifique.

**Analyse:**

---

### q085 · override · tier 1

**Question.** À partir de quand cet avenant sur la complémentaire santé est-il entré en vigueur ?

**Expected.** À compter du 1er janvier 2020.

**Produced.** L'avenant le plus récent sur la complémentaire santé est entré en vigueur à compter du 1er avril 2025.

**Required.** convention:39748316 (convention 5)

**Retrieved.** convention:51447098 (convention 2), convention:47551145 (convention 4), convention:49300383 (convention 4), convention:51537726 (convention KALIARTI000051537726), convention:39748322 (convention KALIARTI000039748322)

**Cited.** convention:51537726

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate indique une date d'entrée en vigueur différente (1er avril 2025) de celle mentionnée dans la référence (1er janvier 2020).

**Analyse:**

---

### q096 · override · tier 1

**Question.** Si une organisation syndicale veut arrêter d'appliquer cet accord, quel délai minimum doit-elle respecter avant de le faire ?

**Expected.** Un préavis minimal de 3 mois doit être donné à toutes les organisations signataires par lettre recommandée avec accusé de réception.

**Produced.** Le délai minimum à respecter est de **3 mois** de préavis. Ce préavis doit être donné à toutes les organisations signataires par lettre recommandée avec accusé de réception, sous peine de nullité.

**Required.** convention:47006884 (convention 7)

**Retrieved.** convention:47652071 (convention KALIARTI000047652071), convention:42668889 (convention 11), convention:47348436 (convention 4), convention:28465410 (convention 9.2), convention:47348355 (convention 25)

**Cited.** convention:47652071, convention:47348436, convention:47348355

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate ajoute une condition "sous peine de nullité" que la référence ne mentionne pas, ce qui engage le lecteur sur une conséquence juridique non établie par la référence.

**Analyse:**

---

## `generation-miss` — 52

_the governing article was in context and the answer was still wrong_

### q001 · general · tier 2

**Question.** Si j'embauche un salarié étranger et que je lui propose un contrat écrit, dois-je lui fournir une version traduite dans sa langue ?

**Expected.** Oui, si le salarié étranger le demande, une traduction du contrat doit être rédigée dans sa langue. Les deux textes font foi en justice, et en cas de désaccord entre les versions, seul le texte dans la langue du salarié peut être invoqué contre lui.

**Produced.** Non, vous ne devez fournir une traduction que si le salarié étranger la demande. Cependant, si vous la fournissez, les deux textes font foi en justice et en cas de discordance, seul le texte dans la langue du salarié peut être invoqué contre lui.

**Required.** code:L1221-3 (code L1221-3)

**Retrieved.** code:L1221-3 (code L1221-3), code:R1221-9 (code R1221-9), code:L1242-13 (code L1242-13), code:L1221-1 (code L1221-1), code:R1221-37 (code R1221-37)

**Cited.** code:L1221-3

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate commence par "Non" alors que la référence commence par "Oui", ce qui donne au lecteur l'impression inverse de la règle applicable, même si la suite rétablit l'équivalence logique.

**Analyse:**

---

### q002 · general · tier 2

**Question.** Une femme enceinte travaille de nuit et son employeur ne peut pas lui proposer un autre poste. Qu'arrive-t-il à son contrat de travail et comment est-elle rémunérée pendant cette période ?

**Expected.** Le contrat de travail est suspendu jusqu'au début du congé de maternité. La salariée reçoit une garantie de rémunération composée d'une allocation journalière de la sécurité sociale et d'une indemnité complémentaire versée par l'employeur.

**Produced.** Son contrat de travail est suspendu jusqu'à la date du début du congé légal de maternité et éventuellement durant la période complémentaire qui suit la fin de ce congé. Pendant cette suspension, elle bénéficie d'une garantie de rémunération composée de l'allocation journalière de la sécurité sociale et d'une indemnité complémentaire à la charge de l'employeur, calculée selon les modalités de l'article L. 1226-1, sauf pour l'ancienneté.

**Required.** code:L1225-10 (code L1225-10)

**Retrieved.** code:L1225-10 (code L1225-10), code:L1225-14 (code L1225-14), code:L1225-9 (code L1225-9), code:L1225-25 (code L1225-25), code:L1225-12 (code L1225-12)

**Cited.** code:L1225-10

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition non mentionnée dans la référence ("éventuellement durant la période complémentaire qui suit la fin de ce congé"), ce qui étend la durée de suspension au-delà de ce qu'affirme la référence qui s'arrête au début du congé de maternité.

**Analyse:**

---

### q004 · general · tier 2

**Question.** Dans une petite entreprise sans délégués du personnel, qui peut accompagner un salarié lors de l'entretien avant son licenciement ?

**Expected.** Un conseiller du salarié inscrit sur une liste officielle peut l'assister. Cette liste est établie par l'autorité administrative après consultation des organisations patronales et syndicales, et ne peut pas inclure de conseillers prud'hommes en activité.

**Produced.** Dans une petite entreprise sans institutions représentatives du personnel, le salarié peut se faire assister lors de l'entretien préalable au licenciement soit par une personne de son choix appartenant au personnel de l'entreprise, soit par un conseiller du salarié inscrit sur une liste dressée par l'autorité administrative.

**Required.** code:L1232-7 (code L1232-7)

**Retrieved.** code:L1232-7 (code L1232-7), code:L1232-4 (code L1232-4), code:L1233-13 (code L1233-13), code:R1232-2 (code R1232-2), code:L1237-12 (code L1237-12)

**Cited.** code:L1232-4

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate ajoute une option d'assistance ("une personne de son choix appartenant au personnel de l'entreprise") que la référence ne mentionne pas, engageant ainsi le lecteur sur un droit supplémentaire non établi par la référence.

**Analyse:**

---

### q005 · general · tier 1

**Question.** Un employé travaille depuis 18 mois dans l'entreprise et reçoit un licenciement sans faute grave. Combien de temps de préavis doit-il recevoir au minimum ?

**Expected.** Un mois de préavis, car l'employé justifie d'une ancienneté comprise entre six mois et moins de deux ans.

**Produced.** Un employé ayant 18 mois d'ancienneté (entre 6 mois et moins de 2 ans) a droit à un préavis d'un mois selon le code du travail. Toutefois, si une convention collective applicable prévoit une durée plus favorable, celle-ci s'applique.

**Required.** code:L1234-1 (code L1234-1)

**Retrieved.** code:L1234-1 (code L1234-1), convention:47513833 (convention 4.2), code:L1234-3 (code L1234-3), convention:5851319 (convention 21), code:L1234-2 (code L1234-2)

**Cited.** code:L1234-1

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition sur la convention collective que la référence ne mentionne pas, ce qui engage le lecteur dans une démarche supplémentaire non requise par la référence.

**Analyse:**

---

### q006 · general · tier 2

**Question.** Quand un employeur doit-il montrer au juge les documents qu'il a préparés pour un licenciement pour raison économique, qu'est-ce qu'il doit lui transmettre exactement ?

**Expected.** L'employeur doit communiquer au juge tous les éléments qu'il a fournis aux représentants du personnel, ou à défaut de représentants du personnel dans l'entreprise, tous les éléments qu'il a fournis à l'autorité administrative.

**Produced.** L'employeur doit communiquer au juge tous les éléments qu'il a fournis aux représentants du personnel (ou à l'autorité administrative s'il n'y a pas de représentants) en application du chapitre III du code du travail. Le texte ne précise pas la liste exhaustive de ces éléments, renvoyant à un décret en Conseil d'État pour les modalités d'application.

**Required.** code:L1235-9 (code L1235-9)

**Retrieved.** code:L1235-9 (code L1235-9), code:L1233-16 (code L1233-16), code:L1233-42 (code L1233-42), code:L1233-15 (code L1233-15), code:L1233-57-3 (code L1233-57-3)

**Cited.** code:L1235-9

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition non mentionnée dans la référence ("en application du chapitre III") et ajoute une information sur un décret en Conseil d'État que la référence ne mentionne pas, ce qui va au-delà de ce qu'affirme la référence.

**Analyse:**

---

### q007 · general · tier 1

**Question.** Quand un contrat temporaire prend fin et qu'on n'embauche pas la personne en CDI, quel pourcentage de sa rémunération brute totale doit-on lui verser en compensation ?

**Expected.** 10 % de la rémunération totale brute versée au salarié. Cette indemnité s'ajoute au dernier salaire et est versée en même temps.

**Produced.** Selon le code du travail, le salarié a droit à une indemnité de fin de contrat égale à 10 % de la rémunération totale brute versée. Cependant, si une convention collective s'applique (comme celle mentionnée pour les enquêteurs vacataires), elle peut prévoir un pourcentage différent et plus favorable, comme 4 % dans ce cas spécifique.

**Required.** code:L1243-8 (code L1243-8)

**Retrieved.** code:L1243-8 (code L1243-8), code:L1242-12-1 (code L1242-12-1), code:L1242-16 (code L1242-16), convention:5851356 (convention 53), code:D1243-1 (code D1243-1)

**Cited.** code:L1243-8, convention:5851356

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition sur les conventions collectives et mentionne un pourcentage différent (4%) que la référence ne mentionne pas, alors que la référence se limite à affirmer le taux de 10% sans réserve ni exception.

**Analyse:**

---

### q014 · general · tier 1

**Question.** Comment est calculée l'indemnité horaire pour un conseiller du salarié qui ne gagne que des commissions ?

**Expected.** L'indemnité horaire est égale à 1/1900 des revenus professionnels déclarés à l'administration fiscale l'année précédente, pour chaque heure travaillée entre 8 heures et 18 heures.

**Produced.** L'indemnité horaire pour un conseiller du salarié rémunéré uniquement à la commission est égale à 1/1900 des revenus professionnels déclarés à l'administration fiscale l'année précédente, pour chaque heure passée entre 8 heures et 18 heures dans l'exercice de ses fonctions. Le conseiller doit produire une copie de sa déclaration d'impôts et une attestation de revenus de son ou ses employeurs.

**Required.** code:D1232-10 (code D1232-10)

**Retrieved.** code:D1232-10 (code D1232-10), code:L1232-10 (code L1232-10), code:D1232-8 (code D1232-8), code:L1232-9 (code L1232-9), code:D1232-9 (code D1232-9)

**Cited.** code:D1232-10

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition procédurale (production de documents : copie de déclaration d'impôts et attestation de revenus) que la référence ne mentionne pas.

**Analyse:**

---

### q016 · general · tier 2

**Question.** Si je veux me faire accompagner lors de la discussion avec mon employeur sur la fin de mon contrat d'un commun accord, qui peut m'assister ?

**Expected.** Vous pouvez vous faire assister soit par une personne de votre choix travaillant dans l'entreprise (salarié, représentant du personnel, etc.), soit, s'il n'y a pas de représentants du personnel, par un conseiller figurant sur une liste établie par l'administration.

**Produced.** Lors d'une rupture conventionnelle, vous pouvez vous faire assister soit par une personne de votre choix appartenant au personnel de l'entreprise (salarié titulaire d'un mandat syndical, membre d'une institution représentative du personnel ou tout autre salarié), soit, en l'absence d'institution représentative du personnel dans l'entreprise, par un conseiller du salarié choisi sur une liste dressée par l'autorité administrative.

**Required.** code:L1237-12 (code L1237-12)

**Retrieved.** code:L1237-12 (code L1237-12), code:L1232-4 (code L1232-4), code:L1233-13 (code L1233-13), code:R1232-2 (code R1232-2), code:L1232-7 (code L1232-7)

**Cited.** code:L1237-12

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition restrictive non mentionnée dans la référence en précisant "salarié titulaire d'un mandat syndical" alors que la référence indique simplement "une personne de votre choix travaillant dans l'entreprise", sans exiger de mandat syndical.

**Analyse:**

---

### q018 · general · tier 1

**Question.** Si je veux déclarer l'embauche d'un salarié par courrier recommandé, au plus tard quel jour dois-je l'envoyer ?

**Expected.** Au plus tard le dernier jour ouvrable précédant l'embauche, le cachet de la poste faisant foi.

**Produced.** La déclaration préalable à l'embauche doit être adressée au plus tôt dans les huit jours précédant la date prévisible de l'embauche, et si elle est transmise par lettre recommandée avec avis de réception, elle doit être envoyée au plus tard le dernier jour ouvrable précédant l'embauche, le cachet de la poste faisant foi.

**Required.** code:R1221-5 (code R1221-5)

**Retrieved.** code:R1221-5 (code R1221-5), code:R1221-4 (code R1221-4), code:L1242-13 (code L1242-13), code:R1225-3 (code R1225-3), code:L1221-10 (code L1221-10)

**Cited.** code:R1221-4, code:R1221-5

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition temporelle ("au plus tôt dans les huit jours précédant") que la référence ne mentionne pas, engageant ainsi le lecteur sur un délai supplémentaire non requis par la référence.

**Analyse:**

---

### q024 · general · tier 1

**Question.** Quel délai l'administration a-t-elle pour vérifier que tout s'est déroulé correctement avant un licenciement collectif dans une petite entreprise ?

**Expected.** L'autorité administrative dispose de vingt et un jours à compter de la notification du projet de licenciement pour effectuer cette vérification.

**Produced.** Dans les entreprises de moins de cinquante salariés, l'autorité administrative dispose d'un délai de vingt et un jours à compter de la notification du projet de licenciement pour vérifier que les représentants du personnel ont été informés et consultés, que les obligations relatives aux mesures sociales ont été respectées, et que ces mesures seront effectivement mises en œuvre.

**Required.** code:L1233-53 (code L1233-53)

**Retrieved.** code:L1233-53 (code L1233-53), code:D1233-38 (code D1233-38), code:L1235-7-1 (code L1235-7-1), code:L1233-39 (code L1233-39), code:L1233-8 (code L1233-8)

**Cited.** code:L1233-53

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute des conditions et précisions sur l'objet de la vérification ("que les représentants du personnel ont été informés et consultés, que les obligations relatives aux mesures sociales ont été respectées, et que ces mesures seront effectivement mises en œuvre") que la référence ne mentionne pas, alors que la référence se limite à indiquer le délai sans détailler ce qui doit être vérifié.

**Analyse:**

---

### q026 · general · tier 1

**Question.** Qui est responsable de fixer les règles concernant comment les heures de travail doivent être organisées et réparties dans une entreprise ?

**Expected.** Des décrets en Conseil d'État déterminent les modalités d'application, notamment la répartition et l'aménagement des horaires de travail, après consultation des organisations d'employeurs et de salariés.

**Produced.** Selon les extraits fournis, la responsabilité est partagée : les décrets en Conseil d'État fixent les modalités d'application générales pour les branches d'activité [code:L3121-67], tandis qu'au niveau de l'entreprise, une convention ou un accord d'entreprise ou d'établissement peut définir la répartition des horaires de travail [code:L3123-23, code:L3121-44]. L'employeur est également garant de la bonne information des salariés en matière de durée et d'horaires de travail [convention:27661888].

**Required.** code:L3121-67 (code L3121-67)

**Retrieved.** code:L3121-67 (code L3121-67), code:L3123-23 (code L3123-23), convention:5851650 (convention KALIARTI000005851650), convention:27661888 (convention 3.1), code:L3121-44 (code L3121-44)

**Cited.** code:L3121-67, code:L3123-23, code:L3121-44, convention:27661888

**recall@5** 1.00 · **citation F1** 0.40

**Judge.** La candidate ajoute des niveaux de responsabilité (convention d'entreprise, employeur) que la référence ne mentionne pas, alors que celle-ci désigne uniquement les décrets en Conseil d'État comme responsables de fixer les règles de répartition et d'aménagement des horaires.

**Analyse:**

---

### q028 · general · tier 1

**Question.** Comment on définit un employé qui travaille moins d'heures que la normale ?

**Expected.** C'est un salarié à temps partiel, c'est-à-dire quelqu'un dont la durée du travail est inférieure à la durée légale du travail ou à la durée fixée par convention dans la branche ou l'entreprise.

**Produced.** Un salarié à temps partiel est celui dont la durée du travail est inférieure à la durée légale du travail (ou à la durée fixée conventionnellement si elle est inférieure), évaluée sur une base hebdomadaire, mensuelle ou annuelle (1 607 heures par an). Cette définition s'applique à tout salarié travaillant moins que la durée de référence applicable dans son entreprise ou sa branche.

**Required.** code:L3123-1 (code L3123-1)

**Retrieved.** code:L3123-1 (code L3123-1), code:L3123-7 (code L3123-7), code:L3123-5 (code L3123-5), code:L3123-4 (code L3123-4), code:L3123-27 (code L3123-27)

**Cited.** code:L3123-1

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute des précisions sur les bases de calcul (hebdomadaire, mensuelle, annuelle) et un chiffre précis (1 607 heures par an) que la référence ne mentionne pas, engageant ainsi le lecteur sur des éléments non présents dans la référence.

**Analyse:**

---

### q030 · general · tier 1

**Question.** Si je dois me déplacer pour aller travailler et que ce trajet dépasse mon temps de trajet habituel, qu'est-ce que mon employeur doit me proposer en contrepartie ?

**Expected.** L'employeur doit proposer une contrepartie soit sous forme de repos, soit sous forme financière.

**Produced.** Selon le code du travail, si votre temps de déplacement professionnel dépasse le temps normal de trajet entre votre domicile et votre lieu habituel de travail, votre employeur doit vous proposer une contrepartie soit sous forme de repos, soit sous forme financière. Les modalités précises de cette contrepartie doivent être définies par une convention ou un accord d'entreprise, ou à défaut par une convention ou un accord de branche.

**Required.** code:L3121-4 (code L3121-4)

**Retrieved.** code:L3121-4 (code L3121-4), code:L3121-5 (code L3121-5), code:L3121-7 (code L3121-7), convention:27661894 (convention 4), convention:47006987 (convention 36)

**Cited.** code:L3121-4, code:L3121-7

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition procédurale ("Les modalités précises de cette contrepartie doivent être définies par une convention ou un accord d'entreprise, ou à défaut par une convention ou un accord de branche") que la référence ne mentionne pas, engageant ainsi le lecteur sur des étapes supplémentaires non présentes dans la référence.

**Analyse:**

---

### q031 · general · tier 1

**Question.** Si un salarié ne peut pas travailler parce qu'un jour férié tombe pendant sa semaine de travail, est-ce qu'il perd de l'argent sur son salaire ?

**Expected.** Non, à condition qu'il ait au moins trois mois d'ancienneté dans l'entreprise. Le chômage des jours fériés ne peut entraîner aucune perte de salaire pour les salariés ayant cette ancienneté.

**Produced.** Non, un salarié ayant au moins trois mois d'ancienneté ne perd pas de salaire si un jour férié tombe pendant sa semaine de travail, car le chômage des jours fériés ne peut entraîner aucune perte de salaire. De plus, les heures de travail perdues du fait du chômage des jours fériés ne donnent pas lieu à récupération.

**Required.** code:L3133-3 (code L3133-3)

**Retrieved.** code:L3133-3 (code L3133-3), code:L3133-2 (code L3133-2), code:L3133-4 (code L3133-4), convention:47348462 (convention 2), code:L3133-3-1 (code L3133-3-1)

**Cited.** code:L3133-3, code:L3133-2

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une information sur la récupération des heures ("les heures de travail perdues du fait du chômage des jours fériés ne donnent pas lieu à récupération") que la référence ne mentionne pas, ce qui engage le lecteur sur un point non couvert par la référence.

**Analyse:**

---

### q037 · general · tier 1

**Question.** Combien de fois maximum un contrat à durée déterminée peut-il être prolongé, si rien n'est prévu dans la convention collective ?

**Expected.** Le contrat peut être renouvelé deux fois. La durée totale du contrat initial plus les renouvellements ne peut pas dépasser la durée maximale fixée par la convention collective ou, à défaut, par la loi.

**Produced.** À défaut de stipulation dans la convention collective, un contrat à durée déterminée est renouvelable deux fois au maximum. La durée totale du contrat, y compris les renouvellements, ne peut excéder dix-huit mois (ou vingt-quatre mois dans certains cas spécifiques).

**Required.** code:L1243-13-1 (code L1243-13-1)

**Retrieved.** code:L1243-13-1 (code L1243-13-1), code:L1243-13 (code L1243-13), code:L1242-8-1 (code L1242-8-1), code:D1242-7 (code D1242-7), code:L1242-8-2 (code L1242-8-2)

**Cited.** code:L1243-13-1, code:L1242-8-1

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute des durées maximales précises (dix-huit mois, vingt-quatre mois) que la référence ne mentionne pas, engageant ainsi le lecteur sur des chiffres qui ne figurent pas dans la réponse de référence.

**Analyse:**

---

### q038 · general · tier 1

**Question.** Combien de temps minimum doit s'écouler entre deux réunions du comité social et économique lors d'une procédure de licenciement collectif ?

**Expected.** Au moins quinze jours doivent séparer les deux réunions du comité social et économique.

**Produced.** Le délai minimum entre deux réunions du comité social et économique dépend de la taille de l'entreprise : quinze jours pour les entreprises d'au moins cinquante salariés, et quatorze jours pour celles employant moins de cinquante salariés.

**Required.** code:L1233-30 (code L1233-30)

**Retrieved.** code:L1233-30 (code L1233-30), code:L1233-8 (code L1233-8), code:L1233-29 (code L1233-29), code:L1235-7 (code L1235-7), code:L1233-28 (code L1233-28)

**Cited.** code:L1233-30, code:L1233-29

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une distinction selon la taille de l'entreprise (cinquante salariés) et mentionne un délai de quatorze jours que la référence ne contient pas, alors que celle-ci affirme simplement "au moins quinze jours" sans condition.

**Analyse:**

---

### q041 · general · tier 2

**Question.** Quand un établissement va fermer, quelles sont les principales obligations de l'employeur pour trouver quelqu'un qui pourrait le reprendre ?

**Expected.** L'employeur doit informer les repreneurs potentiels de son intention de céder l'établissement, réaliser rapidement un document de présentation, donner accès aux informations nécessaires aux candidats à la reprise, examiner les offres reçues et apporter une réponse motivée à chacune d'elles. Il doit aussi, le cas échéant, engager la réalisation d'un bilan environnemental.

**Produced.** L'employeur doit : (1) informer les repreneurs potentiels de son intention de céder l'établissement et réaliser un document de présentation ; (2) donner accès aux informations nécessaires aux candidats à la reprise ; (3) examiner les offres reçues et apporter une réponse motivée à chacune dans les délais prévus ; (4) consulter le comité social et économique sur toute offre à laquelle il souhaite donner suite.

**Required.** code:L1233-57-14 (code L1233-57-14)

**Retrieved.** code:L1233-57-14 (code L1233-57-14), code:L1233-57-10 (code L1233-57-10), code:L1233-57-21 (code L1233-57-21), code:L1233-57-20 (code L1233-57-20), code:L1233-57-19 (code L1233-57-19)

**Cited.** code:L1233-57-14, code:L1233-57-19

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une obligation de consultation du comité social et économique sur les offres que la référence ne mentionne pas, et ajoute une condition de délais ("dans les délais prévus") absente de la référence.

**Analyse:**

---

### q042 · general · tier 1

**Question.** Si l'entreprise n'a pas d'accord collectif sur les temps d'habillage et de déshabillage, qu'est-ce que l'employeur doit faire ?

**Expected.** Le contrat de travail doit prévoir soit d'accorder des contreparties pour ces temps, soit de les considérer comme du temps de travail effectif.

**Produced.** À défaut d'accord collectif, le contrat de travail doit prévoir soit d'accorder des contreparties aux temps d'habillage et de déshabillage, soit d'assimiler ces temps à du temps de travail effectif. Si aucun accord n'existe, l'employeur doit également consulter le comité social et économique pour déterminer les contreparties.

**Required.** code:L3121-8 (code L3121-8)

**Retrieved.** code:L3121-7 (code L3121-7), code:L3121-8 (code L3121-8), code:L3121-3 (code L3121-3), code:L3123-26 (code L3123-26), convention:29264476 (convention KALIARTI000029264476)

**Cited.** code:L3121-8, code:L3121-3

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une obligation de consultation du comité social et économique que la référence ne mentionne pas, ce qui constitue une étape de procédure supplémentaire non prévue par la référence.

**Analyse:**

---

### q043 · general · tier 1

**Question.** Dans une petite entreprise sans représentants du personnel qui doit mettre en place un plan de sauvegarde de l'emploi, à qui faut-il communiquer ce plan en même temps que la notification du projet de licenciement ?

**Expected.** Le plan doit être communiqué à l'autorité administrative en même temps que la notification du projet de licenciement.

**Produced.** Dans une petite entreprise sans représentants du personnel, le plan de sauvegarde de l'emploi doit être communiqué à l'autorité administrative (directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi) en même temps que la notification du projet de licenciement, et porté à la connaissance des salariés par affichage sur les lieux de travail.

**Required.** code:L1233-49 (code L1233-49)

**Retrieved.** code:L1233-49 (code L1233-49), code:R1233-9 (code R1233-9), code:L1233-32 (code L1233-32), code:L1233-57 (code L1233-57), code:L1233-53 (code L1233-53)

**Cited.** code:L1233-49, code:R1233-9, code:L1233-57

**recall@5** 1.00 · **citation F1** 0.50

**Judge.** La candidate ajoute une obligation (porter à la connaissance des salariés par affichage) que la référence ne mentionne pas, engageant ainsi le lecteur sur une exigence supplémentaire non présente dans la réponse de référence.

**Analyse:**

---

### q044 · general · tier 1

**Question.** Quand on calcule combien d'emplois ont vraiment disparu lors d'un licenciement collectif, qu'est-ce qu'on déduit du nombre initial de salariés licenciés ?

**Expected.** On déduit le nombre de salariés dont le reclassement dans l'entreprise ou dans le groupe auquel elle appartient est acquis sur les bassins d'emploi affectés par le licenciement collectif, à l'issue de la procédure de consultation des représentants du personnel.

**Produced.** On déduit du nombre initial de salariés licenciés le nombre de salariés dont le reclassement dans l'entreprise ou dans le groupe est acquis, ainsi que le nombre d'emplois pourvus en remplacement sur le même poste de travail. Le nombre d'emplois supprimés est donc égal au nombre de licenciements envisagés moins ces deux catégories de salariés.

**Required.** code:D1233-43 (code D1233-43)

**Retrieved.** code:D1233-43 (code D1233-43), code:D1233-48-2 (code D1233-48-2), code:L1233-87 (code L1233-87), code:D1233-45 (code D1233-45), code:L1233-84 (code L1233-84)

**Cited.** code:D1233-43, code:D1233-48-2

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition non mentionnée dans la référence ("le nombre d'emplois pourvus en remplacement sur le même poste de travail") qui constitue une deuxième catégorie de déduction que la référence ne prévoit pas.

**Analyse:**

---

### q047 · general · tier 2

**Question.** Si je suis actuellement à temps partiel et que je veux passer à temps complet, ou inversement, quels droits ai-je pour accéder à un poste disponible dans mon entreprise ?

**Expected.** Vous avez priorité pour l'attribution d'un emploi dans votre catégorie professionnelle ou un emploi équivalent dans le même établissement ou, à défaut, dans la même entreprise. L'employeur doit vous informer des emplois disponibles correspondants.

**Produced.** Vous avez priorité pour l'attribution d'un emploi ressortissant à votre catégorie professionnelle ou d'un emploi équivalent dans le même établissement ou, à défaut, dans la même entreprise, et l'employeur doit vous porter à connaissance la liste des emplois disponibles correspondants. Les modalités précises de cette transition (délais de réponse, procédure) doivent être définies par une convention ou un accord collectif d'entreprise ou de branche.

**Required.** code:L3123-3 (code L3123-3)

**Retrieved.** code:L3123-3 (code L3123-3), code:L3123-25 (code L3123-25), code:L3123-5 (code L3123-5), code:L3123-18 (code L3123-18), code:L3123-17 (code L3123-17)

**Cited.** code:L3123-3, code:L3123-17

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition procédurale ("Les modalités précises de cette transition (délais de réponse, procédure) doivent être définies par une convention ou un accord collectif") que la référence ne mentionne pas, engageant ainsi le lecteur sur des étapes supplémentaires non présentes dans la réponse de référence.

**Analyse:**

---

### q051 · general · tier 1

**Question.** Quel délai l'administration a-t-elle pour notifier à l'employeur sa décision concernant la validation d'un accord de rupture collective ?

**Expected.** L'autorité administrative dispose d'un délai de quinze jours à compter de la réception de l'accord collectif pour notifier sa décision de validation à l'employeur.

**Produced.** L'autorité administrative notifie à l'employeur la décision de validation dans un délai de quinze jours à compter de la réception de l'accord collectif. Le silence gardé par l'autorité administrative à l'issue de ce délai vaut décision d'acceptation de validation.

**Required.** code:L1237-19-4 (code L1237-19-4)

**Retrieved.** code:L1237-19-4 (code L1237-19-4), code:L1233-57-4 (code L1233-57-4), code:D1237-9 (code D1237-9), code:D1233-14-2 (code D1233-14-2), code:L1237-19 (code L1237-19)

**Cited.** code:L1237-19-4, code:D1237-9

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition sur les conséquences du silence de l'administration que la référence ne mentionne pas, engageant ainsi le lecteur sur un élément procédural supplémentaire.

**Analyse:**

---

### q054 · general · tier 1

**Question.** Combien de temps avant de commencer un congé de présence parentale dois-je prévenir mon employeur ?

**Expected.** Le salarié doit informer l'employeur de sa volonté de bénéficier du congé de présence parentale au moins quinze jours avant le début du congé.

**Produced.** Vous devez informer votre employeur au moins quinze jours avant le début du congé de présence parentale. Cependant, en cas de dégradation soudaine de l'état de santé de l'enfant ou de situation de crise nécessitant une présence sans délai, vous pouvez bénéficier de ce congé immédiatement.

**Required.** code:L1225-63 (code L1225-63)

**Retrieved.** code:L1225-63 (code L1225-63), code:R1225-14 (code R1225-14), code:L1225-50 (code L1225-50), code:L1225-51 (code L1225-51), code:D1225-8 (code D1225-8)

**Cited.** code:L1225-63, code:R1225-14

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une exception ("en cas de dégradation soudaine... immédiatement") que la référence ne mentionne pas, créant ainsi une condition supplémentaire qui engage le lecteur au-delà de ce qu'affirme la référence.

**Analyse:**

---

### q055 · general · tier 1

**Question.** Un collègue dont l'enfant vient de décéder souhaite bénéficier de jours de repos donnés par d'autres salariés. Jusqu'à quel âge l'enfant décédé doit-il avoir eu pour que ce mécanisme s'applique ?

**Expected.** L'enfant décédé doit être âgé de moins de vingt-cinq ans au moment du décès.

**Produced.** Selon le code du travail, l'enfant décédé doit être âgé de moins de vingt-cinq ans pour que le mécanisme de cession de jours de repos s'applique. Cette possibilité s'étend également aux personnes âgées de moins de vingt-cinq ans à la charge effective et permanente du salarié, et la renonciation peut intervenir au cours de l'année suivant le décès.

**Required.** code:L1225-65-1 (code L1225-65-1)

**Retrieved.** code:L1225-65-1 (code L1225-65-1), convention:47513860 (convention 5.7), code:L1225-4-2 (code L1225-4-2), code:D1225-16 (code D1225-16), code:L1225-61 (code L1225-61)

**Cited.** code:L1225-65-1

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute des conditions et précisions (personnes à charge, délai d'un an) que la référence ne mentionne pas, ce qui engage le lecteur au-delà de ce qui est demandé.

**Analyse:**

---

### q058 · general · tier 1

**Question.** Que doit faire un salarié avant de saisir le juge si son employeur ne lui a pas remis les documents écrits sur les conditions de son travail ?

**Expected.** Le salarié doit d'abord mettre en demeure son employeur de lui communiquer les documents requis ou de compléter les documents remis, avant de pouvoir saisir le juge.

**Produced.** Le salarié doit d'abord mettre en demeure son employeur de lui communiquer les documents requis ou de les compléter, puis attendre sept jours calendaires après la réception de cette mise en demeure avant de pouvoir saisir la juridiction prud'homale si l'employeur n'a pas transmis les informations.

**Required.** code:L1221-5-1 (code L1221-5-1)

**Retrieved.** code:L1221-5-1 (code L1221-5-1), code:R1221-41 (code R1221-41), code:R1221-9 (code R1221-9), code:L1237-1-1 (code L1237-1-1), code:R1221-34 (code R1221-34)

**Cited.** code:L1221-5-1, code:R1221-41

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition de délai ("attendre sept jours calendaires après la réception") que la référence ne mentionne pas, ce qui constitue une étape de procédure supplémentaire non présente dans la référence.

**Analyse:**

---

### q061 · override · tier 1

**Question.** Un enquêteur peut-il refuser une enquête qui lui est proposée par son employeur s'il a signé un contrat avec une rémunération annuelle garantie ?

**Expected.** Oui, l'enquêteur conserve la faculté d'accepter ou de refuser chacune des enquêtes qui lui sont proposées, sous réserve des dispositions prévues aux articles 5 et 25.

**Produced.** Oui, un enquêteur ayant signé un contrat avec rémunération annuelle garantie (chargé d'enquête intermittent à garantie annuelle) peut refuser une enquête proposée, mais il doit notifier son refus avant la date d'exécution des tâches prévues, faute de quoi il est présumé avoir accepté. Toutefois, si l'enquête ne permet pas le respect du délai de prévenance de trois jours ouvrables, le refus ne constitue pas un refus de travail et n'a aucune conséquence sur la relation contractuelle.

**Required.** convention:5851296 (convention 1)

**Retrieved.** convention:5851296 (convention 1), convention:5851305 (convention 9), convention:47652063 (convention 65), convention:5851347 (convention 46), convention:47652012 (convention 3)

**Cited.** convention:5851305, convention:47652012

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate ajoute des conditions et délais de notification (notification avant la date d'exécution, présomption d'acceptation, délai de prévenance de trois jours) que la référence ne mentionne pas, alors que celle-ci énonce simplement la faculté de refuser sous réserve des articles 5 et 25.

**Analyse:**

---

### q063 · override · tier 1

**Question.** Quel délai a un enquêteur vacataire pour prévenir son employeur s'il ne peut pas travailler ?

**Expected.** L'enquêteur vacataire doit avertir son employeur dès que possible et au plus tard dans les 24 heures du motif et de la durée probable de son indisponibilité.

**Produced.** L'enquêteur vacataire doit avertir son employeur du motif et de la durée probable de son indisponibilité dès que possible, et au plus tard dans les 24 heures. Cet avis doit être confirmé par un certificat médical dans un délai maximal de 48 heures à compter du premier jour de l'indisponibilité.

**Required.** convention:5851360 (convention 57)

**Retrieved.** convention:5851360 (convention 57), convention:5851328 (convention 30), convention:5851352 (convention 49), convention:5851347 (convention 46), convention:47652012 (convention 3)

**Cited.** convention:5851360

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une obligation de certificat médical dans un délai de 48 heures que la référence ne mentionne pas, ce qui constitue une condition supplémentaire engageant le lecteur au-delà de ce qu'affirme la référence.

**Analyse:**

---

### q066 · override · tier 1

**Question.** À quelle fréquence la commission paritaire de suivi se réunit-elle pour faire le point sur l'application de l'accord ?

**Expected.** La commission se réunit une fois par an afin d'établir un bilan de l'application de l'accord.

**Produced.** La fréquence de réunion varie selon les accords : une commission se réunit une fois par an [convention:5851692], une autre six mois puis douze mois après l'entrée en vigueur, puis au terme de l'accord [convention:48150743], et une troisième au moins une fois par trimestre [convention:49300403].

**Required.** convention:5851692 (convention KALIARTI000005851692)

**Retrieved.** convention:5851692 (convention KALIARTI000005851692), convention:44185981 (convention KALIARTI000044185981), convention:48150743 (convention 7), convention:49300403 (convention 4.6), convention:20137458 (convention 6)

**Cited.** convention:5851692, convention:48150743, convention:49300403

**recall@5** 1.00 · **citation F1** 0.50

**Judge.** La candidate refuse de répondre à la question posée en listant plusieurs fréquences différentes issues d'accords distincts, alors que la référence donne une réponse claire et précise (une fois par an) pour l'accord concerné par la question.

**Analyse:**

---

### q072 · override · tier 1

**Question.** Si un salarié décède et laisse deux enfants à charge, l'un ayant 16 ans et l'autre 20 ans, quel pourcentage du salaire de référence sera versé pour chacun d'eux ?

**Expected.** Pour l'enfant de 16 ans : 12 % du salaire de référence jusqu'au 18e anniversaire. Pour l'enfant de 20 ans : 15 % du salaire de référence jusqu'au 26e anniversaire.

**Produced.** Pour l'enfant de 16 ans : 12 % du salaire de référence. Pour l'enfant de 20 ans : 15 % du salaire de référence (à condition qu'il soit en apprentissage, en études, inscrit à l'ANPE ou en stage, ou invalide avant 21 ans).

**Required.** convention:20851801 (convention 2)

**Retrieved.** convention:20888386 (convention 5), convention:20851801 (convention 2), convention:20888383 (convention 3), convention:21291205 (convention 1), code:L1235-3#table-1 (code L1235-3)

**Cited.** convention:20888386

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate ajoute des conditions (apprentissage, études, inscription ANPE, stage, invalidité) pour l'enfant de 20 ans que la référence ne mentionne pas, et omet les limites d'âge (18e et 26e anniversaire) précisées dans la référence.

**Analyse:**

---

### q075 · override · tier 1

**Question.** Quel est le montant de la valeur du point pour un ingénieur classé en position 2.2 selon la nouvelle grille de rémunération ?

**Expected.** La valeur du point est fixée à 19,81 € bruts pour les ingénieurs et cadres classés en position 2.2.

**Produced.** Selon la nouvelle grille de rémunération la plus récente, la valeur du point pour un ingénieur classé en position 2.2 est de 20,21 € bruts, ce qui correspond à un salaire minimal brut de 2 627,30 €.

**Required.** convention:25167921 (convention 1er)

**Retrieved.** convention:23105065#table-1 (convention 1er), convention:19861271#table-1 (convention 1), convention:25167921 (convention 1er), convention:27757150 (convention 1er), convention:27757150#table-1 (convention 1er)

**Cited.** convention:27757150#table-1

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate indique 20,21 € alors que la référence précise 19,81 €, soit un montant différent.

**Analyse:**

---

### q078 · override · tier 2

**Question.** Que doit faire l'employeur avant de mettre en place du chômage partiel pour ses salariés ?

**Expected.** L'employeur doit donner des informations détaillées aux institutions représentatives du personnel pour consultation, conformément aux dispositions légales et réglementaires. En l'absence de représentants du personnel, il doit informer directement les salariés du projet.

**Produced.** Avant de mettre en place du chômage partiel, l'employeur doit consulter les institutions représentatives du personnel (comité d'entreprise, délégation unique du personnel ou délégués du personnel s'ils existent), et en l'absence de représentants, informer directement les salariés du projet. Il doit également consulter le CHSCT si des mesures affectent les conditions de travail.

**Required.** convention:28465388 (convention 2.1.1)

**Retrieved.** convention:28465388 (convention 2.1.1), convention:5851645 (convention 2), convention:28465390 (convention 2.2), code:L3123-17 (code L3123-17), convention:28465386 (convention 2)

**Cited.** convention:28465388, convention:28465390

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition non mentionnée dans la référence (consultation du CHSCT si des mesures affectent les conditions de travail), ce qui constitue un ajout d'étape procédurale que la référence ne mentionne pas.

**Analyse:**

---

### q083 · override · tier 2

**Question.** Un salarié en CDI peut-il refuser de s'inscrire à la complémentaire santé de l'entreprise s'il a déjà une assurance individuelle personnelle ?

**Expected.** Oui, si l'acte mettant en place les garanties le prévoit. Un salarié couvert par une assurance individuelle de frais de santé au moment de la mise en place des garanties ou de son embauche peut être dispensé d'adhésion, mais cette dispense ne joue que jusqu'à l'échéance de son contrat individuel.

**Produced.** Non, un salarié en CDI ne peut pas refuser de s'inscrire à la complémentaire santé obligatoire de l'entreprise simplement parce qu'il dispose d'une assurance individuelle personnelle. Cependant, selon l'extrait [convention:31964509], une dispense est possible si le salarié justifie d'une assurance individuelle de frais de santé au moment de la mise en place des garanties ou de l'embauche, mais cette dispense ne joue que jusqu'à l'échéance du contrat individuel.

**Required.** convention:31964509 (convention 1.1.2)

**Retrieved.** convention:31964509 (convention 1.1.2), convention:32730106 (convention 3.3), convention:44040191 (convention 3.3), convention:31964541 (convention 4), convention:32730102 (convention 3.1)

**Cited.** convention:31964509

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate commence par affirmer "Non, un salarié ne peut pas refuser" alors que la référence répond clairement "Oui" avec une condition. Cette contradiction initiale induit le lecteur en erreur, même si la suite rétablit partiellement l'information correcte.

**Analyse:**

---

### q086 · override · tier 2

**Question.** Quels sont les principaux types de modalités de formation que les entreprises de la branche sont encouragées à mettre en place pour développer les compétences de leurs salariés ?

**Expected.** Les entreprises sont incitées à mettre en œuvre des modalités d'apprentissage rapides, adaptées et souples comme la formation en situation de travail ou la formation à distance, ainsi que des parcours innovants combinant des séquences collectives en présentiel, des séquences en distanciel (E-learning, MOOC, SPOC), des séquences d'accompagnement individualisé (mentoring, compagnonnage) et des séquences en situation de travail.

**Produced.** Selon la convention, les entreprises sont encouragées à mettre en place des modalités d'apprentissage rapides et souples comme la formation en situation de travail et la formation à distance, ainsi que des parcours innovants combinant des séquences collectives en présentiel, des séquences en distanciel (E-learning, MOOC, SPOC), des séquences d'accompagnement individualisé (mentoring, compagnonnage) et des séquences en situation de travail. Le plan de développement des compétences peut également inclure des bilans de compétences, des actions de validation des acquis de l'expérience et des forma

**Required.** convention:41549538 (convention KALIARTI000041549538)

**Retrieved.** convention:41549538 (convention KALIARTI000041549538), convention:41549531 (convention 5), convention:42085814 (convention 2), convention:41549539 (convention 10), convention:41549511 (convention KALIARTI000041549511)

**Cited.** convention:41549538, convention:41549539

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute des éléments non mentionnés dans la référence (bilans de compétences, actions de validation des acquis de l'expérience, formations par alternance) qui engagent le lecteur au-delà de ce que la référence affirme.

**Analyse:**

---

### q089 · override · tier 1

**Question.** Quel type de signature doit être utilisé pour signer cet accord, et quelles normes doit-il respecter ?

**Expected.** La signature doit être électronique et répondre aux exigences du règlement européen n° 910-2014 du 23 juillet 2014 et de l'article 1367 du code civil.

**Produced.** Selon les extraits fournis, la signature doit être électronique et doit répondre aux exigences du règlement européen n° 910-2014 du 23 juillet 2014 et de l'article 1367 du code civil. Un dispositif de signature électronique conforme à ces normes doit être mis en place par la partie la plus diligente.

**Required.** convention:42668890 (convention 12)

**Retrieved.** convention:44159330 (convention 9), convention:42668890 (convention 12), convention:27931653 (convention KALIARTI000027931653), convention:42258118 (convention 7), convention:47007030 (convention 8)

**Cited.** convention:44159330, convention:42668890, convention:42258118, convention:47007030

**recall@5** 1.00 · **citation F1** 0.40

**Judge.** La candidate ajoute une condition procédurale ("Un dispositif de signature électronique conforme à ces normes doit être mis en place par la partie la plus diligente") que la référence ne mentionne pas.

**Analyse:**

---

### q091 · override · tier 1

**Question.** Quel pourcentage de la masse salariale les entreprises du secteur doivent-elles verser chaque année pour financer l'ADESATT et le paritarisme ?

**Expected.** Les entreprises doivent verser une contribution annuelle égale à 0,2 ‰ (soit 0,02 %) de la masse salariale brute.

**Produced.** Les entreprises relevant de la convention collective nationale des bureaux d'études techniques, cabinets d'ingénieurs-conseils, sociétés de conseil doivent verser une contribution annuelle égale à 0,2 ‰ (deux dixièmes de millième) de la masse salariale brute au 31 décembre de l'exercice de l'année précédente déclarée dans la DSN au cours de l'année considérée.

**Required.** convention:44159308 (convention 3.5)

**Retrieved.** convention:44159308 (convention 3.5), convention:44185973 (convention 3), convention:44159317 (convention 3.8), convention:44185965 (convention 2), convention:44159301 (convention 3.3)

**Cited.** convention:44185973, convention:44159308

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition temporelle et procédurale ("au 31 décembre de l'exercice de l'année précédente déclarée dans la DSN au cours de l'année considérée") que la référence ne mentionne pas, engageant ainsi le lecteur sur des modalités de calcul non présentes dans la référence.

**Analyse:**

---

### q100 · override · tier 1

**Question.** Quel délai l'employeur a-t-il pour recevoir un salarié qui a signalé par écrit des difficultés concernant son organisation du travail ou sa charge de travail ?

**Expected.** L'employeur ou son représentant doit recevoir le salarié dans les 8 jours suivant son alerte écrite.

**Produced.** L'employeur doit recevoir le salarié dans les 8 jours suivant l'émission de son alerte écrite concernant des difficultés d'organisation ou de charge de travail. À l'issue de cette entrevue, l'employeur doit formuler par écrit les mesures qui seront mises en place pour traiter la situation.

**Required.** convention:47348428 (convention 2.4)

**Retrieved.** convention:47348428 (convention 2.4), convention:27661888 (convention 3.1), convention:49764140 (convention 4.8), convention:29264470 (convention KALIARTI000029264470), code:R1221-41 (code R1221-41)

**Cited.** convention:49764140, convention:27661888, convention:47348428

**recall@5** 1.00 · **citation F1** 0.50

**Judge.** La candidate ajoute une obligation ("À l'issue de cette entrevue, l'employeur doit formuler par écrit les mesures qui seront mises en place") que la référence ne mentionne pas.

**Analyse:**

---

### q101 · override · tier 1

**Question.** Dans notre cabinet d'ingénieurs-conseils, un ingénieur au coefficient 150 vient d'être embauché. Quelle est la durée maximale avant que son embauche soit définitive, et peut-on la prolonger ?

**Expected.** La période d'essai est de 4 mois maximum et peut être renouvelée pour une durée de 4 mois maximum, soit 8 mois au total.

**Produced.** La période d'essai pour un ingénieur au coefficient 150 est de 4 mois maximum et peut être renouvelée pour une durée de 4 mois maximum, soit une durée totale maximale de 8 mois. Le renouvellement est exceptionnel et doit faire l'objet d'un accord écrit du salarié et de l'employeur.

**Required.** convention:47513825 (convention 3.4)

**Retrieved.** convention:46033577 (convention 2), convention:47513825 (convention 3.4), convention:23733160#table-1 (convention KALIARTI000023733160), code:L1221-19 (code L1221-19), convention:47513825#table-1 (convention 3.4)

**Cited.** convention:47513825, convention:23733160#table-1

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute des conditions non mentionnées dans la référence (caractère "exceptionnel" du renouvellement et nécessité d'un "accord écrit du salarié et de l'employeur"), ce qui engage le lecteur au-delà de ce qu'affirme la référence.

**Analyse:**

---

### q104 · override · tier 1

**Question.** Combien de temps dure le bilan de compétences auquel un salarié a droit selon cet accord ?

**Expected.** Le bilan de compétences dure vingt-quatre heures.

**Produced.** Selon la convention collective citée, le bilan de compétences dure vingt-quatre heures, dans les conditions de l'article L. 6313-4 du code du travail.

**Required.** convention:48150734 (convention 3)

**Retrieved.** convention:48150734 (convention 3), code:L1243-9 (code L1243-9), code:L1225-58 (code L1225-58), code:L1225-56 (code L1225-56), convention:28465401 (convention 4)

**Cited.** convention:48150734

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition "dans les conditions de l'article L. 6313-4 du code du travail" que la référence ne mentionne pas, ce qui engage le lecteur vers des conditions supplémentaires non présentes dans la référence.

**Analyse:**

---

### q105 · override · tier 1

**Question.** À partir de quand les nouvelles cotisations de complémentaire santé s'appliqueront-elles dans cette branche ?

**Expected.** Les nouvelles cotisations s'appliqueront à effet du 1er juillet 2024.

**Produced.** Les nouvelles cotisations de complémentaire santé s'appliqueront à compter du 1er avril 2025 dans la branche des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils (IDCC 1486).

**Required.** convention:49300385 (convention KALIARTI000049300385)

**Retrieved.** convention:51447102 (convention KALIARTI000051447102), convention:47551148 (convention KALIARTI000047551148), convention:51537726 (convention KALIARTI000051537726), convention:49300385 (convention KALIARTI000049300385), convention:43145712 (convention 3)

**Cited.** convention:51537726, convention:51447102

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate indique une date d'application du 1er avril 2025 alors que la référence précise le 1er juillet 2024, ce qui constitue une contradiction factuelle sur un élément central.

**Analyse:**

---

### q109 · dated · tier 1

**Question.** Si un salarié change d'avis et ne veut plus travailler le dimanche, combien de temps faut-il attendre avant que son refus devienne effectif ?

**Expected.** Le refus du salarié prend effet trois mois après sa notification écrite à l'employeur.

**Produced.** Selon le code du travail, si un salarié qui travaille le dimanche change d'avis et souhaite ne plus le faire, son refus prend effet trois mois après sa notification écrite à l'employeur. Ce délai s'applique à défaut d'accord collectif applicable qui pourrait prévoir des modalités différentes.

**Required.** code:L3132-25-4 (code L3132-25-4)

**Retrieved.** code:L3132-25-4 (code L3132-25-4), code:L3132-3-1 (code L3132-3-1), code:L3132-3 (code L3132-3), code:L3123-11 (code L3123-11), convention:5851753 (convention 3)

**Cited.** code:L3132-25-4

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition ("à défaut d'accord collectif applicable qui pourrait prévoir des modalités différentes") que la référence ne mentionne pas, ce qui constitue un ajout de réserve non présent dans la réponse de référence.

**Analyse:**

---

### q112 · dated · tier 1

**Question.** Si je dois me déplacer pour aller travailler et que ce trajet dépasse mon temps de trajet habituel, qu'est-ce que mon employeur doit me proposer en contrepartie ?

**Expected.** L'employeur doit proposer une contrepartie soit sous forme de repos, soit sous forme financière.

**Produced.** Selon le code du travail, si votre temps de déplacement professionnel dépasse le temps normal de trajet entre votre domicile et votre lieu habituel de travail, votre employeur doit vous proposer une contrepartie soit sous forme de repos, soit sous forme financière. Les modalités précises de cette contrepartie doivent être définies par une convention ou un accord d'entreprise, ou à défaut par une convention ou un accord de branche.

**Required.** code:L3121-4 (code L3121-4)

**Retrieved.** code:L3121-4 (code L3121-4), code:L3121-5 (code L3121-5), code:L3121-7 (code L3121-7), convention:27661894 (convention 4), convention:47006987 (convention 36)

**Cited.** code:L3121-4, code:L3121-7

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition procédurale ("Les modalités précises de cette contrepartie doivent être définies par une convention ou un accord d'entreprise, ou à défaut par une convention ou un accord de branche") que la référence ne mentionne pas, engageant ainsi le lecteur sur des étapes supplémentaires non présentes dans la référence.

**Analyse:**

---

### q113 · dated · tier 1

**Question.** Si je crée ma propre entreprise en tant que salarié, pendant combien de temps mon employeur ne peut-il pas m'imposer une clause d'exclusivité ?

**Expected.** L'employeur ne peut opposer aucune clause d'exclusivité pendant une durée d'un an au salarié qui crée ou reprend une entreprise, même s'il existe une stipulation contractuelle contraire.

**Produced.** Pendant une durée d'un an, l'employeur ne peut opposer aucune clause d'exclusivité au salarié qui crée ou reprend une entreprise. Ce délai d'un an court à compter soit de l'inscription au registre du commerce et des sociétés ou au répertoire des métiers, soit de la déclaration de début d'activité professionnelle agricole ou indépendante.

**Required.** code:L1222-5 (code L1222-5)

**Retrieved.** code:L1222-5 (code L1222-5), code:D1222-1 (code D1222-1), convention:28465407 (convention 8), convention:18659221 (convention KALIARTI000018659221), code:L1231-1 (code L1231-1)

**Cited.** code:L1222-5, code:D1222-1

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une précision sur le point de départ du délai d'un an (inscription au registre, déclaration de début d'activité) que la référence ne mentionne pas, engageant ainsi le lecteur sur une condition supplémentaire.

**Analyse:**

---

### q114 · dated · tier 2

**Question.** Un salarié qui travaille depuis 5 ans dans l'entreprise conclut un accord de conciliation avec son employeur. Combien de mois de salaire lui sont dus au minimum selon le barème légal ?

**Expected.** 7 mois de salaire : 3 mois de base pour une ancienneté d'au moins un an, plus 4 mois supplémentaires (un mois par année au-delà de la première année, jusqu'à 8 ans d'ancienneté).

**Produced.** Selon le barème légal défini à l'article D1235-21, un salarié ayant 5 ans d'ancienneté révolus reçoit un minimum de 1,5 mois de salaire en cas d'accord de conciliation. Ce montant correspond à la table de l'article L1235-3 qui s'applique aux accords de conciliation.

**Required.** code:D1235-21 (code D1235-21)

**Retrieved.** code:D1235-21 (code D1235-21), code:L1235-3#table-2 (code L1235-3), code:L1235-3#table-1 (code L1235-3), code:L1235-1 (code L1235-1), convention:5851325 (convention 27)

**Cited.** code:L1235-3#table-2

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate indique 1,5 mois de salaire alors que la référence établit clairement 7 mois de salaire pour 5 ans d'ancienneté (3 mois de base + 4 mois supplémentaires).

**Analyse:**

---

### q115 · dated · tier 1

**Question.** Combien de temps minimum doit s'écouler entre deux réunions du comité social et économique lors d'une procédure de licenciement collectif ?

**Expected.** Au moins quinze jours doivent séparer les deux réunions du comité social et économique.

**Produced.** Le délai minimum entre deux réunions du comité social et économique dépend de la taille de l'entreprise : quinze jours pour les entreprises d'au moins cinquante salariés, et quatorze jours pour celles employant moins de cinquante salariés.

**Required.** code:L1233-30 (code L1233-30)

**Retrieved.** code:L1233-30 (code L1233-30), code:L1233-8 (code L1233-8), code:L1233-29 (code L1233-29), code:L1235-7 (code L1235-7), code:L1233-28 (code L1233-28)

**Cited.** code:L1233-30, code:L1233-29

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une distinction selon la taille de l'entreprise (cinquante salariés) et mentionne un délai de quatorze jours que la référence ne contient pas, alors que celle-ci affirme simplement "au moins quinze jours" sans condition.

**Analyse:**

---

### q116 · dated · tier 1

**Question.** Quand on calcule l'indemnité de licenciement, sur quelle période regarde-t-on généralement le salaire du salarié ?

**Expected.** On regarde soit la moyenne mensuelle des douze derniers mois précédant le licenciement (ou tous les mois de service si le salarié a travaillé moins d'un an), soit le tiers des trois derniers mois, en choisissant la formule la plus avantageuse pour le salarié.

**Produced.** Selon le code du travail, on regarde généralement les **douze derniers mois précédant le licenciement** (ou la moyenne de tous les mois de service si l'ancienneté est inférieure à douze mois), ou alternativement les trois derniers mois selon la formule la plus avantageuse pour le salarié.

**Required.** code:R1234-4 (code R1234-4)

**Retrieved.** code:R1234-4 (code R1234-4), code:L1235-3-1 (code L1235-3-1), code:R1234-2 (code R1234-2), convention:5851322 (convention 24), convention:47513839 (convention 4.5)

**Cited.** code:R1234-4

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate omet l'élément central du calcul sur les trois derniers mois : elle ne précise pas qu'il s'agit du "tiers" des trois derniers mois, ce qui change substantiellement le montant du calcul de référence.

**Analyse:**

---

### q117 · dated · tier 1

**Question.** À partir de combien de licenciements économiques dans le même mois l'employeur doit-il informer l'administration ?

**Expected.** À partir de dix salariés licenciés pour motif économique dans une même période de trente jours.

**Produced.** L'employeur doit informer l'administration à partir de **moins de dix salariés** licenciés pour motif économique dans une même période de trente jours (information dans les huit jours). Pour **au moins dix salariés** dans la même période, il doit notifier un projet de licenciement avant la première réunion avec les représentants du personnel.

**Required.** code:L1233-46 (code L1233-46)

**Retrieved.** code:L1233-19 (code L1233-19), code:D1233-3 (code D1233-3), code:L1233-46 (code L1233-46), code:R1238-2 (code R1238-2), code:L1233-60 (code L1233-60)

**Cited.** code:L1233-19, code:D1233-3, code:L1233-46

**recall@5** 1.00 · **citation F1** 0.50

**Judge.** La candidate affirme que l'obligation d'informer l'administration commence à "moins de dix salariés", alors que la référence indique clairement "à partir de dix salariés", ce qui contredit directement le seuil établi par la référence.

**Analyse:**

---

### q118 · dated · tier 1

**Question.** Dans une situation d'urgence exceptionnelle, jusqu'à combien d'heures par semaine un employeur peut-il faire travailler ses salariés, même s'il dépasse normalement la limite légale ?

**Expected.** Soixante heures par semaine maximum, même en cas de circonstances exceptionnelles.

**Produced.** En cas de circonstances exceptionnelles, le dépassement de la durée maximale hebdomadaire peut être autorisé par l'autorité administrative, mais sans que ce dépassement puisse porter la durée du travail à plus de 60 heures par semaine. L'employeur doit présenter immédiatement une demande de régularisation à l'inspecteur du travail avec les justifications nécessaires.

**Required.** code:L3121-21 (code L3121-21)

**Retrieved.** code:L3121-21 (code L3121-21), code:L3121-25 (code L3121-25), code:D3121-6 (code D3121-6), code:L3121-24 (code L3121-24), code:R3122-5 (code R3122-5)

**Cited.** code:L3121-21, code:D3121-6

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute des conditions et procédures (autorisation administrative, demande de régularisation à l'inspecteur du travail) que la référence ne mentionne pas, alors que la référence se limite à indiquer le plafond de 60 heures.

**Analyse:**

---

### q119 · dated · tier 1

**Question.** Pendant la procédure de licenciement collectif, l'administration peut-elle intervenir pour faire des remarques sur la façon dont l'employeur gère le dossier ?

**Expected.** Oui, l'administration peut à tout moment en cours de procédure faire toute observation ou proposition à l'employeur concernant le déroulement de la procédure ou les mesures sociales. Elle envoie simultanément copie de ses observations au comité social et économique et, lorsque la négociation de l'accord visé à l'article L. 1233-24-1 est engagée, le cas échéant aux organisations syndicales représentatives dans l'entreprise.

**Produced.** Oui, l'administration peut intervenir à tout moment en cours de procédure pour faire des observations ou propositions à l'employeur concernant le déroulement de la procédure ou les mesures sociales. L'employeur doit répondre à ces observations et adresser copie de sa réponse aux représentants du personnel et aux organisations syndicales.

**Required.** code:L1233-57-6 (code L1233-57-6)

**Retrieved.** code:L1233-57-6 (code L1233-57-6), code:L1233-56 (code L1233-56), code:L1233-57-3 (code L1233-57-3), code:L1235-7-1 (code L1235-7-1), code:L1235-12 (code L1235-12)

**Cited.** code:L1233-57-6

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une obligation ("L'employeur doit répondre à ces observations et adresser copie de sa réponse") que la référence ne mentionne pas, et omet que c'est l'administration elle-même qui envoie copie de ses observations au CSE et aux organisations syndicales.

**Analyse:**

---

### q120 · dated · tier 1

**Question.** Si mon entreprise veut faire travailler des salariés entre 21h et minuit, qu'est-ce que l'employeur doit obligatoirement prévoir pour les ramener chez eux ?

**Expected.** L'employeur doit mettre à disposition un moyen de transport pris en charge par lui qui permet au salarié de regagner son lieu de résidence.

**Produced.** L'employeur doit mettre à disposition un moyen de transport pris en charge par lui qui permet au salarié de regagner son lieu de résidence. Cependant, cette obligation ne s'applique que si un accord collectif d'entreprise, d'établissement, de branche ou territorial le prévoit.

**Required.** code:L3122-19 (code L3122-19)

**Retrieved.** code:L3122-19 (code L3122-19), code:L3122-4 (code L3122-4), code:L3122-20 (code L3122-20), convention:27661888 (convention 3.1), code:L3122-1 (code L3122-1)

**Cited.** code:L3122-19

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition (existence d'un accord collectif) que la référence ne mentionne pas, ce qui transforme une obligation apparemment générale en une obligation conditionnelle.

**Analyse:**

---

### q121 · dated · tier 1

**Question.** Par quel moyen faut-il soumettre une demande de validation d'accord ou d'homologation de document concernant un plan de sauvegarde de l'emploi auprès de l'administration ?

**Expected.** La demande doit être adressée par voie dématérialisée au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi.

**Produced.** La demande de validation de l'accord ou d'homologation du document doit être adressée au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi par voie dématérialisée. En cas de procédure de sauvegarde, de redressement ou de liquidation judiciaire, la demande doit être envoyée par voie dématérialisée au plus tard le lendemain de la dernière réunion du comité social et économique.

**Required.** code:D1233-14 (code D1233-14)

**Retrieved.** code:D1233-14 (code D1233-14), code:L1233-57-5 (code L1233-57-5), code:L1233-57-1 (code L1233-57-1), code:L1233-57-3 (code L1233-57-3), code:D1233-14-3 (code D1233-14-3)

**Cited.** code:D1233-14

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute une condition de délai ("au plus tard le lendemain de la dernière réunion du comité social et économique") dans un cas particulier que la référence ne mentionne pas, engageant ainsi le lecteur sur une procédure supplémentaire non présente dans la référence.

**Analyse:**

---

### q122 · dated · tier 1

**Question.** Qui doit donner son accord pour que les salariés puissent dépasser la durée maximale de travail par semaine en cas de situation exceptionnelle ?

**Expected.** Le directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi, sur la base d'un rapport de l'inspecteur du travail.

**Produced.** En cas de circonstances exceptionnelles, c'est l'autorité administrative (le directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi) qui accorde l'autorisation de dépassement de la durée maximale hebdomadaire. Le comité social et économique doit donner son avis sur la demande, mais cet avis n'est pas un accord préalable obligatoire.

**Required.** code:R3121-10 (code R3121-10)

**Retrieved.** code:R3121-10 (code R3121-10), code:L3121-21 (code L3121-21), code:L3122-18 (code L3122-18), code:L3121-25 (code L3121-25), code:L3121-24 (code L3121-24)

**Cited.** code:L3121-21, code:R3121-10

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La candidate ajoute une condition procédurale (l'avis du CSE) que la référence ne mentionne pas, et omet l'élément du rapport de l'inspecteur du travail qui figure dans la référence.

**Analyse:**

---

### q127 · dated · tier 1

**Question.** Si deux parents salariés adoptent ensemble un enfant et décident de partager le congé d'adoption, combien de jours supplémentaires peuvent-ils prendre en total ?

**Expected.** Vingt-cinq jours supplémentaires de congé d'adoption, ou trente-deux jours en cas d'adoptions multiples.

**Produced.** Lorsque deux parents salariés adoptent ensemble un enfant et décident de partager le congé d'adoption, ils ouvrent droit à vingt-cinq jours supplémentaires de congé d'adoption en total. Cette durée supplémentaire s'ajoute à la durée de base de seize semaines (ou plus selon les circonstances), et peut être répartie entre les deux parents sans dépasser seize semaines pour chacun.

**Required.** code:L1225-40 (code L1225-40)

**Retrieved.** code:L1225-40 (code L1225-40), code:D1225-11-1 (code D1225-11-1), code:L1225-37 (code L1225-37), code:L1225-38 (code L1225-38), code:L1225-45 (code L1225-45)

**Cited.** code:L1225-40

**recall@5** 1.00 · **citation F1** 1.00

**Judge.** La candidate ajoute des conditions et précisions sur la durée de base, la répartition et le plafond individuel que la référence ne mentionne pas, alors que la question porte uniquement sur le nombre de jours supplémentaires en cas de partage.

**Analyse:**

---

## `false-refusal` — 10

_refused a question the corpus answers_

### q010 · general · tier 2

**Question.** Que peut faire l'inspecteur du travail s'il découvre qu'un magasin emploie des salariés en violation des règles de travail du dimanche en Alsace-Moselle ?

**Expected.** L'inspecteur du travail peut saisir le juge judiciaire en référé pour faire cesser cet emploi illicite. Le juge peut notamment ordonner la fermeture du magasin le dimanche et assortir sa décision d'une astreinte versée au Trésor.

**Produced.** INSUFFISANT  Les extraits fournis concernent les règles générales de travail du dimanche en France métropolitaine, mais ne contiennent aucune disposition spécifique à l'Alsace-Moselle, qui bénéficie d'un régime dérogatoire particulier en matière de travail dominical.  SOURCES: [code:L3132-31], [code:L3134-15], [code:L3134-2]

**Required.** code:L3134-15 (code L3134-15)

**Retrieved.** code:L3132-31 (code L3132-31), code:L3134-15 (code L3134-15), code:L3134-2 (code L3134-2), code:R3134-1 (code R3134-1), code:L3132-3 (code L3132-3)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant l'absence d'information spécifique à l'Alsace-Moselle, alors que la référence donne une réponse précise sur les pouvoirs de l'inspecteur du travail (saisine du juge en référé, fermeture possible, astreinte).

**Analyse:**

---

### q068 · override · tier 1

**Question.** À partir de quand les dispositions de cet arrêté s'appliquent-elles aux entreprises concernées ?

**Expected.** À partir de la publication du présent arrêté, pour la durée restant à courir et aux conditions prévues par l'avenant.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de répondre de manière univoque à cette question. Bien que plusieurs extraits mentionnent des dates d'application (premier jour du mois suivant la publication, 6 mois après publication), ils concernent des conventions collectives différentes et sans connaître l'arrêté spécifique auquel vous faites référence, je ne peux pas déterminer quelle disposition s'applique.  SOURCES: [convention:30160114], [convention:29264476], [convention:44253149]

**Required.** convention:5851874 (convention KALIARTI000005851874)

**Retrieved.** code:L1233-1 (code L1233-1), convention:30160114 (convention 13), convention:29264476 (convention KALIARTI000029264476), convention:44253149 (convention 13.2), convention:5851633 (convention KALIARTI000005851633)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant une insuffisance d'information, alors que la référence donne une réponse claire : l'application commence à partir de la publication de l'arrêté.

**Analyse:**

---

### q069 · override · tier 1

**Question.** À partir de quand les dispositions de cet avenant sur la formation professionnelle s'appliquent-elles à tous les employeurs et salariés du secteur ?

**Expected.** À partir de la publication du présent arrêté, pour la durée restant à courir selon les conditions prévues par l'avenant.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de déterminer une date précise d'application unique pour tous les avenants sur la formation professionnelle. Bien que certains extraits mentionnent que les avenants entrent en vigueur "le premier jour du mois civil qui suit la publication de l'arrêté ministériel d'extension au Journal officiel" [convention:23561420, convention:43104151], aucun extrait ne précise la date effective de publication de ces arrêtés.

**Required.** convention:5851894 (convention KALIARTI000005851894)

**Retrieved.** convention:5851890 (convention KALIARTI000005851890), convention:23561420 (convention 4), convention:43104151 (convention 5), convention:47007033 (convention KALIARTI000047007033), convention:42258108 (convention 3)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant l'insuffisance des informations, alors que la référence donne une réponse claire : à partir de la publication de l'arrêté.

**Analyse:**

---

### q070 · override · tier 1

**Question.** À partir de quand cet avenant devient-il applicable dans l'entreprise ?

**Expected.** L'avenant entre en vigueur au premier jour du mois suivant la date de publication de son arrêté d'extension.

**Produced.** INSUFFISANT  SOURCES: Aucune source applicable - la question ne précise pas quel avenant est concerné, et les extraits fournis présentent plusieurs avenants avec des dates d'entrée en vigueur différentes selon leur nature et leur statut d'extension.

**Required.** convention:19385004 (convention 5)

**Retrieved.** convention:49300406 (convention 6), convention:26804535 (convention 3), convention:19861279 (convention 2), convention:21237448 (convention 3), convention:35330688 (convention KALIARTI000035330688)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre alors que la référence donne une règle claire d'entrée en vigueur applicable à l'avenant concerné par la question.

**Analyse:**

---

### q071 · override · tier 1

**Question.** À partir de quand les nouveaux salaires minimums pour les ingénieurs et cadres s'appliquent-ils dans les entreprises de la branche ?

**Expected.** Les nouveaux salaires minimums entrent en vigueur au premier jour du mois civil suivant la publication de l'arrêté ministériel au Journal officiel, et au plus tard le 1er janvier 2009.

**Produced.** INSUFFISANT  Les extraits fournis indiquent que les nouveaux salaires entrent en vigueur "au premier jour du mois civil suivant la date de publication de l'arrêté ministériel d'extension au Journal officiel", mais ils ne précisent pas la date exacte de cette publication pour les avenants mentionnés.  SOURCES: [convention:23105066], [convention:19861272], [convention:19861271], [convention:35330687]

**Required.** convention:19861272 (convention 2)

**Retrieved.** convention:23105066 (convention 2), convention:19861272 (convention 2), convention:19861271 (convention 1), convention:5851847 (convention KALIARTI000005851847), convention:35330687 (convention KALIARTI000035330687)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant une information manquante alors que la référence fournit une réponse complète incluant une date butoir (1er janvier 2009), ce qui constitue un refus de s'engager face à une référence qui répond clairement.

**Analyse:**

---

### q079 · override · tier 1

**Question.** À partir de quand cet accord commence-t-il à s'appliquer ?

**Expected.** L'accord prend effet au premier jour du mois civil suivant la date de publication de l'arrêté ministériel d'extension au Journal officiel.

**Produced.** INSUFFISANT  Les extraits fournis concernent plusieurs accords différents avec des dates d'effet distinctes. Sans savoir quel accord spécifique vous visez, je ne peux pas donner une réponse précise.  SOURCES: [convention:42668886], [convention:5851800], [convention:47348436], [convention:22017901], [convention:19732106]

**Required.** convention:29264487 (convention 3)

**Retrieved.** convention:42668886 (convention 9), convention:5851800 (convention 3), convention:47348436 (convention 4), convention:22017901 (convention 10), convention:19732106 (convention 5)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre alors que la référence donne une réponse claire sur la date d'application de l'accord.

**Analyse:**

---

### q087 · override · tier 1

**Question.** Pour combien de temps cet accord sur la formation professionnelle a-t-il été signé ?

**Expected.** Pour une durée indéterminée.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de répondre de manière univoque à cette question. Bien que l'extrait [convention:41549570] indique que "Le présent accord est conclu pour une durée indéterminée", il n'est pas clair quel accord spécifique est visé par votre question, car plusieurs accords sur la formation professionnelle sont mentionnés dans les extraits (celui de 2008, 2019, etc.).  SOURCES: [convention:41549570]

**Required.** convention:41549570 (convention 29)

**Retrieved.** convention:22017903 (convention KALIARTI000022017903), convention:47007033 (convention KALIARTI000047007033), convention:5851890 (convention KALIARTI000005851890), convention:23561415 (convention KALIARTI000023561415), convention:41549570 (convention 29)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant une ambiguïté alors que la référence donne une réponse claire et directe ("Pour une durée indéterminée"), ce qui constitue un cas où elle reste trop vague et n'engage rien alors que la référence répond.

**Analyse:**

---

### q094 · override · tier 1

**Question.** Quel délai minimum faut-il respecter pour dénoncer cet accord ?

**Expected.** Un préavis minimal de 3 mois doit être donné à toutes les organisations signataires par lettre recommandée avec accusé de réception.

**Produced.** INSUFFISANT  Les extraits fournis concernent plusieurs accords différents avec des délais de préavis variables : 3 mois [convention:44159329, convention:47652071, convention:42668889], 2 mois [convention:28465410], ou 6 mois [convention:24683677]. Sans savoir quel accord spécifique vous concerne, je ne peux pas donner une réponse précise.  SOURCES: [convention:44159329], [convention:47652071], [convention:42668889], [convention:28465410], [convention:24683677]

**Required.** convention:46033546 (convention 4)

**Retrieved.** convention:44159329 (convention 8), convention:47652071 (convention KALIARTI000047652071), convention:42668889 (convention 11), convention:28465410 (convention 9.2), convention:24683677 (convention 5)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant plusieurs accords possibles, alors que la référence donne une réponse précise de 3 mois, ce qui constitue un refus de répondre face à une référence qui répond clairement.

**Analyse:**

---

### q095 · override · tier 1

**Question.** À partir de quand cet accord commence-t-il à s'appliquer après sa publication officielle ?

**Expected.** L'accord prend effet le premier jour du mois civil suivant la date de publication de l'arrêté d'extension au Journal officiel.

**Produced.** INSUFFISANT  Les extraits fournis montrent que différents accords ont des dates d'effet différentes : certains prennent effet "le premier jour du mois civil suivant la publication", d'autres "dès publication au Journal officiel", sans préciser quel accord spécifique vous visez.  SOURCES: [convention:27661902], [convention:28465408], [convention:5851753], [convention:47348436], [convention:22017901]

**Required.** convention:46033608 (convention 5)

**Retrieved.** convention:27661902 (convention 8), convention:28465408 (convention 9), convention:5851753 (convention 3), convention:47348436 (convention 4), convention:22017901 (convention 10)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant l'insuffisance des informations alors que la référence donne une réponse précise et claire sur la date d'effet de l'accord.

**Analyse:**

---

### q108 · dated · tier 1

**Question.** Quand l'entreprise doit-elle informer l'administration du travail en cas de difficultés financières graves ?

**Expected.** L'employeur, l'administrateur ou le liquidateur doit transmettre une copie du jugement au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi en cas de procédure de sauvegarde, de redressement ou de liquidation judiciaire.

**Produced.** INSUFFISANT  SOURCES: Les extraits fournis ne précisent pas le délai dans lequel l'entreprise doit informer l'administration du travail en cas de difficultés financières graves. L'article [code:R3232-6] mentionne les difficultés financières mais ne fixe aucun délai d'information.

**Required.** code:R1233-7 (code R1233-7)

**Retrieved.** code:R1233-7 (code R1233-7), code:D1233-39 (code D1233-39), code:R3232-6 (code R3232-6), convention:30579163 (convention KALIARTI000030579163), code:L1221-16 (code L1221-16)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre alors que la référence indique clairement qu'une copie du jugement doit être transmise au directeur régional en cas de procédure collective, ce qui constitue une réponse précise à la question posée.

**Analyse:**

---

## `citation-miss` — 1

_the answer was right but cited the wrong articles_

### q103 · override · tier 2

**Question.** Un enquêteur dans un institut de sondage peut-il refuser les missions qu'on lui propose ?

**Expected.** Oui, mais cela dépend de son statut. Les enquêteurs vacataires peuvent refuser les enquêtes proposées. En revanche, les chargés d'enquête titulaires d'un contrat à durée indéterminée doivent effectuer toutes les enquêtes qui leur sont demandées.

**Produced.** La réponse dépend du statut de l'enquêteur. Un enquêteur vacataire peut accepter ou refuser librement toute mission qui lui est proposée sans avoir à en justifier le motif. En revanche, un chargé d'enquête (CE) titulaire d'un contrat à durée indéterminée doit effectuer toutes les enquêtes qui lui sont demandées, car il est placé sous subordination exclusive de son employeur.

**Required.** convention:47652015 (convention KALIARTI000047652015)

**Retrieved.** convention:5851296 (convention 1), convention:47652015 (convention KALIARTI000047652015), convention:5851347 (convention 46), convention:47006875 (convention 3), convention:5851346 (convention 45)

**Cited.** convention:5851347, convention:5851346

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate affirme la même distinction que la référence (vacataires peuvent refuser, CDI doivent effectuer toutes les enquêtes) et ajoute seulement des précisions factuelles ("sans avoir à en justifier le motif", "placé sous subordination exclusive") qui n'ajoutent pas de conditions ou d'étapes procédurales contraignantes.

**Analyse:**

---
