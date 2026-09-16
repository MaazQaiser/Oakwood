"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateFinanceIllustration } from "@/features/finance/calculator/services";
import type {
  CalculatorDraft,
  CalculatorPageModel,
  FinanceCalculatorResult,
} from "@/features/finance/calculator/types";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { DealPartExchangeInput } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

function clampTerm(
  term: number,
  options: readonly number[],
  maxTerm: number,
): number {
  const allowed = options.filter((option) => option <= maxTerm);
  if (allowed.includes(term)) {
    return term;
  }
  return allowed[allowed.length - 1] ?? options[0] ?? term;
}

function initialDraft(model: CalculatorPageModel): CalculatorDraft {
  const provider = model.config.provider;
  const profile = model.finance.hasProfile ? model.finance.profile : undefined;
  const maxTerm = profile?.maximumTerm ?? Math.max(...provider.termOptions);
  const defaultTerm = clampTerm(
    profile?.maximumTerm && profile.maximumTerm < model.config.defaultTerm
      ? profile.maximumTerm
      : model.config.defaultTerm,
    provider.termOptions,
    maxTerm,
  );
  const vehiclePrice =
    model.vehicle?.cashPrice ??
    model.exampleVehicle?.cashPrice ??
    0;
  const suggestedDeposit =
    model.finance.suggestedDeposit ?? model.config.defaultDeposit;
  const cashDeposit = Math.min(
    Math.max(provider.minDeposit, suggestedDeposit),
    vehiclePrice || suggestedDeposit,
  );

  return {
    vehiclePrice,
    cashDeposit,
    financeType: profile?.productType === "pcp" && provider.pcpEnabled ? "pcp" : "hp",
    term: defaultTerm,
    annualMileage: provider.pcpMileageOptions[0] ?? 8000,
    px: model.px,
  };
}

