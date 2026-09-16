"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { saveDealDraftAction } from "@/features/deal/actions";
import { calculateDeal, productMonthlyImpact } from "@/lib/deal/calculate";
import { valuePartExchange } from "@/lib/deal/valuation";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { DealPageModel } from "@/types/deal";
import type {
  DealBuilderPhase,
  DealCalculation,
  DealCalculationInput,
  DealDraft,
  DealPartExchangeInput,
  DealProductDefinition,
} from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

const RECALC_MS = 220;

export interface DealBuilderContextValue {
  dealId: string;
  phase: DealBuilderPhase;
  vehicle: NonNullable<DealPageModel["vehicle"]>;
  similar: DealPageModel["similar"];
  finance: DealPageModel["finance"];
  products: DealProductDefinition[];
  config: DealPageModel["config"];
  contact: DealPageModel["contact"];
  draft: DealDraft;
  calculation?: DealCalculation;
  pxError?: string;
  needsEligibility: boolean;
  vehicleUnavailable: boolean;
  setFinanceType: (type: FinanceProductType) => void;
  setCashDeposit: (value: number) => void;
  applyDepositGap: () => void;
  setTerm: (value: number) => void;
  setAnnualMileage: (value: number) => void;
  startPartExchange: (registration: string, mileage: number) => void;
  applyPartExchange: (input: DealPartExchangeInput) => void;
  setSettlement: (value?: number) => void;
  clearPartExchange: () => void;
  toggleProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  productImpact: (id: string) => number;
  retryCalculation: () => void;
  markSaved: () => void;
}

const DealBuilderContext = createContext<DealBuilderContextValue | null>(null);

function toInput(
  vehicle: NonNullable<DealPageModel["vehicle"]>,
  draft: DealDraft,
): DealCalculationInput {
  return {
    vehiclePrice: vehicle.cashPrice,
    vehicleYear: vehicle.year,
    vehicleMileage: vehicle.mileage,
    representativeMonthly: vehicle.representativeMonthly,
    cashDeposit: draft.cashDeposit,
    pxValue: draft.px?.value,
    pxSettlement: draft.px?.settlement,
    financeType: draft.financeType,
    term: draft.term,
    annualMileage: draft.annualMileage,
    productIds: draft.productIds,
  };
}

