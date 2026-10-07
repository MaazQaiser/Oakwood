import type { Location } from "@/types/vehicle";

function mapsQuery(location: Location): string {
  return [
    "Oakwood Motor Company",
    location.name,
    location.postcode,
    location.region,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getDirectionsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(location))}`;
}

export function getMapEmbedUrl(location: Location): string {
  const params = new URLSearchParams({
    q: mapsQuery(location),
    z: "15",
    hl: "en",
    output: "embed",
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}
