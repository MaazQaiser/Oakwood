"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealReservePaymentPanel } from "@/components/deal/wizard/steps/DealReservePaymentPanel";
import { DealTestDrivePanel } from "@/components/deal/wizard/steps/DealTestDrivePanel";
import { DealCallbackPanel } from "@/components/deal/wizard/steps/DealCallbackPanel";
import { markStep4CtaEngaged } from "@/components/deal/DealAbandonmentModal";
import { SaveProgressPrompt } from "@/components/deal/SaveProgressPrompt";
import { getDealApplicationUrl } from "@/config/routes";
import { formatPounds } from "@/lib/format/money";
import {
  getMockShowroomOpenStatus,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  STEP4_BACK_HUB,
  STEP4_CLOSED_TITLE,
  STEP4_HUB_APPLY,
  STEP4_HUB_CALL_BACK,
  STEP4_HUB_CALL_NOW,
  STEP4_HUB_RESERVE,
  STEP4_HUB_TEST_DRIVE,
} from "@/lib/deal/step4-copy";

type Panel =
  | "hub"
  | "reserve"
  | "test-drive"
  | "callback"
  | "call-closed";

const hubActionClass =
  "h-auto min-h-11! w-full min-w-0 whitespace-nowrap rounded-[14px]! border border-border px-3! py-2 text-center text-[13px]! font-semibold leading-none";

function readInitialPanel(): Panel {
  if (typeof window === "undefined") return "hub";
  const value = new URLSearchParams(window.location.search).get("panel");
  if (
    value === "reserve" ||
    value === "test-drive" ||
    value === "callback" ||
    value === "call-closed"
  ) {
    return value;
  }
  return "hub";
}

const IDLE_SAVE_KEY = "oakwood-step4-idle-save-shown";
const IDLE_MS = 30_000;

export function DealReserveStep() {
  const { vehicle, dealId, navigateTo, calculation } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const [panel, setPanel] = useState<Panel>("hub");
  const [closedModal, setClosedModal] = useState(false);
  const [idleSaveOpen, setIdleSaveOpen] = useState(false);

  useEffect(() => {
    setPanel(readInitialPanel());
  }, []);

  // Spec §13: Step 4 CTA screen without CTA click after 30 seconds idle.
  useEffect(() => {
    if (panel !== "hub") return;
    let shown = false;
    try {
      shown = sessionStorage.getItem(IDLE_SAVE_KEY) === "1";
    } catch {
      // ignore
    }
    if (shown) return;
    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(IDLE_SAVE_KEY) === "1") return;
        sessionStorage.setItem(IDLE_SAVE_KEY, "1");
      } catch {
        // ignore
      }
      setIdleSaveOpen(true);
    }, IDLE_MS);
    return () => window.clearTimeout(timer);
  }, [panel]);

  const openStatus = useMemo(
    () =>
      getMockShowroomOpenStatus(
        resolveShowroomSlug(vehicle.locationSlug),
      ),
    [vehicle.locationSlug],
  );

  function openPanel(next: Panel) {
    markStep4CtaEngaged();
    setIdleSaveOpen(false);
    try {
      sessionStorage.setItem(IDLE_SAVE_KEY, "1");
    } catch {
      // ignore
    }
    setPanel(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToHub() {
    setPanel("hub");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (panel === "reserve") {
    return <DealReservePaymentPanel onBack={backToHub} />;
  }
  if (panel === "test-drive") {
    return <DealTestDrivePanel onBack={backToHub} />;
  }
  if (panel === "callback" || panel === "call-closed") {
    return (
      <DealCallbackPanel
        onBack={backToHub}
        mode={panel === "call-closed" ? "closed" : "callback"}
        closedStatus={panel === "call-closed" ? openStatus : undefined}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 pb-5">
        <DealStep4Summary title="Your deal summary" />

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            className="min-h-14 w-full text-base"
            onClick={() => openPanel("reserve")}
          >
            {STEP4_HUB_RESERVE()}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={hubActionClass}
            onClick={() => {
              markStep4CtaEngaged();
              navigateTo(getDealApplicationUrl(dealId));
            }}
          >
            {STEP4_HUB_APPLY}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={hubActionClass}
            onClick={() => {
              const monthly = formatPounds(calculation?.monthlyPayment ?? 0);
              const subject = encodeURIComponent(
                `My Oakwood quote for the ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
              );
              const body = encodeURIComponent(
                `Quote for stock ${vehicle.stockId}: ${monthly} a month. Cash price ${formatPounds(vehicle.cashPrice)}. Resume this deal from the page you are on.`,
              );
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}
          >
            Email my quote
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={hubActionClass}
              onClick={() => openPanel("test-drive")}
            >
              {STEP4_HUB_TEST_DRIVE}
            </Button>
            {openStatus.open && openStatus.telephone ? (
              <Button
                href={`tel:${openStatus.telephone.replace(/\s/g, "")}`}
                variant="secondary"
                size="sm"
                className={hubActionClass}
                onClick={() => markStep4CtaEngaged()}
              >
                {STEP4_HUB_CALL_NOW}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={hubActionClass}
                onClick={() => {
                  markStep4CtaEngaged();
                  setClosedModal(true);
                }}
              >
                {STEP4_HUB_CALL_NOW}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={hubActionClass}
              onClick={() => openPanel("callback")}
            >
              {STEP4_HUB_CALL_BACK}
            </Button>
          </div>
          <p className="text-center text-caption text-muted">
            {openStatus.open
              ? `${openStatus.locationName} is open · ${openStatus.todayHours}`
              : `${openStatus.locationName} is closed · opens ${openStatus.nextOpenLabel}`}
          </p>
        </div>

        <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Save your deal</p>
          <SaveDeal defaultOpen compact />
        </div>
      </div>

      <SaveProgressPrompt
        open={idleSaveOpen}
        onContinue={() => setIdleSaveOpen(false)}
        onDismiss={() => setIdleSaveOpen(false)}
      />

      <Modal
        open={closedModal}
        title={STEP4_CLOSED_TITLE}
        size="wide"
        onClose={() => setClosedModal(false)}
      >
        <DealCallbackPanel
          onBack={() => setClosedModal(false)}
          mode="closed"
          closedStatus={openStatus}
        />
      </Modal>

      <div className="pb-6">
        <Button
          type="button"
          variant="text"
          className="px-0"
          onClick={() => goBack("cover")}
        >
          {STEP4_BACK_HUB}
        </Button>
      </div>
    </div>
  );
}
