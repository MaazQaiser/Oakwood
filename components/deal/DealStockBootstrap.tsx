"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/components/layout/Container";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { createDealAction } from "@/features/deal/actions";
import type { DealStep } from "@/config/routes";
import { getDealUrl, getUsedCarsUrl } from "@/config/routes";
import { DEAL_ENTRY_HEADING } from "@/lib/deal/copy";
import { Button } from "@/components/ui/Button";

export function DealStockBootstrap({
  stockId,
  step,
}: {
  stockId: string;
  step: DealStep;
}) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void createDealAction({ stockId }).then((result) => {
      if (cancelled) {
        return;
      }
      if (!result.ok) {
        setFailed(true);
        return;
      }
      router.replace(getDealUrl(result.dealId, step));
    });
    return () => {
      cancelled = true;
    };
  }, [router, step, stockId]);

  return (
    <>
      <JourneyChrome />
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">{DEAL_ENTRY_HEADING}</h1>
          <p className="mt-2 text-body text-muted" role="status">
            {failed
              ? "We couldn't open a deal for this car."
              : "Opening your deal…"}
          </p>
          {failed ? (
            <Button href={getUsedCarsUrl()} className="mt-4">
              Browse cars
            </Button>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
