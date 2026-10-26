// date.ts — v3. One date format everywhere: "26 Oct 2026".
// Never use toLocaleDateString() in new/changed pages — use formatDate().
// Invalid / empty input renders as "—" instead of crashing.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null;
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return null;
  return Math.round((startOfDay(due).getTime() - startOfDay(new Date()).getTime()) / 86400000);
}

export function daysAgo(value: string | null | undefined): number | null {
  const until = daysUntil(value);
  return until === null ? null : -until;
}

export function isOverdue(value: string | null | undefined): boolean {
  const until = daysUntil(value);
  return until !== null && until < 0;
}

export function isToday(value: string | null | undefined): boolean {
  return daysUntil(value) === 0;
}
