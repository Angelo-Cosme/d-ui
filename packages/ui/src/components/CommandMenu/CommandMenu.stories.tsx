import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  ArrowRightStartOnRectangleIcon,
  DocumentPlusIcon,
  HomeIcon,
  MoonIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { commandMenuArgTypes } from '../../../.storybook/arg-types';
import {
  commandMenuCopy,
  docsLocale,
  type CommandMenuDocsCopy,
} from '../../../.storybook/docs-locale';
import { componentSourceFn } from '../../../.storybook/docs-source';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { CommandMenu, type CommandMenuProps } from './CommandMenu';
import {
  defaultCommandMenuFilter,
  filterCommandMenuEntries,
  type CommandMenuEntry,
  type CommandMenuFilter,
  type CommandMenuItem,
} from './commandMenuItems';

/*
 * Une seule source pour le canvas et pour « Show code ».
 *
 * Chaque story décrit ses commandes en `CommandSpec` (l'icône par son nom) :
 * `toEntries` en fait les `items` rendus, `entriesSource` le littéral du
 * snippet. Le canvas suit la barre Langue ; le snippet est toujours construit
 * depuis la copie française. Une liste tapée à la main dans le snippet
 * finirait par diverger du canvas — c'est arrivé, `CommandMenu.snippets.test`
 * le vérifie désormais.
 */
const ICONS = {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  ArrowRightStartOnRectangleIcon,
  DocumentPlusIcon,
  HomeIcon,
  MoonIcon,
  UserCircleIcon,
};
type IconName = keyof typeof ICONS;

type CommandSpec = Omit<CommandMenuItem, 'icon'> & { icon?: IconName };
type GroupSpec = { label: string; items: readonly CommandSpec[] };
type EntrySpec = CommandSpec | GroupSpec;

function isGroupSpec(spec: EntrySpec): spec is GroupSpec {
  return 'items' in spec;
}

function toItem({ icon, ...item }: CommandSpec): CommandMenuItem {
  return icon ? { ...item, icon: <Icon as={ICONS[icon]} size="sm" /> } : item;
}

function toEntries(specs: readonly EntrySpec[]): CommandMenuEntry[] {
  return specs.map((spec) =>
    isGroupSpec(spec)
      ? { label: spec.label, items: spec.items.map(toItem) }
      : toItem(spec),
  );
}

const quote = (text: string) => `'${text.replace(/'/g, "\\'")}'`;

function fieldsSource(spec: CommandSpec): string[] {
  return [
    `value: ${quote(spec.value)}`,
    `label: ${quote(spec.label)}`,
    spec.description ? `description: ${quote(spec.description)}` : null,
    spec.icon ? `icon: <Icon as={${spec.icon}} size="sm" />` : null,
    spec.shortcut ? `shortcut: ${quote(spec.shortcut)}` : null,
    spec.keywords ? `keywords: [${spec.keywords.map(quote).join(', ')}]` : null,
    spec.disabled ? 'disabled: true' : null,
  ].filter((field): field is string => field !== null);
}

function itemSource(spec: CommandSpec, indent: string): string {
  const fields = fieldsSource(spec);
  const inline = `${indent}{ ${fields.join(', ')} },`;
  if (inline.length <= 88) return inline;
  return [
    `${indent}{`,
    ...fields.map((field) => `${indent}    ${field},`),
    `${indent}},`,
  ].join('\n');
}

function entriesSource(specs: readonly EntrySpec[], indent: string): string {
  return specs
    .map((spec) =>
      isGroupSpec(spec)
        ? [
            `${indent}{`,
            `${indent}    label: ${quote(spec.label)},`,
            `${indent}    items: [`,
            ...spec.items.map((item) => itemSource(item, `${indent}        `)),
            `${indent}    ],`,
            `${indent}},`,
          ].join('\n')
        : itemSource(spec, indent),
    )
    .join('\n');
}

/** Le littéral `[...]`, ses entrées indentées d'un cran sous `indent`. */
function itemsLiteral(specs: readonly EntrySpec[], indent = ''): string {
  return `[\n${entriesSource(specs, `${indent}    `)}\n${indent}]`;
}

function importsSource(specs: readonly EntrySpec[], hooks = 'useState'): string {
  const icons = new Set<IconName>();
  for (const spec of specs) {
    for (const item of isGroupSpec(spec) ? spec.items : [spec]) {
      if (item.icon) icons.add(item.icon);
    }
  }
  const names = [...icons].sort();
  return [
    `import { ${hooks} } from 'react';`,
    names.length
      ? `import { ${names.join(', ')} } from '@heroicons/react/24/outline';`
      : null,
    `import { Button, CommandMenu${names.length ? ', Icon' : ''} } from 'd-ui';`,
  ]
    .filter(Boolean)
    .join('\n');
}

