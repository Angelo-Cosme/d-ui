import { describe, expect, it } from 'vitest';
import {
  compareValues,
  nextSort,
  pageCountOf,
  pageRows,
  searchRows,
  sortRows,
  type SortValue,
} from './tableRows';

type Row = { id: string; name: string; amount: number | null; due?: Date };

const ROWS: Row[] = [
  { id: 'a', name: 'Élodie', amount: 10 },
  { id: 'b', name: 'item 10', amount: 2 },
  { id: 'c', name: 'item 9', amount: null },
  { id: 'd', name: 'Bruno', amount: 2 },
];

const valueOf = (row: Row, columnId: string): SortValue =>
  columnId === 'name' ? row.name : columnId === 'amount' ? row.amount : null;

describe('compareValues', () => {
  it('compares numbers numerically, not lexically', () => {
    expect(compareValues(9, 10)).toBeLessThan(0);
    // Un tri lexical mettrait « 10 » avant « 9 ».
    expect(compareValues('item 9', 'item 10', 'fr')).toBeLessThan(0);
  });

  it('sends empty values last, whichever direction', () => {
    expect(compareValues(null, 5)).toBeGreaterThan(0);
    expect(compareValues(5, undefined)).toBeLessThan(0);
    expect(compareValues(null, undefined)).toBe(0);
  });

  it('ignores case and accents on text', () => {
    expect(compareValues('élodie', 'Elodie', 'fr')).toBe(0);
  });

  it('compares dates by instant', () => {
    expect(compareValues(new Date('2026-01-01'), new Date('2026-06-01'))).toBeLessThan(0);
  });
});

describe('sortRows', () => {
  it('returns a copy and leaves the input untouched', () => {
    const sorted = sortRows(ROWS, { columnId: 'name', direction: 'ascending' }, valueOf);
    expect(sorted).not.toBe(ROWS);
    expect(ROWS[0]?.name).toBe('Élodie');
  });

  it('is stable: equal values keep their original order', () => {
    // « b » et « d » valent tous les deux 2 : leur ordre d'origine doit tenir.
    const sorted = sortRows(
      ROWS,
      { columnId: 'amount', direction: 'ascending' },
      valueOf,
    );
    expect(sorted.map((row) => row.id)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('keeps empty values last even when descending', () => {
    const sorted = sortRows(
      ROWS,
      { columnId: 'amount', direction: 'descending' },
      valueOf,
    );
    expect(sorted[sorted.length - 1]?.id).toBe('c');
  });

  it('returns the rows unchanged with no sort', () => {
    expect(sortRows(ROWS, null, valueOf).map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('searchRows', () => {
  it('ignores case and accents', () => {
    const found = searchRows(ROWS, 'elodie', ['name'], valueOf);
    expect(found.map((row) => row.id)).toEqual(['a']);
  });

  it('returns everything on an empty or blank query', () => {
    expect(searchRows(ROWS, '', ['name'], valueOf)).toHaveLength(4);
    expect(searchRows(ROWS, '   ', ['name'], valueOf)).toHaveLength(4);
  });

  it('searches across every listed column', () => {
    expect(searchRows(ROWS, '10', ['name', 'amount'], valueOf).map((r) => r.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('never matches an empty cell', () => {
    expect(searchRows(ROWS, 'null', ['amount'], valueOf)).toHaveLength(0);
  });
});

describe('nextSort', () => {
  it('cycles ascending, descending, then none', () => {
    const first = nextSort(null, 'name');
    expect(first).toEqual({ columnId: 'name', direction: 'ascending' });
    const second = nextSort(first, 'name');
    expect(second).toEqual({ columnId: 'name', direction: 'descending' });
    expect(nextSort(second, 'name')).toBeNull();
  });

  it('restarts ascending on a different column', () => {
    expect(nextSort({ columnId: 'name', direction: 'descending' }, 'amount')).toEqual({
      columnId: 'amount',
      direction: 'ascending',
    });
  });
});

describe('pageRows and pageCountOf', () => {
  it('slices the requested page', () => {
    expect(pageRows(ROWS, 2, 2).map((row) => row.id)).toEqual(['c', 'd']);
  });

  it('returns everything when there is no page size', () => {
    expect(pageRows(ROWS, 1, 0)).toHaveLength(4);
  });

  it('never reports fewer than one page, even empty', () => {
    expect(pageCountOf(0, 10)).toBe(1);
    expect(pageCountOf(21, 10)).toBe(3);
  });
});
