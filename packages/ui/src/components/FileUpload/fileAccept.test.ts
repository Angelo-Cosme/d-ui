import { describe, expect, it } from 'vitest';
import { fileMatchesAccept, partitionFiles } from './fileAccept';

function file(name: string, type: string, size = 8): File {
  return new File(['x'.repeat(size)], name, { type });
}

describe('fileMatchesAccept', () => {
  it('accepts anything when accept is empty', () => {
    expect(fileMatchesAccept(file('a.bin', 'application/octet-stream'))).toBe(true);
    expect(fileMatchesAccept(file('a.bin', 'application/octet-stream'), '')).toBe(true);
  });

  it('matches an extension', () => {
    expect(fileMatchesAccept(file('devoir.pdf', 'application/pdf'), '.pdf,.txt')).toBe(
      true,
    );
    expect(fileMatchesAccept(file('devoir.doc', 'application/msword'), '.pdf')).toBe(
      false,
    );
  });

  it('matches a MIME wildcard', () => {
    expect(fileMatchesAccept(file('photo.png', 'image/png'), 'image/*')).toBe(true);
    expect(fileMatchesAccept(file('notes.pdf', 'application/pdf'), 'image/*')).toBe(
      false,
    );
  });
});

describe('partitionFiles', () => {
  it('splits type and size rejections', () => {
    const pdf = file('ok.pdf', 'application/pdf', 10);
    const png = file('no.png', 'image/png', 10);
    const huge = file('big.pdf', 'application/pdf', 100);
    const { accepted, rejected } = partitionFiles([pdf, png, huge], {
      accept: '.pdf,application/pdf',
      maxSize: 20,
    });
    expect(accepted).toEqual([pdf]);
    expect(rejected.map((item) => item.reason)).toEqual(['type', 'size']);
  });
});
