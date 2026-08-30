# Gold set — rows needing a human

A second vendor's model reviewed all 150 rows. It flagged **19**

and passed the rest. Below are the flagged rows, then **8 rows it passed**, as a control.

The control is the point: if you agree with all of them, that is evidence the reviewer works.

If you disagree with any, the reviewer is not trustworthy and the flagged list is not the whole story.

Mark each: `[x]` the answer follows from the article · `[!]` it does not, write the right one on `Fix:` ·

`[-]` drop the question. Then run `pnpm gold:apply-review`.

---

## q004 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Dans une petite entreprise sans délégués du personnel, qui peut accompagner un salarié lors de l'entretien avant son licenciement ?

**Answer on file.** Un conseiller du salarié inscrit sur une liste officielle peut l'assister. Cette liste est établie par l'autorité administrative après consultation des organisations patronales et syndicales, et ne peut pas inclure de conseillers prud'hommes en activité.

**Source — `code:L1232-7`** (code L1232-7)

```

Le conseiller du salarié est chargé d'assister le salarié lors de l'entretien préalable au licenciement dans les entreprises dépourvues d'institutions représentatives du personnel.

Il est inscrit sur une liste arrêtée par l'autorité administrative après consultation des organisations représentatives d'employeurs et de salariés au niveau national, dans des conditions déterminées par décret.

La liste des conseillers comporte notamment le nom, l'adresse, la profession ainsi que l'appartenance syndicale éventuelle des conseillers. Elle ne peut comporter de conseillers prud'hommes en activité.

```

---

## q007 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Quand un contrat temporaire prend fin et qu'on n'embauche pas la personne en CDI, quel pourcentage de sa rémunération brute totale doit-on lui verser en compensation ?

**Answer on file.** 10 % de la rémunération totale brute versée au salarié. Cette indemnité s'ajoute au dernier salaire et est versée en même temps.

**Source — `code:L1243-8`** (code L1243-8)

```

Lorsque, à l'issue d'un contrat de travail à durée déterminée, les relations contractuelles de travail ne se poursuivent pas par un contrat à durée indéterminée, le salarié a droit, à titre de complément de salaire, à une indemnité de fin de contrat destinée à compenser la précarité de sa situation.

Cette indemnité est égale à 10 % de la rémunération totale brute versée au salarié.

Elle s'ajoute à la rémunération totale brute due au salarié. Elle est versée à l'issue du contrat en même temps que le dernier salaire et figure sur le bulletin de salaire correspondant.

```

---

## q009 · general · reviewer says **bad_question** (high)

\> Le texte source vise uniquement la Moselle, le Bas-Rhin et le Haut-Rhin, pas les Vosges.

- [x] verdict

- Fix: 

**Question.** Dans une carrière des Vosges, combien d'heures de repos minimum un salarié doit-il recevoir quand un dimanche et un jour férié se suivent ?

**Answer on file.** Trente-six heures de repos, calculées à partir de minuit et se prolongeant jusqu'à dix-huit heures le second jour.

**Source — `code:L3134-3`** (code L3134-3)

```

Dans les exploitations de mines, salines et carrières, établissements industriels, chantiers du bâtiment et du génie civil, chantiers navals, le repos donné aux salariés est de :

1° Vingt-quatre heures pour chaque dimanche ou jour férié ;

2° Trente-six heures pour un dimanche et un jour férié consécutifs ;

3° Quarante-huit heures pour les fêtes de Noël, Pâques et Pentecôte.

La période de repos est calculée à partir de minuit et, dans le cas d'un dimanche et d'un jour férié consécutifs, se prolonge jusqu'à dix-huit heures le second jour.

Dans les exploitations où l'on travaille régulièrement par équipe de jour et de nuit, lorsque l'activité est interrompue pendant les vingt-quatre heures qui suivent le commencement de la période de repos, cette dernière ne peut débuter avant dix-huit heures du jour ouvrable précédent ni après six heures du dimanche ou du jour férié.

```

---

## q013 · general · reviewer says **bad_question** (high)

\> Le texte ne dit pas que l'information dans le délai d'un mois concerne l'intention de mettre en place un congé de reclassement.

- [-] verdict

- Fix: 

