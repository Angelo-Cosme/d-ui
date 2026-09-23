import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectDocsCopyLeaves, docsCopy, docsString } from '../.storybook/docs-copy';
import {
  buttonCopy,
  iconCopy,
  inputCopy,
  localeFromSearch,
  overlayCopy,
  selectCopy,
  selectionCopy,
  skipLinkCopy,
  storyNameEn,
  storyLabel,
  toolbarLabel,
  themeCopy,
  timeAgoCopy,
  typographyCopy,
  colorCopy,
  visuallyHiddenCopy,
  calendarCopy,
  fileUploadCopy,
  datePickerCopy,
  timePickerCopy,
  dateTimePickerCopy,
  tabsCopy,
  breadcrumbCopy,
  paginationCopy,
  menuCopy,
  dialogCopy,
  drawerCopy,
  loadingCopy,
  alertCopy,
  notificationCopy,
  toastCopy,
  emptyStateCopy,
  errorStateCopy,
  navbarCopy,
  sidebarCopy,
  badgeCopy,
  tagCopy,
  avatarCopy,
  cardCopy,
  accordionCopy,
  listCopy,
  sortableCopy,
  tableCopy,
  tableDataCopy,
  imageCopy,
  commandMenuCopy,
  calendarEventCopy,
} from '../.storybook/docs-locale';

/** Un seul Storybook documente `d-ui` et `d-ui-education` : mêmes règles. */
const DOC_ROOTS = [join(process.cwd(), 'src'), join(process.cwd(), '../education/src')];

/** English MDX headings that must not appear: docs default language is French. */
const ENGLISH_HEADINGS = [
  'Accessibility concerns',
  'Clearable',
  'Date values',
  'Disabled',
  'Do',
  "Don't",
  'Don’t',
  'Full width',
  'Helper',
  'High emphasis',
  'Invalid',
  'Live updates',
  'Loading',
  'Locale',
  'Low emphasis',
  'Max length',
  'Medium emphasis',
  'Multiline',
  'Number',
  'Password',
  'Past and future',
  'Placeholder',
  'Prefix and suffix',
  'Properties',
  'Required',
  'Size',
  'Sizes',
  'Small size',
  'Special states',
  'Toggled button',
  'Valid',
  'Controlled',
  'Collision',
  'Portal',
  'Focus trap',
  'Alignments',
  'Reactions',
  'Empty state',
  'Disabled options',
  'Option groups',
  'Single selection',
  'Multiple selection',
  'Custom rendering',
  'List states',
  'Filter types',
  'Loading more',
  'Input options',
  'Keyboard',
  'Brand override',
  'Adding a token',
  'Contrast',
  'Usage',
  'Overview',
  'Restricted dates',
  'Week start',
  'Multiple months',
  'Date adapter',
  'Date range',
  'Year',
  'Typefaces',
  'Fonts by system',
  'Basic styles',
  'Custom styles',
  'Bold',
  'Primary palette',
  'Secondary palette',
  'Text wrap and overflow',
  'Dropzone',
  'Click only',
  'Multiple files',
  'Accept and max size',
  'Progress',
  'Keyboard entry',
  'Spinbuttons',
  'Calendar and time',
  'Manual activation',
  'Vertical tabs',
  'Justify left',
  'Detached',
  'Many pages',
  'Shortcuts',
  'Trigger variants',
  'Menu items',
  'Disabled items',
  'Submenu',
  'Context menu',
  'With icons',
  'Collapsed',
  'Nested',
  'Overlay',
  'Menu button',
  'Variants',
  'With title',
  'Dismissible',
  'With actions',
  'Live announcement',
  'Without background',
  'With action',
  'Queue',
  'Multiple sections',
  'Disabled sections',
  'Ordered',
  'Dividers',
  'Slots',
  'With description',
  'Keyboard and announcements',
  'Drag handle',
  'Ordered list',
  'Locked item',
  'Without dragging',
  'Caption',
  'Overflow',
  'Numeric alignment',
  'Sticky header',
  'Table footer',
  'Row header',
  'Capped count',
  'On an avatar',
  'Zero',
  'Placement',
  'Content',
  'Groups',
  'Icons, descriptions and shortcuts',
  'Filtering',
  'Custom filter',
  'Remote search',
  'States',
  'Keyboard shortcut',
  'Anchor side',
  'Filter panel',
  'Dismiss button',
  'Initial focus',
  'Mobile navigation',
];

function collectMdx(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...collectMdx(path));
    else if (name.endsWith('.mdx')) out.push(path);
  }
  return out;
}

function keysOf(value: object): string[] {
  return Object.keys(value).sort();
}

