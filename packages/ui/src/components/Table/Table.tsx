import type { ReactNode } from 'react';
import { TableData, type TableDataProps } from './tableData';
import { TableFrame, type TableFrameProps } from './tableMarkup';

export {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './tableMarkup';
export type {
  TableAlign,
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableEmptyProps,
  TableFooterProps,
  TableFrameProps,
  TableHeadProps,
  TableHeaderProps,
  TableRowProps,
  TableSize,
} from './tableMarkup';
export type {
  TableColumn,
  TableDataProps,
  TableLabels,
  TableToolbarApi,
} from './tableData';
export type { SortDirection, SortValue, TableSort } from './tableRows';

export type TableProps<Row = unknown> = TableFrameProps | TableDataProps<Row>;

function isTableDataProps<Row>(props: TableProps<Row>): props is TableDataProps<Row> {
  return 'columns' in props && props.columns != null;
}

/**
 * Tableau sémantique (`<table>`).
 *
 * Sans `columns` : composez `TableHeader`, `TableBody`, `TableRow`, etc.
 * Avec `columns` / `rows` / `rowId` : tri, recherche, sélection et pagination
 * se posent sur le même tableau — pas un second composant.
 */
export function Table(props: TableFrameProps): ReactNode;
export function Table<Row>(props: TableDataProps<Row>): ReactNode;
export function Table<Row>(props: TableProps<Row>): ReactNode {
  if (isTableDataProps(props)) {
    return <TableData {...props} />;
  }
  return <TableFrame {...props} />;
}
