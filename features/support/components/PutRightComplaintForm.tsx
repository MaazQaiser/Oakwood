"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { SubmissionConfirmation } from "@/features/support/components/SubmissionConfirmation";
import { SupportErrorState } from "@/features/support/components/SupportErrorState";
import {
  lookupCustomerSale,
  submitSupportComplaint,
} from "@/features/support/actions";
import { routes } from "@/config/routes";
import type { CustomerSaleRecord } from "@/lib/support/customer-sale";
import {
  COMPLAINTS_FAILURE_TITLE,
  COMPLAINTS_SUBMIT,
  COMPLAINTS_SUCCESS_NEXT,
  COMPLAINTS_SUCCESS_TITLE,
} from "@/lib/support/copy";

const CONTACT_TIMES = [
  "Any time",
  "Morning (9am–12pm)",
  "Afternoon (12pm–5pm)",
  "Evening (5pm–6pm)",
] as const;

const RESOLUTION_OPTIONS = [
  "Repair the vehicle",
  "Replace the vehicle",
  "Refund or partial refund",
  "Not sure yet",
] as const;

export function PutRightComplaintForm({ telephone }: { telephone?: string }) {
  const [step, setStep] = useState<"registration" | "details">("registration");
  const [registration, setRegistration] = useState("");
  const [sale, setSale] = useState<CustomerSaleRecord>();
  const [lookupError, setLookupError] = useState<string>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephoneValue, setTelephoneValue] = useState("");
  const [description, setDescription] = useState("");
  const [photoNotes, setPhotoNotes] = useState("");
  const [resolutionPreference, setResolutionPreference] = useState("");
  const [preferredContactTime, setPreferredContactTime] = useState("");
  const [submitError, setSubmitError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function findSale() {
    setBusy(true);
    setLookupError(undefined);
    const result = await lookupCustomerSale(registration);
    setBusy(false);
    if (!result.ok) {
      setLookupError(result.error);
      return;
    }
    setSale(result.sale);
    setStep("details");
  }

  async function submit() {
    if (!sale) {
      return;
    }
    setBusy(true);
    setSubmitError(undefined);
    const result = await submitSupportComplaint({
      name,
      email,
      telephone: telephoneValue,
      category: "buying",
      description,
      locationSlug: sale.locationSlug,
      registration: sale.registration,
      stockId: sale.stockId,
      resolutionPreference: resolutionPreference || undefined,
      preferredContactTime: preferredContactTime || undefined,
      photoNotes: photoNotes || undefined,
      source: "problem-with-your-car",
      need: "put-right",
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setSubmitError(result.error);
  }

  if (reference) {
    return (
      <SubmissionConfirmation
        title={COMPLAINTS_SUCCESS_TITLE}
        reference={reference}
        nextStep={COMPLAINTS_SUCCESS_NEXT}
        href={routes.contact}
        hrefLabel="Contact Oakwood"
      />
    );
  }

  if (step === "registration") {
    return (
      <Card>
        <h3 className="text-h3">Put it right</h3>
        <p className="mt-2 text-body-sm text-muted">
          Enter your registration so we can find your Oakwood purchase.
        </p>
        <div className="mt-4 space-y-4">
          <Field htmlFor="pwr-registration" label="Registration">
            <Input
              id="pwr-registration"
              value={registration}
              onChange={(event) => setRegistration(event.target.value)}
              autoComplete="off"
            />
          </Field>
          {lookupError ? (
            <SupportErrorState
              title={COMPLAINTS_FAILURE_TITLE}
              onRetry={() => void findSale()}
              telephone={telephone}
            />
          ) : null}
          {lookupError ? (
            <p className="text-caption text-danger" role="alert">
              {lookupError}
            </p>
          ) : null}
          <Button type="button" busy={busy} onClick={() => void findSale()}>
            Find my car
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <h3 className="text-h3">Tell us what happened</h3>
        <p className="text-body-sm text-muted">
          {sale?.vehicleLabel} · {sale?.registration} · bought{" "}
          {sale?.soldAt ? new Date(sale.soldAt).toLocaleDateString("en-GB") : ""}
        </p>
        <EligibilityTextInput
          id="pwr-name"
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={setName}
        />
        <EligibilityTextInput
          id="pwr-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <EligibilityTextInput
          id="pwr-telephone"
          label="Telephone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephoneValue}
          onChange={setTelephoneValue}
        />
        <Field htmlFor="pwr-description" label="What is wrong?">
          <textarea
            id="pwr-description"
            rows={5}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-32 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm"
          />
        </Field>
        <Field
          htmlFor="pwr-photos"
          label="Photos"
          hint="Describe what you can send — uploads connect when CRM storage is live."
        >
          <textarea
            id="pwr-photos"
            rows={3}
            value={photoNotes}
            onChange={(event) => setPhotoNotes(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-3 text-sm"
          />
        </Field>
        <Field htmlFor="pwr-resolution" label="Preferred resolution">
          <Select
            id="pwr-resolution"
            value={resolutionPreference}
            onChange={(event) => setResolutionPreference(event.target.value)}
          >
            <option value="">Select an option</option>
            {RESOLUTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>
        <Field htmlFor="pwr-contact-time" label="Best time to contact you">
          <Select
            id="pwr-contact-time"
            value={preferredContactTime}
            onChange={(event) => setPreferredContactTime(event.target.value)}
          >
            <option value="">Any time</option>
            {CONTACT_TIMES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>
        {submitError ? (
          <SupportErrorState
            title={COMPLAINTS_FAILURE_TITLE}
            onRetry={() => void submit()}
            telephone={telephone}
          />
        ) : null}
        <Button type="submit" busy={busy} className="w-full sm:w-auto">
          {COMPLAINTS_SUBMIT}
        </Button>
        {submitError ? (
          <p className="text-caption text-danger" role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </Card>
  );
}