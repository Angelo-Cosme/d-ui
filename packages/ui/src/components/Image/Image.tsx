import {
  useCallback,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx';
import { cornerRadiusClass, type CornerRadius } from '../../lib/cornerRadius';

export type ImageFit = 'cover' | 'contain';
export type ImageRadius = CornerRadius | 'full';

/**
 * Rapport d'aspect. Les valeurs autres qu'`auto` réservent la place avant même
 * que le fichier arrive, ce qui évite que la page saute au chargement.
 *
 * `auto` laisse l'image dicter sa hauteur. Elle ne se connaît qu'une fois
 * chargée : la place n'est alors réservée que si `width` **et** `height` sont
 * donnés tous les deux, en nombres — ils partent sur l'`<img>` comme attributs
 * et le navigateur en déduit le rapport.
 */
export type ImageRatio = 'auto' | 'square' | 'video' | 'portrait' | 'wide';

const ratioClass: Record<Exclude<ImageRatio, 'auto'>, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
};

const fitClass: Record<ImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

const radiusClass: Record<ImageRadius, string> = {
  ...cornerRadiusClass,
  full: 'rounded-full',
};

/*
 * Les attributs qui parlent au fichier sont transmis à l'`<img>` ; tout le
 * reste habille le cadre. Sans cette séparation, un `srcSet` compilerait et
 * n'aurait aucun effet, ce qui est pire qu'une erreur de type.
 */
type ForwardedImgProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  | 'srcSet'
  | 'sizes'
  | 'crossOrigin'
  | 'referrerPolicy'
  | 'fetchPriority'
  | 'useMap'
  | 'onLoad'
  | 'onError'
>;

/*
 * `onLoad` / `onError` sortent du côté cadre : les deux moitiés les déclarent,
 * et l'intersection élargissait `currentTarget` à `HTMLSpanElement |
 * HTMLImageElement`. Lire `event.currentTarget.naturalWidth` ne compilait plus,
 * alors que les deux gestionnaires ne sont jamais posés que sur l'`<img>`.
 */
export type ImageProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'onLoad' | 'onError'
> &
  ForwardedImgProps & {
    src: string;
    /**
     * Texte alternatif. **Obligatoire**, et `""` est une valeur légitime : c'est
     * ainsi qu'on déclare une image décorative, que le lecteur d'écran doit
     * ignorer. Une image sans `alt` du tout est lue par son nom de fichier —
     * jamais ce qu'on veut (WCAG 1.1.1).
     */
    alt: string;
    ratio?: ImageRatio;
    fit?: ImageFit;
    radius?: ImageRadius;
    /**
     * Largeur du cadre. Nombre en pixels, ou chaîne CSS. En nombre, elle part
     * aussi sur l'`<img>` comme attribut : avec `height`, c'est ce qui réserve
     * la place en `ratio="auto"`.
     */
    width?: number | string;
    /** Hauteur du cadre. Ignorée si `ratio` la calcule déjà. Voir `width`. */
    height?: number | string;
    /**
     * Chargement paresseux par défaut : une galerie ne doit pas télécharger
     * trente fichiers avant le premier défilement. Passer `eager` pour une image
     * visible d'emblée (une bannière, un portrait en haut de page).
     */
    loading?: 'lazy' | 'eager';
    /**
     * Ce qui remplace l'image si le fichier ne charge pas.
     *
     * Sans repli, un `<img>` cassé affiche l'icône du navigateur **et** le texte
     * alternatif, ce qui ressemble à un bug. Le repli garde la place et le nom.
     */
    fallback?: ReactNode;
    /** Contenu affiché pendant le chargement. Défaut : un aplat neutre. */
    placeholder?: ReactNode;
    /** Classes du `<img>` lui-même. `className` habille le cadre. */
    imgClassName?: string;
    /**
     * Ce que le lecteur d'écran entend en plus du `alt` quand l'image a échoué.
     *
     * Sans lui, le repli s'annoncerait exactement comme une image qui a chargé :
     * un voyant verrait le glyphe cassé, personne d'autre. Fallback anglais,
     * comme toutes les chaînes a11y du design system.
     */
    fallbackLabel?: string;
  };

