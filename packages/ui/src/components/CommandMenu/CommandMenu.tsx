import {
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { cx } from '../../lib/cx';
import { useIsomorphicLayoutEffect } from '../../lib/useIsomorphicLayoutEffect';
import { Dialog } from '../Dialog/Dialog';
import { List, ListItem } from '../List/List';
import { nextEnabledIndex } from '../Select/selectOptions';
import { scrollOptionIntoView } from '../Select/useSelectOverlay';
import { Skeleton } from '../Skeleton/Skeleton';
import { SearchIcon } from '../textControl';
import { TextInput } from '../TextInput/TextInput';
import {
  defaultCommandMenuFilter,
  filterCommandMenuEntries,
  flattenCommandMenuEntries,
  isCommandMenuGroup,
  type CommandMenuEntry,
  type CommandMenuFilter,
  type CommandMenuItem,
} from './commandMenuItems';

export type CommandMenuProps = {
  open: boolean;
  /** Reçoit `false` sur Escape, clic extérieur, ou après `onSelect`. */
  onOpenChange: (open: boolean) => void;
  /** Commandes, ou groupes `{ label, items }`. `value` doit être unique. */
  items: readonly CommandMenuEntry[];
  /** La commande choisie, au clic ou à Entrée. Le composant demande ensuite la fermeture. */
  onSelect: (item: CommandMenuItem) => void;
  /** Nom accessible du dialogue, du champ et de la liste. Défaut : `"Commandes"`. */
  label?: string;
  /** Texte de substitution du champ. Ne remplace pas `label`. */
  placeholder?: string;
  /** Aucun résultat. Chaîne, nœud, ou `(query) => …`. */
  emptyMessage?: ReactNode | ((query: string) => ReactNode);
  /** Lignes `Skeleton` à la place des commandes, `aria-busy` sur la liste. */
  loading?: boolean;
  /** Annoncé pendant le chargement. Défaut : `"Chargement"`. */
  loadingMessage?: string;
  /** Remplace le filtre par défaut (sous-chaîne, sans casse ni accents). */
  filter?: CommandMenuFilter;
  /** Chaque frappe, avec la saisie brute. Point d'entrée d'une recherche distante. */
  onQueryChange?: (query: string) => void;
  /** Classes du panneau du `Dialog`. */
  className?: string;
};

/**
 * Palette de commandes : un `Dialog` qui s'ouvre sur un champ de recherche et
 * une liste de commandes filtrée à la frappe.
 *
 * Le composant n'exécute rien : il remonte la commande par `onSelect` et
 * demande la fermeture. Le registre des commandes, le raccourci ⌘K et la
 * navigation restent dans l'application — aucun routeur, aucun gestionnaire
 * global de raccourcis dans le package.
 *
 * Le champ garde le focus (`aria-activedescendant`) : on tape et on se déplace
 * sans quitter la saisie. La liste se réinitialise à chaque ouverture parce que
 * `Dialog` démonte son contenu quand il est fermé — pas d'état à remettre à zéro.
 */
export function CommandMenu({
  open,
  onOpenChange,
  label = 'Commandes',
  className,
  ...panel
}: CommandMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      aria-label={label}
      initialFocus={inputRef}
      /*
       * La grille de l'overlay centre le panneau ; `self-start` le remonte,
       * comme toute palette : l'œil part du champ, et la liste grandit vers le bas
       * sans déplacer ce champ.
       */
      className={cx('self-start sm:mt-[10vh]', className)}
    >
      <CommandMenuPanel
        {...panel}
        label={label}
        inputRef={inputRef}
        close={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

type CommandMenuPanelProps = Omit<
  CommandMenuProps,
  'open' | 'onOpenChange' | 'className' | 'label'
> & {
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  close: () => void;
};

/** Index actif borné à la liste visible ; retombe sur la première commande active. */
function resolveActiveIndex(items: readonly CommandMenuItem[], index: number): number {
  if (index >= 0 && index < items.length && !items[index]?.disabled) return index;
  return nextEnabledIndex(items, -1, 1);
}

function CommandMenuPanel({
  items,
  onSelect,
  label,
  placeholder = 'Rechercher une commande',
  emptyMessage = 'Aucun résultat',
  loading = false,
  loadingMessage = 'Chargement',
  filter = defaultCommandMenuFilter,
  onQueryChange,
  inputRef,
  close,
}: CommandMenuPanelProps) {
  const listId = `${useId()}-list`;
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const visible = useMemo(
    () => filterCommandMenuEntries(items, query, filter),
    [items, query, filter],
  );
  const flat = useMemo(() => flattenCommandMenuEntries(visible), [visible]);
  const active = loading ? -1 : resolveActiveIndex(flat, activeIndex);
  const showEmpty = !loading && flat.length === 0;
  const optionId = (index: number) => `${listId}-opt-${index}`;

  useIsomorphicLayoutEffect(() => {
    scrollOptionIntoView(listId, active);
  }, [listId, active]);

  function choose(item: CommandMenuItem) {
    if (item.disabled) return;
    onSelect(item);
    close();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveIndex(0);
    onQueryChange?.(event.target.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (active < 0) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(flat, active, 1));
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(flat, active, -1));
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(flat, -1, 1));
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(nextEnabledIndex(flat, flat.length, -1));
        return;
      case 'Enter': {
        /* Entrée valide d'abord la composition (IME) ; ce n'est pas un choix. */
        if (event.nativeEvent.isComposing) return;
        event.preventDefault();
        const item = flat[active];
        if (item) choose(item);
        return;
      }
      default:
        return;
    }
  }

  /*
   * `cursor` numérote les commandes dans l'ordre visible, groupes compris :
   * c'est cet index que portent `aria-activedescendant` et le défilement.
   */
  let cursor = -1;
  const renderItem = (item: CommandMenuItem) => {
    cursor += 1;
    const index = cursor;
    const isActive = index === active;
    return (
      <ListItem
        key={item.value}
        id={optionId(index)}
        role="option"
        aria-selected={isActive}
        aria-disabled={item.disabled || undefined}
        data-active={isActive ? '' : undefined}
        disabled={item.disabled}
        leading={item.icon}
        description={item.description}
        trailing={
          item.shortcut ? (
            <kbd className="text-fg-muted font-sans text-xs">{item.shortcut}</kbd>
          ) : undefined
        }
        className={cx(
          'rounded-md',
          !item.disabled && 'cursor-pointer',
          isActive && !item.disabled && 'bg-surface-hover',
        )}
        onMouseMove={() => {
          if (!item.disabled) setActiveIndex(index);
        }}
        /* Le champ garde le focus : le clic ne doit pas le lui prendre. */
        onPointerDown={(event) => event.preventDefault()}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => choose(item)}
      >
        {item.label}
      </ListItem>
    );
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <TextInput
        ref={inputRef}
        icon={<SearchIcon />}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-label={label}
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        spellCheck={false}
      />
      <List
        id={listId}
        role="listbox"
        size="sm"
        aria-label={label}
        aria-busy={loading || undefined}
        className="max-h-80 overflow-y-auto"
      >
        {loading
          ? null
          : visible.map((entry, groupIndex) => {
              if (!isCommandMenuGroup(entry)) return renderItem(entry);
              const headingId = `${listId}-group-${groupIndex}`;
              return (
                <li key={headingId} role="presentation" className="mt-2 first:mt-0">
                  <div
                    id={headingId}
                    className="text-fg-muted px-3 pt-2 pb-1 text-xs font-medium"
                  >
                    {entry.label}
                  </div>
                  <List role="group" size="sm" aria-labelledby={headingId}>
                    {entry.items.map(renderItem)}
                  </List>
                </li>
              );
            })}
      </List>
      {loading ? <CommandMenuSkeleton /> : null}
      {/*
       * Une seule région live, toujours montée : un `role="status"` inséré en
       * même temps que son texte n'est pas annoncé de façon fiable. Elle porte
       * le message de chargement (masqué : les squelettes sont déjà à l'écran)
       * ou l'état vide (visible : rien d'autre ne l'affiche).
       */}
      <div
        role="status"
        className={
          showEmpty
            ? 'text-fg-muted px-3 py-8 text-center text-sm'
            : 'd-ui-visually-hidden'
        }
      >
        {loading
          ? loadingMessage
          : showEmpty
            ? typeof emptyMessage === 'function'
              ? emptyMessage(query)
              : emptyMessage
            : null}
      </div>
    </div>
  );
}

const SKELETON_WIDTHS = ['72%', '56%', '64%', '48%'];

/** Quatre lignes à la silhouette d'une commande : icône ronde, puis libellé. */
function CommandMenuSkeleton() {
  return (
    <div aria-hidden="true">
      {SKELETON_WIDTHS.map((width) => (
        <div key={width} className="flex min-h-10 items-center gap-2 px-3 py-2">
          <Skeleton shape="circle" size={16} />
          <Skeleton shape="text" width={width} />
        </div>
      ))}
    </div>
  );
}
