"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Checkbox, Field, Input } from "@/components/forms/FormControls";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { dealSettings } from "@/config/deal-settings";
import {
  formatShowroomAddress,
  getShowroomProfile,
  showrooms,
} from "@/config/locations";
import { getVehicleUrl } from "@/config/routes";
import {
  getNextOpenDays,
  getSalesTimeSlots,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  STEP4_BACK_HUB,
  STEP4_DONE,
  STEP4_TD_CHANNELS,
  STEP4_TD_CHANNELS_CHECK,
  STEP4_TD_CONFIRM_BODY,
  STEP4_TD_CONFIRM_TITLE,
  STEP4_TD_LOADING,
  STEP4_TD_SUBMIT,
  STEP4_TD_TITLE,
  STEP4_TD_UNAVAILABLE,
  STEP4_TD_WALKAROUND_PLACEHOLDER,
  STEP4_TD_WHAT_TO_BRING,
} from "@/lib/deal/step4-copy";
import { cn } from "@/lib/cn";

type TdPhase = "form" | "loading" | "confirm";

type Errors = Partial<
  Record<"showroom" | "day" | "time" | "name" | "phone" | "email", string>
>;

export function DealTestDrivePanel({ onBack }: { onBack: () => void }) {
  const { vehicle, draft, navigateTo } = useDealBuilder();
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();

  const defaultSlug = resolveShowroomSlug(vehicle.locationSlug);
  const openDays = useMemo(() => getNextOpenDays(4), []);

  const [phase, setPhase] = useState<TdPhase>("form");
  const [showroomSlug, setShowroomSlug] = useState(defaultSlug);
  const [day, setDay] = useState(openDays[0]?.ymd ?? "");
  const [time, setTime] = useState("");
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channels, setChannels] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [slotError, setSlotError] = useState<string | null>(null);

  const profile = getShowroomProfile(showroomSlug);
  const slots = useMemo(() => (day ? getSalesTimeSlots(day) : []), [day]);
  const selectedDay = openDays.find((d) => d.ymd === day);

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
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a UK phone number.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    return next;
  }

  function submit() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const focus =
        (found.name && nameId) ||
        (found.phone && phoneId) ||
        (found.email && emailId);
      if (focus) document.getElementById(focus)?.focus();
      return;
    }

    const slot = slots.find((s) => s.time === time);
    setPhase("loading");
    window.setTimeout(() => {
      if (!slot?.available) {
        setSlotError(STEP4_TD_UNAVAILABLE);
        setPhase("form");
        return;
      }
      setSlotError(null);
      setPhase("confirm");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
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

  if (phase === "confirm" && profile && selectedDay) {
    const mapsQuery = encodeURIComponent(
      `Oakwood Motor Company ${profile.name} ${profile.postcode ?? ""}`,
    );
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <DealResultHero
          eyebrow="Test drive"
          title={STEP4_TD_CONFIRM_TITLE}
          body={STEP4_TD_CONFIRM_BODY}
        />
        <DealStep4Summary />

        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Your appointment</p>
          <dl className="mt-3 space-y-2 text-body-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Showroom</dt>
              <dd>Oakwood {profile.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">When</dt>
              <dd>
                {selectedDay.label} · {time}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Contact</dt>
              <dd className="text-right">
                {name}
                <br />
                {phone}
                <br />
                {email}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Showroom</p>
          <p className="mt-2 flex items-start gap-2 text-body-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              Oakwood {profile.name}
              <br />
              {formatShowroomAddress(profile)}
            </span>
          </p>
          {profile.telephone ? (
            <p className="mt-2 flex items-center gap-2 text-body-sm">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              <a
                href={`tel:${profile.telephone.replace(/\s/g, "")}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {profile.telephone}
              </a>
            </p>
          ) : null}
          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-page-tint">
            <iframe
              title={`Map of Oakwood ${profile.name}`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${mapsQuery}&z=14&output=embed`}
            />
          </div>
        </section>

        {dealSettings.walkaroundVideo === "on" ? (
          <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <p className="text-label">Walkaround video</p>
            <div className="mt-3 flex aspect-[9/16] max-h-72 items-center justify-center rounded-xl bg-ink px-6 text-center">
              <p className="text-caption text-white/80">
                {STEP4_TD_WALKAROUND_PLACEHOLDER}
              </p>
            </div>
          </section>
        ) : null}

        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">What to bring</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm">
            {STEP4_TD_WHAT_TO_BRING.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <Alert title="Confirmation messages" tone="info">
          <ul className="mt-1 list-disc space-y-1 pl-4 text-body-sm">
            <li>Email — not sent</li>
            <li>SMS — not sent</li>
            <li>WhatsApp — not sent</li>
            <li>Reminder two hours before — not scheduled</li>
          </ul>
          <p className="mt-2 text-caption">{STEP4_TD_CHANNELS}</p>
        </Alert>

        <DealStepFooter
          showMonthly={false}
          onBack={onBack}
          backLabel={STEP4_BACK_HUB}
          onContinue={() => navigateTo(getVehicleUrl(vehicle.slug))}
          continueLabel={STEP4_DONE}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealStep4Summary />
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-label">{STEP4_TD_TITLE}</h2>
          <p className="mt-1 text-caption text-muted">
            This car is at {vehicle.locationName}. You can change showroom if
            needed.
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
