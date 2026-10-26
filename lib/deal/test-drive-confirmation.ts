import { getShowroomProfile } from "@/config/locations";
import { eskimoIntegration } from "@/lib/api/integrations";
import { LOCATION_ADDRESS_NOTICE } from "@/lib/locations/content";
import { getDirectionsUrl } from "@/lib/locations/directions";
import {
  STEP4_TD_CONFIRM_BODY,
  STEP4_TD_CONFIRM_TITLE,
  STEP4_TD_MAP_UNAVAILABLE,
  STEP4_TD_MESSAGES_PENDING,
  STEP4_TD_PHONE_UNAVAILABLE,
  STEP4_TD_VIDEO_UNAVAILABLE,
  STEP4_TD_WHAT_TO_BRING,
} from "@/lib/deal/step4-copy";

export type TestDriveConfirmationRequest = {
  reference: string;
  stockId: string;
  showroomSlug: string;
  dateYmd: string;
  time: string;
  whenLabel: string;
  channels: boolean;
  vehicleTitle: string;
  derivative?: string;
  mileage: number;
  cashPrice: number;
  imageSrc?: string;
  imageAlt?: string;
};

export type TestDriveConfirmationModel = {
  statusLabel: string;
  body: string;
  reference: string;
  showroomName: string;
  whenLabel: string;
  vehicleTitle: string;
  derivative?: string;
  mileage: number;
  cashPrice: number;
  imageSrc?: string;
  imageAlt?: string;
  addressLines: string[];
  addressNotice: string;
  telephone?: string;
  phoneNotice?: string;
  mapsUrl?: string;
  mapNotice?: string;
  video?: { title: string; src: string };
  videoNotice?: string;
  bring: string[];
  channelsRequested: boolean;
  messagesDelivered: boolean;
  messagesNotice: string;
  email: string;
  sms: string;
  whatsapp: string;
  reminder: string;
  calendar: string;
  calendarFilename: string;
};

function icsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function londonToUtc(ymd: string, time: string): Date | null {
  const [year, month, day] = ymd.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (
    !year ||
    !month ||
    !day ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(utcGuess));
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour"),
    read("minute"),
  );
  if (!Number.isFinite(asUtc)) return null;
  return new Date(utcGuess - (asUtc - utcGuess));
}

function icsStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildTestDriveConfirmation(
  request: TestDriveConfirmationRequest,
  videoSrc?: string,
  videoTitle?: string,
): TestDriveConfirmationModel | null {
  const profile = getShowroomProfile(request.showroomSlug);
  if (!profile) return null;

  const addressLines = [
    `Oakwood ${profile.name}`,
    profile.postcode,
    profile.region,
  ].filter((line): line is string => Boolean(line));
  const mapsUrl = profile.postcode ? getDirectionsUrl(profile) : undefined;
  const video =
    videoSrc && videoSrc.trim()
      ? { title: videoTitle?.trim() || "Walkaround", src: videoSrc.trim() }
      : undefined;
  const bring = [...STEP4_TD_WHAT_TO_BRING];
  const when = request.whenLabel;
  const place = addressLines.join(", ");
  const phone = profile.telephone;
  const mapLine = mapsUrl ?? STEP4_TD_MAP_UNAVAILABLE;
  const videoLine = video
    ? `Walkaround: ${video.src}`
    : STEP4_TD_VIDEO_UNAVAILABLE;
  const bringLines = bring.map((item) => `- ${item}`).join("\n");

  const email = [
    STEP4_TD_CONFIRM_TITLE,
    STEP4_TD_CONFIRM_BODY,
    "",
    request.vehicleTitle,
    `Oakwood ${profile.name}`,
    when,
    place,
    phone ? `Phone: ${phone}` : STEP4_TD_PHONE_UNAVAILABLE,
    mapLine,
    "",
    "What to bring",
    bringLines,
    videoLine,
    `Reference ${request.reference}`,
  ].join("\n");

  const sms = [
    `Oakwood: test drive requested.`,
    `${request.vehicleTitle} at Oakwood ${profile.name}, ${when}.`,
    mapsUrl ?? (phone ? phone : STEP4_TD_MAP_UNAVAILABLE),
    `Ref ${request.reference}.`,
  ].join(" ");

  const whatsapp = [
    `${STEP4_TD_CONFIRM_TITLE} — ${request.vehicleTitle}`,
    `Oakwood ${profile.name}, ${when}`,
    place,
    mapLine,
    videoLine,
    STEP4_TD_CONFIRM_BODY,
    `Reference ${request.reference}`,
  ].join("\n");

  const reminder = [
    `Reminder: your Oakwood test drive is in two hours.`,
    `${request.vehicleTitle} at Oakwood ${profile.name}, ${request.time}.`,
    phone ?? STEP4_TD_PHONE_UNAVAILABLE,
    `Reference ${request.reference}.`,
  ].join(" ");

  const start = londonToUtc(request.dateYmd, request.time);
  const end = start ? new Date(start.getTime() + 30 * 60 * 1000) : null;
  const calendar =
    start && end
      ? [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Oakwood Motor Company//Test drive//EN",
          "BEGIN:VEVENT",
          `UID:${icsText(request.reference)}@oakwood`,
          `DTSTAMP:${icsStamp(new Date())}`,
          `DTSTART:${icsStamp(start)}`,
          `DTEND:${icsStamp(end)}`,
          `SUMMARY:${icsText(`Test drive at Oakwood ${profile.name}`)}`,
          `LOCATION:${icsText(place)}`,
          `DESCRIPTION:${icsText(`${STEP4_TD_CONFIRM_BODY}\n${bringLines}\n${videoLine}`)}`,
          ...(mapsUrl ? [`URL:${mapsUrl}`] : []),
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n")
      : "";

  return {
    statusLabel: STEP4_TD_CONFIRM_TITLE,
    body: STEP4_TD_CONFIRM_BODY,
    reference: request.reference,
    showroomName: profile.name,
    whenLabel: when,
    vehicleTitle: request.vehicleTitle,
    derivative: request.derivative,
    mileage: request.mileage,
    cashPrice: request.cashPrice,
    imageSrc: request.imageSrc,
    imageAlt: request.imageAlt,
    addressLines,
    addressNotice: LOCATION_ADDRESS_NOTICE,
    telephone: phone,
    phoneNotice: phone ? undefined : STEP4_TD_PHONE_UNAVAILABLE,
    mapsUrl,
    mapNotice: mapsUrl ? undefined : STEP4_TD_MAP_UNAVAILABLE,
    video,
    videoNotice: video ? undefined : STEP4_TD_VIDEO_UNAVAILABLE,
    bring,
    channelsRequested: request.channels,
    // Eskimo stores the enquiry. It does not send email, SMS, WhatsApp, or reminders.
    messagesDelivered: eskimoIntegration.implemented,
    messagesNotice: request.channels
      ? STEP4_TD_MESSAGES_PENDING
      : "You asked not to receive SMS, WhatsApp and email. The same details are shown here.",
    email,
    sms,
    whatsapp,
    reminder,
    calendar,
    calendarFilename: `oakwood-test-drive-${request.reference}.ics`,
  };
}
