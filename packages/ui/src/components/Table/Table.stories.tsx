import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { tableArgTypes } from '../../../.storybook/arg-types';
import {
  docsLocale,
  tableCopy,
  tableDataCopy,
  type TableDataDocsCopy,
} from '../../../.storybook/docs-locale';
import { componentSource } from '../../../.storybook/docs-source';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { EmptyState } from '../EmptyState/EmptyState';
import { Menu, MenuItem, MenuSeparator } from '../Menu/Menu';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs/Tabs';
import { Tag } from '../Tag/Tag';
import { TextInput } from '../TextInput/TextInput';
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
  type TableColumn,
  type TableFrameProps,
  type TableLabels,
} from './Table';

const importTable = `import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'd-ui';`;
const importCaption = `import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'd-ui';`;
const importEmpty = `import {
    EmptyState,
    Table,
    TableBody,
    TableCell,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from 'd-ui';`;
const importFooter = `import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from 'd-ui';`;

const meta = {
  title: 'Components/Table',
  component: Table as ComponentType<TableFrameProps>,
  args: { children: <span /> },
  argTypes: tableArgTypes,
} satisfies Meta<TableFrameProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  parameters: componentSource(
    importTable,
    `<Table caption="Notes du trimestre">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Moyenne</TableHead>
            <TableHead>Statut</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell>18,5</TableCell>
            <TableCell>Admise</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.caption}>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead>{copy.average}</TableHead>
            <TableHead>{copy.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{copy.ada}</TableCell>
            <TableCell>{copy.averageAda}</TableCell>
            <TableCell>{copy.admitted}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{copy.grace}</TableCell>
            <TableCell>{copy.averageGrace}</TableCell>
            <TableCell>{copy.admitted}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{copy.katherine}</TableCell>
            <TableCell>{copy.averageKatherine}</TableCell>
            <TableCell>{copy.admitted}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Numeric: Story = {
  name: 'Alignement numérique',
  parameters: componentSource(
    importTable,
    `<Table caption="Notes du trimestre">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead numeric>Moyenne</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell numeric>18,5</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.caption}>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead numeric>{copy.average}</TableHead>
            <TableHead numeric>{copy.hours}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{copy.ada}</TableCell>
            <TableCell numeric>{copy.averageAda}</TableCell>
            <TableCell numeric>{copy.hoursAda}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{copy.grace}</TableCell>
            <TableCell numeric>{copy.averageGrace}</TableCell>
            <TableCell numeric>{copy.hoursGrace}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Align: Story = {
  name: 'Alignements',
  parameters: componentSource(
    importTable,
    `<Table caption="Notes du trimestre">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead align="center">Statut</TableHead>
            <TableHead numeric>Moyenne</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell align="center">Admise</TableCell>
            <TableCell numeric>18,5</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.caption}>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead align="center">{copy.status}</TableHead>
            <TableHead numeric>{copy.average}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{copy.ada}</TableCell>
            <TableCell align="center">{copy.admitted}</TableCell>
            <TableCell numeric>{copy.averageAda}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{copy.grace}</TableCell>
            <TableCell align="center">{copy.admitted}</TableCell>
            <TableCell numeric>{copy.averageGrace}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Caption: Story = {
  name: 'Légende',
  parameters: componentSource(
    importCaption,
    `<Table>
    <TableCaption>Notes du trimestre</TableCaption>
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Statut</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell>Admise</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    const { caption: _caption, ...rest } = args;
    return (
      <Table {...rest}>
        <TableCaption>{copy.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead>{copy.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{copy.ada}</TableCell>
            <TableCell>{copy.admitted}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Overflow: Story = {
  name: 'Débordement',
  parameters: componentSource(
    importTable,
    `<Table caption="Planning de la semaine" className="max-w-md">
    <TableHeader>
        <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Lundi</TableHead>
            <TableHead>Mardi</TableHead>
            <TableHead>Mercredi</TableHead>
            <TableHead>Jeudi</TableHead>
            <TableHead>Vendredi</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Algèbre linéaire — espaces vectoriels</TableCell>
            <TableCell>08:00</TableCell>
            <TableCell>10:00</TableCell>
            <TableCell>08:00</TableCell>
            <TableCell>14:00</TableCell>
            <TableCell>09:00</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.scheduleCaption} className="max-w-md">
        <TableHeader>
          <TableRow>
            <TableHead>{copy.module}</TableHead>
            <TableHead>{copy.monday}</TableHead>
            <TableHead>{copy.tuesday}</TableHead>
            <TableHead>{copy.wednesday}</TableHead>
            <TableHead>{copy.thursday}</TableHead>
            <TableHead>{copy.friday}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="whitespace-nowrap">{copy.longModule}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotMorning}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotLate}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotMorning}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotAfternoon}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotMid}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="whitespace-nowrap">{copy.longModuleTwo}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotAfternoon}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotMorning}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotLate}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotMorning}</TableCell>
            <TableCell className="whitespace-nowrap">{copy.slotAfternoon}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Empty: Story = {
  name: 'État vide',
  parameters: componentSource(
    importEmpty,
    `<Table caption="Notes du trimestre">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Moyenne</TableHead>
            <TableHead>Statut</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableEmpty colSpan={3}>
            <EmptyState
                title="Aucune note"
                description="Les notes apparaîtront après le premier devoir."
            />
        </TableEmpty>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.caption}>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead>{copy.average}</TableHead>
            <TableHead>{copy.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableEmpty colSpan={3}>
            <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
          </TableEmpty>
        </TableBody>
      </Table>
    );
  },
};

export const StickyHeader: Story = {
  name: 'En-tête collant',
  parameters: componentSource(
    importTable,
    `<Table caption="Notes du trimestre" stickyHeader className="max-h-56">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead numeric>Moyenne</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell numeric>18,5</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    const rows = [
      copy.ada,
      copy.grace,
      copy.katherine,
      copy.annie,
      copy.hypatia,
      copy.emmy,
      copy.sofia,
      copy.maryam,
    ];
    return (
      <Table {...args} caption={copy.caption} stickyHeader className="max-h-56">
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead numeric>{copy.average}</TableHead>
            <TableHead>{copy.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((name, index) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell numeric>{copy.stickyAverages[index]}</TableCell>
              <TableCell>{copy.admitted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const Footer: Story = {
  name: 'Pied de tableau',
  parameters: componentSource(
    importFooter,
    `<Table caption="Notes du trimestre">
    <TableHeader>
        <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead numeric>Moyenne</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>Ada Lovelace</TableCell>
            <TableCell numeric>18,5</TableCell>
        </TableRow>
    </TableBody>
    <TableFooter>
        <TableRow>
            <TableCell>Moyenne de classe</TableCell>
            <TableCell numeric>17,2</TableCell>
        </TableRow>
    </TableFooter>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.caption}>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.student}</TableHead>
            <TableHead numeric>{copy.average}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{copy.ada}</TableCell>
            <TableCell numeric>{copy.averageAda}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{copy.grace}</TableCell>
            <TableCell numeric>{copy.averageGrace}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>{copy.classAverage}</TableCell>
            <TableCell numeric>{copy.classAverageValue}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

export const RowHeader: Story = {
  name: 'En-tête de ligne',
  parameters: componentSource(
    importTable,
    `<Table caption="Planning de la semaine">
    <TableBody>
        <TableRow>
            <TableHead>Lundi</TableHead>
            <TableCell>08:00</TableCell>
            <TableCell>Algèbre linéaire — espaces vectoriels</TableCell>
        </TableRow>
    </TableBody>
</Table>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <Table {...args} caption={copy.scheduleCaption}>
        <TableBody>
          <TableRow>
            <TableHead>{copy.monday}</TableHead>
            <TableCell>{copy.slotMorning}</TableCell>
            <TableCell>{copy.longModule}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>{copy.tuesday}</TableHead>
            <TableCell>{copy.slotLate}</TableCell>
            <TableCell>{copy.longModuleTwo}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  parameters: componentSource(
    importTable,
    `<>
    <Table caption="Notes du trimestre" size="sm">
        <TableHeader>
            <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead numeric>Moyenne</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell numeric>18,5</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    <Table caption="Notes du trimestre" size="lg">
        <TableHeader>
            <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead numeric>Moyenne</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell numeric>18,5</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</>`,
  ),
  render: (args, { globals }) => {
    const copy = tableCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-col gap-8">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Table key={size} {...args} caption={copy.caption} size={size}>
            <TableHeader>
              <TableRow>
                <TableHead>{copy.student}</TableHead>
                <TableHead numeric>{copy.average}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{copy.ada}</TableCell>
                <TableCell numeric>{copy.averageAda}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </div>
    );
  },
};

const importColumns = "import { Table } from 'd-ui';";

export const DataColumns: Story = {
  name: 'Colonnes et lignes',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes du trimestre"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
/>`,
    `const columns = [
    { id: 'reference', header: 'Référence', value: (row) => row.reference },
    { id: 'amount', header: 'Montant', numeric: true, value: (row) => row.amount },
];`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
      />
    );
  },
};

type Status = 'paid' | 'pending' | 'late' | 'draft';

type Order = {
  id: string;
  reference: string;
  client: string;
  amount: number;
  date: string;
  status: Status;
  closed?: boolean;
};

const ORDERS: Order[] = [
  {
    id: '1',
    reference: 'CMD-1042',
    client: 'Amina Doumbouya',
    amount: 1250,
    date: '2026-08-02',
    status: 'paid',
    closed: true,
  },
  {
    id: '2',
    reference: 'CMD-1043',
    client: 'Bruno Kessi',
    amount: 340,
    date: '2026-08-05',
    status: 'pending',
  },
  {
    id: '3',
    reference: 'CMD-1044',
    client: 'Chloé Adjovi',
    amount: 8900,
    date: '2026-08-09',
    status: 'late',
  },
  {
    id: '4',
    reference: 'CMD-1045',
    client: 'Élodie Sagbo',
    amount: 76,
    date: '2026-08-11',
    status: 'draft',
  },
  {
    id: '5',
    reference: 'CMD-1046',
    client: 'Farid Zinsou',
    amount: 2410,
    date: '2026-08-14',
    status: 'paid',
  },
  {
    id: '6',
    reference: 'CMD-1047',
    client: 'Grace Houngbo',
    amount: 530,
    date: '2026-08-18',
    status: 'pending',
  },
  {
    id: '7',
    reference: 'CMD-1048',
    client: 'Hervé Noukpo',
    amount: 15300,
    date: '2026-08-21',
    status: 'late',
  },
];

const tagVariant: Record<Status, 'success' | 'warning' | 'danger' | 'neutral'> = {
  paid: 'success',
  pending: 'warning',
  late: 'danger',
  draft: 'neutral',
};

function statusText(copy: TableDataDocsCopy, status: Status): string {
  return copy[status];
}

function money(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value);
}

function labels(copy: TableDataDocsCopy): TableLabels {
  return {
    selectAll: copy.selectAll,
    selectRow: copy.selectRow,
    sortBy: copy.sortBy,
    locked: copy.locked,
    results: copy.results,
    empty: copy.empty,
  };
}

function columns(copy: TableDataDocsCopy, locale: string): TableColumn<Order>[] {
  return [
    { id: 'reference', header: copy.reference, value: (row) => row.reference },
    { id: 'client', header: copy.client, value: (row) => row.client },
    {
      id: 'amount',
      header: copy.amount,
      // `numeric` aligne à la fin **et** pose les chiffres tabulaires.
      numeric: true,
      // Trié sur le nombre, affiché formaté : trier sur « 1 250 F » serait faux.
      value: (row) => row.amount,
      cell: (row) => money(row.amount, locale),
    },
    {
      id: 'date',
      header: copy.date,
      value: (row) => new Date(row.date),
      cell: (row) => row.date,
    },
    {
      id: 'status',
      header: copy.status,
      // Cherché et trié sur le mot, pas sur le JSX du badge.
      value: (row) => statusText(copy, row.status),
      cell: (row) => (
        <Tag variant={tagVariant[row.status]}>{statusText(copy, row.status)}</Tag>
      ),
    },
  ];
}

/*
 * Le composant est générique ; `Meta<typeof Table>` effacerait `Row` en
 * `unknown`. On fige la ligne une fois ici, et toutes les stories en héritent.
 */
export const Search: Story = {
  name: 'Recherche',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    toolbar={({ search, setSearch }) => (
        <TextInput
            type="search"
            label="Rechercher une commande"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
        />
    )}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        toolbar={({ search, setSearch }) => (
          <TextInput
            type="search"
            label={copy.search}
            placeholder={copy.searchPlaceholder}
            value={search}
            fullWidth={false}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        )}
      />
    );
  },
};

