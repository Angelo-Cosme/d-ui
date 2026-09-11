import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Text } from '../Text/Text';
import { CloseGlyph, DefaultFeedbackIcon } from '../feedback/FeedbackIcons';
import {
  feedbackLiveRole,
  feedbackNotificationIconStyle,
  feedbackNotificationShellStyle,
  type FeedbackVariant,
} from '../feedback/feedbackSurface';

export type NotificationVariant = FeedbackVariant;

export type NotificationProps = HTMLAttributes<HTMLDivElement> & {
  variant?: NotificationVariant;
  icon?: ReactNode;
  /** Fallback anglais : `Dismiss notification`. */
  dismissLabel?: string;
  /** Libellé du bouton d’action (LumApps « Info with callback »). */
  actionLabel?: string;
  onActionClick?: () => void;
  /** Bouton fermer. Via `useToast`, un toast porteur d’action l’obtient d’office. */
  dismissible?: boolean;
  onDismiss?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

/**
 * Toast LumApps (coin inférieur droit). La file / auto-dismiss relève de Toast (DS-033).
 *
 * La politesse de l'annonce suit la variante, pas la surface : `feedbackLiveRole`
 * est la source unique, `Alert` s'en sert aussi (ADR 0002).
 */
export function Notification({
  variant = 'info',
  icon,
  dismissLabel = 'Dismiss notification',
  actionLabel,
  onActionClick,
  dismissible = false,
  onDismiss,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  className,
  style,
  children,
  ...rest
}: NotificationProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = openProp ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!controlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (!next) onDismiss?.();
  };

  if (!open) return null;

  const showAction = Boolean(actionLabel && onActionClick);

  return (
    <div
      {...rest}
      /*
       * La politesse suit la gravité, pas la surface — `Alert` le fait déjà avec
       * la même fonction. En `role="alert"` figé, « Enregistré. » coupait la
       * parole au lecteur d'écran, et le `aria-live="polite"` du conteneur de
       * `ToastProvider` ne servait à rien : une région live imbriquée gouverne
       * son propre contenu.
       */
      role={feedbackLiveRole(variant)}
      className={cx(
        'flex max-w-md min-h-[3.25rem] items-center overflow-hidden rounded text-start',
        className,
      )}
      style={{ ...feedbackNotificationShellStyle(), ...style }}
    >
      <span
        className="inline-flex size-[3.25rem] shrink-0 items-center justify-center"
        style={feedbackNotificationIconStyle(variant)}
        aria-hidden="true"
      >
        {icon ?? <DefaultFeedbackIcon variant={variant} />}
      </span>
      <div className="min-w-0 flex-1 px-4">
        <Text as="div" size="body-sm">
          {children}
        </Text>
      </div>
      {showAction ? (
        <div className="shrink-0 pe-2">
          <Button size="sm" variant="secondary" onClick={onActionClick}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
      {dismissible ? (
        <IconButton
          size="sm"
          variant="ghost"
          icon={<CloseGlyph />}
          aria-label={dismissLabel}
          onClick={() => setOpen(false)}
          className="me-1 shrink-0"
        />
      ) : null}
    </div>
  );
}
