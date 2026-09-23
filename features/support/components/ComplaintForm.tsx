"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { SubmissionConfirmation } from "@/features/support/components/SubmissionConfirmation";
import { FormPrivacyLink } from "@/features/legal/components/FormPrivacyLink";
import { SupportErrorState } from "@/features/support/components/SupportErrorState";
import { submitSupportComplaint } from "@/features/support/actions";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { supportComplaintCategories } from "@/lib/support/content";
import {
  COMPLAINTS_FAILURE_TITLE,
  COMPLAINTS_SUBMIT,
  COMPLAINTS_SUCCESS_NEXT,
  COMPLAINTS_SUCCESS_TITLE,
  SUPPORT_CRM_NOTICE,
  SUPPORT_PRIVACY_NOTE,
} from "@/lib/support/copy";
import type { SupportComplaintCategory } from "@/types/support";

export function ComplaintForm({ telephone }: { telephone?: string }) {
  const started = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephoneValue, setTelephoneValue] = useState("");
  const [category, setCategory] = useState<SupportComplaintCategory | "">("");
  const [locationSlug, setLocationSlug] = useState("");
  const [existingReference, setExistingReference] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  const markStarted = () => {
    if (started.current) {
      return;
    }
    started.current = true;
    trackEvent(analyticsEvents.complaintStarted);
  };

  async function submit() {
    setBusy(true);
    setError(undefined);
    if (!category) {
      setBusy(false);
      setError("Choose a complaint category.");
      return;
    }
    const result = await submitSupportComplaint({
      name,
      email,
      telephone: telephoneValue,
      category,
      description,
      locationSlug: locationSlug || undefined,
      existingReference: existingReference || undefined,
      source: "complaints",
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      trackEvent(analyticsEvents.complaintSubmitted, { category });
      return;
    }
    setError(result.error);
    trackEvent(analyticsEvents.complaintFailed, { category });
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

  return (
    <Card>
      <form
        id="complaint-form"
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <h3 className="text-h3">Submit a complaint</h3>
        <EligibilityTextInput
          id="complaint-name"
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(value) => {
            markStarted();
            setName(value);
          }}
        />
        <EligibilityTextInput
          id="complaint-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(value) => {
            markStarted();
            setEmail(value);
          }}
        />
        <EligibilityTextInput
          id="complaint-telephone"
          label="Telephone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephoneValue}
          onChange={(value) => {
            markStarted();
            setTelephoneValue(value);
          }}
        />
        <Field htmlFor="complaint-category" label="What is the complaint about?">
          <Select
            id="complaint-category"
            name="category"
            required
            value={category}
            onChange={(event) => {
              markStarted();
              setCategory(event.target.value as SupportComplaintCategory | "");
            }}
          >
            <option value="">Select a category</option>
            {supportComplaintCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field htmlFor="complaint-location" label="Location" hint="Optional">
          <Select
            id="complaint-location"
            name="location"
            value={locationSlug}
            onChange={(event) => setLocationSlug(event.target.value)}
          >
            <option value="">No preference</option>
            {showrooms.map((location) => (
              <option key={location.slug} value={location.slug}>
                {location.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          htmlFor="complaint-reference"
          label="Order or reservation reference"
          hint="Optional"
        >
          <Input
            id="complaint-reference"
            name="existingReference"
            value={existingReference}
            onChange={(event) => setExistingReference(event.target.value)}
          />
        </Field>
        <Field htmlFor="complaint-description" label="What happened?">
          <textarea
            id="complaint-description"
            name="description"
            rows={6}
            required
            value={description}
            onChange={(event) => {
              markStarted();
              setDescription(event.target.value);
            }}
            className="min-h-40 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm"
          />
        </Field>
        {error ? (
          <SupportErrorState
            title={COMPLAINTS_FAILURE_TITLE}
            onRetry={() => void submit()}
            telephone={telephone}
          />
        ) : (
          <>
            <p className="text-caption text-muted">{SUPPORT_PRIVACY_NOTE}</p>
            <FormPrivacyLink />
            <p className="text-caption text-muted">{SUPPORT_CRM_NOTICE}</p>
          </>
        )}
        <Button type="submit" busy={busy} className="w-full scroll-mb-32 sm:w-auto">
          {COMPLAINTS_SUBMIT}
        </Button>
        {error ? (
          <p className="text-caption text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
