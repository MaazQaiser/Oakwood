"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { ValuationEntryDrawer } from "@/components/valuation-entry/ValuationEntryDrawer";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  formatRegistration,
  mileageError,
  normaliseRegistration,
  registrationError,
} from "@/lib/part-exchange/validation";
import { mockLookupRegistration } from "@/lib/valuation-entry/mock";
import {
  VE_CARD_CTA,
  VE_CARD_HEADING,
  VE_CARD_REASSURANCE,
  VE_CARD_SUPPORT,
  VE_LOOKUP_LABEL,
} from "@/lib/valuation-entry/copy";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

function formatMileageInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (!digits) {
    return "";
  }
  return Number(digits).toLocaleString("en-GB");
}

export function ValuationEntryCard() {
  const { vehicle, deposit, term, financeType } = useVehicleDeal();
  const regId = useId();
  const milesId = useId();
  const [registration, setRegistration] = useState("");
  const [mileage, setMileage] = useState("");
  const [regError, setRegError] = useState<string>();
  const [mileError, setMileError] = useState<string>();
  const [lookupError, setLookupError] = useState<string>();
  const [lookingUp, setLookingUp] = useState(false);
  const [found, setFound] = useState<PxIdentifiedVehicle>();
  const [open, setOpen] = useState(false);

  async function start() {
    const nextReg = registrationError(registration);
    const nextMiles = mileageError(mileage);
    setRegError(nextReg);
    setMileError(nextMiles);
    setLookupError(undefined);
    if (nextReg || nextMiles) {
      return;
    }
    setLookingUp(true);
    trackEvent(analyticsEvents.pxStarted, {
      source: "entry_hook",
      stockId: vehicle.stockId,
    });
    const result = await mockLookupRegistration(
      normaliseRegistration(registration),
    );
    setLookingUp(false);
    if (!result.ok) {
      setFound(undefined);
      setLookupError(result.message);
      return;
    }
    setFound(result.vehicle);
    setOpen(true);
  }

  return (
    <>
      <section
        aria-labelledby="ve-entry-heading"
        className="mt-5 overflow-hidden rounded-[20px] bg-gradient-to-br from-navy to-[var(--oak-navy-deep)] p-4 text-white shadow-[0_10px_28px_rgb(0_40_82/0.22)] md:p-5"
      >
        <h2 id="ve-entry-heading" className="text-label text-white">
          {VE_CARD_HEADING}
        </h2>
        <p className="mt-1 text-body-sm text-white/85">{VE_CARD_SUPPORT}</p>

        <div className="mt-4 grid grid-cols-2 items-start gap-3 [&_label]:text-white [&_.text-danger]:text-danger-soft">
          <Field htmlFor={regId} label="Registration" error={regError}>
            <Input
              id={regId}
              className="border-transparent bg-white/95 font-semibold! tracking-wider text-navy uppercase"
              value={registration}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="AB21 CDE"
              error={Boolean(regError)}
              onChange={(event) => {
                setRegistration(formatRegistration(event.target.value));
                setRegError(undefined);
              }}
            />
          </Field>
          <Field htmlFor={milesId} label="Current mileage" error={mileError}>
            <Input
              id={milesId}
              className="border-transparent bg-white/95 text-navy"
              inputMode="numeric"
              value={mileage}
              placeholder="42,000"
              error={Boolean(mileError)}
              onChange={(event) => {
                setMileage(formatMileageInput(event.target.value));
                setMileError(undefined);
              }}
            />
          </Field>
        </div>

        <Button
          className="mt-4 w-full border-transparent! bg-[#FFD100]! text-navy! hover:bg-[#ffe14d]!"
          busy={lookingUp}
          onClick={() => void start()}
        >
          {lookingUp ? VE_LOOKUP_LABEL : VE_CARD_CTA}
        </Button>
        {lookingUp ? (
          <p className="mt-3 text-caption text-white/80" role="status">
            {VE_LOOKUP_LABEL}
          </p>
        ) : null}
        {lookupError ? (
          <p className="mt-3 text-caption text-white" role="alert">
            {lookupError} Check the registration and try again.
          </p>
        ) : null}
        <p className="mt-3 text-caption text-white/75">{VE_CARD_REASSURANCE}</p>
      </section>

      <ValuationEntryDrawer
        open={open}
        stockId={vehicle.stockId}
        registration={normaliseRegistration(registration)}
        mileage={mileage}
        initialVehicle={found}
        cashDeposit={deposit}
        term={term}
        financeType={financeType}
        onClose={() => {
          setOpen(false);
          setFound(undefined);
        }}
      />
    </>
  );
}
