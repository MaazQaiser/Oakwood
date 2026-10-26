"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Skeleton } from "@/components/ui/Loading";
import { StartVehicleDealButton } from "@/components/deal/StartDealButton";
import { IconArrow } from "@/components/ui/icons";
import {
  IconV2Cash,
  IconV2Finance,
  IconV2PartExchange,
  IconV2TestDrive,
} from "@/components/vehicle/v2/VdpV2ActionIcons";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getEligibilityUrl, getUsedCarsUrl } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EEF6FD] text-[#0875D1]"
    >
      {children}
    </span>
  );
}

function PurchaseActionCard({
  title,
  description,
  icon,
  onActivate,
  href,
}: {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  onActivate?: () => void;
  href?: string;
}) {
  const className = cn(
    "flex min-h-[76px] w-full items-center gap-3 rounded-xl border border-[#DCE4ED] bg-white p-3 text-left",
    "hover:border-[#0875D1]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0875D1]",
  );

  const inner = (
    <>
      <ActionIcon>{icon}</ActionIcon>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold leading-[22px] text-[#102747]">
          {title}
        </span>
        <span className="mt-0.5 block text-[13px] leading-[18px] text-[#68778B]">
          {description}
        </span>
      </span>
      <IconArrow className="h-5 w-5 shrink-0 text-[#68778B]" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} onClick={onActivate}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onActivate}>
      {inner}
    </button>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function VdpV2ActionGrid() {
  const { monthlyPayment, displayState, reservable } = useVehicleDeal();
  const financeUnavailable = displayState === "missing";
  const cashDealRef = useRef<HTMLDivElement>(null);

  function openCashFlow() {
    trackEvent(analyticsEvents.financeCtaClicked, { action: "vdp-v2-cash" });
    const submit = cashDealRef.current?.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    submit?.click();
  }

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      {reservable ? (
        <>
          <PurchaseActionCard
            title="Buy with cash"
            description="Purchase this car outright."
            icon={<IconV2Cash />}
            onActivate={openCashFlow}
          />
          <div ref={cashDealRef} className="sr-only" aria-hidden>
            <StartVehicleDealButton label="Buy with cash" />
          </div>
        </>
      ) : (
        <PurchaseActionCard
          title="Buy with cash"
          description="Purchase this car outright."
          icon={<IconV2Cash />}
          href={getUsedCarsUrl()}
        />
      )}

      <PurchaseActionCard
        title="Get a finance check"
        description={
          financeUnavailable ? (
            "Check your eligibility for illustrative monthly payments."
          ) : displayState === "loading" ? (
            <Skeleton className="inline-block h-4 w-28" />
          ) : (
            <>
              From{" "}
              <FinancialNumber value={formatPounds(monthlyPayment)} size="sm" />
              {displayState === "representative" ? " per month*" : " per month"}
            </>
          )
        }
        icon={<IconV2Finance />}
        href={financeUnavailable ? getEligibilityUrl() : undefined}
        onActivate={() => {
          trackEvent(analyticsEvents.financeCtaClicked, { action: "vdp-v2-card" });
          if (financeUnavailable) {
            return;
          }
          scrollTo("vdp-v2-finance");
        }}
      />

      <PurchaseActionCard
        title="Part exchange"
        description="Find out what your current car is worth."
        icon={<IconV2PartExchange />}
        onActivate={() => scrollTo("part-exchange")}
      />

      <PurchaseActionCard
        title="Book a test drive"
        description="Choose a showroom, date and time."
        icon={<IconV2TestDrive />}
        onActivate={() => {
          trackEvent(analyticsEvents.contactClicked, { channel: "test-drive" });
          window.location.hash = "book-test-drive";
          scrollTo("vdp-v2-test-drive");
        }}
      />
    </div>
  );
}
