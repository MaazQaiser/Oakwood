"use client";

import { useEffect, useRef, useState } from "react";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityNavigation,
} from "@/components/eligibility/EligibilityLayout";
import { AftersalesErrorState } from "@/components/aftersales/AftersalesErrorState";
import { AftersalesProgress } from "@/components/aftersales/AftersalesProgress";
import { LocationSelector } from "@/components/aftersales/LocationSelector";
import { VehicleSelector } from "@/components/aftersales/VehicleSelector";
import { PxManualVehicleForm } from "@/components/part-exchange/PxManualVehicleForm";
import { PxVehicleSummary } from "@/components/part-exchange/PxVehicleSummary";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { FormPrivacyLink } from "@/features/legal/components/FormPrivacyLink";
import { Field } from "@/components/forms/FormControls";
import { showrooms } from "@/config/locations";
import { routes } from "@/config/routes";
import { toTelHref } from "@/lib/format/phone";
import {
  abandonClaim,
  confirmClaimVehicle,
  getClaimUiState,
  goToClaimStep,
  lookupClaimVehicle,
  retryClaimSubmit,
  saveClaimIssue,
  saveClaimLocation,
  saveClaimManualVehicle,
  startClaimSession,
  submitClaimRequest,
  type ClaimUiState,
} from "@/features/aftersales/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  AFTERSALES_MOCK_NOTICE,
  CLAIM_INTRO,
  CLAIM_SUCCESS,
  WARRANTY_ENGINE_NOTICE,
} from "@/lib/aftersales/copy";
import { formatBookingRegistration } from "@/lib/aftersales/format";
import type { AftersalesVehicleContext } from "@/types/aftersales";
import type { WarrantyClaimStep } from "@/types/warranty";

const PROGRESS = [
  { id: "vehicle", label: "Vehicle" },
  { id: "issue", label: "Issue" },
  { id: "location", label: "Location" },
  { id: "details", label: "Your details" },
  { id: "success", label: "Submitted" },
];

function progressId(step: WarrantyClaimStep): string {
  if (step === "intro" || step === "lookup" || step === "confirm-vehicle" || step === "manual") {
    return "vehicle";
  }
  if (step === "submitting" || step === "failed") {
    return "details";
  }
  return step;
}

