import type { ReactNode } from 'react';

export type CommandMenuItem = {
  /** Identifiant unique, transmis tel quel à `onSelect`. */
  value: string;
  /** Libellé visible. Une chaîne : c'est sur lui que porte le filtre. */
  label: string;
  /** Seconde ligne sous le libellé. Filtrée aussi. */
  description?: string;
  /** Icône décorative au début de la ligne. */
  icon?: ReactNode;
  /** Raccourci affiché à droite. Visuel : l'application écoute les touches. */
  shortcut?: string;
  /** Synonymes invisibles que l'utilisateur tapera (« créer » pour « Nouveau »). */
  keywords?: readonly string[];
  /** Visible mais hors parcours clavier et hors clic. */
  disabled?: boolean;
};

export type CommandMenuGroup = {
  /** En-tête visible du groupe, et nom de son `role="group"`. */
  label: string;
  items: readonly CommandMenuItem[];
};

export type CommandMenuEntry = CommandMenuItem | CommandMenuGroup;

/** Reçoit la saisie brute : à l'appelant de la normaliser s'il remplace le filtre. */
export type CommandMenuFilter = (item: CommandMenuItem, query: string) => boolean;

export function isCommandMenuGroup(entry: CommandMenuEntry): entry is CommandMenuGroup {
  return 'items' in entry && Array.isArray(entry.items);
}

/** Minuscules, sans accents ni espaces de bord : « creer » trouve « Créer ». */
export function foldCommandText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/**
 * Filtre par défaut : la saisie est une sous-chaîne du libellé, d'un mot-clé
 * ou de la description, sans tenir compte de la casse ni des accents.
 *
 * Pas de score ni de correspondance floue : le résultat garde l'ordre de
 * `items`, donc l'ordre que l'application a choisi.
 */
export function defaultCommandMenuFilter(item: CommandMenuItem, query: string): boolean {
  const needle = foldCommandText(query);
  if (!needle) return true;
  const fields = [item.label, item.description ?? '', ...(item.keywords ?? [])];
  return fields.some((field) => foldCommandText(field).includes(needle));
}

/** Applique `filter` à chaque commande ; un groupe vidé disparaît avec son en-tête. */
export function filterCommandMenuEntries(
  entries: readonly CommandMenuEntry[],
  query: string,
  filter: CommandMenuFilter,
): CommandMenuEntry[] {
  const out: CommandMenuEntry[] = [];
  for (const entry of entries) {
    if (isCommandMenuGroup(entry)) {
      const items = entry.items.filter((item) => filter(item, query));
      if (items.length > 0) out.push({ ...entry, items });
    } else if (filter(entry, query)) {
      out.push(entry);
    }
  }
  return out;
}

/** Les commandes dans l'ordre visible, groupes aplatis : la base de l'index actif. */
export function flattenCommandMenuEntries(
  entries: readonly CommandMenuEntry[],
): CommandMenuItem[] {
  const out: CommandMenuItem[] = [];
  for (const entry of entries) {
    if (isCommandMenuGroup(entry)) out.push(...entry.items);
    else out.push(entry);
  }
  return out;
}
