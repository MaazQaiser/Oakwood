"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyPxToDealAction,
  clearPxSessionAction,
  getActiveDealForPx,
  getPxUiState,
  lookupPxRegistration,
  recordPxCompletionLead,
  savePxSettlement,
  savePxVehicle,
  startPxSession,
  valuePxVehicle,
} from "@/features/part-exchange/actions";
import { calculatePxEquity } from "@/lib/part-exchange/equity";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getDealUrl, getUsedCarsUrl } from "@/config/routes";
import {
  manualVehicleError,
  mileageError,
  parseMileage,
  parsePounds,
  registrationError,
  settlementError,
} from "@/lib/part-exchange/validation";
import type { DealPartExchangeInput } from "@/types/deal";
import type {
  PartExchange,
  PxErrorKind,
  PxIdentifiedVehicle,
  PxSource,
  PxStep,
} from "@/types/part-exchange";

export type PxVariant = "standalone" | "inline";

function sourceFrom(variant: PxVariant, vdp?: boolean): PxSource {
  if (vdp) {
    return "vdp";
  }
  return variant === "inline" ? "deal" : "standalone";
}

function stepFromSnapshot(snapshot: PartExchange, variant: PxVariant): PxStep {
  if (snapshot.status === "ready" || snapshot.status === "applied") {
    return "result";
  }
  if (snapshot.estimatedValue !== undefined) {
    return snapshot.financeOutstanding === undefined ? "finance" : "result";
  }
  if (snapshot.vehicle && snapshot.mileage === undefined) {
    return "mileage";
  }
  if (snapshot.vehicle) {
    return "mileage";
  }
  if (snapshot.registration) {
    return "vehicle";
  }
  return variant === "standalone" ? "intro" : "registration";
}

