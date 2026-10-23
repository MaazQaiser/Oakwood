"use client";

import { useEffect, useState } from "react";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { DEAL_CONTINUE } from "@/lib/deal/copy";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import type { FinanceProductType } from "@/types/finance";

const NOT_AVAILABLE = "Not available";

const COVER_LABELS: Record<string, { name: string; years: boolean }> = {
  "aa-warranty": { name: "AA Warranty", years: true },
  "service-plan": { name: "Service Plan", years: true },
  "mot-maintenance": { name: "MOT Plan", years: true },
  supagard: { name: "Supagard", years: false },
};

const EXAMPLE_FIELDS = [
  { label: "Cash price", value: NOT_AVAILABLE },
  { label: "Deposit", value: NOT_AVAILABLE },
  { label: "Amount of credit", value: NOT_AVAILABLE },
  { label: "APR", value: NOT_AVAILABLE },
  { label: "Interest", value: NOT_AVAILABLE },
  { label: "Fees", value: NOT_AVAILABLE },
  { label: "Monthly payment", value: NOT_AVAILABLE },
  { label: "Total amount payable", value: NOT_AVAILABLE },
] as const;

type PxSaved = {
  registration?: string;
  mileage?: string;
  condition?: string;
  serviceHistory?: string;
  financeOutstanding?: boolean;
  settlementText?: string;
  lender?: string;
};

type FinanceSaved = {
  deposit?: number;
  term?: number;
  mileageChoice?: string;
  otherMileage?: string;
};

type CoverSaved = {
  selected?: string[];
  years?: Record<string, number>;
};

type QuoteChoices = {
  financeType: FinanceProductType;
  deposit?: number;
  term?: number;
  mileageLabel?: string;
  partExchange?: { registration: string };
  cover: { id: string; name: string; detail: string }[];
};

function quoteKey(dealId: string) {
  return `oakwood-deal-quote:${dealId}`;
}