export function DealBuilderProvider({
  model,
  children,
}: {
  model: Extract<DealPageModel, { status: "ready" }> | DealPageModel;
  children: ReactNode;
}) {
  const vehicle = model.vehicle;
  const [draft, setDraft] = useState<DealDraft>(
    model.draft ?? {
      financeType: "hp",
      cashDeposit: 1000,
      term: 48,
      annualMileage: model.config.pcpMileageOptions[1] ?? 10000,
      productIds: [],
    },
  );
  const [pxError, setPxError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const started = useRef(false);

  const vehicleUnavailable = Boolean(
    vehicle && vehicle.availability !== "available",
  );
  const needsEligibility = !model.finance.hasProfile;
  const profileForCalc = model.finance.hasProfile
    ? model.finance.profile
    : undefined;

  const { calculation, calcError } = useMemo(() => {
    if (!vehicle) {
      return { calculation: undefined, calcError: false };
    }
    try {
      void retryTick;
      const result = calculateDeal(
        toInput(vehicle, draft),
        profileForCalc,
        model.config,
      );
      return { calculation: result, calcError: false };
    } catch {
      return { calculation: undefined, calcError: true };
    }
  }, [draft, model.config, profileForCalc, retryTick, vehicle]);

  useEffect(() => {
    if (!vehicle || started.current) {
      return;
    }
    started.current = true;
    trackEvent(analyticsEvents.dealStarted, { stockId: vehicle.stockId });
  }, [vehicle]);

  useEffect(() => {
    if (!vehicle) {
      return;
    }
    const timer = window.setTimeout(() => {
      void saveDealDraftAction({ dealId: model.dealId, draft });
      trackEvent(analyticsEvents.dealRecalculated);
      if (calculation && !calculation.valid) {
        trackEvent(analyticsEvents.dealInvalid);
      }
    }, RECALC_MS);
    return () => window.clearTimeout(timer);
  }, [calculation, draft, model.dealId, vehicle]);

  const retryCalculation = useCallback(() => {
    setRetryTick((current) => current + 1);
  }, []);

  const setFinanceType = useCallback((type: FinanceProductType) => {
    setDraft((current) => ({
      ...current,
      financeType: type,
      annualMileage:
        type === "pcp"
          ? current.annualMileage ?? model.config.pcpMileageOptions[1] ?? 10000
          : current.annualMileage,
    }));
    trackEvent(analyticsEvents.financeTypeChanged, { type });
  }, [model.config.pcpMileageOptions]);

  const setCashDeposit = useCallback((value: number) => {
    const step = model.config.depositStep;
    const max = vehicle
      ? Math.min(vehicle.cashPrice, model.config.maxDepositCap)
      : model.config.maxDepositCap;
    const next = Math.min(max, Math.max(0, Math.round(value / step) * step));
    setDraft((current) => ({ ...current, cashDeposit: next }));
    trackEvent(analyticsEvents.depositChanged);
  }, [model.config.depositStep, model.config.maxDepositCap, vehicle]);

  const applyDepositGap = useCallback(() => {
    const gap = calculation?.advanceGap ?? calculation?.constraints.find((item) => item.depositGap)?.depositGap;
    if (!gap) {
      return;
    }
    setCashDeposit(draft.cashDeposit + gap);
  }, [calculation, draft.cashDeposit, setCashDeposit]);

  const setTerm = useCallback((value: number) => {
    setDraft((current) => ({ ...current, term: value }));
    trackEvent(analyticsEvents.termChanged);
  }, []);

  const setAnnualMileage = useCallback((value: number) => {
    setDraft((current) => ({ ...current, annualMileage: value }));
    trackEvent(analyticsEvents.annualMileageChanged);
  }, []);

  const startPartExchange = useCallback(
    (registration: string, mileage: number) => {
      if (!vehicle) {
        return;
      }
      trackEvent(analyticsEvents.pxStarted, { stockId: vehicle.stockId });
      const result = valuePartExchange(registration, mileage);
      if (!result.ok) {
        setPxError("We couldn't value this vehicle right now.");
        return;
      }
      setPxError(undefined);
      const next: DealPartExchangeInput = {
        registration: registration.replace(/\s+/g, "").toUpperCase(),
        mileage,
        value: result.value,
      };
      setDraft((current) => ({ ...current, px: next }));
      trackEvent(analyticsEvents.pxValuationCompleted, { stockId: vehicle.stockId });
    },
    [vehicle],
  );

  const applyPartExchange = useCallback(
    (input: DealPartExchangeInput) => {
      setPxError(undefined);
      setDraft((current) => ({ ...current, px: input }));
      const equity = input.value - (input.settlement ?? 0);
      trackEvent(analyticsEvents.pxAddedToDeal, { stockId: vehicle?.stockId });
      if (equity > 0) {
        trackEvent(analyticsEvents.pxEquityAdded, { stockId: vehicle?.stockId });
      } else if (equity < 0) {
        trackEvent(analyticsEvents.pxNegativeEquity, { stockId: vehicle?.stockId });
      }
    },
    [vehicle?.stockId],
  );

  const setSettlement = useCallback((value?: number) => {
    setDraft((current) => {
      if (!current.px) {
        return current;
      }
      const next = { ...current.px, settlement: value };
      const equity = next.value - (value ?? 0);
      if (equity > 0) {
        trackEvent(analyticsEvents.pxEquityAdded);
      }
      return { ...current, px: next };
    });
  }, []);

  const clearPartExchange = useCallback(() => {
    setDraft((current) => ({ ...current, px: undefined }));
    setPxError(undefined);
    trackEvent(analyticsEvents.pxRemoved);
    trackEvent(analyticsEvents.pxRemovedFromDeal, { stockId: vehicle?.stockId });
  }, [vehicle?.stockId]);

  const toggleProduct = useCallback((id: string) => {
    setDraft((current) => {
      const selected = current.productIds.includes(id);
      trackEvent(
        selected ? analyticsEvents.productRemoved : analyticsEvents.productAdded,
      );
      return {
        ...current,
        productIds: selected
          ? current.productIds.filter((item) => item !== id)
          : [...current.productIds, id],
      };
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setDraft((current) => ({
      ...current,
      productIds: current.productIds.filter((item) => item !== id),
    }));
    trackEvent(analyticsEvents.productRemoved);
  }, []);

  const productImpact = useCallback(
    (id: string) => {
      if (!vehicle) {
        return 0;
      }
      return productMonthlyImpact(toInput(vehicle, draft), id, profileForCalc, model.config);
    },
    [draft, model.config, profileForCalc, vehicle],
  );

  const markSaved = useCallback(() => {
    setSaved(true);
    trackEvent(analyticsEvents.dealSaved);
  }, []);

  const phase: DealBuilderPhase = useMemo(() => {
    if (!vehicle) {
      return "LOADING";
    }
    if (vehicleUnavailable) {
      return "VEHICLE_UNAVAILABLE";
    }
    if (model.finance.expired) {
      return "FINANCE_EXPIRED";
    }
    if (calcError) {
      return "CALCULATION_ERROR";
    }
    if (saved) {
      return "SAVED";
    }
    if (calculation && !calculation.valid) {
      return "INVALID";
    }
    if (calculation?.valid && model.finance.hasProfile) {
      return "READY_FOR_APPLICATION";
    }
    return "READY";
  }, [
    calcError,
    calculation,
    model.finance.expired,
    model.finance.hasProfile,
    saved,
    vehicle,
    vehicleUnavailable,
  ]);

  const value = useMemo<DealBuilderContextValue | null>(() => {
    if (!vehicle) {
      return null;
    }
    return {
      dealId: model.dealId,
      phase,
      vehicle,
      similar: model.similar,
      finance: model.finance,
      products: model.products,
      config: model.config,
      contact: model.contact,
      draft,
      calculation,
      pxError,
      needsEligibility,
      vehicleUnavailable,
      setFinanceType,
      setCashDeposit,
      applyDepositGap,
      setTerm,
      setAnnualMileage,
      startPartExchange,
      applyPartExchange,
      setSettlement,
      clearPartExchange,
      toggleProduct,
      removeProduct,
      productImpact,
      retryCalculation,
      markSaved,
    };
  }, [
    applyDepositGap,
    applyPartExchange,
    calculation,
    clearPartExchange,
    draft,
    markSaved,
    model.contact,
    model.dealId,
    model.finance,
    model.products,
    model.config,
    model.similar,
    needsEligibility,
    phase,
    productImpact,
    pxError,
    removeProduct,
    retryCalculation,
    setAnnualMileage,
    setCashDeposit,
    setFinanceType,
    setSettlement,
    setTerm,
    startPartExchange,
    toggleProduct,
    vehicle,
    vehicleUnavailable,
  ]);

  if (!value) {
    return null;
  }

  return (
    <DealBuilderContext.Provider value={value}>
      {children}
    </DealBuilderContext.Provider>
  );
}

export function useDealBuilderOptional() {
  return useContext(DealBuilderContext);
}

export function useDealBuilder() {
  const context = useContext(DealBuilderContext);
  if (!context) {
    throw new Error("useDealBuilder must be used within DealBuilderProvider");
  }
  return context;
}
