"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SaveProgressPrompt } from "@/components/deal/SaveProgressPrompt";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { CallClosedModal } from "@/components/deal/wizard/steps/CallClosedModal";
import { DealCallbackPanel } from "@/components/deal/wizard/steps/DealCallbackPanel";
import { DealReservePanel } from "@/components/deal/wizard/steps/DealReservePanel";
import { DealTestDrivePanel } from "@/components/deal/wizard/steps/DealTestDrivePanel";
import { getDealApplicationUrl } from "@/config/routes";
import {
  STEP4_HUB_APPLY,
  STEP4_HUB_CALL_BACK,
  STEP4_HUB_CALL_BACK_HINT,
  STEP4_HUB_CALL_NOW,
  STEP4_HUB_CALL_NOW_OPEN,
  STEP4_HUB_RESERVE,
  STEP4_HUB_RESERVE_HINT,
  STEP4_HUB_TEST_DRIVE,
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
      <div className="flex-1 space-y-3 pb-8">
        <div className="overflow-hidden rounded-card bg-[linear-gradient(145deg,var(--oak-navy-deep)_0%,var(--oak-navy)_46%,#0a4d86_100%)] p-4 text-white shadow-card sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3.5">
              <div className="relative h-[5.5rem] w-[7.25rem] shrink-0 overflow-hidden rounded-[16px] bg-white/10">
                <Image
                  src={vehicle.imageSrc}
                  alt={vehicle.imageAlt}
                  fill
                  className="object-cover"
                  sizes="116px"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-label text-white">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                {vehicle.derivative ? (
                  <p className="mt-0.5 truncate text-caption text-white/80">
                    {vehicle.derivative}
                  </p>
                ) : null}
                <p className="mt-1 text-body-sm text-white/85">{vehicle.locationName}</p>
                <p className="mt-1 text-caption leading-snug text-white/70">
                  {status.open ? (
                    <>
                      <span className="block">{STEP4_HUB_CALL_NOW_OPEN}</span>
                      <span className="block">{status.nextOpenLabel}</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Showroom hours today</span>
                      <span className="block">{status.todayHours}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-fit shrink-0 text-body-sm font-semibold! text-white underline decoration-white/80 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => navigateTo(getDealApplicationUrl(dealId))}
            >
              {STEP4_HUB_APPLY}
            </button>
          </div>

          <div className="mt-4 space-y-2 rounded-[18px] bg-page-tint p-3 sm:p-4">
            <p className="text-caption text-muted">{STEP4_HUB_RESERVE_HINT()}</p>
            <Button type="button" className="w-full" onClick={() => setView("reserve")}>
              {STEP4_HUB_RESERVE()}
            </Button>
          </div>
        </div>

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
        <p className="text-caption text-muted">{STEP4_HUB_CALL_BACK_HINT}</p>
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
