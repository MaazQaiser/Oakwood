import type { Location } from "@/types/vehicle";

export function getDirectionsUrl(location: Location): string {
  const query = [
    "Oakwood Motor Company",
    location.name,
    location.postcode,
    location.region,
  ]
    .filter(Boolean)
    .join(" ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
