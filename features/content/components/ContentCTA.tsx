"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { ContentCta } from "@/types/content";

export function ContentCTA({
  cta,
  slug,
}: {
  cta: ContentCta;
  slug?: string;
}) {
  return (
    <Card>
      <h3 className="text-h3">{cta.title}</h3>
      <p className="mt-2 text-body-sm text-muted">{cta.body}</p>
      <div className="mt-4">
        <Button
          href={cta.href}
          className="w-full sm:w-auto"
          onClick={() => {
            trackEvent(analyticsEvents.contentCtaClicked, {
              kind: cta.kind,
              slug,
              href: cta.href,
            });
            if (cta.kind === "finance" || cta.kind === "calculator" || cta.kind === "deal") {
              trackEvent(analyticsEvents.contentFinanceClicked, { kind: cta.kind, slug });
            }
            if (cta.kind === "px") {
              trackEvent(analyticsEvents.contentPxClicked, { slug });
            }
            if (cta.kind === "stock") {
              trackEvent(analyticsEvents.modelStockClicked, { slug, href: cta.href });
            }
          }}
        >
          {cta.label}
        </Button>
      </div>
    </Card>
  );
}
