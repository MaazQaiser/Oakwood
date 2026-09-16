import { Alert } from "@/components/ui/Alert";
import { formatShowroomAddress } from "@/config/locations";
import { LOCATION_ADDRESS_NOTICE, LOCATION_HOURS_NOTICE } from "@/lib/locations/content";
import type { ShowroomProfile } from "@/types/locations";

export function LocationDetails({ profile }: { profile: ShowroomProfile }) {
  const address = formatShowroomAddress(profile);

  return (
    <section aria-labelledby="location-details-heading">
      <h2 id="location-details-heading" className="text-h3">
        Location details
      </h2>
      <dl className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-body-sm text-muted">Showroom</dt>
          <dd className="text-body-sm">Oakwood Motor Company — {profile.name}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-body-sm text-muted">Address</dt>
          <dd className="text-right text-body-sm">
            {address || profile.region}
          </dd>
        </div>
        {profile.telephone ? (
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-body-sm text-muted">Phone</dt>
            <dd className="text-body-sm">{profile.telephone}</dd>
          </div>
        ) : null}
      </dl>
      {!profile.postcode ? (
        <p className="mt-3 text-caption text-muted">{LOCATION_ADDRESS_NOTICE}</p>
      ) : null}
      {profile.hoursStatus === "cms-pending" ? (
        <div className="mt-4">
          <Alert title="Opening hours" tone="info">
            {LOCATION_HOURS_NOTICE}
          </Alert>
        </div>
      ) : null}
    </section>
  );
}
