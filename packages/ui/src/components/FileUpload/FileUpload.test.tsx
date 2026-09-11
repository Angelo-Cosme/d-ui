import { createRef } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload as FileUploadFromEntry } from '../../index';
import { Field } from '../Field/Field';
import { FieldError } from '../Field/FieldError';
import { Label } from '../Field/Label';
import { FileUpload } from './FileUpload';

function pdf(name = 'devoir.pdf', size = 8): File {
  return new File(['x'.repeat(size)], name, { type: 'application/pdf' });
}

describe('FileUpload', () => {
  it('is exported from the package entrypoint', () => {
    expect(FileUploadFromEntry).toBe(FileUpload);
  });

  it('forwards a ref to the native file input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload label="Devoir" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'file');
  });

  it('names the hidden input from the built-in label', () => {
    render(<FileUpload label="Devoir" name="assignment" />);
    const input = screen.getByLabelText('Devoir');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('name', 'assignment');
    expect(input).toHaveClass('d-ui-visually-hidden');
    expect(input).toHaveAttribute('tabindex', '-1');
  });

  it('lists selected files and lets the keyboard user remove them', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(<FileUpload label="Devoir" dropzone={false} onFilesChange={onFilesChange} />);
    const input = screen.getByLabelText('Devoir');
    await user.upload(input, pdf());
    expect(onFilesChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'devoir.pdf' }),
    ]);
    expect(screen.getByText('devoir.pdf', { exact: false })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retirer devoir.pdf' }));
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
    expect(
      screen.queryByRole('list', { name: 'Fichiers sélectionnés' }),
    ).not.toBeInTheDocument();
  });

  it('rejects a file that exceeds maxSize with a clear error', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(
      <FileUpload label="Devoir" dropzone={false} maxSize={4} onReject={onReject} />,
    );
    await user.upload(screen.getByLabelText('Devoir'), pdf('gros.pdf', 20));
    expect(onReject).toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('gros.pdf dépasse');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('rejects a file outside accept', () => {
    const onReject = vi.fn();
    render(
      <FileUpload label="Devoir" accept=".pdf,application/pdf" onReject={onReject} />,
    );
    fireEvent.drop(screen.getByText(/Glissez les fichiers/).closest('div')!, {
      dataTransfer: {
        files: [new File(['x'], 'photo.png', { type: 'image/png' })],
      },
    });
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'type' })]);
    expect(screen.getByRole('alert')).toHaveTextContent('n’est pas un type accepté');
  });

  it('does not open or change files when disabled', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileUpload
        label="Devoir"
        dropzone={false}
        disabled
        onFilesChange={onFilesChange}
      />,
    );
    expect(screen.getByLabelText('Devoir')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choisir un fichier' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Choisir un fichier' }));
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('marks the control invalid without relying on colour alone', () => {
    render(<FileUpload label="Devoir" invalid error="Requis" dropzone={false} />);
    expect(screen.getByLabelText('Devoir')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Requis');
  });

  it('accepts a drop on the optional dropzone', () => {
    const onFilesChange = vi.fn();
    render(<FileUpload label="Devoir" dropzone onFilesChange={onFilesChange} />);
    const zone = screen.getByText(/Glissez les fichiers/).closest('div');
    expect(zone).toBeTruthy();
    fireEvent.drop(zone!, {
      dataTransfer: { files: [pdf('drop.pdf')] },
    });
    expect(onFilesChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'drop.pdf' }),
    ]);
  });

  it('appends files when multiple is set', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileUpload
        label="Devoir"
        dropzone={false}
        multiple
        onFilesChange={onFilesChange}
      />,
    );
    const input = screen.getByLabelText('Devoir');
    await user.upload(input, pdf('un.pdf'));
    await user.upload(input, pdf('deux.pdf'));
    expect(onFilesChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: 'un.pdf' }),
      expect.objectContaining({ name: 'deux.pdf' }),
    ]);
    expect(
      screen.getByRole('button', { name: 'Choisir des fichiers' }),
    ).toBeInTheDocument();
  });

  it('composes with Field for id, disabled and invalid', () => {
    render(
      <Field invalid disabled>
        <Label>Pièce jointe</Label>
        <FileUpload dropzone={false} />
        <FieldError>Requis</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText('Pièce jointe');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByRole('alert')).toHaveTextContent('Requis');
  });

  it('delegates each row to FilePreview, keeping one named list', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Pièces jointes" multiple filesLabel="Fichiers choisis" />);
    await user.upload(screen.getByLabelText('Pièces jointes'), [
      new File(['a'], 'contrat.pdf', { type: 'application/pdf' }),
      new File(['b'], 'plan.png', { type: 'image/png' }),
    ]);

    /*
     * La forme change, la sémantique non : une `<ul>` nommée, un `<li>` par
     * fichier — c'est ce qui fait annoncer « liste, 2 éléments ».
     */
    const list = screen.getByRole('list', { name: 'Fichiers choisis' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    // L'extension remplace la miniature quand le fichier n'est pas une image.
    expect(within(list).getByText('PDF')).toBeInTheDocument();
  });

  it('lets a page render its own preview with preview="none"', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Pièces jointes" preview="none" />);
    await user.upload(
      screen.getByLabelText('Pièces jointes'),
      new File(['a'], 'contrat.pdf', { type: 'application/pdf' }),
    );
    // Le fichier est bien pris, seule la liste disparaît.
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText(/contrat\.pdf/)).not.toBeInTheDocument();
  });

  it('keeps the same list semantics in grid form', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload label="Photos" multiple preview="grid" filesLabel="Photos choisies" />,
    );
    await user.upload(screen.getByLabelText('Photos'), [
      new File(['a'], 'un.png', { type: 'image/png' }),
      new File(['b'], 'deux.png', { type: 'image/png' }),
    ]);
    const list = screen.getByRole('list', { name: 'Photos choisies' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('clears itself when the parent form is reset', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <FileUpload label="Devoir" />
        <button type="reset">Réinitialiser</button>
      </form>,
    );
    const input = screen.getByLabelText('Devoir') as HTMLInputElement;
    await user.upload(input, new File(['a'], 'devoir.pdf', { type: 'application/pdf' }));
    expect(screen.getByText(/devoir\.pdf/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    /*
     * Le `reset` vide l'input natif ; sans écoute, la liste continuait
     * d'afficher un fichier que le formulaire ne portait plus.
     */
    expect(input.value).toBe('');
    await waitFor(() =>
      expect(screen.queryByText(/devoir\.pdf/)).not.toBeInTheDocument(),
    );
  });

  it('leaves the list alone when the form cancels its own reset', async () => {
    const user = userEvent.setup();
    render(
      <form
        onReset={(event) => {
          event.preventDefault();
        }}
      >
        <FileUpload label="Devoir" />
        <button type="reset">Réinitialiser</button>
      </form>,
    );
    const input = screen.getByLabelText('Devoir') as HTMLInputElement;
    await user.upload(input, new File(['a'], 'devoir.pdf', { type: 'application/pdf' }));

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    /*
     * Un formulaire qui demande confirmation annule le `reset` : l'input natif
     * garde son fichier. Vider la liste quand même désynchronisait exactement
     * ce que l'écoute est censée tenir aligné.
     */
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByText(/devoir\.pdf/)).toBeInTheDocument();
  });

  it('tells a controlled owner about the reset instead of acting alone', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <form>
        <FileUpload
          label="Devoir"
          files={[new File(['a'], 'devoir.pdf', { type: 'application/pdf' })]}
          onFilesChange={onFilesChange}
        />
        <button type="reset">Réinitialiser</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    // En mode contrôlé, c'est au propriétaire de décider : on le prévient.
    await waitFor(() => expect(onFilesChange).toHaveBeenCalledWith([]));
    expect(screen.getByText(/devoir\.pdf/)).toBeInTheDocument();
  });

  it('adds a file once, however many times it is picked', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Photos" dropzone={false} multiple filesLabel="Choisies" />);
    const input = screen.getByLabelText('Photos') as HTMLInputElement;
    // Le même fichier du disque : mêmes nom, poids et date, donc même identité.
    const same = new File(['a'], 'amphi.png', { type: 'image/png' });

    await user.upload(input, same);
    await user.upload(input, same);
    /*
     * Deux lignes portaient la même clé React — la console le disait — et deux
     * boutons « Retirer amphi.png » se retrouvaient côte à côte, impossibles à
     * distinguer à l'oreille.
     */
    const list = screen.getByRole('list', { name: 'Choisies' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
  });
});
