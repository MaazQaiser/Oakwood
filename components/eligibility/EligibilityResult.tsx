"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityTrustMessage,
} from "@/components/eligibility/EligibilityLayout";
import { SaveAndResume } from "@/components/eligibility/SaveAndResume";
import { useEligibilityJourney } from "@/components/eligibility/EligibilityJourneyProvider";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getEligibilityUiState } from "@/features/eligibility/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  INDICATIVE_DISCLAIMER,
  SOFT_SEARCH_DISCLAIMER,
  TOTAL_PAYABLE_DISCLAIMER,
} from "@/lib/eligibility/copy";
import { formatAprFloor, formatPounds, formatTerm } from "@/lib/format/money";
import { getFinanceIntentUrl, getSearchUrl, routes } from "@/config/routes";
import { FINANCE_INTENTS } from "@/config/finance";
import { showrooms } from "@/config/locations";
import type { EligibilityResultDisplay } from "@/types/eligibility";

function Disclaimers() {
  return (
    <ul className="mt-6 flex flex-col gap-2 text-caption text-muted">
      <li>{INDICATIVE_DISCLAIMER}</li>
      <li>{SOFT_SEARCH_DISCLAIMER}</li>
      <li>{TOTAL_PAYABLE_DISCLAIMER}</li>
    </ul>
  );
}

