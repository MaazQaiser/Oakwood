import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getBookingUrl } from "@/config/routes";
import {
  BOOKING_LIST_EMPTY,
  BOOKING_LIST_EMPTY_CTA,
  BOOKING_LIST_EYEBROW,
  BOOKING_LIST_HASH,
  BOOKING_LIST_HEADING,
  BOOKING_LIST_SUPPORT,
} from "@/lib/aftersales/copy";
import {
  formatBookingDate,
  formatBookingRegistration,
  formatServiceType,
  formatTimeWindow,
} from "@/lib/aftersales/format";
import type { BookingListEntry } from "@/types/booking";

export function BookingList({
  bookings,
  filter,
}: {
  bookings: BookingListEntry[];
  filter?: BookingListEntry["serviceType"];
}) {
  const items = filter
    ? bookings.filter((item) => item.serviceType === filter)
    : bookings;

  return (
    <Section>
      <Container>
        <header id={BOOKING_LIST_HASH} className="scroll-mt-28">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#002852]">
            {BOOKING_LIST_EYEBROW}
          </p>
          <h2 className="mt-3 text-h2">{BOOKING_LIST_HEADING}</h2>
          <p className="mt-4 max-w-2xl text-body text-muted">{BOOKING_LIST_SUPPORT}</p>
        </header>
        {items.length === 0 ? (
          <div className="mt-8 rounded-[14px] bg-[#ECF3F8] px-5 py-6">
            <p className="text-body-sm text-muted">{BOOKING_LIST_EMPTY}</p>
            <div className="mt-4">
              <Button href={getBookingUrl({ type: "service", source: "aftersales" })}>
                {BOOKING_LIST_EMPTY_CTA}
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4">
            {items.map((booking) => (
              <li
                key={booking.reference}
                className="rounded-[14px] border border-border/80 bg-white p-5"
              >
                <p className="text-caption font-semibold uppercase tracking-[0.08em] text-[#002852]">
                  {formatServiceType(booking.serviceType)}
                </p>
                <p className="mt-2 text-h5">Reference {booking.reference}</p>
                <dl className="mt-4 grid gap-2 text-body-sm sm:grid-cols-2">
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-muted">Vehicle</dt>
                    <dd className="text-ink">
                      {booking.vehicleLabel ||
                        formatBookingRegistration(booking.registration) ||
                        "Not provided"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-muted">Location</dt>
                    <dd className="text-ink">{booking.locationName}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-muted">Date</dt>
                    <dd className="text-ink">
                      {formatBookingDate(booking.preferredDate) || "To be confirmed"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-muted">Time</dt>
                    <dd className="text-ink">
                      {formatTimeWindow(booking.preferredTime) || "To be confirmed"}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
