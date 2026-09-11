import { FloatingPortal } from '@floating-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx';
import {
  overlayPortalProps,
  useInheritedTheme,
  usePrefersReducedMotion,
} from '../floating';
import { Notification } from '../Notification/Notification';
import type { FeedbackVariant } from '../feedback/feedbackSurface';
import {
  createToastQueueReducer,
  type ToastItem,
  type ToastQueueState,
} from './toastQueue';

export type ToastOptions = {
  id?: string;
  variant?: FeedbackVariant;
  message: ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  /** Milliseconds. Defaults to the provider value. `0` keeps the toast until dismissed. */
  duration?: number;
  dismissible?: boolean;
  /** Fallback anglais : `Dismiss notification`. */
  dismissLabel?: string;
};

export type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

export type ToastProviderProps = {
  children: ReactNode;
  /** Nombre maximal de toasts visibles en même temps. */
  maxVisible?: number;
  /** Durée par défaut avant auto-dismiss (ms). LumApps : ~6 s. */
  defaultDuration?: number;
  /** Affiche le bouton fermer par défaut sur chaque toast (`toast({ dismissible })` peut surcharger). */
  defaultDismissible?: boolean;
  /** Nom de la région live. Fallback anglais : `Notifications`. */
  label?: string;
  className?: string;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

function nextToastId(explicit?: string): string {
  if (explicit) return explicit;
  toastCounter += 1;
  return `d-ui-toast-${toastCounter}`;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({
  children,
  maxVisible = 3,
  defaultDuration = 6000,
  defaultDismissible = false,
  label = 'Notifications',
  className,
}: ToastProviderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const theme = useInheritedTheme(hostRef.current);
  const reducedMotion = usePrefersReducedMotion();
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const reducer = useMemo(() => createToastQueueReducer(maxVisible), [maxVisible]);
  const [{ active }, dispatch] = useReducer(reducer, {
    active: [],
    pending: [],
  } satisfies ToastQueueState);

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      dispatch({ type: 'dismiss', id });
    },
    [clearTimer],
  );

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    dispatch({ type: 'dismissAll' });
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = nextToastId(options.id);
      /*
       * Un toast qui porte une action ne s'efface pas tout seul. À six secondes,
       * « Voir les détails » avait disparu avant qu'un utilisateur au clavier ou
       * au lecteur d'écran ait pu l'atteindre : une fonction offerte par un
       * contrôle qui s'évapore (WCAG 2.2.1). L'appelant garde la main en passant
       * une `duration` explicite.
       */
      const hasAction = Boolean(options.actionLabel && options.onActionClick);
      const duration = options.duration ?? (hasAction ? 0 : defaultDuration);
      const item: ToastItem = {
        id,
        variant: options.variant ?? 'info',
        message: options.message,
        actionLabel: options.actionLabel,
        onActionClick: options.onActionClick,
        duration,
        /*
         * Sans auto-fermeture, la fermeture manuelle n'est plus optionnelle —
         * mais seulement pour les toasts que cette règle rend persistants. Un
         * `duration: 0` posé par l'appelant garde le comportement d'avant :
         * sinon la story « File d'attente » se retrouvait avec des boutons
         * « Dismiss notification » que personne n'avait demandés, nommés en
         * anglais sur une page française.
         */
        dismissible: options.dismissible ?? (hasAction || defaultDismissible),
        dismissLabel: options.dismissLabel ?? 'Dismiss notification',
      };
      dispatch({ type: 'enqueue', item });
      return id;
    },
    [defaultDuration, defaultDismissible],
  );

  useEffect(() => {
    active.forEach((item) => {
      if (item.duration <= 0 || timersRef.current.has(item.id)) return;
      const timer = setTimeout(() => dismiss(item.id), item.duration);
      timersRef.current.set(item.id, timer);
    });
  }, [active, dismiss]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  const value = useMemo(
    () => ({
      toast,
      dismiss,
      dismissAll,
    }),
    [toast, dismiss, dismissAll],
  );

  const portal = overlayPortalProps(theme);

  return (
    <ToastContext.Provider value={value}>
      <div ref={hostRef} className={cx('d-ui-root contents', className)}>
        {children}
      </div>
      <FloatingPortal>
        <div
          {...portal}
          /*
           * `role="region"` parce que `aria-label` seul, sur un `div` sans rôle,
           * est interdit : le nom n'était exposé nulle part et la prop `label`
           * ne servait à rien (axe, `aria-prohibited-attr`). Nommée, la zone
           * devient un repère que l'on peut atteindre pour retrouver un toast.
           */
          role="region"
          aria-label={label}
          aria-live="polite"
          aria-relevant="additions"
          className={cx(
            portal.className,
            'pointer-events-none fixed inset-4 z-[var(--d-ui-z-overlay)] flex flex-col items-end justify-end gap-3',
            reducedMotion
              ? ''
              : /*
                 * `[role]`, pas `[role=alert]` : depuis que la politesse suit la
                 * variante, un toast `info` ou `success` est un `role="status"`
                 * et perdait son fondu — mesuré à `transition-duration: 0s`.
                 */
                'motion-safe:[&_[role]]:transition-opacity motion-safe:[&_[role]]:duration-200',
          )}
        >
          {active.map((item) => (
            <div key={item.id} className="pointer-events-auto w-full max-w-md">
              <Notification
                variant={item.variant}
                actionLabel={item.actionLabel}
                onActionClick={
                  item.actionLabel && item.onActionClick
                    ? () => {
                        item.onActionClick?.();
                      }
                    : undefined
                }
                dismissible={item.dismissible}
                dismissLabel={item.dismissLabel}
                open
                onOpenChange={(open) => {
                  if (!open) dismiss(item.id);
                }}
              >
                {item.message}
              </Notification>
            </div>
          ))}
        </div>
      </FloatingPortal>
    </ToastContext.Provider>
  );
}
