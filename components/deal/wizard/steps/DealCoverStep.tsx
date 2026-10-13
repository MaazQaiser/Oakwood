"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import {
  COVER_INFO,
  COVER_YEAR_OPTIONS,
  productPriceForYears,
} from "@/lib/deal/products";
import {
  DEAL_ADD_RECOMMENDED_COVER,
  DEAL_CLEAR_ALL_COVER,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import type { DealProductDefinition } from "@/types/deal";

type InfoTab = "covered" | "not" | "terms" | "faq" | "video";

function CoverInfoDrawer({
  product,
  open,
  onClose,
}: {
  product: DealProductDefinition | null;
  open: boolean;
  onClose: () => void;
}) {
  const info = product ? COVER_INFO[product.id] : undefined;
  const defaultTab: InfoTab =
    product?.id === "supagard" && info?.videoSrc ? "video" : "covered";
  const [tab, setTab] = useState<InfoTab>(defaultTab);

  if (!product || !info) {
    return null;
  }

  const activeTab = tab || defaultTab;

  const tabs: { id: InfoTab; label: string }[] = [
    ...(info.videoSrc ? [{ id: "video" as const, label: "Video" }] : []),
    { id: "covered", label: "What's covered" },
    { id: "not", label: "What's not covered" },
    { id: "terms", label: "T&Cs" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <Drawer open={open} title={product.name} onClose={onClose} size="full">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "min-h-10 rounded-md border px-3 text-button",
              activeTab === item.id
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface",
            )}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3 text-body-sm">
        {activeTab === "video" && info.videoSrc ? (
          <div className="aspect-video overflow-hidden rounded-md bg-ink/90">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              poster="/images/vehicle-placeholder.svg"
            >
              <source src={info.videoSrc} type="video/mp4" />
              <p className="p-4 text-white">
                Supagard product overview video. A short demo plays here when the
                asset is available.
              </p>
            </video>
            <p className="mt-2 text-muted">
              Short Supagard overview. Nothing links away from this site.
            </p>
          </div>
        ) : null}
        {activeTab === "covered" ? (
          <ul className="list-disc space-y-1 pl-5">
            {info.covered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {activeTab === "not" ? (
          <ul className="list-disc space-y-1 pl-5">
            {info.notCovered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {activeTab === "terms" ? <p>{info.terms}</p> : null}
        {activeTab === "faq" ? (
          <div className="space-y-3">
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

function CoverRow({
  product,
  onInfo,
}: {
  product: DealProductDefinition;
  onInfo: () => void;
}) {
  const {
    draft,
    toggleProduct,
    setProductYears,
    productImpact,
  } = useDealBuilder();
  const selected = draft.productIds.includes(product.id);
  const years = draft.productYears?.[product.id] ?? 1;
  const isSupagard = product.id === "supagard";
  const price = productPriceForYears(product, years);
  const impact = productImpact(product.id);

  return (
    <article className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-label">{product.name}</h3>
            <FinancialNumber value={formatPounds(price)} size="sm" />
          </div>
          <p className="mt-1 text-body-sm text-muted">{product.summary}</p>
          <p className="mt-1 text-caption text-muted">
            Adds about {formatPounds(impact)}/month
          </p>
        </div>
      </div>

      {isSupagard ? (
        <label className="mt-3 flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 accent-primary"
            checked={selected}
            onChange={() => toggleProduct(product.id)}
          />
          <span className="text-body-sm">{selected ? "Added" : "Add Supagard"}</span>
        </label>
      ) : (
        <div className="mt-3">
          <DealChipGroup
            label="Term"
            value={selected ? years : undefined}
            options={COVER_YEAR_OPTIONS.map((year) => ({
              value: year,
              label: `${year} year${year === 1 ? "" : "s"}`,
            }))}
            onChange={(year) => setProductYears(product.id, year)}
          />
          {selected ? (
            <Button
              variant="text"
              className="mt-2 px-0"
              onClick={() => toggleProduct(product.id)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      )}

      <Button variant="text" className="mt-2 px-0" onClick={onInfo}>
        Info
      </Button>
    </article>
  );
}

export function DealCoverStep() {
  const {
    products,
    draft,
    calculation,
    clearAllCover,
    addRecommendedCover,
  } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("cover");
  const [infoProduct, setInfoProduct] = useState<DealProductDefinition | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={addRecommendedCover}>
          {DEAL_ADD_RECOMMENDED_COVER}
        </Button>
        <Button type="button" variant="text" onClick={clearAllCover}>
          {DEAL_CLEAR_ALL_COVER}
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <CoverRow
            key={product.id}
            product={product}
            onInfo={() => setInfoProduct(product)}
          />
        ))}
      </div>

      <div className="rounded-md border border-border bg-page p-4">
        <div className="flex justify-between gap-3">
          <span className="text-label">Cover bundle total</span>
          <FinancialNumber
            value={formatPounds(calculation?.productsTotal ?? 0)}
            size="sm"
          />
        </div>
        <p className="mt-1 text-caption text-muted">
          {draft.productIds.length === 0
            ? "Nothing selected — tap Add recommended cover for a one-tap starter set."
            : `${draft.productIds.length} product${draft.productIds.length === 1 ? "" : "s"} selected.`}
        </p>
      </div>

      {infoProduct ? (
        <CoverInfoDrawer
          key={infoProduct.id}
          product={infoProduct}
          open
          onClose={() => setInfoProduct(null)}
        />
      ) : null}

      <DealStepFooter
        onBack={() => goBack("decision")}
        onContinue={() => goNext("quote")}
      />
    </div>
  );
}