export function EligibilityBorrowingTable({
  rows,
}: {
  rows: EligibilityResultDisplay["borrowingRows"];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-h3">See how your deposit changes what you can borrow</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left">
          <caption className="sr-only">
            Available borrowing by deposit amount
          </caption>
          <thead>
            <tr className="border-b border-border text-caption text-muted">
              <th scope="col" className="py-2 pr-4 text-label">
                Deposit
              </th>
              <th scope="col" className="py-2 text-label">
                Available borrowing
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.deposit} className="border-b border-border">
                <td className="py-3 pr-4">
                  <FinancialNumber value={formatPounds(row.deposit)} size="sm" />
                </td>
                <td className="py-3">
                  <FinancialNumber value={formatPounds(row.available)} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultActions({
  primaryHref,
  onPrimary,
  showSave,
}: {
  primaryHref: string;
  onPrimary?: () => void;
  showSave?: boolean;
}) {
  const journey = useEligibilityJourney();

  return (
    <div className="mt-8 flex flex-col gap-3">
      <Button href={primaryHref} onClick={onPrimary} className="w-full sm:w-auto">
        Browse cars within my budget
      </Button>
      <Button href={routes.usedCars} variant="secondary" className="w-full sm:w-auto">
        Browse all cars
      </Button>
      {showSave ? (
        <SaveAndResume
          answers={journey.answers}
          ctaLabel="Save my result"
        />
      ) : null}
    </div>
  );
}

export function EligibilityAcceptedResult({
  display,
}: {
  display: EligibilityResultDisplay;
}) {
  const product =
    display.productType === "hp" ? "Hire Purchase" : "Personal Contract Purchase";

  return (
    <div>
      <h1 className="text-h2">Your finance profile is ready.</h1>
      <p className="mt-3 text-body text-muted">
        Based on your soft search, you have an indicative finance profile to
        start shopping with.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="text-caption text-muted">Your indicative rate</dt>
          <dd className="mt-1 text-h3">{formatAprFloor(display.apr)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="text-caption text-muted">Approved amount</dt>
          <dd className="mt-1">
            <FinancialNumber value={`Up to ${formatPounds(display.maxAdvance)}`} />
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="text-caption text-muted">Term</dt>
          <dd className="mt-1 text-h3">Up to {formatTerm(display.term)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="text-caption text-muted">Finance type</dt>
          <dd className="mt-1 text-h3">{product}</dd>
        </div>
      </dl>
      <EligibilityBorrowingTable rows={display.borrowingRows} />
      <Disclaimers />
    </div>
  );
}

export function EligibilityConditionalResult({
  display,
}: {
  display: EligibilityResultDisplay;
}) {
  const finance = useCustomerFinance();
  const shortfall = display.depositShortfall ?? 0;
  const vehicleAmount = display.selectedVehicleAmount;
  const affordableHref = getSearchUrl({ affordable: 1 });

  return (
    <div>
      <h1 className="text-h2">Your finance profile is ready.</h1>
      <p className="mt-3 text-body text-muted">
        Your current finance profile covers up to{" "}
        {formatPounds(display.maxAdvance)}.
      </p>
      {vehicleAmount ? (
        <div className="mt-6">
          <Alert
            title={
              shortfall > 0
                ? `You're ${formatPounds(shortfall)} short of the deposit needed for this vehicle.`
                : `This car is above your current approved amount.`
            }
            tone="info"
          >
            You can currently borrow up to {formatPounds(display.maxAdvance)}.
            Selected vehicle: {formatPounds(vehicleAmount)}. Increase your deposit
            or browse cars within your budget. We do not extend the finance term
            automatically to make a car affordable.
          </Alert>
        </div>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {shortfall > 0 ? (
          <Button
            href={affordableHref}
            onClick={() => {
              finance.setDeposit(display.deposit + shortfall);
              trackEvent(analyticsEvents.browseFromEligibilityClicked, {
                route: "add_deposit",
              });
            }}
          >
            Increase my deposit
          </Button>
        ) : null}
        <Button
          href={affordableHref}
          variant="secondary"
          onClick={() =>
            trackEvent(analyticsEvents.browseFromEligibilityClicked, {
              route: "within_profile",
            })
          }
        >
          Browse cars within my budget
        </Button>
      </div>
      <EligibilityBorrowingTable rows={display.borrowingRows} />
      <Disclaimers />
    </div>
  );
}

export function EligibilityReferResult() {
  const teamPhone = showrooms[0]?.telephone;

  return (
    <div>
      <h1 className="text-h2">
        We need a little more information before we can confirm your finance
        options.
      </h1>
      <p className="mt-3 text-body text-muted">
        A member of the Oakwood team will review this and contact you.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <p className="text-label">The Oakwood finance team</p>
        <p className="mt-1 text-body-sm text-muted">
          We&apos;ll be in touch within one working day.
        </p>
        {teamPhone ? (
          <p className="mt-2 text-body-sm">
            <a className="text-primary underline-offset-4 hover:underline" href={`tel:${teamPhone}`}>
              {teamPhone}
            </a>
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={routes.usedCars}>Continue browsing cars</Button>
        <Button href={routes.bookingEnquiry} variant="secondary">
          Contact Oakwood
        </Button>
      </div>
    </div>
  );
}

export function EligibilityAlternativeFinanceResult() {
  const intents = FINANCE_INTENTS.filter((intent) =>
    ["bad-credit", "ccj", "no-deposit", "self-employed", "first-time-buyer"].includes(
      intent.slug,
    ),
  );

  return (
    <div>
      <h1 className="text-h2">Let&apos;s look at your options.</h1>
      <p className="mt-3 text-body text-muted">
        We couldn&apos;t confirm a finance option through this route, but there
        may still be other ways we can help.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={routes.finance}>Explore other finance options</Button>
        <Button href={routes.usedCars} variant="secondary">
          Browse cars
        </Button>
        <Button href={routes.bookingEnquiry} variant="text">
          Speak to Oakwood
        </Button>
      </div>
      <ul className="mt-8 flex flex-col gap-2">
        {intents.map((intent) => (
          <li key={intent.slug}>
            <Button href={getFinanceIntentUrl(intent.slug)} variant="text" className="px-0">
              {intent.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EligibilityResult() {
  const router = useRouter();
  const journey = useEligibilityJourney();
  const finance = useCustomerFinance();
  const tracked = useRef(false);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) {
      return;
    }
    restored.current = true;
    if (journey.display && journey.outcome) {
      return;
    }
    void getEligibilityUiState().then((state) => {
      if (state.status === "empty") {
        router.replace(routes.eligibility);
        return;
      }
      journey.applyUiState(state);
    });
  }, [journey, router]);

  useEffect(() => {
    if (!journey.outcome || tracked.current) {
      return;
    }
    tracked.current = true;
    trackEvent(analyticsEvents.eligibilityResultReceived, {
      outcome: journey.outcome,
    });
    trackEvent(analyticsEvents.eligibilityCompleted);

    if (journey.outcome === "accepted") {
      trackEvent(analyticsEvents.eligibilityResultAccepted);
    } else if (journey.outcome === "conditional") {
      trackEvent(analyticsEvents.eligibilityResultConditional);
    } else if (journey.outcome === "refer") {
      trackEvent(analyticsEvents.eligibilityResultRefer);
    } else if (journey.outcome === "alternative") {
      trackEvent(analyticsEvents.eligibilityAlternativeRoute);
    }

    if (
      journey.display &&
      (journey.outcome === "accepted" || journey.outcome === "conditional")
    ) {
      finance.applyEligibilityProfile({
        mode: "personalised",
        apr: journey.display.apr,
        maxAdvance: journey.display.maxAdvance,
        deposit: journey.display.deposit,
        term: journey.display.term,
      });
    }
  }, [finance, journey.display, journey.outcome]);

  if (journey.machine === "EXPIRED") {
    return (
      <EligibilityLayout>
        <EligibilityHeader />
        <h1 className="mt-4 text-h2">Your session has expired.</h1>
        <p className="mt-3 text-body text-muted">
          Please verify your details to continue.
        </p>
        <div className="mt-8">
          <Button href={routes.eligibility}>Start eligibility check</Button>
        </div>
      </EligibilityLayout>
    );
  }

  const affordableHref = getSearchUrl({ affordable: 1 });
  const onBrowse = () =>
    trackEvent(analyticsEvents.browseFromEligibilityClicked);

  return (
    <EligibilityLayout>
      <EligibilityHeader />
      <div className="mt-6">
        {journey.outcome === "conditional" && journey.display ? (
          <EligibilityConditionalResult display={journey.display} />
        ) : journey.outcome === "refer" ? (
          <EligibilityReferResult />
        ) : journey.outcome === "alternative" ? (
          <EligibilityAlternativeFinanceResult />
        ) : journey.display ? (
          <EligibilityAcceptedResult display={journey.display} />
        ) : (
          <LoadingState label="Loading your result" />
        )}
      </div>

      {journey.outcome === "accepted" && journey.display ? (
        <ResultActions
          primaryHref={affordableHref}
          onPrimary={onBrowse}
          showSave
        />
      ) : null}

      {journey.emailSent && journey.display?.maskedEmail ? (
        <p className="mt-6 text-caption text-muted" role="status">
          Your result has been emailed to {journey.display.maskedEmail}.
        </p>
      ) : null}

      <EligibilityTrustMessage className="mt-6" />
    </EligibilityLayout>
  );
}