**Question.** Dans quel délai une entreprise doit-elle informer les préfets de son intention de mettre en place un congé de reclassement après avoir reçu une notification officielle ?

**Answer on file.** L'entreprise doit informer les préfets dans un délai d'un mois à compter de la notification de la décision.

**Source — `code:D1233-39`** (code D1233-39)

```

L'entreprise informe dans un délai d'un mois à compter de la notification de la décision prévue à l'article D. 1233-38, le ou les préfets dans le ou les départements concernés si elle entend satisfaire à cette obligation par la voie d'une convention signée avec l'Etat ou par celle d'un accord collectif.

Dans ce dernier cas, l'entreprise leur transmet également la copie de cet accord, son récépissé de dépôt et l'ensemble des informations, notamment financières, permettant d'évaluer la portée des engagements y figurant.

Lorsque le siège de l'entreprise n'est pas situé dans le ou les bassins d'emploi concernés, elle désigne, en outre, une personne chargée de la représenter devant le ou les préfets dans le ou les départements.

```

---

## q016 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Si je veux me faire accompagner lors de la discussion avec mon employeur sur la fin de mon contrat d'un commun accord, qui peut m'assister ?

**Answer on file.** Vous pouvez vous faire assister soit par une personne de votre choix travaillant dans l'entreprise (salarié, représentant du personnel, etc.), soit, s'il n'y a pas de représentants du personnel, par un conseiller figurant sur une liste établie par l'administration.

**Source — `code:L1237-12`** (code L1237-12)

```

Les parties au contrat conviennent du principe d'une rupture conventionnelle lors d'un ou plusieurs entretiens au cours desquels le salarié peut se faire assister :

1° Soit par une personne de son choix appartenant au personnel de l'entreprise, qu'il s'agisse d'un salarié titulaire d'un mandat syndical ou d'un salarié membre d'une institution représentative du personnel ou tout autre salarié ;

2° Soit, en l'absence d'institution représentative du personnel dans l'entreprise, par un conseiller du salarié choisi sur une liste dressée par l'autorité administrative.

Lors du ou des entretiens, l'employeur a la faculté de se faire assister quand le salarié en fait lui-même usage. Le salarié en informe l'employeur auparavant ; si l'employeur souhaite également se faire assister, il en informe à son tour le salarié.

L'employeur peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise ou, dans les entreprises de moins de cinquante salariés, par une personne appartenant à son organisation syndicale d'employeurs ou par un autre employeur relevant de la même branche.

```

---

## q017 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Quand faut-il informer l'administration après avoir licencié 7 salariés pour des raisons économiques sur une période d'un mois ?

**Answer on file.** L'employeur doit informer par écrit le directeur régional dans les huit jours de l'envoi des lettres de licenciement aux salariés.

**Source — `code:D1233-3`** (code D1233-3)

```

En cas de licenciement pour motif économique de moins de dix salariés dans une même période de trente jours, l'employeur informe par écrit le directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi des licenciements prononcés dans les huit jours de l'envoi des lettres de licenciement aux salariés concernés.

L'employeur précise :

1° Son nom et son adresse ;

2° La nature de l'activité et l'effectif de l'entreprise ou de l'établissement ;

3° Les nom, prénoms, nationalité, date de naissance, sexe, adresse, emploi et qualification du ou des salariés licenciés ;

4° La date de la notification des licenciements aux salariés concernés.

```

---

## q021 · general · reviewer says **bad_question** (low)

\> Le texte vise spécifiquement le non-paiement total ou partiel du salaire minimum légal ou conventionnel, alors que la question parle plus largement d'un paiement incorrect.

- [-] verdict

- Fix: 

**Question.** Si un agent de contrôle m'informe que l'un de mes sous-traitants ne paie pas correctement ses salariés, qu'est-ce que je dois faire et dans quel délai ?

**Answer on file.** Vous devez enjoindre aussitôt par écrit au sous-traitant de faire cesser cette situation sans délai. Si le sous-traitant ne répond pas par écrit dans le délai fixé par décret, vous devez aussitôt en informer l'agent de contrôle.

**Source — `code:L3245-2`** (code L3245-2)