export const Filtering: Story = {
  name: 'Filtres',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={onlyLate ? orders.filter((o) => o.status === 'late') : orders}
    rowId={(row) => row.id}
    toolbar={<Button onClick={() => setOnlyLate(!onlyLate)}>En retard seulement</Button>}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return <FilterDemo copy={copy} locale={locale} />;
  },
};

function FilterDemo({ copy, locale }: { copy: TableDataDocsCopy; locale: string }) {
  const [onlyLate, setOnlyLate] = useState(false);
  /*
   * Le filtre vit dans la page, pas dans la table : chaque produit a ses
   * critères, et une prop `filters` générique finirait en langage de requête.
   */
  const rows = onlyLate ? ORDERS.filter((order) => order.status === 'late') : ORDERS;

  return (
    <Table
      columns={columns(copy, locale)}
      rows={rows}
      rowId={(row) => row.id}
      caption={copy.caption}
      labels={labels(copy)}
      toolbar={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            isSelected={!onlyLate}
            onClick={() => setOnlyLate(false)}
          >
            {copy.all}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isSelected={onlyLate}
            onClick={() => setOnlyLate(true)}
          >
            {copy.onlyLate}
          </Button>
        </div>
      }
    />
  );
}

export const Sorting: Story = {
  name: 'Tri',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    defaultSort={{ columnId: 'amount', direction: 'descending' }}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        defaultSort={{ columnId: 'amount', direction: 'descending' }}
        locale={locale === 'en' ? 'en' : 'fr'}
      />
    );
  },
};

