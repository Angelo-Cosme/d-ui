import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FilePreview as FilePreviewFromEntry } from '../../index';
import { FilePreview } from './FilePreview';

function imageFile(name = 'photo.png') {
  return new File(['x'], name, { type: 'image/png' });
}
function pdfFile(name = 'contrat.pdf') {
  return new File(['x'], name, { type: 'application/pdf' });
}

describe('FilePreview', () => {
  it('is exported from the package entrypoint', () => {
    expect(FilePreviewFromEntry).toBe(FilePreview);
  });

  it('shows the file name and its weight in plain text', () => {
    render(<FilePreview file={pdfFile()} />);
    expect(screen.getByText(/contrat\.pdf/)).toBeInTheDocument();
    // Le poids, pas n'importe quel texte finissant par « o ».
    expect(screen.getByText(/·\s*\d+(?:[.,]\d+)?\s*(?:o|Ko|Mo)$/)).toBeInTheDocument();
  });

  it('cuts the name short, never the weight', () => {
    /*
     * En vignette il ne reste qu'une centaine de pixels. Dans la même coupe que
     * le nom, le poids disparaissait toujours — or c'est justement la forme où
     * l'on vérifie qu'une photo n'est pas trop lourde.
     */
    render(
      <FilePreview
        layout="tile"
        file={pdfFile('rapport-de-stage-2026-version-finale.pdf')}
      />,
    );
    const name = screen.getByText(/rapport-de-stage/);
    expect(name.className).toContain('truncate');
    const weight = screen.getByText(/^\d+(?:[.,]\d+)?\s*(?:o|Ko|Mo)$/);
    expect(weight).not.toBe(name);
    expect(weight.className).not.toContain('truncate');
  });

  it('lets the page put the weight in its own words', () => {
    // Seul texte que le composant produit lui-même : une page anglaise doit
    // pouvoir le remplacer (3.1.2).
    render(<FilePreview file={pdfFile()} formatSize={(bytes) => `${bytes} bytes`} />);
    expect(screen.getByText(/·\s*1 bytes/)).toBeInTheDocument();
  });

  it('falls back to the extension when the file is not an image', () => {
    render(<FilePreview file={pdfFile()} />);
    // Décoratif : le nom du fichier porte déjà l'information.
    expect(screen.getByText('PDF')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows a glyph, not a hardcoded word, when the name has no extension', () => {
    /*
     * Le composant ne connaît pas la langue de la page : un « FICHIER » figé
     * serait de la copie française dans le paquet.
     */
    const { container } = render(
      <FilePreview file={new File(['x'], 'export', { type: 'text/plain' })} />,
    );
    const chip = container.querySelector('[aria-hidden="true"]');
    expect(chip?.querySelector('svg')).toBeTruthy();
    expect(container.textContent).not.toMatch(/FICHIER|FILE/);
  });

  it('renders no remove button unless the caller wants one', () => {
    const { rerender } = render(<FilePreview file={pdfFile()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <FilePreview file={pdfFile()} onRemove={() => {}} removeLabel="Retirer contrat" />,
    );
    expect(screen.getByRole('button', { name: 'Retirer contrat' })).toBeInTheDocument();
  });

  it('calls onRemove from the keyboard, like any real button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <FilePreview file={pdfFile()} onRemove={onRemove} removeLabel="Retirer contrat" />,
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('names the remove button with a verb and the file, never one or the other', () => {
    render(<FilePreview file={pdfFile()} onRemove={() => {}} />);
    /*
     * « Retirer » seul ne dit pas quel fichier ; le seul nom du fichier ne dit
     * pas ce que fait le bouton. Repli anglais, comme toute chaîne a11y du DS.
     */
    expect(
      screen.getByRole('button', { name: 'Remove contrat.pdf' }),
    ).toBeInTheDocument();
  });

  it('pairs an error with a glyph, not with colour alone', () => {
    const { container } = render(<FilePreview file={pdfFile()} error="Trop lourd" />);
    const message = screen.getByText('Trop lourd').parentElement;
    expect(message?.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('Trop lourd');
  });
});

describe('FilePreview object URLs', () => {
  const created: string[] = [];
  const revoked: string[] = [];

  /*
   * On pose les deux méthodes sur l'objet `URL` réel plutôt que de le
   * remplacer : jsdom ne les fournit pas, et un `URL` de substitution perdrait
   * le constructeur dont d'autres composants se servent.
   */
  const original: Record<string, unknown> = {};

  beforeEach(() => {
    created.length = 0;
    revoked.length = 0;
    const target = URL as unknown as Record<string, unknown>;
    original.createObjectURL = target.createObjectURL;
    original.revokeObjectURL = target.revokeObjectURL;
    target.createObjectURL = (file: File) => {
      const url = `blob:${file.name}`;
      created.push(url);
      return url;
    };
    target.revokeObjectURL = (url: string) => {
      revoked.push(url);
    };
  });

  afterEach(() => {
    // Nettoyer après React, sinon le démontage de RTL ne trouve plus le double.
    cleanup();
    const target = URL as unknown as Record<string, unknown>;
    target.createObjectURL = original.createObjectURL;
    target.revokeObjectURL = original.revokeObjectURL;
  });

  it('shows a thumbnail for an image, and it is decorative', () => {
    const { container } = render(<FilePreview file={imageFile()} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'blob:photo.png');
    // Le nom du fichier est juste à côté : la miniature ne le répète pas.
    // `alt=""` suffit : il mappe déjà l'image sur `presentation`.
    expect(img).toHaveAttribute('alt', '');
    expect(img).not.toHaveAttribute('aria-hidden');
  });

  it('revokes the object URL when it unmounts', () => {
    const { unmount } = render(<FilePreview file={imageFile()} />);
    expect(created).toEqual(['blob:photo.png']);
    expect(revoked).toEqual([]);

    unmount();
    /*
     * C'est la raison d'être du composant : un aperçu refait à la main dans
     * chaque page oubliait ce revoke, et le fichier restait en mémoire.
     */
    expect(revoked).toEqual(['blob:photo.png']);
  });

  it('revokes the previous URL when the file changes', () => {
    const { rerender } = render(<FilePreview file={imageFile('a.png')} />);
    rerender(<FilePreview file={imageFile('b.png')} />);
    expect(created).toEqual(['blob:a.png', 'blob:b.png']);
    expect(revoked).toEqual(['blob:a.png']);
  });

  it('creates no URL at all for a file that is not an image', () => {
    render(<FilePreview file={pdfFile()} />);
    expect(created).toEqual([]);
  });
});
