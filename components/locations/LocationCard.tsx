import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { formatShowroomAddress } from "@/config/locations";
import { LOCATION_HOURS_NOTICE } from "@/lib/locations/content";
import { getDirectionsUrl } from "@/lib/locations/directions";
import { countLocationStock } from "@/lib/locations/stock";
import { locationStockImage } from "@/lib/media/stock";
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
    <Card as="article" padded={false} className="overflow-hidden border-0 shadow-sm">
      <div className="relative aspect-[16/10] bg-page-tint">
        <Image
          src={locationStockImage(profile.slug)}
          alt={`Oakwood Motor Company ${profile.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <Heading className="text-h5">{profile.name}</Heading>
        <p className="mt-1 text-body-sm text-muted">
          Oakwood Motor Company — {profile.name}
        </p>
        {address ? (
          <p className="mt-2 text-body-sm">{address}</p>
        ) : (
          <p className="mt-2 text-body-sm text-muted">{profile.region}</p>
        )}
        {profile.telephone ? (
          <p className="mt-1 text-body-sm">{profile.telephone}</p>
        ) : null}
        <p className="mt-2 text-body-sm text-muted">{LOCATION_HOURS_NOTICE}</p>
        <p className="mt-2 text-body-sm text-muted">
          Used cars, finance, part exchange, servicing, MOT and warranty.
        </p>
        <p className="mt-2 text-body-sm text-muted">
          {stockCount > 0
            ? `${stockCount} car${stockCount === 1 ? "" : "s"} listed at this location.`
            : "Current stock for this location is listed on the used cars page."}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button href={href} variant="secondary">
            {cta ?? `View ${profile.name}`}
          </Button>
          <Button href={directions} variant="text">
            Get directions
          </Button>
        </div>
      </div>
    </Card>
  );
}