export const NonSortable: Story = {
  name: 'Colonne non triable',
  parameters: componentSource(
    importColumns,
    `const columns = [
    ...,
    { id: 'actions', header: 'Actions', value: () => null, sortable: false },
];`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={[
          ...columns(copy, locale),
          {
            id: 'actions',
            header: copy.actions,
            // Rien à trier : l'en-tête reste un `th`, sans bouton ni aria-sort.
            value: () => null,
            sortable: false,
            align: 'end',
            cell: (row) => (
              <Menu
                label={copy.rowActions}
                trigger={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={`${copy.rowActions} — ${row.reference}`}
                    icon={
                      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                        <circle cx="8" cy="3" r="1.4" fill="currentColor" />
                        <circle cx="8" cy="8" r="1.4" fill="currentColor" />
                        <circle cx="8" cy="13" r="1.4" fill="currentColor" />
                      </svg>
                    }
                  />
                }
              >
                <MenuItem>{copy.edit}</MenuItem>
                <MenuItem>{copy.duplicate}</MenuItem>
                <MenuSeparator />
                <MenuItem>{copy.archive}</MenuItem>
              </Menu>
            ),
          },
        ]}
        rows={ORDERS.slice(0, 4)}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
      />
    );
  },
};

export const SelectingRows: Story = {
  name: 'Sélection de lignes',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    selectable
    rowLabel={(row) => row.reference}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS.slice(0, 5)}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        selectable
        rowLabel={(row) => `${row.reference} — ${row.client}`}
        defaultSelectedIds={['2']}
      />
    );
  },
};

