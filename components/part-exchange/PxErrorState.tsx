import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { showrooms } from "@/config/locations";
import { supportRoutes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import {
  PX_LOOKUP_FAILED,
  PX_NOT_ELIGIBLE,
  PX_REQUEST_VALUATION,
  PX_REQUEST_FAILED,
  PX_REQUEST_FAILED_BODY,
  PX_SESSION_EXPIRED,
  PX_SPEAK,
  PX_TRY_AGAIN,
  PX_VALUATION_UNAVAILABLE,
} from "@/lib/part-exchange/copy";
import type { PxErrorKind } from "@/types/part-exchange";

export function PxErrorState({
  kind,
  onRetry,
  onManual,
  onRestart,
}: {
  kind: PxErrorKind;
  onRetry?: () => void;
  onManual?: () => void;
  onRestart?: () => void;
}) {
  const telephone = showrooms[0]?.telephone;

  if (kind === "not_found") {
    return (
      <Alert title={PX_LOOKUP_FAILED} tone="warning">
        Check the registration and try again, or enter the vehicle details
        yourself.
        <div className="mt-3 flex flex-wrap gap-2">
          {onRetry ? (
            <Button size="sm" onClick={onRetry}>
              {PX_TRY_AGAIN}
            </Button>
          ) : null}
          {onManual ? (
            <Button size="sm" variant="secondary" onClick={onManual}>
              Enter details manually
            </Button>
          ) : null}
        </div>
      </Alert>
    );
  }

  if (kind === "lookup_unavailable" || kind === "valuation_unavailable") {
    return (
      <Alert title={PX_VALUATION_UNAVAILABLE} tone="warning">
        You can try again, request a valuation from Oakwood, or continue without
        an online estimate.
        <div className="mt-3 flex flex-wrap gap-2">
          {onRetry ? (
            <Button size="sm" onClick={onRetry}>
              {PX_TRY_AGAIN}
            </Button>
          ) : null}
          <Button size="sm" variant="secondary" href={supportRoutes.bookingEnquiry}>
            {PX_REQUEST_VALUATION}
          </Button>
          {telephone ? (
            <Button size="sm" variant="text" href={toTelHref(telephone)}>
              {PX_SPEAK}
            </Button>
          ) : (
            <Button size="sm" variant="text" href={supportRoutes.bookingEnquiry}>
              {PX_SPEAK}
            </Button>
          )}
        </div>
      </Alert>
    );
  }

  if (kind === "not_eligible") {
    return (
      <Alert title={PX_NOT_ELIGIBLE} tone="warning">
        You can try another car, or speak to Oakwood about a valuation.
        <div className="mt-3 flex flex-wrap gap-2">
          {onRestart ? (
            <Button size="sm" onClick={onRestart}>
              Check another car
            </Button>
          ) : null}
          <Button size="sm" variant="secondary" href={supportRoutes.bookingEnquiry}>
            {PX_SPEAK}
          </Button>
        </div>
      </Alert>
    );
  }

  if (kind === "session_expired") {
    return (
      <Alert title={PX_SESSION_EXPIRED} tone="warning">
        {onRestart ? (
          <div className="mt-3">
            <Button size="sm" onClick={onRestart}>
              Start again
            </Button>
          </div>
        ) : null}
      </Alert>
    );
  }

  return (
    <Alert title={PX_REQUEST_FAILED} tone="warning">
      {PX_REQUEST_FAILED_BODY}
      <div className="mt-3 flex flex-wrap gap-2">
        {onRetry ? (
          <Button size="sm" onClick={onRetry}>
            {PX_TRY_AGAIN}
          </Button>
        ) : null}
        {telephone ? (
          <Button size="sm" variant="secondary" href={toTelHref(telephone)}>
            {PX_SPEAK}
          </Button>
        ) : (
          <Button size="sm" variant="secondary" href={supportRoutes.bookingEnquiry}>
            {PX_SPEAK}
          </Button>
        )}
      </div>
    </Alert>
  );
}
