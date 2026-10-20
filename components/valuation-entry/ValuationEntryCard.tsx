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
import {
  VE_CARD_CTA,
  VE_CARD_HEADING,
  VE_CARD_REASSURANCE,
  VE_CARD_SUPPORT,
} from "@/lib/valuation-entry/copy";

export function ValuationEntryCard() {
  const { vehicle, deposit, term, financeType } = useVehicleDeal();
  const regId = useId();
  const milesId = useId();
  const [registration, setRegistration] = useState("AB21 CDE");
  const [mileage, setMileage] = useState("42,000");
  const [regError, setRegError] = useState<string>();
  const [mileError, setMileError] = useState<string>();
  const [open, setOpen] = useState(false);

  function start() {
    const nextReg = registrationError(registration);
    const nextMiles = mileageError(mileage);
    setRegError(nextReg);
    setMileError(nextMiles);
    if (nextReg || nextMiles) {
      return;
    }
    trackEvent(analyticsEvents.pxStarted, {
      source: "entry_hook",
      stockId: vehicle.stockId,
    });
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

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] [&_label]:text-white">
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
          <Field htmlFor={milesId} label="Mileage" error={mileError}>
            <Input
              id={milesId}
              className="border-transparent bg-white/95 text-navy"
              inputMode="numeric"
              value={mileage}
              placeholder="42,000"
              error={Boolean(mileError)}
              onChange={(event) => {
                setMileage(event.target.value);
                setMileError(undefined);
              }}
            />
          </Field>
        </div>

        <Button
          className="mt-4 w-full border-transparent! bg-[#FFD100]! text-navy! hover:bg-[#ffe14d]!"
          onClick={start}
        >
          {VE_CARD_CTA}
        </Button>
        <p className="mt-3 text-caption text-white/75">{VE_CARD_REASSURANCE}</p>
      </section>

      <ValuationEntryDrawer
        open={open}
        stockId={vehicle.stockId}
        registration={normaliseRegistration(registration)}
        mileage={mileage}
        cashDeposit={deposit}
        term={term}
        financeType={financeType}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
