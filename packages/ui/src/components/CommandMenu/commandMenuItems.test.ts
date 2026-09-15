import { describe, expect, it } from 'vitest';
import {
  defaultCommandMenuFilter,
  filterCommandMenuEntries,
  flattenCommandMenuEntries,
  foldCommandText,
  type CommandMenuEntry,
} from './commandMenuItems';

const create = {
  value: 'new',
  label: 'Nouveau devoir',
  description: 'Un devoir vide',
  keywords: ['créer', 'ajouter'],
};

const entries: CommandMenuEntry[] = [
  { label: 'Navigation', items: [{ value: 'home', label: 'Accueil' }] },
  { label: 'Actions', items: [create, { value: 'archive', label: 'Archiver' }] },
  { value: 'logout', label: 'Se déconnecter' },
];

describe('commandMenuItems', () => {
  it('folds case and accents', () => {
    expect(foldCommandText('  Créer un Devoir ')).toBe('creer un devoir');
  });

  it('matches the label, the description, and the keywords as substrings', () => {
    expect(defaultCommandMenuFilter(create, 'veau')).toBe(true);
    expect(defaultCommandMenuFilter(create, 'VIDE')).toBe(true);
    expect(defaultCommandMenuFilter(create, 'creer')).toBe(true);
    expect(defaultCommandMenuFilter(create, 'supprimer')).toBe(false);
  });

  it('keeps every command on an empty or blank query', () => {
    expect(defaultCommandMenuFilter(create, '')).toBe(true);
    expect(defaultCommandMenuFilter(create, '   ')).toBe(true);
  });

  it('drops a group whose commands all miss the query', () => {
    const out = filterCommandMenuEntries(entries, 'ajouter', defaultCommandMenuFilter);
    expect(out).toEqual([{ label: 'Actions', items: [create] }]);
  });

  it('keeps the visible order when flattening groups', () => {
    expect(flattenCommandMenuEntries(entries).map((item) => item.value)).toEqual([
      'home',
      'new',
      'archive',
      'logout',
    ]);
  });
});
