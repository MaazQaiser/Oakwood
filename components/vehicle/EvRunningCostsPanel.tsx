"use client";

import { useMemo, useState } from "react";
import { EV_CHARGE_TIMES, EV_RUNNING_COSTS } from "@/config/ev";
import { formatNumber } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

function isElectric(vehicle: VehicleDetail): boolean {
  return vehicle.fuelType.toLowerCase() === "electric";
}

export function EvRunningCostsPanel({ vehicle }: { vehicle: VehicleDetail }) {
  const [milesPerMonth, setMilesPerMonth] = useState<number>(
    EV_RUNNING_COSTS.sliderDefaultMilesPerMonth,
  );

  const wltp = vehicle.evRunningCosts?.wltpRangeMiles ?? vehicle.evRangeMiles;
  const realRange =
    vehicle.evRunningCosts?.realRangeMiles ??
    (wltp ? Math.round(wltp * EV_RUNNING_COSTS.realWorldRangeFactor) : undefined);

  const costPerMilePence = useMemo(() => {
    const kwhPerMile = 1 / EV_RUNNING_COSTS.milesPerKwhAssumed;
    const blendedRate =
      (EV_RUNNING_COSTS.homeRatePencePerKwh * 0.7 +
        EV_RUNNING_COSTS.publicRatePencePerKwh * 0.3) /
      100;
    return Math.round(kwhPerMile * blendedRate * 100) / 100;
  }, []);

  const monthlyCost = Math.round((milesPerMonth * costPerMilePence) / 100);

  if (!isElectric(vehicle)) {
    return null;
  }

  return (
    <section
      aria-labelledby="ev-running-costs-heading"
      className="rounded-[24px] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4] md:px-6"
    >
      <h2
        id="ev-running-costs-heading"
        className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-navy"
      >
        EV running costs
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Illustrative figures using editable tariff assumptions — not a quote for your
        home energy deal.
      </p>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-label text-muted">Real range (typical)</dt>
          <dd className="mt-1 text-body text-ink">
            {realRange ? `${formatNumber(realRange)} miles` : "Not confirmed"}
          </dd>
          {wltp ? (
            <p className="mt-0.5 text-caption text-muted">
              WLTP {formatNumber(wltp)} miles
            </p>
          ) : null}
        </div>
        <div>
          <dt className="text-label text-muted">Cost per mile (blended)</dt>
          <dd className="mt-1 text-body text-ink">{costPerMilePence.toFixed(1)}p</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-label text-muted">Charge times (0–80%)</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {EV_CHARGE_TIMES.map((item) => (
            <li
              key={item.id}
              className="rounded-[12px] bg-[#ECF3F8] px-3 py-2 text-body-sm text-ink"
            >
              <span className="block font-semibold">{item.label}</span>
              <span className="text-muted">≈ {item.hoursTo80} hrs</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <label htmlFor="ev-miles-slider" className="text-label text-muted">
          Miles driven per month
        </label>
        <input
          id="ev-miles-slider"
          type="range"
          min={EV_RUNNING_COSTS.sliderMinMilesPerMonth}
          max={EV_RUNNING_COSTS.sliderMaxMilesPerMonth}
          step={50}
          value={milesPerMonth}
          onChange={(event) => setMilesPerMonth(Number(event.target.value))}
          className="mt-2 w-full accent-primary"
        />
        <p className="mt-2 text-body-sm text-ink">
          {formatNumber(milesPerMonth)} miles ≈ £{formatNumber(monthlyCost)} / month
          electricity
        </p>
        <p className="mt-1 text-caption text-muted">
          Home {EV_RUNNING_COSTS.homeRatePencePerKwh}p/kWh · public{" "}
          {EV_RUNNING_COSTS.publicRatePencePerKwh}p/kWh (editable in config).
        </p>
      </div>
    </section>
  );
}