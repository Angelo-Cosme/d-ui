# `d-ui-education`

Composants du domaine Education (LMS), construits **au-dessus** de `d-ui`.
`d-ui` reste générique : aucun cours, séance ni note n’y entre.

Package minimal ouvert par DS-050. Publication, CI dédiée et règles du
package : DS-047.

```ts
import 'd-ui/styles.css';
import 'd-ui-education/styles.css';
import { CalendarEvent } from 'd-ui-education';
```

| Composant       | Rôle                                                          |
| --------------- | ------------------------------------------------------------- |
| `CalendarEvent` | Séance d’emploi du temps : intitulé, cours, lieu, heure, type |

Jetons : `--d-ui-edu-event-<type>` (`lecture`, `tutorial`, `lab`, `exam`,
`other`), avec repli sur les jetons sémantiques de `d-ui`.

La documentation vit dans le Storybook de `d-ui` (groupe **Education**).
