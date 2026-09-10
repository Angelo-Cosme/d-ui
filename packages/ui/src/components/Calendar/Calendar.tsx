import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { VisuallyHidden } from '../../a11y/VisuallyHidden';
import { IconButton } from '../Button/IconButton';
import { ChevronLeft, ChevronRight } from '../../icons/Chevron';
import { cx } from '../../lib/cx';
import {
  addDays,
  addMonths,
  addYears,
  calendarDateToIso,
  daysInMonth,
  endOfWeek,
  formatDayLabel,
  formatMonthName,
  formatMonthYear,
  isCalendarDateEqual,
  isCalendarDateUnavailable,
  isCalendarRangeValue,
  isDateInRange,
  monthGrid,
  orderedRange,
  startOfMonth,
  startOfWeek,
  todayCalendarDate,
  weekStartFromLocale,
  weekdayLabels,
  yearOptions,
  type CalendarDate,
  type CalendarRangeValue,
  type CalendarWeekday,
} from './calendarDate';

export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarSelectionMode = 'single' | 'range';
export type { CalendarRangeValue };

export type CalendarProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> & {
  /** `'single'` (défaut) ou `'range'` (début + fin). */
  selectionMode?: CalendarSelectionMode;
  /** Date ou plage sélectionnée (contrôlé). `null` = aucune. */
  value?: CalendarDate | CalendarRangeValue | null;
  /** Date ou plage au montage (non contrôlé). */
  defaultValue?: CalendarDate | CalendarRangeValue | null;
  /** Appelé lorsqu’un jour disponible est choisi (date ou plage). */
  onValueChange?: (value: CalendarDate | CalendarRangeValue) => void;
  /** Premier mois affiché (contrôlé). Le jour est ignoré. */
  month?: CalendarDate;
  /** Premier mois affiché au montage. */
  defaultMonth?: CalendarDate;
  /** Appelé lorsque l’utilisateur change de mois. */
  onMonthChange?: (month: CalendarDate) => void;
  /**
   * « Aujourd’hui » (pastille). Défaut : date civile locale.
   * Passez-le dans les tests et les stories pour un rendu stable.
   */
  today?: CalendarDate;
  /** Première date sélectionnable (incluse). */
  minValue?: CalendarDate;
  /** Dernière date sélectionnable (incluse). */
  maxValue?: CalendarDate;
  /** Dates individuelles non sélectionnables (week-ends, jours fériés, …). */
  isDateUnavailable?: (date: CalendarDate) => boolean;
  /**
   * Premier jour de la semaine (0 = dimanche). Défaut : `weekStartFromLocale(locale)`.
   */
  weekStartsOn?: CalendarWeekday;
  /** Locale BCP 47 pour les libellés. Pose aussi `lang`. Défaut : `fr`. */
  locale?: string;
  /** Nombre de mois côte à côte (1–3). Défaut : 1, ou 2 si `selectionMode="range"`. */
  numberOfMonths?: number;
  /** `"sm"` si l’espace est contraint. `"md"` par défaut. `"lg"` pour les vues aérées. */
  size?: CalendarSize;
  /** Désactive la grille et la navigation. */
  disabled?: boolean;
  /** Nom accessible du bouton mois précédent. Défaut : « Mois précédent ». */
  previousMonthLabel?: string;
  /** Nom accessible du bouton mois suivant. Défaut : « Mois suivant ». */
  nextMonthLabel?: string;
  /** Nom accessible du sélecteur de mois. Défaut : « Mois ». */
  monthSelectLabel?: string;
  /** Nom accessible du sélecteur d’année. Défaut : « Année ». */
  yearSelectLabel?: string;
  /** Nom du champ masqué `YYYY-MM-DD` (date unique, ou début de plage). */
  name?: string;
  /** Nom du champ masqué de fin de plage (`selectionMode="range"`). */
  nameEnd?: string;
};

const sizeClass: Record<CalendarSize, { day: string; weekday: string; title: string }> = {
  sm: { day: 'h-8 w-8 text-sm', weekday: 'h-8 w-8 text-xs', title: 'text-sm' },
  md: { day: 'h-10 w-10 text-base', weekday: 'h-10 w-10 text-sm', title: 'text-base' },
  lg: { day: 'h-12 w-12 text-lg', weekday: 'h-12 w-12 text-base', title: 'text-lg' },
};

function clampMonthCount(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(3, Math.max(1, Math.trunc(value)));
}

