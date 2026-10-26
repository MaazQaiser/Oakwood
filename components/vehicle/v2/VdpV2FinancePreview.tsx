"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getEligibilityUrl } from "@/config/routes";
import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { formatApr, formatPounds, formatTerm } from "@/lib/format/money";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

function Segment({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex-1 text-[14px] font-semibold transition-colors",
        active ? "bg-[#08264B] text-white" : "bg-white text-[#08264B]",
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function VdpV2FinancePreview() {
  const {
    financeType,
    setFinanceType,
    deposit,
    extraDeposit,
    term,
    monthlyPayment,
    displayState,
    adjustDeposit,
    setDepositValue,
    maxDeposit,
    depositStep,
  } = useVehicleDeal();

  const aprLabel =
    FINANCE_CALCULATOR_CONFIG.representativeApr !== undefined
      ? formatApr(FINANCE_CALCULATOR_CONFIG.representativeApr)
      : null;

  if (displayState === "missing") {
    return (
      <section
        id="vdp-v2-finance"
        aria-labelledby="vdp-v2-finance-heading"
        className="vdp-v2__section scroll-mt-20 lg:px-0"
      >
        <div className="vdp-v2__surface-blue">
          <h2 id="vdp-v2-finance-heading" className="vdp-v2__heading">
            Finance preview
          </h2>
          <p className="mt-1.5 text-[13px] leading-[18px] text-[#34445B]">
            Check a preview finance profile to see illustrative monthly payments.
          </p>
          <Button
            href={getEligibilityUrl()}
            size="sm"
            className="btn-compact mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-lg bg-[#0875D1] px-4 py-2 text-left text-[14px] font-semibold text-white"
            onClick={() =>
              trackEvent(analyticsEvents.financeCtaClicked, { action: "eligibility" })
            }
          >
            <span className="min-w-0 flex-1 leading-snug">Continue to finance check</span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#0875D1]">
              <IconArrow className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="vdp-v2-finance"
      aria-labelledby="vdp-v2-finance-heading"
      className="vdp-v2__section scroll-mt-20 lg:px-0"
    >
      <div className="vdp-v2__surface-blue text-[#08264B]">
        <h2 id="vdp-v2-finance-heading" className="vdp-v2__heading text-[#102747]">
          Finance preview
        </h2>
        <p className="mt-1.5 text-[13px] leading-[18px] text-[#34445B]">
          Illustrative figures only — not a lender offer.
        </p>

        <div className="mt-3 flex h-11 overflow-hidden rounded-lg border border-[#DCE4ED] p-0.5">
          <Segment
            active={financeType === "hp"}
            label="HP"
            onClick={() => setFinanceType("hp")}
          />
          <Segment
            active={financeType === "pcp"}
            label="PCP"
            onClick={() => setFinanceType("pcp")}
          />
        </div>

        <p className="mt-4 text-[13px] font-semibold text-[#68778B]">
          Estimated monthly payment
        </p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[#08264B]">
          <FinancialNumber
            value={formatPounds(monthlyPayment)}
            size="lg"
            className="text-[28px] font-bold leading-[34px] text-[#08264B]"
          />
          <span className="text-[14px] font-semibold leading-[20px]">
            {displayState === "representative" ? "per month*" : "per month"}
          </span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-y-2">
          <p className="flex min-h-9 min-w-0 items-end pr-2 text-[12px] leading-[17px] text-[#68778B]">
            Deposit
          </p>
          <p className="flex min-h-9 min-w-0 items-end border-l border-[#DCE4ED] px-3 text-[12px] leading-[17px] text-[#68778B]">
            Term
          </p>
          <p
            className="flex min-h-9 min-w-0 items-end border-l border-[#DCE4ED] pl-3 text-[12px] leading-[17px] text-[#68778B]"
            title="Representative APR"
          >
            Rep. APR
          </p>
          <p className="min-w-0 pr-2 text-[14px] font-semibold leading-[20px] whitespace-nowrap text-[#102747]">
            {formatPounds(deposit + extraDeposit)}
          </p>
          <p className="min-w-0 border-l border-[#DCE4ED] px-3 text-[14px] font-semibold leading-[20px] whitespace-nowrap text-[#102747]">
            {formatTerm(term)}
          </p>
          <p className="min-w-0 border-l border-[#DCE4ED] pl-3 text-[14px] font-semibold leading-[20px] text-[#102747]">
            {aprLabel ? (
              <span className="whitespace-nowrap">{aprLabel}</span>
            ) : (
              <StatusDisclosureLink className="whitespace-nowrap text-[14px] font-semibold no-underline hover:underline">
                See disclosure
              </StatusDisclosureLink>
            )}
          </p>
        </div>

        <div className="mt-4 border-t border-[#DCE4ED] pt-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="vdp-v2-deposit"
              className="text-[13px] font-semibold leading-[18px] text-[#102747]"
            >
              Deposit amount
            </label>
            <span className="shrink-0 text-[14px] font-semibold tabular-nums leading-[20px] text-[#102747]">
              {formatPounds(deposit)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              aria-label={`Decrease deposit by ${formatPounds(depositStep)}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#DCE4ED] bg-white text-[18px] leading-none text-[#102747] disabled:opacity-40"
              onClick={() => adjustDeposit(-depositStep)}
              disabled={deposit <= 0}
            >
              −
            </button>
            <input
              id="vdp-v2-deposit"
              name="deposit"
              type="range"
              className="h-2 min-w-0 flex-1 accent-[#0875D1]"
              min={0}
              max={maxDeposit}
              step={depositStep}
              value={deposit}
              onChange={(event) => setDepositValue(Number(event.target.value))}
            />
            <button
              type="button"
              aria-label={`Increase deposit by ${formatPounds(depositStep)}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#DCE4ED] bg-white text-[18px] leading-none text-[#102747] disabled:opacity-40"
              onClick={() => adjustDeposit(depositStep)}
              disabled={deposit >= maxDeposit}
            >
              +
            </button>
          </div>
        </div>

        <p className="mt-4 text-[12px] leading-[17px] text-[#68778B]">
          {financeType === "pcp" ? "PCP" : "HP"} illustration. No credit decision on this
          page. <StatusDisclosureLink />
        </p>

        <Button
          href={getEligibilityUrl()}
          size="sm"
          className="btn-compact mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-lg bg-[#0875D1] px-4 py-2 text-left text-[14px] font-semibold text-white hover:bg-[#066bb8]"
          onClick={() =>
            trackEvent(analyticsEvents.financeCtaClicked, { action: "apply" })
          }
        >
          <span className="min-w-0 flex-1 leading-snug">Continue to finance check</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#0875D1]">
            <IconArrow className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </section>
  );
}
