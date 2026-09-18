import { createContext, useContext } from 'react';

import type { CornerRadius } from '../../lib/cornerRadius';
import { cornerRadiusClass } from '../../lib/cornerRadius';

/** Coins du panneau. Défaut LumApps : `lg`. */
export type DialogRadius = CornerRadius;

export const dialogRadiusClass = cornerRadiusClass;

export const dialogRadiusBottomClass: Record<DialogRadius, string> = {
  none: 'rounded-b-none',
  sm: 'rounded-b-sm',
  md: 'rounded-b-md',
  lg: 'rounded-b-lg',
  xl: 'rounded-b-xl',
};

export type DialogContextValue = {
  titleId: string;
  descriptionId: string;
  /** Vrai pour un `alertdialog` : sortie uniquement par une action explicite. */
  alert: boolean;
  radius: DialogRadius;
  showDismiss: boolean;
  dismissLabel: string;
  close: () => void;
  setHasTitle: (present: boolean) => void;
  setHasDescription: (present: boolean) => void;
  /**
   * Reçoit le premier contrôle des actions.
   *
   * Sur un `alertdialog`, c'est lui qui prend le focus à l'ouverture : la
   * première action est l'issue non destructive, et un `Entrée` réflexe ne doit
   * pas déclencher la suppression.
   */
  registerFirstAction: (element: HTMLElement | null) => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      `<${component}> doit être rendu à l’intérieur de <Dialog> ou <Drawer>.`,
    );
  }

  return context;
}