function defaultNavLabels(locale?: string): {
  prev: string;
  next: string;
  month: string;
  year: string;
} {
  const tag = (locale ?? 'fr').toLowerCase();
  if (tag === 'en' || tag.startsWith('en-')) {
    return { prev: 'Previous month', next: 'Next month', month: 'Month', year: 'Year' };
  }
  return { prev: 'Mois précédent', next: 'Mois suivant', month: 'Mois', year: 'Année' };
}

function dateKey(date: CalendarDate): string {
  return calendarDateToIso(date);
}

function compareMonth(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

function initialSingle(
  raw: CalendarDate | CalendarRangeValue | null | undefined,
): CalendarDate | null {
  if (!raw) return null;
  if (isCalendarRangeValue(raw)) return raw.start;
  return raw;
}

function initialRange(
  raw: CalendarDate | CalendarRangeValue | null | undefined,
): CalendarRangeValue {
  if (isCalendarRangeValue(raw)) return raw;
  if (raw) return { start: raw, end: null };
  return { start: null, end: null };
}

function clampDay(date: CalendarDate): CalendarDate {
  return {
    year: date.year,
    month: date.month,
    day: Math.min(date.day, daysInMonth(date.year, date.month)),
  };
}

function selectClass(title: string, extra?: string) {
  return cx(
    'cursor-pointer rounded-md border-0 bg-transparent px-1 font-medium capitalize text-fg',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
    'disabled:cursor-not-allowed disabled:opacity-50',
    title,
    extra,
  );
}

export function Calendar({
  selectionMode = 'single',
  value,
  defaultValue = null,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  today: todayProp,
  minValue,
  maxValue,
  isDateUnavailable,
  weekStartsOn: weekStartsOnProp,
  locale = 'fr',
  numberOfMonths,
  size = 'md',
  disabled = false,
  previousMonthLabel,
  nextMonthLabel,
  monthSelectLabel,
  yearSelectLabel,
  name,
  nameEnd,
  className,
  lang,
  ...rest
}: CalendarProps) {
  const today = todayProp ?? todayCalendarDate();
  const weekStartsOn = weekStartsOnProp ?? weekStartFromLocale(locale);
  const rangeMode = selectionMode === 'range';
  const monthCount = clampMonthCount(numberOfMonths ?? (rangeMode ? 2 : 1));
  const labels = defaultNavLabels(locale);
  const prevLabel = previousMonthLabel ?? labels.prev;
  const nextLabel = nextMonthLabel ?? labels.next;
  const monthLabel = monthSelectLabel ?? labels.month;
  const yearLabel = yearSelectLabel ?? labels.year;
  const sizes = sizeClass[size];
  const headingId = useId();

  const isValueControlled = value !== undefined;
  const [uncontrolledSingle, setUncontrolledSingle] = useState<CalendarDate | null>(() =>
    initialSingle(defaultValue),
  );
  const [uncontrolledRange, setUncontrolledRange] = useState<CalendarRangeValue>(() =>
    initialRange(defaultValue),
  );
  const selected = isValueControlled ? initialSingle(value) : uncontrolledSingle;
  const range = isValueControlled ? initialRange(value) : uncontrolledRange;
  const rangeStart = rangeMode ? range.start : selected;
  const rangeEnd = rangeMode ? range.end : null;

  const isMonthControlled = month !== undefined;
  const [uncontrolledMonth, setUncontrolledMonth] = useState(() =>
    startOfMonth(defaultMonth ?? rangeStart ?? selected ?? today),
  );
  const displayedMonth = startOfMonth(isMonthControlled ? month : uncontrolledMonth);

  const [focusedDate, setFocusedDate] = useState(() => rangeStart ?? selected ?? today);
  const pendingFocus = useRef(false);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());

  const months = Array.from({ length: monthCount }, (_, index) =>
    addMonths(displayedMonth, index),
  );
  const years = yearOptions(displayedMonth.year, minValue, maxValue);
  const prevMonth = addMonths(displayedMonth, -1);
  const nextMonth = addMonths(displayedMonth, 1);
  const prevDisabled =
    disabled || Boolean(minValue && compareMonth(prevMonth, startOfMonth(minValue)) < 0);
  const nextDisabled =
    disabled ||
    Boolean(
      maxValue &&
      compareMonth(nextMonth, startOfMonth(addMonths(maxValue, 1 - monthCount))) > 0,
    );

  function setDisplayedMonth(next: CalendarDate) {
    const start = startOfMonth(next);
    if (!isMonthControlled) setUncontrolledMonth(start);
    onMonthChange?.(start);
  }

  function emitSingle(next: CalendarDate) {
    if (!isValueControlled) setUncontrolledSingle(next);
    onValueChange?.(next);
  }

  function emitRange(next: CalendarRangeValue) {
    if (!isValueControlled) setUncontrolledRange(next);
    onValueChange?.(next);
  }

  function selectDate(next: CalendarDate) {
    if (disabled || isDayUnavailable(next)) return;
    setFocusedDate(next);
    if (rangeMode) {
      const current = range;
      const complete = current.start && !current.end;
      emitRange(
        complete && current.start
          ? orderedRange(current.start, next)
          : { start: next, end: null },
      );
    } else {
      emitSingle(next);
    }
    if (next.year !== displayedMonth.year || next.month < displayedMonth.month) {
      setDisplayedMonth(next);
    } else if (compareMonth(next, addMonths(displayedMonth, monthCount - 1)) > 0) {
      setDisplayedMonth(addMonths(next, 1 - monthCount));
    }
  }

  function isDayUnavailable(date: CalendarDate): boolean {
    return isCalendarDateUnavailable(date, {
      minValue,
      maxValue,
      isDateUnavailable,
    });
  }

  function moveFocus(next: CalendarDate) {
    setFocusedDate(next);
    const lastVisible = addMonths(displayedMonth, monthCount - 1);
    if (compareMonth(next, displayedMonth) < 0) setDisplayedMonth(next);
    else if (compareMonth(next, lastVisible) > 0) {
      setDisplayedMonth(addMonths(next, 1 - monthCount));
    }
    pendingFocus.current = true;
  }

  function goToMonth(next: CalendarDate) {
    setDisplayedMonth(next);
    setFocusedDate(clampDay({ ...focusedDate, year: next.year, month: next.month }));
  }

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    dayRefs.current.get(dateKey(focusedDate))?.focus();
  }, [focusedDate, displayedMonth, monthCount]);

  function onGridKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    if (disabled) return;
    const key = event.key;
    let next: CalendarDate | undefined;
    if (key === 'ArrowLeft') next = addDays(focusedDate, -1);
    else if (key === 'ArrowRight') next = addDays(focusedDate, 1);
    else if (key === 'ArrowUp') next = addDays(focusedDate, -7);
    else if (key === 'ArrowDown') next = addDays(focusedDate, 7);
    else if (key === 'Home') next = startOfWeek(focusedDate, weekStartsOn);
    else if (key === 'End') next = endOfWeek(focusedDate, weekStartsOn);
    else if (key === 'PageUp') {
      next = event.shiftKey ? addYears(focusedDate, -1) : addMonths(focusedDate, -1);
    } else if (key === 'PageDown') {
      next = event.shiftKey ? addYears(focusedDate, 1) : addMonths(focusedDate, 1);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      selectDate(focusedDate);
      return;
    }
    if (!next) return;
    event.preventDefault();
    moveFocus(next);
  }

  const heading =
    monthCount === 1
      ? formatMonthYear(displayedMonth, locale)
      : `${formatMonthYear(displayedMonth, locale)} – ${formatMonthYear(months[months.length - 1]!, locale)}`;

  const startIso = rangeMode
    ? range.start
      ? calendarDateToIso(range.start)
      : ''
    : selected
      ? calendarDateToIso(selected)
      : '';
  const endIso = range.end ? calendarDateToIso(range.end) : '';

  return (
    <div
      {...rest}
      lang={lang ?? locale}
      className={cx(
        'inline-flex flex-col gap-3 font-sans text-fg',
        disabled && 'opacity-60',
        className,
      )}
    >
      {name ? <input type="hidden" name={name} value={startIso} /> : null}
      {rangeMode && nameEnd ? (
        <input type="hidden" name={nameEnd} value={endIso} />
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <IconButton
          variant="ghost"
          size={size}
          icon={<ChevronLeft />}
          aria-label={prevLabel}
          disabled={prevDisabled}
          onClick={() => goToMonth(prevMonth)}
        />
        <h2 id={headingId} className="d-ui-visually-hidden">
          {heading}
        </h2>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          <select
            aria-label={monthLabel}
            disabled={disabled}
            value={displayedMonth.month}
            className={selectClass(sizes.title, 'max-w-[9.5rem]')}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              goToMonth({
                year: displayedMonth.year,
                month: Number(event.target.value),
                day: 1,
              });
            }}
          >
            {Array.from({ length: 12 }, (_, index) => {
              const monthNumber = index + 1;
              const optionDate = {
                year: displayedMonth.year,
                month: monthNumber,
                day: 1,
              };
              const tooEarly = Boolean(
                minValue && compareMonth(optionDate, startOfMonth(minValue)) < 0,
              );
              const tooLate = Boolean(
                maxValue && compareMonth(optionDate, startOfMonth(maxValue)) > 0,
              );
              return (
                <option
                  key={monthNumber}
                  value={monthNumber}
                  disabled={tooEarly || tooLate}
                >
                  {formatMonthName(monthNumber, locale)}
                </option>
              );
            })}
          </select>
          <select
            aria-label={yearLabel}
            disabled={disabled}
            value={displayedMonth.year}
            className={selectClass(sizes.title)}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              goToMonth({
                year: Number(event.target.value),
                month: displayedMonth.month,
                day: 1,
              });
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <IconButton
          variant="ghost"
          size={size}
          icon={<ChevronRight />}
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={() => goToMonth(nextMonth)}
        />
      </div>
      <div className="flex flex-wrap gap-8">
        {months.map((visibleMonth) => {
          const weeks = monthGrid(visibleMonth, weekStartsOn);
          const headers = weekdayLabels(locale, weekStartsOn);
          const label = formatMonthYear(visibleMonth, locale);
          return (
            <table
              key={calendarDateToIso(startOfMonth(visibleMonth))}
              role="grid"
              aria-labelledby={monthCount === 1 ? headingId : undefined}
              aria-label={monthCount === 1 ? undefined : label}
              aria-disabled={disabled || undefined}
              aria-multiselectable={rangeMode || undefined}
              className="border-collapse"
              onKeyDown={onGridKeyDown}
            >
              <thead>
                <tr>
                  {headers.map((weekday) => (
                    <th
                      key={weekday.long}
                      scope="col"
                      className={cx('p-0 font-medium text-fg/70', sizes.weekday)}
                    >
                      <span aria-hidden="true">{weekday.short}</span>
                      <VisuallyHidden>{weekday.long}</VisuallyHidden>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week) => (
                  <tr key={dateKey(week[0]!.date)} role="row">
                    {week.map((cell) => {
                      const iso = dateKey(cell.date);
                      const shownInOtherMonth =
                        !cell.inMonth &&
                        months.some(
                          (visible) =>
                            visible.year === cell.date.year &&
                            visible.month === cell.date.month,
                        );
                      if (shownInOtherMonth) {
                        return (
                          <td key={iso} role="gridcell" className="p-0.5">
                            <span className={cx('inline-block', sizes.day)} />
                          </td>
                        );
                      }
                      const isStart = isCalendarDateEqual(cell.date, rangeStart);
                      const isEnd = isCalendarDateEqual(cell.date, rangeEnd);
                      const isSelected = rangeMode
                        ? isStart || isEnd
                        : isCalendarDateEqual(cell.date, selected);
                      const inRange =
                        rangeMode && isDateInRange(cell.date, rangeStart, rangeEnd);
                      const isToday = isCalendarDateEqual(cell.date, today);
                      const isFocused = isCalendarDateEqual(cell.date, focusedDate);
                      const unavailable = isDayUnavailable(cell.date);
                      return (
                        <td
                          key={iso}
                          role="gridcell"
                          aria-selected={isSelected || undefined}
                          className={cx(
                            'p-0.5',
                            inRange && 'bg-brand/20',
                            isStart && 'rounded-l-full',
                            isEnd && 'rounded-r-full',
                            isStart && isEnd && 'rounded-full',
                          )}
                        >
                          <button
                            ref={(node) => {
                              if (node) dayRefs.current.set(iso, node);
                              else dayRefs.current.delete(iso);
                            }}
                            type="button"
                            tabIndex={isFocused ? 0 : -1}
                            disabled={disabled}
                            aria-label={formatDayLabel(cell.date, locale)}
                            aria-current={isToday ? 'date' : undefined}
                            aria-disabled={unavailable || undefined}
                            onClick={() => selectDate(cell.date)}
                            className={cx(
                              'inline-flex items-center justify-center rounded-full font-sans',
                              'transition-colors',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                              'disabled:pointer-events-none disabled:opacity-50',
                              sizes.day,
                              cell.inMonth ? 'text-fg' : 'text-fg/50',
                              unavailable && 'cursor-default opacity-50 line-through',
                              isSelected
                                ? 'bg-brand text-on-brand hover:bg-brand-hover'
                                : !unavailable && 'hover:bg-surface-hover',
                              isToday && !isSelected && 'ring-2 ring-brand ring-inset',
                            )}
                          >
                            {cell.date.day}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );
}
