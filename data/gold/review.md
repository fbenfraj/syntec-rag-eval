# Gold set review

32 of 150 questions, sampled across all 4 categories.

For each row, decide **one thing**: does the source article below actually support the
drafted answer? You are not being asked to know French labour law — the article is right
there. The citation itself needs no checking; the question was written from that article.

Mark each row by replacing `[ ]` with:

- `[x]` — the answer follows from the article. Becomes `human-verified`.
- `[!]` — the answer is wrong or unsupported. Write the correct answer on the `Fix:` line.
- `[-]` — the question itself is bad (ambiguous, or not really unanswerable). It gets dropped.

For `unanswerable` rows there is no article: judge whether the question is plausible,
in-domain, and something this corpus genuinely does not cover.

Then run `pnpm gold:apply-review`.

---

## q106 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Une salariée qui attend son troisième enfant et qui a déjà deux enfants à charge : combien de semaines de congé maternité peut-elle prendre avant l'accouchement prévu ?

**Drafted answer.** Elle peut prendre 8 semaines de congé avant l'accouchement prévu, ou jusqu'à 10 semaines si elle demande une augmentation (8 + 2 semaines maximum).

**Source — `code:L1225-19`** (code L1225-19 — Sous-section 3 : Autorisations d'absence et congé de maternité.)

```
Lorsque, avant l'accouchement, la salariée elle-même ou le foyer assume déjà la charge de deux enfants au moins ou lorsque la salariée a déjà mis au monde au moins deux enfants nés viables, le congé de maternité commence huit semaines avant la date présumée de l'accouchement et se termine dix-huit semaines après la date de celui-ci.
A la demande de la salariée et sous réserve d'un avis favorable du professionnel de santé qui suit la grossesse, la période de suspension du contrat de travail qui commence avant la date présumée de l'accouchement peut être réduite d'une durée maximale de trois semaines. La période postérieure à la date présumée de l'accouchement est alors augmentée d'autant.
Lorsque la salariée a reporté après la naissance de l'enfant une partie du congé de maternité et qu'elle se voit prescrire un arrêt de travail pendant la période antérieure à la date présumée de l'accouchement, ce report est annulé et la période de suspension du contrat de travail est décomptée à partir du premier jour de l'arrêt de travail. La période initialement reportée est réduite d'autant.
La période de huit semaines de congé de maternité antérieure à la date présumée de l'accouchement peut être augmentée d'une durée maximale de deux semaines. La période de dix-huit semaines postérieure à la date de l'accouchement est alors réduite d'autant.
```

---

## q108 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Quand l'entreprise doit-elle informer l'administration du travail en cas de difficultés financières graves ?

**Drafted answer.** L'employeur, l'administrateur ou le liquidateur doit transmettre une copie du jugement au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi en cas de procédure de sauvegarde, de redressement ou de liquidation judiciaire.

**Source — `code:R1233-7`** (code R1233-7 — Sous-section 3 : Information de l'autorité administrative)

```
En cas de procédure de sauvegarde, l'employeur ou l'administrateur transmet une copie du jugement mentionné à l'article L. 626-11 du code de commerce au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi.
En cas de redressement ou de liquidation judiciaire, l'employeur, l'administrateur ou le liquidateur transmet une copie du jugement de redressement ou de liquidation judiciaire au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi.
```

---

## q111 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Un salarié souhaite réduire son temps de travail pour des raisons personnelles. Quelle est la durée minimale de chaque période non travaillée qu'il peut demander ?

**Drafted answer.** Le salarié peut demander une réduction de sa durée de travail sous forme d'une ou plusieurs périodes d'au moins une semaine en raison de ses besoins de vie personnelle.

**Source — `code:L3123-2`** (code L3123-2 — Paragraphe 2 : Passage à temps partiel ou à temps complet)

```
Le salarié qui en fait la demande peut bénéficier d'une réduction de la durée du travail sous forme d'une ou plusieurs périodes d'au moins une semaine en raison des besoins de sa vie personnelle. Sa durée de travail est fixée dans la limite annuelle prévue au 3° de l'article L. 3123-1.
Pendant les périodes travaillées, le salarié est occupé selon l'horaire collectif applicable dans l'entreprise ou l'établissement.
Les dispositions relatives au régime des heures supplémentaires et à la contrepartie obligatoire sous forme de repos s'appliquent aux heures accomplies au cours d'une semaine au delà de la durée légale fixée en application de l'article L. 3121-27 ou, en cas d'application d'un accord collectif conclu sur le fondement de l'article L. 3121-44, aux heures accomplies au delà des limites fixées par cet accord.
L'avenant au contrat de travail précise la ou les périodes non travaillées. Il peut également prévoir les modalités de calcul de la rémunération mensualisée indépendamment de l'horaire réel du mois.
```

---

## q114 · dated · tier 2

- [ ] verdict
- Fix: 

**Question.** Un salarié qui travaille depuis 5 ans dans l'entreprise conclut un accord de conciliation avec son employeur. Combien de mois de salaire lui sont dus au minimum selon le barème légal ?

**Drafted answer.** 7 mois de salaire : 3 mois de base pour une ancienneté d'au moins un an, plus 4 mois supplémentaires (un mois par année au-delà de la première année, jusqu'à 8 ans d'ancienneté).

**Source — `code:D1235-21`** (code D1235-21 — Section 3 : Indemnité forfaitaire en cas d'accord de conciliation.)

```
Le barème mentionné au premier alinéa de l'article L. 1235-1 est défini comme suit :
-deux mois de salaire si le salarié justifie chez l'employeur d'une ancienneté inférieure à un an ;
-trois mois de salaire si le salarié justifie chez l'employeur d'une ancienneté au moins égale à un an, auxquels s'ajoute un mois de salaire par année supplémentaire jusqu'à huit ans d'ancienneté ;
-dix mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre huit ans et moins de douze ans ;
-douze mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre douze ans et moins de quinze ans ;
-quatorze mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre quinze ans et moins de dix-neuf ans ;
-seize mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre dix-neuf ans et moins de vingt-trois ans ;
-dix-huit mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre vingt-trois ans et moins de vingt-six ans ;
-vingt mois de salaire si le salarié justifie chez l'employeur d'une ancienneté comprise entre vingt-six ans et moins de trente ans ;
-vingt-quatre mois de salaire si le salarié justifie chez l'employeur d'une ancienneté au moins égale à trente ans.
```

---

## q117 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** À partir de combien de licenciements économiques dans le même mois l'employeur doit-il informer l'administration ?

**Drafted answer.** À partir de dix salariés licenciés pour motif économique dans une même période de trente jours.

**Source — `code:L1233-46`** (code L1233-46 — Paragraphe 1 : Information de l'autorité administrative.)

```
L'employeur notifie à l'autorité administrative tout projet de licenciement pour motif économique d'au moins dix salariés dans une même période de trente jours.
Lorsque l'entreprise est dotée de représentants du personnel, la notification est faite au plus tôt le lendemain de la date prévue pour la première réunion prévue aux articles L. 1233-29 et L. 1233-30.
La notification est accompagnée de tout renseignement concernant la convocation, l'ordre du jour et la tenue de cette réunion. Au plus tard à cette date, elle indique, le cas échéant, l'intention de l'employeur d'ouvrir la négociation prévue à l'article L. 1233-24-1. Le seul fait d'ouvrir cette négociation avant cette date ne peut constituer une entrave au fonctionnement du comité social et économique.
```

---

## q120 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Si mon entreprise veut faire travailler des salariés entre 21h et minuit, qu'est-ce que l'employeur doit obligatoirement prévoir pour les ramener chez eux ?

**Drafted answer.** L'employeur doit mettre à disposition un moyen de transport pris en charge par lui qui permet au salarié de regagner son lieu de résidence.

**Source — `code:L3122-19`** (code L3122-19 — Section 2 : Champ de la négociation collective)

```
Dans les zones mentionnées à l'article L. 3132-24, soit un accord collectif d'entreprise ou d'établissement ou, à défaut, un accord collectif de branche, soit un accord conclu à un niveau territorial peut prévoir la faculté d'employer des salariés entre 21 heures et minuit.
Cet accord prévoit notamment, au bénéfice des salariés employés entre 21 heures et le début de la période de travail de nuit :
1° La mise à disposition d'un moyen de transport pris en charge par l'employeur qui permet au salarié de regagner son lieu de résidence ;
2° Des mesures destinées à faciliter l'articulation entre la vie professionnelle et la vie personnelle des salariés, en particulier des mesures de compensation des charges liées à la garde d'enfants ou à la prise en charge d'une personne dépendante ;
3° La fixation des conditions de prise en compte par l'employeur de l'évolution de la situation personnelle des salariés, en particulier de leur souhait de ne plus travailler après 21 heures. Pour les salariées mentionnées à l'article L. 1225-9, le choix de ne plus travailler entre 21 heures et le début de la période de nuit est d'effet immédiat.
```

---

## q123 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Qui doit être consulté régulièrement sur la façon dont se déroule une rupture conventionnelle collective dans l'entreprise ?

**Drafted answer.** Le comité social et économique, s'il existe, doit être consulté régulièrement et en détail, et ses avis sont transmis à l'autorité administrative.

**Source — `code:L1237-19-7`** (code L1237-19-7 — Sous-section 2 :  Rupture d'un commun accord dans le cadre d'un accord collectif portant rupture conventionnelle collective &#13;
&#13;
&#13;)

```
Le suivi de la mise en œuvre de l'accord portant rupture conventionnelle collective fait l'objet, s'il existe, d'une consultation régulière et détaillée du comité social et économique dont les avis sont transmis à l'autorité administrative.
L'autorité administrative est associée au suivi de ces mesures et reçoit un bilan, établi par l'employeur, de la mise en œuvre de l'accord portant rupture conventionnelle collective.
```

---

## q126 · dated · tier 1

- [ ] verdict
- Fix: 

**Question.** Dans une grande entreprise qui doit licencier un salarié pour des raisons économiques, combien de temps maximum l'employeur doit-il lui proposer pour suivre une formation et chercher un nouvel emploi ?

**Drafted answer.** L'employeur doit proposer un congé de reclassement d'une durée maximale de douze mois, pouvant être porté à vingt-quatre mois si le salarié suit une formation de reconversion professionnelle.

**Source — `code:L1233-71`** (code L1233-71 — Sous-section 3 : Congé de reclassement.)

```
Dans les entreprises ou les établissements d'au moins mille salariés, ainsi que dans les entreprises mentionnées à l'article L. 2331-1 et celles répondant aux conditions mentionnées aux articles L. 2341-1 et L. 2341-2, dès lors qu'elles emploient au total au moins mille salariés, l'employeur propose à chaque salarié dont il envisage de prononcer le licenciement pour motif économique un congé de reclassement qui a pour objet de permettre au salarié de bénéficier d'actions de formation et des prestations d'une cellule d'accompagnement des démarches de recherche d'emploi.
La durée du congé de reclassement ne peut excéder douze mois, pouvant être portés à vingt-quatre mois en cas de formation de reconversion professionnelle.
Ce congé débute, si nécessaire, par un bilan de compétences qui a vocation à permettre au salarié de définir un projet professionnel et, le cas échéant, de déterminer les actions de formation nécessaires à son reclassement. Celles-ci sont mises en oeuvre pendant la période prévue au premier alinéa.
L'employeur finance l'ensemble de ces actions.
```

---

## q001 · general · tier 2

- [ ] verdict
- Fix: 

**Question.** Si j'embauche un salarié étranger et que je lui propose un contrat écrit, dois-je lui fournir une version traduite dans sa langue ?

**Drafted answer.** Oui, si le salarié étranger le demande, une traduction du contrat doit être rédigée dans sa langue. Les deux textes font foi en justice, et en cas de désaccord entre les versions, seul le texte dans la langue du salarié peut être invoqué contre lui.

**Source — `code:L1221-3`** (code L1221-3 — Section 1 : Dispositions générales.)

```
Le contrat de travail établi par écrit est rédigé en français.
Lorsque l'emploi qui fait l'objet du contrat ne peut être désigné que par un terme étranger sans correspondant en français, le contrat de travail comporte une explication en français du terme étranger.
Lorsque le salarié est étranger et le contrat constaté par écrit, une traduction du contrat est rédigée, à la demande du salarié, dans la langue de ce dernier. Les deux textes font également foi en justice. En cas de discordance entre les deux textes, seul le texte rédigé dans la langue du salarié étranger peut être invoqué contre ce dernier.
L'employeur ne peut se prévaloir à l'encontre du salarié auquel elles feraient grief des clauses d'un contrat de travail conclu en méconnaissance du présent article.
```

---

## q008 · general · tier 2

- [ ] verdict
- Fix: 

**Question.** Si une fuite d'eau importante endommage les installations de notre bâtiment et qu'il faut intervenir d'urgence le dimanche, pouvons-nous demander aux salariés de l'entreprise de maintenance de travailler ce jour-là ?

**Drafted answer.** Oui, le repos hebdomadaire peut être suspendu pour les travaux urgents nécessaires pour réparer des accidents survenus au matériel, aux installations ou aux bâtiments. Les salariés de l'entreprise de maintenance affectés habituellement aux travaux d'entretien et de réparation doivent alors bénéficier d'un repos compensateur d'une durée égale au repos supprimé.

**Source — `code:L3132-4`** (code L3132-4 — Paragraphe 1 : Travaux urgents.)

```
En cas de travaux urgents dont l'exécution immédiate est nécessaire pour organiser des mesures de sauvetage, pour prévenir des accidents imminents ou réparer des accidents survenus au matériel, aux installations ou aux bâtiments de l'établissement, le repos hebdomadaire peut être suspendu pour le personnel nécessaire à l'exécution de ces travaux.
Cette faculté de suspension s'applique non seulement aux salariés de l'entreprise où les travaux urgents sont nécessaires mais aussi à ceux d'une autre entreprise faisant les réparations pour le compte de la première.
Chaque salarié de cette seconde entreprise, de même que chaque salarié de l'entreprise où sont réalisés les travaux, affecté habituellement aux travaux d'entretien et de réparation, bénéficie d'un repos compensateur d'une durée égale au repos supprimé.
```

---

## q016 · general · tier 2

- [ ] verdict
- Fix: 

**Question.** Si je veux me faire accompagner lors de la discussion avec mon employeur sur la fin de mon contrat d'un commun accord, qui peut m'assister ?

**Drafted answer.** Vous pouvez vous faire assister soit par une personne de votre choix travaillant dans l'entreprise (salarié, représentant du personnel, etc.), soit, s'il n'y a pas de représentants du personnel, par un conseiller figurant sur une liste établie par l'administration.

**Source — `code:L1237-12`** (code L1237-12 — Section 3 : Rupture conventionnelle.)

```
Les parties au contrat conviennent du principe d'une rupture conventionnelle lors d'un ou plusieurs entretiens au cours desquels le salarié peut se faire assister :
1° Soit par une personne de son choix appartenant au personnel de l'entreprise, qu'il s'agisse d'un salarié titulaire d'un mandat syndical ou d'un salarié membre d'une institution représentative du personnel ou tout autre salarié ;
2° Soit, en l'absence d'institution représentative du personnel dans l'entreprise, par un conseiller du salarié choisi sur une liste dressée par l'autorité administrative.
Lors du ou des entretiens, l'employeur a la faculté de se faire assister quand le salarié en fait lui-même usage. Le salarié en informe l'employeur auparavant ; si l'employeur souhaite également se faire assister, il en informe à son tour le salarié.
L'employeur peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise ou, dans les entreprises de moins de cinquante salariés, par une personne appartenant à son organisation syndicale d'employeurs ou par un autre employeur relevant de la même branche.
```

---

## q023 · general · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel délai s'écoule avant que les avis demandés pour autoriser le repos hebdomadaire par roulement dans une gare soient considérés comme donnés s'il n'y a pas de réponse ?

**Drafted answer.** Les avis sont réputés donnés à l'issue d'un délai de deux mois à compter de la saisine des personnes et des organisations concernées.

**Source — `code:L3132-25-6`** (code L3132-25-6 — Sous-paragraphe 2 : Dérogations sur un fondement géographique)

```
Un arrêté conjoint des ministres chargés des transports, du travail et du commerce peut, après avis du maire, le cas échéant du président de l'établissement public de coopération intercommunale dont la commune est membre, et des représentants des employeurs et des salariés des établissements concernés, autoriser les établissements de vente au détail qui mettent à disposition des biens et des services et qui sont situés dans l'emprise d'une gare qui n'est pas incluse dans l'une des zones mentionnées à l'article L. 3132-24 à donner le repos hebdomadaire par roulement pour tout ou partie du personnel, compte tenu de l'affluence exceptionnelle de passagers dans cette gare, dans les conditions prévues aux II et III de l'article L. 3132-25-3 et à l'article L. 3132-25-4.
Les avis requis en application du premier alinéa du présent article sont réputés donnés à l'issue d'un délai de deux mois à compter de la saisine des personnes et des organisations concernées.
```

---

## q031 · general · tier 1

- [ ] verdict
- Fix: 

**Question.** Si un salarié ne peut pas travailler parce qu'un jour férié tombe pendant sa semaine de travail, est-ce qu'il perd de l'argent sur son salaire ?

**Drafted answer.** Non, à condition qu'il ait au moins trois mois d'ancienneté dans l'entreprise. Le chômage des jours fériés ne peut entraîner aucune perte de salaire pour les salariés ayant cette ancienneté.

**Source — `code:L3133-3`** (code L3133-3 — Sous-section 1 : Ordre public.)

```
Le chômage des jours fériés ne peut entraîner aucune perte de salaire pour les salariés totalisant au moins trois mois d'ancienneté dans l'entreprise ou l'établissement.
Ces dispositions s'appliquent aux salariés saisonniers si, du fait de divers contrats successifs ou non, ils cumulent une ancienneté totale d'au moins trois mois dans l'entreprise.
Ces dispositions ne s'appliquent ni aux personnes travaillant à domicile, ni aux salariés intermittents, ni aux salariés temporaires.
```

---

## q038 · general · tier 1

- [ ] verdict
- Fix: 

**Question.** Combien de temps minimum doit s'écouler entre deux réunions du comité social et économique lors d'une procédure de licenciement collectif ?

**Drafted answer.** Au moins quinze jours doivent séparer les deux réunions du comité social et économique.

**Source — `code:L1233-30`** (code L1233-30 — Paragraphe 1 : Réunions des représentants du personnel.)

```
I.-Dans les entreprises ou établissements employant habituellement au moins cinquante salariés, l'employeur réunit et consulte le comité social et économique sur :
1° L'opération projetée et ses modalités d'application, conformément à l'article L. 2323-31 ;
2° Le projet de licenciement collectif : le nombre de suppressions d'emploi, les catégories professionnelles concernées, les critères d'ordre et le calendrier prévisionnel des licenciements, les mesures sociales d'accompagnement prévues par le plan de sauvegarde de l'emploi et, le cas échéant, les conséquences des licenciements projetés en matière de santé, de sécurité ou de conditions de travail.
Les éléments mentionnés au 2° du présent I qui font l'objet de l'accord mentionné à l'article L. 1233-24-1 ne sont pas soumis à la consultation du comité social et économique prévue au présent article.
Le comité social et économique tient au moins deux réunions espacées d'au moins quinze jours.
II.-Le comité social et économique rend ses deux avis dans un délai qui ne peut être supérieur, à compter de la date de sa première réunion au cours de laquelle il est consulté sur les 1° et 2° du I, à :
1° Deux mois lorsque le nombre des licenciements est inférieur à cent ;
2° Trois mois lorsque le nombre des licenciements est au moins égal à cent et inférieur à deux cent cinquante ;
3° Quatre mois lorsque le nombre des licenciements est au moins égal à deux cent cinquante.
Une convention ou un accord collectif de travail peut prévoir des délais différents.
En l'absence d'avis du comité social et économique dans ces délais, celui-ci est réputé avoir été consulté.
```

---

## q046 · general · tier 1

- [ ] verdict
- Fix: 

**Question.** Si un contrat de travail temporaire a été signé sans respecter certaines règles légales, quel type de contrat devient-il automatiquement ?

**Drafted answer.** Il est réputé être un contrat à durée indéterminée.

**Source — `code:L1245-1`** (code L1245-1 — Chapitre V : Requalification du contrat.)

```
Est réputé à durée indéterminée tout contrat de travail conclu en méconnaissance des dispositions des articles L. 1242-1 à L. 1242-4, L. 1242-6, L. 1242-7, L. 1242-8-1, L. 1242-12, alinéa premier, L. 1243-11, alinéa premier, L. 1243-13-1, L. 1244-3-1 et L. 1244-4-1, et des stipulations des conventions ou accords de branche conclus en application des articles L. 1242-8, L. 1243-13, L. 1244-3 et L. 1244-4.
La méconnaissance de l'obligation de transmission du contrat de mission au salarié dans le délai fixé par l'article L. 1242-13 ne saurait, à elle seule, entraîner la requalification en contrat à durée indéterminée. Elle ouvre droit, pour le salarié, à une indemnité, à la charge de l'employeur, qui ne peut être supérieure à un mois de salaire.
```

---

## q053 · general · tier 2

- [ ] verdict
- Fix: 

**Question.** Si un employeur gagne son pourvoi en cassation contre une condamnation pour licenciement sans cause réelle et sérieuse, qu'est-ce qui se passe automatiquement concernant les allocations chômage que le salarié avait reçues ?

**Drafted answer.** La cassation de la condamnation pour licenciement sans cause réelle et sérieuse entraîne automatiquement la cassation de l'ordre de remboursement des allocations chômage.

**Source — `code:R1235-10`** (code R1235-10 — Section 1 : Remboursement des allocations de chômage)

```
En cas de pourvoi en cassation dirigé contre une décision qui a condamné un employeur pour licenciement sans cause réelle et sérieuse ou licenciement nul en application des dispositions des articles L. 1132-4, L. 1134-4, L. 1144-3, L. 1152-3, L. 1153-4, L. 1235-3 et L. 1235-11, la cassation du chef de la décision précitée emporte cassation du chef de la décision qui ordonne d'office le remboursement des indemnités de chômage.
```

---

## q061 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** Un enquêteur peut-il refuser une enquête qui lui est proposée par son employeur s'il a signé un contrat avec une rémunération annuelle garantie ?

**Drafted answer.** Oui, l'enquêteur conserve la faculté d'accepter ou de refuser chacune des enquêtes qui lui sont proposées, sous réserve des dispositions prévues aux articles 5 et 25.

**Source — `convention:5851296`** (convention 1 — Annexe IV. Enquêteurs)

```
Tout employeur peut s'engager envers un enquêteur vacataire à lui proposer d'effectuer des enquêtes par sondage à hauteur d'une rémunération annuelle garantie.
L'enquêteur, qui est alors appelé " chargé d'enquête intermittent à garantie annuelle ", n'en conserve pas moins la faculté d'accepter ou de refuser chacune des enquêtes qui lui sont proposées, sous réserve des dispositions prévues aux articles 5 et 25.
Les conditions générales d'engagement et les modalités d'emploi des chargés d'enquête intermittents à garantie annuelle sont définies par la présente annexe, que complètent, le cas échéant, les règlements intérieurs, les accords d'entreprise et les contrats individuels.
```

---

## q066 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** À quelle fréquence la commission paritaire de suivi se réunit-elle pour faire le point sur l'application de l'accord ?

**Drafted answer.** La commission se réunit une fois par an afin d'établir un bilan de l'application de l'accord.

**Source — `convention:5851692`** (convention KALIARTI000005851692 — Statut des salariés du secteur d'activité d'organisation des foires, salons et congrès)

```
Les partenaires sociaux décident de la mise en place au niveau national d'une commission paritaire de suivi du présent accord.
Cette commission de suivi sera composée d'un représentant (ou de son suppléant en l'absence du titulaire) pour les organisations syndicales de salariés et pour les organisations d'employeurs, signataires de l'accord.
Elle aura pour mission la mise en place d'un observatoire relatif à la mise en oeuvre dans les entreprises des dispositions du présent accord.
A cet effet, la commission se réunira une fois par an afin d'établir un bilan de l'application du présent accord, de recueillir ses difficultés d'application et, le cas échéant, de trancher toutes questions pouvant être soulevées.
```

---

## q072 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** Si un salarié décède et laisse deux enfants à charge, l'un ayant 16 ans et l'autre 20 ans, quel pourcentage du salaire de référence sera versé pour chacun d'eux ?

**Drafted answer.** Pour l'enfant de 16 ans : 12 % du salaire de référence jusqu'au 18e anniversaire. Pour l'enfant de 20 ans : 15 % du salaire de référence jusqu'au 26e anniversaire.

**Source — `convention:20851801`** (convention 2 — Prévoyance — Prestations)

```
L' article 3. 2 de l'accord du 27 mars 1997 prévoit :
« Le montant du capital décès versé est égal à 150 % du salaire de référence défini à l'article 8 du présent accord. Sur demande du ou des ayants droit désignés en 3. 3, ce capital décès pourra, en tout ou partie, être transformé en rente. »
L'article 3. 2 de l'accord est remplacé par :
« Le montant du capital décès versé est égal à 170 % du salaire de référence. Son montant minimum est fixé à 170 % du plafond annuel de la sécurité sociale en vigueur au jour du décès pour les salariés ne relevant pas du régime de retraite des cadres et à 340 % du plafond annuel de la sécurité sociale en vigueur au jour du décès pour les salariés relevant du régime de retraite des cadres, avec prorata pour les salariés à temps partiel.
Sur demande du ou des ayants droit désignés en 3. 3, ce capital décès pourra, en tout ou partie, être transformé en rente. »
L'article 5. 3 de l'accord du 27 mars 1997 prévoit :
« Il sera versé pour les enfants à charge désignés en 5. 2 :
― 8 % du salaire de référence par enfant jusqu'à l'âge de 17 ans révolus ;
― 12 % du salaire de référence par enfant âgé de plus de 18 ans et jusqu'à 25 ans révolus. »
L'article 5. 3 de l'accord est remplacé par :
« Il sera versé pour les enfants à charge désignés en 5. 2 :
― 12 % du salaire de référence par enfant jusqu'au 18e anniversaire ;
― 15 % du salaire de référence par enfant âgé de 18 ans et jusqu'au 26e anniversaire, avec des minima sur le montant annuel de la rente calculés lors de sa mise en service ;
― 12 % du plafond annuel de la sécurité sociale jusqu'au 18e anniversaire, et de 15 % de 18 ans et jusqu'au 26e anniversaire, pour les salariés ne relevant pas du régime de retraite des cadres ;
― et de 24 % du plafond annuel de la sécurité sociale jusqu'au 18e anniversaire et de 30 % de 18 ans et jusqu'au 26e anniversaire, pour les salariés relevant du régime de retraite des cadres.
Les minima sont calculés sur le plafond de la sécurité sociale en vigueur au jour du décès du salarié, avec prorata pour les salariés à temps partiel, la rente annuelle étant ensuite revalorisée selon les dispositions prévues par l'accord relatif à la prévoyance du 27 mars
```

---

## q077 · override · tier 2

- [ ] verdict
- Fix: 

**Question.** Quels sont les deux niveaux d'action que les partenaires sociaux ont décidé de mettre en place pour améliorer la santé au travail dans la branche ?

**Drafted answer.** Les partenaires sociaux ont agi à deux niveaux : la conclusion d'un accord de branche adapté aux spécificités des métiers, et parallèlement la mise en œuvre d'actions paritaires complémentaires incluant l'élaboration d'un document unique de branche sur les risques professionnels, d'un guide pratique sur les risques physiques et psychosociaux, et d'un module de formation à la santé et prévention des risques psychosociaux.

**Source — `convention:27661903`** (convention KALIARTI000027661903 — Santé et risques psychosociaux)

```
La préservation et l'amélioration de la santé au travail étant une priorité qui s'appréhendent dans un cadre nécessairement pluridisciplinaire et dans le cadre d'une prise en charge collective, les partenaires sociaux de la branche ont engagé des négociations encadrées par l'accord de méthode qu'ils ont signé le 10 mars 2011.
Avec cet accord de méthode, les partenaires sociaux ont souhaité que les employeurs de la branche bénéficient d'un cadre leur permettant d'assurer leurs obligations de protection de la santé de leurs salariés et de prévention des risques physiques et psychosociaux.
Ces négociations ont abouti à la concrétisation de leur volonté d'agir à deux niveaux :
– la conclusion du présent accord de branche, au regard des spécificités inhérentes aux métiers des entreprises de la branche,
et, parallèlement,
– la mise en œuvre d'actions paritaires complémentaires à l'accord de branche :
–– l'élaboration paritaire d'un document paritaire unique de branche sur les risques professionnels diligentée par l'ADESATT. Les modalités d'information auprès des employeurs et des salariés afférentes au document unique de branche seront confiées à un prestataire désigné paritairement ;
–– l'élaboration paritaire d'un guide pratique paritaire relatif aux risques professionnels, physiques et psychosociaux, ayant des conséquences sur la santé au travail et rappelant :
––– les mesures contribuant à la « qualité de vie » au travail ;
––– les rôles et missions des CHSCT et des délégués du personnel ;
––– les principes et bonnes pratiques, dans le cadre de l'obligation générale de santé/sécurité de l'employeur régie par les dispositions légales et réglementaires ;
–– l'élaboration et la diffusion d'un module de formation à la santé et prévention RPS effectué et dispensé par un organisme pour les entreprises de la branche et disponible en e-learning. Si la formule e-learning ne peut pas être utilisée l'employeur met en place les dispositions permettant au salarié de se former.
Les partenaires sociaux de la branche rappellent que chaque organisation publie par l'intermédiaire de son site internet les résultats des études ADESATT, notamment le rapport du 3 mars 2011 relatif à la
```

---

## q083 · override · tier 2

- [ ] verdict
- Fix: 

**Question.** Un salarié en CDI peut-il refuser de s'inscrire à la complémentaire santé de l'entreprise s'il a déjà une assurance individuelle personnelle ?

**Drafted answer.** Oui, si l'acte mettant en place les garanties le prévoit. Un salarié couvert par une assurance individuelle de frais de santé au moment de la mise en place des garanties ou de son embauche peut être dispensé d'adhésion, mais cette dispense ne joue que jusqu'à l'échéance de son contrat individuel.

**Source — `convention:31964509`** (convention 1.1.2 — Complémentaire santé — Dispenses d'adhésion à l'initiative du salarié)

```
L'adhésion des salariés au régime de complémentaire santé est obligatoire.
Sauf si un acte juridique de l'entreprise prévoit des dispositions différentes, les salariés ont la faculté de refuser leur adhésion au régime de branche dans les conditions prévues aux articles D. 911-2, D. 911-3 et R. 242-1-6 du code de la sécurité sociale et rappelées ci-dessous :
1° Lorsque les garanties ont été mises en place par une décision unilatérale et que le dispositif prévoit que les salariés embauchés avant la mise en place des garanties peuvent en être dispensés ;
2° Lorsque les garanties ont été mises en place dans les conditions fixées à l'article L. 911-1 du code de la sécurité sociale et que l'acte qui met en place ces garanties prévoit, quelle que soit leur date d'embauche, les cas de dispense :
a) Des salariés et apprentis bénéficiaires d'un contrat à durée déterminée ou d'un contrat de mission d'une durée au moins égale à 12 mois, à condition de justifier par écrit en produisant tous documents d'une couverture individuelle souscrite par ailleurs pour le même type de garanties ;
b) Des salariés bénéficiaires d'un contrat à durée déterminée ou d'un contrat de mission d'une durée inférieure à 12 mois, même s'ils ne bénéficient pas d'une couverture individuelle souscrite par ailleurs ;
c) Des salariés à temps partiel et apprentis n'ayant pas de couverture individuelle ou collective dont l'adhésion au système de garanties les conduirait à s'acquitter d'une cotisation au moins égale à 10 % de leur rémunération brute ;
d) Des salariés bénéficiaires d'une couverture complémentaire en application de l'article L. 861-3 du code de la sécurité sociale (CMU-C) ou d'une aide à l'acquisition d'une complémentaire santé en application de l'article L. 863-1 du code de la sécurité sociale. La dispense ne peut alors jouer que jusqu'à la date à laquelle les salariés cessent de bénéficier de cette couverture ou de cette aide ;
e) Des salariés couverts par une assurance individuelle de frais de santé au moment de la mise en place des garanties ou de l'embauche si elle est postérieure. La dispense ne peut alors jouer que jusqu'à échéance du contrat individuel ;
f) Des salariés qui bénéficien
```

---

## q089 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel type de signature doit être utilisé pour signer cet accord, et quelles normes doit-il respecter ?

**Drafted answer.** La signature doit être électronique et répondre aux exigences du règlement européen n° 910-2014 du 23 juillet 2014 et de l'article 1367 du code civil.

**Source — `convention:42668890`** (convention 12 — Commission paritaire TPE et PME — Dépôt et extension de l'accord)

```
Après avoir négocié par visioconférence et lu chacune des pages précédentes, les représentants signataires signent l'accord au nom de leur organisation. Pour ce faire, la partie la plus diligente met en place un dispositif de signature électronique répondant aux exigences du règlement européen n° 910- 2014 du 23 juillet 2014 et de l'article 1367 du code civil.
Le présent accord fera l'objet d'une demande d'extension par la partie la plus diligente auprès du ministre du travail dans les conditions prévues à l'article L. 2261-24 du code du travail.
```

---

## q094 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel délai minimum faut-il respecter pour dénoncer cet accord ?

**Drafted answer.** Un préavis minimal de 3 mois doit être donné à toutes les organisations signataires par lettre recommandée avec accusé de réception.

**Source — `convention:46033546`** (convention 4 — Statut des salariés du secteur de l'événementiel — Stipulations juridiques et administratives)

```
Date d'effet. Durée de l'avenant
Le présent avenant est conclu pour une durée indéterminée. Il prend effet le premier jour du mois civil suivant la date de publication de l'arrêté d'extension au Journal officiel.
Conditions de révision de l'avenant
Le présent avenant pourra faire l'objet d'une révision conformément aux articles L. 2261-7 et suivants du code du travail.
Toute demande de révision sera obligatoirement accompagnée d'une proposition de rédaction nouvelle. Celle-ci sera notifiée par lettre recommandée avec accusé de réception à chacune des autres parties signataires.
Le plus rapidement possible et, au plus tard, dans un délai de 3 mois à partir de la réception par l'ensemble des parties de cette lettre, les parties devront s'être rencontrées en vue de la conclusion éventuelle d'un avenant de révision.
Cet avenant sera soumis aux règles de validité et de publicité en vigueur au jour de sa signature.
Conditions de dénonciation de l'avenant
Le présent avenant peut être dénoncé, partiellement ou en totalité, par l'un ou l'ensemble des signataires employeurs ou salariés après un préavis minimal de 3 mois. Ce préavis devra être donné à toutes les organisations signataires du présent avenant par lettre recommandée avec accusé de réception, sous peine de nullité.
La partie qui dénonce l'avenant peut accompagner sa notification d'un nouveau projet, conformément à l'article 3.
Dépôt et extension de l'avenant
Le présent avenant fera l'objet d'une demande d'extension par la partie la plus diligente auprès du ministère du travail dans les conditions prévues à l'article L. 2261-24 du code du travail.
Conditions d'adhésion à l'avenant
Peuvent adhérer au présent avenant toute organisation syndicale représentative de salariés ainsi que toute organisation syndicale ou association d'employeurs ou des employeurs pris individuellement, conformément à l'article L. 2261-3 du code du travail.
```

---

## q100 · override · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel délai l'employeur a-t-il pour recevoir un salarié qui a signalé par écrit des difficultés concernant son organisation du travail ou sa charge de travail ?

**Drafted answer.** L'employeur ou son représentant doit recevoir le salarié dans les 8 jours suivant son alerte écrite.

**Source — `convention:47348428`** (convention 2.4 — Durée du travail — Charge de travail, amplitude des journées de travail et équilibre entre vie privée et vie professionnelle)

```
L'article 4.8.2 du chapitre II de l'accord de branche du 22 juin 1999 relatif à la durée du travail est rédigé comme suit :
« 4.8.2. Suivi de la charge de travail et de l'amplitude des journées de travail, équilibre entre vie privée et vie professionnelle
Les salariés bénéficiant d'une convention de forfait en jours sur l'année ne sont pas soumis aux durées légales maximales quotidiennes et hebdomadaires de travail. Il ne peut cependant en être déduit qu'ils sont soumis par défaut à des journées de travail dont l'amplitude serait délimitée par les temps de repos minimums légaux rappelés à l'article 4.8.1 du présent accord.
L'amplitude des journées travaillées et la charge de travail des salariés bénéficiant d'une convention de forfait en jours sur l'année devront rester raisonnables et assurer une bonne répartition, dans le temps, du travail des intéressés.
Afin de garantir le droit à la santé, à la sécurité, au repos et à l'articulation entre vie professionnelle et vie privée, l'employeur du salarié ayant conclu une convention de forfait annuel en jours assure le suivi régulier de l'organisation du travail de l'intéressé, de sa charge de travail et de l'amplitude de ses journées de travail.
L'amplitude des journées de travail et la charge de travail des salariés doivent permettre aux salariés de concilier vie professionnelle et vie privée.
Le salarié tient informé son responsable hiérarchique des évènements ou éléments qui accroissent de façon inhabituelle ou anormale sa charge de travail.
L'outil de suivi mentionné à l'article 4.8.1 permet de déclencher l'alerte.
En cas de difficulté inhabituelle portant sur ces aspects d'organisation et de charge de travail ou en cas de difficulté liée à l'isolement professionnel du salarié, celui-ci a la possibilité d'émettre, par écrit, une alerte auprès de l'employeur ou de son représentant, qui reçoit le salarié dans les 8 jours et formule par écrit les mesures qui seront, le cas échéant, mises en place pour permettre un traitement effectif de la situation. Ces mesures font l'objet d'un compte rendu écrit et d'un suivi.
Par ailleurs, si l'employeur est amené à constater que l'organisation du travail du salarié et/ ou que 
```

---

## q129 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quels sont les délais de préavis applicables en cas de rupture du contrat de travail pour un cadre relevant de la convention collective de l'assurance (IDCC 1043) ?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q131 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Dans la convention collective de la métallurgie (IDCC 44), quel est le salaire minimum garanti pour un ouvrier de catégorie 3 en 2024 ?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q134 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel est le délai de préavis applicable à un ingénieur informatique en CDI travaillant pour une entreprise de conseil en systèmes d'information relevant de la convention collective de l'informatique (IDCC 1486)?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q137 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel est le délai de préavis applicable à un ingénieur informatique en CDI travaillant pour une entreprise de conseil en systèmes d'information relevant de la convention collective de l'informatique (IDCC 1486)?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q140 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Dans la convention collective de la métallurgie (IDCC 44), quel est le salaire minimum garanti pour un ouvrier de catégorie 3 en 2024 ?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q142 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel est le délai de préavis applicable à un ingénieur informatique en CDI travaillant pour une entreprise de conseil en systèmes d'information relevant de la convention collective de l'informatique (IDCC 1486)?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q145 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel est le délai de rétractation applicable lors de la signature d'un contrat de travail à distance pour un salarié en télétravail total ?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---

## q148 · unanswerable · tier 1

- [ ] verdict
- Fix: 

**Question.** Quel est le montant du complément de salaire prévu pour les cadres en télétravail dans la convention collective de l'informatique (IDCC 1486)?

**Drafted answer.** Le corpus ne permet pas de répondre à cette question.

**Source.** _None — this question is meant to be unanswerable._

---
