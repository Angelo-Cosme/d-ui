import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { VisuallyHidden } from '../../a11y/VisuallyHidden';
import { cx } from '../../lib/cx';
import { Checkbox } from '../Checkbox/Checkbox';
import { Pagination } from '../Pagination/Pagination';
import { SkeletonText } from '../Skeleton/Skeleton';
import {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFrame,
  TableHead,
  TableHeader,
  TableRow,
  cellAlign,
  tableCellSizeClass,
  type TableAlign,
  type TableSize,
} from './tableMarkup';
import {
  nextSort,
  pageCountOf,
  pageRows,
  searchRows,
  searchText,
  sortRows,
  type SortValue,
  type TableSort,
} from './tableRows';

export type { SortDirection, TableSort } from './tableRows';

/** Colonne du mode données : donnée brute (`value`) séparée du rendu (`cell`). */
export type TableColumn<Row> = {
  /** Identifiant stable de la colonne. Sert de clé de tri. */
  id: string;
  /** Contenu de l'en-tête. */
  header: ReactNode;
  /**
   * Valeur brute de la cellule : ce qui est trié et cherché.
   *
   * Séparée du rendu, parce qu'un badge « En retard » se trie sur une date et
   * se cherche sur un mot — pas sur son JSX.
   */
  value: (row: Row) => SortValue;
  /** Rendu de la cellule. Par défaut, `value` affichée telle quelle. */
  cell?: (row: Row) => ReactNode;
  /** Colonne non triable : l'en-tête reste un simple `th`, sans bouton. */
  sortable?: boolean;
  /** Alignement de la colonne. `numeric` aligne à `end` s'il est omis. */
  align?: TableAlign;
  /**
   * Colonne de chiffres : chiffres tabulaires, sans césure, alignés à la fin.
   *
   * C'est `Table` qui l'applique — la même règle qu'un tableau écrit à la main
   * dans le design system, pas une seconde convention.
   */
  numeric?: boolean;
};

export type TableToolbarApi<Row> = {
  /** Lignes filtrées et triées, dans l'ordre affiché. Page comprise ou non. */
  rows: Row[];
  search: string;
  setSearch: (value: string) => void;
  /** Identifiants cochés, pour une action groupée. */
  selectedIds: readonly string[];
};

export type TableLabels = {
  selectAll: string;
  selectRow: (label: string) => string;
  /** Indice ajouté au nom du bouton de tri. Ne répète pas l'en-tête. */
  sortBy: string;
  locked: string;
  results: (count: number) => string;
  empty: string;
};

/** Fallback anglais, remplacé dès qu'une locale est connue. */
const DEFAULT_LABELS: TableLabels = {
  selectAll: 'Select all rows',
  selectRow: (label) => `Select ${label}`,
  sortBy: 'Sort this column',
  locked: 'Locked row',
  results: (count) => `${count} results`,
  empty: 'No results',
};

export type TableDataProps<Row> = {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  /** Clé stable d'une ligne. Jamais l'index : le tri le déplace. */
  rowId: (row: Row) => string;
  /**
   * Nom accessible de la table, rendu dans une `<caption>`.
   *
   * Obligatoire : une table sans nom laisse le lecteur d'écran annoncer
   * « tableau, 8 colonnes » sans dire de quoi.
   */
  caption: string;
  /** Masque la légende à l'écran. Elle reste lue, et nomme la zone défilable. */
  hideCaption?: boolean;
  /** Densité des cellules. Défaut : `md`. */
  size?: TableSize;
  stickyHeader?: boolean;

  /** Tri contrôlé. Sans lui, la table gère son propre tri. */
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;

  /** Recherche contrôlée. Sans elle, `toolbar` peut piloter `defaultSearch`. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;

  /** Active la colonne de cases à cocher. */
  selectable?: boolean;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** Nom lisible d'une ligne, pour nommer sa case à cocher. */
  rowLabel?: (row: Row) => string;

  /** Ligne verrouillée : ni sélectionnable, ni comptée dans « tout cocher ». */
  isRowLocked?: (row: Row) => boolean;

  /** Pagine la table. Omis, toutes les lignes sont rendues. */
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;

  /**
   * Barre au-dessus de la table : recherche, filtres, actions groupées, export.
   *
   * En fonction, elle reçoit de quoi tout faire sans que le composant s'en
   * mêle : les lignes **visibles** (filtrées et triées) pour l'export, la
   * recherche et son setter, les lignes cochées pour une action groupée. Même
   * forme que le slot `progress` de `FileUpload`.
   */
  toolbar?: ReactNode | ((api: TableToolbarApi<Row>) => ReactNode);
  /** Contenu sous la table, à la place de la pagination automatique. */
  footer?: ReactNode;
  /**
   * Remplace le corps par un squelette. Le `<table>` porte `aria-busy` ;
   * le squelette reste hors de l’arbre d’accessibilité.
   */
  loading?: boolean;
  /**
   * Corps vide. Composez `EmptyState` ou `ErrorState` — le mode données
   * n’importe pas le métier du vide. Omis : `labels.empty` en paragraphe.
   */
  empty?: ReactNode;

  /** Locale de comparaison pour le tri. Défaut : celle de l'exécution. */
  locale?: string;
  labels?: Partial<TableLabels>;
  className?: string;
  /** Incompatible avec le mode parties : passez `columns` / `rows`, pas des enfants. */
  children?: never;
};

