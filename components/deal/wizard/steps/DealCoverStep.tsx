"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import {
  DEAL_AA_BADGE,
  DEAL_AA_BREAKDOWN,
  DEAL_CALCULATION_UNAVAILABLE,
  DEAL_CLEAR_ALL_COVER,
  DEAL_CONTINUE,
  DEAL_PRICE_UNAVAILABLE,
  DEAL_TOTAL_PAYABLE_LABEL,
  DEAL_VIDEO_UNAVAILABLE,
  DEAL_YOUR_DEAL_APR_DISCLAIMER,
  DEAL_YOUR_DEAL_MOCK_PRICE,
  DEAL_YOUR_DEAL_PAYMENT_NOTE,
} from "@/lib/deal/copy";
import { IconAaBadge } from "@/components/home/HomeProofIcons";
import { COVER_INFO, defaultCoverYears, productPriceForYears } from "@/lib/deal/products";
import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { getRatesFromLabel } from "@/lib/finance/representative-example";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

const YEAR_OPTIONS = [1, 2, 3, 4] as const;
const CREDIT_TIERS = ["Excellent", "Good", "Average", "Poor"] as const;

type InfoTab = "video" | "included" | "excluded" | "terms" | "faq";

type CoverProduct = {
  id: string;
  name: string;
  years: boolean;
  /** Facts supplied for this prototype. Anything else stays a placeholder. */
  included: string[];
  video?: boolean;
};

const PRODUCTS: CoverProduct[] = [
  {
    id: "aa-warranty",
    name: "AA Warranty",
    years: true,
    included: [
      "Standard tier",
      "£2,000 claim limit",
      "AA breakdown included",
    ],
  },
  {
    id: "service-plan",
    name: "Service Plan",
    years: true,
    included: [],
  },
  {
    id: "mot-maintenance",
    name: "MOT Plan",
    years: true,
    included: [],
  },
  {
    id: "supagard",
    name: "Supagard",
    years: false,
    video: true,
    included: [
      "Paint protection",
      "Interior protection",
      "1-year aftercare",
    ],
  },
];

type SavedCover = {
  selected: string[];
  years: Record<string, number>;
  tier?: (typeof CREDIT_TIERS)[number];
  financeType?: "hp" | "pcp";
};

function storageKey(dealId: string) {
  return `oakwood-deal-cover:${dealId}`;
}

function financeTermMonths(dealId: string, fallback: number): number {
  try {
    const raw = window.sessionStorage.getItem(`oakwood-deal-finance:${dealId}`);
    if (!raw) {
      return fallback;
    }
    const term = Number((JSON.parse(raw) as { term?: number }).term);
    return [24, 36, 48, 60, 72, 84].includes(term) ? term : fallback;
  } catch {
    return fallback;
  }
}

function yearChoices(termMonths: number): Record<string, number> {
  const defaults = defaultCoverYears(termMonths);
  return {
    "aa-warranty": defaults["aa-warranty"] ?? 3,
    "service-plan": defaults["service-plan"] ?? 1,
    "mot-maintenance": defaults["mot-maintenance"] ?? 1,
  };
}

