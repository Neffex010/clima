export function dateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function parseDate(value) {
  if (value instanceof Date) return value;
  const str = String(value);
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(str) ? `${str}T12:00:00` : str;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? new Date(str) : parsed;
}

export function isToday(value) {
  return dateToISO(parseDate(value)) === dateToISO(new Date());
}

export function formatDateLong(value) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(parseDate(value));
}

export function formatWeekday(value) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(parseDate(value));
}

export function formatDayMonth(value) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(parseDate(value));
}

export function formatDateShort(value) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(parseDate(value));
}