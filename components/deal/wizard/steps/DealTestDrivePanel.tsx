"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Checkbox, Field, Input } from "@/components/forms/FormControls";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { TestDriveConfirmation } from "@/components/deal/wizard/steps/TestDriveConfirmation";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { submitSupportEnquiry } from "@/features/support/actions";
import { emailError, telephoneError } from "@/lib/aftersales/validation";
import { getShowroomProfile, showrooms } from "@/config/locations";
import {
  getShowroomOpenDays,
  getShowroomTimeSlots,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  STEP4_BACK_HUB,
  STEP4_TD_CHANNELS,
  STEP4_TD_CHANNELS_CHECK,
  STEP4_TD_LOADING,
  STEP4_TD_NO_SLOTS,
  STEP4_TD_SUBMIT,
  STEP4_TD_TITLE,
  STEP4_TD_UNAVAILABLE,
} from "@/lib/deal/step4-copy";
import { cn } from "@/lib/cn";

type TdPhase = "form" | "loading" | "confirm";

type Errors = Partial<
  Record<"showroom" | "day" | "time" | "name" | "phone" | "email", string>
>;

export function DealTestDrivePanel({ onBack }: { onBack: () => void }) {
  const { vehicle, draft } = useDealBuilder();
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();

  const defaultSlug = resolveShowroomSlug(vehicle.locationSlug);

  const [phase, setPhase] = useState<TdPhase>("form");
  const [showroomSlug, setShowroomSlug] = useState(defaultSlug);
  const [day, setDay] = useState(
    () => getShowroomOpenDays(defaultSlug, 4)[0]?.ymd ?? "",
  );
  const [time, setTime] = useState("");
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channels, setChannels] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [slotError, setSlotError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const openDays = useMemo(
    () => getShowroomOpenDays(showroomSlug, 4),
    [showroomSlug],
  );
  const profile = getShowroomProfile(showroomSlug);
  const slots = useMemo(
    () => (day ? getShowroomTimeSlots(showroomSlug, day) : []),
    [day, showroomSlug],
  );
  const selectedDay = openDays.find((d) => d.ymd === day);

  useEffect(() => {
    if (openDays.some((item) => item.ymd === day)) return;
    setDay(openDays[0]?.ymd ?? "");
  }, [day, openDays]);

  useEffect(() => {
    setTime("");
    setSlotError(null);
  }, [day, showroomSlug]);

  function validate(): Errors {
    const next: Errors = {};
    if (!showroomSlug) next.showroom = "Choose a showroom.";
    if (!day) next.day = "Choose a day.";
    if (!time) next.time = "Choose a time.";
    if (name.trim().split(/\s+/).length < 2)
      next.name = "Enter your first and last name.";
    const phoneMessage = telephoneError(phone);
    const emailMessage = emailError(email);
    if (phoneMessage) next.phone = phoneMessage;
    if (emailMessage) next.email = emailMessage;
    return next;
  }

  function submit() {
    const found = validate();
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length) {
      const focus =
        (found.name && nameId) ||
        (found.phone && phoneId) ||
        (found.email && emailId);
      if (focus) document.getElementById(focus)?.focus();
      return;
    }

    const slot = getShowroomTimeSlots(showroomSlug, day).find(
      (item) => item.time === time,
    );
    if (!slot?.available || !profile || !selectedDay) {
      setSlotError(STEP4_TD_UNAVAILABLE);
      setTime("");
      return;
    }

    const confirmation = channels
      ? "SMS, WhatsApp and email"
      : "the details already given";
    setPhase("loading");
    void submitSupportEnquiry({
      enquiryType: "buying",
      name: name.trim(),
      email: email.trim(),
      telephone: phone.trim(),
      locationSlug: showroomSlug,
      stockId: vehicle.stockId,
      source: "deal",
      marketingConsent: false,
      message: `Test drive for stock ${vehicle.stockId} (${vehicle.year} ${vehicle.make} ${vehicle.model}) at Oakwood ${profile.name} on ${selectedDay.label} at ${slot.time}. Confirmation preference: ${confirmation}.`,
    }).then((result) => {
      if (!result.ok) {
        setSubmitError(result.error);
        setPhase("form");
        return;
      }
      setReference(result.reference);
      setSlotError(null);
      setPhase("confirm");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary"
          aria-hidden
        />
        <p className="text-label" role="status">
          {STEP4_TD_LOADING}
        </p>
      </div>
    );
  }

  if (phase === "confirm" && profile && selectedDay && reference) {
    return (
      <TestDriveConfirmation
        onBack={onBack}
        request={{
          reference,
          stockId: vehicle.stockId,
          showroomSlug,
          dateYmd: selectedDay.ymd,
          time,
          whenLabel: `${selectedDay.label} · ${time}`,
          channels,
          vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          derivative: vehicle.derivative,
          mileage: vehicle.mileage,
          cashPrice: vehicle.cashPrice,
          imageSrc: vehicle.imageSrc,
          imageAlt: vehicle.imageAlt,
        }}
      />
    );
  }

  if (phase === "confirm") {
    return null;
  }


  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealStep4Summary />
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-label">{STEP4_TD_TITLE}</h2>
          <p className="mt-1 text-body-sm text-ink">
            This car is at {vehicle.locationName}.
          </p>
          <p className="mt-1 text-caption text-muted">
            Choose another Oakwood showroom if you would rather visit there.
          </p>

          <div className="mt-4">
            <DealChipGroup
              label="Showroom"
              value={showroomSlug}
              columns={2}
              options={showrooms.map((s) => ({
                value: s.slug,
                label: s.name,
              }))}
              onChange={setShowroomSlug}
            />
            {errors.showroom ? (
              <p className="mt-1 text-caption text-danger" role="alert">
                {errors.showroom}
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <DealChipGroup
              label="Day"
              value={day}
              columns={4}
              options={openDays.map((d) => ({
                value: d.ymd,
                label: d.shortLabel,
              }))}
              onChange={setDay}
              hint="Next four open sales days from published hours."
            />
            {errors.day ? (
              <p className="mt-1 text-caption text-danger" role="alert">
                {errors.day}
              </p>
            ) : null}
          </div>

          <fieldset className="mt-4">
            <legend className="text-label">Time</legend>
            <p className="mt-1 text-caption text-muted">
              Slots from published hours
              {selectedDay ? ` (${selectedDay.hoursLabel})` : ""}.
            </p>
            {slots.length === 0 ? (
              <p className="mt-2 text-body-sm text-muted" role="status">
                {STEP4_TD_NO_SLOTS}
              </p>
            ) : null}
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    aria-pressed={selected}
                    onClick={() => {
                      setTime(slot.time);
                      setSlotError(null);
                      setErrors((e) => ({ ...e, time: undefined }));
                    }}
                    className={cn(
                      "min-h-11 rounded-xl border px-2 text-caption font-semibold! tabular-number",
                      !slot.available &&
                        "cursor-not-allowed border-border bg-page-tint text-muted line-through opacity-60",
                      slot.available &&
                        selected &&
                        "border-primary bg-primary text-white",
                      slot.available &&
                        !selected &&
                        "border-border bg-surface text-ink hover:bg-page-tint",
                    )}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
            {errors.time ? (
              <p className="mt-1 text-caption text-danger" role="alert">
                {errors.time}
              </p>
            ) : null}
            {slotError ? (
              <div className="mt-3">
                <Alert title="Slot unavailable" tone="warning">
                  {slotError}
                </Alert>
              </div>
            ) : null}
          </fieldset>

          <div className="mt-4 space-y-3">
            <Field htmlFor={nameId} label="Full name" error={errors.name}>
              <Input
                id={nameId}
                value={name}
                autoComplete="name"
                error={Boolean(errors.name)}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((c) => ({ ...c, name: undefined }));
                }}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field htmlFor={phoneId} label="Mobile" error={errors.phone}>
                <Input
                  id={phoneId}
                  type="tel"
                  value={phone}
                  autoComplete="tel"
                  error={Boolean(errors.phone)}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((c) => ({ ...c, phone: undefined }));
                  }}
                />
              </Field>
              <Field htmlFor={emailId} label="Email" error={errors.email}>
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  autoComplete="email"
                  error={Boolean(errors.email)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((c) => ({ ...c, email: undefined }));
                  }}
                />
              </Field>
            </div>
            <Checkbox
              id="td-channels"
              label={STEP4_TD_CHANNELS_CHECK}
              checked={channels}
              onChange={(e) => setChannels(e.target.checked)}
            />
            <p className="text-caption text-muted">{STEP4_TD_CHANNELS}</p>
            <p className="text-caption text-muted">{STEP4_TD_SUBMIT}</p>
            {submitError ? (
              <Alert title="We couldn't book your test drive" tone="warning">
                {submitError}
              </Alert>
            ) : null}
          </div>
        </section>
      </div>
      <DealStepFooter
        showMonthly={false}
        onBack={onBack}
        backLabel={STEP4_BACK_HUB}
        onContinue={submit}
        continueLabel="Request test drive"
      />
    </div>
  );
}
