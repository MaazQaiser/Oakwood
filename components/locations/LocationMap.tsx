import { getDirectionsUrl, getMapEmbedUrl } from "@/lib/locations/directions";
import type { ShowroomProfile } from "@/types/locations";

export function LocationMap({ profile }: { profile: ShowroomProfile }) {
  const title = `Map of Oakwood Motor Company in ${profile.name}`;

  return (
    <div className="relative h-56 w-full overflow-hidden bg-page-tint sm:h-64">
      <iframe
        title={title}
        src={getMapEmbedUrl(profile)}
        className="pointer-events-none absolute inset-x-0 -top-10 h-[calc(100%+5.5rem)] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        aria-hidden="true"
      />
      <a
        href={getDirectionsUrl(profile)}
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Open ${title} in Google Maps`}
      />
    </div>
  );
}
