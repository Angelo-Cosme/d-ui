import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { IconButton } from '../Button/IconButton';
import { formatFileSize } from '../../lib/formatFileSize';
import { Image } from '../Image/Image';
import { Text } from '../Text/Text';

export type FilePreviewLayout = 'row' | 'tile';

export type FilePreviewProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  file: File;
  /**
   * `row` : une ligne, la miniature à gauche. `tile` : une vignette carrée,
   * le nom dessous — c'est la forme d'une galerie.
   */
  layout?: FilePreviewLayout;
  /** Slot de progression, rendu sous le nom. */
  progress?: ReactNode;
  /** Sans `onRemove`, aucun bouton n'est rendu. */
  onRemove?: () => void;
  /**
   * Nom accessible du bouton de retrait. Il doit citer le fichier **et** dire
   * ce que fait le bouton. Sans lui, repli anglais `Remove <nom>` : un bouton
   * nommé du seul nom du fichier ne dit pas ce qu'il déclenche.
   */
  removeLabel?: string;
  /**
   * Motif du refus, s'il y en a un. Il s'accompagne d'un glyphe : l'état ne
   * tient pas qu'à la couleur du texte (1.4.1).
   */
  error?: ReactNode;
  disabled?: boolean;
  /**
   * Met le poids en mots. Défaut français (`o` / `Ko` / `Mo`), comme les autres
   * libellés de `FileUpload` — c'est le seul texte que le composant produit
   * lui-même, et une page anglaise doit pouvoir le remplacer (3.1.2).
   */
  formatSize?: (bytes: number) => string;
};

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Extension en majuscules, ou `null` si le nom n'en porte pas — la pastille
 * montre alors un glyphe. Pas de mot figé : le composant ne connaît pas la
 * langue de la page (`docs/component-conventions.md`).
 */
function extensionOf(name: string): string | null {
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return null;
  return name
    .slice(dot + 1)
    .toUpperCase()
    .slice(0, 4);
}

/**
 * Aperçu d'un fichier choisi : miniature s'il s'agit d'une image, sinon son
 * extension ; puis le nom, le poids, une progression et un retrait.
 *
 * La miniature vient d'une URL objet, **créée et révoquée ici**. C'est la
 * raison d'être du composant : chaque appelant qui refaisait cet aperçu à la
 * main oubliait le `revokeObjectURL`, et la page gardait le fichier en mémoire
 * jusqu'au rechargement.
 *
 * Le nom du fichier est le texte visible : la miniature est décorative, sinon
 * un lecteur d'écran lirait deux fois la même chose.
 */
export function FilePreview({
  file,
  layout = 'row',
  progress,
  onRemove,
  removeLabel,
  error,
  disabled = false,
  formatSize = formatFileSize,
  className,
  ...rest
}: FilePreviewProps) {
  const [src, setSrc] = useState<string | null>(null);
  const tile = layout === 'tile';

  useEffect(() => {
    /*
     * `createObjectURL` n'existe pas partout (jsdom, rendu serveur) : sans ce
     * garde, l'aperçu jetterait au lieu de retomber sur l'extension.
     */
    if (!isImage(file) || typeof URL.createObjectURL !== 'function') return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => {
      /*
       * Même garde au retour qu'à l'aller : le démontage peut arriver après
       * que l'environnement a repris ses billes (teardown de test, rendu
       * serveur), et un nettoyage qui jette masquerait la vraie erreur.
       */
      if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url);
      setSrc(null);
    };
  }, [file]);

  const extension = extensionOf(file.name);

  /*
   * Fond opaque, encre `text-fg` : en `bg-fg/10` sur `bg-surface-muted`, la
   * composition tombait à 4,26:1 en thème sombre, sous les 4,5:1 de 1.4.3.
   */
  const chip = (
    <span
      aria-hidden="true"
      className={cx(
        'text-fg flex shrink-0 items-center justify-center rounded-sm bg-surface-hover text-[0.625rem] font-medium',
        tile ? 'aspect-square w-full' : 'size-10',
      )}
    >
      {extension ?? <DocumentGlyph />}
    </span>
  );

  const thumb = src ? (
    <Image
      src={src}
      alt=""
      ratio="square"
      fit="cover"
      radius="sm"
      loading="eager"
      className={tile ? 'w-full' : 'size-10 shrink-0'}
      /*
       * Un format que le navigateur ne décode pas (HEIC, AVIF ancien) revient à
       * la pastille, pas au glyphe d'image cassée : le fichier est valide, seul
       * l'aperçu manque.
       */
      fallback={chip}
    />
  ) : (
    chip
  );

  return (
    <div
      {...rest}
      className={cx(
        'min-w-0 rounded-md bg-surface-muted',
        tile ? 'relative flex flex-col gap-1 p-2' : 'flex items-center gap-2 px-3 py-2',
        className,
      )}
    >
      {thumb}
      <div className="flex min-w-0 flex-1 flex-col">
        {/*
         * Le poids sort du texte tronqué. Dans la même coupe que le nom, il
         * disparaissait systématiquement en vignette — une centaine de pixels
         * de large — alors que c'est justement la forme où l'on vérifie qu'une
         * photo n'est pas trop lourde. La troncature reste visuelle : un
         * lecteur d'écran lit le nom entier (`docs/accessibility.md` §16).
         */}
        <div className={cx('flex min-w-0', tile ? 'flex-col' : 'items-baseline gap-1')}>
          <Text as="span" size="body-sm" truncate>
            {file.name}
          </Text>
          <Text as="span" size="body-sm" tone="muted" className="shrink-0">
            {tile ? formatSize(file.size) : `· ${formatSize(file.size)}`}
          </Text>
        </div>
        {error ? (
          <span className="text-danger flex items-center gap-1 text-xs">
            <WarningGlyph />
            {error}
          </span>
        ) : null}
        {progress}
      </div>
      {onRemove ? (
        /*
         * En vignette, le bouton passe sur la photo : sans fond opaque, son
         * glyphe tombait à 1:1 sur une image sombre (1.4.11). Le fond est porté
         * par ce `span` — une `className` sur `IconButton` perdait contre le
         * `bg-transparent` de la variante `ghost`, selon l'ordre de la feuille.
         */
        <span className={tile ? 'absolute end-1 top-1 rounded-full bg-bg' : 'contents'}>
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-label={removeLabel ?? `Remove ${file.name}`}
            icon={<RemoveGlyph />}
            onClick={onRemove}
          />
        </span>
      ) : null}
    </div>
  );
}

function DocumentGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-1/2 max-h-5 min-h-3.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 1.75H4.25v12.5h7.5V4.5z" />
      <path d="M9 1.75V4.5h2.75" />
    </svg>
  );
}

function RemoveGlyph() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 2.5L14.5 13.5h-13L8 2.5z" />
      <path d="M8 6.5v3M8 11.5v.01" />
    </svg>
  );
}
