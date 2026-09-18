import { Children, isValidElement, useMemo, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { IconButton } from '../Button/IconButton';
import { CloseGlyph } from '../feedback/FeedbackIcons';
import {
  DialogContext,
  dialogRadiusClass,
  type DialogContextValue,
} from './DialogContext';
import { DialogActions, DialogBody } from './DialogParts';

function partitionChildren(children: ReactNode) {
  const content: ReactNode[] = [];
  const actions: ReactNode[] = [];
  let hasBody = false;

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === DialogActions) {
      actions.push(child);
    } else {
      if (isValidElement(child) && child.type === DialogBody) hasBody = true;
      content.push(child);
    }
  }

  return { content, actions, hasBody };
}

export type DialogFrameProps = {
  value: DialogContextValue;
  /** Calque semi-opaque et spinner au-dessus du contenu (`Dialog` `processing`). */
  processing?: boolean;
  children: ReactNode;
};

/**
 * Intérieur commun à `Dialog` et `Drawer` : la colonne de contenu, le pied de
 * page (`DialogActions`), la croix de fermeture et le calque de traitement.
 *
 * Le panneau lui-même — position, taille, animation, rôle — reste à la charge
 * de chaque composant : c'est ce qui les distingue.
 */
export function DialogFrame({ value, processing = false, children }: DialogFrameProps) {
  const { content, actions, hasBody } = useMemo(
    () => partitionChildren(children),
    [children],
  );

  return (
    <DialogContext.Provider value={value}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={cx(
            'flex min-h-0 flex-1 flex-col px-6 pt-6',
            hasBody ? 'overflow-hidden' : 'overflow-y-auto',
            actions.length > 0 ? 'pb-0' : 'pb-6',
          )}
        >
          {content}
        </div>
        {actions}
      </div>
      {value.showDismiss ? (
        <IconButton
          type="button"
          size="sm"
          variant="ghost"
          icon={<CloseGlyph />}
          aria-label={value.dismissLabel}
          onClick={value.close}
          className="absolute end-4 top-4 z-10 shrink-0"
        />
      ) : null}
      {processing ? (
        <div
          className={cx(
            'bg-bg/70 absolute inset-0 grid place-items-center backdrop-blur-[1px]',
            dialogRadiusClass[value.radius],
          )}
          aria-hidden="true"
        >
          {/* Décoratif : le panneau porte déjà `aria-busy`. */}
          <span
            className="d-ui-spinner text-brand inline-block size-8 shrink-0 border-[3px]"
            aria-hidden="true"
          />
        </div>
      ) : null}
    </DialogContext.Provider>
  );
}
