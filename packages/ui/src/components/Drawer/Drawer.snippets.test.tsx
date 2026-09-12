import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { drawerArgTypes } from '../../../.storybook/arg-types';
import { docsCopy, docsString } from '../../../.storybook/docs-copy';
import { drawerCopy } from '../../../.storybook/docs-locale';
import * as stories from './Drawer.stories';

type StoryName = Exclude<keyof typeof stories, 'default'>;

/**
 * « Show code » doit montrer ce que le canvas rend : mêmes déclencheurs, mêmes
 * titres, mêmes champs, mêmes liens — et chaque propriété qu'un paragraphe de
 * la doc nomme est bien passée par la story qu'il introduit.
 */
const fr = drawerCopy('fr');

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

describe('Drawer « Show code »', () => {
  it('Default shows the trigger, title, description and body the canvas renders', async () => {
    const user = userEvent.setup();
    render(renderStory('Default'));
    await user.click(screen.getByRole('button', { name: fr.open }));
    const dialog = await screen.findByRole('dialog', { name: fr.detailTitle });
    expect(dialog).toHaveTextContent(fr.detailBody);
    expect(dialog).toHaveTextContent(fr.detailParagraph);

    const code = sourceOf('Default');
    expect(code).toContain(`>${fr.open}</Button>`);
    expect(code).toContain(`<DrawerTitle>${fr.detailTitle}</DrawerTitle>`);
    expect(code).toContain(`<DrawerDescription>${fr.detailBody}</DrawerDescription>`);
    expect(code).toContain(`<p>${fr.detailParagraph}</p>`);
  });

  it('Sides offers one trigger per edge, and the snippet the same four', async () => {
    const user = userEvent.setup();
    render(renderStory('Sides'));
    const code = sourceOf('Sides');
    expect(count(code, '<Button ')).toBe(screen.getAllByRole('button').length);
    for (const side of ['left', 'right', 'top', 'bottom'] as const) {
      expect(screen.getByRole('button', { name: fr[side] })).toBeInTheDocument();
      expect(code).toContain(`setSide('${side}')}>${fr[side]}</Button>`);
    }

    await user.click(screen.getByRole('button', { name: fr.top }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'top');
    expect(dialog).toHaveTextContent(`${fr.sideTitle} — top`);
    expect(code).toContain("side={side ?? 'right'}");
    expect(code).toContain(`\`${fr.sideTitle} — \${side ?? 'right'}\``);
    expect(code).toContain(`<DrawerDescription>${fr.sideBody}</DrawerDescription>`);
  });

  it('Sizes offers one trigger per size, and the snippet the same four', async () => {
    const user = userEvent.setup();
    render(renderStory('Sizes'));
    const code = sourceOf('Sizes');
    expect(count(code, '<Button ')).toBe(screen.getAllByRole('button').length);
    for (const size of ['tiny', 'regular', 'big', 'huge'] as const) {
      expect(screen.getByRole('button', { name: fr[size] })).toBeInTheDocument();
      expect(code).toContain(`setSize('${size}')}>${fr[size]}</Button>`);
    }

    await user.click(screen.getByRole('button', { name: fr.big }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.className).toContain('max-w-[800px]');
    expect(dialog).toHaveTextContent(`${fr.sizeTitle} — big`);
    expect(code).toContain("size={size ?? 'regular'}");
    expect(code).toContain(`\`${fr.sizeTitle} — \${size ?? 'regular'}\``);
  });

  it('Filters lists every field and every category the form renders', async () => {
    const user = userEvent.setup();
    render(renderStory('Filters'));
    await user.click(screen.getByRole('button', { name: fr.filtersOpen }));
    const dialog = await screen.findByRole('dialog', { name: fr.filtersTitle });
    const code = sourceOf('Filters');

    expect(
      within(dialog).getByRole('searchbox', { name: fr.searchLabel }),
    ).toBeInTheDocument();
    expect(code).toContain(
      `label="${fr.searchLabel}" placeholder="${fr.searchPlaceholder}"`,
    );

    expect(dialog).toHaveTextContent(fr.statusLabel);
    expect(code).toContain(`label="${fr.statusLabel}"`);
    for (const option of [fr.statusAll, fr.statusActive, fr.statusArchived]) {
      expect(code).toContain(`label: '${option}'`);
    }

    const checkboxes = within(dialog).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(fr.categories.length);
    expect(count(code, '<Checkbox ')).toBe(checkboxes.length);
    for (const label of fr.categories) {
      expect(within(dialog).getByRole('checkbox', { name: label })).toBeInTheDocument();
      expect(code).toContain(`label="${label}"`);
    }

    expect(within(dialog).getByRole('button', { name: fr.reset })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: fr.apply })).toBeInTheDocument();
    expect(code).toContain('<DrawerActions surface>');
    expect(code).toContain(`>${fr.reset}</Button>`);
    expect(code).toContain(`>${fr.apply}</Button>`);
  });

  it('WithoutDismiss has no dismiss button, and the snippet says so', async () => {
    const user = userEvent.setup();
    render(renderStory('WithoutDismiss'));
    await user.click(screen.getByRole('button', { name: fr.addressOpen }));
    const dialog = await screen.findByRole('dialog', { name: fr.addressTitle });
    expect(
      within(dialog).queryByRole('button', { name: 'Fermer' }),
    ).not.toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: fr.streetLabel })).toHaveValue(
      fr.streetValue,
    );
    expect(within(dialog).getByRole('textbox', { name: fr.cityLabel })).toHaveValue(
      fr.cityValue,
    );

    const code = sourceOf('WithoutDismiss');
    expect(code).toContain('dismissible={false}');
    expect(code).toContain(`label="${fr.streetLabel}" defaultValue="${fr.streetValue}"`);
    expect(code).toContain(`label="${fr.cityLabel}" defaultValue="${fr.cityValue}"`);
    expect(code).toContain(`>${fr.cancel}</Button>`);
    expect(code).toContain(`>${fr.save}</Button>`);
  });

  it('InitialFocus lands on the field the snippet points at', async () => {
    const user = userEvent.setup();
    render(renderStory('InitialFocus'));
    await user.click(screen.getByRole('button', { name: fr.noteOpen }));
    await screen.findByRole('dialog', { name: fr.noteTitle });
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: fr.noteLabel })).toHaveFocus();
    });

    const code = sourceOf('InitialFocus');
    expect(code).toContain('initialFocus={noteRef}');
    expect(code).toContain('ref={noteRef}');
    expect(code).toContain(`label="${fr.visibilityLabel}"`);
    expect(code).toContain(`label="${fr.noteLabel}"`);
    expect(code).toContain(`helper="${fr.noteHelper}"`);
    expect(code).toContain(`>${fr.publish}</Button>`);
  });

  it('MobileNavigation lists the same links as the canvas', async () => {
    const user = userEvent.setup();
    render(renderStory('MobileNavigation'));
    await user.click(screen.getByRole('button', { name: fr.openNav }));
    const dialog = await screen.findByRole('dialog', { name: fr.menu });
    const links = within(dialog).getAllByRole('link');
    const code = sourceOf('MobileNavigation');

    expect(links).toHaveLength(fr.navLinks.length);
    expect(count(code, '<ListItem ')).toBe(links.length);
    for (const link of links) {
      expect(code).toContain(`>${link.textContent}</ListItem>`);
    }
    expect(
      within(dialog).getByRole('navigation', { name: fr.navLabel }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: fr.closeNav })).toBeInTheDocument();
    expect(code).toContain(`<nav aria-label="${fr.navLabel}">`);
    expect(code).toContain(`dismissLabel="${fr.closeNav}"`);
    expect(code).toContain('id="nav-mobile"');
    expect(code).toContain('menuControls="nav-mobile"');
  });

  it('every prop a section paragraph names is used by the snippet of its canvas', () => {
    const mdx = readFileSync(
      join(process.cwd(), 'src/components/Drawer/Drawer.mdx'),
      'utf8',
    );
    const pairs = [
      ...mdx.matchAll(/<P k="([^"]+)" \/>\s*<Canvas of=\{DrawerStories\.(\w+)\} \/>/g),
    ];
    expect(pairs.length).toBeGreaterThan(4);
    const props = new Set([...Object.keys(drawerArgTypes), 'surface', 'align', 'level']);
    for (const [, key, story] of pairs) {
      if (!key || !story) continue;
      const text = docsString(docsCopy, key, 'fr');
      const code = sourceOf(story as StoryName);
      for (const [, token] of text.matchAll(/`([^`]+)`/g)) {
        const prop = token?.match(/^[A-Za-z-]+/)?.[0];
        if (!prop || !props.has(prop)) continue;
        expect(
          code,
          `${key} names \`${token}\`, but the ${story} snippet does not use it`,
        ).toContain(prop);
      }
    }
  });
});
