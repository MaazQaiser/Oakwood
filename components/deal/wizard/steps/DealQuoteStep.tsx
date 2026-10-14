"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { reservationConfig } from "@/config/reservation";
import { cn } from "@/lib/cn";
import { DEAL_EMAIL_DEAL, DEAL_RESERVE_CAR_FOR } from "@/lib/deal/copy";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { reservationAmountLabel } from "@/lib/reservation/format";
import type { FinanceProductType } from "@/types/finance";

/** Catalogue representative APR until Codeweavers returns the base tier. */
const REPRESENTATIVE_APR = 16.9;

const TYPE_COPY: Record<
  FinanceProductType,
  { name: string; lead: string; body: string }
> = {
  hp: {
    name: "HP",
    lead: "Own it",
    body: "Own the car at the end. No balloon payment.",
  },
  pcp: {
    name: "PCP",
    lead: "Lowest monthly",
    body: "Lower payments, then pay, swap or hand back at the end.",
  },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-page-tint px-3.5 py-3">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 tabular-number text-body font-semibold! text-ink">
        {value}
      </dd>
    </div>
  );
}

export function DealQuoteStep() {
  const { draft, calculation, calculateFor, apr, setFinanceType, vehicle } =
    useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("quote");
  const [emailOpen, setEmailOpen] = useState(false);
  const personal = apr !== undefined;
  const rate = apr ?? REPRESENTATIVE_APR;
  const type = draft.financeType;
  const quotes = {
    hp: type === "hp" ? calculation : calculateFor("hp"),
    pcp: type === "pcp" ? calculation : calculateFor("pcp"),
  };
  const cashDeposit = calculation?.cashDeposit ?? draft.cashDeposit;
  const equity = calculation?.pxEquity ?? 0;
  const monthly = calculation?.monthlyPayment ?? 0;
  const finalPayment = calculation?.finalPayment ?? 0;
  const reserveLabel = DEAL_RESERVE_CAR_FOR(
    reservationAmountLabel(reservationConfig.amount),
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <div
            role="tablist"
            aria-label="Finance type"
            className="grid grid-cols-2 gap-2"
          >
            {(["hp", "pcp"] as const).map((id) => {
              const selected = type === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFinanceType(id)}
                  className={cn(
                    "rounded-[18px] px-3 py-3 text-center transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    selected
                      ? "bg-navy text-white shadow-[0_10px_24px_rgb(0_40_82/0.25)]"
                      : "bg-page-tint text-muted hover:bg-surface-soft",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[0.68rem] font-semibold! uppercase tracking-[0.14em]",
                      selected ? "text-white/80" : "text-muted",
                    )}
                  >
                    {TYPE_COPY[id].name}
                  </span>
                  <span className="financial-number financial-number--compact mt-0.5 block">
                    {formatPounds(quotes[id]?.monthlyPayment ?? 0)}
                    <span
                      className={cn(
                        "text-body-sm font-normal",
                        selected ? "text-white/80" : "text-muted",
                      )}
                    >
                      /mo
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-caption",
                      selected ? "text-white/80" : "text-muted",
                    )}
                  >
                    {TYPE_COPY[id].lead}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 px-1 text-body-sm text-muted">
            {TYPE_COPY[type].body}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-2">
            <Stat
              label="Deposit"
              value={formatPounds(calculation?.totalDeposit ?? cashDeposit)}
            />
            <Stat label="Term" value={formatTerm(draft.term)} />
            <Stat
              label={personal ? "Your APR" : "Representative APR"}
              value={`${rate.toFixed(1)}%`}
            />
            <Stat
              label="Total payable"
              value={formatPounds(calculation?.totalPayable ?? 0)}
            />
            {type === "pcp" ? (
              <>
                <Stat
                  label="Final payment"
                  value={formatPounds(finalPayment)}
                />
                <Stat
                  label="Miles a year"
                  value={(draft.annualMileage ?? 0).toLocaleString("en-GB")}
                />
              </>
            ) : null}
          </dl>

          <div className="mt-4 border-t border-border px-1 pt-4">
            <p className="text-label">What happens, when</p>
            <ol className="relative mt-3 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
              {[
                {
                  title: "Up front",
                  body:
                    equity > 0
                      ? `${formatPounds(cashDeposit)} cash + ${formatPounds(equity)} part-exchange equity`
                      : `${formatPounds(cashDeposit)} cash deposit`,
                },
                {
                  title: `Month 1 to ${draft.term}`,
                  body: `${formatPounds(monthly)} per month, fixed`,
                },
                {
                  title: "End of term",
                  body:
                    type === "pcp"
                      ? `Pay ${formatPounds(finalPayment)} to keep it, part-exchange it, or hand it back.`
                      : "The car is yours. Nothing left to pay.",
                },
              ].map((item) => (
                <li key={item.title} className="relative pl-6">
                  <span className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-surface" />
                  <p className="text-body-sm font-semibold! text-ink">
                    {item.title}
                  </p>
                  <p className="text-caption text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rounded-[24px] bg-surface-soft px-5 py-4">
          <p className="text-caption font-semibold! text-ink">
            Representative example
          </p>
          <p className="mt-1 text-caption text-muted">
            Cash price {formatPounds(vehicle.cashPrice)}, deposit{" "}
            {formatPounds(calculation?.totalDeposit ?? cashDeposit)}, total
            amount of credit {formatPounds(calculation?.amountFinanced ?? 0)},{" "}
            {draft.term} monthly payments of {formatPounds(monthly)}
            {type === "pcp"
              ? `, optional final payment ${formatPounds(finalPayment)}`
              : ""}
            , total payable {formatPounds(calculation?.totalPayable ?? 0)}.{" "}
            {REPRESENTATIVE_APR.toFixed(1)}% APR representative. Oakwood Motor
            Company Ltd is a credit broker, not a lender.
          </p>
          <p className="mt-2 text-caption text-subtle">
            Prototype figures, not a live Codeweavers quote.
          </p>
        </div>

        {emailOpen ? (
          <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <p className="text-label">{DEAL_EMAIL_DEAL}</p>
            <SaveDeal defaultOpen compact />
          </div>
        ) : (
          <Button
            type="button"
            variant="tertiary"
            className="w-full"
            onClick={() => setEmailOpen(true)}
          >
            {DEAL_EMAIL_DEAL}
          </Button>
        )}
      </div>

      <DealStepFooter
        showMonthly={false}
        onBack={() => goBack("cover")}
        onContinue={() => goNext("reserve")}
        continueLabel={reserveLabel}
      />
    </div>
  );
}