describe('docs locale', () => {
  it('keeps the same copy keys in French and English', () => {
    expect(keysOf(buttonCopy('fr'))).toEqual(keysOf(buttonCopy('en')));
    expect(keysOf(inputCopy('fr'))).toEqual(keysOf(inputCopy('en')));
    expect(keysOf(timeAgoCopy('fr'))).toEqual(keysOf(timeAgoCopy('en')));
    expect(keysOf(selectionCopy('fr'))).toEqual(keysOf(selectionCopy('en')));
    expect(keysOf(overlayCopy('fr'))).toEqual(keysOf(overlayCopy('en')));
    expect(keysOf(selectCopy('fr'))).toEqual(keysOf(selectCopy('en')));
    expect(keysOf(skipLinkCopy('fr'))).toEqual(keysOf(skipLinkCopy('en')));
    expect(keysOf(visuallyHiddenCopy('fr'))).toEqual(keysOf(visuallyHiddenCopy('en')));
    expect(keysOf(themeCopy('fr'))).toEqual(keysOf(themeCopy('en')));
    expect(keysOf(typographyCopy('fr'))).toEqual(keysOf(typographyCopy('en')));
    expect(keysOf(colorCopy('fr'))).toEqual(keysOf(colorCopy('en')));
    expect(keysOf(iconCopy('fr'))).toEqual(keysOf(iconCopy('en')));
    expect(keysOf(calendarCopy('fr'))).toEqual(keysOf(calendarCopy('en')));
    expect(keysOf(fileUploadCopy('fr'))).toEqual(keysOf(fileUploadCopy('en')));
    expect(keysOf(datePickerCopy('fr'))).toEqual(keysOf(datePickerCopy('en')));
    expect(keysOf(timePickerCopy('fr'))).toEqual(keysOf(timePickerCopy('en')));
    expect(keysOf(dateTimePickerCopy('fr'))).toEqual(keysOf(dateTimePickerCopy('en')));
    expect(keysOf(tabsCopy('fr'))).toEqual(keysOf(tabsCopy('en')));
    expect(keysOf(breadcrumbCopy('fr'))).toEqual(keysOf(breadcrumbCopy('en')));
    expect(keysOf(paginationCopy('fr'))).toEqual(keysOf(paginationCopy('en')));
    expect(keysOf(menuCopy('fr'))).toEqual(keysOf(menuCopy('en')));
    expect(keysOf(dialogCopy('fr'))).toEqual(keysOf(dialogCopy('en')));
    expect(keysOf(drawerCopy('fr'))).toEqual(keysOf(drawerCopy('en')));
    expect(keysOf(loadingCopy('fr'))).toEqual(keysOf(loadingCopy('en')));
    expect(keysOf(alertCopy('fr'))).toEqual(keysOf(alertCopy('en')));
    expect(keysOf(notificationCopy('fr'))).toEqual(keysOf(notificationCopy('en')));
    expect(keysOf(toastCopy('fr'))).toEqual(keysOf(toastCopy('en')));
    expect(keysOf(emptyStateCopy('fr'))).toEqual(keysOf(emptyStateCopy('en')));
    expect(keysOf(errorStateCopy('fr'))).toEqual(keysOf(errorStateCopy('en')));
    expect(keysOf(navbarCopy('fr'))).toEqual(keysOf(navbarCopy('en')));
    expect(keysOf(sidebarCopy('fr'))).toEqual(keysOf(sidebarCopy('en')));
    expect(keysOf(badgeCopy('fr'))).toEqual(keysOf(badgeCopy('en')));
    expect(keysOf(tagCopy('fr'))).toEqual(keysOf(tagCopy('en')));
    expect(keysOf(avatarCopy('fr'))).toEqual(keysOf(avatarCopy('en')));
    expect(keysOf(cardCopy('fr'))).toEqual(keysOf(cardCopy('en')));
    expect(keysOf(accordionCopy('fr'))).toEqual(keysOf(accordionCopy('en')));
    expect(keysOf(listCopy('fr'))).toEqual(keysOf(listCopy('en')));
    expect(keysOf(sortableCopy('fr'))).toEqual(keysOf(sortableCopy('en')));
    expect(keysOf(tableCopy('fr'))).toEqual(keysOf(tableCopy('en')));
    expect(keysOf(tableDataCopy('fr'))).toEqual(keysOf(tableDataCopy('en')));
    expect(keysOf(imageCopy('fr'))).toEqual(keysOf(imageCopy('en')));
    expect(keysOf(commandMenuCopy('fr'))).toEqual(keysOf(commandMenuCopy('en')));
    expect(keysOf(calendarEventCopy('fr'))).toEqual(keysOf(calendarEventCopy('en')));
  });

  it('writes MDX section headings in French', () => {
    const files = DOC_ROOTS.flatMap((root) => collectMdx(root));
    expect(files.length).toBeGreaterThan(0);
    /*
     * `#{2,6}` et non `#{1,6}` : le `#` de tête est le **nom du composant**,
     * qui reste l'identifiant anglais de l'API (`# Popover`, `# Progress`).
     * Seules les sections doivent être en français. Sans cette borne, un
     * composant dont le nom figure dans la liste ci-dessus serait interdit de
     * titre.
     */
    const heading = new RegExp(
      `^#{2,6}\\s+(?:${ENGLISH_HEADINGS.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*$`,
      'm',
    );
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      const match = text.match(heading);
      expect(
        match,
        `${file} still has English heading "${match?.[0]?.trim()}"`,
      ).toBeNull();
    }
  });

  it('keeps ArgTypes descriptions in French', () => {
    const text = readFileSync(join(process.cwd(), '.storybook/arg-types.ts'), 'utf8');
    for (const phrase of [
      'Emphasis: primary',
      'Stretch to the container width.',
      'Visible label above the field',
      'Helper text under the field',
    ]) {
      expect(text, `arg-types.ts still has "${phrase}"`).not.toContain(phrase);
    }
    expect(text).toContain('Emphase : `primary`');
    expect(text).toContain('Libellé visible au-dessus du champ');
    expect(text).toContain('`"Effacer"`');
    expect(text).toContain('Cible du lien, un identifiant de page');
    expect(text).toContain('Niveau sémantique : rend un vrai');
    expect(text).toContain('Composant SVG à rendre');
    expect(text).not.toContain('"Clear"');
    expect(text).not.toContain('Show password');
    expect(text).not.toContain('character remaining');
  });

  it('keeps MDX prose free of leftover English', () => {
    const files = DOC_ROOTS.flatMap((root) => collectMdx(root));
    const phrases = [
      'high emphasis',
      'medium emphasis',
      'low emphasis',
      'fort emphasis',
      '**Toggle**',
      'on / off',
      'Tree checkbox',
      'Segmented control',
      'Accessibility concerns',
    ];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const phrase of phrases) {
        expect(text, `${file} still has "${phrase}"`).not.toContain(phrase);
      }
    }
  });

  it('pairs French and English on every docs-copy leaf', () => {
    const leaves = collectDocsCopyLeaves(docsCopy);
    expect(leaves.length).toBeGreaterThan(50);
    for (const { path, fr, en } of leaves) {
      expect(fr.trim(), path).not.toBe('');
      expect(en.trim(), path).not.toBe('');
    }
    expect(docsString(docsCopy, 'button.high', 'fr')).toBe('Forte emphase');
    expect(docsString(docsCopy, 'button.high', 'en')).toBe('High emphasis');
  });

  it('maps every story name to English for the Langue toolbar', () => {
    const stories: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (name.endsWith('.stories.tsx')) stories.push(path);
      }
    };
    DOC_ROOTS.forEach(walk);
    const names = new Set<string>();
    for (const file of stories) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/name:\s*'([^']+)'/g)) {
        const name = match[1];
        if (name) names.add(name);
      }
    }
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(storyNameEn[name], `missing storyNameEn for "${name}"`).toBeTruthy();
    }
    expect(storyLabel('Forte emphase', 'en')).toBe('High emphasis');
    expect(storyLabel('High emphasis', 'fr')).toBe('Forte emphase');
    expect(storyLabel('Par défaut', 'fr')).toBe('Par défaut');
  });

  it('translates the Theme toolbar with Langue', () => {
    expect(toolbarLabel('Clair', 'en')).toBe('Light');
    expect(toolbarLabel('Sombre', 'en')).toBe('Dark');
    expect(toolbarLabel('Thème', 'en')).toBe('Theme');
    expect(toolbarLabel('Light', 'fr')).toBe('Clair');
    expect(toolbarLabel('Dark', 'fr')).toBe('Sombre');
    expect(toolbarLabel('Clair', 'fr')).toBe('Clair');
    expect(storyLabel('Langue', 'en')).toBe('Locale');
    expect(toolbarLabel('Langue', 'en')).toBe('Language');
  });

  it('wires every MDX docs page to docs-i18n', () => {
    const files = DOC_ROOTS.flatMap((root) => collectMdx(root));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      expect(text, `${file} does not import docs-i18n`).toContain('docs-i18n');
    }
  });

  it('parses locale from the Storybook globals search param', () => {
    expect(localeFromSearch('?globals=locale:en')).toBe('en');
    expect(localeFromSearch('?globals=theme:dark;locale:en')).toBe('en');
    expect(localeFromSearch('?globals=locale:fr')).toBe('fr');
    expect(localeFromSearch('?id=components-button--docs')).toBe('fr');
  });

  it('wires every story file to the Langue toolbar', () => {
    const stories: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (name.endsWith('.stories.tsx')) stories.push(path);
      }
    };
    DOC_ROOTS.forEach(walk);
    expect(stories.length).toBeGreaterThan(0);
    for (const file of stories) {
      const text = readFileSync(file, 'utf8');
      expect(text, `${file} does not read globals.locale`).toContain(
        'docsLocale(globals.locale)',
      );
    }
  });
});
