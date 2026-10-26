"use client";

import { useEffect, useState } from "react";
import { SaveProgressPrompt } from "@/components/deal/SaveProgressPrompt";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { CallClosedModal } from "@/components/deal/wizard/steps/CallClosedModal";
import { DealCallbackPanel } from "@/components/deal/wizard/steps/DealCallbackPanel";
import { DealReservePanel } from "@/components/deal/wizard/steps/DealReservePanel";
import { DealTestDrivePanel } from "@/components/deal/wizard/steps/DealTestDrivePanel";
import { getDealApplicationUrl } from "@/config/routes";
import {
  STEP4_HUB_APPLY,
  STEP4_HUB_APPLY_HINT,
  STEP4_HUB_CALL_BACK,
  STEP4_HUB_CALL_BACK_HINT,
  STEP4_HUB_CALL_NOW,
  STEP4_HUB_CALL_NOW_OPEN,
  STEP4_HUB_RESERVE,
  STEP4_HUB_RESERVE_HINT,
  STEP4_HUB_TEST_DRIVE,
  STEP4_HUB_TEST_DRIVE_HINT,
} from "@/lib/deal/step4-copy";
import {
  getMockShowroomOpenStatus,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
type View = "hub" | "reserve" | "drive" | "callback";

/** Leave the next-step screen alone long enough that a save prompt is useful. */
const STEP4_IDLE_MS = 45_000;

function savePromptKey(dealId: string) {
  return `oakwood-save-prompt:step4:${dealId}`;
}

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `44${digits.slice(1)}` : digits;
  return `tel:+${intl}`;
}

export function DealCloseStep() {
  const { dealId, vehicle, navigateTo, saved } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const [view, setView] = useState<View>("hub");
  const [closedOpen, setClosedOpen] = useState(false);
  const [idlePrompt, setIdlePrompt] = useState(false);
  const status = getMockShowroomOpenStatus(
    resolveShowroomSlug(vehicle.locationSlug),
  );
  useEffect(() => {
    const panel = new URLSearchParams(window.location.search).get("panel");
    if (panel === "reserve") {
      setView("reserve");
    } else if (panel === "test-drive") {
      setView("drive");
    } else if (panel === "callback") {
      setView("callback");
    }
  }, []);

  useEffect(() => {
    if (view !== "hub" || saved || closedOpen) {
      return;
    }
    let alreadyPrompted = false;
    try {
      alreadyPrompted = sessionStorage.getItem(savePromptKey(dealId)) === "1";
    } catch {
      alreadyPrompted = false;
    }
    if (alreadyPrompted) {
      return;
    }
    let opened = false;
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      if (opened) {
        return;
      }
      timer = window.setTimeout(() => {
        opened = true;
        try {
          sessionStorage.setItem(savePromptKey(dealId), "1");
        } catch {
          // Still show it once while this screen is open.
        }
        setIdlePrompt(true);
      }, STEP4_IDLE_MS);
    };
    arm();
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    for (const event of events) {
      window.addEventListener(event, arm, { passive: true });
    }
    return () => {
      window.clearTimeout(timer);
      for (const event of events) {
        window.removeEventListener(event, arm);
      }
    };
  }, [closedOpen, dealId, saved, view]);

  if (view === "drive") {
    return <DealTestDrivePanel onBack={() => setView("hub")} />;
  }
  if (view === "callback") {
    return <DealCallbackPanel mode="callback" onBack={() => setView("hub")} />;
  }

  if (view === "reserve") {
    return <DealReservePanel onBack={() => setView("hub")} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 pb-5">
        <DealCard className="space-y-2">
          <h2 className="text-label text-navy">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-body-sm text-muted">{vehicle.locationName}</p>
          <p className="text-caption text-muted">
            {status.open
              ? `${STEP4_HUB_CALL_NOW_OPEN}. ${status.nextOpenLabel}.`
              : `Showroom hours today: ${status.todayHours}.`}
          </p>
        </DealCard>

        <Button type="button" className="w-full" onClick={() => setView("reserve")}>
          {STEP4_HUB_RESERVE()}
        </Button>
        <p className="-mt-1 text-caption text-muted">{STEP4_HUB_RESERVE_HINT()}</p>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => navigateTo(getDealApplicationUrl(dealId))}
        >
          {STEP4_HUB_APPLY}
        </Button>
        <p className="-mt-1 text-caption text-muted">{STEP4_HUB_APPLY_HINT}</p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button type="button" variant="tertiary" onClick={() => setView("drive")}>
            {STEP4_HUB_TEST_DRIVE}
          </Button>
          {status.open && status.telephone ? (
            <Button href={telHref(status.telephone)} variant="tertiary">
              <PhoneCall className="h-4 w-4" aria-hidden />
              {STEP4_HUB_CALL_NOW_OPEN}
            </Button>
          ) : (
            <Button type="button" variant="tertiary" onClick={() => setClosedOpen(true)}>
              {STEP4_HUB_CALL_NOW}
            </Button>
          )}
          <Button type="button" variant="tertiary" onClick={() => setView("callback")}>
            {STEP4_HUB_CALL_BACK}
          </Button>
        </div>
        <p className="text-caption text-muted">
          {STEP4_HUB_TEST_DRIVE_HINT} {STEP4_HUB_CALL_BACK_HINT}
        </p>
      </div>
      <DealStepFooter onBack={() => goBack("quote")} showMonthly={false} />
      <CallClosedModal open={closedOpen} onClose={() => setClosedOpen(false)} />
      <SaveProgressPrompt
        open={idlePrompt}
        continueLabel="Stay on this step"
        onDismiss={() => setIdlePrompt(false)}
        onContinue={() => setIdlePrompt(false)}
      />
    </div>
  );
}
