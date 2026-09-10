import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Table as TableFromEntry,
  TableBody as TableBodyFromEntry,
  TableCaption as TableCaptionFromEntry,
  TableCell as TableCellFromEntry,
  TableEmpty as TableEmptyFromEntry,
  TableFooter as TableFooterFromEntry,
  TableHead as TableHeadFromEntry,
  TableHeader as TableHeaderFromEntry,
  TableRow as TableRowFromEntry,
} from '../../index';
import { EmptyState } from '../EmptyState/EmptyState';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

function Grades({
  caption = 'Notes du trimestre',
  numeric = false,
  footer = false,
  empty = false,
  stickyHeader = false,
  size,
  className,
}: {
  caption?: string | null;
  numeric?: boolean;
  footer?: boolean;
  empty?: boolean;
  stickyHeader?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <Table
      caption={caption ?? undefined}
      stickyHeader={stickyHeader}
      size={size}
      className={className}
    >
      <TableHeader>
        <TableRow>
          <TableHead>Élève</TableHead>
          <TableHead numeric={numeric}>Moyenne</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableEmpty colSpan={3}>
            <EmptyState title="Aucune note" description="Ajoutez un devoir." />
          </TableEmpty>
        ) : (
          <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell numeric={numeric}>18,5</TableCell>
            <TableCell>Admise</TableCell>
          </TableRow>
        )}
      </TableBody>
      {footer ? (
        <TableFooter>
          <TableRow>
            <TableCell>Moyenne de classe</TableCell>
            <TableCell numeric={numeric}>17,2</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
}

describe('Table', () => {
  it('is exported from the package entrypoint', () => {
    expect(TableFromEntry).toBe(Table);
    expect(TableHeaderFromEntry).toBe(TableHeader);
    expect(TableBodyFromEntry).toBe(TableBody);
    expect(TableFooterFromEntry).toBe(TableFooter);
    expect(TableRowFromEntry).toBe(TableRow);
    expect(TableHeadFromEntry).toBe(TableHead);
    expect(TableCellFromEntry).toBe(TableCell);
    expect(TableCaptionFromEntry).toBe(TableCaption);
    expect(TableEmptyFromEntry).toBe(TableEmpty);
  });

  it('renders a real table named by its caption', () => {
    render(<Grades />);
    const table = screen.getByRole('table', { name: 'Notes du trimestre' });
    expect(table.tagName).toBe('TABLE');
    expect(screen.getByRole('columnheader', { name: 'Élève' })).toHaveAttribute(
      'scope',
      'col',
    );
    expect(screen.getByRole('cell', { name: 'Ada Lovelace' })).toBeVisible();
  });

  it('accepts a TableCaption child instead of the caption prop', () => {
    render(
      <Table>
        <TableCaption>Présences</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada Lovelace</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Présences' })).toBeVisible();
  });

  it('aligns numeric cells to the end with tabular figures', () => {
    render(<Grades numeric />);
    const averageHead = screen.getByRole('columnheader', { name: 'Moyenne' });
    const averageCell = screen.getByRole('cell', { name: '18,5' });
    expect(averageHead.className).toContain('tabular-nums');
    expect(averageHead.className).toContain('text-end');
    expect(averageCell.className).toContain('tabular-nums');
    expect(averageCell.className).toContain('text-end');
  });

  it('honours an explicit align on header and cell', () => {
    render(
      <Table caption="Notes">
        <TableHeader>
          <TableRow>
            <TableHead align="center">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align="center">Admise</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('columnheader', { name: 'Statut' }).className).toContain(
      'text-center',
    );
    expect(screen.getByRole('cell', { name: 'Admise' }).className).toContain(
      'text-center',
    );
  });

  it('accepts every documented align, not just center', () => {
    /*
     * `align` est aussi un attribut HTML natif, que React type `"center"`. En
     * intersection avec `TableAlign`, il ne restait que ce cran : `start` et
     * `end` ne compilaient pas, alors que la doc les annonce. Ce test échoue à
     * la compilation si l'`Omit` disparaît, et au rendu si la classe change.
     */
    render(
      <Table caption="Notes">
        <TableHeader>
          <TableRow>
            <TableHead align="start">Élève</TableHead>
            <TableHead align="end">Moyenne</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align="start">Ada</TableCell>
            <TableCell align="end">18,5</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('columnheader', { name: 'Élève' }).className).toContain(
      'text-start',
    );
    expect(screen.getByRole('columnheader', { name: 'Moyenne' }).className).toContain(
      'text-end',
    );
    expect(screen.getByRole('cell', { name: 'Ada' }).className).toContain('text-start');
    expect(screen.getByRole('cell', { name: '18,5' }).className).toContain('text-end');
  });

  it('renders a footer row for totals', () => {
    const { container } = render(<Grades footer numeric />);
    expect(container.querySelector('tfoot')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Moyenne de classe' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '17,2' }).className).toContain(
      'tabular-nums',
    );
  });

  it('slots EmptyState in a spanning empty row', () => {
    render(<Grades empty />);
    const emptyCell = screen.getByRole('cell', { name: /Aucune note/ });
    expect(emptyCell).toHaveAttribute('colspan', '3');
    expect(
      within(emptyCell).getByRole('heading', { name: 'Aucune note', level: 2 }),
    ).toBeVisible();
  });

  it('keeps header cells sticky when stickyHeader is set', () => {
    render(<Grades stickyHeader />);
    expect(screen.getByRole('columnheader', { name: 'Élève' }).className).toContain(
      'sticky',
    );
  });

  it('uses a row-header scope on TableHead outside the header', () => {
    render(
      <Table caption="Horaires">
        <TableBody>
          <TableRow>
            <TableHead>Lundi</TableHead>
            <TableCell>08:00</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('rowheader', { name: 'Lundi' })).toHaveAttribute(
      'scope',
      'row',
    );
  });

  it('does not become a tab stop when content fits', () => {
    const { container } = render(<Grades />);
    expect(container.firstElementChild).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('throws when a part is rendered outside Table', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TableHead>Élève</TableHead>)).toThrow(
      '<TableHead> doit être rendu à l’intérieur de <Table>.',
    );
    error.mockRestore();
  });
});

describe('Table overflow', () => {
  const descriptors: Array<[string, PropertyDescriptor | undefined]> = [];

  beforeEach(() => {
    for (const key of ['scrollWidth', 'clientWidth', 'scrollHeight', 'clientHeight']) {
      descriptors.push([
        key,
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, key),
      ]);
    }
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 640;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 200;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return 80;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get() {
        return 80;
      },
    });
  });

  afterEach(() => {
    for (const [key, descriptor] of descriptors.splice(0)) {
      if (descriptor) {
        Object.defineProperty(HTMLElement.prototype, key, descriptor);
      } else {
        delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
      }
    }
  });

  it('makes a overflowing scroller a named, keyboard-reachable region', () => {
    render(<Grades className="max-w-xs" />);
    const scroller = screen.getByRole('region', { name: 'Notes du trimestre' });
    expect(scroller).toHaveAttribute('tabindex', '0');
    expect(scroller.querySelector('table')).toBeInTheDocument();
  });

  it('does not add a region role when the table is not named', () => {
    const { container } = render(<Grades caption={null} className="max-w-xs" />);
    const scroller = container.firstElementChild;
    expect(scroller).toHaveAttribute('tabindex', '0');
    expect(scroller).not.toHaveAttribute('role', 'region');
  });
});
