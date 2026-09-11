import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Image as ImageFromEntry } from '../../index';
import { Image } from './Image';

const SRC = 'https://example.test/photo.jpg';

describe('Image', () => {
  it('is exported from the package entrypoint', () => {
    expect(ImageFromEntry).toBe(Image);
  });

  it('renders a real img named by its alt', () => {
    render(<Image src={SRC} alt="Vue de la salle" />);
    const img = screen.getByRole('img', { name: 'Vue de la salle' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', SRC);
  });

  it('treats an empty alt as decorative, not as a missing name', () => {
    // `alt=""` suffit : il mappe déjà l'image sur `presentation`.
    render(<Image src={SRC} alt="" data-testid="frame" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const img = screen.getByTestId('frame').querySelector('img');
    expect(img).toHaveAttribute('alt', '');
    expect(img).not.toHaveAttribute('aria-hidden');
  });

  it('swaps a broken image for a fallback that keeps the name', () => {
    render(<Image src={SRC} alt="Vue de la salle" />);
    fireEvent.error(screen.getByRole('img', { name: 'Vue de la salle' }));

    /*
     * Un `<img>` cassé affiche l'icône du navigateur et le texte alternatif :
     * ça ressemble à un bug. Le repli garde la place et le nom accessible.
     */
    const fallback = screen.getByRole('img', {
      name: 'Vue de la salle (image unavailable)',
    });
    expect(fallback.tagName).not.toBe('IMG');
    expect(document.querySelector('img')).toBeNull();
  });

  it('says out loud that the image failed, not just to the eye', () => {
    // Sans état annoncé, le repli s'entend comme un chargement réussi.
    render(<Image src={SRC} alt="Photo de Marie" />);
    fireEvent.error(screen.getByRole('img', { name: 'Photo de Marie' }));
    expect(
      screen.getByRole('img', { name: 'Photo de Marie (image unavailable)' }),
    ).toBeInTheDocument();
  });

  it('shows a file that the browser had already decoded', () => {
    /*
     * Cache mémoire, `data:` URI, hydratation après un rendu serveur : le
     * `load` est parti avant que React n'écoute. En l'attendant, l'image
     * restait masquée pour toujours.
     */
    const complete = { configurable: true, get: () => true };
    const natural = { configurable: true, get: () => 480 };
    Object.defineProperty(HTMLImageElement.prototype, 'complete', complete);
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', natural);
    try {
      render(<Image src={SRC} alt="Photo" />);
      expect(screen.getByRole('img', { name: 'Photo' }).className).not.toContain(
        'opacity-0',
      );
    } finally {
      delete (HTMLImageElement.prototype as unknown as Record<string, unknown>).complete;
      delete (HTMLImageElement.prototype as unknown as Record<string, unknown>)
        .naturalWidth;
    }
  });

  it('forwards the attributes that belong to the file, not to the frame', () => {
    render(
      <Image
        src={SRC}
        alt="Photo"
        srcSet={`${SRC} 2x`}
        sizes="(max-width: 40rem) 100vw"
      />,
    );
    // `srcSet` sur le cadre compilerait et ne ferait rien : pire qu'une erreur.
    const img = screen.getByRole('img', { name: 'Photo' });
    expect(img).toHaveAttribute('srcset', `${SRC} 2x`);
    expect(img).toHaveAttribute('sizes', '(max-width: 40rem) 100vw');
  });

  it('keeps a decorative image silent even when it fails', () => {
    render(<Image src={SRC} alt="" data-testid="frame" />);
    fireEvent.error(screen.getByTestId('frame').querySelector('img') as HTMLImageElement);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the caller fallback instead of the default glyph', () => {
    render(<Image src={SRC} alt="Photo" fallback={<span>Indisponible</span>} />);
    fireEvent.error(screen.getByRole('img', { name: 'Photo' }));
    expect(screen.getByText('Indisponible')).toBeInTheDocument();
    // Le repli reste nommé, état compris, même quand il porte son propre texte.
    expect(
      screen.getByRole('img', { name: 'Photo (image unavailable)' }),
    ).toBeInTheDocument();
  });

  it('retries a new src instead of staying on the previous failure', () => {
    const { rerender } = render(<Image src={SRC} alt="Photo" />);
    fireEvent.error(screen.getByRole('img', { name: 'Photo' }));
    expect(document.querySelector('img')).toBeNull();

    rerender(<Image src="https://example.test/autre.jpg" alt="Photo" />);
    // Sans remise à zéro, une image parfaitement valide resterait masquée.
    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.test/autre.jpg',
    );
  });

  it('reserves the space before the file arrives', () => {
    render(<Image src={SRC} alt="Photo" ratio="video" data-testid="frame" />);
    // Le cadre porte le rapport : la page ne saute pas quand l'image atterrit.
    expect(screen.getByTestId('frame').className).toContain('aspect-video');
  });

  it('loads lazily unless the caller says otherwise', () => {
    const { rerender } = render(<Image src={SRC} alt="Photo" />);
    expect(screen.getByRole('img', { name: 'Photo' })).toHaveAttribute('loading', 'lazy');
    rerender(<Image src={SRC} alt="Photo" loading="eager" />);
    expect(screen.getByRole('img', { name: 'Photo' })).toHaveAttribute(
      'loading',
      'eager',
    );
  });

  it('still calls the caller onLoad and onError', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const { rerender } = render(
      <Image src={SRC} alt="Photo" onLoad={onLoad} onError={onError} />,
    );
    fireEvent.load(screen.getByRole('img', { name: 'Photo' }));
    expect(onLoad).toHaveBeenCalledTimes(1);

    rerender(<Image src="https://example.test/b.jpg" alt="Photo" onError={onError} />);
    fireEvent.error(screen.getByRole('img', { name: 'Photo' }));
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
