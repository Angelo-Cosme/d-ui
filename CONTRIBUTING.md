# Contribuer à `d-ui`

## Git

1. Partir de `main` à jour.
2. Branche : `feature/DS-XXX-short-slug`. Si un ticket existe déjà, le réutiliser (`Closes #N`). Une issue n’est créée automatiquement au `git push` **que** si le travail est **nouveau** et qu’**aucune** issue (ouverte ou fermée) ne le couvre déjà.
3. PR vers `main`. Description en **français**, template `.github/PULL_REQUEST_TEMPLATE.md`. La CI doit être verte. Une revue est requise.
4. Ne pas pousser directement sur `main`.

L’auteur de la PR est assigné automatiquement. L’issue liée (`Closes #N`) est assignée au même auteur, ajoutée au projet, et passe **En cours** / **En revue** / **Terminé** au `git push` (hook local). Les reviewers demandés sont les deux autres membres de l’équipe (`@fruitizz`, `@Angelo-Cosme`, `@noukpoherve`) selon l’assigné du ticket ou de la PR.

Messages de commit en **anglais**, style conventional : `feat(button): …`, `fix(a11y): …`, `chore(ci): …`.

Ne pas ajouter de trailer `Co-authored-by` (ni attribution d’outil). Les hooks s’installent avec `pnpm install` (ou `sh .githooks/install.sh`).

## Agents (Cursor et Claude Code)

Les skills du dépôt s’appliquent à tout le monde après un clone :

- Cursor : `.cursor/skills/`
- Claude Code : `.claude/skills/` (mêmes `SKILL.md`, fichiers réels)
- Autres clients : `.agents/skills/`

Consigne partagée : `AGENTS.md` / `CLAUDE.md`.

## Revue locale avant commit (pas la CI)

Chaque `git commit` lance `.githooks/pre-commit` : revue **locale** (CLI `claude` ou `agent`) sur YAGNI, SOLID, KISS, DRY, **accessibilité numérique**, **HTML sémantique**, et la couverture Storybook de toutes les options publiques du composant (ex. proposer bouton + icône si seul le bouton nu est documenté).

Ce n’est **pas** un job GitHub Actions (pas de token IA cloud). Le hook ne fait rien quand `CI` est défini.

Il faut un CLI local : [Claude Code](https://docs.anthropic.com/en/docs/claude-code) ou [Cursor CLI](https://cursor.com/docs/cli/overview) (`curl https://cursor.com/install -fsS | bash`).

Urgence uniquement : `SKIP_COMMIT_REVIEW=1 git commit …`.

## Preview Storybook (obligatoire)

Chaque PR **doit** contenir l’URL du preview Storybook dans la section **Preview Storybook** du template.

La CI :

1. construit Storybook
2. déploie `prs/<numéro-de-PR>/` sur GitHub Pages
3. commente l’URL et l’écrit dans la description de PR
4. échoue si l’URL est absente

Ne pas merger une PR sans ce lien.

## Definition of Done

Un composant n’est pas fini sans :

- API exportée depuis `d-ui`
- tokens (aucun hex sémantique dans le TSX)
- HTML sémantique, clavier, focus visible, nom accessible — [docs/accessibility.md](./docs/accessibility.md)
- tests Testing Library + story **et** MDX (voir [docs/component-conventions.md](./docs/component-conventions.md))
- conventions : [docs/component-conventions.md](./docs/component-conventions.md)

## Qualité (YAGNI, SOLID, KISS, DRY, accessibilité, HTML sémantique)

- Un module = un job. Pas d’abstraction « au cas où ».
- Réutiliser tokens, `cx`, `ThemeProvider` plutôt que de recréer des couleurs ou des classNames.
- Le domaine Education n’entre pas dans `d-ui` : il vit dans `packages/education` (`d-ui-education`), qui compose `d-ui`.
- HTML sémantique (`button`, `a`, `label`, `dialog`, …), nom accessible, clavier, focus visible — [docs/accessibility.md](./docs/accessibility.md) (WCAG 2.2 AA).
- Toute option publique d’un composant a une story + un canvas MDX. La skill `.cursor/skills/pre-commit-review/SKILL.md` impose cette barre avant le commit.

## Tests

Pour un composant interactif : test Testing Library (rôle, nom accessible, clavier si pertinent) + story.

## Release

Changesets (`pnpm changeset`). Détail : [docs/release.md](./docs/release.md).
