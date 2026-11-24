/**
 * PLACEHOLDERS. Swap these four for the real routing before this goes near a
 * customer. tel for call links, smsNum for SMS (URI uses ?&body= for iOS and
 * Android), waNum international with no plus sign, sites for booking.
 */
export const NEG_EQUITY_CONTACT = {
  tel: "+44161REPLACE",
  smsNum: "+44161REPLACE",
  waNum: "44161REPLACE",
  sites: ["Bury", "Chorley"] as const,
};

/** Placeholder slot grid until Dan supplies the real one (may differ by site/day). */
export const APPOINTMENT_SLOTS = [
  "09:30",
  "10:30",
  "11:30",
  "12:30",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export function whatsappHref(message: string): string {
  return `https://wa.me/${NEG_EQUITY_CONTACT.waNum}?text=${encodeURIComponent(message)}`;
}

export function smsHref(message: string): string {
  return `sms:${NEG_EQUITY_CONTACT.smsNum}?&body=${encodeURIComponent(message)}`;
}

export function telHref(): string {
  return `tel:${NEG_EQUITY_CONTACT.tel}`;
}

export function dayLabel(offset: number, now = new Date()): {
  primary: string;
  secondary: string;
  date: Date;
} {
  const t = new Date(now);
  t.setDate(t.getDate() + offset);
  if (offset === 0) {
    return {
      primary: "Today",
      secondary: t.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      date: t,
    };
  }
  if (offset === 1) {
    return {
      primary: "Tomorrow",
      secondary: t.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      date: t,
    };
  }
  return {
    primary: t.toLocaleDateString("en-GB", { weekday: "short" }),
    secondary: t.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    date: t,
  };
}
