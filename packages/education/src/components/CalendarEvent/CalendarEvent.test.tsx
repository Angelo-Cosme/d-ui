import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CalendarEvent } from './CalendarEvent';

describe('CalendarEvent', () => {
  it('names the article after its title', () => {
    render(
      <CalendarEvent
        title="Algorithmique"
        course="INF-201"
        location="Amphi A"
        typeLabel="Cours magistral"
        start="08:00"
        end="10:00"
      />,
    );
    const event = screen.getByRole('article', { name: 'Algorithmique' });
    expect(event).toHaveTextContent('INF-201');
    expect(event).toHaveTextContent('Amphi A');
    expect(event).toHaveTextContent('Cours magistral');
  });

  it('renders start and end as machine-readable times', () => {
    const { container } = render(<CalendarEvent title="TD" start="08:00" end="10:00" />);
    const times = container.querySelectorAll('time');
    expect([...times].map((time) => time.getAttribute('datetime'))).toEqual([
      '08:00',
      '10:00',
    ]);
  });

  it('ignores end without start', () => {
    const { container } = render(<CalendarEvent title="TD" end="10:00" />);
    expect(container.querySelector('time')).toBeNull();
  });

  it('exposes the type for token colours and falls back to an English label', () => {
    render(<CalendarEvent title="Partiel" type="exam" />);
    const event = screen.getByRole('article', { name: 'Partiel' });
    expect(event).toHaveAttribute('data-type', 'exam');
    expect(event).toHaveTextContent('Exam');
  });

  it('defaults to a medium lecture', () => {
    render(<CalendarEvent title="Cours" />);
    const event = screen.getByRole('article', { name: 'Cours' });
    expect(event).toHaveAttribute('data-type', 'lecture');
    expect(event).toHaveClass('d-ui-edu-event--md');
  });

  it('merges className and forwards native attributes', () => {
    render(<CalendarEvent title="TP" size="sm" className="extra" data-testid="event" />);
    const event = screen.getByTestId('event');
    expect(event).toHaveClass('d-ui-edu-event', 'd-ui-edu-event--sm', 'extra');
  });

  it('omits empty course and location lines', () => {
    render(<CalendarEvent title="Seul" />);
    expect(screen.getByRole('article').querySelectorAll('p')).toHaveLength(2);
  });

  it('keeps a link in the title reachable and names the article after it', () => {
    render(<CalendarEvent title={<a href="/seances/1">Algorithmique</a>} />);
    const event = screen.getByRole('article', { name: 'Algorithmique' });
    const link = screen.getByRole('link', { name: 'Algorithmique' });
    expect(event).toContainElement(link);
    expect(link).toHaveAttribute('href', '/seances/1');
  });
});
