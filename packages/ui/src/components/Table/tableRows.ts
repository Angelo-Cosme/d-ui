export type SortDirection = 'ascending' | 'descending';

export type TableSort = {
  /** `id` de la colonne triée. */
  columnId: string;
  direction: SortDirection;
};

/** Valeur comparable extraite d'une cellule. `null` se range toujours en dernier. */
export type SortValue = string | number | boolean | Date | null | undefined;

/** Une cellule vide n'est pas une petite valeur : elle n'en a pas. */
export function isEmptyValue(value: SortValue): boolean {
  return value === null || value === undefined;
}

function rank(value: SortValue): number {
  return isEmptyValue(value) ? 1 : 0;
}

/**
 * Compare deux valeurs de cellule.
 *
 * Les nombres se comparent numériquement — un tri lexical mettrait `10` avant
 * `9`. Les chaînes passent par `localeCompare` avec `numeric`, pour que
 * « Élément 2 » précède « Élément 10 » et que les accents se rangent comme
 * l'attend un lecteur francophone.
 */
export function compareValues(a: SortValue, b: SortValue, locale?: string): number {
  const emptiness = rank(a) - rank(b);
  if (emptiness !== 0) return emptiness;
  if (rank(a) === 1) return 0;

  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), locale, {
    numeric: true,
    sensitivity: 'base',
  });
}

/**
 * Trie une copie des lignes. **Stable** : deux lignes de même valeur gardent
 * leur ordre d'origine, sinon un second clic sur un en-tête rebattrait des
 * lignes que l'utilisateur croit figées.
 */
export function sortRows<Row>(
  rows: readonly Row[],
  sort: TableSort | null,
  valueOf: (row: Row, columnId: string) => SortValue,
  locale?: string,
): Row[] {
  if (!sort) return [...rows];

  const sign = sort.direction === 'descending' ? -1 : 1;
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const left = valueOf(a.row, sort.columnId);
      const right = valueOf(b.row, sort.columnId);

      /*
       * Le vide se range en dernier **avant** que le sens s'applique. Sinon un
       * tri descendant remonterait les cellules vides en tête, alors qu'elles
       * ne portent aucune valeur à classer.
       */
      const emptiness = rank(left) - rank(right);
      if (emptiness !== 0) return emptiness;

      const result = compareValues(left, right, locale);
      return result !== 0 ? result * sign : a.index - b.index;
    })
    .map((entry) => entry.row);
}

/**
 * Filtre les lignes sur une recherche texte, insensible à la casse et aux
 * accents.
 *
 * `filterSelectItems` du module `Select` fait un travail voisin, mais il est
 * typé sur `SelectOption` : le réutiliser ici coudrait la table au module de
 * sélection pour économiser six lignes.
 */
export function searchRows<Row>(
  rows: readonly Row[],
  query: string,
  columnIds: readonly string[],
  valueOf: (row: Row, columnId: string) => SortValue,
): Row[] {
  const needle = normalize(query);
  if (!needle) return [...rows];

  return rows.filter((row) =>
    columnIds.some((columnId) => {
      const value = valueOf(row, columnId);
      if (value === null || value === undefined) return false;
      return normalize(searchText(value)).includes(needle);
    }),
  );
}

/**
 * Texte cherchable d'une valeur.
 *
 * `String(new Date())` donnerait « Sun Aug 02 2026 00:00:00 GMT+0000 … » :
 * taper « gmt » trouverait tout, et taper la date affichée ne trouverait rien.
 */
export function searchText(value: SortValue): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

/** Minuscules sans diacritiques : « Éléonore » se trouve en tapant « eleonore ». */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** Sens suivant d'un en-tête : ascendant, descendant, puis plus de tri. */
export function nextSort(current: TableSort | null, columnId: string): TableSort | null {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: 'ascending' };
  }
  if (current.direction === 'ascending') {
    return { columnId, direction: 'descending' };
  }
  return null;
}

/** Découpe une page. `pageSize` nul ou négatif : tout tient sur une page. */
export function pageRows<Row>(
  rows: readonly Row[],
  page: number,
  pageSize: number,
): Row[] {
  if (pageSize <= 0) return [...rows];
  const start = Math.max(0, (page - 1) * pageSize);
  return rows.slice(start, start + pageSize);
}

/** Nombre de pages, jamais inférieur à 1 — une table vide a toujours une page. */
export function pageCountOf(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}
