"use client";

import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";
import { DealCallbackPanel } from "@/components/deal/wizard/steps/DealCallbackPanel";
import { DealTestDrivePanel } from "@/components/deal/wizard/steps/DealTestDrivePanel";
import { reservationConfig } from "@/config/reservation";
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
  STEP4_RESERVE_HOLD,
  STEP4_RESERVE_REFUNDABLE,
} from "@/lib/deal/step4-copy";
import {
  getMockShowroomOpenStatus,
  resolveShowroomSlug,
} from "@/lib/deal/opening-status";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

type View = "hub" | "reserve" | "drive" | "callback" | "closed";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `44${digits.slice(1)}` : digits;
  return `tel:+${intl}`;
}

export function DealCloseStep() {
  const { dealId, vehicle, navigateTo } = useDealBuilder();
  const { goBack } = useDealStepNavigation("reserve");
  const [view, setView] = useState<View>("hub");
  const status = getMockShowroomOpenStatus(
    resolveShowroomSlug(vehicle.locationSlug),
  );
  const fee = reservationAmountLabel(reservationConfig.amount);
  const hold = formatHoldPeriod(reservationConfig.holdDurationDays);

  useEffect(() => {
    const panel = new URLSearchParams(window.location.search).get("panel");
    if (panel === "reserve") {
      setView("reserve");
    } else if (panel === "test-drive") {
      setView("drive");
    }
  }, []);

  if (view === "drive") {
    return <DealTestDrivePanel onBack={() => setView("hub")} />;
  }
  if (view === "callback" || view === "closed") {
    return (
      <DealCallbackPanel
        mode={view === "closed" ? "closed" : "callback"}
        closedStatus={view === "closed" ? status : undefined}
        onBack={() => setView("hub")}
      />
    );
  }

  if (view === "reserve") {
    return (
      <div className="flex flex-1 flex-col">
        <DealCard className="space-y-3">
          <h2 className="text-label text-navy">{STEP4_HUB_RESERVE()}</h2>
          <p className="text-h4 text-navy">{fee}</p>
          <p className="text-body-sm text-ink">{STEP4_RESERVE_REFUNDABLE}</p>
          <p className="text-body-sm text-ink">{STEP4_RESERVE_HOLD()}</p>
          <p className="text-caption text-muted">{STEP4_HUB_RESERVE_HINT()}</p>
          <ul className="space-y-2 text-body-sm">
            <li className="rounded-[14px] bg-black px-4 py-3 font-semibold! text-white">
              Apple Pay
            </li>
            <li className="rounded-[14px] border border-border px-4 py-3 font-semibold! text-ink">
              Google Pay
            </li>
            <li className="rounded-[14px] bg-page-tint px-4 py-3 font-semibold! text-ink">
              Card
            </li>
          </ul>
          <p className="text-caption text-muted">
            {fee} refundable reservation fee. The car is held for {hold}. This
            is separate from the monthly finance payment.
          </p>
        </DealCard>
        <DealStepFooter onBack={() => setView("hub")} showMonthly={false} />
      </div>
    );
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
            <Button type="button" variant="tertiary" onClick={() => setView("closed")}>
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
    </div>
  );
}
