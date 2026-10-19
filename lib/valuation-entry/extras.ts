import type { DealPxExtraId } from "@/types/deal";

export const VE_EXTRA_OPTIONS: { id: DealPxExtraId; label: string }[] = [
  { id: "panoramic-roof", label: "Panoramic roof" },
  { id: "full-service-history", label: "Full service history" },
  { id: "two-keys", label: "Two keys" },
  { id: "heated-seats", label: "Heated seats" },
  { id: "leather", label: "Leather" },
  { id: "sat-nav", label: "Sat nav" },
  { id: "reversing-camera", label: "Reversing camera" },
  { id: "private-plate", label: "Private plate" },
  { id: "non-standard-modifications", label: "Non-standard modifications" },
  { id: "known-damage", label: "Known damage" },
  { id: "other", label: "Other" },
];

/** Mock pre-population from a successful lookup (prototype only). */
export function mockPrefillExtras(registration: string): DealPxExtraId[] {
  const cleaned = registration.replace(/\s+/g, "").toUpperCase();
  if (cleaned === "AB21CDE") {
    return ["two-keys", "sat-nav", "heated-seats"];
  }
  return ["two-keys"];
}
