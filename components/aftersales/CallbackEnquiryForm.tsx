"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/cards/Card";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { submitCallbackEnquiry } from "@/features/aftersales/actions";
import { FormPrivacyLink } from "@/features/legal/components/FormPrivacyLink";
import { AFTERSALES_MOCK_NOTICE } from "@/lib/aftersales/copy";

export function CallbackEnquiryForm({
  successHref = routes.aftersales,
  successLabel = "Back to aftersales",
}: {
  successHref?: string;
  successLabel?: string;
}) {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [locationSlug, setLocationSlug] = useState("");
  const [registration, setRegistration] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(undefined);
    const result = await submitCallbackEnquiry({
      name,
      telephone,
      email,
      message,
      locationSlug: locationSlug || undefined,
      registration: registration || undefined,
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setError(result.error);
  }

  if (reference) {
    return (
      <Alert title="We've received your callback request" tone="success">
        <p>Reference {reference}. Oakwood will contact you using the details you gave.</p>
        <p className="mt-3">
          <Button href={successHref} variant="secondary" size="sm">
            {successLabel}
          </Button>
        </p>
      </Alert>
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
        <EligibilityTextInput
          id="enquiry-name"
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={setName}
        />
        <EligibilityTextInput
          id="enquiry-telephone"
          label="Telephone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={setTelephone}
        />
        <EligibilityTextInput
          id="enquiry-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field htmlFor="enquiry-location" label="Preferred location">
          <Select
            id="enquiry-location"
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
        <Field htmlFor="enquiry-registration" label="Registration" hint="Optional">
          <Input
            id="enquiry-registration"
            name="registration"
            autoCapitalize="characters"
            autoComplete="off"
            value={registration}
            onChange={(event) => setRegistration(event.target.value.toUpperCase())}
            className="uppercase tracking-[0.12em]"
          />
        </Field>
        <Field htmlFor="enquiry-message" label="How can we help?" error={error}>
          <textarea
            id="enquiry-message"
            name="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-32 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm"
          />
        </Field>
        {error ? (
          <Alert title={error} tone="danger" />
        ) : (
          <p className="text-caption text-muted">{AFTERSALES_MOCK_NOTICE}</p>
        )}
        <FormPrivacyLink />
        <Button type="submit" busy={busy} className="w-full sm:w-auto">
          Request a callback
        </Button>
      </form>
    </Card>
  );
}
