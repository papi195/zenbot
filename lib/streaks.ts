/** YYYY-MM-DD strings, sorted newest first is not required. */
export function computeStreaks(dates: string[]): { current: number; best: number } {
  if (dates.length === 0) return { current: 0, best: 0 };

  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
      run++;
    } else {
      best = Math.max(best, run);
      run = 1;
    }
  }
  best = Math.max(best, run);

  const dateSet = new Set(dates);
  const today = formatLocalDate(new Date());
  const yesterday = formatLocalDate(addDays(new Date(), -1));

  let anchor: string | null = null;
  if (dateSet.has(today)) anchor = today;
  else if (dateSet.has(yesterday)) anchor = yesterday;

  if (!anchor) return { current: 0, best };

  let current = 0;
  let cursor = anchor;
  while (dateSet.has(cursor)) {
    current++;
    cursor = formatLocalDate(addDays(parseDate(cursor), -1));
  }

  return { current, best: Math.max(best, current) };
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function daysBetween(a: string, b: string): number {
  const ms = parseDate(b).getTime() - parseDate(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(formatLocalDate(addDays(new Date(), -i)));
  }
  return out;
}
