import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cx } from '../../lib/cx';
import { useIsomorphicLayoutEffect } from '../../lib/useIsomorphicLayoutEffect';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableAlign = 'start' | 'center' | 'end';

type TableSection = 'table' | 'head' | 'body' | 'foot';

type TableContextValue = {
  size: TableSize;
  stickyHeader: boolean;
  captionId: string;
  section: TableSection;
  setHasCaption: (present: boolean) => void;
};

const TableContext = createContext<TableContextValue | null>(null);

function useTableContext(component: string): TableContextValue {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error(`<${component}> doit être rendu à l’intérieur de <Table>.`);
  }
  return context;
}

/**
 * Géométrie d'une cellule, par cran de densité.
 *
 * Partagée avec le mode données (`columns` / `rows`) pour que la légende
 * suive la même échelle. Interne au dossier : pas re-exportée du package.
 */
export const tableCellSizeClass: Record<TableSize, string> = {
  sm: 'px-2 py-1.5 text-sm',
  md: 'px-3 py-2.5 text-base',
  lg: 'px-4 py-3 text-lg',
};

const alignClass: Record<TableAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

/** Règle d'alignement partagée. Une seule implémentation, y compris en mode données. */
export function cellAlign(align: TableAlign | undefined, numeric: boolean): TableAlign {
  return align ?? (numeric ? 'end' : 'start');
}

function elementOverflows(node: HTMLElement): boolean {
  return (
    node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1
  );
}

export type TableFrameProps = HTMLAttributes<HTMLTableElement> & {
  /**
   * Légende visible (`<caption>`). Nomme le tableau et, en cas de débordement,
   * la région défilable (clavier).
   */
  caption?: ReactNode;
  /** Garde l’en-tête visible au défilement vertical du conteneur. */
  stickyHeader?: boolean;
  size?: TableSize;
  columns?: never;
  rows?: never;
  rowId?: never;
};

/** Conteneur sémantique (`<table>`) et zone de défilement. */
export function TableFrame({
  caption,
  stickyHeader = false,
  size = 'md',
  className,
  children,
  'aria-label': ariaLabel,
  ...rest
}: TableFrameProps) {
  const captionId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hasCaption, setHasCaption] = useState(Boolean(caption));
  const [overflows, setOverflows] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const update = () => {
      setOverflows(elementOverflows(node));
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children, caption, size, stickyHeader]);

  const named = hasCaption || Boolean(ariaLabel);

  return (
    <TableContext.Provider
      value={{ size, stickyHeader, captionId, section: 'table', setHasCaption }}
    >
      <div
        ref={scrollerRef}
        className={cx(
          'w-full max-w-full overflow-auto',
          overflows &&
            'focus-visible:ring-focus focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          className,
        )}
        {...(overflows
          ? {
              tabIndex: 0,
              ...(named
                ? {
                    role: 'region' as const,
                    'aria-labelledby': hasCaption ? captionId : undefined,
                    'aria-label': hasCaption ? undefined : ariaLabel,
                  }
                : {}),
            }
          : {})}
      >
        <table
          {...rest}
          aria-label={hasCaption ? undefined : ariaLabel}
          className="w-full min-w-full border-collapse font-sans text-fg"
        >
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

/** Légende native. Premier enfant du `<table>` ; porte le nom accessible. */
export function TableCaption({ className, children, ...rest }: TableCaptionProps) {
  const table = useTableContext('TableCaption');
  const { setHasCaption, captionId } = table;

  useIsomorphicLayoutEffect(() => {
    setHasCaption(true);
    return () => setHasCaption(false);
  }, [setHasCaption]);

  return (
    <caption
      {...rest}
      id={captionId}
      className={cx('caption-top mb-2 text-start text-sm font-medium text-fg', className)}
    >
      {children}
    </caption>
  );
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ className, children, ...rest }: TableHeaderProps) {
  const table = useTableContext('TableHeader');
  return (
    <TableContext.Provider value={{ ...table, section: 'head' }}>
      <thead {...rest} className={cx(className)}>
        {children}
      </thead>
    </TableContext.Provider>
  );
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className, children, ...rest }: TableBodyProps) {
  const table = useTableContext('TableBody');
  return (
    <TableContext.Provider value={{ ...table, section: 'body' }}>
      {/*
        Pas de filet sous la dernière ligne : il ferme déjà le corps, et il
        doublait le trait de tout conteneur bordé — le mode données en pose un.
      */}
      <tbody {...rest} className={cx('[&>tr:last-child>td]:border-b-0', className)}>
        {children}
      </tbody>
    </TableContext.Provider>
  );
}

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableFooter({ className, children, ...rest }: TableFooterProps) {
  const table = useTableContext('TableFooter');
  return (
    <TableContext.Provider value={{ ...table, section: 'foot' }}>
      <tfoot {...rest} className={cx('border-border border-t font-medium', className)}>
        {children}
      </tfoot>
    </TableContext.Provider>
  );
}

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className, ...rest }: TableRowProps) {
  const { section } = useTableContext('TableRow');
  return (
    <tr
      {...rest}
      className={cx(section === 'body' && 'hover:bg-surface-muted', className)}
    />
  );
}

