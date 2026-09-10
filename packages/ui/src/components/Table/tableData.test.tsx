import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Table as TableFromEntry } from '../../index';
import { Table, type TableColumn, type TableDataProps } from './Table';

type Row = { id: string; name: string; amount: number; locked?: boolean };

const ROWS: Row[] = [
  { id: '1', name: 'Bruno', amount: 30 },
  { id: '2', name: 'Amina', amount: 10 },
  { id: '3', name: 'Chloé', amount: 20, locked: true },
];

const COLUMNS: TableColumn<Row>[] = [
  { id: 'name', header: 'Nom', value: (row) => row.name },
  { id: 'amount', header: 'Montant', value: (row) => row.amount, align: 'end' },
  { id: 'actions', header: 'Actions', value: () => null, sortable: false },
];

const LABELS = {
  selectAll: 'Tout sélectionner',
  selectRow: (label: string) => `Sélectionner ${label}`,
  sortBy: 'Trier cette colonne',
  locked: 'Ligne verrouillée',
  results: (count: number) => `${count} résultats`,
  empty: 'Aucun résultat',
};

function Basic(props: Partial<TableDataProps<Row>> = {}) {
  const tableProps: TableDataProps<Row> = {
    columns: COLUMNS,
    rows: ROWS,
    rowId: (row) => row.id,
    caption: 'Commandes',
    rowLabel: (row) => row.name,
    labels: LABELS,
    ...props,
  };
  return <Table {...tableProps} />;
}