export function useFinanceCalculator(model: CalculatorPageModel) {
  const [draft, setDraft] = useState<CalculatorDraft>(() => initialDraft(model));
  const [priceText, setPriceText] = useState(() =>
    draft.vehiclePrice ? String(draft.vehiclePrice) : "",
  );
  const [unavailableOverride, setUnavailableOverride] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const started = useRef(false);
  const completedAction = useRef(false);

  const provider = model.config.provider;
  const profile = model.finance.hasProfile ? model.finance.profile : undefined;
  const maxTerm = profile?.maximumTerm ?? Math.max(...provider.termOptions);

  const result: FinanceCalculatorResult = useMemo(() => {
    void retryTick;
    if (unavailableOverride) {
      return { status: "unavailable", constraints: [], fieldErrors: [] };
    }
    return calculateFinanceIllustration({
      vehiclePrice: draft.vehiclePrice,
      cashDeposit: draft.cashDeposit,
      financeType: draft.financeType,
      term: draft.term,
      annualMileage: draft.annualMileage,
      vehicle: model.vehicle,
      exampleVehicle: model.exampleVehicle,
      px: draft.px,
      profile,
      config: provider,
    });
  }, [
    draft,
    model.exampleVehicle,
    model.vehicle,
    profile,
    provider,
    retryTick,
    unavailableOverride,
  ]);

  useEffect(() => {
    trackEvent(analyticsEvents.financeCalculatorViewed, {
      hasVehicle: Boolean(model.vehicle),
      representative: !model.finance.hasProfile,
    });
  }, [model.finance.hasProfile, model.vehicle]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (result.status === "unavailable") {
        trackEvent(analyticsEvents.financeCalculationFailed, {
          reason: "unavailable",
        });
        return;
      }
      trackEvent(analyticsEvents.financeCalculationRequested, {
        financeType: draft.financeType,
        term: draft.term,
      });
      if (result.status === "ok") {
        trackEvent(analyticsEvents.financeCalculationCompleted, {
          financeType: draft.financeType,
          term: draft.term,
        });
      } else if (
        result.status === "invalid" ||
        result.status === "constraint" ||
        result.status === "not_financeable"
      ) {
        trackEvent(analyticsEvents.financeCalculationFailed, {
          reason: result.status,
        });
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft, result.status]);

  useEffect(() => {
    const onLeave = () => {
      if (started.current && !completedAction.current) {
        trackEvent(analyticsEvents.financeCalculatorAbandoned);
      }
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, []);

  const markStarted = useCallback(() => {
    if (!started.current) {
      started.current = true;
      trackEvent(analyticsEvents.financeCalculatorStarted, {
        hasVehicle: Boolean(model.vehicle),
      });
    }
  }, [model.vehicle]);

  const setVehiclePrice = useCallback(
    (raw: string) => {
      markStarted();
      setPriceText(raw);
      const parsed = Number(raw.replace(/,/g, "").replace(/£/g, ""));
      if (Number.isFinite(parsed)) {
        setDraft((current) => ({ ...current, vehiclePrice: parsed }));
        trackEvent(analyticsEvents.financePriceChanged);
      } else if (raw.trim() === "") {
        setDraft((current) => ({ ...current, vehiclePrice: 0 }));
      }
    },
    [markStarted],
  );

  const blurVehiclePrice = useCallback(() => {
    const parsed = Number(priceText.replace(/,/g, "").replace(/£/g, ""));
    if (Number.isFinite(parsed) && parsed >= 1) {
      setPriceText(String(Math.round(parsed)));
      setDraft((current) => ({ ...current, vehiclePrice: Math.round(parsed) }));
    }
  }, [priceText]);

  const setCashDeposit = useCallback(
    (value: number) => {
      markStarted();
      setDraft((current) => ({
        ...current,
        cashDeposit: Math.round(value),
      }));
      trackEvent(analyticsEvents.financeDepositChanged);
    },
    [markStarted],
  );

  const setFinanceType = useCallback(
    (financeType: FinanceProductType) => {
      markStarted();
      setDraft((current) => ({ ...current, financeType }));
      trackEvent(analyticsEvents.financeTypeChanged, { financeType });
    },
    [markStarted],
  );

  const setTerm = useCallback(
    (term: number) => {
      markStarted();
      setDraft((current) => ({ ...current, term }));
      trackEvent(analyticsEvents.financeTermChanged, { term });
    },
    [markStarted],
  );

  const setAnnualMileage = useCallback(
    (annualMileage: number) => {
      markStarted();
      setDraft((current) => ({ ...current, annualMileage }));
      trackEvent(analyticsEvents.financeMileageChanged, { annualMileage });
    },
    [markStarted],
  );

  const applyPartExchange = useCallback((px: DealPartExchangeInput) => {
    markStarted();
    setDraft((current) => ({ ...current, px }));
  }, [markStarted]);

  const clearPartExchange = useCallback(() => {
    markStarted();
    setDraft((current) => ({ ...current, px: undefined }));
  }, [markStarted]);

  const applyDepositGap = useCallback(() => {
    const gap = result.constraints.find((item) => item.depositGap)?.depositGap;
    if (!gap) {
      return;
    }
    setCashDeposit(draft.cashDeposit + gap);
  }, [draft.cashDeposit, result.constraints, setCashDeposit]);

  const retryCalculation = useCallback(() => {
    setUnavailableOverride(false);
    setRetryTick((value) => value + 1);
  }, []);

  const markCompletedAction = useCallback(() => {
    completedAction.current = true;
  }, []);

  const fieldError = useCallback(
    (field: "vehiclePrice" | "deposit" | "term" | "mileage" | "vehicle") =>
      result.fieldErrors.find((error) => error.field === field)?.message,
    [result.fieldErrors],
  );

  return {
    draft,
    priceText,
    result,
    provider,
    profile,
    maxTerm,
    personalised: model.finance.hasProfile,
    setVehiclePrice,
    blurVehiclePrice,
    setCashDeposit,
    setFinanceType,
    setTerm,
    setAnnualMileage,
    applyPartExchange,
    clearPartExchange,
    applyDepositGap,
    retryCalculation,
    markCompletedAction,
    fieldError,
  };
}

export type FinanceCalculatorController = ReturnType<typeof useFinanceCalculator>;
