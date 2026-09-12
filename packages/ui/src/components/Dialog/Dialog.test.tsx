import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Dialog as DialogFromEntry,
  DialogActions as DialogActionsFromEntry,
} from '../../index';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';
import { useDialogContext } from './DialogContext';
import { DialogActions, DialogBody, DialogDescription, DialogTitle } from './DialogParts';

function Basic({
  alert = false,
  dismissible = false,
  onOpenChange,
}: {
  alert?: boolean;
  dismissible?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Ouvrir
      </button>
      <button type="button">Dehors</button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        alert={alert}
        dismissible={dismissible}
      >
        <DialogTitle>Supprimer le projet</DialogTitle>
        <DialogDescription>Cette action est irréversible.</DialogDescription>
        <DialogActions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('is exported from the package entrypoint', () => {
    expect(DialogFromEntry).toBe(Dialog);
    expect(DialogActionsFromEntry).toBe(DialogActions);
  });

  it('renders nothing while closed', () => {
    render(<Basic />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('names itself from DialogTitle and describes itself from DialogDescription', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    const dialog = await screen.findByRole('dialog', { name: 'Supprimer le projet' });
    const describedby = dialog.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    expect(document.getElementById(describedby as string)).toHaveTextContent(
      'Cette action est irréversible.',
    );
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('falls back to aria-label when no DialogTitle is rendered', async () => {
    const user = userEvent.setup();
    function NoTitle() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Ouvrir
          </button>
          <Dialog open={open} onOpenChange={setOpen} aria-label="Aperçu">
            <DialogBody>Contenu</DialogBody>
          </Dialog>
        </>
      );
    }
    render(<NoTitle />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    const dialog = await screen.findByRole('dialog', { name: 'Aperçu' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('traps focus inside the panel and hides the rest of the page', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    const dialog = await screen.findByRole('dialog');
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
    // `modal` rend le reste de la page inerte : « Dehors » sort de l'arbre d'accessibilité.
    expect(screen.queryByRole('button', { name: 'Dehors' })).not.toBeInTheDocument();

    // Trois tabulations pour deux contrôles : le focus boucle au lieu de sortir.
    await user.tab();
    await user.tab();
    await user.tab();
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it('returns focus to the trigger on close', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole('button', { name: 'Ouvrir' });
    await user.click(trigger);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on Escape and on outside press', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(dialog.parentElement as HTMLElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps an alertdialog open on outside press but still closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Basic alert />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    const dialog = await screen.findByRole('alertdialog');
    await user.click(dialog.parentElement as HTMLElement);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    // WCAG 2.1.2 : le clavier ne doit jamais être piégé, même sur une alerte.
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
  });

  it('gives an alertdialog its initial focus to the first, non-destructive action', async () => {
    const user = userEvent.setup();
    render(<Basic alert />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('alertdialog');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Annuler' })).toHaveFocus();
    });
  });

  it('drops the dismiss button on an alertdialog', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Basic dismissible />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('dialog');
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    unmount();

    render(<Basic alert dismissible />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('alertdialog');
    expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();
  });

  it('closes from the dismiss button', async () => {
    const user = userEvent.setup();
    render(<Basic dismissible />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await screen.findByRole('dialog');

    await user.click(screen.getByRole('button', { name: 'Fermer' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the confirming action last when actions are stacked', async () => {
    function Stacked() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen} aria-label="Abonnement">
          <DialogActions align="stacked">
            <Button variant="secondary">Annuler</Button>
            <Button variant="primary">Confirmer</Button>
          </DialogActions>
        </Dialog>
      );
    }
    render(<Stacked />);
    const dialog = await screen.findByRole('dialog');
    const labels = [...dialog.querySelectorAll('button')].map((b) => b.textContent);
    expect(labels).toEqual(['Annuler', 'Confirmer']);
    // `stacked` n'inverse pas : l'ordre visuel reste l'ordre du DOM (WCAG 2.4.3).
    expect(dialog.querySelector('[class*="flex-col"]')?.className).not.toContain(
      'flex-col-reverse',
    );
  });

  it('applies bordered and radius classes to the panel', async () => {
    function Chrome() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog
          open={open}
          onOpenChange={setOpen}
          bordered
          radius="xl"
          aria-label="Chrome"
        >
          <DialogActions surface>
            <Button variant="primary">OK</Button>
          </DialogActions>
        </Dialog>
      );
    }
    render(<Chrome />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.className).toContain('border-border');
    expect(dialog.className).toContain('rounded-xl');
    const footer = dialog.querySelector('[class*="rounded-b-xl"]');
    expect(footer).toBeTruthy();
  });

  it('renders DialogActions in a dedicated footer below the scrollable content', async () => {
    function Huge() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen} size="huge" aria-label="Huge">
          <DialogTitle>Largeur du panneau</DialogTitle>
          <DialogDescription>Contenu court.</DialogDescription>
          <DialogActions>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    render(<Huge />);
    await screen.findByRole('dialog');
    const button = screen.getByRole('button', { name: 'Fermer' });
    const footer = button.parentElement;
    const content = footer?.previousElementSibling;
    expect(content?.className).toContain('overflow-y-auto');
    expect(footer?.className).toContain('shrink-0');
    expect(footer?.className).not.toContain('mt-auto');
  });

  it('blocks dismiss while processing', async () => {
    const user = userEvent.setup();
    function Processing() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen} processing dismissible>
          <DialogTitle>Enregistrement</DialogTitle>
          <DialogBody>Contenu</DialogBody>
        </Dialog>
      );
    }
    render(<Processing />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(dialog.parentElement as HTMLElement);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    /*
     * L'anneau du calque est décoratif : le panneau porte déjà `aria-busy` et
     * son nom. Une deuxième annonce pour une seule attente serait du bruit.
     */
    const ring = dialog.querySelector('.d-ui-spinner');
    expect(ring).not.toBeNull();
    expect(ring).toHaveAttribute('aria-hidden', 'true');
    expect(ring).not.toHaveAttribute('role');
  });

  it('refuses to render a part outside a Dialog', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Orphan() {
      useDialogContext('DialogTitle');
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(
      '<DialogTitle> doit être rendu à l’intérieur de <Dialog> ou <Drawer>.',
    );
    error.mockRestore();
  });
});
