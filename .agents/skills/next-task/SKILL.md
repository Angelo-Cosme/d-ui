---
name: next-task
description: Picks the next GitHub issue that has no open pull request and starts it (branch, implement, tests, docs). Use when the user says "next task", "next ticket", "prochaine tâche", or "prochain ticket".
---

# Next task

When the user says **next task** (or next ticket / prochaine tâche / prochain ticket):

1. Pick the next open issue with **no open PR**.
2. Start that work immediately on a new branch from up-to-date `origin/main`.

Do not wait for confirmation of which ticket unless two candidates are equally valid.

## Select the issue

Use `gh`. Never guess the backlog.

```bash
gh issue list --state open --limit 100 --json number,title,body,assignees
gh pr list --state open --limit 100 --json number,title,body,headRefName
```

An issue **already has a PR** if any open PR:

- has `Closes #N` / `Fixes #N` / `Resolves #N` for that issue, or
- branch or title contains `DS-XXX` matching the issue id (e.g. `feature/DS-023-input` → #23)

Ignore Dependabot PRs for this mapping.

### Skip

- Issues whose title starts with **Concevoir** or **Définir** (DS-001–DS-010 and similar) while any **Implémenter** ticket remains
- Education package tickets (DS-048–DS-050) until DS-047 is done
- Release / audit tickets (DS-057–DS-061) until the v1 component freeze is in progress

### Blockers

Parse **Bloqué par** `DS-XXX` from the issue body.

A blocker is **unresolved** only if that DS issue is still **open** and has **no** open PR. An in-flight PR does not block the next ticket.

If the lowest-id **Implémenter** issue has no PR but is blocked by an issue with **no** PR either, pick that blocker instead (work the dependency first).

### Pick

Among remaining issues, choose the **lowest DS-XXX**. Mention the assignee if someone else is assigned; still start the ticket.

## Start the work

1. `git fetch origin main` and create `feature/DS-XXX-short-slug` from `origin/main` (never from a stale local `main`): `git checkout -b feature/DS-XXX-short-slug origin/main`.
2. Cursor only: call `SetActiveBranch` for that branch. Claude Code and other clients have no equivalent tool; the `git checkout -b` above is enough.
3. Implement against the issue **Périmètre**, **Critères d'acceptation**, and **Hors périmètre**.
4. Follow `CONTRIBUTING.md`: English conventional commits, no `Co-authored-by`, WCAG 2.2 AA, Vitest + Testing Library + Storybook + MDX, changeset on public API.
5. Documentation must match `Button.mdx` / `TextInput.mdx` / `TimeAgo.mdx`. Follow `.cursor/skills/storybook-docs/SKILL.md` and `.cursor/skills/docs-locale/SKILL.md` (French MDX via docs-i18n, bilingual canvas copy, ArgTypes, `componentSource`). Autodocs is not enough.
6. Branch naming: `feature/DS-XXX-short-slug`. When opening the PR, follow `.cursor/skills/create-pr/SKILL.md` (French body, `Closes #<issue-number>`).
7. Do not stack on another open feature branch unless the ticket cannot be built without that unmerged API; prefer `origin/main` and native/`aria-*` seams.

## Report

Tell the user the issue (DS-XXX + URL), why it was chosen, and the branch name. Then implement; do not stop after naming the ticket.
