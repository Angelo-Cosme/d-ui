import { useId, type HTMLAttributes, type ReactNode } from 'react';

export const CALENDAR_EVENT_TYPES = [
  'lecture',
  'tutorial',
  'lab',
  'exam',
  'other',
] as const;
export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];
export type CalendarEventSize = 'sm' | 'md';

export type CalendarEventProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Intitulé de la séance. Nom accessible de l’`<article>`. */
  title: ReactNode;
  /** Cours ou matière (code, intitulé). */
  course?: ReactNode;
  /** Salle, amphi ou lien de visio. */
  location?: ReactNode;
  /**
   * Nature de la séance. Choisit la couleur (jeton `--d-ui-edu-event-<type>`).
   * `"lecture"` par défaut.
   */
  type?: CalendarEventType;
  /**
   * Libellé visible du type : c’est lui qui porte le sens, pas la couleur
   * (WCAG 1.4.1). Fallback anglais : `Lecture`, `Tutorial`, `Lab`, `Exam`, `Event`.
   */
  typeLabel?: string;
  /** Début, heure civile `HH:mm`. Rendue dans un `<time>`. */
  start?: string;
  /** Fin, heure civile `HH:mm`. Ignorée sans `start`. */
  end?: string;
  /** `"sm"` pour une colonne de semaine, `"md"` (défaut) pour une vue jour. */
  size?: CalendarEventSize;
};

const typeLabelFallback: Record<CalendarEventType, string> = {
  lecture: 'Lecture',
  tutorial: 'Tutorial',
  lab: 'Lab',
  exam: 'Exam',
  other: 'Event',
};

/**
 * Séance d’emploi du temps : intitulé, cours, lieu, horaire et type.
 *
 * Un élément d’affichage, pas un agenda : il ne se positionne pas sur une
 * grille horaire et ne gère ni glisser-déposer ni récurrence. L’app compose
 * `Calendar` (choix du jour) et une liste de `CalendarEvent` pour la vue jour
 * ou semaine.
 */
export function CalendarEvent({
  title,
  course,
  location,
  type = 'lecture',
  typeLabel,
  start,
  end,
  size = 'md',
  className,
  ...rest
}: CalendarEventProps) {
  const titleId = useId();
  const classes = ['d-ui-edu-event', `d-ui-edu-event--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <article {...rest} aria-labelledby={titleId} data-type={type} className={classes}>
      <p className="d-ui-edu-event__meta">
        {start ? (
          <span className="d-ui-edu-event__time">
            <time dateTime={start}>{start}</time>
            {end ? (
              <>
                {' – '}
                <time dateTime={end}>{end}</time>
              </>
            ) : null}
          </span>
        ) : null}
        <span className="d-ui-edu-event__type">
          <span className="d-ui-edu-event__dot" aria-hidden="true" />
          {typeLabel ?? typeLabelFallback[type]}
        </span>
      </p>
      <p id={titleId} className="d-ui-edu-event__title">
        {title}
      </p>
      {course ? <p className="d-ui-edu-event__detail">{course}</p> : null}
      {location ? <p className="d-ui-edu-event__detail">{location}</p> : null}
    </article>
  );
}
