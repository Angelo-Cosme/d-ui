import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { paginationArgTypes } from '../../../.storybook/arg-types';
import {
  docsLocale,
  paginationCopy,
  tableDataCopy,
} from '../../../.storybook/docs-locale';
import { componentSource, componentSourceFn } from '../../../.storybook/docs-source';
import { Card, CardBody, CardFooter } from '../Card/Card';
import { Text } from '../Text/Text';
import { Pagination } from './Pagination';
import {
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
  PaginationStatus,
} from './PaginationParts';

const importPagination =
  "import { useState } from 'react';\nimport { Pagination } from 'd-ui';";

function paginationSource(
  jsx: string,
  initial = '3',
): ReturnType<typeof componentSourceFn> {
  return componentSourceFn(
    importPagination,
    `const [page, setPage] = useState(${initial});
return (
${jsx
  .trim()
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
);`,
  );
}

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    page: 3,
    pageCount: 8,
    onPageChange: () => undefined,
  },
  argTypes: paginationArgTypes,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function LabeledPagination({
  copy,
  pageCount,
  initial = 3,
  size,
  disabled,
}: {
  copy: ReturnType<typeof paginationCopy>;
  pageCount: number;
  initial?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const [page, setPage] = useState(initial);
  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      label={copy.label}
      previousLabel={copy.previous}
      nextLabel={copy.next}
      pageLabel={(next, current) => (current ? copy.pageCurrent(next) : copy.page(next))}
      size={size}
      disabled={disabled}
    />
  );
}

export const Default: Story = {
  name: 'Par défaut',
  parameters: paginationSource(`<Pagination
    page={page}
    pageCount={8}
    onPageChange={setPage}
    label="Pagination des devoirs"
    previousLabel="Page précédente"
    nextLabel="Page suivante"
/>`),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return <LabeledPagination copy={copy} pageCount={8} />;
  },
};

export const ManyPages: Story = {
  name: 'Beaucoup de pages',
  parameters: paginationSource(
    `<Pagination
    page={page}
    pageCount={24}
    onPageChange={setPage}
    label="Pagination des devoirs"
    previousLabel="Page précédente"
    nextLabel="Page suivante"
/>`,
    '12',
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return <LabeledPagination copy={copy} pageCount={24} initial={12} />;
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  parameters: componentSource(
    "import { Pagination } from 'd-ui';",
    `<Pagination
    page={3}
    pageCount={8}
    disabled
    onPageChange={() => {}}
    label="Pagination des devoirs"
/>`,
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return <LabeledPagination copy={copy} pageCount={8} disabled />;
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  parameters: componentSource(
    "import { Pagination } from 'd-ui';",
    `<>
    <Pagination size="sm" page={2} pageCount={5} onPageChange={() => {}} />
    <Pagination size="md" page={2} pageCount={5} onPageChange={() => {}} />
    <Pagination size="lg" page={2} pageCount={5} onPageChange={() => {}} />
</>`,
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-col gap-4">
        <LabeledPagination copy={copy} pageCount={5} initial={2} size="sm" />
        <LabeledPagination copy={copy} pageCount={5} initial={2} size="md" />
        <LabeledPagination copy={copy} pageCount={5} initial={2} size="lg" />
      </div>
    );
  },
};

/**
 * Les trois pieds de page ci-dessous ne sont pas des `variant` : ce sont des
 * compositions des mêmes sous-composants dans un `CardFooter`. Le `nav` nommé
 * et l'état restent portés par `Pagination`.
 */
function FooterShell({
  children,
  copy,
  table,
  initial = 3,
  pageCount = 8,
}: {
  children: (page: number, pageCount: number) => ReactNode;
  copy: ReturnType<typeof paginationCopy>;
  table: ReturnType<typeof tableDataCopy>;
  initial?: number;
  pageCount?: number;
}) {
  const [page, setPage] = useState(initial);
  return (
    <Card className="max-w-2xl">
      <CardBody>
        <Text tone="muted">{table.caption}</Text>
      </CardBody>
      <CardFooter className="justify-between gap-4">
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          label={copy.label}
          previousLabel={copy.previous}
          nextLabel={copy.next}
          pageLabel={(n, current) => (current ? copy.pageCurrent(n) : copy.page(n))}
          size="sm"
          className="w-full"
        >
          {children(page, pageCount)}
        </Pagination>
      </CardFooter>
    </Card>
  );
}

export const CardFooterPages: Story = {
  name: 'Pied de carte',
  parameters: paginationSource(
    `<Card>
    <CardBody>…</CardBody>
    <CardFooter className="justify-between">
        <Pagination page={page} pageCount={8} onPageChange={setPage} className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
                <PaginationPrevious showLabel />
                <PaginationPages />
                <PaginationNext showLabel />
            </div>
        </Pagination>
    </CardFooter>
</Card>`,
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return (
      <FooterShell copy={copy} table={tableDataCopy(docsLocale(globals.locale))}>
        {() => (
          <div className="flex w-full items-center justify-between gap-4">
            <PaginationPrevious showLabel />
            <PaginationPages />
            <PaginationNext showLabel />
          </div>
        )}
      </FooterShell>
    );
  },
};

export const CenteredPages: Story = {
  name: 'Numéros centrés',
  parameters: paginationSource(
    `<Pagination page={page} pageCount={8} onPageChange={setPage} className="w-full">
    <div className="flex w-full items-center">
        <PaginationPrevious showLabel />
        <PaginationPages className="flex-1 justify-center" />
        <PaginationNext showLabel />
    </div>
</Pagination>`,
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    return (
      <FooterShell copy={copy} table={tableDataCopy(docsLocale(globals.locale))}>
        {() => (
          <div className="flex w-full items-center">
            <PaginationPrevious showLabel />
            <PaginationPages className="flex-1 justify-center" />
            <PaginationNext showLabel />
          </div>
        )}
      </FooterShell>
    );
  },
};

export const SimpleCardFooter: Story = {
  name: 'Pied de carte simple',
  parameters: paginationSource(
    `<Pagination page={page} pageCount={8} onPageChange={setPage} className="w-full">
    <div className="flex w-full items-center justify-between gap-4">
        <PaginationStatus>1 à 10 sur 97</PaginationStatus>
        <div className="flex gap-2">
            <PaginationPrevious showLabel />
            <PaginationNext showLabel />
        </div>
    </div>
</Pagination>`,
  ),
  render: (_, { globals }) => {
    const copy = paginationCopy(docsLocale(globals.locale));
    const table = tableDataCopy(docsLocale(globals.locale));
    return (
      <FooterShell copy={copy} table={table}>
        {(page, pageCount) => (
          <div className="flex w-full items-center justify-between gap-4">
            {/* Le composant ne fabrique pas ce texte : il ignore le total réel. */}
            <PaginationStatus>
              {table.showing((page - 1) * 10 + 1, page * 10, pageCount * 10)}
            </PaginationStatus>
            <div className="flex gap-2">
              <PaginationPrevious showLabel />
              <PaginationNext showLabel />
            </div>
          </div>
        )}
      </FooterShell>
    );
  },
};
