/**
 * Les pièces d'un `Drawer` sont celles de `Dialog`, sous le nom du panneau
 * qui les accueille : mêmes composants, mêmes propriétés, même enregistrement
 * automatique de `aria-labelledby` / `aria-describedby`, même contrat sur
 * l'ordre des actions.
 */
export {
  DialogActions as DrawerActions,
  DialogBody as DrawerBody,
  DialogDescription as DrawerDescription,
  DialogHeader as DrawerHeader,
  DialogTitle as DrawerTitle,
} from '../Dialog/DialogParts';
export type {
  DialogActionsAlign as DrawerActionsAlign,
  DialogActionsProps as DrawerActionsProps,
  DialogBodyProps as DrawerBodyProps,
  DialogDescriptionProps as DrawerDescriptionProps,
  DialogHeaderProps as DrawerHeaderProps,
  DialogTitleProps as DrawerTitleProps,
} from '../Dialog/DialogParts';
