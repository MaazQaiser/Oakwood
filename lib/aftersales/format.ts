import { formatRegistration } from "@/lib/part-exchange/validation";
import { formatVehicleLine, formatVehicleMeta } from "@/lib/part-exchange/valuation";
import type { AftersalesVehicle } from "@/types/aftersales";
import type { BookingTimeWindow } from "@/types/booking";

export function formatBookingDate(isoDate?: string): string {
  if (!isoDate) {
    return "";
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return "";
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) {
    return "";
  }
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function formatTimeWindow(window?: BookingTimeWindow): string {
  switch (window) {
    case "morning":
      return "Morning";
    case "afternoon":
      return "Afternoon";
    case "evening":
      return "Evening";
    case "any":
      return "No preference";
    default:
      return "";
  }
}

export function formatServiceType(type?: "service" | "mot"): string {
  if (type === "mot") {
    return "MOT";
  }
  if (type === "service") {
    return "Service";
  }
  return "";
}

export function formatVehicleLabel(vehicle?: AftersalesVehicle): string {
  if (!vehicle) {
    return "";
  }
  const meta = formatVehicleMeta(vehicle);
  return meta ? `${formatVehicleLine(vehicle)} · ${meta}` : formatVehicleLine(vehicle);
}

export function formatBookingRegistration(value?: string): string {
  return value ? formatRegistration(value) : "";
}

export function formatBookingReference(id: string, prefix: "BOOK" | "CLAIM" | "ENQ"): string {
  return `OAK-${prefix}-${id.slice(0, 8).toUpperCase()}`;
}
