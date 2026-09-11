import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Notification as NotificationFromEntry } from '../../index';
import { Notification } from './Notification';

describe('Notification', () => {
  it('is exported from the package entrypoint', () => {
    expect(NotificationFromEntry).toBe(Notification);
  });

  it('matches its politeness to the gravity, not to the surface', () => {
    /*
     * `role="alert"` est assertif : il coupe la parole au lecteur d'écran. Le
     * faire pour « Enregistré » interrompt une lecture en cours pour annoncer
     * un succès. `Alert` applique déjà cette règle avec la même fonction.
     */
    const { rerender } = render(
      <Notification variant="success">Enregistré</Notification>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Enregistré');

    rerender(<Notification variant="info">Mise à jour</Notification>);
    expect(screen.getByRole('status')).toHaveTextContent('Mise à jour');

    for (const variant of ['warning', 'danger'] as const) {
      rerender(<Notification variant={variant}>Échec de l’envoi</Notification>);
      // Là, interrompre est le bon comportement : l'utilisateur doit savoir.
      expect(screen.getByRole('alert')).toHaveTextContent('Échec de l’envoi');
    }
  });

  it('calls onActionClick from the action button', async () => {
    const user = userEvent.setup();
    const onActionClick = vi.fn();
    render(
      <Notification actionLabel="Voir" onActionClick={onActionClick}>
        Mise à jour disponible
      </Notification>,
    );
    await user.click(screen.getByRole('button', { name: 'Voir' }));
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it('dismisses from the close button when dismissible', async () => {
    const user = userEvent.setup();
    render(
      <Notification dismissible dismissLabel="Fermer" onOpenChange={vi.fn()}>
        Processus terminé
      </Notification>,
    );
    await user.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
