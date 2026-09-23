"use client";

import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { getFinanceCalculatorUrl, getVehicleUrl } from "@/config/routes";
import {
  DEAL_HEADING,
  DEAL_PROFILE_SUPPORTING,
  DEAL_SUPPORTING,
} from "@/lib/deal/copy";

export function DealBuilderHeader() {
  const { vehicle, finance } = useDealBuilder();

  return (
    <PageBanner
      eyebrow="Your deal"
      title={DEAL_HEADING}
      description={
        <>
          <p>{DEAL_SUPPORTING}</p>
          {finance.hasProfile ? <p className="mt-2">{DEAL_PROFILE_SUPPORTING}</p> : null}
        </>
      }
      secondary={{
        href: getFinanceCalculatorUrl({ stockId: vehicle.stockId }),
        label: "Finance calculator",
      }}
    >
      <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
        Back to vehicle
      </Button>
    </PageBanner>
  );
}
