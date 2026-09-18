import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Drawer as DrawerFromEntry,
  DrawerActions as DrawerActionsFromEntry,
} from '../../index';
import { Button } from '../Button/Button';
import { useDialogContext } from '../Dialog/DialogContext';
import { DialogActions, DialogTitle } from '../Dialog/DialogParts';
import { TextInput } from '../TextInput/TextInput';
import { Drawer, type DrawerProps } from './Drawer';
import {
  DrawerActions,
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './DrawerParts';

type BasicProps = Pick<DrawerProps, 'side' | 'size' | 'dismissible' | 'id'> & {
  onOpenChange?: (open: boolean) => void;
};

function Basic({ onOpenChange, ...drawer }: BasicProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Ouvrir
      </button>
      <button type="button">Dehors</button>
      <Drawer
        {...drawer}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
      >
        <DrawerTitle>Filtres</DrawerTitle>
        <DrawerDescription>Affinez la liste sans quitter la page.</DrawerDescription>
        <DrawerActions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Appliquer
          </Button>
        </DrawerActions>
      </Drawer>
    </>
  );
}

/*
 * Le déclencheur est saisi avant l'ouverture : une fois le panneau ouvert, le
 * reste de la page est inerte et `getByRole` ne le voit plus.
 */
async function openBasic(
  user: ReturnType<typeof userEvent.setup>,
  props: BasicProps = {},
) {
  render(<Basic {...props} />);
  const trigger = screen.getByRole('button', { name: 'Ouvrir' });
  await user.click(trigger);
  const dialog = await screen.findByRole('dialog');
  return { dialog, trigger };
}

describe('Drawer', () => {
  it('is exported from the package entrypoint, with the Dialog parts under Drawer names', () => {
    expect(DrawerFromEntry).toBe(Drawer);
    expect(DrawerActionsFromEntry).toBe(DrawerActions);
    expect(DrawerTitle).toBe(DialogTitle);
    expect(DrawerActions).toBe(DialogActions);
  });

  it('renders nothing while closed', () => {
    render(<Basic />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('names itself from DrawerTitle and describes itself from DrawerDescription', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user);

    expect(dialog).toHaveAccessibleName('Filtres');
    const describedby = dialog.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    expect(document.getElementById(describedby as string)).toHaveTextContent(
      'Affinez la liste sans quitter la page.',
    );
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('falls back to aria-label when no DrawerTitle is rendered', async () => {
    const user = userEvent.setup();
    function NoTitle() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Ouvrir
          </button>
          <Drawer open={open} onOpenChange={setOpen} aria-label="Navigation">
            <DrawerBody>Contenu</DrawerBody>
          </Drawer>
        </>
      );
    }
    render(<NoTitle />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    const dialog = await screen.findByRole('dialog', { name: 'Navigation' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('traps focus inside the panel and hides the rest of the page', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user);

    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
    // `modal` rend le reste de la page inerte : « Dehors » sort de l'arbre d'accessibilité.
    expect(screen.queryByRole('button', { name: 'Dehors' })).not.toBeInTheDocument();

    // Quatre tabulations pour trois contrôles (deux actions et la croix) : le focus boucle.
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it('returns focus to the trigger on close', async () => {
    const user = userEvent.setup();
    const { trigger } = await openBasic(user);

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on Escape, on outside press and from the default dismiss button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { dialog: first, trigger } = await openBasic(user, { onOpenChange });

    await user.keyboard('{Escape}');
    await waitFor(() => expect(first).not.toBeInTheDocument());

    await user.click(trigger);
    const second = await screen.findByRole('dialog');
    await user.click(second.parentElement as HTMLElement);
    await waitFor(() => expect(second).not.toBeInTheDocument());

    await user.click(trigger);
    const third = await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Fermer' }));
    await waitFor(() => expect(third).not.toBeInTheDocument());

    // Trois fermetures ; les ouvertures passent par le déclencheur, pas par `onOpenChange`.
    expect(onOpenChange).toHaveBeenCalledTimes(3);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('drops the dismiss button with dismissible={false}, but keeps Escape', async () => {
    const user = userEvent.setup();
    await openBasic(user, { dismissible: false });
    expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();

    // WCAG 2.1.2 : la sortie clavier ne se retire pas.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'anchors the panel to the %s edge',
    async (side) => {
      const user = userEvent.setup();
      const { dialog } = await openBasic(user, { side });
      expect(dialog).toHaveAttribute('data-side', side);
      expect(dialog.className).toContain(`${side}-0`);
      expect(dialog.className).toContain(`d-ui-drawer-panel-${side}`);
    },
  );

  it.each([
    ['right', 'tiny', 'max-w-[400px]'],
    ['left', 'huge', 'max-w-[calc(100vw-4rem)]'],
    ['top', 'regular', 'max-h-[600px]'],
    ['bottom', 'big', 'max-h-[800px]'],
  ] as const)(
    'sizes a %s panel as %s along the axis that matters',
    async (side, size, className) => {
      const user = userEvent.setup();
      const { dialog } = await openBasic(user, { side, size });
      expect(dialog.className).toContain(className);
    },
  );

  it('keeps the backdrop unscrollable so the slide from right or bottom stays visible', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user, { side: 'right' });
    /*
     * Le panneau part hors champ ; si le fond pouvait défiler, le focus
     * initial le ramènerait dans la vue et annulerait la translation.
     */
    expect((dialog.parentElement as HTMLElement).style.overflow).toBe('clip');
  });

  it('defaults to a regular panel on the right edge', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user);
    expect(dialog).toHaveAttribute('data-side', 'right');
    expect(dialog.className).toContain('max-w-[600px]');
  });

  it('forwards id so a trigger can point at the panel with aria-controls', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user, { id: 'nav-mobile' });
    expect(dialog).toHaveAttribute('id', 'nav-mobile');
  });

  it('gives the panel an id even without one, so the floating layer stays addressable', async () => {
    const user = userEvent.setup();
    const { dialog } = await openBasic(user);
    expect(dialog.id).not.toBe('');
  });

  it('honours initialFocus over the first focusable control', async () => {
    const user = userEvent.setup();
    function Focused() {
      const [open, setOpen] = useState(false);
      const cityRef = useRef<HTMLInputElement | null>(null);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Ouvrir
          </button>
          <Drawer open={open} onOpenChange={setOpen} initialFocus={cityRef}>
            <DrawerTitle>Adresse</DrawerTitle>
            <DrawerBody>
              <TextInput name="street" label="Rue" />
              <TextInput ref={cityRef} name="city" label="Ville" />
            </DrawerBody>
          </Drawer>
        </>
      );
    }
    render(<Focused />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('dialog');
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Ville' })).toHaveFocus();
    });
  });

  it('keeps DrawerActions in a footer under the scrolling body', async () => {
    function Layout() {
      const [open, setOpen] = useState(true);
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerHeader>
            <DrawerTitle>Filtres</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>Contenu long</DrawerBody>
          <DrawerActions surface>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Appliquer
            </Button>
          </DrawerActions>
        </Drawer>
      );
    }
    render(<Layout />);
    await screen.findByRole('dialog');
    const footer = screen.getByRole('button', { name: 'Appliquer' }).parentElement;
    const content = footer?.previousElementSibling;
    expect(content?.className).toContain('overflow-hidden');
    expect(footer?.className).toContain('shrink-0');
  });

  it('refuses to render a part outside a Dialog or a Drawer', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Orphan() {
      useDialogContext('DrawerTitle');
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(
      '<DrawerTitle> doit être rendu à l’intérieur de <Dialog> ou <Drawer>.',
    );
    error.mockRestore();
  });
});
