import { Button } from "@/components/ui/Button";
import { BookingSummary } from "@/components/aftersales/BookingSummary";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import { BOOKING_BACK, BOOKING_CONFIRMED, BOOKING_VIEW } from "@/lib/aftersales/copy";
import { formatBookingDate, formatTimeWindow } from "@/lib/aftersales/format";
import type { BookingRecordView } from "@/types/booking";
import type { AftersalesVehicle } from "@/types/aftersales";

export function BookingConfirmation({
  booking,
  vehicle,
  onView,
}: {
  booking: BookingRecordView;
  vehicle?: AftersalesVehicle;
  onView?: () => void;
}) {
  const telephone = showrooms[0]?.telephone;
  const location = showrooms.find((item) => item.slug === booking.locationSlug);

  return (
    <div>
      <h1 className="text-h2">{BOOKING_CONFIRMED}</h1>
      <p className="mt-2 text-body-sm text-muted">{booking.instructions}</p>
      <p className="mt-4 text-label">Reference {booking.reference}</p>
      <BookingSummary
        registration={booking.registration}
        vehicle={vehicle}
        serviceType={booking.serviceType}
        locationName={booking.locationName}
        preferredDate={booking.preferredDate}
        timeWindow={booking.preferredTime}
        contactName={booking.contactName}
      />
      <section className="mt-8" aria-labelledby="booking-next-heading">
        <h2 id="booking-next-heading" className="text-h4">
          What happens next
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-body-sm text-muted">
          {booking.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="mt-6" aria-labelledby="booking-instructions-heading">
        <h2 id="booking-instructions-heading" className="text-h4">
          Important instructions
        </h2>
        <p className="mt-2 text-body-sm text-muted">
          {`Preferred date ${formatBookingDate(booking.preferredDate) || "to be confirmed"}${
            booking.preferredTime
              ? `, ${formatTimeWindow(booking.preferredTime).toLowerCase()}`
              : ""
          }. Bring any service history you have. Oakwood will confirm the appointment before you attend.`}
        </p>
        {location?.telephone ? (
          <p className="mt-2 text-body-sm text-muted">
            {location.name}: {location.telephone}
          </p>
        ) : telephone ? (
          <p className="mt-2 text-body-sm text-muted">Call {telephone}</p>
        ) : null}
      </section>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {onView ? (
          <Button onClick={onView}>{BOOKING_VIEW}</Button>
        ) : (
          <Button href={routes.booking}>{BOOKING_VIEW}</Button>
        )}
        <Button href={routes.home} variant="secondary">
          {BOOKING_BACK}
        </Button>
        {telephone ? (
          <Button href={toTelHref(telephone)} variant="text">
            Call {telephone}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