function length(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Image encadrée : rapport d'aspect réservé, cadrage, arrondi, et deux états
 * que tout appelant réécrit sinon — le chargement et l'échec.
 *
 * Le cadre est un `<span>` en `overflow-hidden` : c'est lui qui porte le
 * rapport et l'arrondi, l'`<img>` le remplit. Sans ce cadre, `aspect-*` et
 * `object-cover` sur l'`<img>` se contredisent dès que le fichier n'a pas le
 * ratio attendu.
 *
 * L'état d'échec ne rend jamais un `<img>` cassé : il rend `fallback`, et le
 * `alt` continue de porter le sens.
 */
export function Image({
  src,
  alt,
  ratio = 'auto',
  fit = 'cover',
  radius = 'md',
  width,
  height,
  loading = 'lazy',
  fallback,
  placeholder,
  className,
  imgClassName,
  style,
  fallbackLabel = '(image unavailable)',
  onError,
  onLoad,
  srcSet,
  sizes,
  crossOrigin,
  referrerPolicy,
  fetchPriority,
  useMap,
  ...rest
}: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  /*
   * Une nouvelle `src` repart de zéro, **pendant le rendu**. Dans un effet, la
   * remise à zéro arriverait après la peinture, et le repli d'un échec
   * précédent resterait une frame de trop.
   */
  const [seenSrc, setSeenSrc] = useState(src);
  if (seenSrc !== src) {
    setSeenSrc(src);
    setStatus('loading');
  }

  /*
   * L'état s'amorce sur le DOM, pas seulement sur l'événement. Une image déjà
   * décodée — cache mémoire, `data:` URI, hydratation après un rendu serveur —
   * a émis son `load` avant que React n'écoute : en attendant l'événement, elle
   * restait `opacity-0`, donc invisible pour toujours. `complete` dit la
   * vérité, lui, au moment où on attache la ref.
   */
  const attach = useCallback((node: HTMLImageElement | null) => {
    if (!node || !node.complete) return;
    setStatus(node.naturalWidth > 0 ? 'loaded' : 'failed');
  }, []);

  const frameStyle: CSSProperties = {
    width: length(width),
    height: ratio === 'auto' ? length(height) : undefined,
    ...style,
  };

  const decorative = alt === '';
  const failed = status === 'failed';

  return (
    <span
      {...rest}
      style={frameStyle}
      className={cx(
        'relative inline-block overflow-hidden',
        ratio === 'auto' ? null : ratioClass[ratio],
        radiusClass[radius],
        className,
      )}
    >
      {/*
        L'aplat d'attente est décoratif et sort de l'arbre dès que l'image est
        là. Il reste sous le repli, jamais au-dessus.
      */}
      {status === 'loading' ? (
        <span aria-hidden="true" className="absolute inset-0 block bg-fg/10">
          {placeholder}
        </span>
      ) : null}

      {failed ? (
        /*
         * Le repli porte le nom quand il y en a un : sans `role="img"` et sans
         * `aria-label`, une image cassée deviendrait silencieuse pour un
         * lecteur d'écran, alors qu'elle disait quelque chose.
         */
        <span
          role={decorative ? undefined : 'img'}
          /*
           * `role="img"` ne tire pas son nom de son contenu : un texte masqué
           * à l'intérieur ne serait jamais lu. Le nom passe donc par
           * `aria-label`, et l'état y est joint — sinon un échec s'annoncerait
           * exactement comme une image qui a chargé.
           */
          aria-label={decorative ? undefined : `${alt} ${fallbackLabel}`}
          aria-hidden={decorative ? true : undefined}
          className="text-fg-muted absolute inset-0 flex items-center justify-center bg-surface-muted"
        >
          {fallback ?? <BrokenGlyph />}
        </span>
      ) : (
        <img
          ref={attach}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          crossOrigin={crossOrigin}
          referrerPolicy={referrerPolicy}
          fetchPriority={fetchPriority}
          useMap={useMap}
          /*
           * Les dimensions intrinsèques, quand on les connaît. Le CSS du cadre
           * les recouvre aussitôt, mais le navigateur en tire un rapport
           * d'aspect dès l'analyse : en `ratio="auto"`, c'est la seule chose qui
           * réserve la hauteur avant l'arrivée du fichier.
           */
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
          /* `alt=""` suffit à sortir l'image de l'arbre : pas d'`aria-hidden`. */
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={(event) => {
            setStatus('loaded');
            onLoad?.(event);
          }}
          onError={(event) => {
            setStatus('failed');
            onError?.(event);
          }}
          className={cx(
            'block size-full',
            fitClass[fit],
            /* Invisible tant qu'elle charge, pour ne pas clignoter sur l'aplat. */
            status === 'loading' && 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </span>
  );
}

function BrokenGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-1/3 max-h-8 min-h-4"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15l4.5-4.5 4 4L15 11l6 5.5" />
    </svg>
  );
}
