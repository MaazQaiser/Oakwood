"use client";

import type { ReactNode } from "react";
import {
  ifBody,
  ifCard,
  ifPillOk,
  ifSubheading,
} from "@/features/finance/interest-free/ui";
import { PCP_MILEAGE_OPTIONS } from "@/lib/finance/interest-free/constants";
import type { ComparisonProduct } from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function ComparisonCards({
  rows,
  annualMiles,
  onMilesChange,
  contribNote,
}: {
  rows: ComparisonProduct[];
  annualMiles: number;
  onMilesChange: (miles: number) => void;
  contribNote?: ReactNode;
}) {
  return (
    <div>
      <h3 className={ifSubheading}>The same car, three ways</h3>
      <p className={cn("mt-1", ifBody)}>
        So you can see exactly what the credit costs on each.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {rows.map((r) => (
          <article
            key={r.name}
            className={cn(
              ifCard,
              "p-5",
              r.best && "border-[#12805B]/40 ring-1 ring-[#12805B]/20",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <b className="text-base text-[#002852]">{r.name}</b>
              {r.best ? <span className={ifPillOk}>No credit charge</span> : null}
            </div>
            <p className="mt-3 text-[1.75rem] font-semibold leading-none text-[#002852] tabular-nums">
              {formatPounds(r.monthly, { exact: true })}
              <span className="ml-1 text-sm font-normal text-muted">a month</span>
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <Row label="Your deposit" value={formatPounds(r.deposit)} />
              {r.contribution > 0 ? (
                <Row
                  label="Oakwood contribution"
                  value={`+${formatPounds(r.contribution)}`}
                  tone="success"
                />
              ) : null}
              <Row
                label="Term"
                value={`${r.term} months${r.termCapped ? " (max on this car)" : ""}`}
              />
              <Row label="Rate" value={r.rateLabel} />
              {r.name === "PCP" ? (
                <div className="pt-1">
                  <p className="mb-1.5 text-muted">Mileage a year</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PCP_MILEAGE_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={annualMiles === m}
                        onClick={() => onMilesChange(m)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          annualMiles === m
                            ? "bg-[#002852] text-white"
                            : "bg-[#ECF3F8] text-[#002852]",
                        )}
                      >
                        {m / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {r.gfv != null ? (
                <Row label="Final payment" value={formatPounds(r.gfv)} />
              ) : null}
              <Row
                label="Additional charge"
                value={r.charge <= 0 ? "£0" : formatPounds(r.charge)}
                tone={r.charge <= 0 ? "success" : undefined}
              />
              <Row label="Total payable" value={formatPounds(r.totalPayable)} />
            </dl>
            <p className="mt-3 border-t border-[#E7EEF4] pt-3 text-xs text-muted">
              {r.name === "Interest free"
                ? `Oakwood Package included, worth ${formatPounds(r.packageTotal)}`
                : r.withoutPackage
                  ? `With the Oakwood Package included. Without it, ${formatPounds(r.withoutPackage.monthly, { exact: true })} a month and ${formatPounds(r.withoutPackage.totalPayable)} in total.`
                  : null}
            </p>
          </article>
        ))}
      </div>
      {contribNote ? <p className={cn("mt-3", ifBody)}>{contribNote}</p> : null}
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{label}</dt>
      <dd
        className={cn(
          "tabular-nums font-semibold",
          tone === "success" ? "text-[#0B6B4A]" : "text-[#002852]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
