# Failure catalogue

Configuration `filtered`, 142 questions, 31 with something wrong (21.8%).
Generator `claude-haiku-4-5-20251001`, judge `claude-sonnet-4-5-20250929`.

## What went wrong, and how often

| failure | n | share | what it means |
|---|---|---|---|
| `retrieval-miss` | 4 | 2.8% | the governing article never reached the model — an indexing problem, not a model problem |
| `generation-miss` | 10 | 7.0% | the governing article was in context and the answer was still wrong |
| `false-refusal` | 10 | 7.0% | refused a question the corpus answers |
| `citation-miss` | 7 | 4.9% | the answer was right but cited the wrong articles |

The split between `retrieval-miss` and `generation-miss` is the one that matters. The first
means the governing article never reached the model, and no amount of prompting will fix it.
The second means it was there and the answer was still wrong. A single accuracy number
merges the two and points at neither.

## `retrieval-miss` — 4

_the governing article never reached the model — an indexing problem, not a model problem_

### q035 · general · tier 1

**Question.** Dans quels cas un salarié peut-il travailler plus de 8 heures par jour, selon la négociation collective ?

**Expected.** Un salarié peut dépasser 8 heures par jour s'il exerce des activités caractérisées par l'éloignement entre son domicile et son lieu de travail, des activités de garde ou de surveillance nécessitant la protection des biens et des personnes, ou des activités nécessitant d'assurer la continuité du service ou de la production.

**Produced.** Selon les extraits fournis, un salarié peut travailler plus de 8 heures par jour en cas d'activité accrue ou pour des motifs liés à l'organisation de l'entreprise, à condition que ce dépassement ne porte pas la durée quotidienne à plus de 12 heures. Un accord d'entreprise ou de branche peut également prévoir d'autres conditions de dépassement déterminées par décret.

**Required.** code:R3122-7 (code R3122-7)

**Retrieved.** code:L3121-19 (code L3121-19), code:L3122-17 (code L3122-17), code:D3131-6 (code D3131-6), code:L3121-23 (code L3121-23), convention:5851878 (convention KALIARTI000005851878)

