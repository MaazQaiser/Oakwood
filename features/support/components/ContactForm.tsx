"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { Checkbox, Field, Input, Select } from "@/components/forms/FormControls";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { EnquiryTypeSelector } from "@/features/support/components/EnquiryTypeSelector";
import { SubmissionConfirmation } from "@/features/support/components/SubmissionConfirmation";
import { SupportErrorState } from "@/features/support/components/SupportErrorState";
import { submitSupportEnquiry } from "@/features/support/actions";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  CONTACT_CALLBACK_SUBMIT,
  CONTACT_FAILURE_TITLE,
  CONTACT_FORM_INTRO,
  CONTACT_FORM_TITLE,
  CONTACT_STOCK_HEADING,
  CONTACT_SUBMIT,
  CONTACT_SUCCESS_NEXT,
  CONTACT_SUCCESS_TITLE,
  CONTACT_VEHICLE_HEADING,
  SUPPORT_CRM_NOTICE,
  SUPPORT_MARKETING_CONSENT,
  SUPPORT_MARKETING_SEPARATE,
  SUPPORT_PRIVACY_NOTE,
} from "@/lib/support/copy";
import type { SupportEnquiryType, SupportVehicleContext } from "@/types/support";

export function ContactForm({
  telephone,
  vehicle,
  initialType,
  intent = "message",
}: {
  telephone?: string;
  vehicle?: SupportVehicleContext;
  initialType?: SupportEnquiryType;
  intent?: "message" | "callback";
}) {
  const started = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephoneValue, setTelephoneValue] = useState("");
  const [enquiryType, setEnquiryType] = useState<SupportEnquiryType | "">(
    initialType ?? (vehicle ? "buying" : ""),
  );
  const [locationSlug, setLocationSlug] = useState("");
  const [registration, setRegistration] = useState("");
  const [message, setMessage] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  const markStarted = () => {
    if (started.current) {
      return;
    }
    started.current = true;
    trackEvent(analyticsEvents.contactFormStarted, { source: "contact" });
  };

  async function submit(mode: "message" | "callback") {
    setBusy(true);
    setError(undefined);
    if (!enquiryType) {
      setBusy(false);
      setError("Choose what you need help with.");
      return;
    }
    const result = await submitSupportEnquiry({
      name,
      email,
      telephone: telephoneValue,
      enquiryType,
      message,
      locationSlug: locationSlug || undefined,
      registration: registration || undefined,
      stockId: vehicle?.stockId,
      marketingConsent,
      source: mode === "callback" ? "contact-callback" : "contact",
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      trackEvent(analyticsEvents.contactFormSubmitted, { type: enquiryType });
      if (mode === "callback") {
        trackEvent(analyticsEvents.callbackRequested, { source: "contact-form" });
      }
      return;
    }
    setError(result.error);
    trackEvent(analyticsEvents.contactFormFailed, { type: enquiryType });
  }

  if (reference) {
    return (
      <SubmissionConfirmation
        title={CONTACT_SUCCESS_TITLE}
        reference={reference}
        nextStep={CONTACT_SUCCESS_NEXT}
        href={routes.contact}
        hrefLabel="Back to contact"
      />
    );
  }

  return (
    <Card>
      <form
        id="contact-form"
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(intent);
        }}
      >
        <h3 className="text-h3">{CONTACT_FORM_TITLE}</h3>
        <p className="text-body-sm text-muted">{CONTACT_FORM_INTRO}</p>
        {vehicle ? (
          <div className="rounded-md bg-page px-3 py-3">
            <p className="text-caption text-muted">{CONTACT_VEHICLE_HEADING}</p>
            <p className="text-label">{vehicle.label}</p>
            <p className="mt-2 text-caption text-muted">{CONTACT_STOCK_HEADING}</p>
            <p className="text-body-sm">{vehicle.stockId}</p>
          </div>
        ) : null}
        <EligibilityTextInput
          id="support-name"
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(value) => {
            markStarted();
            setName(value);
          }}
        />
        <EligibilityTextInput
          id="support-email"
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
          id="support-telephone"
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
        <EnquiryTypeSelector
          value={enquiryType}
          onChange={(value) => {
            markStarted();
            setEnquiryType(value);
          }}
        />
        <Field htmlFor="support-location" label="Preferred location" hint="Optional">
          <Select
            id="support-location"
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
        <Field htmlFor="support-registration" label="Vehicle registration" hint="Optional">
          <Input
            id="support-registration"
            name="registration"
            autoCapitalize="characters"
            autoComplete="off"
            value={registration}
            onChange={(event) => setRegistration(event.target.value.toUpperCase())}
            className="uppercase tracking-[0.12em]"
          />
        </Field>
        <Field htmlFor="support-message" label="Message">
          <textarea
            id="support-message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(event) => {
              markStarted();
              setMessage(event.target.value);
            }}
            className="min-h-32 w-full rounded-md border border-border bg-surface px-3 py-3 text-body"
          />
        </Field>
        <div>
          <Checkbox
            id="support-marketing"
            name="marketingConsent"
            label={SUPPORT_MARKETING_CONSENT}
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
          />
            <p className="mt-1 text-caption text-muted">{SUPPORT_MARKETING_SEPARATE}</p>
            <p className="mt-2">
              <Link
                href={routes.privacyPolicy}
                className="text-caption text-primary underline-offset-4 hover:underline"
              >
                Privacy policy
              </Link>
              {" · "}
              <Link
                href={routes.cookiePolicy}
                className="text-caption text-primary underline-offset-4 hover:underline"
              >
                Cookie policy
              </Link>
            </p>
        </div>
        {error ? (
          <SupportErrorState
            title={CONTACT_FAILURE_TITLE}
            onRetry={() => void submit(intent)}
            telephone={telephone}
          />
        ) : (
          <>
            <p className="text-caption text-muted">{SUPPORT_PRIVACY_NOTE}</p>
            <p className="text-caption text-muted">{SUPPORT_CRM_NOTICE}</p>
          </>
        )}
        <div className="flex scroll-mb-32 flex-col gap-3 sm:flex-row">
          <Button type="submit" busy={busy} className="w-full sm:w-auto">
            {intent === "callback" ? CONTACT_CALLBACK_SUBMIT : CONTACT_SUBMIT}
          </Button>
          {intent === "message" ? (
            <Button
              type="button"
              variant="secondary"
              busy={busy}
              onClick={() => void submit("callback")}
            >
              {CONTACT_CALLBACK_SUBMIT}
            </Button>
          ) : null}
        </div>
        {error ? (
          <p className="text-caption text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