function SortGlyph({ direction }: { direction: 'ascending' | 'descending' | null }) {
  return (
    <svg
      viewBox="0 0 12 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('size-3 shrink-0', direction ? 'text-brand' : 'text-fg-muted')}
      aria-hidden="true"
      focusable="false"
    >
      {direction !== 'descending' ? <path d="M3 7l3-3 3 3" /> : null}
      {direction !== 'ascending' ? <path d="M3 9l3 3 3-3" /> : null}
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-fg-muted size-4"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.25" y="7" width="9.5" height="6.5" rx="1.5" />
      <path d="M5.75 7V5a2.25 2.25 0 0 1 4.5 0v2" />
    </svg>
  );
}

/**
 * Mode données de `Table` : tri, recherche, sélection et pagination.
 *
 * Le balisage reste celui de `TableFrame` : ce module pose un comportement
 * dessus, sans second tableau. La zone défilable devient atteignable au
 * clavier quand elle déborde vraiment (2.1.1), `size` et `stickyHeader`
 * suivent l'échelle du composant, et une seule table de paddings existe.
 *
 * L'association d'une cellule à son en-tête vient de `scope="col"`, posé par
 * `TableHead`, pas d'ARIA. Le tri est un `<button>` dans le `<th>`, et
 * `aria-sort` n'est posé que sur la colonne triée — ARIA le veut sur une
 * seule à la fois.
 *
 * Chaque état (tri, recherche, page, sélection) accepte une prop contrôlée et
 * retombe sinon sur un état interne, comme `Tabs` : une table locale marche
 * sans câblage, une table serveur garde la main.
 *
 * Le composant **ne fabrique pas de fichier**. `toolbar` reçoit les lignes
 * visibles et vous y mettez votre bouton d'export : l'encodage, le séparateur
 * et le format des dates sont des règles produit, pas des règles de design
 * system.
 */
