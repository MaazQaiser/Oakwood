"use client";

import { useState, type ComponentType } from "react";
import {
  Check,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/Loading";
import {
  ILLUSTRATIVE_TIER_APR,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import {
  COVER_INFO,
  COVER_YEAR_OPTIONS,
  defaultCoverYears,
  productPriceForYears,
} from "@/lib/deal/products";
import {
  DEAL_AA_BADGE,
  DEAL_AA_BREAKDOWN,
  DEAL_ADD_RECOMMENDED_COVER,
  DEAL_BUDGET_HP_LEAD,
  DEAL_BUDGET_PCP_LEAD,
  DEAL_CLEAR_ALL_COVER,
  DEAL_CONTINUE_TO_RESERVE,
  DEAL_YOUR_DEAL_APR_DISCLAIMER,
  DEAL_YOUR_DEAL_MOCK_PRICE,
  DEAL_YOUR_DEAL_TIER_HINT,
} from "@/lib/deal/copy";
import { cn } from "@/lib/cn";
import { formatNumber, formatPounds, formatTerm } from "@/lib/format/money";
import type {
  DealCreditTier,
  DealProductDefinition,
} from "@/types/deal";

type InfoTab = "covered" | "not" | "terms" | "faq" | "video";

const PRODUCT_ICON: Record<string, ComponentType<{ className?: string }>> = {
  "aa-warranty": ShieldCheck,
  "service-plan": Wrench,
  "mot-maintenance": FileCheck,
  supagard: Sparkles,
};

const TIER_OPTIONS: { value: DealCreditTier; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "poor", label: "Poor" },
];

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

function ProductInfoPanel({
  product,
  defaultTab,
}: {
  product: DealProductDefinition;
  defaultTab?: InfoTab;
}) {
  const info = COVER_INFO[product.id];
  const [tab, setTab] = useState<InfoTab>(defaultTab ?? "covered");
  const [videoFailed, setVideoFailed] = useState(false);

  if (!info) {
    return (
      <p className="mt-3 text-caption text-muted">
        Product details are not available in this prototype.
      </p>
    );
  }

  const tabs: { id: InfoTab; label: string }[] = [
    { id: "covered", label: "Included" },
    { id: "not", label: "Not covered" },
    { id: "terms", label: "T&Cs" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="mt-4 rounded-[16px] border border-border bg-page-tint p-3">
      <div
        role="tablist"
        aria-label={`${product.name} information`}
        className="flex flex-wrap gap-1"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={cn(
              "min-h-9 rounded-lg px-2.5 text-caption font-semibold!",
              tab === item.id
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink",
            )}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-3 space-y-3 text-body-sm">
        {info.videoSrc ? (
          <div className="space-y-2">
            <p className="text-caption font-semibold! text-ink">
              90-second product overview
            </p>
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              {videoFailed ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-white">
                  <p className="text-body-sm font-semibold!">90-second overview</p>
                  <p className="text-caption text-white/75">
                    The product video plays here on Oakwood. The file is not in this prototype yet.
                  </p>
                </div>
              ) : (
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  onError={() => setVideoFailed(true)}
                >
                  <source src={info.videoSrc} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        ) : null}
        {tab === "covered" || tab === "not" ? (
          <ul className="space-y-2">
            {(tab === "covered" ? info.covered : info.notCovered).map((item) => (
              <li key={item} className="flex gap-2">
                {tab === "covered" ? (
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden
                  />
                ) : (
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                )}
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {tab === "terms" ? (
          <p className="text-muted">
            {info.terms}{" "}
            <span className="text-caption">
              (Prototype wording — final T&amp;Cs subject to supplier sign-off.)
            </span>
          </p>
        ) : null}
        {tab === "faq" ? (
          <div className="space-y-4">
            {info.faq.map((item) => (
              <div key={item.q}>
                <p className="text-label">{item.q}</p>
                <p className="mt-1 text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  hero = false,
}: {
  product: DealProductDefinition;
  hero?: boolean;
}) {
  const { draft, toggleProduct, setProductYears, productImpact } =
    useDealBuilder();
  const [infoOpen, setInfoOpen] = useState(false);
  const selected = draft.productIds.includes(product.id);
  const isOneOff = product.id === "supagard";
  const years =
    draft.productYears?.[product.id] ??
    defaultCoverYears(draft.term)[product.id] ??
    1;
  const price = productPriceForYears(product, years);
  const impact = productImpact(product.id);
  const Icon = PRODUCT_ICON[product.id] ?? ShieldCheck;

  return (
    <article
      className={cn(
        "relative rounded-[24px] p-5 transition-[background-color,box-shadow]",
        hero
          ? "bg-navy text-white shadow-[0_12px_28px_rgb(0_40_82/0.28)]"
          : selected
            ? "bg-surface shadow-card ring-1 ring-primary/15"
            : "bg-surface/60 ring-1 ring-border/70",
      )}
    >
      <button
        type="button"
        aria-expanded={infoOpen}
        aria-label={`${product.name} information`}
        onClick={() => setInfoOpen((open) => !open)}
        className={cn(
          "absolute top-4 right-4 grid h-5 w-5 place-items-center rounded-full text-[0.7rem] font-semibold! italic",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          hero
            ? "bg-[#FFD100] text-navy"
            : "bg-page-tint text-primary ring-1 ring-border",
        )}
      >
        i
      </button>

      <div className="flex items-center gap-3 pr-8">
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
            hero
              ? "bg-white/10 text-[#FFD100]"
              : selected
                ? "bg-surface-soft text-primary"
                : "bg-page-tint text-muted",
          )}
        >
          <Icon className="h-[1.125rem] w-[1.125rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={cn("text-label", hero && "text-white")}>
            {product.name}
          </h3>
          {hero ? (
            <p className="mt-1 inline-flex rounded-full bg-[#FFD100] px-2 py-0.5 text-[0.65rem] font-semibold! uppercase tracking-[0.08em] text-navy">
              {DEAL_AA_BADGE}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "tabular-number text-body-sm font-semibold!",
            hero ? "text-white" : selected ? "text-primary" : "text-muted",
          )}
        >
          +{formatPounds(impact)}/mo
        </span>
        <Switch
          checked={selected}
          label={`Include ${product.name}`}
          onChange={() => toggleProduct(product.id)}
        />
      </div>

      <p className={cn("mt-2 text-body-sm", hero ? "text-white/85" : "text-muted")}>
        {product.summary}
      </p>
      {hero ? (
        <p className="mt-2 text-caption font-semibold! text-[#FFD100]">
          {DEAL_AA_BREAKDOWN}
        </p>
      ) : null}

      {!isOneOff ? (
        <div className={cn("mt-3", !selected && "opacity-70", hero && "[&_legend]:text-white [&_.text-muted]:text-white/70")}>
          <DealChipGroup
            label="Duration"
            value={selected ? years : undefined}
            options={COVER_YEAR_OPTIONS.map((year) => ({
              value: year,
              label: `${year} yr`,
            }))}
            columns={4}
            onChange={(year) => setProductYears(product.id, year)}
          />
        </div>
      ) : null}

      <p
        className={cn(
          "mt-3 text-caption",
          hero ? "text-white/70" : "text-muted",
        )}
      >
        {formatPounds(price)}
        {isOneOff ? " one-off" : ` for ${years} year${years === 1 ? "" : "s"}`}
        {" · "}
        {DEAL_YOUR_DEAL_MOCK_PRICE}
      </p>

      {infoOpen ? (
        <div className={hero ? "[&_*]:text-ink" : undefined}>
          <ProductInfoPanel product={product} />
        </div>
      ) : null}
    </article>
  );
}

function FinanceSummaryHero() {
  const {
    draft,
    calculation,
    apr,
    phase,
    setFinanceType,
    setCreditTier,
  } = useDealBuilder();
  const monthly = calculation?.monthlyPayment ?? 0;
  const equity = calculation?.pxEquity ?? 0;
  const cash = calculation?.cashDeposit ?? draft.cashDeposit;
  const totalDeposit = calculation?.totalDeposit ?? cash;
  const tier = draft.creditTier ?? "average";
  const displayApr = apr ?? ILLUSTRATIVE_TIER_APR[tier];
  const updating = phase === "RECALCULATING";

  return (
    <div className="space-y-4">
      <div className="sticky top-[calc(var(--oak-header-height)+4.75rem)] z-10 lg:top-[calc(var(--oak-header-height)+1rem)]">
        <DealCard className="!bg-navy !text-white !shadow-[0_12px_28px_rgb(0_40_82/0.25)]">
          <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
            Your monthly
          </p>
          {updating ? (
            <div className="mt-2 text-white/80">
              <LoadingState label="Updating your deal…" />
            </div>
          ) : (
            <p className="mt-1">
              <FinancialNumber
                value={formatPounds(monthly)}
                suffix="/mo"
                size="lg"
                className="text-white"
              />
            </p>
          )}
        </DealCard>
      </div>

      <DealCard className="space-y-5">
        <div>
          <p className="text-label">
            {draft.financeType === "hp"
              ? "Hire Purchase"
              : "Personal Contract Purchase"}
          </p>
          <p className="mt-1 text-body-sm text-ink">
            Estimated {displayApr.toFixed(1)}% APR
          </p>
          <p className="mt-1 text-caption text-muted">
            {DEAL_YOUR_DEAL_APR_DISCLAIMER}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-body-sm sm:grid-cols-4">
          <SummaryStat label="Cash deposit" value={formatPounds(cash)} />
          <SummaryStat label="Part exchange" value={formatPounds(equity)} />
          <SummaryStat label="Total deposit" value={formatPounds(totalDeposit)} />
          <SummaryStat label="Term" value={formatTerm(draft.term)} />
          {draft.financeType === "pcp" && draft.annualMileage ? (
            <SummaryStat
              label="Annual mileage"
              value={`${formatNumber(draft.annualMileage)} miles`}
            />
          ) : null}
        </dl>
        <DealChipGroup
          label="Credit tier"
          value={tier}
          options={TIER_OPTIONS}
          columns={4}
          onChange={setCreditTier}
          hint={DEAL_YOUR_DEAL_TIER_HINT}
        />

        <div>
          <p className="text-label">Finance type</p>
          <div
            role="tablist"
            aria-label="Finance type"
            className="mt-2 grid grid-cols-2 gap-2"
          >
            {(
              [
                { id: "hp" as const, lead: DEAL_BUDGET_HP_LEAD },
                { id: "pcp" as const, lead: DEAL_BUDGET_PCP_LEAD },
              ] as const
            ).map((item) => {
              const selected = draft.financeType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFinanceType(item.id)}
                  className={cn(
                    "rounded-[16px] px-3 py-3 text-left transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    selected
                      ? "bg-navy text-white"
                      : "bg-page-tint text-ink hover:bg-surface-soft",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[0.68rem] font-semibold! uppercase tracking-[0.1em]",
                      selected ? "text-white/75" : "text-muted",
                    )}
                  >
                    {item.id.toUpperCase()}
                  </span>
                  <span className="mt-0.5 block text-body-sm font-semibold!">
                    {item.lead}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </DealCard>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-page-tint px-3 py-2.5">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 tabular-number text-body-sm font-semibold! text-ink">
        {value}
      </dd>
    </div>
  );
}

export function DealCoverStep() {
  const {
    products,
    draft,
    calculation,
    coverMonthly,
    phase,
    clearAllCover,
    addRecommendedCover,
  } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("cover");
  const count = draft.productIds.length;
  const aa = products.find((product) => product.id === "aa-warranty");
  const rest = products.filter((product) => product.id !== "aa-warranty");
  const calcError = phase === "CALCULATION_ERROR";
  const emptyProducts = products.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <FinanceSummaryHero />

        {calcError ? (
          <Alert title="We couldn't update your figures" tone="warning">
            Check your selections and try again. Illustrative quotes may be
            temporarily unavailable.
          </Alert>
        ) : null}

        {emptyProducts ? (
          <DealCard>
            <p className="text-body-sm text-muted">
              Optional products are not loaded in this session.
            </p>
          </DealCard>
        ) : (
          <div className="space-y-3">
            {aa ? <ProductCard product={aa} hero /> : null}
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-[24px] bg-surface px-5 py-4 shadow-card">
          <div className="min-w-0">
            <p className="text-caption text-muted">Optional products</p>
            {count > 0 ? (
              <button
                type="button"
                className="mt-0.5 min-h-8 text-caption font-semibold! text-primary underline underline-offset-2"
                onClick={clearAllCover}
              >
                {DEAL_CLEAR_ALL_COVER}
              </button>
            ) : (
              <button
                type="button"
                className="mt-0.5 min-h-8 text-caption font-semibold! text-primary underline underline-offset-2"
                onClick={addRecommendedCover}
              >
                {DEAL_ADD_RECOMMENDED_COVER}
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="financial-number financial-number--compact text-navy">
              +{formatPounds(coverMonthly)}
              <span className="text-body-sm font-normal text-muted">/mo</span>
            </p>
            <p className="text-caption text-muted">
              {count > 0
                ? `${formatPounds(calculation?.productsTotal ?? 0)} total · ${count} product${count === 1 ? "" : "s"}`
                : "No cover added"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <SaveDeal />
      </div>

      <DealStepFooter
        onBack={() => goBack("budget")}
        onContinue={() => goNext("reserve")}
        continueLabel={DEAL_CONTINUE_TO_RESERVE}
        continueDisabled={calcError}
      />
    </div>
  );
}
