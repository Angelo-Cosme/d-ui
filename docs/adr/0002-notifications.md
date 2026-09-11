# ADR 0002 — Toast, Alert et centre de notifications (DS-046)

- **Statut :** proposé — 2026-09-11
- **Ticket :** [DS-046](https://github.com/dudaloglobal/d-ui/issues/46)
- **Portée :** `Alert`, `Notification`, `ToastProvider` / `useToast`, et le futur
  centre de notifications

## Contexte

`d-ui` livre déjà trois surfaces qui disent toutes « il s’est passé quelque
chose » : `Alert` (message inline, DS-032), `Notification` (la surface visuelle
du toast) et `ToastProvider` / `useToast` (file, auto-fermeture, coin
inférieur droit, DS-033). Rien ne dit laquelle choisir, et
`docs/accessibility.md` renvoyait la question au présent ticket.

Le résultat se voit dans les applications : le même message d’erreur part
tantôt en toast, tantôt en `Alert`, parfois les deux. Un toast qui disparaît
est le seul endroit où l’échec d’un enregistrement a été dit.

Le choix ne se joue pas sur la gravité. Une erreur peut être passagère
(« Connexion rétablie ») et une information peut demander une action
(« Trois copies attendent votre correction »). Ce qui décide, c’est **la durée
de vie du message et qui le possède**.

## Options étudiées

| Option                                                      | Ce que ça donne                                                                                      | Verdict |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| **Trois surfaces, un axe de choix explicite**               | Chaque message a une place déductible d’une question unique ; les trois composants restent distincts | retenu  |
| Une seule surface paramétrable (`<Feedback placement="…">`) | Une API qui grossit à chaque cas, et le choix reste à faire — il est juste caché dans une prop       | écarté  |
| Tout en toast, l’historique dans le centre                  | Un centre qui devient une poubelle de logs ; l’utilisateur n’y va plus                               | écarté  |
| Tout en `Alert` inline                                      | Une action banale (« Enregistré ») déplace la mise en page à chaque clic                             | écarté  |

## Décision

Une seule question, dans cet ordre, tranche.

1. **Le message décrit-il l’état d’une zone de la page ?** Un formulaire refusé,
   un réglage en conflit, un tableau dégradé. → **`Alert`**, dans le flux, à
   côté de ce dont il parle. Il vit tant que la condition tient.
2. **Est-ce la conséquence immédiate d’un geste que l’utilisateur vient de
   faire, sans suite à donner ?** « Enregistré », « Copié », « Trois fichiers
   envoyés ». → **toast** (`useToast`). Transitoire, non bloquant, ne prend pas
   le focus.
3. **Sinon**, le message vient d’ailleurs — un autre utilisateur, une tâche de
   fond, le serveur — et doit survivre au rechargement. → **centre de
   notifications**.

|                             | `Alert`                     | Toast                     | Centre                 |
| --------------------------- | --------------------------- | ------------------------- | ---------------------- |
| Origine                     | l’état d’une zone           | un geste de l’utilisateur | un événement extérieur |
| Durée de vie                | tant que la condition tient | quelques secondes         | jusqu’à traitement     |
| Survit au rechargement      | oui (l’état est recalculé)  | non                       | oui (côté serveur)     |
| Peut porter la seule action | oui                         | **non**                   | oui                    |
| Emplacement                 | dans le flux                | superposé, coin inférieur | derrière une cloche    |

## Règles d’usage

1. **Un toast n’est jamais le seul endroit où un message existe.** Si
   l’utilisateur doit agir, ou simplement pouvoir le relire, le message existe
   aussi en `Alert` inline ou dans le centre. Un toast est un rappel, pas une
   archive : six secondes est une limite de temps (WCAG 2.2.1), et rien ne
   garantit que l’utilisateur regardait.
2. **La politesse suit la gravité, pas la surface.** `info` et `success`
   s’annoncent en `role="status"` (poli) ; `warning` et `danger` en
   `role="alert"` (assertif, il coupe la parole). C’est ce que fait
   `feedbackLiveRole` : `Alert` s’en servait déjà, `Notification` le fait
   désormais. Avant ce ticket, `Notification` figeait `role="alert"`, donc
   « Enregistré » interrompait le lecteur d’écran.
3. **Un toast qui porte une action ne s’auto-ferme pas.** Sinon la fonction
   n’est offerte que par un contrôle minuté : à six secondes, le bouton avait
   disparu avant qu’un utilisateur au clavier ou au lecteur d’écran l’atteigne
   (WCAG 2.2.1). Sans auto-fermeture, la fermeture manuelle devient
   obligatoire. Une `duration` explicite reste possible : la règle est un
   défaut, pas une interdiction.
4. **Le bouton fermer d’un toast minuté reste minuté.** `dismissible` sur un
   toast qui s’efface à six secondes ne suffit pas : le contrôle disparaît sous
   le doigt de l’utilisateur au clavier, et le focus retombe sur `<body>`. Tant
   que `ToastProvider` n’a pas de pause au survol et au focus, `dismissible`
   s’accompagne de `duration: 0` — c’est ce que fait la règle 3 pour les toasts
   porteurs d’action, et ce que la story « Fermable » fait déjà.
5. **Aucune surface ne prend le focus.** Une notification n’est pas une demande
   de l’utilisateur : la lui imposer est un changement de contexte (WCAG 3.2.1).
   Le centre ne s’ouvre jamais tout seul.
6. **Le compteur de la cloche est du texte, pas une pastille colorée.** Le
   nombre entre dans le nom accessible du bouton (« Notifications, 3 non
   lues »), la couleur ne porte rien à elle seule (WCAG 1.4.1).
7. **Le centre ne possède pas l’état lu / non lu.** Il reçoit `items` et remonte
   `onRead` / `onReadAll`. `d-ui` ne connaît ni l’API, ni la persistance, ni ce
   que « lu » veut dire pour le métier.
8. **Le centre se compose.** `Popover` + `List` + `Tag` + `IconButton`
   existent : le centre est un assemblage, pas une primitive de plus. C’est
   l’arbitrage rendu sur `Spinner` (DS-034) et sur « Thumbnail » (DS-043).

## Conséquences

- Plus : un message a une place déductible, sans arbitrage au cas par cas en
  revue. Les annonces lecteur d’écran cessent de s’interrompre pour un succès.
- Moins : un toast porteur d’action reste affiché jusqu’à fermeture — c’est un
  changement de comportement pour les appelants qui comptaient sur les six
  secondes. `duration` leur rend la main.
- Un toast persistant occupe une place de `maxVisible` tant qu’il n’est pas
  fermé, et les suivants attendent. La file se comportait déjà ainsi avec
  `duration: 0` (la story « File d’attente » le montre) ; la règle 3 rend le cas
  atteignable par défaut. C’est une raison de plus pour la règle 1 : un toast
  n’est jamais le seul endroit où un message existe.
- `Notification` annonce désormais `role="status"` pour `info` et `success` :
  un test qui cherchait `getByRole('alert')` sur un toast de succès doit
  chercher `status`.
- Le `aria-live="polite"` du conteneur de `ToastProvider` ne décide plus de la
  politesse d’un toast : une région live imbriquée gouverne son propre contenu,
  et chaque toast en est une. Il reste en place comme filet pour ce que la zone
  contiendrait sans rôle propre. La politesse se règle donc par la variante,
  jamais par le conteneur.
- Ce conteneur devient une `role="region"` nommée. Son `aria-label` reposait sur
  un `div` sans rôle, ce qui est interdit : le nom n’était exposé nulle part et
  la prop `label` ne servait à rien. Nommée, la zone devient un repère que l’on
  peut atteindre pour retrouver un toast encore affiché.

## Suites

- **Centre de notifications** : composant à part entière (cloche, compteur,
  panneau `Popover`, liste `List`), contrôlé, sans état interne. Ticket à
  ouvrir, hors DS-046 qui définit le pattern.
- **Pause au survol et au focus** (APG) : tant qu'elle n'existe pas, tout toast
  fermable doit être persistant, ce que la règle 4 impose à la main.
- **`dismissAll()` jette la file d’attente** : un toast encore en attente est
  détruit sans avoir jamais été affiché ni annoncé. Comportement antérieur à ce
  ticket, à traiter avec la pause.
- **Groupement et anti-spam** : trois enregistrements d’affilée ne doivent pas
  produire trois toasts. `maxVisible` limite l’affichage mais n’agrège pas.
  À traiter quand un cas réel se présentera, pas avant.