const fr = commandMenuCopy('fr');

/**
 * Story sans état distant : le littéral `items` est celui que le canvas rend.
 * `prelude` précède le hook d'état, `props` s'ajoute après `items`.
 */
function staticSource(
  specs: readonly EntrySpec[],
  { prelude = '', props = '' }: { prelude?: string; props?: string } = {},
) {
  return componentSourceFn(
    importsSource(specs),
    `${prelude ? `${prelude}\n\n` : ''}const [open, setOpen] = useState(false);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.open}</Button>
        <CommandMenu
            open={open}
            onOpenChange={setOpen}
            label="${fr.label}"
            placeholder="${fr.placeholder}"
            items={${itemsLiteral(specs, '            ')}}${props}
            onSelect={(item) => run(item.value)}
        />
    </>
);`,
  );
}

const emptyMessageSource = `(query) => (query ? \`${fr.emptyQuery('${query}')}\` : ${quote(fr.empty)})`;

function flatSpecs(copy: CommandMenuDocsCopy): EntrySpec[] {
  return [
    { value: 'home', label: copy.home },
    { value: 'courses', label: copy.courses },
    { value: 'homework', label: copy.homework },
    {
      value: 'new-assignment',
      label: copy.newAssignment,
      keywords: copy.newAssignmentKeywords,
    },
    { value: 'theme', label: copy.theme },
    { value: 'logout', label: copy.logout },
  ];
}

/** Libellés, descriptions et mots-clés : les trois champs que le filtre par défaut parcourt. */
function keywordSpecs(copy: CommandMenuDocsCopy): EntrySpec[] {
  return [
    { value: 'home', label: copy.home },
    { value: 'courses', label: copy.courses },
    {
      value: 'new-assignment',
      label: copy.newAssignment,
      description: copy.newAssignmentDesc,
      keywords: copy.newAssignmentKeywords,
    },
    { value: 'import', label: copy.importCourse, description: copy.importCourseDesc },
    { value: 'theme', label: copy.theme, description: copy.themeDesc },
    { value: 'logout', label: copy.logout },
  ];
}

/*
 * Filtre de la story « Filtre personnalisé ». Le corps est écrit deux fois —
 * une fois pour le canvas, une fois pour le snippet — parce que le code
 * compilé d'une fonction n'est pas lisible dans « Show code ». Les deux doivent
 * rester identiques ; `CommandMenu.snippets.test` vérifie le comportement du
 * canvas et la présence de `filter` dans le snippet.
 */
const everyWord: CommandMenuFilter = (item, query) =>
  query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => item.label.toLowerCase().includes(word));

const everyWordSource = `// Chaque mot de la saisie doit apparaître dans le libellé, dans n'importe quel ordre.
const everyWord = (item, query) =>
    query
        .toLowerCase()
        .split(/\\s+/)
        .filter(Boolean)
        .every((word) => item.label.toLowerCase().includes(word));`;

function groupedSpecs(copy: CommandMenuDocsCopy): EntrySpec[] {
  return [
    {
      label: copy.navigation,
      items: [
        { value: 'home', label: copy.home },
        { value: 'courses', label: copy.courses },
        { value: 'homework', label: copy.homework },
      ],
    },
    {
      label: copy.actions,
      items: [
        {
          value: 'new-assignment',
          label: copy.newAssignment,
          keywords: copy.newAssignmentKeywords,
        },
        { value: 'import', label: copy.importCourse },
      ],
    },
    {
      label: copy.account,
      items: [
        { value: 'profile', label: copy.profile },
        { value: 'logout', label: copy.logout },
      ],
    },
  ];
}

function decoratedSpecs(
  copy: CommandMenuDocsCopy,
  { archiveDisabled = false } = {},
): EntrySpec[] {
  return [
    {
      label: copy.navigation,
      items: [
        { value: 'home', label: copy.home, icon: 'HomeIcon' },
        { value: 'courses', label: copy.courses, icon: 'AcademicCapIcon' },
      ],
    },
    {
      label: copy.actions,
      items: [
        {
          value: 'new-assignment',
          label: copy.newAssignment,
          description: copy.newAssignmentDesc,
          icon: 'DocumentPlusIcon',
          shortcut: copy.newAssignmentShortcut,
          keywords: copy.newAssignmentKeywords,
        },
        {
          value: 'import',
          label: copy.importCourse,
          description: copy.importCourseDesc,
          icon: 'ArrowDownTrayIcon',
          shortcut: copy.importShortcut,
        },
        {
          value: 'archive',
          label: copy.archive,
          description: archiveDisabled ? copy.archiveDesc : undefined,
          icon: 'ArchiveBoxIcon',
          disabled: archiveDisabled,
        },
        {
          value: 'theme',
          label: copy.theme,
          description: copy.themeDesc,
          icon: 'MoonIcon',
          shortcut: copy.themeShortcut,
        },
      ],
    },
    {
      label: copy.account,
      items: [
        { value: 'profile', label: copy.profile, icon: 'UserCircleIcon' },
        { value: 'logout', label: copy.logout, icon: 'ArrowRightStartOnRectangleIcon' },
      ],
    },
  ];
}

