import { bookingDiaryIntegration } from "@/lib/api/integrations";
import {
  BOOKING_DIARY_UNAVAILABLE,
  BOOKING_NO_AVAILABILITY,
} from "@/lib/aftersales/copy";
import type { BookingAvailabilityResult } from "@/types/booking";

/**
 * Live appointment availability is not connected.
 * Do not invent slots. The UI must offer a callback or preferred-time request.
 */
export function getBookingAvailability(): BookingAvailabilityResult {
  void bookingDiaryIntegration;

  return {
    status: "unavailable",
    slots: [],
    message: BOOKING_DIARY_UNAVAILABLE,
  };
}

export function emptyAvailabilityCopy(
  status: BookingAvailabilityResult["status"],
): string {
  if (status === "none") {
    return BOOKING_NO_AVAILABILITY;
  }
  return BOOKING_DIARY_UNAVAILABLE;
}
