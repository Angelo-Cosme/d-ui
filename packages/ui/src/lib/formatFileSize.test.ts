import { describe, expect, it } from 'vitest';
import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('formats bytes, kilobytes and megabytes', () => {
    expect(formatFileSize(400)).toBe('400 o');
    expect(formatFileSize(2048)).toBe('2 Ko');
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 Mo');
  });
});