const meta = {
  title: 'Components/CommandMenu',
  component: CommandMenu,
  argTypes: commandMenuArgTypes,
  parameters: {
    controls: {
      include: ['label', 'placeholder', 'loading', 'loadingMessage'],
    },
  },
} satisfies Meta<typeof CommandMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Chaque story a besoin d'un déclencheur : la palette est toujours contrôlée. */
const closed = { open: false, onOpenChange: () => {}, items: [], onSelect: () => {} };

type DemoProps = Pick<
  CommandMenuProps,
  | 'items'
  | 'label'
  | 'placeholder'
  | 'emptyMessage'
  | 'loading'
  | 'loadingMessage'
  | 'filter'
  | 'onQueryChange'
> & {
  copy: CommandMenuDocsCopy;
  hint?: string;
  onOpen?: () => void;
  /** Écoute ⌘K / Ctrl+K sur `window` — côté application, jamais dans le package. */
  shortcut?: boolean;
};

function Demo({ copy, hint, onOpen, shortcut = false, ...menu }: DemoProps) {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    if (!shortcut) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);

  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <Button
        variant="secondary"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
      >
        {copy.open}
      </Button>
      {hint ? (
        <Text size="body-sm" tone="muted">
          {hint}
        </Text>
      ) : null}
      <Text size="body-sm" tone="muted">
        {copy.lastCommand} {last ?? copy.none}
      </Text>
      <CommandMenu
        label={copy.label}
        placeholder={copy.placeholder}
        emptyMessage={copy.empty}
        {...menu}
        open={open}
        onOpenChange={setOpen}
        onSelect={(item) => setLast(item.label)}
      />
    </div>
  );
}

export const Default: Story = {
  name: 'Par défaut',
  args: closed,
  parameters: staticSource(flatSpecs(fr)),
  render: (args, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return (
      <Demo
        copy={copy}
        items={toEntries(flatSpecs(copy))}
        label={args.label ?? copy.label}
        placeholder={args.placeholder ?? copy.placeholder}
        loading={args.loading}
        loadingMessage={args.loadingMessage ?? copy.loading}
      />
    );
  },
};

export const Groups: Story = {
  name: 'Groupes',
  args: closed,
  parameters: staticSource(groupedSpecs(fr)),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return <Demo copy={copy} items={toEntries(groupedSpecs(copy))} />;
  },
};

export const Decorated: Story = {
  name: 'Icônes et raccourcis',
  args: closed,
  parameters: staticSource(decoratedSpecs(fr)),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return <Demo copy={copy} items={toEntries(decoratedSpecs(copy))} />;
  },
};

export const DisabledItems: Story = {
  name: 'Éléments désactivés',
  args: closed,
  parameters: staticSource(decoratedSpecs(fr, { archiveDisabled: true })),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return (
      <Demo
        copy={copy}
        items={toEntries(decoratedSpecs(copy, { archiveDisabled: true }))}
      />
    );
  },
};

export const Keywords: Story = {
  name: 'Mots-clés',
  args: closed,
  parameters: staticSource(keywordSpecs(fr)),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return <Demo copy={copy} items={toEntries(keywordSpecs(copy))} />;
  },
};

export const CustomFilter: Story = {
  name: 'Filtre personnalisé',
  args: closed,
  parameters: staticSource(flatSpecs(fr), {
    prelude: everyWordSource,
    props: '\n            filter={everyWord}',
  }),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return <Demo copy={copy} items={toEntries(flatSpecs(copy))} filter={everyWord} />;
  },
};

/** Le « serveur » : filtre côté démo après un délai, comme le ferait une API. */
function useFakeSearch(delay: number) {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (run: () => void) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(run, delay);
  };
}

function RemoteSearchDemo({ copy }: { copy: CommandMenuDocsCopy }) {
  const all = useMemo(() => toEntries(decoratedSpecs(copy)), [copy]);
  const [results, setResults] = useState<CommandMenuEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const schedule = useFakeSearch(600);

  return (
    <Demo
      copy={copy}
      items={results ?? all}
      loading={loading}
      loadingMessage={copy.loading}
      emptyMessage={(query) => (query ? copy.emptyQuery(query) : copy.empty)}
      filter={() => true}
      onOpen={() => setResults(null)}
      onQueryChange={(query) => {
        setLoading(true);
        schedule(() => {
          setResults(filterCommandMenuEntries(all, query, defaultCommandMenuFilter));
          setLoading(false);
        });
      }}
    />
  );
}