function readJson<T>(key: string): T | undefined {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function pxComplete(saved: PxSaved | undefined): boolean {
  if (!saved) {
    return false;
  }
  const miles = Number(String(saved.mileage ?? "").replace(/\D/g, ""));
  const financeOk =
    saved.financeOutstanding === false ||
    (saved.financeOutstanding === true &&
      String(saved.settlementText ?? "").trim() !== "" &&
      String(saved.lender ?? "").trim() !== "");
  return (
    String(saved.registration ?? "").trim().length >= 2 &&
    Number.isFinite(miles) &&
    miles > 0 &&
    Boolean(saved.condition) &&
    Boolean(saved.serviceHistory) &&
    financeOk
  );
}

function mileageLabel(saved: FinanceSaved | undefined): string | undefined {
  if (!saved?.mileageChoice) {
    return undefined;
  }
  if (saved.mileageChoice === "other") {
    const miles = Number(String(saved.otherMileage ?? "").replace(/\D/g, ""));
    return miles > 0 ? `${miles.toLocaleString("en-GB")} miles a year` : "Other";
  }
  const miles = Number(saved.mileageChoice);
  return Number.isFinite(miles) && miles > 0
    ? `${miles.toLocaleString("en-GB")} miles a year`
    : undefined;
}

function loadChoices(
  dealId: string,
  fallbackTerm: number,
): QuoteChoices {
  const savedType = readJson<{ financeType?: string }>(quoteKey(dealId));
  const finance = readJson<FinanceSaved>(`oakwood-deal-finance:${dealId}`);
  const px = readJson<PxSaved>(`oakwood-deal-px:${dealId}`);
  const cover = readJson<CoverSaved>(`oakwood-deal-cover:${dealId}`);
  const term = Number(finance?.term);
  const deposit = Number(finance?.deposit);
  const selected = new Set(cover?.selected ?? []);

  return {
    financeType: savedType?.financeType === "pcp" ? "pcp" : "hp",
    deposit: Number.isFinite(deposit) ? deposit : undefined,
    term: [24, 36, 48, 60, 72, 84].includes(term) ? term : fallbackTerm,
    mileageLabel: mileageLabel(finance),
    partExchange: pxComplete(px)
      ? { registration: String(px?.registration ?? "").trim().toUpperCase() }
      : undefined,
    cover: Object.entries(COVER_LABELS)
      .filter(([id]) => selected.has(id))
      .map(([id, item]) => {
        const years = Number(cover?.years?.[id]);
        return {
          id,
          name: item.name,
          detail:
            item.years && [1, 2, 3, 4].includes(years)
              ? `${years} ${years === 1 ? "year" : "years"}`
              : "",
        };
      }),
  };
}

export function DealQuoteStep() {
  const { dealId, draft, vehicle } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("quote");
  const [choices, setChoices] = useState<QuoteChoices>({
    financeType: "hp",
    term: draft.term,
    cover: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoices(loadChoices(dealId, draft.term));
    setReady(true);
  }, [dealId, draft.term]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.sessionStorage.setItem(
      quoteKey(dealId),
      JSON.stringify({ financeType: choices.financeType }),
    );
  }, [choices.financeType, dealId, ready]);

  const type = choices.financeType;
  const typeName =
    type === "hp" ? "Hire Purchase (HP)" : "Personal Contract Purchase (PCP)";
  const depositLabel =
    choices.deposit === undefined
      ? "Not chosen"
      : formatPounds(choices.deposit);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 pb-5">
        <DealCard className="space-y-4">
          <section aria-labelledby="quote-vehicle">
            <h2 id="quote-vehicle" className="text-label text-navy">
              Vehicle
            </h2>
            <p className="mt-1 text-body font-semibold! text-ink">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            {vehicle.derivative ? (
              <p className="text-body-sm text-muted">{vehicle.derivative}</p>
            ) : null}
            <p className="mt-1 text-body-sm text-ink">
              Listed price {formatPounds(vehicle.cashPrice)}
            </p>
          </section>

          {ready && choices.partExchange ? (
            <section aria-labelledby="quote-px" className="border-t border-border pt-4">
              <h2 id="quote-px" className="text-label text-navy">
                Part exchange
              </h2>
              <p className="mt-1 text-body-sm text-ink">
                {choices.partExchange.registration}
              </p>
              <p className="mt-1 text-body-sm text-ink">
                Part-exchange contribution {NOT_AVAILABLE}
              </p>
              <p className="mt-1 text-caption text-muted">
                A part-exchange valuation is not available.
              </p>
            </section>
          ) : null}
        </DealCard>

        <DealCard className="space-y-5">
          <fieldset>
            <legend className="text-label">Finance type</legend>
            <p id="quote-type-hint" className="mt-1 text-caption text-muted">
              Hire Purchase is the starting choice. Personal Contract Purchase
              is the other option.
            </p>
            <div
              role="radiogroup"
              aria-describedby="quote-type-hint"
              className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
              {(
                [
                  { value: "hp" as const, label: "Hire Purchase (HP)" },
                  { value: "pcp" as const, label: "Personal Contract Purchase (PCP)" },
                ]
              ).map((option) => {
                const selected = type === option.value;
                return (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="quote-finance-type"
                      value={option.value}
                      checked={selected}
                      className="peer sr-only"
                      onChange={() =>
                        setChoices((current) => ({
                          ...current,
                          financeType: option.value,
                        }))
                      }
                    />
                    <span
                      className={cn(
                        "flex min-h-11 items-center justify-center rounded-[14px] border px-3 py-2 text-center text-body-sm whitespace-normal",
                        "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                        selected
                          ? "border-primary bg-primary font-semibold! text-white shadow-[0_6px_16px_rgb(0_97_162/0.22)]"
                          : "border-transparent bg-page-tint text-ink hover:bg-surface-soft",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-muted">
              Monthly payment
            </p>
            <p className="mt-1 text-h3 text-navy">{NOT_AVAILABLE}</p>
            <p className="mt-2 text-body-sm text-muted">APR {NOT_AVAILABLE}</p>
            <p className="mt-1 text-caption text-muted">
              A finance quote for {typeName} is not available.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <QuoteStat label="Finance type" value={type === "hp" ? "HP" : "PCP"} />
            <QuoteStat
              label="Finance term"
              value={choices.term ? `${choices.term} months` : "Not chosen"}
            />
            <QuoteStat label="Deposit" value={ready ? depositLabel : "Not chosen"} />
            {ready && choices.partExchange ? (
              <QuoteStat label="Part-exchange contribution" value={NOT_AVAILABLE} />
            ) : null}
            {type === "pcp" ? (
              <QuoteStat
                label="Annual mileage"
                value={choices.mileageLabel ?? "Not chosen"}
              />
            ) : null}
          </dl>

          <section aria-labelledby="quote-cover">
            <h2 id="quote-cover" className="text-label text-navy">
              Cover
            </h2>
            {choices.cover.length === 0 ? (
              <p className="mt-1 text-body-sm text-muted">
                {ready ? "No cover selected." : "Not chosen"}
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-body-sm">
                {choices.cover.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span>
                      {product.name}
                      {product.detail ? ` · ${product.detail}` : ""}
                    </span>
                    <span className="shrink-0 text-muted">{NOT_AVAILABLE}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </DealCard>

        <DealCard>
          <h2 className="text-label text-navy">Payment timeline</h2>
          <p className="mt-1 text-caption text-muted">
            A payment schedule is not available.
          </p>
          <ol className="relative mt-4 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
            {[
              {
                title: "Up front",
                body: choices.partExchange
                  ? "Your deposit and part-exchange contribution are paid at the start."
                  : "Your deposit is paid at the start.",
              },
              {
                title: "Monthly",
                body: choices.term
                  ? `A payment each month for ${choices.term} months.`
                  : "A payment each month for the term you chose.",
              },
              {
                title: "End of term",
                body:
                  type === "hp"
                    ? "The Hire Purchase term ends. Any final position is not calculated here."
                    : "The Personal Contract Purchase term ends. Any final position is not calculated here.",
              },
            ].map((item) => (
              <li key={item.title} className="relative pl-6">
                <span className="absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-surface" />
                <p className="text-body-sm font-semibold! text-ink">{item.title}</p>
                <p className="text-caption text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </DealCard>

        <section
          aria-labelledby="quote-example"
          className="rounded-2xl border border-dashed border-border-strong bg-page-tint px-4 py-4"
        >
          <h2 id="quote-example" className="text-label text-navy">
            Representative example
          </h2>
          <p className="mt-1 text-caption text-muted">
            A representative example is not available.
          </p>
          <dl className="mt-3 space-y-2 text-body-sm">
            {EXAMPLE_FIELDS.map((field) => (
              <div key={field.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">{field.label}</dt>
                <dd className="text-right font-semibold! text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <DealStepFooter
        onBack={() => goBack("cover")}
        onContinue={() => goNext("reserve")}
        continueLabel={DEAL_CONTINUE}
        showMonthly={false}
      />
    </div>
  );
}

function QuoteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-page-tint px-3 py-2.5">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 text-body-sm font-semibold! text-ink">{value}</dd>
    </div>
  );
}
