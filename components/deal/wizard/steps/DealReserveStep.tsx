"use client";

import { useEffect, useMemo, useState } from "react";
import { Phone, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { SaveDeal } from "@/components/deal/SaveDeal";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealReservePaymentPanel } from "@/components/deal/wizard/steps/DealReservePaymentPanel";
import { DealTestDrivePanel } from "@/components/deal/wizard/steps/DealTestDrivePanel";
import { DealCallbackPanel } from "@/components/deal/wizard/steps/DealCallbackPanel";
import { markStep4CtaEngaged } from "@/components/deal/DealAbandonmentModal";
import { SaveProgressPrompt } from "@/components/deal/SaveProgressPrompt";
import { reservationConfig } from "@/config/reservation";
import { getDealApplicationUrl } from "@/config/routes";
import {
  getMockShowroomOpenStatus,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  STEP4_BACK_HUB,
  STEP4_CLOSED_BODY,
  STEP4_CLOSED_HOURS_REF,
  STEP4_CLOSED_TITLE,
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
import { reservationAmountLabel } from "@/lib/reservation/format";
import { cn } from "@/lib/cn";

type Panel =
  | "hub"
  | "reserve"
  | "test-drive"
  | "callback"
  | "call-closed";

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
  const { vehicle, dealId, navigateTo } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const [panel, setPanel] = useState<Panel>("hub");
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
        <DealStep4Summary title="Your deal" />

        {/* Primary — Reserve */}
        <section
          className="rounded-card bg-navy p-5 text-white shadow-card sm:p-6"
          aria-labelledby="step4-reserve"
        >
          <h2 id="step4-reserve" className="text-h5 text-white">
            {STEP4_HUB_RESERVE()}
          </h2>
          <p className="mt-1 text-caption text-white/75">
            {STEP4_HUB_RESERVE_HINT()}
          </p>
          <Button
            type="button"
            className="mt-4 w-full bg-primary hover:bg-primary-hover"
            onClick={() => openPanel("reserve")}
          >
            {STEP4_HUB_RESERVE()}
          </Button>
        </section>

        {/* Secondary — Apply */}
        <section
          className="rounded-card bg-surface p-5 shadow-card sm:p-6"
          aria-labelledby="step4-apply"
        >
          <h2 id="step4-apply" className="text-label">
            {STEP4_HUB_APPLY}
          </h2>
          <p className="mt-1 text-caption text-muted">{STEP4_HUB_APPLY_HINT}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => {
              markStep4CtaEngaged();
              navigateTo(getDealApplicationUrl(dealId));
            }}
          >
            {STEP4_HUB_APPLY}
          </Button>
        </section>

        {/* Tertiary — Test drive */}
        <section
          className="rounded-[20px] border border-border bg-surface-soft p-5"
          aria-labelledby="step4-td"
        >
          <h2 id="step4-td" className="text-label">
            {STEP4_HUB_TEST_DRIVE}
          </h2>
          <p className="mt-1 text-caption text-muted">
            {STEP4_HUB_TEST_DRIVE_HINT}
          </p>
          <Button
            type="button"
            variant="tertiary"
            className="mt-3 w-full"
            onClick={() => openPanel("test-drive")}
          >
            {STEP4_HUB_TEST_DRIVE}
          </Button>
        </section>

        {/* Contact row — Call now / Call me back (distinct from equal CTAs) */}
        <div className="grid gap-3 sm:grid-cols-2">
          <section
            className={cn(
              "rounded-[20px] border p-4",
              openStatus.open
                ? "border-success/30 bg-success-soft/40"
                : "border-border bg-page-tint",
            )}
            aria-labelledby="step4-call-now"
          >
            <div className="flex items-start gap-3">
              <PhoneCall
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h2 id="step4-call-now" className="text-label">
                  {openStatus.open
                    ? STEP4_HUB_CALL_NOW_OPEN
                    : STEP4_HUB_CALL_NOW}
                </h2>
                {openStatus.open ? (
                  <>
                    <p className="mt-1 text-caption text-muted">
                      {openStatus.locationName} is open ({openStatus.todayHours}
                      ).
                    </p>
                    {openStatus.telephone ? (
                      <Button
                        href={`tel:${openStatus.telephone.replace(/\s/g, "")}`}
                        variant="text"
                        className="mt-2 min-h-9 px-0"
                        onClick={() => markStep4CtaEngaged()}
                      >
                        Call {openStatus.telephone}
                      </Button>
                    ) : (
                      <p className="mt-2 text-caption text-muted">
                        Telephone not configured for this showroom yet.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-caption text-muted">
                      {STEP4_CLOSED_TITLE}. {STEP4_CLOSED_BODY(openStatus.nextOpenLabel)}
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      {STEP4_CLOSED_HOURS_REF}: {openStatus.todayHours}
                    </p>
                    <Button
                      type="button"
                      variant="text"
                      className="mt-2 min-h-9 px-0"
                      onClick={() => openPanel("call-closed")}
                    >
                      Book a callback
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>

          <section
            className="rounded-[20px] border border-border bg-surface p-4"
            aria-labelledby="step4-callback"
          >
            <div className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h2 id="step4-callback" className="text-label">
                  {STEP4_HUB_CALL_BACK}
                </h2>
                <p className="mt-1 text-caption text-muted">
                  {STEP4_HUB_CALL_BACK_HINT}
                </p>
                <Button
                  type="button"
                  variant="text"
                  className="mt-2 min-h-9 px-0"
                  onClick={() => openPanel("callback")}
                >
                  {STEP4_HUB_CALL_BACK}
                </Button>
              </div>
            </div>
          </section>
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

      <DealStepFooter
        showMonthly={false}
        onBack={() => goBack("cover")}
        backLabel={STEP4_BACK_HUB}
        onContinue={() => openPanel("reserve")}
        continueLabel={`Reserve for ${reservationAmountLabel(reservationConfig.amount)}`}
      />
    </div>
  );
}
