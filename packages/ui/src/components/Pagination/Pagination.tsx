import { useCallback, useMemo, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import {
  PaginationNext,
  PaginationPageItems,
  PaginationPrevious,
  PaginationProvider,
  type PaginationSize,
} from './PaginationParts';

export type { PaginationSize } from './PaginationParts';
export {
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
  PaginationStatus,
} from './PaginationParts';

export type PaginationProps = {
  /** Page courante, 1-indexée. Contrôlé. */
  page: number;
  /** Nombre total de pages. */
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages numérotées de chaque côté de la courante. Défaut : `1`. */
  siblingCount?: number;
  /** Nom accessible du `nav`. Fallback anglais si omis. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name for a page button. */
  pageLabel?: (page: number, current: boolean) => string;
  disabled?: boolean;
  size?: PaginationSize;
  className?: string;
  /**
   * Disposition libre.
   *
   * Sans `children`, le rendu par défaut : précédent, numéros, suivant sur une
   * ligne. Avec `children`, composez `PaginationPrevious`, `PaginationPages`,
   * `PaginationNext` et `PaginationStatus` où vous voulez — le `nav` nommé et
   * l'état restent portés ici, il n'y a donc pas deux paginations à tenir
   * d'accord.
   */
  children?: ReactNode;
};

function defaultPageLabel(page: number, current: boolean): string {
  return current ? `Page ${page}, current page` : `Page ${page}`;
}

/**
 * Pagination contrôlée.
 *
 * Un seul `nav` nommé quelle que soit la disposition : les sous-composants
 * lisent le même contexte, donc le rendu par défaut et les compositions
 * partagent une implémentation.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  label = 'Pagination',
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = defaultPageLabel,
  disabled = false,
  size = 'md',
  className,
  children,
}: PaginationProps) {
  const current = pageCount < 1 ? 0 : Math.min(Math.max(page, 1), pageCount);

  const go = useCallback(
    (next: number) => {
      if (disabled || next < 1 || next > pageCount || next === current) return;
      onPageChange(next);
    },
    [disabled, pageCount, current, onPageChange],
  );

  const value = useMemo(
    () => ({
      page: current,
      pageCount,
      siblingCount,
      previousLabel,
      nextLabel,
      pageLabel,
      disabled,
      size,
      go,
    }),
    [
      current,
      pageCount,
      siblingCount,
      previousLabel,
      nextLabel,
      pageLabel,
      disabled,
      size,
      go,
    ],
  );

  return (
    <PaginationProvider value={value}>
      <nav aria-label={label} className={cx('font-sans', className)}>
        {children ?? (
          /*
           * Une seule `<ul>` : précédent et suivant sont des éléments de la
           * même liste que les numéros. C'est le DOM d'origine, et « liste,
           * 7 éléments » compte bien tous les contrôles.
           */
          <ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
            <li>
              <PaginationPrevious />
            </li>
            <PaginationPageItems />
            <li>
              <PaginationNext />
            </li>
          </ul>
        )}
      </nav>
    </PaginationProvider>
  );
}
