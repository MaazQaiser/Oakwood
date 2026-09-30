import { Button } from "@/components/ui/Button";
import { BookingSummary } from "@/components/aftersales/BookingSummary";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import {
  BOOKING_BACK,
  BOOKING_RECORD_BACK,
  BOOKING_RECORD_HASH,
  BOOKING_RECORD_HEADING,
} from "@/lib/aftersales/copy";
import { formatBookingDate, formatTimeWindow } from "@/lib/aftersales/format";
import type { BookingRecordView } from "@/types/booking";
import type { AftersalesVehicle } from "@/types/aftersales";

export function BookingRecord({
  booking,
  vehicle,
  contactTelephone,
  contactEmail,
  onBack,
}: {
  booking: BookingRecordView;
  vehicle?: AftersalesVehicle;
  contactTelephone?: string;
  contactEmail?: string;
  onBack: () => void;
}) {
  const location = showrooms.find((item) => item.slug === booking.locationSlug);
  const telephone = location?.telephone ?? showrooms[0]?.telephone;

  return (
    <article id={BOOKING_RECORD_HASH} className="scroll-mt-28">
      <p className="text-caption font-semibold uppercase tracking-[0.08em] text-muted">
        Booking record
      </p>
      <h1 className="mt-2 text-h2">{BOOKING_RECORD_HEADING}</h1>
      <p className="mt-2 text-body-sm text-muted">
        Keep this reference if you need to speak to Oakwood about the appointment.
      </p>
      <p className="mt-4 text-label">Reference {booking.reference}</p>
      <BookingSummary
        registration={booking.registration}
        vehicle={vehicle}
        serviceType={booking.serviceType}
        locationName={booking.locationName}
        preferredDate={booking.preferredDate}
        timeWindow={booking.preferredTime}
        contactName={booking.contactName}
        contactTelephone={contactTelephone}
        contactEmail={contactEmail}
      />
      <section className="mt-8" aria-labelledby="booking-record-next">
        <h2 id="booking-record-next" className="text-h4">
          What happens next
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-body-sm text-muted">
          {booking.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="mt-6" aria-labelledby="booking-record-instructions">
        <h2 id="booking-record-instructions" className="text-h4">
          Important instructions
        </h2>
        <p className="mt-2 text-body-sm text-muted">
          {`Preferred date ${formatBookingDate(booking.preferredDate) || "to be confirmed"}${
            booking.preferredTime
              ? `, ${formatTimeWindow(booking.preferredTime).toLowerCase()}`
              : ""
          }. ${booking.instructions}`}
        </p>
        {telephone ? (
          <p className="mt-2 text-body-sm text-muted">Call {telephone}</p>
        ) : null}
      </section>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button variant="secondary" onClick={onBack}>
          {BOOKING_RECORD_BACK}
        </Button>
        <Button href={routes.home} variant="text">
          {BOOKING_BACK}
        </Button>
        {telephone ? (
          <Button href={toTelHref(telephone)} variant="text">
            Call {telephone}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
