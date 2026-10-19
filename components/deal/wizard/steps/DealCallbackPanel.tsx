"use client";

import { useId, useMemo, useState } from "react";
import { Field, Input } from "@/components/forms/FormControls";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
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
  type ShowroomOpenStatus,
} from "@/lib/deal/opening-status";
import {
  STEP4_BACK_HUB,
  STEP4_CB_CONFIRM_BODY,
  STEP4_CB_CONFIRM_TITLE,
  STEP4_CB_SUBMITTING,
  STEP4_CB_TITLE,
  STEP4_CLOSED_BODY,
  STEP4_CLOSED_HOURS_REF,
  STEP4_CLOSED_TITLE,
  STEP4_DONE,
} from "@/lib/deal/step4-copy";
import { cn } from "@/lib/cn";

type Phase = "form" | "loading" | "confirm";

type Errors = Partial<
  Record<"showroom" | "day" | "time" | "name" | "phone", string>
>;

export function DealCallbackPanel({
  onBack,
  mode,
  closedStatus,
}: {
  onBack: () => void;
  /** `closed` = Call Now out-of-hours; `callback` = Call Me Back CTA. */
  mode: "closed" | "callback";
  closedStatus?: ShowroomOpenStatus;
}) {
  const { vehicle, draft, navigateTo } = useDealBuilder();
  const nameId = useId();
  const phoneId = useId();

  const defaultSlug = resolveShowroomSlug(
    closedStatus?.locationSlug ?? vehicle.locationSlug,
  );
  const openDays = useMemo(() => {
    const days = getNextOpenDays(4);
    if (mode === "closed" && closedStatus?.nextOpenDate) {
      // Prefer next available day first for closed-hours booking.
      const preferred = days.find((d) => d.ymd === closedStatus.nextOpenDate);
      if (preferred) {
        return [preferred, ...days.filter((d) => d.ymd !== preferred.ymd)].slice(
          0,
          4,
        );
      }
    }
    return days;
  }, [closedStatus?.nextOpenDate, mode]);

  const [phase, setPhase] = useState<Phase>("form");
  const [showroomSlug, setShowroomSlug] = useState(defaultSlug);
  const [day, setDay] = useState(
    mode === "closed" && closedStatus?.nextOpenDate
      ? closedStatus.nextOpenDate
      : (openDays[0]?.ymd ?? ""),
  );
  const [time, setTime] = useState("");
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const profile = getShowroomProfile(showroomSlug);
  const slots = useMemo(
    () => (day ? getSalesTimeSlots(day).filter((s) => s.available) : []),
    [day],
  );
  const selectedDay = openDays.find((d) => d.ymd === day);

  function validate(): Errors {
    const next: Errors = {};
    if (!showroomSlug) next.showroom = "Choose a showroom.";
    if (!day) next.day = "Choose a day.";
    if (!time) next.time = "Choose a time.";
    if (name.trim().split(/\s+/).length < 2)
      next.name = "Enter your first and last name.";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a UK phone number.";
    return next;
  }

  function submit() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      if (found.name) document.getElementById(nameId)?.focus();
      else if (found.phone) document.getElementById(phoneId)?.focus();
      return;
    }
    setPhase("loading");
    window.setTimeout(() => {
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
          {STEP4_CB_SUBMITTING}
        </p>
      </div>
    );
  }

  if (phase === "confirm" && selectedDay) {
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <DealResultHero
          eyebrow={mode === "closed" ? "Priority callback" : "Callback"}
          title={STEP4_CB_CONFIRM_TITLE}
          body={STEP4_CB_CONFIRM_BODY}
        />
        <DealStep4Summary />
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Callback details</p>
          <dl className="mt-3 space-y-2 text-body-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Showroom</dt>
              <dd>Oakwood {profile?.name ?? showroomSlug}</dd>
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
              </dd>
            </div>
          </dl>
          {profile ? (
            <p className="mt-3 text-caption text-muted">
              {formatShowroomAddress(profile)}
            </p>
          ) : null}
        </section>
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
          {mode === "closed" && closedStatus ? (
            <>
              <h2 className="text-label">{STEP4_CLOSED_TITLE}</h2>
              <p className="mt-2 text-body-sm text-secondary">
                {STEP4_CLOSED_BODY(closedStatus.nextOpenLabel)}
              </p>
              <p className="mt-3 rounded-[14px] bg-page-tint px-4 py-3 text-caption text-muted">
                {STEP4_CLOSED_HOURS_REF}: {closedStatus.todayHours} (
                {closedStatus.locationName})
              </p>
            </>
          ) : (
            <>
              <h2 className="text-label">{STEP4_CB_TITLE}</h2>
              <p className="mt-1 text-caption text-muted">
                Choose a preferred day and time. We&apos;ll call you back about
                this deal.
              </p>
            </>
          )}

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
              onChange={(value) => {
                setDay(value);
                setTime("");
              }}
            />
            {errors.day ? (
              <p className="mt-1 text-caption text-danger" role="alert">
                {errors.day}
              </p>
            ) : null}
          </div>

          <fieldset className="mt-4">
            <legend className="text-label">Time</legend>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setTime(slot.time);
                      setErrors((e) => ({ ...e, time: undefined }));
                    }}
                    className={cn(
                      "min-h-11 rounded-xl border px-2 text-caption font-semibold! tabular-number",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-ink hover:bg-page-tint",
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
          </div>
        </section>
      </div>
      <DealStepFooter
        showMonthly={false}
        onBack={onBack}
        backLabel={STEP4_BACK_HUB}
        onContinue={submit}
        continueLabel="Book callback"
      />
    </div>
  );
}
