import {
  FloatingFocusManager,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { VisuallyHidden } from '../../a11y/VisuallyHidden';
import { cx } from '../../lib/cx';
import { IconButton } from '../Button/IconButton';
import { overlayPortalProps, useInheritedTheme } from '../floating';

export type SidebarSize = 'sm' | 'md';

type SidebarSurface = {
  collapsed: boolean;
  size: SidebarSize;
};

const SidebarSurfaceContext = createContext<SidebarSurface | null>(null);

function useSidebarSurface(component: string): SidebarSurface {
  const context = useContext(SidebarSurfaceContext);
  if (!context) {
    throw new Error(`${component} must be used within Sidebar`);
  }
  return context;
}

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  /** Nom accessible du `nav`. Fallback anglais si omis. */
  label?: string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Affiche le bouton replier / déployer. */
  collapsible?: boolean;
  collapseLabel?: string;
  expandLabel?: string;
  size?: SidebarSize;
  /**
   * Panneau modal (petit écran). Escape et le fond ferment.
   * Pas un `Drawer` : overlay de navigation uniquement.
   */
  overlay?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
  children: ReactNode;
};

export type SidebarItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children'
> & {
  href?: string;
  icon?: ReactNode;
  /** Page courante : `aria-current="page"`. */
  current?: boolean;
  /** Nom si `children` n’est pas une chaîne (obligatoire en mode replié avec icône). */
  label?: string;
  children: ReactNode;
};

