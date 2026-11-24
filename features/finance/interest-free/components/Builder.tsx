"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PxDealDrawer } from "@/components/part-exchange/PxDealDrawer";
import { PxEquitySummary } from "@/components/part-exchange/PxEquitySummary";
import { ApplySheet } from "@/features/finance/interest-free/components/ApplySheet";
import { CarPickerSheet } from "@/features/finance/interest-free/components/CarPickerSheet";
import { ComparisonCards } from "@/features/finance/interest-free/components/ComparisonCards";
import { ItemisedBreakdown } from "@/features/finance/interest-free/components/ItemisedBreakdown";
import { TermPanel } from "@/features/finance/interest-free/components/TermPanel";
import { Verdict } from "@/features/finance/interest-free/components/Verdict";
import type { InterestFreeBuilder } from "@/features/finance/interest-free/hooks/useInterestFreeBuilder";
import {
  ifBody,
  ifCard,
  ifInput,
  ifLabel,
  ifSectionTitle,
  ifSoftBtn,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import { contribution } from "@/lib/finance/interest-free/math";
import { formatPounds } from "@/lib/format/money";
import { getEligibilityUrl } from "@/config/routes";
import { cn } from "@/lib/cn";

export function Builder({ builder }: { builder: InterestFreeBuilder }) {
  const {
    vehicle,
    cashDeposit,
    setCashDeposit,
    term,
    setTermStop,
    px,
    setPx,
    clearPx,
    pxInput,
    annualMiles,
    setAnnualMiles,
    deal,
    comparison,
    pickerOpen,
    setPickerOpen,
    applyOpen,
    setApplyOpen,
    selectCar,
    addToDeposit,
    cars,
  } = builder;

  const [pxOpen, setPxOpen] = useState(false);

  if (!vehicle || !deal) {
    return (
      <section aria-labelledby="if-builder-heading">
        <h2 id="if-builder-heading" className={ifSectionTitle}>
          {INTEREST_FREE_COPY.builderTitle}
        </h2>
        <p className={cn("mt-3", ifBody)}>No cars available in stock right now.</p>
      </section>
    );
  }

  const maxDep = deal.total;
  const contrib = contribution(deal.advance);

  return (
    <section aria-labelledby="if-builder-heading" className="space-y-6">
      <div>
        <h2 id="if-builder-heading" className={ifSectionTitle}>
          {INTEREST_FREE_COPY.builderTitle}
        </h2>
        <p className={cn("mt-3", ifBody)}>{INTEREST_FREE_COPY.builderLede}</p>
      </div>

      <div>
        <p className={ifLabel}>Choose a car</p>
        <div className={cn(ifCard, "mt-3 overflow-hidden")}>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => setPickerOpen(true)}
          >
            <div className="relative aspect-[16/10] bg-[#ECF3F8]">
              <Image
                src={vehicle.imageSrc}
                alt={vehicle.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
            <div className="p-5 pb-4">
              <span className="block truncate whitespace-nowrap text-2xl font-semibold tracking-[-0.02em] text-[#002852]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
              <span className="mt-1 block truncate text-sm text-muted">
                {vehicle.derivative}
                <span className="mx-1.5 text-[#98A2B3]">·</span>
                {formatPounds(vehicle.cashPrice)}
                <span className="mx-1.5 text-[#98A2B3]">·</span>
                {vehicle.locationName}
              </span>
            </div>
          </button>
          <div className="border-t border-[#E7EEF4] bg-[#F7FAFC] px-5 py-4">
            <button
              type="button"
              className={cn(ifSoftBtn, "w-full")}
              onClick={() => setPickerOpen(true)}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className={ifLabel}>Part exchange</p>
        <p className={cn("mt-1", ifBody)}>
          Optional. Your equity comes off before anything else is calculated. Negative equity
          is added to the advance.
        </p>
        {px ? (
          <div className={cn(ifCard, "mt-3 space-y-3 p-5")}>
            <PxEquitySummary
              estimatedValue={px.value}
              settlementFigure={px.settlement ?? 0}
              equity={deal.equity}
              shortfall={deal.shortfall}
              equityType={
                deal.shortfall > 0 ? "negative" : deal.equity > 0 ? "positive" : "none"
              }
            />
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={() => setPxOpen(true)}>
                Edit
              </Button>
              <Button variant="text" size="sm" onClick={clearPx}>
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="mt-3" onClick={() => setPxOpen(true)}>
            Value my car
          </Button>
        )}
      </div>

      <div>
        <label htmlFor="if-dep" className={ifLabel}>
          Cash deposit
        </label>
        <p className={cn("mt-1", ifBody)}>
          {deal.equity > 0
            ? `Your part exchange adds ${formatPounds(deal.equity)} on top of this.`
            : deal.shortfall > 0
              ? `Negative equity of ${formatPounds(deal.shortfall)} is added to the credit.`
              : `You need enough deposit so credit stays at or under £10,000 and at least half the total price.`}
        </p>
        <input
          id="if-dep-range"
          type="range"
          min={0}
          max={maxDep}
          step={50}
          value={Math.min(cashDeposit, maxDep)}
          onChange={(e) => setCashDeposit(Number(e.target.value))}
          className="mt-3 w-full accent-[#002852]"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>£0</span>
          <span>{formatPounds(maxDep)}</span>
        </div>
        <input
          id="if-dep"
          className={cn(ifInput, "mt-3 tabular-nums")}
          inputMode="numeric"
          value={formatPounds(cashDeposit)}
          onChange={(e) =>
            setCashDeposit(Number(e.target.value.replace(/[^\d]/g, "")) || 0)
          }
        />
      </div>

      <TermPanel deal={deal} onTermChange={setTermStop} />

      <ItemisedBreakdown deal={deal} />

      <Verdict
        deal={deal}
        cars={cars}
        onAddDeposit={addToDeposit}
        onSelectCar={selectCar}
        onBackTo18={() => setTermStop(18)}
        onApply={() => setApplyOpen(true)}
      />

      <ComparisonCards
        rows={comparison}
        annualMiles={annualMiles}
        onMilesChange={setAnnualMiles}
        contribNote={
          contrib ? (
            <>
              Hire Purchase and PCP above include an{" "}
              <strong className="text-[#002852]">
                Oakwood deposit contribution of {formatPounds(contrib)}
              </strong>
              . That is what interest free over 18 months would have cost us on this deal, so
              you get the same money whichever way you take it.
            </>
          ) : null
        }
      />

      {deal.showApply ? (
        <div className={cn(ifSoftPanel, "border border-[#FEF0C7] p-5")}>
          <p className="text-base font-semibold text-[#002852]">Before you apply for 0%</p>
          <p className={cn("mt-2", ifBody)}>{INTEREST_FREE_COPY.hardSearchWarning}</p>
          <p className={cn("mt-2", ifBody)}>{INTEREST_FREE_COPY.hardSearchSoftAlt}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="primary" onClick={() => setApplyOpen(true)}>
              Apply for 0% finance
            </Button>
            <Button variant="secondary" href={getEligibilityUrl()}>
              Check my rate first, no impact on my credit score
            </Button>
          </div>
        </div>
      ) : null}

      <CarPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        cars={cars}
        selectedId={vehicle.stockId}
        cashDeposit={cashDeposit}
        term={term}
        px={pxInput}
        onSelect={selectCar}
        onDepositChange={setCashDeposit}
        onTermChange={setTermStop}
      />

      <PxDealDrawer
        open={pxOpen}
        initialPx={px}
        consideredStockId={vehicle.stockId}
        onClose={() => setPxOpen(false)}
        onApplied={(next) => setPx(next)}
      />

      {deal.showApply ? (
        <ApplySheet open={applyOpen} onClose={() => setApplyOpen(false)} deal={deal} />
      ) : null}
    </section>
  );
}
