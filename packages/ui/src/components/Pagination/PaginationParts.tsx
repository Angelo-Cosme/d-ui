import { createContext, useContext, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from '../../icons/Chevron';
import { cx } from '../../lib/cx';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { paginationItems } from './paginationItems';

export type PaginationSize = 'sm' | 'md' | 'lg';

type PaginationContextValue = {
  page: number;
  pageCount: number;
  siblingCount: number;
  previousLabel: string;
  nextLabel: string;
  pageLabel: (page: number, current: boolean) => string;
  disabled: boolean;
  size: PaginationSize;
  go: (page: number) => void;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

export function usePaginationContext(component: string): PaginationContextValue {
  const context = useContext(PaginationContext);

  if (!context) {
    throw new Error(`<${component}> doit être rendu à l’intérieur de <Pagination>.`);
  }

  return context;
}

export const PaginationProvider = PaginationContext.Provider;

export type PaginationStepProps = {
  /**
   * Affiche le libellé à côté du chevron.
   *
   * Sans lui, le contrôle est une `IconButton` — le nom accessible vient de
   * `previousLabel` / `nextLabel`, jamais du chevron, qui est décoratif.
   */
  showLabel?: boolean;
  className?: string;
};

/** Aller à la page précédente. Désactivé sur la première. */
export function PaginationPrevious({
  showLabel = false,
  className,
}: PaginationStepProps) {
  const { page, previousLabel, disabled, size, go } =
    usePaginationContext('PaginationPrevious');
  const atStart = page <= 1;

  if (showLabel) {
    return (
      <Button
        type="button"
        variant="secondary"
        size={size}
        icon={<ChevronLeft />}
        iconPosition="start"
        disabled={disabled || atStart}
        onClick={() => go(page - 1)}
        className={className}
      >
        {previousLabel}
      </Button>
    );
  }

  return (
    <IconButton
      variant="ghost"
      size={size}
      icon={<ChevronLeft />}
      aria-label={previousLabel}
      disabled={disabled || atStart}
      onClick={() => go(page - 1)}
      className={className}
    />
  );
}

/** Aller à la page suivante. Désactivé sur la dernière. */
export function PaginationNext({ showLabel = false, className }: PaginationStepProps) {
  const { page, pageCount, nextLabel, disabled, size, go } =
    usePaginationContext('PaginationNext');
  const atEnd = page >= pageCount || pageCount < 1;

  if (showLabel) {
    return (
      <Button
        type="button"
        variant="secondary"
        size={size}
        icon={<ChevronRight />}
        iconPosition="end"
        disabled={disabled || atEnd}
        onClick={() => go(page + 1)}
        className={className}
      >
        {nextLabel}
      </Button>
    );
  }

  return (
    <IconButton
      variant="ghost"
      size={size}
      icon={<ChevronRight />}
      aria-label={nextLabel}
      disabled={disabled || atEnd}
      onClick={() => go(page + 1)}
      className={className}
    />
  );
}

export type PaginationPagesProps = {
  className?: string;
};

/**
 * Les numéros de page, avec les points de suspension.
 *
 * Une `<ul>` : les pages forment une liste, et leur nombre est annoncé.
 * L'ellipse est `aria-hidden` — elle ne dit rien qu'un lecteur d'écran ne
 * déduise déjà de la numérotation.
 */
export function PaginationPages({ className }: PaginationPagesProps) {
  return (
    <ul className={cx('m-0 flex list-none flex-wrap items-center gap-1 p-0', className)}>
      <PaginationPageItems />
    </ul>
  );
}

/**
 * Les `<li>` de numéros, sans leur `<ul>`.
 *
 * Séparés pour que la disposition par défaut garde **une seule** `<ul>`
 * contenant aussi précédent et suivant — c'est le DOM que rendait la version
 * précédente, et un lecteur d'écran y annonce « liste, 7 éléments ».
 */
export function PaginationPageItems() {
  const { page, pageCount, siblingCount, pageLabel, disabled, size, go } =
    usePaginationContext('PaginationPageItems');
  const items = paginationItems(page, pageCount, siblingCount);

  return (
    <>
      {items.map((item) =>
        item.type === 'ellipsis' ? (
          <li key={item.id}>
            <span
              aria-hidden="true"
              className="text-fg/70 inline-flex min-w-8 items-center justify-center px-1"
            >
              …
            </span>
          </li>
        ) : (
          <li key={item.page}>
            <Button
              type="button"
              variant={item.page === page ? 'secondary' : 'ghost'}
              size={size}
              disabled={disabled}
              aria-label={pageLabel(item.page, item.page === page)}
              aria-current={item.page === page ? 'page' : undefined}
              onClick={() => go(item.page)}
            >
              {item.page}
            </Button>
          </li>
        ),
      )}
    </>
  );
}

export type PaginationStatusProps = {
  /** Texte de position : « 1 à 10 sur 97 ». À composer côté page. */
  children: ReactNode;
  className?: string;
};

/**
 * Texte de position dans le jeu de résultats.
 *
 * Le composant ne le fabrique pas : il faudrait connaître le nombre total
 * d'éléments, la taille de page et la langue. La page les a déjà.
 */
export function PaginationStatus({ children, className }: PaginationStatusProps) {
  return <p className={cx('text-fg-muted m-0 text-sm', className)}>{children}</p>;
}
