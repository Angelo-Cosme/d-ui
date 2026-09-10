/**
 * Chevrons partagés.
 *
 * `Calendar` et `Pagination` en dessinaient chacun une copie identique, au
 * `viewBox` et au tracé près. Un seul dessin, décoratif dans les deux cas :
 * le nom accessible vient toujours du contrôle qui le porte.
 */
export function ChevronLeft() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 4L6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRight() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