export function usePartExchange({
  variant,
  initialPx,
  consideredStockId,
  vdp = false,
  onApplied,
  onAbandoned,
}: {
  variant: PxVariant;
  initialPx?: DealPartExchangeInput;
  consideredStockId?: string;
  vdp?: boolean;
  onApplied?: (px: DealPartExchangeInput) => void | Promise<void>;
  onAbandoned?: () => void;
}) {
  const router = useRouter();
  const source = sourceFrom(variant, vdp);
  const started = useRef(false);
  const completed = useRef(false);

  const [step, setStep] = useState<PxStep>(
    initialPx ? "result" : variant === "standalone" ? "intro" : "registration",
  );
  const [registration, setRegistration] = useState(
    initialPx?.registration ?? "",
  );
  const [mileage, setMileage] = useState(
    initialPx ? String(initialPx.mileage) : "",
  );
  const [settlement, setSettlement] = useState(
    initialPx?.settlement !== undefined ? String(initialPx.settlement) : "",
  );
  const [vehicle, setVehicle] = useState<PxIdentifiedVehicle | undefined>(
    initialPx?.vehicle
      ? { ...initialPx.vehicle, source: "lookup" }
      : undefined,
  );
  const [manual, setManual] = useState({
    year: "",
    make: "",
    model: "",
    variant: "",
    fuelType: "",
    transmission: "",
  });
  const [estimatedValue, setEstimatedValue] = useState<number | undefined>(
    initialPx?.value,
  );
  const [financeOutstanding, setFinanceOutstanding] = useState<boolean | undefined>(
    initialPx?.financeOutstanding,
  );
  const [error, setError] = useState<string>();
  const [errorKind, setErrorKind] = useState<PxErrorKind>();
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hasDeal, setHasDeal] = useState(Boolean(variant === "inline" && !vdp));
  const [dealId, setDealId] = useState<string>();

  const track = useCallback(
    (event: (typeof analyticsEvents)[keyof typeof analyticsEvents], extra?: object) => {
      trackEvent(event, {
        source,
        stockId: consideredStockId,
        ...extra,
      });
    },
    [consideredStockId, source],
  );

  useEffect(() => {
    if (initialPx) {
      return;
    }
    let cancelled = false;
    void getPxUiState()
      .then((state) => {
        if (cancelled || "empty" in state) {
          return;
        }
        if (state.expired) {
          setErrorKind("session_expired");
          return;
        }
        const snapshot = state.snapshot;
        if (!snapshot.registration) {
          return;
        }
        setRegistration(snapshot.registration);
        setMileage(snapshot.mileage !== undefined ? String(snapshot.mileage) : "");
        setVehicle(snapshot.vehicle);
        setEstimatedValue(snapshot.estimatedValue);
        setFinanceOutstanding(snapshot.financeOutstanding);
        setSettlement(
          snapshot.settlementFigure !== undefined
            ? String(snapshot.settlementFigure)
            : "",
        );
        setStep(stepFromSnapshot(snapshot, variant));
        setDealId(state.dealId);
      })
      .catch(() => undefined);
    void getActiveDealForPx()
      .then((result) => {
        if (!cancelled && result.ok) {
          setHasDeal(true);
          setDealId(result.dealId);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [initialPx, variant, vdp]);

  useEffect(() => {
    return () => {
      if (!completed.current) {
        onAbandoned?.();
        track(analyticsEvents.pxAbandoned, { step });
      }
    };
    // Intentionally once on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    if (!started.current) {
      started.current = true;
      track(analyticsEvents.pxStarted);
      void startPxSession(source);
    }
    setError(undefined);
    setErrorKind(undefined);
    setStep("registration");
  }, [source, track]);

  const lookup = useCallback(async () => {
    const issue = registrationError(registration);
    if (issue) {
      setError(issue);
      setErrorKind("invalid_registration");
      return;
    }
    setError(undefined);
    setErrorKind(undefined);
    setLoading(true);
    setStep("lookup");
    track(analyticsEvents.pxRegistrationSubmitted);
    const result = await lookupPxRegistration({ registration, source });
    setLoading(false);
    if (!result.ok) {
      track(analyticsEvents.pxRegistrationFailed, { reason: result.reason });
      if (result.reason === "not_found") {
        setErrorKind("not_found");
        setStep("registration");
        return;
      }
      if (result.reason === "ineligible") {
        setErrorKind("not_eligible");
        setStep("registration");
        return;
      }
      setErrorKind("lookup_unavailable");
      setStep("registration");
      return;
    }
    track(analyticsEvents.pxRegistrationSuccess);
    setVehicle(result.vehicle);
    setStep("vehicle");
  }, [registration, source, track]);

  const confirmVehicle = useCallback(() => {
    if (!vehicle) {
      return;
    }
    void savePxVehicle({ vehicle, source });
    setStep("mileage");
  }, [source, vehicle]);

  const saveManual = useCallback(async () => {
    const issue = manualVehicleError(manual);
    if (issue) {
      setError(issue);
      return;
    }
    const next: PxIdentifiedVehicle = {
      year: Number(manual.year),
      make: manual.make.trim(),
      model: manual.model.trim(),
      variant: manual.variant.trim() || undefined,
      fuelType: manual.fuelType,
      transmission: manual.transmission,
      source: "manual",
    };
    setVehicle(next);
    setError(undefined);
    void savePxVehicle({ vehicle: next, source });
    setStep("mileage");
  }, [manual, source]);

  const valueVehicle = useCallback(async () => {
    const issue = mileageError(mileage);
    if (issue) {
      setError(issue);
      setErrorKind("invalid_mileage");
      return;
    }
    const parsed = parseMileage(mileage);
    if (parsed === undefined) {
      return;
    }
    setError(undefined);
    setErrorKind(undefined);
    setLoading(true);
    setStep("valuing");
    track(analyticsEvents.pxMileageSubmitted);
    track(analyticsEvents.pxValuationRequested);
    const result = await valuePxVehicle({
      registration,
      mileage: parsed,
      vehicle,
      source,
    });
    setLoading(false);
    if (!result.ok) {
      track(analyticsEvents.pxValuationFailed, { reason: result.reason });
      if (result.reason === "ineligible") {
        setErrorKind("not_eligible");
      } else {
        setErrorKind("valuation_unavailable");
      }
      setStep("mileage");
      return;
    }
    setEstimatedValue(result.valuation.estimatedValue);
    track(analyticsEvents.pxValuationReceived);
    track(analyticsEvents.pxValuationCompleted);
    setStep("valuation");
  }, [mileage, registration, source, track, vehicle]);

  const continueFromValuation = useCallback(() => {
    track(analyticsEvents.pxSettlementStarted);
    setStep("finance");
  }, [track]);

  const continueFinance = useCallback(async () => {
    if (financeOutstanding === undefined) {
      setError("Choose whether you still have finance on this car.");
      return;
    }
    if (financeOutstanding) {
      setError(undefined);
      setStep("settlement");
      return;
    }
    const saved = await savePxSettlement({
      financeOutstanding: false,
      source,
    });
    if (!saved.ok) {
      setError(saved.message);
      setErrorKind("session_expired");
      return;
    }
    track(analyticsEvents.pxSettlementSubmitted, { outstanding: false });
    const figures = calculatePxEquity(estimatedValue ?? 0, 0);
    track(
      figures.equityType === "negative"
        ? analyticsEvents.pxNegativeEquity
        : analyticsEvents.pxPositiveEquity,
      { equityType: figures.equityType },
    );
    setStep("result");
  }, [estimatedValue, financeOutstanding, source, track]);

  const submitSettlement = useCallback(() => {
    const issue = settlementError(settlement);
    if (issue) {
      setError(issue);
      setErrorKind("invalid_settlement");
      return;
    }
    void savePxSettlement({
      financeOutstanding: true,
      settlementFigure: settlement,
      source,
    });
    track(analyticsEvents.pxSettlementSubmitted, { outstanding: true });
    const figures = calculatePxEquity(
      estimatedValue ?? 0,
      parsePounds(settlement),
    );
    track(
      figures.equityType === "negative"
        ? analyticsEvents.pxNegativeEquity
        : analyticsEvents.pxPositiveEquity,
      { equityType: figures.equityType },
    );
    setError(undefined);
    setErrorKind(undefined);
    setStep("result");
  }, [estimatedValue, settlement, source, track]);

  const toDealInput = useCallback((): DealPartExchangeInput | undefined => {
    const parsedMileage = parseMileage(mileage);
    if (!registration || parsedMileage === undefined || estimatedValue === undefined) {
      return undefined;
    }
    return {
      registration,
      mileage: parsedMileage,
      value: estimatedValue,
      settlement:
        financeOutstanding === false
          ? 0
          : parsePounds(settlement),
      vehicle: vehicle
        ? {
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            variant: vehicle.variant,
            fuelType: vehicle.fuelType,
            transmission: vehicle.transmission,
          }
        : undefined,
      financeOutstanding,
    };
  }, [
    estimatedValue,
    financeOutstanding,
    mileage,
    registration,
    settlement,
    vehicle,
  ]);

  const apply = useCallback(async () => {
    const px = toDealInput();
    if (!px) {
      return;
    }
    setBusy(true);
    completed.current = true;
    if (onApplied) {
      await onApplied(px);
      track(analyticsEvents.pxAddedToDeal);
      track(analyticsEvents.pxCompleted);
      await recordPxCompletionLead({
        source,
        consideredStockId,
      });
      setBusy(false);
      return;
    }

    const result = await applyPxToDealAction({
      dealId,
      px,
      source,
      consideredStockId,
    });
    setBusy(false);
    completed.current = true;
    if (result.ok) {
      track(analyticsEvents.pxAddedToDeal);
      track(analyticsEvents.pxCompleted);
      router.push(getDealUrl(result.dealId));
      return;
    }
    if (result.reason === "no_deal") {
      track(analyticsEvents.pxCompleted);
      router.push(getUsedCarsUrl());
      return;
    }
    if (result.reason === "expired") {
      setErrorKind("session_expired");
    }
  }, [
    consideredStockId,
    dealId,
    onApplied,
    router,
    source,
    toDealInput,
    track,
  ]);

  const restart = useCallback(async () => {
    setRegistration("");
    setMileage("");
    setSettlement("");
    setVehicle(undefined);
    setEstimatedValue(undefined);
    setFinanceOutstanding(undefined);
    setError(undefined);
    setErrorKind(undefined);
    setManual({
      year: "",
      make: "",
      model: "",
      variant: "",
      fuelType: "",
      transmission: "",
    });
    await clearPxSessionAction();
    setStep(variant === "standalone" ? "intro" : "registration");
  }, [variant]);

  const goBack = useCallback(() => {
    setError(undefined);
    setErrorKind(undefined);
    if (step === "registration") {
      if (variant === "standalone") {
        setStep("intro");
      }
      return;
    }
    if (step === "vehicle" || step === "manual") {
      setStep("registration");
      return;
    }
    if (step === "mileage") {
      setStep(vehicle?.source === "manual" ? "manual" : "vehicle");
      return;
    }
    if (step === "valuation") {
      setStep("mileage");
      return;
    }
    if (step === "finance") {
      setStep("valuation");
      return;
    }
    if (step === "settlement") {
      setStep("finance");
      return;
    }
    if (step === "result") {
      setStep(financeOutstanding ? "settlement" : "finance");
    }
  }, [financeOutstanding, step, variant, vehicle?.source]);

  const figures = calculatePxEquity(
    estimatedValue ?? 0,
    financeOutstanding ? parsePounds(settlement) ?? 0 : 0,
  );

  return {
    variant,
    source,
    step,
    registration,
    setRegistration,
    mileage,
    setMileage,
    settlement,
    setSettlement,
    vehicle,
    manual,
    setManual,
    estimatedValue,
    financeOutstanding,
    setFinanceOutstanding,
    error,
    errorKind,
    loading,
    busy,
    hasDeal: hasDeal || Boolean(onApplied),
    figures,
    start,
    lookup,
    confirmVehicle,
    saveManual,
    valueVehicle,
    continueFromValuation,
    continueFinance,
    submitSettlement,
    apply,
    restart,
    goBack,
    notMyCar: () => {
      setVehicle(undefined);
      setStep("registration");
    },
    enterManual: () => {
      const issue = registrationError(registration);
      if (issue) {
        setError(issue);
        setErrorKind("invalid_registration");
        return;
      }
      setErrorKind(undefined);
      setError(undefined);
      setStep("manual");
    },
    markStarted: start,
  };
}

export type PartExchangeFlow = ReturnType<typeof usePartExchange>;
