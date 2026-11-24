"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { Field, Input } from "@/components/forms/FormControls";
import { SubmissionConfirmation } from "@/features/support/components/SubmissionConfirmation";
import { FormPrivacyLink } from "@/features/legal/components/FormPrivacyLink";
import { SupportErrorState } from "@/features/support/components/SupportErrorState";
import { submitBeatLoanOffer } from "@/features/finance/beat-loan-offer-actions";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { BEAT_LOAN_OFFER } from "@/lib/finance/beat-loan-offer";
import { SUPPORT_PRIVACY_NOTE } from "@/lib/support/copy";

export function BeatLoanOfferForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [lender, setLender] = useState("");
  const [rateApr, setRateApr] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(undefined);
    const result = await submitBeatLoanOffer({
      name,
      email,
      telephone,
      lender,
      rateApr,
      termMonths,
      notes: notes || undefined,
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      trackEvent(analyticsEvents.financeCtaClicked, {
        action: "beat_loan_offer_submitted",
      });
      return;
    }
    setError(result.error);
  }

  if (reference) {
    return (
      <SubmissionConfirmation
        title={BEAT_LOAN_OFFER.successTitle}
        reference={reference}
        nextStep={BEAT_LOAN_OFFER.successBody}
        href={routes.usedCars}
        hrefLabel="Browse used cars"
      />
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Field htmlFor="beat-name" label="Full name">
          <Input
            id="beat-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
        <Field htmlFor="beat-email" label="Email">
          <Input
            id="beat-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field htmlFor="beat-telephone" label="Telephone">
          <Input
            id="beat-telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            value={telephone}
            onChange={(event) => setTelephone(event.target.value)}
            required
          />
        </Field>
        <Field htmlFor="beat-lender" label="Lender">
          <Input
            id="beat-lender"
            name="lender"
            value={lender}
            onChange={(event) => setLender(event.target.value)}
            placeholder="e.g. bank or loan company"
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="beat-rate" label="Rate (APR)">
            <Input
              id="beat-rate"
              name="rateApr"
              inputMode="decimal"
              value={rateApr}
              onChange={(event) => setRateApr(event.target.value)}
              placeholder="e.g. 9.4"
              required
            />
          </Field>
          <Field htmlFor="beat-term" label="Term (months)">
            <Input
              id="beat-term"
              name="termMonths"
              inputMode="numeric"
              value={termMonths}
              onChange={(event) => setTermMonths(event.target.value)}
              placeholder="e.g. 48"
              required
            />
          </Field>
        </div>
        <Field htmlFor="beat-notes" label="Anything else (optional)">
          <Input
            id="beat-notes"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>

        {error ? (
          <SupportErrorState title={error} onRetry={() => setError(undefined)} />
        ) : null}

        <Button type="submit" busy={busy} className="w-full justify-center bg-[#0061A2]! hover:bg-[#00518a]!">
          {BEAT_LOAN_OFFER.submitLabel}
        </Button>
        <p className="text-caption text-muted">
          {SUPPORT_PRIVACY_NOTE} <FormPrivacyLink />
        </p>
      </form>
    </Card>
  );
}
