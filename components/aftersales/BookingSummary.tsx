import { formatBookingDate, formatBookingRegistration, formatServiceType, formatTimeWindow } from "@/lib/aftersales/format";
import type { AftersalesVehicle } from "@/types/aftersales";
import type { AftersalesBookingType } from "@/config/routes";
import type { BookingTimeWindow } from "@/types/booking";

export function BookingSummary({
  registration,
  vehicle,
  serviceType,
  locationName,
  preferredDate,
  timeWindow,
  contactName,
  contactTelephone,
  contactEmail,
}: {
  registration?: string;
  vehicle?: AftersalesVehicle;
  serviceType?: AftersalesBookingType;
  locationName?: string;
  preferredDate?: string;
  timeWindow?: BookingTimeWindow;
  contactName?: string;
  contactTelephone?: string;
  contactEmail?: string;
}) {
  const rows = [
    {
      label: "Vehicle",
      value: vehicle
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        : formatBookingRegistration(registration) || "Not provided",
    },
    {
      label: "Registration",
      value: formatBookingRegistration(registration) || "Not provided",
    },
    { label: "Service", value: formatServiceType(serviceType) },
    { label: "Location", value: locationName },
    { label: "Date", value: formatBookingDate(preferredDate) },
    { label: "Time", value: formatTimeWindow(timeWindow) },
    { label: "Name", value: contactName },
    { label: "Telephone", value: contactTelephone },
    { label: "Email", value: contactEmail },
  ].filter((row) => row.value);

  return (
    <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-start justify-between gap-2 px-4 py-3"
        >
          <dt className="text-body-sm text-muted">{row.label}</dt>
          <dd className="text-body-sm text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
