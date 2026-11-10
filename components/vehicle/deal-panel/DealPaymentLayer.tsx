"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import Link from "next/link";
import { IconArrow } from "@/components/ui/icons";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getEligibilityUrl } from "@/config/routes";
import { reservationConfig } from "@/config/reservation";
import { formatPounds, formatTerm } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function DealPaymentLayer() {
  const {
    monthlyPayment,
    financeType,
    term,
    deposit,
    extraDeposit,
    cashPrice,
    totalPayable,
    amountFinanced,
    displayState,
    reservable,
    vehicle,
  } = useVehicleDeal();

  const amount = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);
  const totalDeposit = deposit + extraDeposit;
  const financeLabel = financeType === "pcp" ? "PCP" : "Hire Purchase";

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[#002852] px-5 py-6 text-white shadow-[0_18px_40px_rgba(0,16,40,0.22)] md:px-6 md:py-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(0,156,224,0.4)_0%,rgba(0,156,224,0)_60%),linear-gradient(150deg,#001c3d_0%,#002852_50%,#0061a2_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full border border-white/10"
      />
      <div className="relative">
      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.08em] text-[#9fd3f2] uppercase ring-1 ring-white/15">
        <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
        Your monthly payment
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <FinancialNumber
          value={formatPounds(monthlyPayment, { exact: true })}
          size="lg"
          className="text-[2.25rem] leading-none text-white sm:text-[2.75rem]"
        />
        <span className="pb-1 text-body-sm text-white/75">/mo</span>
      </div>
      <p className="mt-2 text-body-sm text-white/80">
        {financeLabel} · {formatTerm(term)} · {formatPounds(totalDeposit)} deposit
      </p>

      <details className="mt-4 rounded-[14px] bg-white/[0.08] px-4 py-2.5 ring-1 ring-white/15">
        <summary className="cursor-pointer text-body-sm font-semibold text-white">
          Full breakdown
        </summary>
        <dl className="mt-3 space-y-2 border-t border-white/15 pt-3 text-body-sm text-white/85">
          <div className="flex justify-between gap-3">
            <dt>Cash price</dt>
            <dd>{formatPounds(cashPrice)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Deposit</dt>
            <dd>{formatPounds(totalDeposit)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Amount financed</dt>
            <dd>{formatPounds(amountFinanced)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Total payable</dt>
            <dd>{formatPounds(totalPayable)}</dd>
          </div>
        </dl>
      </details>

      <div className="mt-5 flex flex-col gap-2">
        {displayState === "representative" ? (
          <Link
            href={getEligibilityUrl()}
            className="inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-[14px] bg-white py-1.5 pr-1.5 pl-5 text-[#002852] no-underline hover:bg-[#E7F1F8]"
            onClick={() =>
              trackEvent(analyticsEvents.financeCtaClicked, { action: "apply" })
            }
          >
            <span className="text-button">Apply for finance</span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#002852] text-white">
              <IconArrow width={20} height={20} />
            </span>
          </Link>
        ) : (
          <StartVehicleDealButton
            className="w-full"
            label="Apply for finance"
            buttonClassName="w-full min-h-14 rounded-[14px]! bg-white! text-[#002852]! hover:bg-[#E7F1F8]!"
          />
        )}
        {reservable ? (
          <StartReservationButton
            stockId={vehicle.stockId}
            variant="secondary"
            className="w-full min-h-12 rounded-[14px]! border-white/30! bg-white/[0.06]! text-white! hover:bg-white/[0.12]!"
            label={`Reserve this car for ${amount}`}
          />
        ) : null}
      </div>
      <p className="mt-3 text-caption text-white/70">
        Decision in seconds. Deposit fully refundable.
      </p>
      {displayState === "representative" ? (
        <p className="mt-3 text-caption text-white/65">
          Representative example. {financeLabel} · {formatTerm(term)} ·{" "}
          {formatPounds(totalDeposit)} deposit. Reserve for {amount}.{" "}
          {reservationCopy.fullyRefundable}. Holds for {hold}.{" "}
          <StatusDisclosureLink />
        </p>
      ) : null}
      </div>
    </section>
  );
}
