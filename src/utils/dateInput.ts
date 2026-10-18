const MIN_YEAR = 1900;

export function formatDateDDMMYYYY(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

function formatDigits(digits: string): string {
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join('/');
}

// Keeps only digits and inserts the "/" separators, so "25061996" becomes "25/06/1996".
export function maskDateInput(raw: string, previous = ''): string {
  let digits = raw.replace(/\D/g, '').slice(0, 8);
  // Backspacing over a "/" would otherwise re-add it and leave the text stuck.
  if (raw.length < previous.length && formatDigits(digits) === previous) {
    digits = digits.slice(0, -1);
  }
  return formatDigits(digits);
}

export function parseDateDDMMYYYY(text: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < MIN_YEAR) return null;
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate ? date : null;
}

// Parses a "YYYY-MM-DD" string as a local date (new Date("YYYY-MM-DD") would be UTC and can shift the day).
export function parseYYYYMMDDToDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
