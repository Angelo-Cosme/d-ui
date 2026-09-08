import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommandMenu as CommandMenuFromEntry } from '../../index';
import { CommandMenu, type CommandMenuProps } from './CommandMenu';
import type { CommandMenuEntry } from './commandMenuItems';

const commands: CommandMenuEntry[] = [
  { value: 'home', label: 'Accueil' },
  {
    value: 'new',
    label: 'Nouveau devoir',
    description: 'Créer un devoir vide',
    keywords: ['créer'],
    shortcut: '⌘N',
  },
  { value: 'archive', label: 'Archiver', disabled: true },
  { value: 'logout', label: 'Se déconnecter' },
];

const grouped: CommandMenuEntry[] = [
  {
    label: 'Navigation',
    items: [
      { value: 'home', label: 'Accueil' },
      { value: 'courses', label: 'Cours' },
    ],
  },
  { label: 'Actions', items: [{ value: 'new', label: 'Nouveau devoir' }] },
];

function Harness({
  items = commands,
  onSelect = () => {},
  onOpenChange,
  defaultOpen = false,
  ...rest
}: Partial<CommandMenuProps> & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Ouvrir
      </button>
      <CommandMenu
        {...rest}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        items={items}
        onSelect={onSelect}
      />
    </>
  );
}

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
  const combobox = await screen.findByRole('combobox');
  await waitFor(() => expect(combobox).toHaveFocus());
  return combobox;
}

function activeOption(combobox: HTMLElement): HTMLElement | null {
  const id = combobox.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
}

describe('CommandMenu', () => {
  it('is exported from the package entrypoint', () => {
    expect(CommandMenuFromEntry).toBe(CommandMenu);
  });

  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('opens a named dialog, focuses the search field, and lists every command', async () => {
    const user = userEvent.setup();
    render(<Harness label="Palette" />);
    const combobox = await openMenu(user);

    expect(screen.getByRole('dialog', { name: 'Palette' })).toBeInTheDocument();
    expect(combobox).toHaveAccessibleName('Palette');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    const list = screen.getByRole('listbox', { name: 'Palette' });
    expect(combobox).toHaveAttribute('aria-controls', list.id);
    expect(within(list).getAllByRole('option')).toHaveLength(4);

    const first = activeOption(combobox);
    expect(first).toHaveTextContent('Accueil');
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Archiver' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('renders the shortcut and the description on the command row', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await openMenu(user);
    const option = screen.getByRole('option', { name: /Nouveau devoir/ });
    expect(option).toHaveTextContent('Créer un devoir vide');
    expect(option.querySelector('kbd')).toHaveTextContent('⌘N');
  });

  it('filters as the user types, ignoring case and accents, and reports the query', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(<Harness onQueryChange={onQueryChange} />);
    const combobox = await openMenu(user);

    await user.type(combobox, 'CREER');
    expect(onQueryChange).toHaveBeenLastCalledWith('CREER');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Nouveau devoir');
    expect(activeOption(combobox)).toBe(options[0]);
  });

  it('moves the active command with the keyboard, skipping disabled ones, and runs it on Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<Harness onSelect={onSelect} onOpenChange={onOpenChange} />);
    const combobox = await openMenu(user);

    await user.keyboard('{ArrowDown}');
    expect(activeOption(combobox)).toHaveTextContent('Nouveau devoir');
    // « Archiver » est désactivée : la flèche passe directement à la suivante.
    await user.keyboard('{ArrowDown}');
    expect(activeOption(combobox)).toHaveTextContent('Se déconnecter');
    await user.keyboard('{ArrowDown}');
    expect(activeOption(combobox)).toHaveTextContent('Accueil');
    await user.keyboard('{ArrowUp}');
    expect(activeOption(combobox)).toHaveTextContent('Se déconnecter');
    await user.keyboard('{Home}');
    expect(activeOption(combobox)).toHaveTextContent('Accueil');
    await user.keyboard('{End}');
    expect(activeOption(combobox)).toHaveTextContent('Se déconnecter');

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ value: 'logout' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('runs a command on click and ignores a disabled one', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    await openMenu(user);

    await user.click(screen.getByRole('option', { name: 'Archiver' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: /Nouveau devoir/ }));
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ value: 'new' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('names groups and drops a group emptied by the query', async () => {
    const user = userEvent.setup();
    render(<Harness items={grouped} />);
    const combobox = await openMenu(user);

    expect(screen.getAllByRole('group')).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument();

    await user.type(combobox, 'cours');
    expect(screen.queryByRole('group', { name: 'Actions' })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('group', { name: 'Navigation' })).getAllByRole('option'),
    ).toHaveLength(1);
  });

  it('shows a query-aware empty message in a status region', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        items={[]}
        emptyMessage={(query) => (query ? `Rien pour « ${query} »` : 'Aucune commande')}
      />,
    );
    const combobox = await openMenu(user);

    expect(screen.getByRole('status')).toHaveTextContent('Aucune commande');
    expect(combobox).not.toHaveAttribute('aria-activedescendant');
    await user.type(combobox, 'x');
    expect(screen.getByRole('status')).toHaveTextContent('Rien pour « x »');
  });

  it('replaces the commands with skeleton rows while loading', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Harness loading loadingMessage="Chargement des commandes" onSelect={onSelect} />,
    );
    const combobox = await openMenu(user);

    const list = screen.getByRole('listbox');
    expect(list).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('Chargement des commandes');
    expect(document.querySelectorAll('.d-ui-skeleton')).toHaveLength(8);
    expect(combobox).not.toHaveAttribute('aria-activedescendant');

    await user.keyboard('{Enter}');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('uses a custom filter when provided', async () => {
    const user = userEvent.setup();
    render(<Harness filter={(item, query) => item.value.startsWith(query)} />);
    const combobox = await openMenu(user);

    await user.type(combobox, 'lo');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Se déconnecter');
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Ouvrir' });
    await openMenu(user);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('starts from a fresh query on every opening', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const combobox = await openMenu(user);
    await user.type(combobox, 'acc');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    const reopened = await openMenu(user);
    expect(reopened).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });
});
