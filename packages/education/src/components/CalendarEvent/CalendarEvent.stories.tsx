import { useId, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Calendar,
  Heading,
  Link,
  Text,
  calendarDateToIso,
  type CalendarDate,
} from 'd-ui';
import { calendarEventArgTypes } from '../../../../ui/.storybook/arg-types';
import {
  componentSource,
  componentSourceFn,
} from '../../../../ui/.storybook/docs-source';
import {
  calendarEventCopy,
  docsLocale,
  type CalendarEventDocsCopy,
  type CalendarEventSession,
  type DocsLocale,
} from '../../../../ui/.storybook/docs-locale';
import { CALENDAR_EVENT_TYPES, CalendarEvent } from './CalendarEvent';
import '../../styles.css';

/*
 * Mise en page en `style` : une app qui consomme `d-ui-education` n’a pas les
 * classes Tailwind internes de `d-ui` (hors contrat), et les stories doivent
 * montrer ce qu’elle peut réellement écrire.
 */
function stack(gap: string, extra?: CSSProperties): CSSProperties {
  return { display: 'flex', flexDirection: 'column', gap, ...extra };
}

const bareList: CSSProperties = { listStyle: 'none', margin: 0, padding: 0 };

const importEvent = "import { CalendarEvent } from 'd-ui-education';";
const importComposition =
  "import { Calendar, calendarDateToIso } from 'd-ui';\nimport { CalendarEvent } from 'd-ui-education';";

const DAY_MS = 86_400_000;
const today: CalendarDate = { year: 2026, month: 3, day: 18 };
const march: CalendarDate = { year: 2026, month: 3, day: 1 };

function utcTime(date: CalendarDate): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function fromUtc(time: number): CalendarDate {
  const date = new Date(time);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/** Lundi → vendredi de la semaine de `date`. */
function weekdaysOf(date: CalendarDate): CalendarDate[] {
  const time = utcTime(date);
  const monday = time - ((new Date(time).getUTCDay() + 6) % 7) * DAY_MS;
  return Array.from({ length: 5 }, (_, index) => fromUtc(monday + index * DAY_MS));
}

function dayLabel(date: CalendarDate, locale: DocsLocale): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(utcTime(date)));
}

