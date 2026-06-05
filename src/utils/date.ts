import type { Period } from '../types/content';

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

/** Formats an ISO month (YYYY-MM) as e.g. "Apr 2025". */
export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number);
  if (!year || !month) return isoMonth;
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatPeriod({ start, end }: Period): string {
  const from = formatMonth(start);
  if (end === start) return from;
  return `${from} - ${end ? formatMonth(end) : 'Present'}`;
}
