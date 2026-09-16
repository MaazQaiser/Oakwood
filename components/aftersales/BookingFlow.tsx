"use client";

import { useEffect, useRef, useState } from "react";
import {
  EligibilityHeader,
  EligibilityLayout,
  EligibilityNavigation,
} from "@/components/eligibility/EligibilityLayout";
import { AftersalesErrorState } from "@/components/aftersales/AftersalesErrorState";
import { AftersalesProgress } from "@/components/aftersales/AftersalesProgress";
import { BookingConfirmation } from "@/components/aftersales/BookingConfirmation";
import { BookingDatePicker } from "@/components/aftersales/BookingDatePicker";
import { BookingSummary } from "@/components/aftersales/BookingSummary";
import { BookingTimePicker } from "@/components/aftersales/BookingTimePicker";
import { LocationSelector } from "@/components/aftersales/LocationSelector";
import { ServiceSelector } from "@/components/aftersales/ServiceSelector";
import { VehicleSelector } from "@/components/aftersales/VehicleSelector";
import { PxManualVehicleForm } from "@/components/part-exchange/PxManualVehicleForm";
import { PxVehicleSummary } from "@/components/part-exchange/PxVehicleSummary";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/Loading";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { FormPrivacyLink } from "@/features/legal/components/FormPrivacyLink";
import { getShowroom } from "@/config/locations";
import { routes, type AftersalesBookingSource, type AftersalesBookingType } from "@/config/routes";
import {
  abandonBooking,
  confirmBookingVehicle,
  getBookingUiState,
  goToBookingStep,
  lookupBookingVehicle,
  refreshBookingAvailability,
  restartBooking,
  retryBookingSubmit,
  saveBookingDetails,
  saveBookingLocation,
  saveBookingManualVehicle,
  saveBookingPreference,
  saveBookingServiceType,
  startBookingSession,
  submitBookingRequest,
  type BookingUiState,
} from "@/features/aftersales/actions";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  AFTERSALES_MOCK_NOTICE,
  BOOKING_PREFERRED,
  LOOKUP_NOTICE,
} from "@/lib/aftersales/copy";
import type { AftersalesVehicle, AftersalesVehicleContext } from "@/types/aftersales";
import type { BookingStep, BookingTimeWindow } from "@/types/booking";

const PROGRESS = [
  { id: "vehicle", label: "Vehicle" },
  { id: "service", label: "Service" },
  { id: "location", label: "Location" },
  { id: "slot", label: "Date and time" },
  { id: "details", label: "Your details" },
  { id: "confirmation", label: "Confirmation" },
];

function progressId(step: BookingStep): string {
  if (step === "lookup" || step === "confirm-vehicle" || step === "manual") {
    return "vehicle";
  }
  if (step === "review" || step === "submitting" || step === "failed") {
    return "details";
  }
  return step;
}

function applyState(
  result: BookingUiState | { error: string },
  setState: (state: BookingUiState) => void,
  setLocalError: (value?: string) => void,
  hydrate?: (state: BookingUiState) => void,
): boolean {
  if ("step" in result) {
    setState(result);
    hydrate?.(result);
    setLocalError(
      result.error &&
        result.error !== "submit" &&
        result.error !== "service" &&
        result.error !== "not_found" &&
        result.error !== "unavailable"
        ? result.error
        : undefined,
    );
    return true;
  }
  setLocalError(result.error);
  return false;
}

