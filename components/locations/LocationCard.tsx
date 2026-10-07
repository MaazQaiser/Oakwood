import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { LocationMap } from "@/components/locations/LocationMap";
import { formatShowroomAddress } from "@/config/locations";
import { LOCATION_HOURS_NOTICE } from "@/lib/locations/content";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { countLocationStock } from "@/lib/locations/stock";
import type { ShowroomProfile } from "@/types/locations";

export function LocationCard({
  profile,
  href,
  cta,
  headingLevel = "h2",
}: {
  profile: ShowroomProfile;
  href: string;
  cta?: string;
  headingLevel?: "h2" | "h3";
}) {
  const address = formatShowroomAddress(profile);
  const stockCount = countLocationStock(profile.slug);
  const Heading = headingLevel;
  const directions = getDirectionsUrl(profile);

  return (
    <Card
      as="article"
      padded={false}
      className="flex h-full flex-col overflow-hidden border-0 shadow-sm"
    >
      <LocationMap profile={profile} />
      <div className="flex flex-1 flex-col p-5">
        <Heading className="text-h5">{profile.name}</Heading>
        <p className="mt-1 text-body-sm text-muted">
          Oakwood Motor Company — {profile.name}
        </p>
        <p className="mt-2 min-h-5 text-body-sm">
          {address || profile.region}
        </p>
        <p className="mt-1 min-h-5 text-body-sm tabular-nums">
          {profile.telephone ?? "\u00a0"}
        </p>
        <p className="mt-2 text-body-sm text-muted">{LOCATION_HOURS_NOTICE}</p>
        <p className="mt-2 text-body-sm text-muted">
          Used cars, finance, part exchange, servicing, MOT and warranty.
        </p>
        <p className="mt-2 text-body-sm text-muted tabular-nums">
          {stockCount > 0
            ? `${stockCount} car${stockCount === 1 ? "" : "s"} listed at this location.`
            : "Current stock for this location is listed on the used cars page."}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:flex-wrap">
          <Button href={href}>{cta ?? `View ${profile.name}`}</Button>
          <Button href={directions} variant="text">
            Get directions
          </Button>
        </div>
      </div>
    </Card>
  );
}
