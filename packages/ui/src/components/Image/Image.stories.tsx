import type { Meta, StoryObj } from '@storybook/react-vite';
import { imageArgTypes } from '../../../.storybook/arg-types';
import { docsLocale, imageCopy } from '../../../.storybook/docs-locale';
import { componentSource } from '../../../.storybook/docs-source';
import { Text } from '../Text/Text';
import { Image } from './Image';

const importImage = "import { Image } from 'd-ui';";

/*
 * Les images sont des SVG en `data:` : les stories doivent rendre la même
 * chose hors ligne, dans la CI et dans le preview déployé. Une URL distante
 * ferait dépendre la documentation du réseau.
 */
function photo(label: string, w: number, h: number, hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="hsl(${hue} 45% 72%)"/>
    <circle cx="${w * 0.3}" cy="${h * 0.32}" r="${Math.min(w, h) * 0.12}" fill="hsl(${hue} 60% 88%)"/>
    <path d="M0 ${h} L${w * 0.4} ${h * 0.45} L${w * 0.68} ${h} Z" fill="hsl(${hue} 40% 55%)"/>
    <path d="M${w * 0.5} ${h} L${w * 0.82} ${h * 0.58} L${w} ${h} Z" fill="hsl(${hue} 38% 46%)"/>
    <text x="${w / 2}" y="${h - 10}" font-family="sans-serif" font-size="12" fill="hsl(${hue} 30% 20%)" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const LANDSCAPE = photo('16:9', 480, 270, 200);
const PORTRAIT = photo('3:4', 270, 360, 150);

const meta = {
  title: 'Components/Image',
  component: Image,
  argTypes: imageArgTypes,
  parameters: {
    controls: { include: ['ratio', 'fit', 'radius', 'loading'] },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: { src: LANDSCAPE, alt: '' },
  parameters: componentSource(
    importImage,
    `{/* width et height ensemble : la place est réservée, la page ne saute pas. */}
<Image src={photo} alt="Amphithéâtre pendant un cours" width={320} height={180} />`,
  ),
  render: (args, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="p-6">
        <Image {...args} src={LANDSCAPE} alt={copy.alt} width={320} height={180} />
      </div>
    );
  },
};

export const Thumbnail: Story = {
  name: 'Miniature',
  args: { src: LANDSCAPE, alt: '' },
  parameters: componentSource(
    importImage,
    `{/* La « miniature » du ticket : Image à une petite taille, pas un composant de plus. */}
<Image src={photo} alt="" ratio="square" width={40} radius="sm" />`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="flex items-center gap-3 p-6">
        {([32, 40, 64, 96] as const).map((size) => (
          <Image
            key={size}
            src={LANDSCAPE}
            alt={copy.alt}
            ratio="square"
            width={size}
            radius="sm"
          />
        ))}
        <Image src={LANDSCAPE} alt={copy.alt} ratio="square" width={64} radius="full" />
      </div>
    );
  },
};

export const Ratios: Story = {
  name: 'Rapports',
  args: { src: LANDSCAPE, alt: '' },
  parameters: componentSource(
    importImage,
    `<>
    <Image src={photo} alt="…" ratio="square" width={140} />
    <Image src={photo} alt="…" ratio="video" width={200} />
    <Image src={photo} alt="…" ratio="portrait" width={140} />
</>`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-wrap items-start gap-6 p-6">
        {(
          [
            ['square', copy.square, 140],
            ['video', copy.video, 220],
            ['portrait', copy.portrait, 140],
            ['wide', copy.wide, 260],
          ] as const
        ).map(([ratio, label, width]) => (
          <div key={ratio} className="flex flex-col gap-2">
            <Text size="body-sm" tone="muted">
              {label}
            </Text>
            <Image src={LANDSCAPE} alt={copy.alt} ratio={ratio} width={width} />
          </div>
        ))}
      </div>
    );
  },
};

export const Fit: Story = {
  name: 'Cadrage',
  args: { src: PORTRAIT, alt: '' },
  parameters: componentSource(
    importImage,
    `<>
    <Image src={portrait} alt="…" ratio="video" fit="cover" width={220} />
    <Image src={portrait} alt="…" ratio="video" fit="contain" width={220} />
</>`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-wrap items-start gap-6 p-6">
        {/* Un portrait dans un cadre paysage : `cover` rogne, `contain` laisse du vide. */}
        {(
          [
            ['cover', copy.cover],
            ['contain', copy.contain],
          ] as const
        ).map(([fit, label]) => (
          <div key={fit} className="flex flex-col gap-2">
            <Text size="body-sm" tone="muted">
              {label}
            </Text>
            <Image
              src={PORTRAIT}
              alt={copy.alt}
              ratio="video"
              fit={fit}
              width={220}
              className="bg-surface-muted"
            />
          </div>
        ))}
      </div>
    );
  },
};

export const Unavailable: Story = {
  name: 'Image indisponible',
  args: { src: '', alt: '' },
  parameters: componentSource(
    importImage,
    `<Image
    src={urlCassee}
    alt="Amphithéâtre pendant un cours"
    ratio="video"
    width={260}
    fallback={<Text size="body-sm">Image indisponible</Text>}
/>`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <div className="flex flex-wrap items-start gap-6 p-6">
        {/*
          Le repli garde la place réservée et le nom accessible : une image
          cassée reste une information, pas un trou dans la page.
        */}
        <Image
          src="/d-ui-image-introuvable.png"
          alt={copy.alt}
          ratio="video"
          width={260}
        />
        <Image
          src="/d-ui-image-introuvable.png"
          alt={copy.alt}
          ratio="video"
          width={260}
          fallback={<Text size="body-sm">{copy.broken}</Text>}
        />
      </div>
    );
  },
};

export const Decorative: Story = {
  name: 'Décorative',
  args: { src: LANDSCAPE, alt: '' },
  parameters: componentSource(
    importImage,
    `<figure>
    {/* La légende porte déjà le sens : l'image n'a rien à ajouter. */}
    <Image src={photo} alt="" ratio="video" width={280} />
    <figcaption>Rentrée 2026</figcaption>
</figure>`,
  ),
  render: (_, { globals }) => {
    const copy = imageCopy(docsLocale(globals.locale));
    return (
      <figure className="m-0 flex w-70 flex-col gap-2 p-6">
        <Image src={LANDSCAPE} alt="" ratio="video" />
        <figcaption>
          <Text size="body-sm" tone="muted">
            {copy.caption}
          </Text>
        </figcaption>
      </figure>
    );
  },
};
