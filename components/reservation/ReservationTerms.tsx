"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { howItWorksSteps, reservationCopy } from "@/lib/reservation/copy";

export function ReservationTerms({
  amount,
  holdDurationDays,
}: {
  amount: number;
  holdDurationDays: number;
}) {
  const steps = howItWorksSteps(amount, holdDurationDays);

  return (
    <section
      aria-labelledby="reservation-terms-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="reservation-terms-heading" className="text-h3">
        How your reservation works
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-body">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-4">
        <Link
          href={routes.reservationTerms}
          className="text-body-sm text-primary underline-offset-4 hover:underline"
          onClick={() => trackEvent(analyticsEvents.reservationTermsViewed)}
        >
          View full reservation terms
        </Link>
        {" · "}
        <Link
          href={routes.cancellationRefund}
          className="text-body-sm text-primary underline-offset-4 hover:underline"
        >
          Cancellation and refund
        </Link>
      </p>
      <p className="mt-2 text-caption text-muted">{reservationCopy.fullyRefundable}.</p>
    </section>
  );
}
