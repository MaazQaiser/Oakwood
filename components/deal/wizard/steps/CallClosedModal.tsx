"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { Modal } from "@/components/ui/Dialogs";
import { Field, Input } from "@/components/forms/FormControls";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { submitCallbackRequest } from "@/features/support/actions";
import { getShowroomProfile, showrooms } from "@/config/locations";
import { telephoneError } from "@/lib/aftersales/validation";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { LOCATION_HOURS_NOTICE } from "@/lib/locations/content";
import {
  SHOWROOM_HOUR_OVERRIDES,
  getMockShowroomOpenStatus,
  getSalesTimeSlots,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  STEP4_CB_CONFIRM_BODY,
  STEP4_CB_CONFIRM_TITLE,
  STEP4_CB_SUBMITTING,
  STEP4_CLOSED_BODY,
  STEP4_CLOSED_TITLE,
} from "@/lib/deal/step4-copy";
import { cn } from "@/lib/cn";

type Phase = "form" | "loading" | "success" | "error";

function dayLabel(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function CallClosedModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { dealId, vehicle, draft } = useDealBuilder();
  const nameId = useId();
  const phoneId = useId();
  const defaultSlug = resolveShowroomSlug(vehicle.locationSlug);

  const [showroomSlug, setShowroomSlug] = useState(defaultSlug);
  const [time, setTime] = useState("");
  const [name, setName] = useState(draft.decision?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [nameMessage, setNameMessage] = useState<string>();
  const [phoneMessage, setPhoneMessage] = useState<string>();
  const [timeMessage, setTimeMessage] = useState<string>();
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const status = getMockShowroomOpenStatus(showroomSlug);
  const profile = getShowroomProfile(showroomSlug);
  const salesHours =
    profile?.hoursStatus === "published"
      ? profile.openingHours.filter((row) => row.department === "sales")
      : [];
  const override = SHOWROOM_HOUR_OVERRIDES[status.nextOpenDate];
  const slots = useMemo(
    () =>
      profile?.hoursStatus === "published"
        ? getSalesTimeSlots(status.nextOpenDate).filter((slot) => slot.available)
        : [],
    [profile?.hoursStatus, status.nextOpenDate],
  );
  const whenLabel = `${dayLabel(status.nextOpenDate)} at ${time}`;

  useEffect(() => {
    if (open) return;
    setPhase("form");
    setError(null);
    setTime("");
    setTimeMessage(undefined);
    setReference(null);
  }, [open]);

  useEffect(() => {
    setTime("");
    setTimeMessage(undefined);
  }, [showroomSlug]);

  function validate() {
    const nextName =
      name.trim().split(/\s+/).length < 2
        ? "Enter your first and last name."
        : undefined;
    const nextPhone = telephoneError(phone);
    const nextTime = time ? undefined : "Choose a time.";
    setNameMessage(nextName);
    setPhoneMessage(nextPhone);
    setTimeMessage(nextTime);
    return !nextName && !nextPhone && !nextTime;
  }

  function submit() {
    setError(null);
    if (!validate()) {
      if (name.trim().split(/\s+/).length < 2) {
        document.getElementById(nameId)?.focus();
      } else if (telephoneError(phone)) {
        document.getElementById(phoneId)?.focus();
      }
      return;
    }
    const chosen = slots.find((slot) => slot.time === time);
    if (!chosen) {
      setTime("");
      setTimeMessage("That time isn't available. Please choose another slot.");
      return;
    }
    setPhase("loading");
    void submitCallbackRequest({
      name: name.trim(),
      telephone: phone.trim(),
      locationSlug: showroomSlug,
      dateYmd: status.nextOpenDate,
      time,
      whenLabel,
      stockId: vehicle.stockId,
      dealId,
    }).then((result) => {
      if (!result.ok) {
        setError(result.error);
        setPhase("error");
        return;
      }
      setReference(result.reference);
      setPhase("success");
      trackEvent(analyticsEvents.callbackRequested, { source: "deal-call-now" });
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={phase === "success" ? STEP4_CB_CONFIRM_TITLE : STEP4_CLOSED_TITLE}
    >
      {phase === "loading" ? (
        <div className="flex min-h-40 items-center justify-center">
          <LoadingState label={STEP4_CB_SUBMITTING} />
        </div>
      ) : null}

      {phase === "success" ? (
        <div className="space-y-4">
          <p className="text-body-sm">{STEP4_CB_CONFIRM_BODY}</p>
          <dl className="space-y-2 text-body-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Showroom</dt>
              <dd>Oakwood {profile?.name ?? showroomSlug}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">When</dt>
              <dd>{whenLabel}</dd>
            </div>
            {reference ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Reference</dt>
                <dd>{reference}</dd>
              </div>
            ) : null}
          </dl>
          <Button type="button" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : null}

      {phase === "form" || phase === "error" ? (
        <div className="space-y-4">
          <p className="text-body-sm text-secondary">
            {STEP4_CLOSED_BODY(status.nextOpenLabel)}
          </p>
          <div>
            <p className="text-label">Opening hours</p>
            {salesHours.length > 0 ? (
              <ul className="mt-2 space-y-1 text-body-sm">
                {salesHours.map((row) => (
                  <li key={`${row.days}-${row.hours}`}>
                    <span className="text-muted">{row.days}</span> {row.hours}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-body-sm text-muted">{LOCATION_HOURS_NOTICE}</p>
            )}
            {override ? (
              <p className="mt-2 text-body-sm">
                {dayLabel(status.nextOpenDate)}: {override.label}
              </p>
            ) : (
              <p className="mt-2 text-caption text-muted">
                Callback times for {dayLabel(status.nextOpenDate)}.
              </p>
            )}
          </div>

          <DealChipGroup
            label="Showroom"
            value={showroomSlug}
            columns={2}
            options={showrooms.map((item) => ({
              value: item.slug,
              label: item.name,
            }))}
            onChange={setShowroomSlug}
          />

          <fieldset>
            <legend className="text-label">Callback time</legend>
            {slots.length === 0 ? (
              <p className="mt-2 text-body-sm text-muted" role="status">
                No callback times are published for {dayLabel(status.nextOpenDate)}.
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const selected = time === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setTime(slot.time);
                        setTimeMessage(undefined);
                      }}
                      className={cn(
                        "min-h-11 rounded-xl border px-2 text-caption font-semibold! tabular-nums",
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-ink",
                      )}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
            {timeMessage ? (
              <p className="mt-1 text-caption text-danger" role="alert">
                {timeMessage}
              </p>
            ) : null}
          </fieldset>

          <Field htmlFor={nameId} label="Name" error={nameMessage}>
            <Input
              id={nameId}
              value={name}
              autoComplete="name"
              error={Boolean(nameMessage)}
              onChange={(event) => {
                setName(event.target.value);
                setNameMessage(undefined);
              }}
            />
          </Field>
          <Field htmlFor={phoneId} label="Phone" error={phoneMessage}>
            <Input
              id={phoneId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              error={Boolean(phoneMessage)}
              onChange={(event) => {
                setPhone(event.target.value);
                setPhoneMessage(undefined);
              }}
            />
          </Field>

          {phase === "error" && error ? (
            <Alert title="We couldn't book your callback" tone="warning">
              <p>{error}</p>
              <Button className="mt-3" size="sm" onClick={submit}>
                Try again
              </Button>
            </Alert>
          ) : null}

          <Button type="button" className="w-full" onClick={submit}>
            Book my callback
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
