"use client";

import { Button } from "@/components/ui/Button";
import {
  ifBody,
  ifLabel,
  ifPillOk,
  ifPillWarn,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { TERM_STOPS } from "@/lib/finance/interest-free/constants";
import type { InterestFreeDeal } from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function TermPanel({
  deal,
  onTermChange,
}: {
  deal: InterestFreeDeal;
  onTermChange: (term: number) => void;
}) {
  const index = Math.max(0, TERM_STOPS.indexOf(deal.term as (typeof TERM_STOPS)[number]));
  const free = deal.qualifies;

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="if-term" className={ifLabel}>
          Term
        </label>
        <p className={cn("mt-1", ifBody)}>
          Interest free runs to 18 months. Slide further and you will see exactly what the
          interest costs.
        </p>
        <input
          id="if-term"
          type="range"
          min={0}
          max={TERM_STOPS.length - 1}
          step={1}
          value={index}
          onChange={(e) => onTermChange(TERM_STOPS[Number(e.target.value)] ?? 18)}
          className="mt-3 w-full accent-[#002852]"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>12 months</span>
          <span>60 months</span>
        </div>
      </div>

      <div className={cn(ifSoftPanel, "p-4")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[2rem] font-semibold leading-none text-[#002852] tabular-nums">
            {deal.term}
          </span>
          <span className="text-sm text-muted">months</span>
          <span className={free ? ifPillOk : ifPillWarn}>
            {free ? "Interest free" : "0% APR"} · {deal.rateLabel}
          </span>
        </div>

        {free ? (
          <dl className="mt-3 space-y-2 text-sm">
            <Row
              label="Oakwood puts in"
              value={formatPounds(deal.contribution)}
              tone="success"
            />
            <Row label="You take it as" value="interest free credit" />
            <Row label="The credit costs you" value="£0" tone="success" big />
          </dl>
        ) : (
          <div className="mt-3 space-y-3">
            <dl className="space-y-2 text-sm">
              <Row
                label="Charge for credit"
                value={formatPounds(deal.charge)}
                tone={deal.charge === 0 ? "success" : "warn"}
              />
              <Row
                label="Oakwood deposit contribution"
                value={`−${formatPounds(deal.contribution)}`}
                tone="success"
              />
              <Row
                label="Monthly payment"
                value={formatPounds(deal.monthly, { exact: true })}
                big
              />
            </dl>
            <p className={ifBody}>
              <strong className="text-[#002852]">
                Increase your deposit or shorten the term
              </strong>{" "}
              to reduce the charge. At 18 months with half the price down it is nothing at
              all.
            </p>
            {deal.term !== 18 ? (
              <Button variant="secondary" size="sm" onClick={() => onTermChange(18)}>
                Go back to 18 months
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  big,
}: {
  label: string;
  value: string;
  tone?: "success" | "warn";
  big?: boolean;
}) {
  const colour =
    tone === "success"
      ? "text-[#0B6B4A]"
      : tone === "warn"
        ? "text-[#8A5A00]"
        : "text-[#002852]";
  return (
    <div className={`flex justify-between gap-3 ${big ? "pt-1 text-base font-semibold" : ""}`}>
      <dt className="text-muted">{label}</dt>
      <dd className={`tabular-nums font-semibold ${colour}`}>{value}</dd>
    </div>
  );
}