/*
 * `align` est retiré des attributs natifs avant d'être redéclaré. L'attribut
 * HTML `align` est typé `"center"` par React : en intersection, il réduisait
 * `TableAlign` à ce seul cran et rendait `start` / `end` impossibles à passer,
 * alors que la doc les annonce. Il n'atteint jamais le DOM de toute façon —
 * il est déstructuré, et l'alignement passe par une classe.
 */
export type TableHeadProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  /** Alignement. `numeric` aligne à `end` s’il est omis. */
  align?: TableAlign;
  /** Chiffres tabulaires, sans retour à la ligne, alignés à la fin par défaut. */
  numeric?: boolean;
};

export function TableHead({
  align,
  numeric = false,
  scope,
  className,
  ...rest
}: TableHeadProps) {
  const { size, stickyHeader, section } = useTableContext('TableHead');
  const resolvedAlign = cellAlign(align, numeric);
  const inHead = section === 'head';

  return (
    <th
      {...rest}
      scope={scope ?? (inHead ? 'col' : 'row')}
      className={cx(
        'border-border text-fg',
        inHead ? 'border-b font-medium' : 'border-border-subtle border-b',
        tableCellSizeClass[size],
        alignClass[resolvedAlign],
        numeric && 'tabular-nums whitespace-nowrap',
        inHead && 'whitespace-nowrap',
        stickyHeader && inHead && 'bg-bg sticky top-0 z-10',
        className,
      )}
    />
  );
}

export type TableCellProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> & {
  align?: TableAlign;
  numeric?: boolean;
};

export function TableCell({
  align,
  numeric = false,
  className,
  ...rest
}: TableCellProps) {
  const { size } = useTableContext('TableCell');
  const resolvedAlign = cellAlign(align, numeric);

  return (
    <td
      {...rest}
      className={cx(
        'border-border-subtle border-b text-fg',
        tableCellSizeClass[size],
        alignClass[resolvedAlign],
        numeric && 'tabular-nums whitespace-nowrap',
        className,
      )}
    />
  );
}

export type TableEmptyProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /** Nombre de colonnes à couvrir. Obligatoire : le slot n’invente pas la grille. */
  colSpan: number;
  children: ReactNode;
};

/**
 * Ligne unique pour un état vide. Composer `EmptyState` (ou `ErrorState`)
 * en enfant : `Table` ne couple pas le métier du vide.
 */
export function TableEmpty({ colSpan, className, children, ...rest }: TableEmptyProps) {
  useTableContext('TableEmpty');
  return (
    <tr>
      <td
        {...rest}
        colSpan={colSpan}
        className={cx('border-border-subtle p-0', className)}
      >
        {children}
      </td>
    </tr>
  );
}