function Switch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        checked ? "bg-primary" : "bg-border-strong",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function ProductInfo({
  product,
}: {
  product: CoverProduct;
}) {
  const info = COVER_INFO[product.id];
  const [tab, setTab] = useState<InfoTab>(product.video ? "video" : "included");
  const tabs: { id: InfoTab; label: string }[] = [
    ...(product.video ? [{ id: "video" as const, label: "Video" }] : []),
    { id: "included", label: "Included" },
    { id: "excluded", label: "Not covered" },
    { id: "terms", label: "T&Cs" },
    { id: "faq", label: "FAQ" },
  ];
  const tabId = useId();
  const included = info?.covered?.length ? info.covered : product.included;

  return (
    <div>
      <div
        role="tablist"
        aria-label={`${product.name} information`}
        className="flex flex-wrap gap-1"
      >
        {tabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${tabId}-${item.id}`}
              aria-selected={selected}
              aria-controls={`${tabId}-panel`}
              className={cn(
                "min-h-11 rounded-[14px] px-3 text-caption font-semibold!",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                selected
                  ? "bg-primary text-white"
                  : "bg-page-tint text-ink hover:bg-surface-soft",
              )}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${tabId}-panel`}
        aria-labelledby={`${tabId}-${tab}`}
        className="mt-4 text-body-sm"
      >
        {tab === "video" ? (
          <p className="text-body-sm text-muted">{DEAL_VIDEO_UNAVAILABLE}</p>
        ) : null}
        {tab === "included" && included.length > 0 ? (
          <ul className="space-y-2">
            {included.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {tab === "excluded" && info?.notCovered?.length ? (
          <ul className="space-y-2">
            {info.notCovered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {tab === "terms" && info?.terms ? <p>{info.terms}</p> : null}
        {tab === "faq" && info?.faq?.length ? (
          <dl className="space-y-3">
            {info.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold! text-navy">{item.q}</dt>
                <dd className="mt-1 text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

const TIER_TO_DRAFT = {
  Excellent: "excellent",
  Good: "good",
  Average: "average",
  Poor: "poor",
} as const;

export function DealCoverStep() {
  const {
    dealId,
    draft,
    products,
    calculation,
    phase,
    setFinanceType: persistFinanceType,
    setCreditTier,
    setCoverSelection,
    productImpact,
  } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("quote");
  const [financeType, setFinanceType] = useState<"hp" | "pcp">(
    draft.financeType === "pcp" ? "pcp" : "hp",
  );
  const [tier, setTier] = useState<(typeof CREDIT_TIERS)[number]>("Good");
  const [selected, setSelected] = useState<string[]>(PRODUCTS.map((item) => item.id));
  const [years, setYears] = useState<Record<string, number>>(() =>
    yearChoices(draft.term),
  );
  const [infoId, setInfoId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) {
      return;
    }
    seeded.current = true;
    const raw = window.sessionStorage.getItem(storageKey(dealId));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Partial<SavedCover>;
        const known = new Set(PRODUCTS.map((item) => item.id));
        const nextSelected = Array.isArray(saved.selected)
          ? saved.selected.filter((id) => known.has(id))
          : PRODUCTS.map((item) => item.id);
        const nextYears = yearChoices(financeTermMonths(dealId, draft.term));
        if (saved.years) {
          for (const [id, value] of Object.entries(saved.years)) {
            const year = Number(value);
            if (known.has(id) && YEAR_OPTIONS.includes(year as 1 | 2 | 3 | 4)) {
              nextYears[id] = year;
            }
          }
        }
        setSelected(nextSelected);
        setYears(nextYears);
        if (
          saved.tier &&
          CREDIT_TIERS.includes(saved.tier)
        ) {
          setTier(saved.tier);
        }
        if (saved.financeType === "pcp" || saved.financeType === "hp") {
          setFinanceType(saved.financeType);
        }
        setHydrated(true);
        return;
      } catch {
        window.sessionStorage.removeItem(storageKey(dealId));
      }
    }
    const visited = draft.stepsCompleted?.some(
      (step) => step === "quote" || step === "cover",
    );
    setYears({
      ...yearChoices(financeTermMonths(dealId, draft.term)),
      ...draft.productYears,
    });
    setSelected(
      visited ? draft.productIds : PRODUCTS.map((item) => item.id),
    );
    setFinanceType(draft.financeType === "pcp" ? "pcp" : "hp");
    const savedTier = CREDIT_TIERS.find(
      (item) => TIER_TO_DRAFT[item] === draft.creditTier,
    );
    if (savedTier) {
      setTier(savedTier);
    }
    setHydrated(true);
  }, [dealId, draft]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const saved: SavedCover = { selected, years, tier, financeType };
    window.sessionStorage.setItem(storageKey(dealId), JSON.stringify(saved));
    setCoverSelection(selected, years);
    persistFinanceType(financeType);
    setCreditTier(TIER_TO_DRAFT[tier]);
  }, [
    dealId,
    financeType,
    hydrated,
    persistFinanceType,
    selected,
    setCoverSelection,
    setCreditTier,
    tier,
    years,
  ]);

  const chosen = PRODUCTS.filter((item) => selected.includes(item.id));

  function selectFinanceType(next: "hp" | "pcp") {
    setFinanceType(next);
    try {
      const key = `oakwood-deal-finance:${dealId}`;
      const saved = JSON.parse(window.sessionStorage.getItem(key) ?? "{}") as {
        financeType?: string;
        term?: number;
      };
      saved.financeType = next;
      if (next === "pcp" && Number(saved.term) > 60) {
        saved.term = 60;
      }
      window.sessionStorage.setItem(key, JSON.stringify(saved));
      window.sessionStorage.setItem(
        `oakwood-deal-quote:${dealId}`,
        JSON.stringify({ financeType: next }),
      );
    } catch {
      window.sessionStorage.setItem(
        `oakwood-deal-quote:${dealId}`,
        JSON.stringify({ financeType: next }),
      );
    }
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 pb-5">
        <div className="overflow-hidden rounded-card bg-[linear-gradient(145deg,var(--oak-navy-deep)_0%,var(--oak-navy)_46%,#0a4d86_100%)] p-5 text-white shadow-card sm:p-7">
          <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
            Monthly payment
          </p>
          {phase === "CALCULATION_ERROR" || !calculation ? (
            <p className="mt-2 text-body font-semibold!" role="status">
              {DEAL_CALCULATION_UNAVAILABLE}
            </p>
          ) : (
            <p className="mt-2" role="status">
              <FinancialNumber
                value={formatPounds(calculation.monthlyPayment)}
                suffix="/mo"
                size="lg"
                className="text-white [&_.text-muted]:text-white/70"
              />
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-body font-semibold!">
              {financeType === "hp" ? "Hire Purchase" : "Personal Contract Purchase"}
            </p>
            {calculation ? (
              <p className="text-caption text-white/80">
                {DEAL_TOTAL_PAYABLE_LABEL}{" "}
                <span className="tabular-number font-semibold! text-white">
                  {formatPounds(calculation.totalPayable)}
                </span>
              </p>
            ) : null}
          </div>
          <p className="mt-3 max-w-xl text-caption text-white/75">
            {DEAL_YOUR_DEAL_PAYMENT_NOTE}
            {getRatesFromLabel(FINANCE_CALCULATOR_CONFIG.ratesFromApr)
              ? ` ${getRatesFromLabel(FINANCE_CALCULATOR_CONFIG.ratesFromApr)}.`
              : ""}
          </p>
        </div>

        <DealCard className="space-y-4">
          <DealChipGroup
            label="Credit tier"
            hint={DEAL_YOUR_DEAL_APR_DISCLAIMER}
            value={tier}
            columns={2}
            options={CREDIT_TIERS.map((item) => ({ value: item, label: item }))}
            onChange={setTier}
          />
          <DealChipGroup
            label="Finance type"
            value={financeType}
            columns={2}
            options={[
              { value: "hp", label: "Hire Purchase" },
              { value: "pcp", label: "Personal Contract Purchase" },
            ]}
            onChange={selectFinanceType}
          />
        </DealCard>

        {PRODUCTS.map((product) => {
          const on = selected.includes(product.id);
          const duration = years[product.id] ?? 1;
          const catalogue = products.find((item) => item.id === product.id);
          const configuredPrice =
            catalogue && catalogue.price > 0
              ? productPriceForYears(catalogue, product.years ? duration : 1)
              : undefined;
          const impact = on && configuredPrice ? productImpact(product.id) : undefined;
          const detailsOpen = infoId === product.id;
          const isAa = product.id === "aa-warranty";
          const switchControl = (
            <Switch
              checked={on}
              label={`${product.name} ${on ? "on" : "off"}`}
              onChange={() => toggle(product.id)}
            />
          );
          return (
            <DealCard
              key={product.id}
              className={cn(isAa && "overflow-hidden", !on && "opacity-80")}
            >
              {isAa ? (
                <div className="-mx-5 -mt-5 mb-4 flex items-center justify-between gap-3 bg-[#FFD100] px-5 py-4 text-[#1A1A1A] sm:-mx-7 sm:-mt-7 sm:px-7">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white">
                      <IconAaBadge tile={false} className="h-11 w-11" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-caption font-semibold! uppercase tracking-[0.08em]">
                        {DEAL_AA_BADGE}
                      </p>
                      <h2 className="text-label">{product.name}</h2>
                      <p className="text-caption">{DEAL_AA_BREAKDOWN}</p>
                    </div>
                  </div>
                  {switchControl}
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-label text-navy">{product.name}</h2>
                  </div>
                  {switchControl}
                </div>
              )}
              <p className={cn("text-caption font-semibold!", on ? (isAa ? "text-[#1A1A1A]" : "text-primary") : "text-muted")}>
                {on ? "Selected" : "Not selected"}
              </p>

              {product.included.length > 0 ? (
                isAa ? (
                  <ul className="mt-3 flex flex-nowrap gap-2 overflow-x-auto">
                    {product.included.map((item) => (
                      <li
                        key={item}
                        className="shrink-0 rounded-full bg-page-tint px-3 py-1.5 text-caption font-semibold! whitespace-nowrap text-ink"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-3 space-y-1.5 text-body-sm text-ink">
                    {product.included.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              ) : null}

              {product.years ? (
                <div className="mt-4">
                  <DealChipGroup
                    label="Duration"
                    hint={
                      product.id === "aa-warranty"
                        ? "Starts at 3 years."
                        : "Starts at the length of your finance term, up to 4 years."
                    }
                    value={on ? duration : undefined}
                    columns={4}
                    options={YEAR_OPTIONS.map((year) => ({
                      value: year,
                      label: year === 1 ? "1 year" : `${year} years`,
                      disabled: !on,
                    }))}
                    onChange={(year) =>
                      setYears((current) => ({ ...current, [product.id]: year }))
                    }
                  />
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <div className="text-caption text-muted">
                  {configuredPrice ? (
                    <>
                      <p className="font-semibold! text-ink">
                        {formatPounds(configuredPrice)}
                      </p>
                      <p>{DEAL_YOUR_DEAL_MOCK_PRICE}</p>
                      {impact !== undefined ? (
                        <p>
                          Indicative monthly impact {formatPounds(impact)}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p>{DEAL_PRICE_UNAVAILABLE}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="icon"
                  className="min-h-11 min-w-11"
                  aria-expanded={detailsOpen}
                  aria-controls={`${product.id}-info`}
                  aria-label={`${product.name} product information`}
                  onClick={() =>
                    setInfoId((current) =>
                      current === product.id ? null : product.id,
                    )
                  }
                >
                  <Info className="h-5 w-5" aria-hidden />
                </Button>
              </div>
              {detailsOpen ? (
                <div id={`${product.id}-info`} className="mt-4 border-t border-border pt-4">
                  <ProductInfo product={product} />
                </div>
              ) : null}
            </DealCard>
          );
        })}

        <Button
          type="button"
          variant="tertiary"
          className="w-full"
          onClick={() => setSelected([])}
        >
          {DEAL_CLEAR_ALL_COVER}
        </Button>

        {chosen.length === 0 ? (
          <p className="text-body-sm text-muted">No cover selected.</p>
        ) : null}
      </div>

      <DealStepFooter
        onBack={() => goBack("budget")}
        onContinue={() => goNext("reserve")}
        continueLabel={DEAL_CONTINUE}
        showMonthly={false}
      />

    </div>
  );
}
