"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createDealShareLink } from "@/features/deal/actions";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { getDealShareUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { DEAL_SHARE_INTRO } from "@/lib/deal/copy";

export function ShareDeal() {
  const { dealId } = useDealBuilder();
  const [message, setMessage] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function share() {
    setBusy(true);
    const result = await createDealShareLink({ dealId });
    setBusy(false);
    if (!result.ok) {
      setMessage("This deal session has expired.");
      return;
    }
    const url = `${window.location.origin}${getDealShareUrl(result.token)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Oakwood deal summary",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      trackEvent(analyticsEvents.dealShared);
      setMessage("Link copied. It does not include your rate or approval.");
    } catch {
      setMessage(url);
    }
  }

  return (
    <div>
      <Button variant="text" className="px-0" onClick={() => void share()} disabled={busy}>
        Share this deal
      </Button>
      {message ? (
        <p className="text-caption text-muted" role="status">
          {message}
        </p>
      ) : (
        <p className="sr-only">{DEAL_SHARE_INTRO}</p>
      )}
    </div>
  );
}
