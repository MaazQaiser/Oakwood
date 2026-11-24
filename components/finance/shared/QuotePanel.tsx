"use client";

import type { ReactNode } from "react";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export interface QuoteAgreementRow {
  label: string;
  value: string;
  emphasise?: boolean;
}

export interface QuoteAgreement {
  title: string;
  monthly: number;
  rows: QuoteAgreementRow[];
}

export interface QuotePanelProps {
  monthlyTotal: number;
  subtitle: string;
  agreements: QuoteAgreement[];
  actions?: ReactNode;
  className?: string;
}

/** Navy gradient quote panel shared with the interest free page family. */
export function QuotePanel({
  monthlyTotal,
  subtitle,
  agreements,
  actions,
  className,
}: QuotePanelProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-[24px] bg-[#002852] px-5 py-6 text-white sm:px-6 sm:py-7",
        className,
      )}
    >
      <p className="text-sm font-semibold text-white/70">Your total monthly</p>
      <p className="mt-2 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-white sm:text-[2.85rem]">
        {formatPounds(monthlyTotal, { exact: true })}
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
        {subtitle}
      </p>

      {agreements.map((agreement) => (
        <div
          key={agreement.title}
          className="mt-4 rounded-[16px] border border-white/15 bg-white/8 px-4 py-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">
              {agreement.title}
            </p>
            <p className="shrink-0 text-right text-xl font-semibold leading-none tabular-nums tracking-[-0.02em]">
              {formatPounds(agreement.monthly, { exact: true })}
            </p>
          </div>
          <dl className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {agreement.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5 text-sm"
              >
                <dt className="min-w-0 whitespace-nowrap text-white/70">
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    "max-w-[58%] text-right font-semibold tabular-nums text-white",
                    row.emphasise && "text-[#6FD3AC]",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {actions ? (
        <div className="mt-5 grid w-full min-w-0 gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