export function BookingFlow({
  source,
  serviceType,
  locationSlug,
  context,
}: {
  source: AftersalesBookingSource;
  serviceType?: AftersalesBookingType;
  locationSlug?: string;
  context?: AftersalesVehicleContext;
}) {
  const [state, setState] = useState<BookingUiState | null>(null);
  const [registration, setRegistration] = useState(context?.registration ?? "");
  const [manual, setManual] = useState({
    year: "",
    make: "",
    model: "",
    variant: "",
    fuelType: "",
    transmission: "",
  });
  const [date, setDate] = useState("");
  const [timeWindow, setTimeWindow] = useState<BookingTimeWindow>();
  const [selectedSlotId, setSelectedSlotId] = useState<string>();
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [viewing, setViewing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    void (async () => {
      const existing = await getBookingUiState();
      if (!("empty" in existing) && existing.step === "confirmation" && existing.confirmation) {
        setState(existing);
        trackEvent(analyticsEvents.bookingStarted, { source });
        return;
      }
      const next = await startBookingSession({
        source,
        serviceType,
        locationSlug,
        registration: context?.registration,
        vehicle: context?.vehicle,
      });
      setState(next);
      if (next.registration) {
        setRegistration(next.registration);
      }
      if (next.preferredDate) {
        setDate(next.preferredDate);
      }
      if (next.timeWindow) {
        setTimeWindow(next.timeWindow);
      }
      if (next.selectedSlotId) {
        setSelectedSlotId(next.selectedSlotId);
      }
      if (next.contactName) {
        setName(next.contactName);
      }
      if (next.contactTelephone) {
        setTelephone(next.contactTelephone);
      }
      if (next.contactEmail) {
        setEmail(next.contactEmail);
      }
      trackEvent(analyticsEvents.bookingStarted, { source, type: serviceType });
    })();
  }, [context?.registration, context?.vehicle, locationSlug, serviceType, source]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [state?.step]);

  useEffect(() => {
    const onPageHide = () => {
      if (state?.step !== "confirmation") {
        trackEvent(analyticsEvents.bookingAbandoned, { source });
        void abandonBooking();
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [source, state?.step]);

  const locationName = state?.locationSlug
    ? getShowroom(state.locationSlug)?.name
    : undefined;

  async function run(action: () => Promise<BookingUiState | { error: string }>) {
    setBusy(true);
    const result = await action();
    applyState(result, setState, setLocalError, (next) => {
      if (next.registration) {
        setRegistration(next.registration);
      }
      if (next.preferredDate) {
        setDate(next.preferredDate);
      }
      if (next.timeWindow) {
        setTimeWindow(next.timeWindow);
      }
      if (next.selectedSlotId) {
        setSelectedSlotId(next.selectedSlotId);
      }
      if (next.contactName) {
        setName(next.contactName);
      }
      if (next.contactTelephone) {
        setTelephone(next.contactTelephone);
      }
      if (next.contactEmail) {
        setEmail(next.contactEmail);
      }
    });
    setBusy(false);
    return result;
  }

  if (!state) {
    return (
      <EligibilityLayout>
        <EligibilityHeader eyebrow="Booking" />
        <div className="mt-6">
          <LoadingState label="Loading booking" />
        </div>
      </EligibilityLayout>
    );
  }

  if (state.expired && state.step !== "confirmation") {
    return (
      <EligibilityLayout>
        <EligibilityHeader eyebrow="Booking" />
        <div className="mt-6">
          <AftersalesErrorState
            kind="session"
            onRetry={() => {
              setBusy(true);
              void restartBooking(source).then((next) => {
                setState(next);
                setBusy(false);
              });
            }}
          />
        </div>
      </EligibilityLayout>
    );
  }

  if (state.step === "confirmation" && state.confirmation) {
    if (!viewing) {
      return (
        <EligibilityLayout>
          <EligibilityHeader eyebrow="Booking" />
          <div className="mt-6">
            <BookingConfirmation
              booking={state.confirmation}
              vehicle={state.vehicle}
              onView={() => setViewing(true)}
            />
          </div>
          <p className="mt-6 text-caption text-muted">{AFTERSALES_MOCK_NOTICE}</p>
        </EligibilityLayout>
      );
    }
  }

  const questionId = "booking-question";
  let question = "What's the vehicle registration?";
  let support: string | undefined = LOOKUP_NOTICE;
  let continueLabel = "Look up vehicle";
  let onContinue: (() => void) | undefined = () => {
    void run(() => lookupBookingVehicle({ registration })).then((result) => {
      if ("step" in result && result.vehicle) {
        trackEvent(analyticsEvents.bookingVehicleSelected, { source });
      }
    });
  };
  let onBack: (() => void) | undefined;

  if (state.step === "lookup") {
    question = "What's the vehicle registration?";
    onContinue = undefined;
  } else if (state.step === "confirm-vehicle") {
    question = "Is this your car?";
    support = undefined;
    continueLabel = "Yes, continue";
    onContinue = () => {
      void run(() => confirmBookingVehicle()).then(() => {
        trackEvent(analyticsEvents.bookingVehicleSelected, { source });
      });
    };
    onBack = () => void run(() => goToBookingStep("vehicle"));
  } else if (state.step === "manual") {
    question = "Tell us about the vehicle";
    support = "We'll use these details for your booking request.";
    continueLabel = "Continue";
    onContinue = () =>
      void run(() =>
        saveBookingManualVehicle(manual).then((result) => {
          if ("step" in result) {
            trackEvent(analyticsEvents.bookingVehicleSelected, { source });
          }
          return result;
        }),
      );
    onBack = () => void run(() => goToBookingStep("vehicle"));
  } else if (state.step === "service") {
    question = "What do you need?";
    support = "Service and MOT use the same booking request.";
    continueLabel = "Continue";
    onContinue = () => {
      if (!state.serviceType) {
        setLocalError("Choose a service type.");
        return;
      }
      void run(() => saveBookingServiceType({ serviceType: state.serviceType! })).then(
        () => trackEvent(analyticsEvents.bookingServiceSelected, { type: state.serviceType }),
      );
    };
    onBack = () => void run(() => goToBookingStep("vehicle"));
  } else if (state.step === "location") {
    question = "Which Oakwood location?";
    support = "Oakwood aftersales is available in Bury and Chorley.";
    continueLabel = "Continue";
    onContinue = () => {
      if (!state.locationSlug) {
        setLocalError("Choose Bury or Chorley.");
        return;
      }
      void run(() => saveBookingLocation({ locationSlug: state.locationSlug! })).then(
        () =>
          trackEvent(analyticsEvents.bookingLocationSelected, {
            location: state.locationSlug,
          }),
      );
    };
    onBack = () =>
      void run(() => goToBookingStep(state.serviceType && serviceType ? "confirm-vehicle" : "service"));
  } else if (state.step === "slot") {
    const hasSlots =
      state.availability.status === "available" &&
      state.availability.slots.length > 0;
    question = hasSlots ? "Choose an appointment" : "When would you prefer?";
    support = hasSlots
      ? "Select a time at the location you chose."
      : "Live appointment slots are not connected. Leave a preferred date and time.";
    continueLabel = "Continue";
    onContinue = () => {
      if (hasSlots) {
        const slot = state.availability.slots.find((item) => item.id === selectedSlotId);
        if (!slot) {
          setLocalError("Choose an appointment.");
          return;
        }
        const slotDate = slot.startsAt.slice(0, 10);
        void run(() =>
          saveBookingPreference({
            date: slotDate,
            timeWindow: "any",
            selectedSlotId: slot.id,
          }),
        ).then((result) => {
          if ("step" in result) {
            trackEvent(analyticsEvents.bookingSlotSelected, { source: "slot" });
          }
        });
        return;
      }
      void run(() =>
        saveBookingPreference({
          date,
          timeWindow: timeWindow ?? "any",
        }),
      ).then((result) => {
        if ("step" in result) {
          trackEvent(analyticsEvents.bookingSlotSelected, { window: timeWindow ?? "any" });
        }
      });
    };
    onBack = () => void run(() => goToBookingStep("location"));
  } else if (state.step === "details") {
    question = "Your contact details";
    support = "We'll use these to confirm the appointment.";
    continueLabel = "Review request";
    onContinue = () => void run(() => saveBookingDetails({ name, telephone, email }));
    onBack = () => void run(() => goToBookingStep("slot"));
  } else if (state.step === "review" || state.step === "failed") {
    question = "Check your booking request";
    support = AFTERSALES_MOCK_NOTICE;
    continueLabel = "Submit request";
    onContinue = () => {
      trackEvent(analyticsEvents.bookingSubmitted, { type: state.serviceType });
      void run(() => submitBookingRequest()).then((result) => {
        if ("step" in result && result.step === "confirmation") {
          trackEvent(analyticsEvents.bookingConfirmed, { type: state.serviceType });
        } else if ("step" in result && result.step === "failed") {
          trackEvent(analyticsEvents.bookingFailed, { type: state.serviceType });
        }
      });
    };
    onBack = () => void run(() => goToBookingStep("details"));
  } else if (state.step === "submitting") {
    question = "Sending your booking request";
    support = undefined;
    onContinue = undefined;
  } else if (state.step === "confirmation" && viewing) {
    question = "Your booking";
    support = undefined;
    onContinue = undefined;
    onBack = undefined;
  }

  const body = (
    <>
      {state.step === "vehicle" || state.step === "lookup" ? (
        <VehicleSelector
          value={registration}
          error={localError}
          onChange={(value) => {
            setRegistration(value);
            setLocalError(undefined);
          }}
          onManual={() => void run(() => goToBookingStep("manual"))}
        />
      ) : null}
      {state.step === "confirm-vehicle" && state.vehicle ? (
        <PxVehicleSummary
          vehicle={state.vehicle}
          onNotMyCar={() => void run(() => goToBookingStep("vehicle"))}
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
      {state.step === "service" ? (
        <div className="mt-6">
          <ServiceSelector
            labelledBy={questionId}
            value={state.serviceType}
            onChange={(value) => {
              setLocalError(undefined);
              setState((current) =>
                current ? { ...current, serviceType: value } : current,
              );
            }}
          />
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
      {state.step === "slot" ? (
        <div className="mt-6 space-y-6">
          {checkingSlots ? <LoadingState label="Checking appointments" /> : null}
          {state.availability.status === "available" &&
          state.availability.slots.length > 0 ? (
            <div>
              <p id="booking-time-label" className="text-label">
                Available appointments
              </p>
              <div className="mt-3">
                <BookingTimePicker
                  labelledBy="booking-time-label"
                  value={timeWindow}
                  onChange={setTimeWindow}
                  slots={state.availability.slots}
                  selectedSlotId={selectedSlotId}
                  onSelectSlot={(value) => {
                    setSelectedSlotId(value);
                    setLocalError(undefined);
                  }}
                />
              </div>
              {localError ? (
                <p className="mt-2 text-body-sm text-danger" role="alert">
                  {localError}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <AftersalesErrorState
                kind={
                  state.availability.status === "none"
                    ? "no-availability"
                    : "availability"
                }
                message={state.availability.message}
                onRetry={() => {
                  setCheckingSlots(true);
                  void run(() => refreshBookingAvailability()).finally(() => {
                    setCheckingSlots(false);
                  });
                }}
                onContinue={() => {
                  headingRef.current?.focus();
                }}
                continueLabel={BOOKING_PREFERRED}
              />
              <BookingDatePicker
                value={date}
                error={localError && !date ? localError : undefined}
                onChange={(value) => {
                  setDate(value);
                  setLocalError(undefined);
                }}
              />
              <div>
                <p id="booking-time-label" className="text-label">
                  Preferred time
                </p>
                <div className="mt-3">
                  <BookingTimePicker
                    labelledBy="booking-time-label"
                    value={timeWindow}
                    slots={[]}
                    onChange={(value) => {
                      setTimeWindow(value);
                      setLocalError(undefined);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
      {state.step === "details" ? (
        <div className="mt-6 space-y-4">
          <EligibilityTextInput
            id="booking-name"
            label="Full name"
            autoComplete="name"
            value={name}
            error={localError && !name.trim() ? localError : undefined}
            onChange={setName}
          />
          <EligibilityTextInput
            id="booking-telephone"
            label="Telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={telephone}
            error={localError && telephone.trim().length < 10 ? localError : undefined}
            onChange={setTelephone}
          />
          <EligibilityTextInput
            id="booking-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            error={localError && !email.includes("@") ? localError : undefined}
            onChange={setEmail}
          />
          <FormPrivacyLink />
        </div>
      ) : null}
      {state.step === "review" || state.step === "failed" ? (
        <div className="mt-6 space-y-4">
          {state.error === "service" ? (
            <AftersalesErrorState
              kind="service-unavailable"
              onRetry={() => void run(() => retryBookingSubmit())}
            />
          ) : null}
          {state.step === "failed" && state.error !== "service" ? (
            <AftersalesErrorState
              kind="booking-failed"
              onRetry={() => void run(() => retryBookingSubmit())}
            />
          ) : null}
          <BookingSummary
            registration={state.registration}
            vehicle={state.vehicle}
            serviceType={state.serviceType}
            locationName={locationName}
            preferredDate={state.preferredDate}
            timeWindow={state.timeWindow}
            contactName={state.contactName}
            contactTelephone={state.contactTelephone}
            contactEmail={state.contactEmail}
          />
        </div>
      ) : null}
      {state.step === "submitting" ? (
        <div className="mt-6">
          <LoadingState label="Sending your booking request" />
        </div>
      ) : null}
      {state.step === "confirmation" && viewing && state.confirmation ? (
        <div className="mt-6">
          <BookingConfirmation booking={state.confirmation} vehicle={state.vehicle} />
        </div>
      ) : null}
      {state.error === "not_found" && state.step === "vehicle" ? (
        <div className="mt-4">
          <AftersalesErrorState
            kind="not-found"
            onRetry={() => void run(() => lookupBookingVehicle({ registration }))}
            onContinue={() => void run(() => goToBookingStep("manual"))}
            continueLabel="Enter details manually"
          />
        </div>
      ) : null}
      {state.error === "unavailable" && state.step === "vehicle" ? (
        <div className="mt-4">
          <AftersalesErrorState
            kind="lookup-unavailable"
            onRetry={() => void run(() => lookupBookingVehicle({ registration }))}
            onContinue={() => void run(() => goToBookingStep("manual"))}
            continueLabel="Enter details manually"
          />
        </div>
      ) : null}
      {localError && state.step !== "vehicle" && state.step !== "manual" && state.step !== "slot" && state.step !== "details" ? (
        <div className="mt-4">
          <Alert title={localError} tone="danger" />
        </div>
      ) : null}
    </>
  );

  return (
    <EligibilityLayout
      footer={
        state.step === "confirmation" && viewing ? undefined : (
          <EligibilityNavigation
            onBack={onBack}
            onContinue={onContinue}
            continueLabel={continueLabel}
            continueDisabled={busy || state.step === "lookup" || state.step === "submitting"}
            backHref={onBack ? undefined : routes.aftersales}
            backLabel={onBack ? "Back" : "Aftersales"}
          />
        )
      }
    >
      <EligibilityHeader eyebrow="Booking" />
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
        {body}
      </div>
    </EligibilityLayout>
  );
}

export type { AftersalesVehicle };