**Cited.** code:L3121-19, code:L3122-17

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate mentionne des motifs généraux (activité accrue, organisation de l'entreprise) qui ne correspondent pas aux trois cas spécifiques énoncés dans la référence (éloignement domicile-travail, garde/surveillance, continuité du service/production).

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

**Judge.** La réponse candidate affirme que l'accord cessera au 31 décembre 2025, ce qui contredit directement la référence qui indique une durée indéterminée (donc sans date de fin).

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

**Judge.** La réponse candidate indique une date précise (1er avril 2025) alors que la référence stipule que l'avenant prend effet à compter de sa signature sous réserve du droit d'opposition, sans mentionner cette date spécifique.

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

**Judge.** La réponse candidate indique une date d'entrée en vigueur du 1er avril 2025, alors que la référence précise que c'est le 1er janvier 2020, soit une contradiction factuelle sur la date.

**Analyse:**

---

## `generation-miss` — 10

_the governing article was in context and the answer was still wrong_

### q038 · general · tier 1

**Question.** Combien de temps minimum doit s'écouler entre deux réunions du comité social et économique lors d'une procédure de licenciement collectif ?

**Expected.** Au moins quinze jours doivent séparer les deux réunions du comité social et économique.

**Produced.** Le délai minimum entre deux réunions du comité social et économique dépend de la taille de l'entreprise : quinze jours pour les entreprises d'au moins cinquante salariés, et quatorze jours pour celles employant moins de cinquante salariés.

**Required.** code:L1233-30 (code L1233-30)

**Retrieved.** code:L1233-30 (code L1233-30), code:L1233-8 (code L1233-8), code:L1233-29 (code L1233-29), code:L1235-7 (code L1235-7), code:L1233-28 (code L1233-28)

**Cited.** code:L1233-30, code:L1233-29

**recall@5** 1.00 · **citation F1** 0.67

**Judge.** La réponse candidate indique deux délais différents selon la taille de l'entreprise (15 jours et 14 jours) alors que la référence établit un délai unique de 15 jours minimum, ce qui constitue une contradiction factuelle sur les chiffres.

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

**Judge.** La réponse candidate ajoute une déduction supplémentaire (emplois pourvus en remplacement sur le même poste) qui n'est pas mentionnée dans la référence, laquelle ne prévoit de déduire que les salariés reclassés dans l'entreprise ou le groupe.

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

**Judge.** La réponse candidate donne trois fréquences différentes selon différents accords au lieu de répondre précisément "une fois par an" comme indiqué dans la référence, ce qui dilue et contredit la réponse attendue.

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

**Judge.** La réponse candidate indique une valeur du point de 20,21 € alors que la référence établit clairement qu'elle est de 19,81 €, soit une différence de 0,40 € qui constitue une contradiction factuelle sur un chiffre précis.

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

**Judge.** La réponse candidate commence par "Non" alors que la référence indique clairement "Oui", créant une contradiction frontale sur la possibilité de refus, même si elle mentionne ensuite correctement les conditions de dispense.

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

**Judge.** La réponse candidate indique une date d'application au 1er avril 2025, alors que la référence précise que les nouvelles cotisations s'appliquent à effet du 1er juillet 2024, soit une différence de 9 mois.

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

**Judge.** La réponse candidate indique 1,5 mois de salaire pour 5 ans d'ancienneté alors que la référence établit clairement 7 mois de salaire (3 mois de base + 4 mois supplémentaires), soit une différence majeure sur le montant dû.

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

**Judge.** La réponse candidate indique deux délais différents selon la taille de l'entreprise (15 jours et 14 jours) alors que la référence établit un délai unique de 15 jours minimum, ce qui constitue une contradiction factuelle sur les chiffres.

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

**Judge.** La candidate affirme que l'obligation d'informer l'administration commence à "moins de dix salariés", alors que la référence indique clairement "à partir de dix salariés", ce qui contredit directement le seuil demandé.

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

**Judge.** La réponse candidate ajoute une condition restrictive (nécessité d'un accord collectif) qui n'est pas mentionnée dans la référence, ce qui change substantiellement la portée de l'obligation de l'employeur.

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

**Judge.** La réponse candidate refuse de répondre en invoquant l'absence d'information spécifique à l'Alsace-Moselle, alors que la référence fournit une réponse précise sur les pouvoirs de l'inspecteur du travail (saisine du juge en référé, fermeture possible, astreinte).

**Analyse:**

---

### q068 · override · tier 1

**Question.** À partir de quand les dispositions de cet arrêté s'appliquent-elles aux entreprises concernées ?

**Expected.** À partir de la publication du présent arrêté, pour la durée restant à courir et aux conditions prévues par l'avenant.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de répondre de manière univoque à cette question. Bien que plusieurs extraits mentionnent des dates d'application (premier jour du mois suivant la publication, 6 mois après publication), ils concernent des conventions collectives différentes et sans connaître l'arrêté spécifique auquel vous faites référence, je ne peux pas déterminer quelle disposition s'applique.  SOURCES: [convention:30160114], [convention:29264476], [convention:44253149]

**Required.** convention:5851874 (convention KALIARTI000005851874)

**Retrieved.** code:L1233-1 (code L1233-1), convention:30160114 (convention 13), convention:29264476 (convention KALIARTI000029264476), convention:44253149 (convention 13.2), convention:5851633 (convention KALIARTI000005851633)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant un manque d'information, alors que la référence fournit une réponse claire indiquant que les dispositions s'appliquent à partir de la publication de l'arrêté.

**Analyse:**

---

### q069 · override · tier 1

**Question.** À partir de quand les dispositions de cet avenant sur la formation professionnelle s'appliquent-elles à tous les employeurs et salariés du secteur ?

**Expected.** À partir de la publication du présent arrêté, pour la durée restant à courir selon les conditions prévues par l'avenant.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de déterminer une date précise d'application unique pour tous les avenants sur la formation professionnelle. Bien que certains extraits mentionnent que les avenants entrent en vigueur "le premier jour du mois civil qui suit la publication de l'arrêté ministériel d'extension au Journal officiel" [convention:23561420, convention:43104151], aucun extrait ne précise la date effective de publication de ces arrêtés.

**Required.** convention:5851894 (convention KALIARTI000005851894)

**Retrieved.** convention:5851890 (convention KALIARTI000005851890), convention:23561420 (convention 4), convention:43104151 (convention 5), convention:47007033 (convention KALIARTI000047007033), convention:42258108 (convention 3)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant l'insuffisance des informations, alors que la référence fournit une réponse claire indiquant que l'application se fait à partir de la publication de l'arrêté.

**Analyse:**

---

### q070 · override · tier 1

**Question.** À partir de quand cet avenant devient-il applicable dans l'entreprise ?

**Expected.** L'avenant entre en vigueur au premier jour du mois suivant la date de publication de son arrêté d'extension.

**Produced.** INSUFFISANT  SOURCES: Aucune source applicable - la question ne précise pas quel avenant est concerné, et les extraits fournis présentent plusieurs avenants avec des dates d'entrée en vigueur différentes selon leur nature et leur statut d'extension.

**Required.** convention:19385004 (convention 5)

**Retrieved.** convention:49300406 (convention 6), convention:26804535 (convention 3), convention:19861279 (convention 2), convention:21237448 (convention 3), convention:35330688 (convention KALIARTI000035330688)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant un manque de précision, alors que la référence fournit une réponse claire sur la date d'applicabilité de l'avenant concerné.

**Analyse:**

---

### q071 · override · tier 1

**Question.** À partir de quand les nouveaux salaires minimums pour les ingénieurs et cadres s'appliquent-ils dans les entreprises de la branche ?

**Expected.** Les nouveaux salaires minimums entrent en vigueur au premier jour du mois civil suivant la publication de l'arrêté ministériel au Journal officiel, et au plus tard le 1er janvier 2009.

**Produced.** INSUFFISANT  Les extraits fournis indiquent que les nouveaux salaires entrent en vigueur "au premier jour du mois civil suivant la date de publication de l'arrêté ministériel d'extension au Journal officiel", mais ils ne précisent pas la date exacte de cette publication pour les avenants mentionnés.  SOURCES: [convention:23105066], [convention:19861272], [convention:19861271], [convention:35330687]

**Required.** convention:19861272 (convention 2)

**Retrieved.** convention:23105066 (convention 2), convention:19861272 (convention 2), convention:19861271 (convention 1), convention:5851847 (convention KALIARTI000005851847), convention:35330687 (convention KALIARTI000035330687)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant une information manquante, alors que la référence fournit une réponse complète incluant la date butoir du 1er janvier 2009, élément central omis par la candidate.

**Analyse:**

---

### q079 · override · tier 1

**Question.** À partir de quand cet accord commence-t-il à s'appliquer ?

**Expected.** L'accord prend effet au premier jour du mois civil suivant la date de publication de l'arrêté ministériel d'extension au Journal officiel.

**Produced.** INSUFFISANT  Les extraits fournis concernent plusieurs accords différents avec des dates d'effet distinctes. Sans savoir quel accord spécifique vous visez, je ne peux pas donner une réponse précise.  SOURCES: [convention:42668886], [convention:5851800], [convention:47348436], [convention:22017901], [convention:19732106]

**Required.** convention:29264487 (convention 3)

**Retrieved.** convention:42668886 (convention 9), convention:5851800 (convention 3), convention:47348436 (convention 4), convention:22017901 (convention 10), convention:19732106 (convention 5)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant un manque de précision, alors que la référence fournit une réponse claire sur la date d'application de l'accord concerné.

**Analyse:**

---

### q087 · override · tier 1

**Question.** Pour combien de temps cet accord sur la formation professionnelle a-t-il été signé ?

**Expected.** Pour une durée indéterminée.

**Produced.** INSUFFISANT  Les extraits fournis ne permettent pas de répondre de manière univoque à cette question. Bien que l'extrait [convention:41549570] indique que "Le présent accord est conclu pour une durée indéterminée", il n'est pas clair quel accord spécifique est visé par votre question, car plusieurs accords sur la formation professionnelle sont mentionnés dans les extraits (celui de 2008, 2019, etc.).  SOURCES: [convention:41549570]

**Required.** convention:41549570 (convention 29)

**Retrieved.** convention:22017903 (convention KALIARTI000022017903), convention:47007033 (convention KALIARTI000047007033), convention:5851890 (convention KALIARTI000005851890), convention:23561415 (convention KALIARTI000023561415), convention:41549570 (convention 29)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La candidate refuse de répondre en invoquant une ambiguïté, alors que la référence donne une réponse claire (durée indéterminée), ce qui constitue une omission de l'élément central demandé.

**Analyse:**

---

### q094 · override · tier 1

**Question.** Quel délai minimum faut-il respecter pour dénoncer cet accord ?

**Expected.** Un préavis minimal de 3 mois doit être donné à toutes les organisations signataires par lettre recommandée avec accusé de réception.

**Produced.** INSUFFISANT  Les extraits fournis concernent plusieurs accords différents avec des délais de préavis variables : 3 mois [convention:44159329, convention:47652071, convention:42668889], 2 mois [convention:28465410], ou 6 mois [convention:24683677]. Sans savoir quel accord spécifique vous concerne, je ne peux pas donner une réponse précise.  SOURCES: [convention:44159329], [convention:47652071], [convention:42668889], [convention:28465410], [convention:24683677]

**Required.** convention:46033546 (convention 4)

**Retrieved.** convention:44159329 (convention 8), convention:47652071 (convention KALIARTI000047652071), convention:42668889 (convention 11), convention:28465410 (convention 9.2), convention:24683677 (convention 5)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de donner le délai de 3 mois indiqué dans la référence, alors que la question porte sur un accord spécifique ("cet accord") pour lequel la référence fournit une réponse précise.

**Analyse:**

---

### q095 · override · tier 1

**Question.** À partir de quand cet accord commence-t-il à s'appliquer après sa publication officielle ?

**Expected.** L'accord prend effet le premier jour du mois civil suivant la date de publication de l'arrêté d'extension au Journal officiel.

**Produced.** INSUFFISANT  Les extraits fournis montrent que différents accords ont des dates d'effet différentes : certains prennent effet "le premier jour du mois civil suivant la publication", d'autres "dès publication au Journal officiel", sans préciser quel accord spécifique vous visez.  SOURCES: [convention:27661902], [convention:28465408], [convention:5851753], [convention:47348436], [convention:22017901]

**Required.** convention:46033608 (convention 5)

**Retrieved.** convention:27661902 (convention 8), convention:28465408 (convention 9), convention:5851753 (convention 3), convention:47348436 (convention 4), convention:22017901 (convention 10)

**recall@5** 0.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant un manque de précision, alors que la référence fournit une réponse claire et précise sur la date d'effet de l'accord concerné.

**Analyse:**

---

### q108 · dated · tier 1

**Question.** Quand l'entreprise doit-elle informer l'administration du travail en cas de difficultés financières graves ?

**Expected.** L'employeur, l'administrateur ou le liquidateur doit transmettre une copie du jugement au directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi en cas de procédure de sauvegarde, de redressement ou de liquidation judiciaire.

**Produced.** INSUFFISANT  SOURCES: Les extraits fournis ne précisent pas le délai dans lequel l'entreprise doit informer l'administration du travail en cas de difficultés financières graves. L'article [code:R3232-6] mentionne les difficultés financières mais ne fixe aucun délai d'information.

**Required.** code:R1233-7 (code R1233-7)

**Retrieved.** code:R1233-7 (code R1233-7), code:D1233-39 (code D1233-39), code:R3232-6 (code R3232-6), convention:30579163 (convention KALIARTI000030579163), code:L1221-16 (code L1221-16)

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La réponse candidate refuse de répondre en invoquant l'absence d'information sur le délai, alors que la référence indique clairement l'obligation d'informer (transmission d'une copie du jugement au DREETS) sans que la question porte spécifiquement sur un délai.

**Analyse:**

---

## `citation-miss` — 7

_the answer was right but cited the wrong articles_

### q004 · general · tier 2

**Question.** Dans une petite entreprise sans délégués du personnel, qui peut accompagner un salarié lors de l'entretien avant son licenciement ?

**Expected.** Un conseiller du salarié inscrit sur une liste officielle peut l'assister. Cette liste est établie par l'autorité administrative après consultation des organisations patronales et syndicales, et ne peut pas inclure de conseillers prud'hommes en activité.

**Produced.** Dans une petite entreprise sans institutions représentatives du personnel, le salarié peut se faire assister lors de l'entretien préalable au licenciement soit par une personne de son choix appartenant au personnel de l'entreprise, soit par un conseiller du salarié inscrit sur une liste dressée par l'autorité administrative.

**Required.** code:L1232-7 (code L1232-7)

**Retrieved.** code:L1232-7 (code L1232-7), code:L1232-4 (code L1232-4), code:L1233-13 (code L1233-13), code:R1232-2 (code R1232-2), code:L1237-12 (code L1237-12)

**Cited.** code:L1232-4

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La réponse candidate affirme correctement qu'un conseiller du salarié inscrit sur une liste dressée par l'autorité administrative peut assister le salarié, ce qui correspond au fond de la référence, et ajoute une information supplémentaire exacte sur la possibilité d'être assisté par une personne du personnel.

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

**Judge.** La réponse candidate affirme correctement que les décrets en Conseil d'État fixent les modalités d'application concernant la répartition des horaires, ce qui correspond au fond de la référence, et ajoute des détails exacts sur les niveaux d'entreprise sans contredire l'élément central.

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

**Judge.** La réponse candidate affirme correctement que l'enquêteur peut refuser une enquête proposée, ce qui correspond au fond de la référence, et ajoute des détails procéduraux exacts sur les modalités de refus sans contredire le principe établi par la référence.

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

**Judge.** La réponse candidate indique les mêmes pourcentages que la référence (12% pour l'enfant de 16 ans et 15% pour celui de 20 ans) et ajoute des précisions exactes sur les conditions d'éligibilité pour l'enfant de 20 ans, sans contredire les éléments essentiels de la référence.

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

**Judge.** La réponse candidate affirme exactement les mêmes éléments que la référence (signature électronique, règlement européen n° 910-2014 du 23 juillet 2014, article 1367 du code civil), avec simplement un détail supplémentaire exact sur la mise en place du dispositif.

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

**Judge.** La réponse candidate affirme le même délai de 3 mois et les mêmes modalités (préavis à toutes les organisations signataires par lettre recommandée avec accusé de réception) que la référence, avec un détail supplémentaire exact sur la sanction en cas de non-respect.

**Analyse:**

---

### q103 · override · tier 2

**Question.** Un enquêteur dans un institut de sondage peut-il refuser les missions qu'on lui propose ?

**Expected.** Oui, mais cela dépend de son statut. Les enquêteurs vacataires peuvent refuser les enquêtes proposées. En revanche, les chargés d'enquête titulaires d'un contrat à durée indéterminée doivent effectuer toutes les enquêtes qui leur sont demandées.

**Produced.** La réponse dépend du statut de l'enquêteur. Un enquêteur vacataire peut accepter ou refuser librement toute mission qui lui est proposée sans avoir à en justifier le motif. En revanche, un chargé d'enquête (CE) titulaire d'un contrat à durée indéterminée doit effectuer toutes les enquêtes qui lui sont demandées, car il est placé sous subordination exclusive de son employeur.

**Required.** convention:47652015 (convention KALIARTI000047652015)

**Retrieved.** convention:5851296 (convention 1), convention:47652015 (convention KALIARTI000047652015), convention:5851347 (convention 46), convention:47006875 (convention 3), convention:5851346 (convention 45)

**Cited.** convention:5851347, convention:5851346

**recall@5** 1.00 · **citation F1** 0.00

**Judge.** La réponse candidate affirme exactement la même distinction que la référence entre enquêteurs vacataires (qui peuvent refuser) et chargés d'enquête en CDI (qui doivent effectuer toutes les enquêtes), avec des détails supplémentaires exacts sur la subordination.

**Analyse:**

---
