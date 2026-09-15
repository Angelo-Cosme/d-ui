import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { commandMenuArgTypes } from '../../../.storybook/arg-types';
import { docsCopy, docsString } from '../../../.storybook/docs-copy';
import * as stories from './CommandMenu.stories';

type StoryName = Exclude<keyof typeof stories, 'default'>;

/**
 * Les stories dont le canvas rend une liste dès l'ouverture : « Show code »
 * doit citer exactement ces commandes — mêmes libellés, même nombre, mêmes
 * groupes, mêmes descriptions, raccourcis et désactivations. `Loading` est
 * hors liste : son canvas commence vide, par construction.
 */
const LISTED: StoryName[] = [
  'Default',
  'Groups',
  'Decorated',
  'DisabledItems',
  'Keywords',
  'CustomFilter',
  'RemoteSearch',
  'KeyboardShortcut',
];

function renderStory(name: StoryName): ReactElement {
  const story = stories[name];
  const renderFn = story.render as (args: unknown, context: unknown) => ReactElement;
  return renderFn(story.args, { globals: { locale: 'fr' } });
}

function sourceOf(name: StoryName): string {
  const parameters = stories[name].parameters as { docs: { source: { code: string } } };
  return parameters.docs.source.code;
}

const count = (text: string, needle: string) => text.split(needle).length - 1;

describe('CommandMenu « Show code »', () => {
  it.each(LISTED)('%s lists exactly the commands the canvas renders', async (name) => {
    const user = userEvent.setup();
    render(renderStory(name));
    await user.click(screen.getByRole('button', { name: 'Ouvrir la palette' }));
    const options = await screen.findAllByRole('option');
    const code = sourceOf(name);

    for (const option of options) {
      const label = option.querySelector('.font-medium')?.textContent ?? '';
      expect(label).not.toBe('');
      expect(code).toContain(`label: '${label}'`);
    }
    for (const group of screen.queryAllByRole('group')) {
      const heading = document.getElementById(
        group.getAttribute('aria-labelledby') ?? '',
      );
      expect(code).toContain(`label: '${heading?.textContent ?? ''}'`);
    }

    expect(count(code, 'value: ')).toBe(options.length);
    expect(count(code, 'disabled: true')).toBe(
      options.filter((option) => option.getAttribute('aria-disabled') === 'true').length,
    );
    expect(count(code, 'shortcut: ')).toBe(document.querySelectorAll('kbd').length);
    expect(count(code, 'description: ')).toBe(
      options.filter((option) => option.querySelector('.mt-0\\.5') !== null).length,
    );
    expect(count(code, '<Icon as=')).toBe(
      document.querySelectorAll('[role="option"] svg').length,
    );
  });

  it('Empty renders no command and shows none in the snippet', async () => {
    const user = userEvent.setup();
    render(renderStory('Empty'));
    await user.click(screen.getByRole('button', { name: 'Ouvrir la palette' }));
    await screen.findByRole('status');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(sourceOf('Empty')).toContain('items={[]}');
  });

  it('CustomFilter filters with the rule its snippet shows', async () => {
    const user = userEvent.setup();
    render(renderStory('CustomFilter'));
    await user.click(screen.getByRole('button', { name: 'Ouvrir la palette' }));
    // Deux mots dans le désordre : le filtre par défaut ne trouverait rien.
    await user.type(await screen.findByRole('combobox'), 'devoir nouveau');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Nouveau devoir');
    expect(sourceOf('CustomFilter')).toContain('filter={everyWord}');
    expect(sourceOf('CustomFilter')).toContain('const everyWord = (item, query) =>');
  });

  it('every prop a section paragraph names is used by the snippet of its canvas', () => {
    const mdx = readFileSync(
      join(process.cwd(), 'src/components/CommandMenu/CommandMenu.mdx'),
      'utf8',
    );
    const pairs = [
      ...mdx.matchAll(
        /<P k="([^"]+)" \/>\s*<Canvas of=\{CommandMenuStories\.(\w+)\} \/>/g,
      ),
    ];
    expect(pairs.length).toBeGreaterThan(5);
    const props = new Set([
      ...Object.keys(commandMenuArgTypes),
      'value',
      'label',
      'description',
      'icon',
      'shortcut',
      'keywords',
      'disabled',
    ]);
    for (const [, key, story] of pairs) {
      if (!key || !story) continue;
      const text = docsString(docsCopy, key, 'fr');
      const code = sourceOf(story as StoryName);
      for (const [, token] of text.matchAll(/`([^`]+)`/g)) {
        if (!token || !props.has(token)) continue;
        expect(
          code,
          `${key} names \`${token}\`, but the ${story} snippet does not use it`,
        ).toContain(token);
      }
    }
  });
});
