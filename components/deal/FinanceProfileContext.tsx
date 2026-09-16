"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { getEligibilityUrl } from "@/config/routes";
import { formatAprFloor, formatPounds, formatTerm } from "@/lib/format/money";
import { DEAL_PROFILE_EXPIRED } from "@/lib/deal/copy";

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

export function FinanceProfileContext() {
  const { finance } = useDealBuilder();
  const expiryLabel = finance.profile?.expiresAt
    ? formatExpiry(finance.profile.expiresAt)
    : undefined;

  if (finance.expired) {
    return (
      <Alert title={DEAL_PROFILE_EXPIRED} tone="warning">
        <p>Check eligibility again to continue with a personalised deal.</p>
        <div className="mt-3">
          <Button href={getEligibilityUrl()} size="sm">
            Check eligibility again
          </Button>
        </div>
      </Alert>
    );
  }

  if (!finance.hasProfile || !finance.profile) {
    return (
      <Alert title="Personalised pricing needs a finance profile" tone="info">
        Check eligibility first. Figures below are a representative illustration
        only.
        <div className="mt-3">
          <Button href={getEligibilityUrl()} size="sm">
            Check my eligibility
          </Button>
        </div>
      </Alert>
    );
  }

  const profile = finance.profile;

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
        <li>{formatAprFloor(profile.apr)}</li>
        <li>Up to {formatTerm(profile.maximumTerm)}</li>
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
