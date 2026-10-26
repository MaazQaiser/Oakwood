"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import {
  BeforeYouGoModal,
  type ValuationDeclineContext,
} from "@/components/valuation-entry/BeforeYouGoModal";
import { ValuationEntryFlow } from "@/components/valuation-entry/ValuationEntryFlow";
import { VE_FLOW_TITLE } from "@/lib/valuation-entry/copy";
import type { FinanceProductType } from "@/types/finance";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

export function ValuationEntryDrawer({
  open,
  stockId,
  registration,
  mileage,
  cashDeposit,
  term,
  financeType,
  initialVehicle,
  onClose,
}: {
  open: boolean;
  stockId: string;
  registration: string;
  mileage: string;
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  initialVehicle?: PxIdentifiedVehicle;
  onClose: () => void;
}) {
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineContext, setDeclineContext] = useState<
    Omit<ValuationDeclineContext, "sessionId">
  >({
    stockId,
    registration,
  });
  const resultReadyAt = useRef<number | null>(null);
  const autoOffered = useRef(false);
  const abandonRef = useRef<() => boolean>(() => false);
  const registerAbandon = useCallback((handler: () => boolean) => {
    abandonRef.current = handler;
  }, []);
  const sessionId = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ve-${stockId}`,
  );

  useEffect(() => {
    if (!open) {
      resultReadyAt.current = null;
      autoOffered.current = false;
      setDeclineOpen(false);
    }
  }, [open]);

  const markResultReady = useCallback(
    (context: Omit<ValuationDeclineContext, "sessionId">) => {
      if (resultReadyAt.current === null) {
        resultReadyAt.current = Date.now();
      }
      setDeclineContext(context);
    },
    [],
  );

  const coolDownElapsed = useCallback(() => {
    if (resultReadyAt.current === null) {
      return false;
    }
    return Date.now() - resultReadyAt.current >= 2000;
  }, []);

  const openDecline = useCallback((kind: "explicit" | "auto") => {
    setDeclineOpen((current) => {
      if (current) {
        return current;
      }
      if (kind === "auto" && (autoOffered.current || !coolDownElapsed())) {
        return current;
      }
      autoOffered.current = true;
      return true;
    });
  }, [coolDownElapsed]);

  const handleDrawerClose = useCallback(() => {
    if (abandonRef.current()) {
      return;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onAbandon = () => {
      if (abandonRef.current()) {
        return;
      }
      openDecline("auto");
    };
    window.addEventListener("pagehide", onAbandon);
    return () => {
      window.removeEventListener("pagehide", onAbandon);
    };
  }, [open, openDecline]);

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
            initialVehicle={initialVehicle}
            onReachedResult={markResultReady}
            onRequestDecline={() => openDecline("explicit")}
            onRegisterAbandon={registerAbandon}
            onCloseRequest={({ fromResult }) => {
              if (fromResult && abandonRef.current()) {
                window.history.pushState({ veFlow: true }, "");
                return;
              }
              onClose();
            }}
          />
        ) : null}
      </Drawer>
      <BeforeYouGoModal
        open={declineOpen}
        context={{ ...declineContext, sessionId: sessionId.current }}
        onClose={() => setDeclineOpen(false)}
      />
    </>
  );
}