function capitalise(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

function sessionsOn(date: CalendarDate, copy: CalendarEventDocsCopy) {
  const iso = calendarDateToIso(date);
  return copy.sessions
    .filter((session) => session.date === iso)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function SessionList({
  sessions,
  copy,
  size,
}: {
  sessions: CalendarEventSession[];
  copy: CalendarEventDocsCopy;
  size: 'sm' | 'md';
}) {
  if (sessions.length === 0) {
    return (
      <Text size="body-sm" tone="muted">
        {copy.noSession}
      </Text>
    );
  }
  return (
    <ol style={stack('0.5rem', bareList)}>
      {sessions.map((session) => (
        <li key={`${session.date}-${session.start}`}>
          <CalendarEvent
            size={size}
            type={session.type}
            typeLabel={copy.typeLabels[session.type]}
            title={session.title}
            course={session.course}
            location={session.location}
            start={session.start}
            end={session.end}
          />
        </li>
      ))}
    </ol>
  );
}

const meta = {
  title: 'Education/CalendarEvent',
  component: CalendarEvent,
  argTypes: calendarEventArgTypes,
  args: {
    title: 'Algorithmique',
    type: 'lecture',
    start: '08:00',
    end: '10:00',
    size: 'md',
  },
  parameters: {
    controls: {
      include: [
        'title',
        'course',
        'location',
        'type',
        'typeLabel',
        'start',
        'end',
        'size',
      ],
    },
  },
} satisfies Meta<typeof CalendarEvent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  parameters: componentSource(
    importEvent,
    `<CalendarEvent
    title="Algorithmique"
    course="INF-201 · L2 Informatique"
    location="Amphi A"
    type="lecture"
    typeLabel="Cours magistral"
    start="08:00"
    end="10:00"
/>`,
  ),
  render: (args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    const type = args.type ?? 'lecture';
    return (
      <div style={{ maxWidth: '20rem' }}>
        <CalendarEvent
          {...args}
          title={copy.title}
          course={copy.course}
          location={copy.location}
          typeLabel={args.typeLabel ?? copy.typeLabels[type]}
        />
      </div>
    );
  },
};

export const Types: Story = {
  name: 'Types de séance',
  parameters: componentSource(
    importEvent,
    `<CalendarEvent type="lecture" typeLabel="Cours magistral" title="Algorithmique" start="08:00" end="10:00" />
<CalendarEvent type="tutorial" typeLabel="TD" title="Algorithmique — TD groupe 2" start="10:15" end="12:15" />
<CalendarEvent type="lab" typeLabel="TP" title="Programmation web" start="14:00" end="17:00" />
<CalendarEvent type="exam" typeLabel="Examen" title="Partiel d’algorithmique" start="09:00" end="11:00" />
<CalendarEvent type="other" typeLabel="Autre" title="Permanence de tutorat" start="14:00" end="16:00" />`,
  ),
  render: (args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    return (
      <ul
        style={{
          ...bareList,
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
          maxWidth: '48rem',
        }}
      >
        {CALENDAR_EVENT_TYPES.map((type) => {
          const session = copy.sessions.find((item) => item.type === type)!;
          return (
            <li key={type}>
              <CalendarEvent
                {...args}
                type={type}
                typeLabel={copy.typeLabels[type]}
                title={session.title}
                course={session.course}
                location={session.location}
                start={session.start}
                end={session.end}
              />
            </li>
          );
        })}
      </ul>
    );
  },
};

export const TokenOverride: Story = {
  name: 'Couleur par jeton',
  parameters: componentSource(
    importEvent,
    `<div style={{ '--d-ui-edu-event-exam': 'var(--d-ui-color-link-visited)' }}>
    <CalendarEvent type="exam" typeLabel="Examen" title="Partiel d’algorithmique" start="09:00" end="11:00" />
</div>`,
  ),
  render: (args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    const exam = copy.sessions.find((item) => item.type === 'exam')!;
    const override = {
      '--d-ui-edu-event-exam': 'var(--d-ui-color-link-visited)',
    } as CSSProperties;
    return (
      <div style={stack('0.5rem', { ...override, maxWidth: '20rem' })}>
        <Text size="body-sm" tone="muted">
          {copy.customised}
        </Text>
        <div>
          <CalendarEvent
            {...args}
            type="exam"
            typeLabel={copy.typeLabels.exam}
            title={exam.title}
            course={exam.course}
            location={exam.location}
            start={exam.start}
            end={exam.end}
          />
        </div>
      </div>
    );
  },
};

export const Minimal: Story = {
  name: 'Contenu minimal',
  parameters: componentSource(
    importEvent,
    `<CalendarEvent title="Algorithmique" />
<CalendarEvent title="Algorithmique" start="08:00" />`,
  ),
  render: (_args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <div style={{ width: '14rem' }}>
          <CalendarEvent title={copy.title} />
        </div>
        <div style={{ width: '14rem' }}>
          <CalendarEvent title={copy.title} start="08:00" />
        </div>
      </div>
    );
  },
};

export const WithLink: Story = {
  name: 'Avec lien',
  parameters: componentSource(
    "import { Link } from 'd-ui';\nimport { CalendarEvent } from 'd-ui-education';",
    `<CalendarEvent
    title={<Link href="/seances/inf-201-2026-03-18">Algorithmique</Link>}
    course="INF-201 · L2 Informatique"
    location="Amphi A"
    typeLabel="Cours magistral"
    start="08:00"
    end="10:00"
/>`,
  ),
  render: (args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    return (
      <div style={{ maxWidth: '20rem' }}>
        <CalendarEvent
          {...args}
          title={<Link href="#seance-inf-201">{copy.openDetails}</Link>}
          course={copy.course}
          location={copy.location}
          typeLabel={copy.typeLabels.lecture}
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  parameters: componentSource(
    importEvent,
    `<CalendarEvent size="sm" title="Algorithmique" start="08:00" end="10:00" />
<CalendarEvent size="md" title="Algorithmique" start="08:00" end="10:00" />`,
  ),
  render: (args, { globals }) => {
    const copy = calendarEventCopy(docsLocale(globals.locale));
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        {(['sm', 'md'] as const).map((size) => (
          <div key={size} style={stack('0.25rem', { width: '14rem' })}>
            <Text size="caption" tone="muted">
              {size === 'sm' ? copy.small : copy.medium}
            </Text>
            <CalendarEvent
              {...args}
              size={size}
              typeLabel={copy.typeLabels.lecture}
              title={copy.title}
              course={copy.course}
              location={copy.location}
            />
          </div>
        ))}
      </div>
    );
  },
};

function DayViewDemo({ locale }: { locale: DocsLocale }) {
  const copy = calendarEventCopy(locale);
  const [day, setDay] = useState<CalendarDate>(today);
  const headingId = useId();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: '1.5rem',
      }}
    >
      <Calendar
        value={day}
        onValueChange={(next) => {
          if ('year' in next) setDay(next);
        }}
        defaultMonth={march}
        today={today}
        locale={locale}
        weekStartsOn={1}
        size="sm"
      />
      <section aria-labelledby={headingId} style={stack('0.75rem', { width: '18rem' })}>
        <Heading level={3} size="body" bold id={headingId}>
          {copy.sessionsOf(dayLabel(day, locale))}
        </Heading>
        <SessionList sessions={sessionsOn(day, copy)} copy={copy} size="md" />
      </section>
    </div>
  );
}