describe('Table data mode', () => {
  it('uses the same Table export as the compound table', () => {
    expect(TableFromEntry).toBe(Table);
  });

  it('is a real table named by its caption', () => {
    render(<Basic />);
    const table = screen.getByRole('table', { name: 'Commandes' });
    expect(table.tagName).toBe('TABLE');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(3);
    expect(within(table).getAllByRole('row')).toHaveLength(4); // en-tête + 3
  });

  it('associates cells with their header through scope, not ARIA', () => {
    render(<Basic />);
    for (const header of screen.getAllByRole('columnheader')) {
      expect(header).toHaveAttribute('scope', 'col');
    }
  });

  it('sorts through a real button and cycles asc, desc, none', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const sortName = screen.getByRole('button', { name: 'Nom — Trier cette colonne' });
    const header = screen.getByRole('columnheader', { name: /Nom/ });

    expect(header).not.toHaveAttribute('aria-sort');

    await user.click(sortName);
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Amina');

    await user.click(sortName);
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Chloé');

    await user.click(sortName);
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('marks only one column as sorted at a time', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole('button', { name: 'Nom — Trier cette colonne' }));
    await user.click(
      screen.getByRole('button', { name: 'Montant — Trier cette colonne' }),
    );

    const sorted = screen
      .getAllByRole('columnheader')
      .filter((th) => th.hasAttribute('aria-sort'));
    expect(sorted).toHaveLength(1);
    expect(sorted[0]).toHaveTextContent('Montant');
  });

  it('gives a non-sortable column no button at all', () => {
    render(<Basic />);
    const header = screen.getByRole('columnheader', { name: 'Actions' });
    expect(within(header).queryByRole('button')).not.toBeInTheDocument();
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('reports the sort to a controlled owner without moving on its own', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<Basic sort={null} onSortChange={onSortChange} />);

    await user.click(screen.getByRole('button', { name: 'Nom — Trier cette colonne' }));
    expect(onSortChange).toHaveBeenCalledWith({
      columnId: 'name',
      direction: 'ascending',
    });
    // Contrôlé : rien ne bouge tant que le parent ne renvoie pas la prop.
    expect(screen.getAllByRole('columnheader')[0]).not.toHaveAttribute('aria-sort');
  });

  it('names every selection checkbox', async () => {
    const user = userEvent.setup();
    render(<Basic selectable />);
    const box = screen.getByRole('checkbox', { name: 'Sélectionner Bruno' });
    await user.click(box);
    expect(box).toBeChecked();
  });

  it('shows a mixed state while only some rows are selected', async () => {
    const user = userEvent.setup();
    render(<Basic selectable />);
    const all = screen.getByRole('checkbox', { name: 'Tout sélectionner' });

    await user.click(screen.getByRole('checkbox', { name: 'Sélectionner Bruno' }));
    expect(all).toHaveAttribute('aria-checked', 'mixed');

    await user.click(all);
    expect(all).toBeChecked();
  });

  it('never selects a locked row, and says why in text', async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <Basic
        selectable
        onSelectedIdsChange={onSelectedIdsChange}
        isRowLocked={(row) => row.locked === true}
      />,
    );

    expect(
      screen.queryByRole('checkbox', { name: 'Sélectionner Chloé' }),
    ).not.toBeInTheDocument();
    // Le cadenas est décoratif : sans ce texte, rien ne dirait pourquoi.
    expect(screen.getByText('Ligne verrouillée')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Tout sélectionner' }));
    expect(onSelectedIdsChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('announces how many rows are left', async () => {
    const user = userEvent.setup();
    render(
      <Basic
        toolbar={({ search, setSearch }) => (
          <input
            aria-label="Rechercher"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        )}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('3 résultats');

    await user.type(screen.getByRole('textbox', { name: 'Rechercher' }), 'ami');
    expect(screen.getByRole('status')).toHaveTextContent('1 résultats');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('searches without accents and without case', async () => {
    const user = userEvent.setup();
    render(
      <Basic
        toolbar={({ search, setSearch }) => (
          <input
            aria-label="Rechercher"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        )}
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Rechercher' }), 'chloe');
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Chloé');
  });

  it('hands the toolbar the visible rows, so export never lives in the table', async () => {
    const user = userEvent.setup();
    const exported = vi.fn();
    render(
      <Basic
        defaultSort={{ columnId: 'name', direction: 'ascending' }}
        toolbar={({ rows }) => (
          <button type="button" onClick={() => exported(rows.map((row) => row.id))}>
            Exporter
          </button>
        )}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Exporter' }));
    // Les lignes arrivent triées, dans l'ordre affiché.
    expect(exported).toHaveBeenCalledWith(['2', '1', '3']);
  });

  it('paginates and names its pagination after the table', async () => {
    const user = userEvent.setup();
    render(<Basic pageSize={2} />);
    expect(screen.getAllByRole('row')).toHaveLength(3); // en-tête + 2
    const nav = screen.getByRole('navigation', { name: 'Commandes' });

    await user.click(within(nav).getByRole('button', { name: /Page 2/ }));
    expect(screen.getAllByRole('row')).toHaveLength(2); // en-tête + 1
  });

  it('never strands the user on a page that no longer exists', () => {
    const { rerender } = render(<Basic pageSize={2} defaultPage={2} />);
    expect(screen.getAllByRole('row')).toHaveLength(2); // en-tête + 1

    // Le jeu rétrécit : la page 2 n'existe plus.
    rerender(<Basic rows={[ROWS[0] as Row]} pageSize={2} defaultPage={2} />);
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('clamps a controlled page past the end and tells its owner', () => {
    const onPageChange = vi.fn();
    render(<Basic pageSize={2} page={9} onPageChange={onPageChange} />);
    // Sans bornage, la table serait vide et `aria-current` désignerait
    // une page dont aucune ligne n'est rendue.
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not reset the page on a table that has none', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Basic
        onPageChange={onPageChange}
        toolbar={({ search, setSearch }) => (
          <input
            aria-label="Rechercher"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        )}
      />,
    );
    await user.type(screen.getByRole('textbox', { name: 'Rechercher' }), 'ami');
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('keeps select-all within the page on screen', async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(<Basic selectable pageSize={2} onSelectedIdsChange={onSelectedIdsChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Tout sélectionner' }));
    // Deux lignes affichées : cocher la troisième, invisible, serait un piège.
    expect(onSelectedIdsChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('names the sort button without stringifying a JSX header', () => {
    render(
      <Basic
        columns={[
          { id: 'name', header: <span>Nom</span>, value: (row: Row) => row.name },
        ]}
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Nom — Trier cette colonne');
    expect(button.textContent).not.toContain('[object Object]');
  });

  it('shows and searches a date as a date, not as a GMT string', async () => {
    const user = userEvent.setup();
    render(
      <Basic
        columns={[{ id: 'due', header: 'Échéance', value: () => new Date('2026-08-02') }]}
        toolbar={({ search, setSearch }) => (
          <input
            aria-label="Rechercher"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        )}
      />,
    );
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('2026-08-02');
    await user.type(screen.getByRole('textbox', { name: 'Rechercher' }), '2026-08');
    expect(screen.getByRole('status')).toHaveTextContent('3 résultats');
  });

  it('lets footer={null} mean no footer at all', () => {
    render(<Basic pageSize={2} footer={null} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders an empty state rather than a bare table', () => {
    render(<Basic rows={[]} />);
    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 résultats');
  });

  it('slots custom empty content instead of the default paragraph', () => {
    render(<Basic rows={[]} empty={<p>Rien à afficher</p>} />);
    expect(screen.getByText('Rien à afficher')).toBeInTheDocument();
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
  });

  it('shows a busy skeleton instead of rows or an empty lie', () => {
    render(<Basic loading pageSize={2} selectable />);
    const table = screen.getByRole('table', { name: 'Commandes' });
    expect(table).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('Bruno')).not.toBeInTheDocument();
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Nom — Trier cette colonne' }),
    ).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Tout sélectionner' })).toBeDisabled();
    expect(table.querySelector('.d-ui-skeleton')).not.toBeNull();
  });

  it('puts className on the scroll container, like compound Table', () => {
    render(<Basic className="max-h-56" />);
    expect(screen.getByRole('table').parentElement).toHaveClass('max-h-56');
  });

  it('falls back to English labels when none are given', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        rowId={(row: Row) => row.id}
        caption="Orders"
        selectable
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
  });
  it('uses the geometry Table defines, not a private padding table', () => {
    /*
     * L'assertion nomme les classes attendues : comparer deux rendus entre eux
     * passerait même avec une échelle inversée ou fausse.
     */
    for (const [size, expected] of [
      ['sm', 'px-2'],
      ['md', 'px-3'],
      ['lg', 'px-4'],
    ] as const) {
      const view = render(<Basic size={size} />);
      expect(view.getAllByRole('cell')[0]?.className).toContain(expected);
      // La légende suit la même échelle : sans padding elle touchait le cadre.
      expect(view.container.querySelector('caption')?.className).toContain(expected);
      view.unmount();
    }
  });

  it('keeps a selected row distinct from a merely hovered one', async () => {
    /*
     * `TableRow` pose `hover:bg-surface-muted` sur le corps. Si la sélection
     * reprenait ce jeton, toute ligne survolée aurait l'air cochée.
     */
    const user = userEvent.setup();
    render(<Basic selectable />);
    await user.click(screen.getByRole('checkbox', { name: 'Sélectionner Bruno' }));

    const rows = screen.getAllByRole('row').slice(1);
    const selected = rows.find((row) => row.hasAttribute('data-selected'));
    const plain = rows.find((row) => !row.hasAttribute('data-selected'));

    /*
     * Sur les jetons, pas sur la chaîne : `hover:bg-surface-muted` contient
     * `bg-surface-muted` en sous-chaîne, et l'assertion serait fausse.
     */
    expect(selected?.classList.contains('bg-surface-muted')).toBe(false);
    expect(selected?.classList.contains('bg-surface-hover')).toBe(true);
    // Et le repère ne tient pas qu'à la couleur (1.4.1) : un filet d'accent.
    expect(selected?.className).toContain('inset_3px');
    expect(plain?.classList.contains('bg-surface-hover')).toBe(false);
  });

  it('draws no rule under the last row, which would double the border', () => {
    const { container } = render(<Basic />);
    const body = container.querySelector('tbody');
    expect(body?.className).toContain('[&>tr:last-child>td]:border-b-0');
  });

  it('leaves align alone: only numeric brings tabular figures', () => {
    /*
     * `align` positionne, `numeric` met les chiffres tabulaires. C'est la règle
     * de `Table`. Ce test la fige plutôt que de laisser `align` poser des
     * chiffres tabulaires tout seul.
     */
    const columns: TableColumn<Row>[] = [
      { id: 'name', header: 'Nom', value: (row) => row.name },
      { id: 'amount', header: 'Montant', value: (row) => row.amount, align: 'end' },
    ];
    render(<Basic columns={columns} />);
    const amount = screen.getAllByRole('cell')[1];
    expect(amount?.className).toContain('text-end');
    expect(amount?.className).not.toContain('tabular-nums');
  });

  it('gives a numeric column tabular figures, through Table', () => {
    const columns: TableColumn<Row>[] = [
      { id: 'name', header: 'Nom', value: (row) => row.name },
      { id: 'amount', header: 'Montant', value: (row) => row.amount, numeric: true },
    ];
    render(<Basic columns={columns} />);
    const amount = screen.getAllByRole('cell')[1];
    expect(amount?.className).toContain('tabular-nums');
    // `numeric` sans `align` aligne à la fin : c'est la règle de `Table`.
    expect(amount?.className).toContain('text-end');
  });

  it('keeps the caption as the accessible name even when hidden on screen', () => {
    render(<Basic hideCaption />);
    const table = screen.getByRole('table', { name: 'Commandes' });
    const caption = table.querySelector('caption');
    expect(caption).toHaveTextContent('Commandes');
    expect(caption?.className).toContain('d-ui-visually-hidden');
  });
});

describe('Table data mode overflow', () => {
  const descriptors: Array<[string, PropertyDescriptor | undefined]> = [];

  beforeEach(() => {
    for (const key of ['scrollWidth', 'clientWidth', 'scrollHeight', 'clientHeight']) {
      descriptors.push([
        key,
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, key),
      ]);
    }
    const stub = (key: string, value: number) =>
      Object.defineProperty(HTMLElement.prototype, key, {
        configurable: true,
        get: () => value,
      });
    stub('scrollWidth', 640);
    stub('clientWidth', 200);
    stub('scrollHeight', 80);
    stub('clientHeight', 80);
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

  it('makes a table too wide to fit reachable and scrollable by keyboard', () => {
    /*
     * C'est le gain de la composition : avant, la zone défilable était un
     * `div` nu que personne au clavier ne pouvait atteindre (WCAG 2.1.1).
     */
    render(<Basic />);
    const region = screen.getByRole('region', { name: 'Commandes' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region.querySelector('table')).toBe(screen.getByRole('table'));
  });
});
