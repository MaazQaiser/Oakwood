"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { IconChevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const CREDIT_TIERS = [
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
  { id: "limited", label: "Limited" },
] as const;

export function DealAdjustLayer() {
  const {
    financeType,
    setFinanceType,
    deposit,
    setDepositValue,
    maxDeposit,
    term,
    termOptions,
    setTermValue,
    px,
    startValuation,
    clearPartExchange,
    extraDeposit,
  } = useVehicleDeal();

  const [reg, setReg] = useState("");
  const [mileage, setMileage] = useState("");
  const [tier, setTier] = useState<(typeof CREDIT_TIERS)[number]["id"]>("good");
  const [open, setOpen] = useState(false);

  const tail = [
    financeType === "pcp" ? "PCP" : "HP",
    formatTerm(term),
    `${formatPounds(deposit)} deposit`,
  ].join(" · ");

  return (
    <details
      className="group rounded-[24px] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4]"
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-body font-semibold text-[#002852] md:px-6 [&::-webkit-details-marker]:hidden">
        <span>
          Customise your deal
          <span className="ml-2 text-body-sm font-normal text-muted">{tail}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] transition",
            open ? "bg-[#002852] text-white" : "bg-[#ECF3F8] text-[#002852]",
          )}
        >
          <IconChevron className={open ? "rotate-180" : undefined} />
        </span>
      </summary>
      <div className="space-y-6 border-t border-[#E7EEF4] px-5 py-5 md:px-6">
        <fieldset>
          <legend className="text-label">Finance type</legend>
          <div className="mt-2 grid grid-cols-2 rounded-full bg-[#E7EEF4] p-1">
            {(
              [
                ["hp", "Hire Purchase"],
                ["pcp", "PCP"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={financeType === value}
                onClick={() => setFinanceType(value)}
                className={cn(
                  "min-h-10 rounded-full px-3 text-body-sm font-semibold transition",
                  financeType === value
                    ? "bg-[#002852] text-white shadow-[0_4px_10px_rgba(0,40,82,0.25)]"
                    : "text-[#002852] hover:bg-white/60",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="text-label">Deposit</p>
          <p className="mt-1 text-caption text-muted">
            Cash deposit. Any part exchange is added on top.
          </p>
          <input
            type="range"
            min={0}
            max={maxDeposit}
            step={50}
            value={deposit}
            onChange={(event) => setDepositValue(Number(event.target.value))}
            className="mt-3 w-full accent-primary"
            aria-label="Deposit amount"
          />
          <div className="mt-1 flex justify-between text-caption text-muted">
            <span>£0</span>
            <span>{formatPounds(maxDeposit)}</span>
          </div>
          <input
            className="mt-3 w-full rounded-[14px] border border-[#E7EEF4] bg-[#F7FAFC] px-4 py-3 text-body tabular-nums"
            inputMode="numeric"
            value={formatPounds(deposit)}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^\d]/g, "");
              setDepositValue(Number(raw || 0));
            }}
            aria-label="Deposit pounds"
          />
        </div>

        <div>
          <p className="text-label">Term</p>
          <p className="mt-1 text-caption text-muted">
            {financeType === "pcp"
              ? "PCP up to 60 months."
              : "Hire Purchase up to 84 months."}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {termOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTermValue(option)}
                className={cn(
                  "min-h-11 rounded-[12px] px-3 text-body-sm font-semibold transition",
                  term === option
                    ? "bg-[#002852] text-white"
                    : "bg-[#F2F7FB] text-[#002852] hover:bg-[#E7F1F8]",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-label">Part exchange</p>
          <p className="mt-1 text-caption text-muted">
            Optional. The valuation goes straight into your deposit.
          </p>
          {px ? (
            <div className="mt-3 rounded-[14px] bg-primary-soft px-4 py-3 text-body-sm text-ink">
              <p className="font-semibold">
                {px.registration.toUpperCase()} · {formatPounds(px.value)}
              </p>
              <p className="mt-1 text-muted">
                Equity towards deposit: {formatPounds(extraDeposit)}
              </p>
              <Button
                variant="text"
                className="mt-2 px-0"
                onClick={() => clearPartExchange()}
              >
                Remove part exchange
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  className="rounded-[14px] border border-[#E7EEF4] bg-[#F7FAFC] px-4 py-3 text-body uppercase"
                  placeholder="REG"
                  value={reg}
                  onChange={(event) => setReg(event.target.value)}
                  aria-label="Registration"
                />
                <input
                  className="rounded-[14px] border border-[#E7EEF4] bg-[#F7FAFC] px-4 py-3 text-body"
                  placeholder="Mileage"
                  inputMode="numeric"
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  aria-label="Mileage"
                />
              </div>
              <Button
                className="mt-3 w-full"
                disabled={!reg.trim() || !Number(mileage)}
                onClick={() => startValuation(reg.trim(), Number(mileage))}
              >
                Value my car
              </Button>
            </>
          )}
        </div>

        <div>
          <p className="text-label">Not sure what rate you will get?</p>
          <p className="mt-1 text-caption text-muted">
            Pick what matches your history. Your actual rate is confirmed when you
            apply.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {CREDIT_TIERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTier(item.id)}
                className={cn(
                  "min-h-11 rounded-[12px] px-3 text-body-sm font-semibold transition",
                  tier === item.id
                    ? "bg-[#ECF3F8] text-primary ring-2 ring-primary"
                    : "bg-[#F2F7FB] text-[#002852] hover:bg-[#E7F1F8]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