export function WarrantyClaimForm({
  context,
}: {
  context?: AftersalesVehicleContext;
}) {
  const [state, setState] = useState<ClaimUiState | null>(null);
  const [registration, setRegistration] = useState(context?.registration ?? "");
  const [issue, setIssue] = useState("");
  const [manual, setManual] = useState({
    year: "",
    make: "",
    model: "",
    variant: "",
    fuelType: "",
    transmission: "",
  });
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    void (async () => {
      const existing = await getClaimUiState();
      if (!("empty" in existing) && existing.step === "success") {
        setState(existing);
        return;
      }
      setState({
        step: "intro",
        expired: false,
        registration: context?.registration,
        vehicle: context?.vehicle,
      });
    })();
  }, [context?.registration, context?.vehicle]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [state?.step]);

  useEffect(() => {
    const onPageHide = () => {
      if (state?.step !== "success") {
        void abandonClaim();
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [state?.step]);

  async function run(action: () => Promise<ClaimUiState | { error: string }>) {
    setBusy(true);
    const result = await action();
    if ("step" in result) {
      setState(result);
      if (result.issue) {
        setIssue(result.issue);
      }
      if (result.contactName) {
        setName(result.contactName);
      }
      if (result.contactTelephone) {
        setTelephone(result.contactTelephone);
      }
      if (result.contactEmail) {
        setEmail(result.contactEmail);
      }
      if (result.registration) {
        setRegistration(result.registration);
      }
      setLocalError(
        result.error &&
          result.error !== "submit" &&
          result.error !== "not_found" &&
          result.error !== "unavailable"
          ? result.error
          : undefined,
      );
    } else {
      setLocalError(result.error);
    }
    setBusy(false);
    return result;
  }

  if (!state) {
    return (
      <EligibilityLayout>
        <EligibilityHeader eyebrow="Warranty claim" />
        <div className="mt-6">
          <LoadingState label="Loading claim" />
        </div>
      </EligibilityLayout>
    );
  }

  if (state.step === "intro") {
    return (
      <EligibilityLayout
        footer={
          <EligibilityNavigation
            continueLabel="Start claim"
            onContinue={() => {
              trackEvent(analyticsEvents.warrantyClaimStarted);
              void run(() =>
                startClaimSession({
                  registration: context?.registration,
                  vehicle: context?.vehicle,
                }),
              );
            }}
            continueDisabled={busy}
            backHref={routes.warranty}
            backLabel="Warranty"
          />
        }
      >
        <EligibilityHeader eyebrow="Warranty claim" />
        <h1 ref={headingRef} tabIndex={-1} className="mt-3 text-h1 outline-none">
          {CLAIM_INTRO}
        </h1>
        <p className="mt-3 text-body text-muted">
          Tell us the vehicle, the problem, and how to contact you. We&apos;ll review
          the request and get back to you.
        </p>
        <p className="mt-4 text-caption text-muted">{WARRANTY_ENGINE_NOTICE}</p>
        <p className="mt-2 text-caption text-muted">
          Supporting photos are not collected online yet. Oakwood can ask for them
          after we receive your request.
        </p>
      </EligibilityLayout>
    );
  }

  if (state.step === "success" && state.confirmation) {
    const telephoneNumber = showrooms[0]?.telephone;
    return (
      <EligibilityLayout>
        <EligibilityHeader eyebrow="Warranty claim" />
        <h1 ref={headingRef} tabIndex={-1} className="mt-3 text-h2 outline-none">
          {CLAIM_SUCCESS}
        </h1>
        <p className="mt-2 text-body-sm text-muted">{WARRANTY_ENGINE_NOTICE}</p>
        <p className="mt-4 text-label">Reference {state.confirmation.reference}</p>
        <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          <div className="flex justify-between gap-2 px-4 py-3">
            <dt className="text-body-sm text-muted">Registration</dt>
            <dd className="text-body-sm">
              {formatBookingRegistration(state.confirmation.registration) || "Not provided"}
            </dd>
          </div>
          {state.confirmation.vehicleLabel ? (
            <div className="flex justify-between gap-2 px-4 py-3">
              <dt className="text-body-sm text-muted">Vehicle</dt>
              <dd className="text-body-sm">{state.confirmation.vehicleLabel}</dd>
            </div>
          ) : null}
          {state.confirmation.locationName ? (
            <div className="flex justify-between gap-2 px-4 py-3">
              <dt className="text-body-sm text-muted">Location</dt>
              <dd className="text-body-sm">{state.confirmation.locationName}</dd>
            </div>
          ) : null}
        </dl>
        <h2 className="mt-8 text-h4">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-body-sm text-muted">
          {state.confirmation.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={routes.warranty} variant="secondary">
            Back to warranty
          </Button>
          {telephoneNumber ? (
            <Button href={toTelHref(telephoneNumber)} variant="text">
              Call {telephoneNumber}
            </Button>
          ) : (
            <Button href={routes.bookingEnquiry} variant="text">
              Contact Oakwood
            </Button>
          )}
        </div>
      </EligibilityLayout>
    );
  }

  const questionId = "claim-question";
  let question = "What's the vehicle registration?";
  let support: string | undefined;
  let continueLabel = "Look up vehicle";
  let onContinue: (() => void) | undefined;
  let onBack: (() => void) | undefined;

  if (state.step === "vehicle" || state.step === "lookup") {
    onContinue = () => void run(() => lookupClaimVehicle({ registration }));
    onBack = () =>
      setState((current) => (current ? { ...current, step: "intro" } : current));
  } else if (state.step === "confirm-vehicle") {
    question = "Is this your car?";
    continueLabel = "Yes, continue";
    onContinue = () => void run(() => confirmClaimVehicle());
    onBack = () => void run(() => goToClaimStep("vehicle"));
  } else if (state.step === "manual") {
    question = "Tell us about the vehicle";
    continueLabel = "Continue";
    onContinue = () => void run(() => saveClaimManualVehicle(manual));
    onBack = () => void run(() => goToClaimStep("vehicle"));
  } else if (state.step === "issue") {
    question = "What's the problem?";
    support = "Describe what's happened. Don't send photos here yet.";
    continueLabel = "Continue";
    onContinue = () => void run(() => saveClaimIssue({ issue }));
    onBack = () => void run(() => goToClaimStep("confirm-vehicle"));
  } else if (state.step === "location") {
    question = "Preferred Oakwood location";
    continueLabel = "Continue";
    onContinue = () => {
      if (!state.locationSlug) {
        setLocalError("Choose Bury or Chorley.");
        return;
      }
      void run(() => saveClaimLocation({ locationSlug: state.locationSlug! }));
    };
    onBack = () => void run(() => goToClaimStep("issue"));
  } else if (state.step === "details" || state.step === "failed") {
    question = "Your contact details";
    support = AFTERSALES_MOCK_NOTICE;
    continueLabel = "Submit claim";
    onContinue = () => {
      void run(() => submitClaimRequest({ name, telephone, email })).then((result) => {
        if (result && "step" in result && result.step === "success") {
          trackEvent(analyticsEvents.warrantyClaimSubmitted);
        }
      });
    };
    onBack = () => void run(() => goToClaimStep("location"));
  } else if (state.step === "submitting") {
    question = "Sending your claim";
    onContinue = undefined;
  }

  return (
    <EligibilityLayout
      footer={
        <EligibilityNavigation
          onBack={onBack}
          onContinue={onContinue}
          continueLabel={continueLabel}
          continueDisabled={busy || state.step === "submitting"}
          backHref={onBack ? undefined : routes.warranty}
          backLabel={onBack ? "Back" : "Warranty"}
        />
      }
    >
      <EligibilityHeader eyebrow="Warranty claim" />
      <div className="mt-4">
        <AftersalesProgress steps={PROGRESS} current={progressId(state.step)} />
      </div>
      <div className="mt-6 pb-24">
        <h1
          id={questionId}
          ref={headingRef}
          tabIndex={-1}
          className="text-h2 outline-none"
        >
          {question}
        </h1>
        {support ? <p className="mt-2 text-body-sm text-muted">{support}</p> : null}
        {state.step === "vehicle" || state.step === "lookup" ? (
          <VehicleSelector
            value={registration}
            error={localError}
            onChange={(value) => {
              setRegistration(value);
              setLocalError(undefined);
            }}
            onManual={() => void run(() => goToClaimStep("manual"))}
          />
        ) : null}
        {state.step === "confirm-vehicle" && state.vehicle ? (
          <PxVehicleSummary
            vehicle={state.vehicle}
            onNotMyCar={() => void run(() => goToClaimStep("vehicle"))}
          />
        ) : null}
        {state.step === "manual" ? (
          <PxManualVehicleForm
            year={manual.year}
            make={manual.make}
            model={manual.model}
            variant={manual.variant}
            fuelType={manual.fuelType}
            transmission={manual.transmission}
            error={localError}
            onChange={(field, value) =>
              setManual((current) => ({ ...current, [field]: value }))
            }
          />
        ) : null}
        {state.step === "issue" ? (
          <div className="mt-6">
            <Field htmlFor="claim-issue" label="Describe the issue" error={localError}>
              <textarea
                id="claim-issue"
                name="issue"
                rows={5}
                value={issue}
                onChange={(event) => {
                  setIssue(event.target.value);
                  setLocalError(undefined);
                }}
                className="min-h-32 w-full rounded-md border border-border bg-surface px-3 py-3 text-body"
              />
            </Field>
          </div>
        ) : null}
        {state.step === "location" ? (
          <div className="mt-6">
            <LocationSelector
              labelledBy={questionId}
              value={state.locationSlug}
              onChange={(value) => {
                setLocalError(undefined);
                setState((current) =>
                  current ? { ...current, locationSlug: value } : current,
                );
              }}
            />
          </div>
        ) : null}
        {state.step === "details" || state.step === "failed" ? (
          <div className="mt-6 space-y-4">
            {state.step === "failed" ? (
              <AftersalesErrorState
                kind="claim-failed"
                onRetry={() => void run(() => retryClaimSubmit())}
              />
            ) : null}
            <EligibilityTextInput
              id="claim-name"
              label="Full name"
              autoComplete="name"
              value={name}
              onChange={setName}
            />
            <EligibilityTextInput
              id="claim-telephone"
              label="Telephone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telephone}
              onChange={setTelephone}
            />
            <EligibilityTextInput
              id="claim-email"
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <FormPrivacyLink />
          </div>
        ) : null}
        {state.step === "submitting" ? (
          <div className="mt-6">
            <LoadingState label="Sending your warranty claim" />
          </div>
        ) : null}
        {state.error === "not_found" && state.step === "vehicle" ? (
          <div className="mt-4">
            <AftersalesErrorState
              kind="not-found"
              onRetry={() => void run(() => lookupClaimVehicle({ registration }))}
              onContinue={() => void run(() => goToClaimStep("manual"))}
              continueLabel="Enter details manually"
            />
          </div>
        ) : null}
        {state.error === "unavailable" && state.step === "vehicle" ? (
          <div className="mt-4">
            <AftersalesErrorState
              kind="lookup-unavailable"
              onRetry={() => void run(() => lookupClaimVehicle({ registration }))}
              onContinue={() => void run(() => goToClaimStep("manual"))}
              continueLabel="Enter details manually"
            />
          </div>
        ) : null}
        {localError && state.step !== "vehicle" && state.step !== "issue" && state.step !== "manual" ? (
          <div className="mt-4">
            <Alert title={localError} tone="danger" />
          </div>
        ) : null}
      </div>
    </EligibilityLayout>
  );
}
