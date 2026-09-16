import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { showrooms } from "@/config/locations";
import { supportRoutes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import {
  BOOKING_CALLBACK,
  BOOKING_CONTACT,
  BOOKING_DIARY_UNAVAILABLE,
  BOOKING_FAILED,
  BOOKING_NO_AVAILABILITY,
  BOOKING_PREFERRED,
  BOOKING_SERVICE_UNAVAILABLE,
  BOOKING_TRY_AGAIN,
  CLAIM_FAILED,
} from "@/lib/aftersales/copy";

export type AftersalesErrorKind =
  | "availability"
  | "no-availability"
  | "service-unavailable"
  | "booking-failed"
  | "claim-failed"
  | "lookup-unavailable"
  | "not-found"
  | "validation"
  | "session";

export function AftersalesErrorState({
  kind,
  message,
  onRetry,
  onContinue,
  continueLabel = BOOKING_PREFERRED,
}: {
  kind: AftersalesErrorKind;
  message?: string;
  onRetry?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
}) {
  const telephone = showrooms[0]?.telephone;
  const title =
    kind === "availability"
      ? BOOKING_DIARY_UNAVAILABLE
      : kind === "no-availability"
        ? BOOKING_NO_AVAILABILITY
        : kind === "service-unavailable"
          ? BOOKING_SERVICE_UNAVAILABLE
          : kind === "booking-failed"
            ? BOOKING_FAILED
            : kind === "claim-failed"
              ? CLAIM_FAILED
              : kind === "lookup-unavailable"
                ? "We couldn't look up that registration right now."
                : kind === "not-found"
                  ? "We couldn't find that registration."
                  : kind === "session"
                    ? "This session has expired."
                    : (message ?? "Check the highlighted fields.");

  return (
    <Alert
      title={title}
      tone={kind === "validation" ? "danger" : "warning"}
    >
      {kind === "availability" || kind === "no-availability" ? (
        <p>You can try again, request a callback, or leave a preferred date and time.</p>
      ) : null}
      {kind === "booking-failed" || kind === "claim-failed" ? (
        <p>You can try again without starting over, or speak to Oakwood.</p>
      ) : null}
      {kind === "lookup-unavailable" || kind === "not-found" ? (
        <p>Check the registration, try again, or enter the vehicle details.</p>
      ) : null}
      {message && kind !== "validation" ? (
        <p className="mt-1">{message}</p>
      ) : null}
      {kind === "validation" && message ? <p>{message}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {onRetry ? (
          <Button size="sm" onClick={onRetry}>
            {BOOKING_TRY_AGAIN}
          </Button>
        ) : null}
        {onContinue ? (
          <Button size="sm" variant="secondary" onClick={onContinue}>
            {continueLabel}
          </Button>
        ) : null}
        <Button size="sm" variant="secondary" href={supportRoutes.bookingEnquiry}>
          {BOOKING_CALLBACK}
        </Button>
        {telephone ? (
          <Button size="sm" variant="text" href={toTelHref(telephone)}>
            {BOOKING_CONTACT}
          </Button>
        ) : (
          <Button size="sm" variant="text" href={supportRoutes.bookingEnquiry}>
            {BOOKING_CONTACT}
          </Button>
        )}
      </div>
    </Alert>
  );
}
