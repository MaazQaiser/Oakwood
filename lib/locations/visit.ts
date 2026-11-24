/** Opening hours as [open, close] in whole hours. Index 0 is Sunday. */
export const WEEKLY_HOURS: ReadonlyArray<readonly [number, number]> = [
  [10, 17],
  [9, 18],
  [9, 18],
  [9, 18],
  [9, 18],
  [9, 18],
  [9, 18],
];

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type OpenState =
  | { open: true; closes: number; day: number }
  | { open: false; opensDay: "today" | "tomorrow"; opensAt: number; day: number };

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

/** Showroom time is UK time, whatever the visitor's device is set to. */
function ukClock(date: Date): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  return { day, hour: Number(value("hour")) + Number(value("minute")) / 60 };
}

export function getOpenState(date: Date = new Date()): OpenState {
  const { day, hour } = ukClock(date);
  const [opens, closes] = WEEKLY_HOURS[day];
  if (hour >= opens && hour < closes) {
    return { open: true, closes, day };
  }
  if (hour < opens) {
    return { open: false, opensDay: "today", opensAt: opens, day };
  }
  return { open: false, opensDay: "tomorrow", opensAt: WEEKLY_HOURS[(day + 1) % 7][0], day };
}

export interface PostcodeArea {
  town: string;
  /** Rough road miles to each showroom. */
  miles: { bury: number; chorley: number };
}

/**
 * Placeholder distances by postcode area. Production needs a real routing lookup;
 * these will be wrong for anyone on the edge of an area.
 */
const POSTCODE_AREAS: Record<string, PostcodeArea> = {
  BL: { town: "Bolton", miles: { bury: 6, chorley: 13 } },
  M: { town: "Manchester", miles: { bury: 9, chorley: 25 } },
  OL: { town: "Oldham", miles: { bury: 9, chorley: 28 } },
  SK: { town: "Stockport", miles: { bury: 14, chorley: 32 } },
  BB: { town: "Blackburn", miles: { bury: 14, chorley: 12 } },
  PR: { town: "Preston", miles: { bury: 30, chorley: 11 } },
  WN: { town: "Wigan", miles: { bury: 15, chorley: 10 } },
  WA: { town: "Warrington", miles: { bury: 25, chorley: 20 } },
  FY: { town: "Blackpool", miles: { bury: 42, chorley: 22 } },
  L: { town: "Liverpool", miles: { bury: 32, chorley: 28 } },
  CH: { town: "Chester", miles: { bury: 45, chorley: 38 } },
  LA: { town: "Lancaster", miles: { bury: 48, chorley: 32 } },
};

export const FREE_DELIVERY_MILES = 15;

export type NearestShowroomResult =
  | { status: "invalid" }
  | { status: "unknown"; area: string }
  | {
      status: "found";
      town: string;
      nearest: "bury" | "chorley";
      miles: { bury: number; chorley: number };
      nearestMiles: number;
      driveMinutes: number;
      inDeliveryArea: boolean;
    };

/**
 * Urban pace for the first ten miles, then faster. A flat rate per mile makes a
 * motorway run look far longer than it is.
 */
function driveMinutes(miles: number): number {
  return Math.max(10, Math.round(Math.min(miles, 10) * 2.5 + Math.max(0, miles - 10) * 1.3));
}

export function findNearestShowroom(postcode: string): NearestShowroomResult {
  const match = postcode.trim().toUpperCase().replace(/\s+/g, "").match(/^([A-Z]{1,2})\d/);
  if (!match) {
    return { status: "invalid" };
  }
  const letters = match[1];
  const area = POSTCODE_AREAS[letters];
  if (!area) {
    return { status: "unknown", area: letters };
  }
  const nearest = area.miles.bury <= area.miles.chorley ? "bury" : "chorley";
  const nearestMiles = area.miles[nearest];
  return {
    status: "found",
    town: area.town,
    nearest,
    miles: area.miles,
    nearestMiles,
    driveMinutes: driveMinutes(nearestMiles),
    inDeliveryArea: nearestMiles <= FREE_DELIVERY_MILES,
  };
}

/** The recorded USPs. Kept in one place so pages cannot drift apart. */
export const OAKWOOD_REASONS = [
  {
    title: "Every car AA inspected, over 130 points",
    body: "Carried out by a certified AA engineer, with the certificate on the car's own page. Electric cars get an Aviloo battery certificate the same way.",
  },
  {
    title: "Six month warranty as standard",
    body: "On every car, not as an upsell. AA cover is available as an upgrade for up to four years if you want longer.",
  },
  {
    title: "No admin fees",
    body: "The price on the car is the price. Nothing appears at the end that was not there at the start.",
  },
  {
    title: "Our own preparation centre and workshop",
    body: "MOT, diagnostics and full mechanical work in house, so we are not waiting on anyone else to get a car ready or to put something right.",
  },
  {
    title: "Aftersales for any car, not just ours",
    body: "Including manufacturer servicing, whether you bought the car from us or not.",
  },
  {
    title: "Over 25 years of doing this",
    body: "Two showrooms, 500 cars, and finance from 9.4% APR with interest free available on any car in stock.",
  },
] as const;
