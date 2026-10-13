"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JourneyStart } from "@/components/journeys/JourneyStart";
import { createDealAction } from "@/features/deal/actions";
import { getDealUrl, getUsedCarsUrl } from "@/config/routes";
import {
  DEAL_ENTRY_BODY,
  DEAL_ENTRY_HEADING,
  DEAL_ENTRY_PICK_CAR,
} from "@/lib/deal/copy";
import { readLastViewedStockIdClient } from "@/lib/vehicles/last-viewed";

export function DealEntryClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready">("checking");

  useEffect(() => {
    const stockId = readLastViewedStockIdClient();
    if (!stockId) {
      setStatus("ready");
      return;
    }
    void createDealAction({ stockId }).then((result) => {
      if (result.ok) {
        router.replace(getDealUrl(result.dealId, "part-exchange"));
        return;
      }
      setStatus("ready");
    });
  }, [router]);

  if (status === "checking") {
    return (
      <JourneyStart
        title={DEAL_ENTRY_HEADING}
        body="Opening the last car you viewed…"
        primary={{ href: getUsedCarsUrl(), label: DEAL_ENTRY_PICK_CAR }}
      />
    );
  }

  return (
    <JourneyStart
      title={DEAL_ENTRY_HEADING}
      body={DEAL_ENTRY_BODY}
      primary={{ href: getUsedCarsUrl(), label: DEAL_ENTRY_PICK_CAR }}
    />
  );
}
