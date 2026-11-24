"use client";

import { Button } from "@/components/ui/Button";
import {
  ifBody,
  ifCard,
  ifPillWarn,
  ifSoftPanel,
  ifSubheading,
} from "@/features/finance/interest-free/ui";
import { MAX_ADVANCE } from "@/lib/finance/interest-free/constants";
import {
  needDepositTotal,
  type InterestFreeDeal,
} from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import { cn } from "@/lib/cn";

export function Verdict({
  deal,
  cars,
  onAddDeposit,
  onSelectCar,
  onBackTo18,
  onApply,
}: {
  deal: InterestFreeDeal;
  cars: InterestFreeStockCar[];
  onAddDeposit: (amount: number) => void;
  onSelectCar: (stockId: string) => void;
  onBackTo18: () => void;
  onApply: () => void;
}) {
  if (deal.advance <= 0) {
    return (
      <div className={cn(ifSoftPanel, "p-5")}>
        <p className="text-sm font-semibold text-muted">No credit needed</p>
        <h3 className={cn(ifSubheading, "mt-1")}>You have covered the whole price</h3>
        <p className={cn("mt-2", ifBody)}>
          Reduce your deposit if you would like to spread some of it interest free.
        </p>
      </div>
    );
  }

  if (deal.qualifies) {
    return (
      <div className="rounded-[24px] bg-[#002852] p-5 text-white sm:p-6">
        <p className="text-sm font-semibold text-white/80">Interest free · 0% APR</p>
        <p className="mt-2 text-[2.25rem] font-semibold leading-none tabular-nums">
          {formatPounds(deal.monthly, { exact: true })}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          {deal.term} payments of {formatPounds(deal.monthly, { exact: true })}. Total amount
          of credit {formatPounds(deal.advance)}.{" "}
          <span className="font-semibold text-white">Total charge for credit £0.</span> Total
          amount payable {formatPounds(deal.total)}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="primary" onClick={onApply}>
            Apply for 0% finance
          </Button>
        </div>
      </div>
    );
  }

  if (deal.failures.termTooLong) {
    return (
      <div className={cn(ifCard, "p-5")}>
        <span className={ifPillWarn}>0% APR · charge applies</span>
        <p className="mt-3 text-[2rem] font-semibold leading-none text-[#002852] tabular-nums">
          {formatPounds(deal.monthly, { exact: true })}
        </p>
        <p className={cn("mt-3", ifBody)}>
          {deal.term} payments. Charge for credit {formatPounds(deal.charge)} after our{" "}
          {formatPounds(deal.contribution)} contribution. Total amount payable{" "}
          {formatPounds(deal.totalPayable)}.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={onBackTo18}>
            Go back to 18 months — pay £0 for the credit
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Longer terms are available up to 84 months on Hire Purchase below.
        </p>
      </div>
    );
  }

  const fixes: Array<{ label: string; note: string; run: () => void }> = [];
  if (deal.failures.overCap > 0) {
    const extra = deal.failures.overCap;
    fixes.push({
      label: `Add ${formatPounds(extra)} to your deposit`,
      note: `brings credit to ${formatPounds(MAX_ADVANCE)}`,
      run: () => onAddDeposit(extra),
    });
  }
  if (deal.failures.underHalf > 0) {
    fixes.push({
      label: `Add ${formatPounds(deal.failures.underHalf)} to reach half the price`,
      note: "the minimum deposit",
      run: () => onAddDeposit(deal.failures.underHalf),
    });
  }
  const afford = [...cars]
    .filter((c) => needDepositTotal(c) <= deal.deposit)
    .sort((a, b) => b.cashPrice - a.cashPrice)[0];
  if (afford && afford.stockId !== deal.vehicle.stockId) {
    fixes.push({
      label: `Choose the ${afford.make} ${afford.model} instead`,
      note: formatPounds(afford.cashPrice),
      run: () => onSelectCar(afford.stockId),
    });
  }

  return (
    <div className={cn(ifCard, "p-5")}>
      <span className={ifPillWarn}>Not interest free yet · 0% APR</span>
      <h3 className={cn(ifSubheading, "mt-3")}>
        {deal.failures.overCap > 0
          ? "The credit is over £10,000"
          : "The deposit is under half"}
      </h3>
      <p className={cn("mt-2", ifBody)}>
        {deal.failures.overCap > 0
          ? `You would be borrowing ${formatPounds(deal.advance)}. Interest free stops at £10,000, so this one needs more down.`
          : `You need at least ${formatPounds(deal.total * 0.5)} down on this car and you have ${formatPounds(deal.deposit)}.`}
      </p>
      {deal.charge > 0 ? (
        <p className="mt-2 text-sm text-[#002852]">
          Charge for credit on this build:{" "}
          <span className="font-semibold text-[#8A5A00]">{formatPounds(deal.charge)}</span>.
          Monthly{" "}
          <span className="font-semibold">
            {formatPounds(deal.monthly, { exact: true })}
          </span>
          .
        </p>
      ) : null}
      {fixes.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2">
          {fixes.map((f) => (
            <Button key={f.label} variant="secondary" onClick={f.run}>
              {f.label} <span className="text-muted">· {f.note}</span>
            </Button>
          ))}
        </div>
      ) : null}
      <p className="mt-4 text-xs text-muted">
        Or take it on Hire Purchase below, over a term that suits you.
      </p>
    </div>
  );
}