```

Le maître d'ouvrage ou le donneur d'ordre, informé par écrit par l'un des agents de contrôle mentionnés à l'article L. 8271-1-2 du non-paiement partiel ou total du salaire minimum légal ou conventionnel dû au salarié de son cocontractant, d'un sous-traitant direct ou indirect ou d'un cocontractant d'un sous-traitant, enjoint aussitôt, par écrit, à ce sous-traitant ou à ce cocontractant de faire cesser sans délai cette situation.

Le sous-traitant ou le cocontractant mentionné au premier alinéa du présent article informe, par écrit, le maître d'ouvrage ou le donneur d'ordre de la régularisation de la situation. Ce dernier en transmet une copie à l'agent de contrôle mentionné au même premier alinéa.

En l'absence de réponse écrite du sous-traitant ou du cocontractant dans un délai fixé par décret en Conseil d'Etat, le maître d'ouvrage ou le donneur d'ordre en informe aussitôt l'agent de contrôle.

Pour tout manquement à ses obligations d'injonction et d'information mentionnées aux premier et troisième alinéas, le maître d'ouvrage ou le donneur d'ordre est tenu solidairement avec l'employeur du salarié au paiement des rémunérations, indemnités et charges dues, dans des conditions fixées par décret en Conseil d'Etat.

Le présent article ne s'applique pas au particulier qui contracte avec une entreprise pour son usage personnel, celui de son conjoint, de son partenaire lié par un pacte civil de solidarité, de son concubin ou de ses ascendants ou descendants.

```

---

## q022 · general · reviewer says **bad_question** (high)

\> Le texte n'indique pas que la règle de fin à la réalisation de l'objet avec deux mois de prévenance s'applique au CDD de remplacement d'un salarié absent.

- [-] verdict

- Fix: 

**Question.** Quand est-ce qu'un contrat à durée déterminée conclu pour remplacer un salarié absent prend-il fin, et quel délai doit-on respecter ?

**Answer on file.** Il prend fin avec la réalisation de l'objet pour lequel il a été conclu, après un délai de prévenance d'au moins deux mois.

**Source — `code:L1243-5`** (code L1243-5)

```

Le contrat de travail à durée déterminée cesse de plein droit à l'échéance du terme. Lorsqu'il est conclu en application du 6° de l'article L. 1242-2, il prend fin avec la réalisation de l'objet pour lequel il a été conclu après un délai de prévenance au moins égal à deux mois.

Toutefois, ce principe ne fait pas obstacle à l'application des dispositions relatives à la rupture du contrat de travail à durée déterminée :

1° Des salariés victimes d'un accident du travail ou d'une maladie professionnelle, prévues à l'article L. 1226-19 ;

2° Des salariés titulaires d'un mandat de représentation mentionnés à l'article L. 2412-1.

```

---

## q024 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Quel délai l'administration a-t-elle pour vérifier que tout s'est déroulé correctement avant un licenciement collectif dans une petite entreprise ?

**Answer on file.** L'autorité administrative dispose de vingt et un jours à compter de la notification du projet de licenciement pour effectuer cette vérification.

**Source — `code:L1233-53`** (code L1233-53)

```

Dans les entreprises de moins de cinquante salariés, l'autorité administrative vérifie, dans le délai de vingt et un jours à compter de la date de la notification du projet de licenciement, que :

1° Les représentants du personnel ont été informés, réunis et consultés conformément aux dispositions légales et conventionnelles en vigueur ;

2° Les obligations relatives à l'élaboration des mesures sociales prévues par l'article L. 1233-32 ou par des conventions ou accords collectifs de travail ont été respectées ;

3° Les mesures prévues à l'article L. 1233-32 seront effectivement mises en oeuvre.

```

---

## q025 · general · reviewer says **bad_question** (low)

\> Le texte ne précise pas un ordre d'information « en premier lieu » et ne rattache pas clairement le préfet à la notification initiale du projet de fermeture.

- [-] verdict

- Fix: 

**Question.** Qui doit être informé en premier lieu quand une entreprise envisage une fermeture d'établissement ?

**Answer on file.** Le préfet du département où l'établissement a son siège, ainsi que le directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi du ressort concerné.

**Source — `code:R1233-15-1`** (code R1233-15-1)

