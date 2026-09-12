import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type ReactNode } from 'react';
import { drawerArgTypes } from '../../../.storybook/arg-types';
import {
  docsLocale,
  drawerCopy,
  navbarCopy,
  type DrawerDocsCopy,
} from '../../../.storybook/docs-locale';
import { componentSourceFn } from '../../../.storybook/docs-source';
import { Button } from '../Button/Button';
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox';
import { List, ListItem } from '../List/List';
import { Navbar } from '../Navbar/Navbar';
import { Select } from '../Select/Select';
import { Textarea } from '../Textarea/Textarea';
import { TextInput } from '../TextInput/TextInput';
import { Drawer, type DrawerSide, type DrawerSize } from './Drawer';
import {
  DrawerActions,
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './DrawerParts';

/*
 * « Show code » est en français et montre ce que le canvas rend : les libellés
 * des snippets viennent de la même copie que les canvas, jamais d'une chaîne
 * retapée. `Drawer.snippets.test.tsx` le vérifie.
 */
const fr = drawerCopy('fr');
const navbarFr = navbarCopy('fr');

const SIDES: readonly DrawerSide[] = ['left', 'right', 'top', 'bottom'];
const SIZES: readonly DrawerSize[] = ['tiny', 'regular', 'big', 'huge'];
/** Valeurs de formulaire des catégories, dans l'ordre de `copy.categories`. */
const CATEGORY_VALUES = [
  'cours',
  'devoirs',
  'evaluations',
  'ressources',
  'annonces',
  'messages',
] as const;
/** Routes des liens de navigation, dans l'ordre de `copy.navLinks`. */
const NAV_SLUGS = ['accueil', 'cours', 'devoirs', 'messages'] as const;

const reactImport = "import { useState } from 'react';";

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  argTypes: drawerArgTypes,
  parameters: {
    controls: { include: ['side', 'size', 'dismissible'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Chaque story a besoin d'un déclencheur : un `Drawer` est toujours contrôlé. */
const closed = { open: false, onOpenChange: () => {}, children: null };

function Trigger({
  label,
  children,
}: {
  label: string;
  children: (open: boolean, setOpen: (next: boolean) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-center p-6">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {children(open, setOpen)}
    </div>
  );
}

/** Un bouton par valeur, dans l'ordre du canvas. */
function triggersSource(
  values: readonly string[],
  labels: readonly string[],
  setter: string,
): string {
  return values
    .map(
      (value, index) =>
        `<Button variant="secondary" onClick={() => ${setter}('${value}')}>${labels[index]}</Button>`,
    )
    .join('\n        ');
}

export const Default: Story = {
  name: 'Par défaut',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}\nimport { Button, Drawer, DrawerBody, DrawerDescription, DrawerTitle } from 'd-ui';`,
    `const [open, setOpen] = useState(false);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.open}</Button>
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTitle>${fr.detailTitle}</DrawerTitle>
            <DrawerDescription>${fr.detailBody}</DrawerDescription>
            <DrawerBody>
                <p>${fr.detailParagraph}</p>
            </DrawerBody>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => {
    const copy = drawerCopy(docsLocale(globals.locale));
    return (
      <Trigger label={copy.open}>
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTitle>{copy.detailTitle}</DrawerTitle>
            <DrawerDescription>{copy.detailBody}</DrawerDescription>
            <DrawerBody>
              <p>{copy.detailParagraph}</p>
            </DrawerBody>
          </Drawer>
        )}
      </Trigger>
    );
  },
};

function SidesDemo({ copy }: { copy: DrawerDocsCopy }) {
  const [side, setSide] = useState<DrawerSide | null>(null);
  return (
    <div className="flex flex-wrap justify-center gap-3 p-6">
      {SIDES.map((value) => (
        <Button key={value} variant="secondary" onClick={() => setSide(value)}>
          {copy[value]}
        </Button>
      ))}
      <Drawer
        open={side !== null}
        onOpenChange={(next) => setSide(next ? side : null)}
        side={side ?? 'right'}
      >
        <DrawerTitle>{`${copy.sideTitle} — ${side ?? 'right'}`}</DrawerTitle>
        <DrawerDescription>{copy.sideBody}</DrawerDescription>
      </Drawer>
    </div>
  );
}

export const Sides: Story = {
  name: 'Bord d’ancrage',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}\nimport { Button, Drawer, DrawerDescription, DrawerTitle, type DrawerSide } from 'd-ui';`,
    `const [side, setSide] = useState<DrawerSide | null>(null);

return (
    <>
        ${triggersSource(
          SIDES,
          SIDES.map((value) => fr[value]),
          'setSide',
        )}
        <Drawer
            open={side !== null}
            onOpenChange={(next) => setSide(next ? side : null)}
            side={side ?? 'right'}
        >
            <DrawerTitle>{\`${fr.sideTitle} — \${side ?? 'right'}\`}</DrawerTitle>
            <DrawerDescription>${fr.sideBody}</DrawerDescription>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => <SidesDemo copy={drawerCopy(docsLocale(globals.locale))} />,
};

function SizesDemo({ copy }: { copy: DrawerDocsCopy }) {
  const [size, setSize] = useState<DrawerSize | null>(null);
  return (
    <div className="flex flex-wrap justify-center gap-3 p-6">
      {SIZES.map((value) => (
        <Button key={value} variant="secondary" onClick={() => setSize(value)}>
          {copy[value]}
        </Button>
      ))}
      <Drawer
        open={size !== null}
        onOpenChange={(next) => setSize(next ? size : null)}
        size={size ?? 'regular'}
      >
        <DrawerTitle>{`${copy.sizeTitle} — ${size ?? 'regular'}`}</DrawerTitle>
        <DrawerDescription>{copy.sizeBody}</DrawerDescription>
      </Drawer>
    </div>
  );
}

export const Sizes: Story = {
  name: 'Tailles',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}\nimport { Button, Drawer, DrawerDescription, DrawerTitle, type DrawerSize } from 'd-ui';`,
    `const [size, setSize] = useState<DrawerSize | null>(null);

return (
    <>
        ${triggersSource(
          SIZES,
          SIZES.map((value) => fr[value]),
          'setSize',
        )}
        <Drawer
            open={size !== null}
            onOpenChange={(next) => setSize(next ? size : null)}
            size={size ?? 'regular'}
        >
            <DrawerTitle>{\`${fr.sizeTitle} — \${size ?? 'regular'}\`}</DrawerTitle>
            <DrawerDescription>${fr.sizeBody}</DrawerDescription>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => <SizesDemo copy={drawerCopy(docsLocale(globals.locale))} />,
};

/** Une case par catégorie, dans l'ordre du canvas. */
function categoriesSource(labels: readonly string[]): string {
  return CATEGORY_VALUES.map(
    (value, index) => `<Checkbox value="${value}" label="${labels[index]}" />`,
  ).join('\n                        ');
}

export const Filters: Story = {
  name: 'Panneau de filtres',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Drawer,
    DrawerActions,
    DrawerBody,
    DrawerHeader,
    DrawerTitle,
    Select,
    TextInput,
} from 'd-ui';`,
    `const [open, setOpen] = useState(false);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.filtersOpen}</Button>
        <Drawer open={open} onOpenChange={setOpen} size="tiny">
            <DrawerHeader>
                <DrawerTitle>${fr.filtersTitle}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
                <form id="filters" onSubmit={onSubmit} className="grid gap-4">
                    <TextInput type="search" name="q" label="${fr.searchLabel}" placeholder="${fr.searchPlaceholder}" />
                    <Select
                        name="status"
                        label="${fr.statusLabel}"
                        defaultValue="all"
                        options={[
                            { value: 'all', label: '${fr.statusAll}' },
                            { value: 'active', label: '${fr.statusActive}' },
                            { value: 'archived', label: '${fr.statusArchived}' },
                        ]}
                    />
                    <CheckboxGroup label="${fr.categoriesLabel}" name="categories">
                        ${categoriesSource(fr.categories)}
                    </CheckboxGroup>
                </form>
            </DrawerBody>
            <DrawerActions surface>
                <Button variant="secondary" type="reset" form="filters">${fr.reset}</Button>
                <Button variant="primary" type="submit" form="filters">${fr.apply}</Button>
            </DrawerActions>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => {
    const copy = drawerCopy(docsLocale(globals.locale));
    return (
      <Trigger label={copy.filtersOpen}>
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen} size="tiny">
            <DrawerHeader>
              <DrawerTitle>{copy.filtersTitle}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <form
                id="d-ui-filters"
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setOpen(false);
                }}
              >
                <TextInput
                  type="search"
                  name="q"
                  label={copy.searchLabel}
                  placeholder={copy.searchPlaceholder}
                />
                <Select
                  name="status"
                  label={copy.statusLabel}
                  defaultValue="all"
                  options={[
                    { value: 'all', label: copy.statusAll },
                    { value: 'active', label: copy.statusActive },
                    { value: 'archived', label: copy.statusArchived },
                  ]}
                />
                <CheckboxGroup label={copy.categoriesLabel} name="categories">
                  {CATEGORY_VALUES.map((value, index) => (
                    <Checkbox key={value} value={value} label={copy.categories[index]} />
                  ))}
                </CheckboxGroup>
              </form>
            </DrawerBody>
            <DrawerActions surface>
              <Button variant="secondary" type="reset" form="d-ui-filters">
                {copy.reset}
              </Button>
              <Button variant="primary" type="submit" form="d-ui-filters">
                {copy.apply}
              </Button>
            </DrawerActions>
          </Drawer>
        )}
      </Trigger>
    );
  },
};

export const WithoutDismiss: Story = {
  name: 'Sans croix de fermeture',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}\nimport { Button, Drawer, DrawerActions, DrawerBody, DrawerTitle, TextInput } from 'd-ui';`,
    `const [open, setOpen] = useState(false);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.addressOpen}</Button>
        <Drawer open={open} onOpenChange={setOpen} size="tiny" dismissible={false}>
            <DrawerTitle>${fr.addressTitle}</DrawerTitle>
            <DrawerBody>
                <form id="address" onSubmit={onSubmit} className="grid gap-4">
                    <TextInput name="street" label="${fr.streetLabel}" defaultValue="${fr.streetValue}" />
                    <TextInput name="city" label="${fr.cityLabel}" defaultValue="${fr.cityValue}" />
                </form>
            </DrawerBody>
            <DrawerActions surface>
                <Button variant="secondary" onClick={() => setOpen(false)}>${fr.cancel}</Button>
                <Button variant="primary" type="submit" form="address">${fr.save}</Button>
            </DrawerActions>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => {
    const copy = drawerCopy(docsLocale(globals.locale));
    return (
      <Trigger label={copy.addressOpen}>
        {(open, setOpen) => (
          <Drawer open={open} onOpenChange={setOpen} size="tiny" dismissible={false}>
            <DrawerTitle>{copy.addressTitle}</DrawerTitle>
            <DrawerBody>
              <form
                id="d-ui-address"
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setOpen(false);
                }}
              >
                <TextInput
                  name="street"
                  label={copy.streetLabel}
                  defaultValue={copy.streetValue}
                />
                <TextInput
                  name="city"
                  label={copy.cityLabel}
                  defaultValue={copy.cityValue}
                />
              </form>
            </DrawerBody>
            <DrawerActions surface>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                {copy.cancel}
              </Button>
              <Button variant="primary" type="submit" form="d-ui-address">
                {copy.save}
              </Button>
            </DrawerActions>
          </Drawer>
        )}
      </Trigger>
    );
  },
};

function InitialFocusDemo({ copy }: { copy: DrawerDocsCopy }) {
  const [open, setOpen] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <div className="flex justify-center p-6">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {copy.noteOpen}
      </Button>
      <Drawer open={open} onOpenChange={setOpen} size="tiny" initialFocus={noteRef}>
        <DrawerTitle>{copy.noteTitle}</DrawerTitle>
        <DrawerBody>
          <form
            id="d-ui-note"
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Select
              name="visibility"
              label={copy.visibilityLabel}
              defaultValue="team"
              options={[
                { value: 'team', label: copy.visibilityTeam },
                { value: 'private', label: copy.visibilityPrivate },
              ]}
            />
            <Textarea
              ref={noteRef}
              name="note"
              label={copy.noteLabel}
              placeholder={copy.notePlaceholder}
              helper={copy.noteHelper}
              rows={4}
            />
          </form>
        </DrawerBody>
        <DrawerActions surface>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {copy.cancel}
          </Button>
          <Button variant="primary" type="submit" form="d-ui-note">
            {copy.publish}
          </Button>
        </DrawerActions>
      </Drawer>
    </div>
  );
}

export const InitialFocus: Story = {
  name: 'Focus initial',
  args: closed,
  parameters: componentSourceFn(
    `import { useRef, useState } from 'react';
import { Button, Drawer, DrawerActions, DrawerBody, DrawerTitle, Select, Textarea } from 'd-ui';`,
    `const [open, setOpen] = useState(false);
const noteRef = useRef<HTMLTextAreaElement | null>(null);

return (
    <>
        <Button variant="secondary" onClick={() => setOpen(true)}>${fr.noteOpen}</Button>
        <Drawer open={open} onOpenChange={setOpen} size="tiny" initialFocus={noteRef}>
            <DrawerTitle>${fr.noteTitle}</DrawerTitle>
            <DrawerBody>
                <form id="note" onSubmit={onSubmit} className="grid gap-4">
                    <Select
                        name="visibility"
                        label="${fr.visibilityLabel}"
                        defaultValue="team"
                        options={[
                            { value: 'team', label: '${fr.visibilityTeam}' },
                            { value: 'private', label: '${fr.visibilityPrivate}' },
                        ]}
                    />
                    <Textarea
                        ref={noteRef}
                        name="note"
                        label="${fr.noteLabel}"
                        placeholder="${fr.notePlaceholder}"
                        helper="${fr.noteHelper}"
                        rows={4}
                    />
                </form>
            </DrawerBody>
            <DrawerActions surface>
                <Button variant="secondary" onClick={() => setOpen(false)}>${fr.cancel}</Button>
                <Button variant="primary" type="submit" form="note">${fr.publish}</Button>
            </DrawerActions>
        </Drawer>
    </>
);`,
  ),
  render: (_, { globals }) => (
    <InitialFocusDemo copy={drawerCopy(docsLocale(globals.locale))} />
  ),
};

/** Un lien par entrée, dans l'ordre du canvas. */
function navSource(labels: readonly string[]): string {
  return NAV_SLUGS.map(
    (slug, index) => `<ListItem href="/${slug}">${labels[index]}</ListItem>`,
  ).join('\n                        ');
}

function MobileNavigationDemo({ copy, brand }: { copy: DrawerDocsCopy; brand: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-border overflow-hidden rounded-md border">
      <Navbar
        brand={<a href="/">{brand}</a>}
        menuLabel={copy.openNav}
        menuOpen={open}
        menuControls="nav-mobile"
        onMenuOpenChange={setOpen}
      />
      <Drawer
        id="nav-mobile"
        open={open}
        onOpenChange={setOpen}
        side="left"
        size="tiny"
        dismissLabel={copy.closeNav}
      >
        <DrawerHeader>
          <DrawerTitle>{copy.menu}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav aria-label={copy.navLabel}>
            <List size="sm">
              {NAV_SLUGS.map((slug, index) => (
                <ListItem key={slug} href={`#${slug}`}>
                  {copy.navLinks[index]}
                </ListItem>
              ))}
            </List>
          </nav>
        </DrawerBody>
      </Drawer>
      <main id="main" tabIndex={-1} className="bg-bg text-fg p-4">
        {copy.main}
      </main>
    </div>
  );
}