export const LockedRows: Story = {
  name: 'Lignes verrouillées',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    selectable
    isRowLocked={(row) => row.closed === true}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS.slice(0, 5)}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        selectable
        rowLabel={(row) => `${row.reference} — ${row.client}`}
        isRowLocked={(row) => row.closed === true}
      />
    );
  },
};

export const Export: Story = {
  name: 'Export',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    selectable
    toolbar={({ rows, selectedIds }) => (
        // La table donne les lignes visibles ; le fichier est à vous.
        <Button onClick={() => downloadCsv(rows, selectedIds)}>Exporter</Button>
    )}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return <ExportDemo copy={copy} locale={locale} />;
  },
};

function ExportDemo({ copy, locale }: { copy: TableDataDocsCopy; locale: string }) {
  const [message, setMessage] = useState('');
  return (
    <Table
      columns={columns(copy, locale)}
      rows={ORDERS.slice(0, 5)}
      rowId={(row) => row.id}
      caption={copy.caption}
      labels={labels(copy)}
      selectable
      rowLabel={(row) => row.reference}
      toolbar={({ rows, selectedIds }) => (
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setMessage(
                copy.exported(selectedIds.length > 0 ? selectedIds.length : rows.length),
              )
            }
          >
            {copy.export}
          </Button>
          {/*
           * Pas de seconde région live : la table en a déjà une. Deux
           * régions polies dans un même composant s'annoncent en désordre.
           */}
          <p className="text-fg-muted m-0 text-sm">{message}</p>
        </div>
      )}
    />
  );
}