```

L'autorité administrative visée aux articles L. 1233-57-13 et L. 1233-57-21 est le préfet du département dans lequel l'établissement a son siège.

Le directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi dans le ressort duquel se trouve l'établissement en cause ainsi que, le cas échéant, celui désigné en application de l'article R. 1233-3-5, est destinataire des informations et rapports mentionnés aux articles L. 1233-57-12, L. 1233-57-17 et L. 1233-57-20.

La notification du projet de fermeture prévue au premier alinéa de l'article L. 1233-57-12 est adressée, par tout moyen permettant de conférer une date certaine.

```

---

## q027 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Combien de fois par an maximum peut-on modifier le contrat d'un salarié pour lui proposer des heures supplémentaires temporaires, en dehors des remplacements ?

**Answer on file.** Une convention ou un accord de branche peut prévoir jusqu'à 8 avenants par an et par salarié pour augmenter temporairement la durée de travail, en dehors des cas de remplacement d'un salarié absent.

**Source — `code:L3123-22`** (code L3123-22)

```

Une convention ou un accord de branche étendu peut prévoir la possibilité, par un avenant au contrat de travail, d'augmenter temporairement la durée de travail prévue par le contrat.

La convention ou l'accord :

1° Détermine le nombre maximal d'avenants pouvant être conclus, dans la limite de huit par an et par salarié, en dehors des cas de remplacement d'un salarié absent nommément désigné ;

2° Peut prévoir la majoration salariale des heures effectuées dans le cadre de cet avenant ;

3° Détermine les modalités selon lesquelles les salariés peuvent bénéficier prioritairement des compléments d'heures.

Les heures complémentaires accomplies au delà de la durée déterminée par l'avenant donnent lieu à une majoration salariale qui ne peut être inférieure à 25 %.

```

---

## q034 · general · reviewer says **bad_question** (high)

\> Le texte concerne le dépassement en urgence de la durée quotidienne maximale de travail, pas simplement le fait de travailler plus longtemps que d'habitude.

- [-] verdict

- Fix: 

**Question.** Si mon entreprise doit faire travailler les salariés plus longtemps que d'habitude à cause d'une situation d'urgence, dans quel délai dois-je informer l'inspecteur du travail et recevoir sa réponse ?

**Answer on file.** L'employeur doit présenter immédiatement une demande de régularisation à l'inspecteur du travail. L'inspecteur du travail fait connaître sa décision dans un délai de quinze jours à compter de la date de réception de la demande.

**Source — `code:D3121-6`** (code D3121-6)

```

En cas d'urgence, l'employeur peut dépasser sous sa propre responsabilité, dans les hypothèses envisagées l'article D. 3121-4, à la durée quotidienne maximale du travail.

S'il n'a pas encore adressé de demande de dépassement, il présente immédiatement à l'inspecteur du travail une demande de régularisation accompagnée des justifications et avis mentionnés à l'article D. 3121-5 et de toutes explications nécessaires sur les causes ayant nécessité une prolongation de la durée quotidienne du travail sans autorisation préalable.

S'il se trouve dans l'attente d'une réponse à une demande de dépassement, il informe immédiatement l'inspecteur du travail de l'obligation où il s'est trouvé d'anticiper la décision attendue et en donne les raisons.

L'inspecteur du travail fait connaître sa décision dans un délai de quinze jours à compter de la date de réception de la demande à l'employeur et aux représentants du personnel.

```

---

## q039 · general · reviewer says **bad_question** (high)

\> Le texte ne donne pas la durée du délai de carence ni sa formule de calcul, seulement le principe qu'il dépend de la durée du contrat.

- [-] verdict

- Fix: 

**Question.** Après qu'un contrat à durée déterminée se termine, combien de temps l'entreprise doit-elle attendre avant de pouvoir embaucher quelqu'un d'autre sur le même poste avec un nouveau contrat à durée déterminée ?

**Answer on file.** L'entreprise doit respecter un délai de carence calculé en fonction de la durée du contrat qui vient de prendre fin, incluant ses renouvellements éventuels. Ce délai est compté en jours d'ouverture de l'entreprise ou de l'établissement.

**Source — `code:L1244-3`** (code L1244-3)

