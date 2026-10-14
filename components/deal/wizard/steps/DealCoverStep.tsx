"use client";

import { useState, type ComponentType } from "react";
import {
  Check,
  ChevronRight,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Drawer } from "@/components/ui/Dialogs";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import {
  COVER_INFO,
  COVER_YEAR_OPTIONS,
  defaultCoverYears,
  productPriceForYears,
} from "@/lib/deal/products";
import {
  DEAL_ADD_RECOMMENDED_COVER,
  DEAL_CLEAR_ALL_COVER,
  DEAL_SEE_MY_QUOTE,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import type { DealProductDefinition } from "@/types/deal";

type InfoTab = "covered" | "not" | "terms" | "faq" | "video";

const PRODUCT_ICON: Record<string, ComponentType<{ className?: string }>> = {
  "aa-warranty": ShieldCheck,
  "service-plan": Wrench,
  "mot-maintenance": FileCheck,
  supagard: Sparkles,
};

function CoverInfoDrawer({
  product,
  initialTab,
  onClose,
}: {
  product: DealProductDefinition;
  initialTab?: InfoTab;
  onClose: () => void;
}) {
  const info = COVER_INFO[product.id];
  const [tab, setTab] = useState<InfoTab>(
    initialTab ?? (info?.videoSrc ? "video" : "covered"),
  );
  const [videoFailed, setVideoFailed] = useState(false);

  if (!info) {
    return null;
  }

  const tabs: { id: InfoTab; label: string }[] = [
    ...(info.videoSrc ? [{ id: "video" as const, label: "Video" }] : []),
    { id: "covered", label: "Included" },
    { id: "not", label: "Not covered" },
    { id: "terms", label: "T&Cs" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <Drawer open title={product.name} onClose={onClose} size="side">
      <div
        role="tablist"
        aria-label={`${product.name} information`}
        className="flex gap-1 rounded-[14px] bg-page-tint p-1"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={cn(
              "min-h-9 flex-1 rounded-lg px-2 text-caption font-semibold! whitespace-nowrap",
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
      <div role="tabpanel" className="mt-4 space-y-3 text-body-sm">
        {tab === "video" && info.videoSrc ? (
          <div>
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              {videoFailed ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-white">
                  <p className="text-body-sm font-semibold! text-white">
                    Video coming soon
                  </p>
                  <p className="text-caption text-white/75">
                    Use the other tabs to see what&apos;s included.
                  </p>
                </div>
              ) : (
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source
                    src={info.videoSrc}
                    type="video/mp4"
                    onError={() => setVideoFailed(true)}
                  />
                </video>
              )}
            </div>
            {videoFailed ? null : (
              <p className="mt-2 text-caption text-muted">
                See {product.name} applied. Plays here, nothing links away.
              </p>
            )}
          </div>
        ) : null}
        {tab === "covered" || tab === "not" ? (
          <ul className="space-y-2">
            {(tab === "covered" ? info.covered : info.notCovered).map(
              (item) => (
                <li key={item} className="flex gap-2">
                  {tab === "covered" ? (
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      aria-hidden
                    />
                  ) : (
                    <X
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                      aria-hidden
                    />
                  )}
                  {item}
                </li>
              ),
            )}
          </ul>
        ) : null}
        {tab === "terms" ? <p className="text-muted">{info.terms}</p> : null}
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
    </Drawer>
  );
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

function CoverCard({
  product,
  onInfo,
}: {
  product: DealProductDefinition;
  onInfo: (tab?: InfoTab) => void;
}) {
  const { draft, toggleProduct, setProductYears, productImpact } =
    useDealBuilder();
  const selected = draft.productIds.includes(product.id);
  const isOneOff = product.id === "supagard";
  const years =
    draft.productYears?.[product.id] ??
    defaultCoverYears(draft.term)[product.id] ??
    1;
  const price = productPriceForYears(product, years);
  const impact = productImpact(product.id);
  const Icon = PRODUCT_ICON[product.id] ?? ShieldCheck;
  const hasVideo = Boolean(COVER_INFO[product.id]?.videoSrc);

  return (
    <article
      className={cn(
        "rounded-[24px] p-5 transition-[background-color,box-shadow]",
        selected
          ? "bg-surface shadow-card ring-1 ring-primary/15"
          : "bg-surface/60 ring-1 ring-border/70",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
            selected
              ? "bg-surface-soft text-primary"
              : "bg-page-tint text-muted",
          )}
        >
          <Icon className="h-[1.125rem] w-[1.125rem]" />
        </span>
        <h3 className="min-w-0 flex-1 text-label">{product.name}</h3>
        <span
          className={cn(
            "tabular-number text-body-sm font-semibold!",
            selected ? "text-primary" : "text-muted",
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

      <p className="mt-2 text-body-sm text-muted">{product.summary}</p>

      {!isOneOff ? (
        <div className={cn("mt-3", !selected && "opacity-70")}>
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

      <div className="mt-3 flex items-center justify-between gap-3 text-caption">
        <span className="text-muted">
          {formatPounds(price)}
          {isOneOff
            ? " one-off"
            : ` for ${years} year${years === 1 ? "" : "s"}`}
        </span>
        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-0.5 font-semibold! text-primary hover:underline"
          onClick={() => onInfo(hasVideo ? "video" : undefined)}
        >
          {hasVideo ? "Watch video" : "Info"}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

export function DealCoverStep() {
  const {
    products,
    draft,
    calculation,
    coverMonthly,
    clearAllCover,
    addRecommendedCover,
  } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("cover");
  const [info, setInfo] = useState<{
    product: DealProductDefinition;
    tab?: InfoTab;
  } | null>(null);
  const count = draft.productIds.length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 pb-5">
        {products.map((product) => (
          <CoverCard
            key={product.id}
            product={product}
            onInfo={(tab) => setInfo({ product, tab })}
          />
        ))}

        <div className="flex items-center justify-between gap-3 rounded-[24px] bg-navy px-5 py-4 text-white">
          <div className="min-w-0">
            <p className="text-caption text-white/75">Your bundle</p>
            {count > 0 ? (
              <button
                type="button"
                className="mt-0.5 min-h-8 text-caption font-semibold! text-white underline underline-offset-2"
                onClick={clearAllCover}
              >
                {DEAL_CLEAR_ALL_COVER}
              </button>
            ) : (
              <button
                type="button"
                className="mt-0.5 min-h-8 text-caption font-semibold! text-white underline underline-offset-2"
                onClick={addRecommendedCover}
              >
                {DEAL_ADD_RECOMMENDED_COVER}
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="financial-number financial-number--compact text-white">
              +{formatPounds(coverMonthly)}
              <span className="text-body-sm font-normal text-white/75">
                /mo
              </span>
            </p>
            <p className="text-caption text-white/75">
              {count > 0
                ? `${formatPounds(calculation?.productsTotal ?? 0)} total · ${count} product${count === 1 ? "" : "s"}`
                : "No cover added"}
            </p>
          </div>
        </div>
      </div>

      {info ? (
        <CoverInfoDrawer
          key={`${info.product.id}-${info.tab ?? "default"}`}
          product={info.product}
          initialTab={info.tab}
          onClose={() => setInfo(null)}
        />
      ) : null}

      <DealStepFooter
        onBack={() => goBack("decision")}
        onContinue={() => goNext("quote")}
        continueLabel={DEAL_SEE_MY_QUOTE}
      />
    </div>
  );
}