export const RemoteSearch: Story = {
  name: 'Recherche distante',
  args: closed,
  parameters: componentSourceFn(
    importsSource(decoratedSpecs(fr)),
    `const commands = ${itemsLiteral(decoratedSpecs(fr))};

const [open, setOpen] = useState(false);
const [items, setItems] = useState(commands);
const [loading, setLoading] = useState(false);

async function search(query) {
    setLoading(true);
    setItems(await searchCommands(query)); // ici : \`commands\` filtrées après 600 ms
    setLoading(false);
}

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.open}</Button>
        <CommandMenu
            open={open}
            onOpenChange={setOpen}
            label="${fr.label}"
            placeholder="${fr.placeholder}"
            items={items}
            loading={loading}
            loadingMessage="${fr.loading}"
            emptyMessage={${emptyMessageSource}}
            filter={() => true}
            onQueryChange={search}
            onSelect={(item) => run(item.value)}
        />
    </>
);`,
  ),
  render: (_, { globals }) => (
    <RemoteSearchDemo copy={commandMenuCopy(docsLocale(globals.locale))} />
  ),
};

export const Empty: Story = {
  name: 'État vide',
  args: closed,
  parameters: componentSourceFn(
    importsSource([]),
    `const [open, setOpen] = useState(false);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.open}</Button>
        <CommandMenu
            open={open}
            onOpenChange={setOpen}
            label="${fr.label}"
            placeholder="${fr.placeholder}"
            items={[]}
            emptyMessage={${emptyMessageSource}}
            onSelect={(item) => run(item.value)}
        />
    </>
);`,
  ),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return (
      <Demo
        copy={copy}
        items={[]}
        emptyMessage={(query) => (query ? copy.emptyQuery(query) : copy.empty)}
      />
    );
  },
};

function LoadingDemo({ copy }: { copy: CommandMenuDocsCopy }) {
  const [items, setItems] = useState<CommandMenuEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const schedule = useFakeSearch(1500);

  return (
    <Demo
      copy={copy}
      items={items}
      loading={loading}
      loadingMessage={copy.loading}
      onOpen={() => {
        setItems([]);
        setLoading(true);
        schedule(() => {
          setItems(toEntries(groupedSpecs(copy)));
          setLoading(false);
        });
      }}
    />
  );
}

export const Loading: Story = {
  name: 'Chargement',
  args: closed,
  parameters: componentSourceFn(
    importsSource(groupedSpecs(fr)),
    `const commands = ${itemsLiteral(groupedSpecs(fr))};

const [open, setOpen] = useState(false);
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

async function openPalette() {
    setOpen(true);
    setLoading(true);
    setItems(await fetchCommands()); // ici : \`commands\` après 1,5 s
    setLoading(false);
}

return (
    <>
        <Button variant="secondary" onClick={openPalette}>${fr.open}</Button>
        <CommandMenu
            open={open}
            onOpenChange={setOpen}
            label="${fr.label}"
            placeholder="${fr.placeholder}"
            items={items}
            loading={loading}
            loadingMessage="${fr.loading}"
            onSelect={(item) => run(item.value)}
        />
    </>
);`,
  ),
  render: (_, { globals }) => (
    <LoadingDemo copy={commandMenuCopy(docsLocale(globals.locale))} />
  ),
};

export const KeyboardShortcut: Story = {
  name: 'Raccourci clavier',
  args: closed,
  parameters: componentSourceFn(
    importsSource(groupedSpecs(fr), 'useEffect, useState'),
    `const commands = ${itemsLiteral(groupedSpecs(fr))};

const [open, setOpen] = useState(false);

// Côté application : le package n'installe aucun raccourci global.
useEffect(() => {
    const onKeyDown = (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            setOpen((current) => !current);
        }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
}, []);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.open}</Button>
        <CommandMenu
            open={open}
            onOpenChange={setOpen}
            label="${fr.label}"
            placeholder="${fr.placeholder}"
            items={commands}
            onSelect={(item) => run(item.value)}
        />
    </>
);`,
  ),
  render: (_, { globals }) => {
    const copy = commandMenuCopy(docsLocale(globals.locale));
    return (
      <Demo
        copy={copy}
        items={toEntries(groupedSpecs(copy))}
        shortcut
        hint={copy.shortcutHint}
      />
    );
  },
};