```

A l'expiration d'un contrat de travail à durée déterminée, il ne peut être recouru, pour pourvoir le poste du salarié dont le contrat a pris fin, ni à un contrat à durée déterminée ni à un contrat de travail temporaire, avant l'expiration d'un délai de carence calculé en fonction de la durée du contrat incluant, le cas échéant, son ou ses renouvellements. Les jours pris en compte pour apprécier le délai devant séparer les deux contrats sont les jours d'ouverture de l'entreprise ou de l'établissement concerné.

Sans préjudice des dispositions de l'article L. 1242-1, une convention ou un accord de branche étendu peut fixer les modalités de calcul de ce délai de carence.

```

---

## q043 · general · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Dans une petite entreprise sans représentants du personnel qui doit mettre en place un plan de sauvegarde de l'emploi, à qui faut-il communiquer ce plan en même temps que la notification du projet de licenciement ?

**Answer on file.** Le plan doit être communiqué à l'autorité administrative en même temps que la notification du projet de licenciement.

**Source — `code:L1233-49`** (code L1233-49)

```

Lorsque l'entreprise est dépourvue de comité social et économique et est soumise à l'obligation d'établir un plan de sauvegarde de l'emploi, ce plan ainsi que les informations destinées aux représentants du personnel mentionnées à l'article L. 1233-31 sont communiqués à l'autorité administrative en même temps que la notification du projet de licenciement. En outre, le plan est porté à la connaissance des salariés par tout moyen sur les lieux de travail.

```

---

## q045 · general · reviewer says **wrong** (high)

\> Le seuil de 50 % est calculé sur les suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au CSE, pas simplement sur tous les suffrages exprimés.

- [!] verdict

- Fix: Les organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité social et économique, quel que soit le nombre de votants, ou le conseil d'entreprise.
**Question.** Dans une entreprise de 60 salariés, quelles organisations peuvent signer un accord pour définir comment se fera un plan de sauvegarde de l'emploi ?

**Answer on file.** Les organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés aux dernières élections du comité social et économique, ou le conseil d'entreprise.

**Source — `code:L1233-24-1`** (code L1233-24-1)

```

Dans les entreprises de cinquante salariés et plus, un accord collectif peut déterminer le contenu du plan de sauvegarde de l'emploi mentionné aux articles L. 1233-61 à L. 1233-63 ainsi que les modalités de consultation du comité social et économique et de mise en œuvre des licenciements. Cet accord est signé par une ou plusieurs organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité social et économique, quel que soit le nombre de votants, ou par le conseil d'entreprise dans les conditions prévues à l'article L. 2321-9. L'administration est informée sans délai de l'ouverture d'une négociation en vue de l'accord précité.

```

---

## q046 · general · reviewer says **bad_question** (high)

\> La question ne précise pas quelles règles ont été méconnues, alors que le texte énumère des violations entraînant la requalification et prévoit au moins une exception.

- [-] verdict

- Fix: 

**Question.** Si un contrat de travail temporaire a été signé sans respecter certaines règles légales, quel type de contrat devient-il automatiquement ?

**Answer on file.** Il est réputé être un contrat à durée indéterminée.

**Source — `code:L1245-1`** (code L1245-1)

```

Est réputé à durée indéterminée tout contrat de travail conclu en méconnaissance des dispositions des articles L. 1242-1 à L. 1242-4, L. 1242-6, L. 1242-7, L. 1242-8-1, L. 1242-12, alinéa premier, L. 1243-11, alinéa premier, L. 1243-13-1, L. 1244-3-1 et L. 1244-4-1, et des stipulations des conventions ou accords de branche conclus en application des articles L. 1242-8, L. 1243-13, L. 1244-3 et L. 1244-4.

La méconnaissance de l'obligation de transmission du contrat de mission au salarié dans le délai fixé par l'article L. 1242-13 ne saurait, à elle seule, entraîner la requalification en contrat à durée indéterminée. Elle ouvre droit, pour le salarié, à une indemnité, à la charge de l'employeur, qui ne peut être supérieure à un mois de salaire.

```

---

## q067 · override · reviewer says **bad_question** (high)

\> L'extrait indique que l'avenant est rendu obligatoire et donne la date de l'arrêté, mais ne précise pas que son application obligatoire commence le 18 octobre 1991.

