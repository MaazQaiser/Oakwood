"use client";

import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { IconPhone } from "@/components/ui/icons";
import { CONTACT_CALL, CONTACT_MESSAGE } from "@/lib/support/copy";
import { toTelHref } from "@/lib/format/phone";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function SupportStickyCta({
  href,
  label,
  telephone,
}: {
  href: string;
  label: string;
  telephone?: string;
}) {
  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] gap-2">
        {telephone ? (
          <Button
            href={toTelHref(telephone)}
            variant="icon"
            className="border border-border"
            aria-label={CONTACT_CALL}
            onClick={() =>
              trackEvent(analyticsEvents.contactMethodClicked, { method: "call" })
            }
          >
            <IconPhone />
          </Button>
        ) : null}
        <Button
          href={href}
          className="min-w-0 flex-1"
          onClick={() =>
            trackEvent(analyticsEvents.contactMethodClicked, { method: "message" })
          }
        >
          {label || CONTACT_MESSAGE}
        </Button>
      </div>
    </StickyActionBar>
  );
}
