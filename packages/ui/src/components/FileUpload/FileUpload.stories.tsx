import type { Meta, StoryObj } from '@storybook/react-vite';
import { fileUploadArgTypes } from '../../../.storybook/arg-types';
import { componentSource } from '../../../.storybook/docs-source';
import { docsLocale, fileUploadCopy } from '../../../.storybook/docs-locale';
import { useEffect, useState } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { FileUpload } from './FileUpload';

const importFileUpload = "import { FileUpload } from 'd-ui';";

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  argTypes: fileUploadArgTypes,
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  parameters: componentSource(
    importFileUpload,
    `<FileUpload
    label="Devoir"
    helper="PDF, jusqu’à 5 Mo."
    accept=".pdf,application/pdf"
    maxSize={5 * 1024 * 1024}
/>`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        helper={copy.helper}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        accept=".pdf,application/pdf"
        maxSize={5 * 1024 * 1024}
      />
    );
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  parameters: componentSource(
    importFileUpload,
    `<FileUpload size="sm" label="Devoir" />
<FileUpload size="md" label="Devoir" />
<FileUpload size="lg" label="Devoir" />`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-col gap-4">
        <FileUpload
          {...args}
          size="sm"
          label={`${copy.label} (${copy.small})`}
          dropLabel={copy.drop}
          browseLabel={copy.browse}
        />
        <FileUpload
          {...args}
          size="md"
          label={`${copy.label} (${copy.medium})`}
          dropLabel={copy.drop}
          browseLabel={copy.browse}
        />
        <FileUpload
          {...args}
          size="lg"
          label={`${copy.label} (${copy.large})`}
          dropLabel={copy.drop}
          browseLabel={copy.browse}
        />
      </div>
    );
  },
};

export const ClickOnly: Story = {
  name: 'Clic seul',
  parameters: componentSource(
    importFileUpload,
    '<FileUpload label="Devoir" dropzone={false} />',
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        dropzone={false}
        browseLabel={copy.browse}
      />
    );
  },
};

export const Multiple: Story = {
  name: 'Plusieurs fichiers',
  parameters: componentSource(importFileUpload, '<FileUpload label="Devoir" multiple />'),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        multiple
      />
    );
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  parameters: componentSource(importFileUpload, '<FileUpload label="Devoir" disabled />'),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        disabled
      />
    );
  },
};

export const Invalid: Story = {
  name: 'Invalide',
  parameters: componentSource(
    importFileUpload,
    '<FileUpload label="Devoir" invalid error="Ce champ est requis." />',
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        invalid
        error={copy.error}
      />
    );
  },
};

export const MaxSize: Story = {
  name: 'Accept et taille max',
  parameters: componentSource(
    importFileUpload,
    `<FileUpload
    label="Devoir"
    accept=".pdf,application/pdf"
    maxSize={5 * 1024 * 1024}
    helper="PDF, jusqu’à 5 Mo."
/>`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        helper={copy.helper}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        accept=".pdf,application/pdf"
        maxSize={5 * 1024 * 1024}
      />
    );
  },
};

export const Progress: Story = {
  name: 'Progression',
  parameters: componentSource(
    importFileUpload,
    `<FileUpload
    label="Devoir"
    progress={<p>Envoi : 40 %</p>}
/>`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.label}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        defaultFiles={[new File(['x'], 'devoir.pdf', { type: 'application/pdf' })]}
        progress={
          <Text as="span" size="body-sm" tone="muted">
            {copy.progress}
          </Text>
        }
      />
    );
  },
};

/* Une image factice, pour que la galerie rende la même chose hors ligne. */
function samplePhoto(name: string): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#a5b4fc"/><circle cx="56" cy="52" r="20" fill="#e0e7ff"/><path d="M0 160 L70 74 L124 160 Z" fill="#6366f1"/></svg>`;
  // Le type doit correspondre aux octets : un SVG annoncé `image/png` ne décode pas.
  return new File([svg], name, { type: 'image/svg+xml' });
}

export const ImageGallery: Story = {
  name: 'Galerie d’images',
  parameters: componentSource(
    importFileUpload,
    `<FileUpload
    label="Photos du cours"
    accept="image/*"
    multiple
    preview="grid"
    maxSize={2 * 1024 * 1024}
/>`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));
    return (
      <FileUpload
        {...args}
        label={copy.galleryLabel}
        helper={copy.galleryHelper}
        filesLabel={copy.galleryFiles}
        dropLabel={copy.drop}
        browseLabel={copy.browse}
        accept="image/*"
        multiple
        preview="grid"
        maxSize={2 * 1024 * 1024}
        defaultFiles={[samplePhoto('amphi.png'), samplePhoto('atelier.png')]}
      />
    );
  },
};

export const SinglePhoto: Story = {
  name: 'Photo unique',
  parameters: componentSource(
    importFileUpload,
    `{/* Un seul fichier, et c'est la page qui décide de l'aperçu : ici un Avatar. */}
<FileUpload
    label="Photo de profil"
    accept="image/*"
    dropzone={false}
    preview="none"
    files={photo ? [photo] : []}
    onFilesChange={(files) => setPhoto(files[0] ?? null)}
/>`,
  ),
  render: (args, { globals }) => {
    const copy = fileUploadCopy(docsLocale(globals.locale));

    const [photo, setPhoto] = useState<File | null>(null);

    const [src, setSrc] = useState<string | undefined>(undefined);

    /*
     * L'URL se crée dans un effet, et se révoque au retour. La fabriquer au
     * rendu en produirait une nouvelle à chaque passage, toutes retenues en
     * mémoire — c'est précisément ce que `FilePreview` évite quand on peut
     * s'en servir. Ici l'aperçu est un `Avatar`, donc la page s'en charge.
     */

    useEffect(() => {
      if (!photo) {
        setSrc(undefined);
        return;
      }
      const url = URL.createObjectURL(photo);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    }, [photo]);

    return (
      <div className="flex items-center gap-4">
        <Avatar src={src} name={copy.photoLabel} size="xxl" />
        <FileUpload
          {...args}
          label={copy.photoLabel}
          accept="image/*"
          dropzone={false}
          preview="none"
          browseLabel={copy.photoBrowse}
          files={photo ? [photo] : []}
          onFilesChange={(files) => setPhoto(files[0] ?? null)}
        />
        {photo ? (
          <Button variant="ghost" onClick={() => setPhoto(null)}>
            {copy.deletePhoto}
          </Button>
        ) : (
          <Text as="span" size="body-sm" tone="muted">
            {copy.noFile}
          </Text>
        )}
      </div>
    );
  },
};
