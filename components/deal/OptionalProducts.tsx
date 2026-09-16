"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { formatPounds } from "@/lib/format/money";
import type { DealProductDefinition } from "@/types/deal";

export function ProductCard({ product }: { product: DealProductDefinition }) {
  const { draft, toggleProduct, removeProduct, productImpact } = useDealBuilder();
  const selected = draft.productIds.includes(product.id);
  const impact = productImpact(product.id);
  const checkboxId = `product-${product.id}`;

  return (
    <article className="rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          className="mt-1 h-5 w-5 accent-primary"
          checked={selected}
          onChange={() => toggleProduct(product.id)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-2">
            <label htmlFor={checkboxId} className="text-label">
              {product.name}
              {selected ? " ✓" : ""}
            </label>
            <FinancialNumber value={formatPounds(product.price)} size="sm" />
          </div>
          <p className="mt-1 text-body-sm text-muted">{product.summary}</p>
          <p className="mt-1 text-caption text-muted">
            Adds approximately {formatPounds(impact)}/month
          </p>
          <details
            className="mt-2"
            onToggle={(event) => {
              if (event.currentTarget.open) {
                trackEvent(analyticsEvents.productViewed);
              }
            }}
          >
            <summary className="cursor-pointer text-body-sm text-primary">
              Learn more
            </summary>
            <p className="mt-2 text-body-sm text-muted">{product.details}</p>
            <p className="mt-2 text-caption text-muted">
              {product.financeable
                ? "This product is treated as financeable in the mock calculation until the lender confirms."
                : "This product is paid separately and is not added to the amount financed in the mock calculation."}
            </p>
          </details>
          {selected ? (
            <Button
              variant="text"
              className="mt-2 px-0"
              onClick={() => removeProduct(product.id)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function OptionalProducts() {
  const { products } = useDealBuilder();

  return (
    <section
      aria-labelledby="optional-products-heading"
      className="rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="optional-products-heading" className="text-h3">
        Optional products
      </h2>
      <p className="mt-1 text-body-sm text-muted">
        None of these are selected unless you choose them. You can remove any
        product individually.
      </p>
      <div className="mt-4 space-y-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