export const DayView: Story = {
  name: 'Vue jour',
  parameters: componentSourceFn(
    importComposition,
    `const [day, setDay] = useState(today);
const sessions = timetable
    .filter((session) => session.date === calendarDateToIso(day))
    .sort((a, b) => a.start.localeCompare(b.start));

return (
    <>
        <Calendar
            value={day}
            // \`onValueChange\` reçoit aussi une plage \`{ start, end }\` : on ne garde qu’une date.
            onValueChange={(value) => {
                if ('year' in value) setDay(value);
            }}
            locale="fr"
            weekStartsOn={1}
            size="sm"
        />
        <section aria-labelledby="day-title">
            <h3 id="day-title">Séances du mercredi 18 mars</h3>
            <ol>
                {sessions.map((session) => (
                    <li key={session.id}>
                        <CalendarEvent {...session} typeLabel={typeLabels[session.type]} />
                    </li>
                ))}
            </ol>
        </section>
    </>
);`,
  ),
  render: (_args, { globals }) => <DayViewDemo locale={docsLocale(globals.locale)} />,
};

function WeekViewDemo({ locale }: { locale: DocsLocale }) {
  const copy = calendarEventCopy(locale);
  const [day, setDay] = useState<CalendarDate>(today);
  const baseId = useId();
  const week = weekdaysOf(day);
  return (
    <div style={stack('1.5rem')}>
      <Calendar
        value={day}
        onValueChange={(next) => {
          if ('year' in next) setDay(next);
        }}
        defaultMonth={march}
        today={today}
        locale={locale}
        weekStartsOn={1}
        size="sm"
      />
      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(5, minmax(8.5rem, 1fr))',
          overflowX: 'auto',
        }}
      >
        {week.map((date) => {
          const iso = calendarDateToIso(date);
          const headingId = `${baseId}-${iso}`;
          return (
            <section
              key={iso}
              aria-labelledby={headingId}
              style={stack('0.5rem', { minWidth: 0 })}
            >
              <Heading level={3} size="body" bold id={headingId}>
                {capitalise(dayLabel(date, locale))}
              </Heading>
              <SessionList sessions={sessionsOn(date, copy)} copy={copy} size="sm" />
            </section>
          );
        })}
      </div>
    </div>
  );
}

export const WeekView: Story = {
  name: 'Vue semaine',
  parameters: componentSourceFn(
    importComposition,
    `const [day, setDay] = useState(today);
const week = weekdaysOf(day); // lundi → vendredi, calculé par l’app

return (
    <>
        <Calendar
            value={day}
            // \`onValueChange\` reçoit aussi une plage \`{ start, end }\` : on ne garde qu’une date.
            onValueChange={(value) => {
                if ('year' in value) setDay(value);
            }}
            locale="fr"
            weekStartsOn={1}
            size="sm"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            {week.map((date) => (
                <section key={calendarDateToIso(date)} aria-labelledby={\`day-\${calendarDateToIso(date)}\`}>
                    <h3 id={\`day-\${calendarDateToIso(date)}\`}>{formatDay(date)}</h3>
                    <ol>
                        {sessionsOn(date).map((session) => (
                            <li key={session.id}>
                                <CalendarEvent size="sm" {...session} typeLabel={typeLabels[session.type]} />
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    </>
);`,
  ),
  render: (_args, { globals }) => <WeekViewDemo locale={docsLocale(globals.locale)} />,
};
