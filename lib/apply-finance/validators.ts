const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function adultDobLimit(now = new Date()): string {
  return isoDate(new Date(now.getFullYear() - 18, now.getMonth(), now.getDate()));
}

export function todayIso(now = new Date()): string {
  return isoDate(now);
}

export function isIsoDate(value?: string): boolean {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isAdult(value?: string, now = new Date()): boolean {
  return Boolean(value && isIsoDate(value) && value <= adultDobLimit(now) && value >= "1900-01-01");
}

export function isPastOrToday(value?: string, now = new Date()): boolean {
  return Boolean(value && isIsoDate(value) && value <= todayIso(now) && value >= "1900-01-01");
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function normaliseMobile(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("+44")) {
    return `0${digitsOnly(trimmed.slice(3))}`;
  }
  return digitsOnly(trimmed);
}

export function isUkMobile(value?: string): boolean {
  return /^07\d{9}$/.test(normaliseMobile(value));
}

export function isEmail(value?: string): boolean {
  return EMAIL.test(value?.trim() ?? "");
}

export function normalisePostcode(value?: string): string | null {
  if (!value) return null;
  const compact = value.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(compact)) return null;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

export function isReasonableAmount(value?: string, required = true): boolean {
  if (!value) return !required;
  if (!/^\d+$/.test(value)) return false;
  const amount = Number(value);
  return amount >= 0 && amount <= 1_000_000;
}

export function hasText(value?: string, minimum = 2): boolean {
  return (value?.trim().length ?? 0) >= minimum;
}
