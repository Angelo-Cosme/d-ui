import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx';
import type { DialogSize } from '../Dialog/Dialog';
import type { DialogContextValue } from '../Dialog/DialogContext';
import { DialogFrame } from '../Dialog/DialogFrame';
import {
  overlayPortalProps,
  useInheritedTheme,
  usePrefersReducedMotion,
} from '../floating';

/** Bord de l'écran auquel le panneau s'attache. `left` / `right` : bord physique. */
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

/**
 * La même échelle que `Dialog` : tiny (400dp), regular (600dp), big (800dp),
 * huge (l'écran moins une marge). Une largeur pour `left` / `right`, une
 * hauteur pour `top` / `bottom`.
 */
export type DrawerSize = DialogSize;

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Bord d'ancrage. Défaut : `right`. */
  side?: DrawerSide;
  /** Taille du panneau sur l'axe perpendiculaire au bord. Sur petit écran, tout le bord. */
  size?: DrawerSize;
  /**
   * Croix de fermeture en haut à droite. Défaut : `true`.
   *
   * Un panneau latéral n'a souvent pas d'actions : la croix est sa sortie
   * visible à la souris et au toucher. `Escape` et le clic sur le fond restent
   * actifs dans tous les cas.
   */
  dismissible?: boolean;
  /** Nom accessible de la croix. */
  dismissLabel?: string;
  /** Élément qui prend le focus à l'ouverture. Par défaut, le premier focusable. */
  initialFocus?: MutableRefObject<HTMLElement | null>;
  /** `id` du panneau, pour `aria-controls` sur le déclencheur (`Navbar` `menuControls`). */
  id?: string;
  children: ReactNode;
  className?: string;
  /** Requis si aucun `DrawerTitle` n'est rendu. */
  'aria-label'?: string;
};

const sideClass: Record<DrawerSide, string> = {
  left: 'inset-y-0 left-0 w-full',
  right: 'inset-y-0 right-0 w-full',
  top: 'inset-x-0 top-0 h-full',
  bottom: 'inset-x-0 bottom-0 h-full',
};

/** Largeur d'un panneau latéral : l'échelle de `Dialog`. */
const widthClass: Record<DrawerSize, string> = {
  tiny: 'max-w-[400px]',
  regular: 'max-w-[600px]',
  big: 'max-w-[800px]',
  huge: 'max-w-[calc(100vw-4rem)]',
};

/** Hauteur d'un panneau haut ou bas : la même échelle, tournée d'un quart de tour. */
const heightClass: Record<DrawerSize, string> = {
  tiny: 'max-h-[400px]',
  regular: 'max-h-[600px]',
  big: 'max-h-[800px]',
  huge: 'max-h-[calc(100dvh-4rem)]',
};

const slideClass: Record<DrawerSide, string> = {
  left: 'd-ui-drawer-panel-left',
  right: 'd-ui-drawer-panel-right',
  top: 'd-ui-drawer-panel-top',
  bottom: 'd-ui-drawer-panel-bottom',
};

/** Un `Drawer` n'est jamais un `alertdialog` : la première action n'a rien de spécial. */
function ignoreFirstAction() {}

/**
 * `Dialog` posé sur un bord de l'écran : filtres, navigation mobile, fiche de
 * détail — tout ce qui se consulte sans quitter la page.
 *
 * Même mécanique que `Dialog` (`@floating-ui/react` : piège de focus, page
 * inerte, défilement bloqué, retour du focus) et même intérieur
 * (`DialogFrame`) : seuls la position, la taille et l'animation changent.
 *
 * L'empilement n'est pas supporté, ni le geste de balayage : la croix, le
 * fond et `Escape` ferment.
 */
export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  size = 'regular',
  dismissible = true,
  dismissLabel = 'Fermer',
  initialFocus,
  id,
  children,
  className,
  'aria-label': ariaLabel,
}: DrawerProps) {
  const baseId = useId();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const { refs, context } = useFloating({ open, onOpenChange });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const theme = useInheritedTheme(anchor);
  const portal = overlayPortalProps(theme);
  const reducedMotion = usePrefersReducedMotion();

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const value = useMemo<DialogContextValue>(
    () => ({
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      alert: false,
      radius: 'none',
      showDismiss: dismissible,
      dismissLabel,
      close,
      setHasTitle,
      setHasDescription,
      registerFirstAction: ignoreFirstAction,
    }),
    [baseId, dismissible, dismissLabel, close],
  );

  const horizontal = side === 'left' || side === 'right';

  return (
    <>
      <span ref={setAnchor} hidden aria-hidden="true" />
      {open ? (
        <FloatingPortal>
          {/*
           * `overflow: clip`, pas `auto` ni `hidden` : le panneau part hors
           * champ (translate 100 %) et le focus initial le ferait défiler
           * dans la vue — le fond suivrait la translation et le glissement
           * depuis la droite ou le bas deviendrait invisible. `clip` interdit
           * aussi le défilement programmatique ; le panneau défile lui-même.
           */}
          <FloatingOverlay
            lockScroll
            data-d-ui-theme={portal['data-d-ui-theme']}
            style={{ overflow: 'clip' }}
            className={cx(
              portal.className,
              'bg-black/70',
              reducedMotion ? null : 'd-ui-dialog-overlay',
            )}
          >
            <FloatingFocusManager
              context={context}
              modal
              returnFocus
              initialFocus={initialFocus}
            >
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                id={id ?? context.floatingId}
                data-side={side}
                aria-label={hasTitle ? undefined : ariaLabel}
                aria-labelledby={hasTitle ? value.titleId : undefined}
                aria-describedby={hasDescription ? value.descriptionId : undefined}
                className={cx(
                  'bg-bg text-fg absolute flex flex-col shadow-[0_8px_32px_rgb(0_0_0/0.2)] outline-none',
                  sideClass[side],
                  horizontal ? widthClass[size] : heightClass[size],
                  reducedMotion ? null : slideClass[side],
                  className,
                )}
              >
                <DialogFrame value={value}>{children}</DialogFrame>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      ) : null}
    </>
  );
}