export type SidebarGroupProps = {
  label: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

const itemSizeClass: Record<SidebarSize, string> = {
  sm: 'min-h-8 px-2 text-sm',
  md: 'min-h-9 px-3 text-sm',
};

function itemName(children: ReactNode, label?: string): string {
  if (label) return label;
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  return '';
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={open ? 'rotate-90' : undefined}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Panel({
  label,
  id,
  collapsed,
  collapsible,
  collapseLabel,
  expandLabel,
  onToggleCollapsed,
  size,
  overlay,
  onClose,
  closeLabel,
  children,
  className,
  ...rest
}: {
  label: string;
  id?: string;
  collapsed: boolean;
  collapsible: boolean;
  collapseLabel: string;
  expandLabel: string;
  onToggleCollapsed: () => void;
  size: SidebarSize;
  overlay: boolean;
  onClose?: () => void;
  closeLabel: string;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  return (
    <nav
      {...rest}
      id={id}
      aria-label={label}
      className={cx(
        'flex h-full flex-col border-e border-border bg-bg text-fg',
        collapsed ? 'w-14' : 'w-56',
        className,
      )}
    >
      {collapsible || overlay ? (
        <div
          className={cx(
            'flex items-center border-b border-border-subtle p-1',
            collapsed || overlay ? 'justify-center' : 'justify-end',
          )}
        >
          {overlay ? (
            <IconButton
              size="sm"
              icon={<CloseGlyph />}
              aria-label={closeLabel}
              onClick={onClose}
            />
          ) : (
            <IconButton
              size="sm"
              icon={<Chevron open={!collapsed} />}
              aria-label={collapsed ? expandLabel : collapseLabel}
              onClick={onToggleCollapsed}
            />
          )}
        </div>
      ) : null}
      <SidebarSurfaceContext.Provider value={{ collapsed, size }}>
        <ul className="m-0 flex list-none flex-col gap-0.5 overflow-y-auto p-2">
          {children}
        </ul>
      </SidebarSurfaceContext.Provider>
    </nav>
  );
}

function CloseGlyph() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Navigation latérale d’une coquille d’application.
 * Les items sont fournis par l’app : pas de sitemap LMS figé.
 */
export function Sidebar({
  label = 'Navigation',
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsible = false,
  collapseLabel = 'Collapse sidebar',
  expandLabel = 'Expand sidebar',
  size = 'md',
  overlay = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeLabel = 'Close navigation',
  children,
  className,
  id: idProp,
  ...rest
}: SidebarProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const collapsedControlled = collapsedProp !== undefined;
  const openControlled = openProp !== undefined;
  const collapsed = collapsedProp ?? uncontrolledCollapsed;
  const open = overlay ? (openProp ?? uncontrolledOpen) : true;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!collapsedControlled) setUncontrolledCollapsed(next);
      onCollapsedChange?.(next);
    },
    [collapsedControlled, onCollapsedChange],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!openControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [openControlled, onOpenChange],
  );

  const [host, setHost] = useState<Element | null>(null);
  const theme = useInheritedTheme(host);
  const portal = overlayPortalProps(theme);
  const { refs, context } = useFloating({
    open: overlay ? open : false,
    onOpenChange: setOpen,
  });
  const dismiss = useDismiss(context, {
    enabled: overlay,
    outsidePress: false,
    ancestorScroll: false,
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const panel = (
    <Panel
      {...rest}
      id={id}
      label={label}
      collapsed={overlay ? false : collapsed}
      collapsible={collapsible && !overlay}
      collapseLabel={collapseLabel}
      expandLabel={expandLabel}
      onToggleCollapsed={() => setCollapsed(!collapsed)}
      size={size}
      overlay={overlay}
      onClose={() => setOpen(false)}
      closeLabel={closeLabel}
      className={className}
    >
      {children}
    </Panel>
  );

  if (!overlay) {
    return panel;
  }

  if (!open) {
    return <span ref={setHost} hidden />;
  }

  return (
    <>
      <span ref={setHost} hidden />
      <FloatingPortal>
        <FloatingFocusManager context={context} modal returnFocus initialFocus={0}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            {...portal}
            aria-label={label}
            className={cx(portal.className, 'fixed inset-0 z-50 outline-none')}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              data-testid="sidebar-backdrop"
              className="absolute inset-0 bg-fg/40"
              onClick={() => setOpen(false)}
            />
            <div className="relative h-full w-56 max-w-[85vw] shadow-lg">{panel}</div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    </>
  );
}

export function SidebarItem({
  href,
  icon,
  current = false,
  label,
  children,
  className,
  onClick,
  ...rest
}: SidebarItemProps) {
  const surface = useSidebarSurface('SidebarItem');
  const name = itemName(children, label);
  const iconOnly = surface.collapsed && Boolean(icon);
  const content = (
    <>
      {icon ? (
        <span className="inline-flex shrink-0 [&_svg]:block" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {iconOnly ? (
        <VisuallyHidden>{name || children}</VisuallyHidden>
      ) : (
        <span className="min-w-0 flex-1 text-start">{children}</span>
      )}
    </>
  );
  const itemClass = cx(
    'flex w-full items-center gap-2 rounded-sm font-sans font-medium text-fg no-underline',
    itemSizeClass[surface.size],
    iconOnly && 'justify-center px-0',
    'bg-transparent hover:bg-surface-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    current && 'bg-surface-muted',
    className,
  );

  return (
    <li className="m-0 p-0">
      {href ? (
        <a
          href={href}
          aria-current={current ? 'page' : undefined}
          aria-label={iconOnly && name ? name : undefined}
          className={itemClass}
          onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
        >
          {content}
        </a>
      ) : (
        <button
          {...rest}
          type="button"
          aria-current={current ? 'page' : undefined}
          aria-label={iconOnly && name ? name : undefined}
          className={itemClass}
          onClick={onClick}
        >
          {content}
        </button>
      )}
    </li>
  );
}

export function SidebarGroup({
  label,
  icon,
  defaultOpen = false,
  children,
}: SidebarGroupProps) {
  const surface = useSidebarSurface('SidebarGroup');
  const [open, setOpen] = useState(defaultOpen);
  const iconOnly = surface.collapsed && Boolean(icon);

  return (
    <li className="m-0 p-0">
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className={cx(
          'flex w-full items-center gap-2 rounded-sm font-sans font-medium text-fg',
          itemSizeClass[surface.size],
          iconOnly && 'justify-center px-0',
          'bg-transparent hover:bg-surface-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        )}
      >
        {icon ? (
          <span className="inline-flex shrink-0 [&_svg]:block" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {iconOnly ? null : (
          <>
            <span className="min-w-0 flex-1 text-start">{label}</span>
            <span className="inline-flex shrink-0 text-fg-muted">
              <Chevron open={open} />
            </span>
          </>
        )}
      </button>
      {open ? <ul className="m-0 list-none p-0 ps-2">{children}</ul> : null}
    </li>
  );
}
