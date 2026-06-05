import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod } from './date';

describe('date formatting', () => {
  it('formats ISO months', () => {
    expect(formatMonth('2025-04')).toBe('Apr 2025');
  });

  it('marks ongoing periods as present', () => {
    expect(formatPeriod({ start: '2025-04' })).toBe('Apr 2025 - Present');
  });

  it('formats closed ranges and single-month periods', () => {
    expect(formatPeriod({ start: '2024-07', end: '2024-09' })).toBe('Jul 2024 - Sep 2024');
    expect(formatPeriod({ start: '2024-09', end: '2024-09' })).toBe('Sep 2024');
  });

  it('returns malformed input unchanged', () => {
    expect(formatMonth('soon')).toBe('soon');
  });
});
