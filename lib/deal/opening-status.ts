import { getShowroomProfile, showrooms } from "@/config/locations";

export type ShowroomOpenStatus = {
  open: boolean;
  locationSlug: string;
  locationName: string;
  telephone?: string;
  /** Human-readable hours for today. */
  todayHours: string;
  /** Label for the next time customers can call / visit. */
  nextOpenLabel: string;
  /** ISO date (YYYY-MM-DD) for the next open sales day (callback booking). */
  nextOpenDate: string;
  /** Source of truth for this calculation. */
  source: "mock-config";
};

/** Spec hours: Mon–Sat 09:00–18:00, Sun & bank holidays 10:00–17:00. */
const WEEKDAY = { open: 9 * 60, close: 18 * 60 };
const SUNDAY = { open: 10 * 60, close: 17 * 60 };

/**
 * Fixed UK bank-holiday stubs for the prototype year.
 * Real calendars should replace this when site config is wired.
 */
const MOCK_BANK_HOLIDAYS = new Set([
  "2026-01-01",
  "2026-04-03",
  "2026-04-06",
  "2026-05-04",
  "2026-05-25",
  "2026-08-31",
  "2026-12-25",
  "2026-12-28",
]);

function londonParts(date: Date): {
  ymd: string;
  weekday: number;
  minutes: number;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const weekdayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };

  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: weekdayMap[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function hoursForDay(ymd: string, weekday: number) {
  if (weekday === 0 || MOCK_BANK_HOLIDAYS.has(ymd)) {
    return { ...SUNDAY, label: "10:00 – 17:00" };
  }
  return { ...WEEKDAY, label: "09:00 – 18:00" };
}

function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

function weekdayFromYmd(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  // UTC noon avoids DST edge cases for day-of-week only.
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

function formatNextOpenLabel(ymd: string, openMinutes: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const dayName = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(date);
  const hour = Math.floor(openMinutes / 60);
  const minute = openMinutes % 60;
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return `${dayName} from ${time}`;
}

/**
 * Mock showroom open/closed status from published hours.
 * Uses Europe/London wall time — not a hard-coded live claim.
 */
export function getMockShowroomOpenStatus(
  locationSlug: string,
  now = new Date(),
): ShowroomOpenStatus {
  const profile = getShowroomProfile(locationSlug);
  const locationName = profile?.name ?? locationSlug;
  const telephone = profile?.telephone;
  const { ymd, weekday, minutes } = londonParts(now);
  const today = hoursForDay(ymd, weekday);
  const open = minutes >= today.open && minutes < today.close;

  let cursor = ymd;
  let nextHours = today;
  if (open) {
    // Already open — "next" is still useful if we close later today.
    return {
      open: true,
      locationSlug,
      locationName,
      telephone,
      todayHours: today.label,
      nextOpenLabel: `Open now until ${today.label.split("–")[1]?.trim() ?? "close"}`,
      nextOpenDate: ymd,
      source: "mock-config",
    };
  }

  // Before open today?
  if (minutes < today.open) {
    nextHours = today;
  } else {
    // Find the next open day.
    for (let i = 1; i <= 8; i += 1) {
      cursor = addDaysYmd(ymd, i);
      nextHours = hoursForDay(cursor, weekdayFromYmd(cursor));
      break;
    }
  }

  return {
    open: false,
    locationSlug,
    locationName,
    telephone,
    todayHours: today.label,
    nextOpenLabel: formatNextOpenLabel(
      minutes < today.open ? ymd : cursor,
      nextHours.open,
    ),
    nextOpenDate: minutes < today.open ? ymd : cursor,
    source: "mock-config",
  };
}

/** Map a vehicle / deal location to a known showroom slug (mock). */
export function resolveShowroomSlug(locationSlug?: string): string {
  if (locationSlug && showrooms.some((s) => s.slug === locationSlug)) {
    return locationSlug;
  }
  return showrooms[0]?.slug ?? "bury";
}

export type OpenDayOption = {
  ymd: string;
  /** Chip label, e.g. "Mon 20". */
  shortLabel: string;
  /** Longer label for confirmations. */
  label: string;
  hoursLabel: string;
};

/** Next N sales days from published hours (Europe/London). */
export function getNextOpenDays(count = 4, now = new Date()): OpenDayOption[] {
  const { ymd, weekday, minutes } = londonParts(now);
  const days: OpenDayOption[] = [];
  let cursor = ymd;
  let dayWeekday = weekday;

  for (let guard = 0; days.length < count && guard < 16; guard += 1) {
    const hours = hoursForDay(cursor, dayWeekday);
    const isToday = cursor === ymd;
    const stillOpenToday = isToday && minutes < hours.close;
    const futureDay = !isToday;
    if (stillOpenToday || futureDay) {
      const [y, m, d] = cursor.split("-").map(Number);
      const date = new Date(Date.UTC(y, m - 1, d, 12));
      const label = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date);
      const shortLabel = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
      }).format(date);
      days.push({ ymd: cursor, shortLabel, label, hoursLabel: hours.label });
    }
    cursor = addDaysYmd(cursor, 1);
    dayWeekday = weekdayFromYmd(cursor);
  }
  return days;
}

export type SalesTimeSlot = {
  /** HH:MM — used as the slot value in booking panels. */
  time: string;
  available: boolean;
};

/**
 * Half-hour sales slots for a given day from published hours.
 * Mock availability: every third slot marked unavailable for prototype UX.
 */
export function getSalesTimeSlots(
  ymd: string,
  now = new Date(),
): SalesTimeSlot[] {
  const weekday = weekdayFromYmd(ymd);
  const hours = hoursForDay(ymd, weekday);
  const { ymd: today, minutes: nowMinutes } = londonParts(now);
  const slots: SalesTimeSlot[] = [];
  let index = 0;
  for (let m = hours.open; m < hours.close; m += 30) {
    const hour = Math.floor(m / 60);
    const minute = m % 60;
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const pastToday = ymd === today && m <= nowMinutes;
    const mockUnavailable = index % 3 === 2;
    slots.push({
      time,
      available: !pastToday && !mockUnavailable,
    });
    index += 1;
  }
  return slots;
}
