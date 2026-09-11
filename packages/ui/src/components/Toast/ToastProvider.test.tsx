import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import {
  ToastProvider as ToastProviderFromEntry,
  useToast as useToastFromEntry,
} from '../../index';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './ToastProvider';

function ToastDemo({ message = 'Processus terminé' }: { message?: string }) {
  const { toast } = useToast();
  return (
    <Button type="button" onClick={() => toast({ message, variant: 'success' })}>
      Afficher
    </Button>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is exported from the package entrypoint', () => {
    expect(ToastProviderFromEntry).toBe(ToastProvider);
    expect(useToastFromEntry).toBe(useToast);
  });

  it('throws when useToast is used outside the provider', () => {
    expect(() => render(<ToastDemo />)).toThrow(/ToastProvider/);
  });

  it('shows a toast in the viewport without moving focus', () => {
    render(
      <ToastProvider defaultDuration={6000}>
        <ToastDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    // Un succès s'annonce poliment : `role="status"`, pas `alert`.
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('Processus terminé');
    expect(toast).not.toHaveFocus();
  });

  it('names the toast area so it can be found again', () => {
    render(
      <ToastProvider label="Notifications">
        <ToastDemo />
      </ToastProvider>,
    );
    /*
     * `aria-label` seul sur un `div` sans rôle est interdit : le nom n'était
     * exposé nulle part, et la prop `label` ne servait à rien.
     */
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('auto-dismisses after the configured duration', () => {
    render(
      <ToastProvider defaultDuration={1000}>
        <ToastDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('queues toasts beyond maxVisible', () => {
    function QueueDemo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() => {
            toast({ message: 'Premier', variant: 'info' });
            toast({ message: 'Deuxième', variant: 'info' });
            toast({ message: 'Troisième', variant: 'info' });
          }}
        >
          Enfiler
        </Button>
      );
    }

    render(
      <ToastProvider maxVisible={2} defaultDuration={0}>
        <QueueDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enfiler' }));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByText('Premier')).toBeInTheDocument();
    expect(screen.getByText('Deuxième')).toBeInTheDocument();
    expect(screen.queryByText('Troisième')).not.toBeInTheDocument();
  });

  it('dismisses from the close button when dismissible', () => {
    function DismissDemo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              message: 'Processus terminé',
              dismissible: true,
              dismissLabel: 'Fermer',
              duration: 0,
            })
          }
        >
          Afficher
        </Button>
      );
    }

    render(
      <ToastProvider defaultDuration={0}>
        <DismissDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps a toast that carries an action until someone closes it', () => {
    function ActionDemo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              message: 'Fichier envoyé',
              actionLabel: 'Voir les détails',
              onActionClick: () => {},
              dismissLabel: 'Fermer',
            })
          }
        >
          Afficher
        </Button>
      );
    }

    render(
      <ToastProvider defaultDuration={6000}>
        <ActionDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    /*
     * À six secondes, « Voir les détails » s'était volatilisé avant qu'un
     * utilisateur au clavier ait pu l'atteindre : une fonction offerte par un
     * contrôle minuté (WCAG 2.2.1). Et sans auto-fermeture, la fermeture
     * manuelle devient obligatoire, sinon le toast reste là pour toujours.
     */
    expect(screen.getByRole('button', { name: 'Voir les détails' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('lets a persistent toast hold its slot, and the next one through when it goes', () => {
    function ActionQueue() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              message: `Envoi ${Date.now()}`,
              actionLabel: 'Voir',
              onActionClick: () => {},
              dismissLabel: 'Fermer',
            })
          }
        >
          Afficher
        </Button>
      );
    }

    render(
      <ToastProvider maxVisible={1}>
        <ActionQueue />
      </ToastProvider>,
    );

    const show = screen.getByRole('button', { name: 'Afficher' });
    fireEvent.click(show);
    fireEvent.click(show);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    /*
     * Conséquence assumée de la règle : sans auto-fermeture, la place reste
     * prise. C'est le comportement que `maxVisible` avait déjà avec
     * `duration: 0` — la règle le rend juste atteignable par défaut, et c'est
     * une raison de plus pour ne jamais faire d'un toast le seul porteur d'un
     * message.
     */
    expect(screen.getAllByRole('status')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    // Et la file repart : le message en attente n'est pas perdu.
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('leaves an explicit duration:0 toast alone, close button included', () => {
    function QuietDemo() {
      const { toast } = useToast();
      return (
        <Button type="button" onClick={() => toast({ message: 'Premier', duration: 0 })}>
          Afficher
        </Button>
      );
    }

    render(
      <ToastProvider>
        <QuietDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    /*
     * La règle ne vise que les toasts qu'elle rend persistants. Élargie à tout
     * `duration: 0`, elle ajoutait un bouton que personne n'avait demandé —
     * nommé par le fallback anglais, sur une page française.
     */
    expect(
      screen.queryByRole('button', { name: /Dismiss|Fermer/ }),
    ).not.toBeInTheDocument();
  });

  it('still obeys an explicit duration, action or not', () => {
    function ImpatientDemo() {
      const { toast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            toast({
              message: 'Fichier envoyé',
              actionLabel: 'Annuler',
              onActionClick: () => {},
              duration: 1000,
            })
          }
        >
          Afficher
        </Button>
      );
    }

    render(
      <ToastProvider>
        <ImpatientDemo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // La règle est un défaut, pas une interdiction : l'appelant garde la main.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