- [-] verdict

- Fix: 

**Question.** À partir de quand les salaires minimaux définis dans l'avenant du 5 juillet 1991 s'appliquent-ils obligatoirement à tous les employeurs et salariés du secteur des bureaux d'études techniques et cabinets de conseil ?

**Answer on file.** À partir du 18 octobre 1991, date de l'arrêté rendant obligatoires les dispositions de l'avenant n° 6 du 5 juillet 1991 concernant les appointements minimaux.

**Source — `convention:5851855`** (convention KALIARTI000005851855)

```

Sont rendues obligatoires, pour tous les employeurs et tous les salariés compris dans le champ d'application de la convention collective nationale des bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseils du 15 décembre 1987 tel qu'étendu par l'arrêté du 18 octobre 1989, les dispositions de l'avenant n° 6 du 5 juillet 1991 (appointements minimaux) à la convention collective susvisée.

```

---

## q098 · override · reviewer says **ok** (low)

- [x] verdict

- Fix: 

**Question.** Combien de jours d'absence sans perte de salaire une salariée peut-elle prendre en cas de fausse couche avant 22 semaines ?

**Answer on file.** Deux jours d'absence exceptionnelle, non déductibles des congés et sans réduction de salaire.

**Source — `convention:47348319`** (convention 2)

```

En cas d'interruption spontanée de grossesse avant vingt-deux semaines d'aménorrhée, la salariée bénéficie d'une autorisation d'absence exceptionnelle de deux jours, non déductibles des congés et n'entraînant pas de réduction de salaire. Cette absence peut être accolée à un arrêt de travail pour maladie éventuellement prescrit. La salariée fournit un certificat médical dans les quinze jours suivant l'événement.

Sous réserve d'être également salarié d'une entreprise de la branche, le conjoint de la mère ou la personne liée à elle par un pacte civil de solidarité ou vivant maritalement avec elle bénéficie de ce congé dans les mêmes conditions.

```

---

## q119 · dated · reviewer says **wrong** (high)

\> La copie aux organisations syndicales représentatives n'est prévue que lorsque la négociation de l'accord visé à l'article L. 1233-24-1 est engagée, le cas échéant.

- [!] verdict

- Fix: Oui, l'administration peut à tout moment en cours de procédure faire toute observation ou proposition à l'employeur concernant le déroulement de la procédure ou les mesures sociales. Elle envoie simultanément copie de ses observations au comité social et économique et, lorsque la négociation de l'accord visé à l'article L. 1233-24-1 est engagée, le cas échéant aux organisations syndicales représentatives dans l'entreprise.
**Question.** Pendant la procédure de licenciement collectif, l'administration peut-elle intervenir pour faire des remarques sur la façon dont l'employeur gère le dossier ?

**Answer on file.** Oui, l'administration peut à tout moment en cours de procédure faire toute observation ou proposition à l'employeur concernant le déroulement de la procédure ou les mesures sociales. Elle envoie simultanément copie de ses observations au comité social et économique et aux organisations syndicales représentatives.

**Source — `code:L1233-57-6`** (code L1233-57-6)

```

L'administration peut, à tout moment en cours de procédure, faire toute observation ou proposition à l'employeur concernant le déroulement de la procédure ou les mesures sociales prévues à l'article L. 1233-32. Elle envoie simultanément copie de ses observations au comité social et économique et, lorsque la négociation de l'accord visé à l'article L. 1233-24-1 est engagée, le cas échéant aux organisations syndicales représentatives dans l'entreprise.

L'employeur répond à ces observations et adresse copie de sa réponse aux représentants du personnel et, le cas échéant, aux organisations syndicales.

```

---

## q001 · general · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Si j'embauche un salarié étranger et que je lui propose un contrat écrit, dois-je lui fournir une version traduite dans sa langue ?

**Answer on file.** Oui, si le salarié étranger le demande, une traduction du contrat doit être rédigée dans sa langue. Les deux textes font foi en justice, et en cas de désaccord entre les versions, seul le texte dans la langue du salarié peut être invoqué contre lui.

**Source — `code:L1221-3`** (code L1221-3)

