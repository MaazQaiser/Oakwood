"use client";

import { useEffect, useId, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Dialogs";
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
  DEAL_CLEAR_ALL_COVER,
  DEAL_CONTINUE,
  DEAL_YOUR_DEAL_APR_DISCLAIMER,
} from "@/lib/deal/copy";
import { COVER_INFO, defaultCoverYears } from "@/lib/deal/products";
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
          <ul className="space-y-2">
            {product.included.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
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

export function DealCoverStep() {
  const { dealId, draft } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("quote");
  const [financeType, setFinanceType] = useState<"hp" | "pcp">("hp");
  const [tier, setTier] = useState<(typeof CREDIT_TIERS)[number]>("Good");
  const [selected, setSelected] = useState<string[]>(PRODUCTS.map((item) => item.id));
  const [years, setYears] = useState<Record<string, number>>(() =>
    yearChoices(draft.term),
  );
  const [infoId, setInfoId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
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
        setHydrated(true);
        return;
      } catch {
        window.sessionStorage.removeItem(storageKey(dealId));
      }
    }
    setYears(yearChoices(financeTermMonths(dealId, draft.term)));
    setSelected(PRODUCTS.map((item) => item.id));
    try {
      const finance = JSON.parse(
        window.sessionStorage.getItem(`oakwood-deal-finance:${dealId}`) ?? "{}",
      ) as { financeType?: string };
      setFinanceType(finance.financeType === "pcp" ? "pcp" : "hp");
    } catch {
      setFinanceType("hp");
    }
    setHydrated(true);
  }, [dealId, draft.term]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const saved: SavedCover = { selected, years };
    window.sessionStorage.setItem(storageKey(dealId), JSON.stringify(saved));
  }, [dealId, hydrated, selected, years]);

  const openProduct = PRODUCTS.find((item) => item.id === infoId) ?? null;
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
        <div className="rounded-card bg-navy p-5 text-white shadow-card sm:p-7">
          <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
            Monthly payment
          </p>
          <p className="mt-2 text-body font-semibold!">
            {financeType === "hp" ? "Hire Purchase" : "Personal Contract Purchase"}
          </p>
          <p className="mt-2 text-caption text-white/75">
            {DEAL_YOUR_DEAL_APR_DISCLAIMER}
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
          return (
            <DealCard key={product.id} className={cn(!on && "opacity-80")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {product.id === "aa-warranty" ? (
                    <p className="text-caption font-semibold! text-primary">
                      {DEAL_AA_BADGE}
                    </p>
                  ) : null}
                  <h2 className="text-label text-navy">{product.name}</h2>
                  {product.id === "aa-warranty" ? (
                    <p className="mt-1 text-body-sm text-ink">{DEAL_AA_BREAKDOWN}</p>
                  ) : null}
                  <p className={cn("mt-1 text-caption font-semibold!", on ? "text-primary" : "text-muted")}>
                    {on ? "Selected" : "Not selected"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-caption font-semibold! text-ink">
                    {on ? "On" : "Off"}
                  </span>
                  <Switch
                    checked={on}
                    label={`${product.name} ${on ? "on" : "off"}`}
                    onChange={() => toggle(product.id)}
                  />
                </div>
              </div>

              {product.included.length > 0 ? (
                <ul className="mt-3 space-y-1.5 text-body-sm text-ink">
                  {product.included.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
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

              <div className="mt-4 flex flex-wrap items-end justify-end gap-3">
                <Button
                  type="button"
                  variant="tertiary"
                  className="min-h-11"
                  onClick={() => setInfoId(product.id)}
                >
                  Product information
                </Button>
              </div>
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

      <Drawer
        open={openProduct !== null}
        title={openProduct?.name ?? "Product information"}
        onClose={() => setInfoId(null)}
      >
        {openProduct ? <ProductInfo key={openProduct.id} product={openProduct} /> : null}
      </Drawer>
    </div>
  );
}