export function TableData<Row>({
  columns,
  rows,
  rowId,
  caption,
  hideCaption = false,
  size = 'md',
  stickyHeader = false,
  sort,
  defaultSort = null,
  onSortChange,
  search,
  defaultSearch = '',
  onSearchChange,
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  rowLabel,
  isRowLocked,
  pageSize,
  page,
  defaultPage = 1,
  onPageChange,
  toolbar,
  footer,
  loading = false,
  empty,
  locale,
  labels,
  className,
}: TableDataProps<Row>) {
  const text = { ...DEFAULT_LABELS, ...labels };

  const [internalSort, setInternalSort] = useState<TableSort | null>(defaultSort);
  const [internalSearch, setInternalSearch] = useState(defaultSearch);
  const [internalSelected, setInternalSelected] =
    useState<readonly string[]>(defaultSelectedIds);
  const [internalPage, setInternalPage] = useState(defaultPage);

  const activeSort = sort !== undefined ? sort : internalSort;
  const activeSearch = search !== undefined ? search : internalSearch;
  const activeSelected = selectedIds !== undefined ? selectedIds : internalSelected;
  const activePage = page !== undefined ? page : internalPage;

  const byId = useMemo(() => {
    const map = new Map(columns.map((column) => [column.id, column]));
    return (row: Row, columnId: string): SortValue =>
      map.get(columnId)?.value(row) ?? null;
  }, [columns]);

  const searchable = useMemo(() => columns.map((column) => column.id), [columns]);

  const visible = useMemo(() => {
    const found = searchRows(rows, activeSearch, searchable, byId);
    return sortRows(found, activeSort, byId, locale);
  }, [rows, activeSearch, searchable, byId, activeSort, locale]);

  const pageCount = pageSize ? pageCountOf(visible.length, pageSize) : 1;
  /*
   * Une seule page bornée alimente la table et la pagination. Sans ce garde,
   * un jeu qui rétrécit — onglet, filtre, réponse serveur — laissait la table
   * vide sur une page qui n'existe plus, et la pagination disparaissait avec
   * elle : plus aucun moyen de revenir.
   */
  const safePage = Math.min(Math.max(activePage, 1), pageCount);
  const paginated = pageSize ? pageRows(visible, safePage, pageSize) : visible;

  /*
   * « Tout cocher » ne porte que sur les lignes affichées. Cocher en silence
   * des lignes d'une autre page, puis les décocher sans le voir, est un piège.
   */
  const selectableRows = useMemo(
    () => paginated.filter((row) => !isRowLocked?.(row)),
    [paginated, isRowLocked],
  );
  const selectedSet = useMemo(() => new Set(activeSelected), [activeSelected]);
  const selectedCount = selectableRows.filter((row) =>
    selectedSet.has(rowId(row)),
  ).length;
  const allSelected =
    selectableRows.length > 0 && selectedCount === selectableRows.length;

  function commitSort(columnId: string) {
    const next = nextSort(activeSort, columnId);
    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  }

  function commitSelection(ids: string[]) {
    if (selectedIds === undefined) setInternalSelected(ids);
    onSelectedIdsChange?.(ids);
  }

  function toggleRow(id: string, checked: boolean) {
    const next = checked
      ? [...activeSelected, id]
      : activeSelected.filter((entry) => entry !== id);
    commitSelection(next);
  }

  function toggleAll(checked: boolean) {
    const ids = new Set(selectableRows.map(rowId));
    commitSelection(
      checked
        ? [...new Set([...activeSelected, ...ids])]
        : activeSelected.filter((id) => !ids.has(id)),
    );
  }

  function commitSearch(next: string) {
    if (search === undefined) setInternalSearch(next);
    onSearchChange?.(next);
    /*
     * Une recherche qui réduit le jeu ramène à la première page — mais
     * seulement si la table pagine et n'y est pas déjà. Sinon un propriétaire
     * branché sur un routeur recevait un reset par frappe, sur une table sans
     * pagination.
     */
    if (pageSize && activePage !== 1) {
      if (page === undefined) setInternalPage(1);
      onPageChange?.(1);
    }
  }

  function commitPage(next: number) {
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  }

  /*
   * Page contrôlée hors bornes : on prévient le propriétaire une fois, sinon
   * son `aria-current` désignerait une page dont aucune ligne n'est rendue.
   */
  useEffect(() => {
    if (page !== undefined && page !== safePage) onPageChange?.(safePage);
    if (page === undefined && internalPage !== safePage) setInternalPage(safePage);
  }, [page, safePage, internalPage, onPageChange]);

  const columnCount = columns.length + (selectable ? 1 : 0);
  const bodyEmpty = !loading && paginated.length === 0;

  return (
    <div className="font-sans">
      {toolbar !== undefined ? (
        <div className="mb-3">
          {typeof toolbar === 'function'
            ? toolbar({
                rows: visible,
                search: activeSearch,
                setSearch: commitSearch,
                selectedIds: activeSelected,
              })
            : toolbar}
        </div>
      ) : null}

      {/*
       * Le nombre de résultats est annoncé poliment : après une recherche, le
       * lecteur d'écran apprend combien de lignes restent sans avoir à
       * parcourir la table. Pendant le chargement, `aria-busy` suffit : le
       * squelette est hors de l'arbre, et un « 0 résultats » serait un mensonge.
       */}
      {loading ? null : (
        <p role="status" className="d-ui-visually-hidden">
          {text.results(visible.length)}
        </p>
      )}

      {/*
        `className` va sur le scroller, comme en mode parties (`max-h-56`).
        La barre et la pagination restent hors du défilement.
      */}
      <TableFrame
        size={size}
        stickyHeader={stickyHeader}
        aria-busy={loading || undefined}
        className={cx('border-border-subtle rounded-md border', className)}
      >
        {/*
          La légende reprend la géométrie des cellules : sans padding, le texte
          se collait au trait du conteneur. Même échelle que les cellules.
        */}
        <TableCaption
          className={
            hideCaption
              ? 'd-ui-visually-hidden'
              : cx('mb-0 font-normal text-fg-muted', tableCellSizeClass[size])
          }
        >
          {caption}
        </TableCaption>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead>
                <Checkbox
                  size="sm"
                  aria-label={text.selectAll}
                  checked={allSelected}
                  indeterminate={selectedCount > 0 && !allSelected}
                  disabled={loading || selectableRows.length === 0}
                  onChange={(event) => toggleAll(event.currentTarget.checked)}
                />
              </TableHead>
            ) : null}
            {columns.map((column) => {
              const sorted = activeSort?.columnId === column.id ? activeSort : null;
              const canSort = column.sortable !== false;
              /*
               * Le chevron passe du côté vers lequel la colonne s'aligne. La
               * règle vient de `Table` : la réécrire ici, c'est se désynchroniser
               * au premier changement.
               */
              const toEnd = cellAlign(column.align, column.numeric ?? false) === 'end';

              return (
                <TableHead
                  key={column.id}
                  align={column.align}
                  numeric={column.numeric}
                  /* ARIA veut `aria-sort` sur une seule colonne à la fois. */
                  aria-sort={sorted ? sorted.direction : undefined}
                >
                  {canSort ? (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => commitSort(column.id)}
                      className={cx(
                        'inline-flex min-h-6 items-center gap-1.5 rounded-sm',
                        'focus-visible:ring-focus focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        toEnd ? 'flex-row-reverse' : null,
                      )}
                    >
                      {column.header}
                      <SortGlyph direction={sorted ? sorted.direction : null} />
                      {/*
                       * Le glyphe est décoratif : sans ce texte, un en-tête
                       * non trié n'aurait aucun indice de ce que fait le clic.
                       *
                       * L'indice ne reprend pas l'en-tête : il est déjà lu
                       * juste avant. Et il ne le stringifie pas — un `header`
                       * en JSX donnerait « [object Object] ».
                       */}
                      <VisuallyHidden>{` — ${text.sortBy}`}</VisuallyHidden>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableEmpty colSpan={columnCount}>
              <div className={cx('py-8', tableCellSizeClass[size])}>
                <SkeletonText lines={3} />
              </div>
            </TableEmpty>
          ) : bodyEmpty ? (
            <TableEmpty colSpan={columnCount}>
              {empty ?? (
                <p
                  className={cx(
                    'text-fg-muted py-10 text-center',
                    tableCellSizeClass[size],
                  )}
                >
                  {text.empty}
                </p>
              )}
            </TableEmpty>
          ) : (
            paginated.map((row) => {
              const id = rowId(row);
              const locked = isRowLocked?.(row) ?? false;
              const checked = selectedSet.has(id);

              return (
                /*
                  La sélection ne peut pas réutiliser `surface-muted` : c'est le
                  survol de `TableRow`, et toute ligne prendrait alors
                  l'apparence d'une ligne cochée sous le curseur. Un ton plus
                  marqué, doublé d'un filet d'accent au bord — la couleur seule
                  ne porte pas l'état (1.4.1), même si la case le dit déjà.
                */
                <TableRow
                  key={id}
                  data-selected={checked ? '' : undefined}
                  className={
                    checked
                      ? 'bg-surface-hover shadow-[inset_3px_0_0_var(--d-ui-color-brand)]'
                      : undefined
                  }
                >
                  {selectable ? (
                    <TableCell>
                      {locked ? (
                        <span className="inline-flex items-center">
                          <LockGlyph />
                          <VisuallyHidden>{text.locked}</VisuallyHidden>
                        </span>
                      ) : (
                        <Checkbox
                          size="sm"
                          aria-label={text.selectRow(rowLabel?.(row) ?? id)}
                          checked={checked}
                          onChange={(event) => toggleRow(id, event.currentTarget.checked)}
                        />
                      )}
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      numeric={column.numeric}
                    >
                      {column.cell
                        ? column.cell(row)
                        : /* Même règle qu'à la recherche : pas de chaîne GMT. */
                          searchText(column.value(row) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </TableFrame>

      {footer !== undefined ? (
        footer
      ) : !loading && pageSize && pageCount > 1 ? (
        <div className="mt-3 flex justify-end">
          <Pagination
            page={safePage}
            pageCount={pageCount}
            onPageChange={commitPage}
            size="sm"
            label={caption}
          />
        </div>
      ) : null}
    </div>
  );
}