```

Le contrat de travail établi par écrit est rédigé en français.

Lorsque l'emploi qui fait l'objet du contrat ne peut être désigné que par un terme étranger sans correspondant en français, le contrat de travail comporte une explication en français du terme étranger.

Lorsque le salarié est étranger et le contrat constaté par écrit, une traduction du contrat est rédigée, à la demande du salarié, dans la langue de ce dernier. Les deux textes font également foi en justice. En cas de discordance entre les deux textes, seul le texte rédigé dans la langue du salarié étranger peut être invoqué contre ce dernier.

L'employeur ne peut se prévaloir à l'encontre du salarié auquel elles feraient grief des clauses d'un contrat de travail conclu en méconnaissance du présent article.

```

---

## q028 · general · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Comment on définit un employé qui travaille moins d'heures que la normale ?

**Answer on file.** C'est un salarié à temps partiel, c'est-à-dire quelqu'un dont la durée du travail est inférieure à la durée légale du travail ou à la durée fixée par convention dans la branche ou l'entreprise.

**Source — `code:L3123-1`** (code L3123-1)

```

Est considéré comme salarié à temps partiel le salarié dont la durée du travail est inférieure :

1° A la durée légale du travail ou, lorsque cette durée est inférieure à la durée légale, à la durée du travail fixée conventionnellement pour la branche ou l'entreprise ou à la durée du travail applicable dans l'établissement ;

2° A la durée mensuelle résultant de l'application, durant cette période, de la durée légale du travail ou, si elle est inférieure, de la durée du travail fixée conventionnellement pour la branche ou l'entreprise ou de la durée du travail applicable dans l'établissement ;

3° A la durée de travail annuelle résultant de l'application durant cette période de la durée légale du travail, soit 1 607 heures, ou, si elle est inférieure, de la durée du travail fixée conventionnellement pour la branche ou l'entreprise ou de la durée du travail applicable dans l'établissement.

```

---

## q049 · general · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Quels documents l'employeur doit-il joindre à sa demande pour dépasser la durée maximale de travail par jour ?

**Answer on file.** L'employeur doit joindre les justifications utiles, l'avis du comité social et économique s'il existe, et le procès-verbal de consultation des délégués syndicaux s'il en existe. En l'absence de ces instances, il doit fournir un document attestant une information préalable des salariés.

**Source — `code:R3122-2`** (code R3122-2)

```

La demande d'autorisation de dépassement à la durée maximale quotidienne de travail, accompagnée des justifications utiles, de l'avis du comité social et économique, s'il existe, et du procès-verbal de consultation des délégués syndicaux, s'il en existe, est adressée par l'employeur à l'inspecteur du travail.

En l'absence de délégué syndical et de comité social et économique la demande est accompagnée d'un document attestant une information préalable des salariés.

```

---

## q065 · override · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Si un salarié fait des heures supplémentaires, est-ce que l'employeur peut lui proposer de prendre du repos à la place d'une augmentation de salaire ?

**Answer on file.** Oui, les parties peuvent convenir que tout ou partie du paiement des heures supplémentaires soit remplacé par un repos équivalent, sur la base d'un accord d'entreprise ou, en l'absence de syndicats, après consultation du comité d'entreprise ou des délégués du personnel et accord des salariés concernés.

**Source — `convention:5851646`** (convention 1er)

```

Les heures supplémentaires sont les heures de travail accomplies à la demande de l'employeur au-delà de la durée conventionnelle du travail, compte tenu des modalités d'aménagement du temps de travail retenues. Elles sont définies au chapitre III, article 1er, dans le cas d'une modulation sur l'année (1).

Les parties signataires conviennent que tout ou partie du paiement des heures supplémentaires et des majorations y afférentes peut être remplacé par un repos équivalent. Cette disposition pourra être mise en oeuvre sur le fondement d'un accord d'entreprise. En l'absence d'organisations syndicales, le comité d'entreprise ou, à défaut, les délégués du personnel seront consultés, et l'employeur devra solliciter l'accord des salariés concernés.

Rappelons que les heures supplémentaires dont le paiement aura été remplacé par un repos équivalent ne s'imputent pas sur le contingent annuel d'heures supplémentaires applicables à l'entreprise. De tels repos peuvent s'imputer par contre au crédit du compte de temps disponible du collaborateur (chapitre V) ou être pris selon les modalités définies par l'entreprise.

(1) Alinéa étendu sous réserve de l'application des articles L. 212-5, L. 212-5-1 et L. 212-6 du code du travail tels qu'interprétés par la jurisprudence de la Cour de cassation (arrêté du 21 décembre 1999, art. 1er).

```

