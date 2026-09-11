import type { Meta, StoryObj } from '@storybook/react-vite';
import { filePreviewArgTypes } from '../../../.storybook/arg-types';
import { docsLocale, imageCopy } from '../../../.storybook/docs-locale';
import { componentSource } from '../../../.storybook/docs-source';
import { Progress } from '../Progress/Progress';
import { FilePreview } from './FilePreview';

const importFilePreview = "import { FilePreview } from 'd-ui';";

/*
 * Des `File` fabriqués sur place : la story ne dépend d'aucun fichier réel, et
 * la miniature vient d'une URL objet créée par le composant lui-même.
 */
function pngFile(name: string): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#7dd3fc"/><circle cx="42" cy="40" r="16" fill="#e0f2fe"/><path d="M0 120 L52 56 L92 120 Z" fill="#0284c7"/></svg>`;
  // Le type doit correspondre aux octets : un SVG annoncé `image/png` ne décode pas.
  return new File([svg], name, { type: 'image/svg+xml' });
}

function pdfFile(name: string): File {
  return new File([new Uint8Array(240_000)], name, { type: 'application/pdf' });
}

const meta = {
  title: 'Components/FilePreview',
  component: FilePreview,
  argTypes: filePreviewArgTypes,
  parameters: {
    controls: { include: ['layout'] },
  },
} satisfies Meta<typeof FilePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: { file: pdfFile('plan-de-cours.pdf') },
  parameters: componentSource(
    importFilePreview,
    `<FilePreview
    file={fichier}
    removeLabel={\`Retirer \${fichier.name}\`}
    onRemove={() => retirer(fichier)}
/>`,
  ),
  render: (args, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    const file = pdfFile(copy.fileName);
    return (
      <div className="w-96 p-6">
        <FilePreview
          {...args}
          file={file}
          removeLabel={copy.removeFile(file.name)}
          onRemove={() => undefined}
        />
      </div>
    );
  },
};

export const Tile: Story = {
  name: 'Vignette',
  args: { file: pngFile('amphi.png'), layout: 'tile' },
  parameters: componentSource(
    importFilePreview,
    `<FilePreview file={image} layout="tile" onRemove={() => retirer(image)} />`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="grid w-96 grid-cols-3 gap-2 p-6">
        {[1, 2, 3].map((n) => {
          const file = pngFile(`${n}-${copy.imageName}`);
          return (
            <FilePreview
              key={n}
              file={file}
              layout="tile"
              removeLabel={copy.removeFile(file.name)}
              onRemove={() => undefined}
            />
          );
        })}
      </div>
    );
  },
};

export const WithProgress: Story = {
  name: 'Progression',
  args: { file: pdfFile('plan-de-cours.pdf') },
  parameters: componentSource(
    importFilePreview,
    `<FilePreview
    file={fichier}
    progress={<Progress value={40} size="xs" label="Envoi du fichier" />}
/>`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    const file = pdfFile(copy.fileName);
    return (
      <div className="w-96 p-6">
        <FilePreview
          file={file}
          removeLabel={copy.removeFile(file.name)}
          onRemove={() => undefined}
          progress={<Progress value={40} size="xs" label={copy.sending} />}
        />
      </div>
    );
  },
};

export const Rejected: Story = {
  name: 'Fichier refusé',
  args: { file: pdfFile('plan-de-cours.pdf') },
  parameters: componentSource(
    importFilePreview,
    `<FilePreview file={fichier} error="Dépasse 2 Mo" onRemove={() => retirer(fichier)} />`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    const file = pdfFile(copy.fileName);
    return (
      <div className="w-96 p-6">
        {/* Le motif s'accompagne d'un glyphe : la couleur seule ne le porte pas. */}
        <FilePreview
          file={file}
          error={copy.tooHeavy}
          removeLabel={copy.removeFile(file.name)}
          onRemove={() => undefined}
        />
      </div>
    );
  },
};
