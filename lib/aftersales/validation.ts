import {
  isValidUkRegistration,
  manualVehicleError,
  normaliseRegistration,
  registrationError,
} from "@/lib/part-exchange/validation";
import type { AftersalesBookingType } from "@/config/routes";
import type { AftersalesContact, AftersalesVehicle } from "@/types/aftersales";
import type { BookingTimeWindow } from "@/types/booking";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { isValidUkRegistration, normaliseRegistration, registrationError };

export function emailError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Enter your email address.";
  }
  if (!EMAIL.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function telephoneError(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!value.trim()) {
    return "Enter a telephone number.";
  }
  if (digits.length < 10 || digits.length > 13) {
    return "Enter a valid UK telephone number.";
  }
  return undefined;
}

export function nameError(value: string): string | undefined {
  if (!value.trim()) {
    return "Enter your name.";
  }
  if (value.trim().length < 2) {
    return "Enter your full name.";
  }
  return undefined;
}

export function contactError(input: {
  name: string;
  telephone: string;
  email: string;
}): string | undefined {
  return nameError(input.name) ?? telephoneError(input.telephone) ?? emailError(input.email);
}

export function sanitiseContact(input: {
  name: string;
  telephone: string;
  email: string;
}): AftersalesContact {
  return {
    name: input.name.trim(),
    telephone: input.telephone.trim(),
    email: input.email.trim().toLowerCase(),
  };
}

export function serviceTypeError(
  value?: AftersalesBookingType,
): string | undefined {
  if (value !== "service" && value !== "mot") {
    return "Choose a service type.";
  }
  return undefined;
}

export function locationError(value?: string): string | undefined {
  if (value !== "bury" && value !== "chorley") {
    return "Choose Bury or Chorley.";
  }
  return undefined;
}

export function preferredDateError(value?: string): string | undefined {
  if (!value) {
    return "Choose a preferred date.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Enter a valid date.";
  }
  return undefined;
}

export function timeWindowError(
  value?: BookingTimeWindow,
): string | undefined {
  if (!value) {
    return "Choose a preferred time.";
  }
  return undefined;
}

export function issueError(value?: string): string | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "Describe the issue.";
  }
  if (trimmed.length < 10) {
    return "Tell us a little more about the issue.";
  }
  return undefined;
}

export function vehicleDetailsError(input: {
  year: string;
  make: string;
  model: string;
  fuelType: string;
  transmission: string;
}): string | undefined {
  return manualVehicleError(input);
}

export function toManualVehicle(input: {
  year: string;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
}): AftersalesVehicle {
  return {
    year: Number(input.year),
    make: input.make.trim(),
    model: input.model.trim(),
    variant: input.variant?.trim() || undefined,
    fuelType: input.fuelType,
    transmission: input.transmission,
    source: "manual",
  };
}