---

## q082 · override · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** En combien de sections principales le FAFIEC organise-t-il la gestion des fonds qu'il collecte ?

**Answer on file.** Le FAFIEC gère les fonds collectés au sein de 8 sections principales : Professionnalisation, CPF, Plan de formation légale (avec quatre sous-sections selon la taille de l'entreprise), Contributions supplémentaires au titre du développement de la FCP, Contributions volontaires au titre du développement de la FCP, FPSPP, CIF, et Taxe d'apprentissage.

**Source — `convention:31260462`** (convention 2)

```

L'article 7 de l'accord du 13 mars 2012 modifié par l'article 3 de l'avenant du 13 mars 2015 est remplacé comme suit :

« Les fonds collectés par le FAFIEC sont gérés au sein des sections et des sous-sections financières suivantes :

1\. Professionnalisation.

2\. CPF.

3\. Plan de formation légale, avec quatre sous-sections :

a) Entreprises employant moins de 10 salariés ;

b) Entreprises employant de 10 à moins de 50 salariés ;

c) Entreprises employant de 50 à moins de 300 salariés ;

d) Le cas échéant, entreprises employant plus de 300 salariés.

4\. Contributions supplémentaires au titre du développement de la FCP conventionnelle, toutes tailles d'entreprises.

5\. Contributions volontaires au titre du développement de la FCP, toutes tailles d'entreprises.

6\. FPSPP.

7\. CIF (CDD et CDI).

8\. Taxe d'apprentissage.

Les fonds gérés au sein des sections 1 à 4 ci-dessus sont mutualisés.

Les fonds collectés au sein des sections 6 et 7 sont reversés aux organismes habilités à les gérer conformément aux règles en vigueur.

Les fonds susceptibles d'être collectés au sein des sections 4 et 5 sont affectés à la prise en charge des dépenses des entreprises en faveur du développement de la formation professionnelle continue.

Les fonds collectés au sein de la section 8 sont gérés selon les principes et techniques comptables prévus par le code de commerce et conformément aux dispositions de l'article R. 6242-2 du code du travail, pour permettre notamment de suivre les répartitions en différentes fractions. »

```

---

## q099 · override · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Quand un employé travaille partiellement de chez lui, qu'est-ce que l'employeur peut demander au salarié concernant son domicile ?

**Answer on file.** L'employeur peut exiger une attestation sur l'honneur du salarié concernant la conformité des installations électriques aux normes en vigueur, ainsi qu'une attestation d'assurance du lieu prenant en compte l'exercice d'une activité professionnelle en télétravail.

**Source — `convention:47348385`** (convention 12)

```

Le salarié bénéficiant d'une organisation hybride du travail doit pouvoir bénéficier de conditions de travail sécurisées aussi bien lorsqu'il se trouve dans les locaux de l'entreprise que lorsqu'il travaille à son domicile ou tout autre lieu de travail.

À ce titre, l'employeur peut exiger la production d'une attestation sur l'honneur du salarié concernant la conformité des installations électriques aux normes en vigueur du lieu de télétravail ainsi qu'une attestation d'assurance de ce lieu prenant en compte l'exercice d'une activité professionnelle en télétravail.

```

---

## q115 · dated · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Combien de temps minimum doit s'écouler entre deux réunions du comité social et économique lors d'une procédure de licenciement collectif ?

**Answer on file.** Au moins quinze jours doivent séparer les deux réunions du comité social et économique.

**Source — `code:L1233-30`** (code L1233-30)

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

## q132 · unanswerable · reviewer passed it (control)

- [x] verdict

- Fix: 

**Question.** Dans la convention collective de la métallurgie (IDCC 44), quel est le coefficient de salaire minimum applicable à un technicien ayant 3 ans d'ancienneté ?

**Answer on file.** Le corpus ne permet pas de répondre à cette question.

**Source.** *_None — meant to be unanswerable._*

---