export const MobileNavigation: Story = {
  name: 'Navigation mobile',
  args: closed,
  parameters: componentSourceFn(
    `${reactImport}
import { Drawer, DrawerBody, DrawerHeader, DrawerTitle, List, ListItem, Navbar } from 'd-ui';`,
    `const [open, setOpen] = useState(false);

return (
    <>
        <Navbar
            brand={<a href="/">${navbarFr.brand}</a>}
            menuLabel="${fr.openNav}"
            menuOpen={open}
            menuControls="nav-mobile"
            onMenuOpenChange={setOpen}
        />
        <Drawer
            id="nav-mobile"
            open={open}
            onOpenChange={setOpen}
            side="left"
            size="tiny"
            dismissLabel="${fr.closeNav}"
        >
            <DrawerHeader>
                <DrawerTitle>${fr.menu}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
                <nav aria-label="${fr.navLabel}">
                    <List size="sm">
                        ${navSource(fr.navLinks)}
                    </List>
                </nav>
            </DrawerBody>
        </Drawer>
        <main id="main" tabIndex={-1}>
            ${fr.main}
        </main>
    </>
);`,
  ),
  render: (_, { globals }) => {
    const locale = docsLocale(globals.locale);
    return (
      <MobileNavigationDemo copy={drawerCopy(locale)} brand={navbarCopy(locale).brand} />
    );
  },
};
