"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import { BeforeYouGoModal } from "@/components/valuation-entry/BeforeYouGoModal";
import { ValuationEntryFlow } from "@/components/valuation-entry/ValuationEntryFlow";
import { VE_FLOW_TITLE } from "@/lib/valuation-entry/copy";
import type { FinanceProductType } from "@/types/finance";

export function ValuationEntryDrawer({
  open,
  stockId,
  registration,
  mileage,
  cashDeposit,
  term,
  financeType,
  onClose,
}: {
  open: boolean;
  stockId: string;
  registration: string;
  mileage: string;
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  onClose: () => void;
}) {
  const [declineOpen, setDeclineOpen] = useState(false);
  const resultReadyAt = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      resultReadyAt.current = null;
      setDeclineOpen(false);
    }
  }, [open]);

  const markResultReady = useCallback(() => {
    if (resultReadyAt.current === null) {
      resultReadyAt.current = Date.now();
    }
  }, []);

  const coolDownElapsed = useCallback(() => {
    if (resultReadyAt.current === null) {
      return false;
    }
    return Date.now() - resultReadyAt.current >= 2000;
  }, []);

  const handleDrawerClose = useCallback(() => {
    if (coolDownElapsed()) {
      setDeclineOpen(true);
      return;
    }
    onClose();
  }, [coolDownElapsed, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPageHide = () => {
      if (coolDownElapsed()) {
        setDeclineOpen(true);
      }
    };

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 0) {
        return;
      }
      if (coolDownElapsed()) {
        setDeclineOpen(true);
      }
    };

    const onBackground = () => {
      if (document.visibilityState === "hidden") onPageHide();
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onBackground);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onBackground);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [open, coolDownElapsed]);

  return (
    <>
      <Drawer
        open={open}
        title={VE_FLOW_TITLE}
        size="full"
        onClose={handleDrawerClose}
      >
        {open ? (
          <ValuationEntryFlow
            key={`${registration}-${mileage}`}
            stockId={stockId}
            initialRegistration={registration}
            initialMileage={mileage}
            cashDeposit={cashDeposit}
            term={term}
            financeType={financeType}
            onReachedResult={markResultReady}
            onRequestDecline={() => setDeclineOpen(true)}
            onCloseRequest={({ fromResult }) => {
              if (fromResult && coolDownElapsed()) {
                setDeclineOpen(true);
                return;
              }
              if (fromResult) {
                markResultReady();
              }
              onClose();
            }}
          />
        ) : null}
      </Drawer>
      <BeforeYouGoModal
        open={declineOpen}
        onClose={() => {
          setDeclineOpen(false);
          // Decline point reached — close the valuation drawer after feedback.
          onClose();
        }}
      />
    </>
  );
}
