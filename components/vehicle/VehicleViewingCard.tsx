"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { submitSupportEnquiry } from "@/features/support/actions";
import { reservationConfig } from "@/config/reservation";
import { getShowroomProfile, getStockLocation } from "@/config/locations";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";
import { isReservable } from "@/lib/vehicles/sold";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleViewingCard({ vehicle }: { vehicle: VehicleDetail }) {
  const location = getStockLocation(vehicle.locationSlug);
  const profile = getShowroomProfile(vehicle.locationSlug);
  const salesHours =
    profile?.hoursStatus === "published"
      ? profile.openingHours.filter((row) => row.department === "sales")
      : [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [visit, setVisit] = useState("test-drive");
  const [when, setWhen] = useState("");
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const kind = visit === "viewing" ? "viewing" : "test drive";
    const result = await submitSupportEnquiry({
      enquiryType: "buying",
      name,
      email,
      telephone,
      message: `Please book a ${kind} for stock ${vehicle.stockId} (${vehicle.year} ${vehicle.make} ${vehicle.model}). Preferred time: ${when || "not specified"}.`,
      stockId: vehicle.stockId,
      source: "vehicle",
      marketingConsent: false,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setReference(result.reference);
  }

  return (
    <section
      id="view-this-car"
      aria-labelledby="view-this-car-heading"
      className="scroll-mt-[calc(var(--oak-header-height)+1rem)] rounded-[28px] border border-border bg-surface p-5 md:p-6"
    >
      <h2 id="view-this-car-heading" className="text-h3">
        Book a test drive or viewing
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        This request is for the {vehicle.year} {vehicle.make} {vehicle.model} at{" "}
        {location?.name ?? vehicle.locationName}.
      </p>
      {salesHours.length > 0 ? (
        <ul className="mt-3 space-y-1 text-body-sm">
          {salesHours.map((row) => (
            <li key={`${row.days}-${row.hours}`}>
              <span className="text-muted">{row.days}</span> {row.hours}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-body-sm text-muted">
          Oakwood will confirm a time when we receive your request.
        </p>
      )}
      {reference ? (
        <div className="mt-4" role="status">
          <p className="text-body-sm">
            Request received. Your reference is {reference}.
          </p>
          {isReservable(vehicle) ? (
            <div className="mt-4 rounded-lg border border-border bg-page-tint p-4">
              <p className="text-label">Reserve this car</p>
              <p className="mt-1 text-body-sm text-muted">
                {reservationCopy.fullyRefundable}. Holds the car for{" "}
                {formatHoldPeriod(reservationConfig.holdDurationDays)}. The{" "}
                {reservationAmountLabel(reservationConfig.amount)} is applied to
                the purchase.
              </p>
              <StartReservationButton
                className="mt-3 w-full sm:w-auto"
                stockId={vehicle.stockId}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
          <Field htmlFor="view-name" label="Name">
            <Input id="view-name" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} required />
          </Field>
          <Field htmlFor="view-phone" label="Phone">
            <Input id="view-phone" value={telephone} autoComplete="tel" inputMode="tel" onChange={(event) => setTelephone(event.target.value)} required />
          </Field>
          <Field htmlFor="view-email" label="Email">
            <Input id="view-email" type="email" value={email} autoComplete="email" onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field htmlFor="view-type" label="Visit">
            <Select id="view-type" value={visit} onChange={(event) => setVisit(event.target.value)}>
              <option value="test-drive">Test drive</option>
              <option value="viewing">Viewing</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
          <Field htmlFor="view-when" label="Preferred time">
            <Input id="view-when" value={when} placeholder="e.g. Saturday morning" onChange={(event) => setWhen(event.target.value)} />
          </Field>
          </div>
          {error ? (
            <p className="text-caption text-danger sm:col-span-2" role="alert">
              {error}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" busy={busy}>
              Request this car
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
