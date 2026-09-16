import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { getEligibilityUrl } from "@/config/routes";
import { formatAprFloor, formatPounds, formatTerm } from "@/lib/format/money";
import {
  CALCULATOR_ELIGIBILITY_CTA,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_PROFILE_EXPIRED,
} from "@/lib/finance/calculator-copy";
import type { DealFinanceProfileInput } from "@/types/deal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatExpiry(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return "";
  }
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) {
    return "";
  }
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function FinanceProfileIndicator({
  hasProfile,
  expired,
  unavailable,
  profile,
}: {
  hasProfile: boolean;
  expired: boolean;
  unavailable?: boolean;
  profile?: DealFinanceProfileInput;
}) {
  if (unavailable) {
    return (
      <Alert title="Finance profile unavailable" tone="warning">
        <p>
          We couldn't load your finance profile. You can still see a
          representative illustration, or check eligibility again.
        </p>
        <div className="mt-3">
          <Button href={getEligibilityUrl()} size="sm">
            {CALCULATOR_ELIGIBILITY_CTA}
          </Button>
        </div>
      </Alert>
    );
  }

  if (expired) {
    return (
      <Alert title={DEAL_PROFILE_EXPIRED} tone="warning">
        <p>Check eligibility again to continue with a personalised estimate.</p>
        <div className="mt-3">
          <Button href={getEligibilityUrl()} size="sm">
            Check eligibility again
          </Button>
        </div>
      </Alert>
    );
  }

  if (!hasProfile || !profile) {
    return (
      <Alert title="Representative finance illustration" tone="info">
        <p>
          {DEAL_ILLUSTRATION_REPRESENTATIVE} This is not an approval, and these
          figures are not “your rate”.
        </p>
        <div className="mt-3">
          <Button href={getEligibilityUrl()} size="sm">
            {CALCULATOR_ELIGIBILITY_CTA}
          </Button>
        </div>
      </Alert>
    );
  }

  const expiryLabel = profile.expiresAt
    ? formatExpiry(profile.expiresAt)
    : undefined;

  return (
    <section
      aria-labelledby="finance-profile-heading"
      className="rounded-lg border border-border bg-surface p-4"
    >
      <h2 id="finance-profile-heading" className="text-label">
        Your finance profile
      </h2>
      <ul className="mt-3 space-y-1 text-body-sm">
        <li>Up to {formatPounds(profile.maximumAdvance)} available</li>
        <li>
          Your rate, {formatAprFloor(profile.apr)}
        </li>
        <li>Up to {formatTerm(profile.maximumTerm)}</li>
        <li>{profile.productType === "pcp" ? "PCP" : "HP"}</li>
      </ul>
      <p className="mt-2 text-caption text-muted">
        Based on your eligibility result. Not a guaranteed final rate.
      </p>
      {expiryLabel ? (
        <p className="mt-2 text-caption text-muted">
          Your finance eligibility expires on {expiryLabel}.
        </p>
      ) : null}
    </section>
  );
}
