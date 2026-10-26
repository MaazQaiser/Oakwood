"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Dialogs";
import { Button } from "@/components/ui/Button";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { ExitIntelModal } from "@/components/deal/ExitIntelModal";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import {
  DEAL_ABANDON_LEAVE,
  DEAL_ABANDON_SAVE,
  DEAL_ABANDON_STAY,
  DEAL_SAVE_PROGRESS_BODY,
  DEAL_SAVE_PROGRESS_TITLE,
} from "@/lib/deal/copy";

const SESSION_KEY = "oakwood-deal-abandon-shown";
const INTEL_SESSION_KEY = "oakwood-deal-step4-intel-shown";
const CTA_ENGAGED_KEY = "oakwood-step4-cta-engaged";
/** Do not interrupt steps 1–3 until the customer has been on the journey briefly. */
const ENGAGE_MS = 8000;
/** Same two-second pause used after the valuation result appears. */
const STEP4_COOLDOWN_MS = 2000;

/** Call when the customer opens a Step 4 action panel (reserve / test drive / callback). */
export function markStep4CtaEngaged() {
  try {
    sessionStorage.setItem(CTA_ENGAGED_KEY, "1");
  } catch {
    // ignore
  }
}

function isStep4CtaEngaged(): boolean {
  try {
    return sessionStorage.getItem(CTA_ENGAGED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Soft abandonment prompt for Steps 1–3 (save / stay / leave).
 * On Step 4, leaving without a CTA uses the shared exit-intel modal (Decision 16).
 */
export function DealAbandonmentModal({
  vehicleHref,
  step,
  ctaEngaged = false,
}: {
  vehicleHref: string;
  step: string;
  /** True once the customer opens a Step 4 action panel. */
  ctaEngaged?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { saved } = useDealBuilder();
  const [saveOpen, setSaveOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const engagedAt = useRef<number>(Date.now());
  const saveShownRef = useRef(false);
  const intelShownRef = useRef(false);
  const isStep4 = step === "reserve";

  useEffect(() => {
    engagedAt.current = Date.now();
    try {
      saveShownRef.current = sessionStorage.getItem(SESSION_KEY) === "1";
      intelShownRef.current = sessionStorage.getItem(INTEL_SESSION_KEY) === "1";
    } catch {
      // ignore
    }
  }, [pathname]);

  const step4Engaged = ctaEngaged || isStep4CtaEngaged();

  const canPromptSave = useCallback(() => {
    if (saved || saveShownRef.current) return false;
    if (Date.now() - engagedAt.current < ENGAGE_MS && !step4Engaged) {
      return false;
    }
    return true;
  }, [saved, step4Engaged]);

  const canPromptIntel = useCallback(() => {
    if (intelShownRef.current) return false;
    if (step4Engaged) return false;
    if (Date.now() - engagedAt.current < STEP4_COOLDOWN_MS) {
      return false;
    }
    return true;
  }, [step4Engaged]);

  const canPromptIntelRef = useRef(canPromptIntel);
  const vehicleHrefRef = useRef(vehicleHref);
  canPromptIntelRef.current = canPromptIntel;
  vehicleHrefRef.current = vehicleHref;

  useEffect(() => {
    if (!isStep4) return;

    const marker = { oakwoodStep4Guard: pathname };
    window.history.pushState(marker, "");

    const onPop = () => {
      if (!canPromptIntelRef.current()) return;
      window.history.pushState(marker, "");
      setPendingHref(vehicleHrefRef.current);
      setIntelOpen(true);
      intelShownRef.current = true;
      try {
        sessionStorage.setItem(INTEL_SESSION_KEY, "1");
      } catch {
        // ignore
      }
    };

    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, [isStep4, pathname]);

  const markSaveShown = () => {
    saveShownRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
  };

  const markIntelShown = () => {
    intelShownRef.current = true;
    try {
      sessionStorage.setItem(INTEL_SESSION_KEY, "1");
    } catch {
      // ignore
    }
  };

  const requestLeave = useCallback(
    (href: string) => {
      if (isStep4) {
        // Decision 16: Step 4 CTA abandonment → exit intel (unless a CTA panel was used).
        if (!canPromptIntel()) {
          router.push(href);
          return;
        }
        setPendingHref(href);
        setIntelOpen(true);
        markIntelShown();
        return;
      }

      if (!canPromptSave()) {
        router.push(href);
        return;
      }
      setPendingHref(href);
      setShowSave(false);
      setSaveOpen(true);
      markSaveShown();
    },
    [canPromptIntel, canPromptSave, ctaEngaged, isStep4, router],
  );

  useEffect(() => {
    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 0) return;
      if (isStep4) {
        if (!canPromptIntel()) return;
        setPendingHref(vehicleHref);
        setIntelOpen(true);
        markIntelShown();
        return;
      }
      if (!canPromptSave()) return;
      setPendingHref(vehicleHref);
      setShowSave(false);
      setSaveOpen(true);
      markSaveShown();
    };
    const onBackground = () => {
      if (document.visibilityState === "visible") return;
      onMouseLeave({ clientY: 0 } as MouseEvent);
    };
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onBackground);
    window.addEventListener("pagehide", onBackground);
    return () => {
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onBackground);
      window.removeEventListener("pagehide", onBackground);
    };
  }, [canPromptIntel, canPromptSave, isStep4, vehicleHref]);

  function stay() {
    setSaveOpen(false);
    setPendingHref(null);
    setShowSave(false);
  }

  function leave() {
    const href = pendingHref ?? vehicleHref;
    setSaveOpen(false);
    setIntelOpen(false);
    router.push(href);
  }

  function closeIntel() {
    setIntelOpen(false);
    const href = pendingHref ?? vehicleHref;
    setPendingHref(null);
    router.push(href);
  }

  return (
    <>
      <span
        data-deal-abandon-step={step}
        data-deal-abandon-cta={ctaEngaged ? "1" : "0"}
        hidden
      />
      <DealAbandonmentBridge requestLeave={requestLeave} />

      <Modal open={saveOpen} title={DEAL_SAVE_PROGRESS_TITLE} onClose={stay}>
        <div className="space-y-4">
          <p className="text-body-sm text-muted">{DEAL_SAVE_PROGRESS_BODY}</p>
          {showSave ? (
            <SaveDeal defaultOpen compact />
          ) : (
            <Button
              type="button"
              className="w-full"
              onClick={() => setShowSave(true)}
            >
              {DEAL_ABANDON_SAVE}
            </Button>
          )}
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={stay}
            >
              {DEAL_ABANDON_STAY}
            </Button>
            <Button
              type="button"
              variant="text"
              className="w-full sm:w-auto"
              onClick={leave}
            >
              {DEAL_ABANDON_LEAVE}
            </Button>
          </div>
        </div>
      </Modal>

      <ExitIntelModal
        open={intelOpen}
        onClose={closeIntel}
        source="step4_cta_abandon"
        idPrefix="step4-abandon"
      />
    </>
  );
}

const leaveListeners = new Set<(href: string) => void>();

export function requestDealAbandonment(href: string) {
  leaveListeners.forEach((listener) => listener(href));
}

function DealAbandonmentBridge({
  requestLeave,
}: {
  requestLeave: (href: string) => void;
}) {
  useEffect(() => {
    leaveListeners.add(requestLeave);
    return () => {
      leaveListeners.delete(requestLeave);
    };
  }, [requestLeave]);
  return null;
}