export const TablePagination: Story = {
  name: 'Pagination',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    pageSize={3}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        pageSize={3}
      />
    );
  },
};

export const WithTabs: Story = {
  name: 'Avec onglets',
  parameters: componentSource(
    "import { Tab, TabList, TabPanel, Table, Tabs } from 'd-ui';",
    `<Tabs defaultValue="all">
    <TabList>
        <Tab value="all">Toutes</Tab>
        <Tab value="late">En retard</Tab>
    </TabList>
    <TabPanel value="all"><Table rows={orders} … /></TabPanel>
    <TabPanel value="late"><Table rows={late} … /></TabPanel>
</Tabs>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    const groups = [
      { value: 'all', label: copy.tabAll, rows: ORDERS },
      {
        value: 'late',
        label: copy.tabLate,
        rows: ORDERS.filter((o) => o.status === 'late'),
      },
      {
        value: 'paid',
        label: copy.tabPaid,
        rows: ORDERS.filter((o) => o.status === 'paid'),
      },
    ];

    return (
      <Tabs defaultValue="all" label={copy.caption}>
        <TabList>
          {groups.map((group) => (
            <Tab key={group.value} value={group.value}>
              {group.label}
            </Tab>
          ))}
        </TabList>
        {groups.map((group) => (
          <TabPanel key={group.value} value={group.value}>
            <Table
              className="mt-4"
              columns={columns(copy, locale)}
              rows={group.rows}
              rowId={(row) => row.id}
              caption={`${copy.caption} — ${group.label}`}
              hideCaption
              labels={labels(copy)}
            />
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};

export const EmptyResults: Story = {
  name: 'Aucun résultat',
  parameters: componentSource(
    "import { EmptyState, Table } from 'd-ui';",
    `<Table
    caption="Commandes"
    columns={columns}
    rows={[]}
    rowId={(row) => row.id}
    empty={<EmptyState title="Aucune commande" description="Élargissez la recherche." />}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={[]}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        empty={<EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />}
      />
    );
  },
};

export const Loading: Story = {
  name: 'Chargement',
  parameters: componentSource(
    importColumns,
    `<Table
    caption="Commandes du trimestre"
    columns={columns}
    rows={orders}
    rowId={(row) => row.id}
    loading
    pageSize={3}
/>`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    const copy = tableDataCopy(locale);
    return (
      <Table
        columns={columns(copy, locale)}
        rows={ORDERS}
        rowId={(row) => row.id}
        caption={copy.caption}
        labels={labels(copy)}
        loading
        pageSize={3}
      />
    );
  },
};
