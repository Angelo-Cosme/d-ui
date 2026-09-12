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
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx';
import {
  overlayPortalProps,
  useInheritedTheme,
  usePrefersReducedMotion,
} from '../floating';
import {
  dialogRadiusClass,
  type DialogContextValue,
  type DialogRadius,
} from './DialogContext';
import { DialogFrame } from './DialogFrame';

/** Tailles LumApps : tiny (400dp), regular (600dp), big (800dp), huge (plein écran). */
export type DialogSize = 'tiny' | 'regular' | 'big' | 'huge';

export type { DialogRadius } from './DialogContext';

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Largeur maximale. Toutes les tailles retombent pleine largeur sur petit écran. */
  size?: DialogSize;
  /**
   * Rôle `alertdialog` : décision destructive ou irréversible.
   *
   * Le clic sur l'arrière-plan et la croix de fermeture sont retirés — on ne
   * sort que par une action explicite. `Escape` reste actif : WCAG 2.1.2
   * interdit de piéger le clavier.
   */
  alert?: boolean;
  /** Croix de fermeture en haut à droite. Ignorée si `alert`. */
  dismissible?: boolean;
  /** Nom accessible de la croix. */
  dismissLabel?: string;
  /**
   * État de traitement : calque semi-opaque et spinner au-dessus du panneau.
   *
   * Les interactions sont bloquées tant que la soumission est en cours
   * (LumApps `isLoading`).
   */
  processing?: boolean;
  /** Bordure `border-border` autour du panneau. Défaut : sans bordure (LumApps). */
  bordered?: boolean;
  /** Arrondi des coins du panneau. Défaut : `lg`. */
  radius?: DialogRadius;
  /** Élément qui prend le focus à l'ouverture. Par défaut, le premier focusable. */
  initialFocus?: MutableRefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  /** Requis si aucun `DialogTitle` n'est rendu. */
  'aria-label'?: string;
};

const sizeClass: Record<DialogSize, string> = {
  tiny: 'sm:max-w-[400px]',
  regular: 'sm:max-w-[600px]',
  big: 'sm:max-w-[800px]',
  huge: 'sm:max-h-[calc(100dvh-2rem)] sm:min-h-[calc(100dvh-2rem)] sm:max-w-[calc(100vw-2rem)] sm:min-w-[calc(100vw-2rem)]',
};

/**
 * Overlay modal : `Dialog` et, avec `alert`, `alertdialog`.
 *
 * Le piège de focus, la restitution du focus, le verrouillage du défilement et
 * l'inertie du reste de la page viennent de `@floating-ui/react`, déjà utilisé
 * par `Popover` et `Menu` — les overlays du design system partagent la même
 * mécanique plutôt que chacun la sienne. L'intérieur du panneau
 * (`DialogFrame`) est partagé avec `Drawer`.
 *
 * L'empilement n'est pas supporté : un `Dialog` n'en ouvre pas un second.
 */
export function Dialog({
  open,
  onOpenChange,
  size = 'regular',
  alert = false,
  dismissible = false,
  dismissLabel = 'Fermer',
  processing = false,
  bordered = false,
  radius = 'lg',
  initialFocus,
  children,
  className,
  'aria-label': ariaLabel,
}: DialogProps) {
  const baseId = useId();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const firstActionRef = useRef<HTMLElement | null>(null);

  const { refs, context } = useFloating({ open, onOpenChange });

  /*
   * `alert` retire le clic extérieur, pas `Escape` : un dialogue dont on ne
   * peut pas sortir au clavier serait un piège (WCAG 2.1.2).
   */
  const dismiss = useDismiss(context, {
    outsidePress: !alert && !processing,
    escapeKey: !processing,
  });
  const role = useRole(context, { role: alert ? 'alertdialog' : 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const theme = useInheritedTheme(anchor);
  const portal = overlayPortalProps(theme);
  const reducedMotion = usePrefersReducedMotion();

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const registerFirstAction = useCallback((element: HTMLElement | null) => {
    firstActionRef.current = element;
  }, []);
  const showDismiss = dismissible && !alert && !processing;

  const value = useMemo<DialogContextValue>(
    () => ({
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      alert,
      radius,
      showDismiss,
      dismissLabel,
      close,
      setHasTitle,
      setHasDescription,
      registerFirstAction,
    }),
    [baseId, alert, radius, showDismiss, dismissLabel, close, registerFirstAction],
  );

  /*
   * Sur un `alertdialog`, le focus va sur la première action — l'issue non
   * destructive — plutôt que sur le premier focusable du dialogue.
   */
  const resolvedInitialFocus = initialFocus ?? (alert ? firstActionRef : undefined);

  return (
    <>
      <span ref={setAnchor} hidden aria-hidden="true" />
      {open ? (
        <FloatingPortal>
          <FloatingOverlay
            lockScroll
            data-d-ui-theme={portal['data-d-ui-theme']}
            className={cx(
              portal.className,
              'grid place-items-center overflow-y-auto p-4',
              'bg-black/70',
              reducedMotion ? null : 'd-ui-dialog-overlay',
            )}
          >
            <FloatingFocusManager
              context={context}
              modal
              returnFocus
              initialFocus={resolvedInitialFocus}
            >
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                aria-label={hasTitle ? undefined : ariaLabel}
                aria-labelledby={hasTitle ? value.titleId : undefined}
                aria-describedby={hasDescription ? value.descriptionId : undefined}
                aria-busy={processing || undefined}
                className={cx(
                  'bg-bg text-fg relative flex w-full flex-col shadow-[0_8px_32px_rgb(0_0_0/0.2)]',
                  'max-h-[calc(100dvh-2rem)] outline-none',
                  dialogRadiusClass[radius],
                  bordered ? 'border border-border' : null,
                  sizeClass[size],
                  reducedMotion ? null : 'd-ui-dialog-panel',
                  className,
                )}
              >
                <DialogFrame value={value} processing={processing}>
                  {children}
                </DialogFrame>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      ) : null}
    </>
  );
}
