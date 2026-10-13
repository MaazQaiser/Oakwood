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
import { RECOMMENDED_COVER_IDS } from "@/lib/deal/products";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { DealPageModel } from "@/types/deal";
import type {
  DealBuilderPhase,
  DealCalculation,
  DealCalculationInput,
  DealDecisionInput,
  DealDraft,
  DealPartExchangeInput,
  DealProductDefinition,
  DealStepName,
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
  updatePartExchange: (patch: Partial<DealPartExchangeInput>) => void;
  setSettlement: (value?: number) => void;
  clearPartExchange: () => void;
  toggleProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  setProductYears: (id: string, years: number) => void;
  clearAllCover: () => void;
  addRecommendedCover: () => void;
  productImpact: (id: string) => number;
  setDecision: (decision: DealDecisionInput) => void;
  markStepComplete: (step: DealStepName) => void;
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
      cashDeposit: 500,
      term: 48,
      annualMileage: model.config.pcpMileageOptions[2] ?? 10000,
      productIds: [],
      productYears: {},
      stepsCompleted: [],
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

  const setFinanceType = useCallback(
    (type: FinanceProductType) => {
      setDraft((current) => {
        const nextTerm =
          type === "pcp" && current.term > 60 ? 60 : current.term;
        return {
          ...current,
          financeType: type,
          term: nextTerm,
          annualMileage:
            type === "pcp"
              ? current.annualMileage ??
                model.config.pcpMileageOptions[2] ??
                10000
              : current.annualMileage,
        };
      });
      trackEvent(analyticsEvents.financeTypeChanged, { type });
    },
    [model.config.pcpMileageOptions],
  );

  const setCashDeposit = useCallback(
    (value: number) => {
      const step = model.config.depositStep;
      const max = vehicle
        ? Math.min(vehicle.cashPrice, model.config.maxDepositCap)
        : model.config.maxDepositCap;
      const next = Math.min(max, Math.max(0, Math.round(value / step) * step));
      setDraft((current) => ({ ...current, cashDeposit: next }));
      trackEvent(analyticsEvents.depositChanged);
    },
    [model.config.depositStep, model.config.maxDepositCap, vehicle],
  );

  const applyDepositGap = useCallback(() => {
    const gap =
      calculation?.advanceGap ??
      calculation?.constraints.find((item) => item.depositGap)?.depositGap;
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
        condition: draft.px?.condition,
        serviceHistory: draft.px?.serviceHistory,
        financeOutstanding: draft.px?.financeOutstanding,
        outstandingFinanceAmount: draft.px?.outstandingFinanceAmount,
        outstandingFinanceLender: draft.px?.outstandingFinanceLender,
        settlement: draft.px?.settlement,
      };
      setDraft((current) => ({
        ...current,
        px: { ...current.px, ...next },
        cashDeposit: Math.max(
          current.cashDeposit,
          Math.max(0, result.value - (current.px?.settlement ?? 0)) + 500,
        ),
      }));
      trackEvent(analyticsEvents.pxValuationCompleted, {
        stockId: vehicle.stockId,
      });
    },
    [draft.px, vehicle],
  );

  const applyPartExchange = useCallback(
    (input: DealPartExchangeInput) => {
      setPxError(undefined);
      setDraft((current) => {
        const equity = input.value - (input.settlement ?? 0);
        return {
          ...current,
          px: input,
          cashDeposit: Math.max(500, Math.max(0, equity) + 500),
        };
      });
      const equity = input.value - (input.settlement ?? 0);
      trackEvent(analyticsEvents.pxAddedToDeal, { stockId: vehicle?.stockId });
      if (equity > 0) {
        trackEvent(analyticsEvents.pxEquityAdded, {
          stockId: vehicle?.stockId,
        });
      } else if (equity < 0) {
        trackEvent(analyticsEvents.pxNegativeEquity, {
          stockId: vehicle?.stockId,
        });
      }
    },
    [vehicle?.stockId],
  );

  const updatePartExchange = useCallback(
    (patch: Partial<DealPartExchangeInput>) => {
      setDraft((current) => {
        if (!current.px) {
          return current;
        }
        const next = { ...current.px, ...patch };
        if (patch.financeOutstanding === false) {
          next.outstandingFinanceAmount = undefined;
          next.outstandingFinanceLender = undefined;
          next.settlement = undefined;
        }
        if (typeof patch.outstandingFinanceAmount === "number") {
          next.settlement = patch.outstandingFinanceAmount;
        }
        return { ...current, px: next };
      });
    },
    [],
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
      return {
        ...current,
        px: next,
        cashDeposit: Math.max(500, Math.max(0, equity) + 500),
      };
    });
  }, []);

  const clearPartExchange = useCallback(() => {
    setDraft((current) => ({ ...current, px: undefined }));
    setPxError(undefined);
    trackEvent(analyticsEvents.pxRemoved);
    trackEvent(analyticsEvents.pxRemovedFromDeal, {
      stockId: vehicle?.stockId,
    });
  }, [vehicle?.stockId]);

  const toggleProduct = useCallback((id: string) => {
    setDraft((current) => {
      const selected = current.productIds.includes(id);
      trackEvent(
        selected ? analyticsEvents.productRemoved : analyticsEvents.productAdded,
      );
      const productYears = { ...current.productYears };
      if (selected) {
        delete productYears[id];
      } else if (!productYears[id]) {
        productYears[id] = 1;
      }
      return {
        ...current,
        productIds: selected
          ? current.productIds.filter((item) => item !== id)
          : [...current.productIds, id],
        productYears,
      };
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setDraft((current) => {
      const productYears = { ...current.productYears };
      delete productYears[id];
      return {
        ...current,
        productIds: current.productIds.filter((item) => item !== id),
        productYears,
      };
    });
    trackEvent(analyticsEvents.productRemoved);
  }, []);

  const setProductYears = useCallback((id: string, years: number) => {
    setDraft((current) => ({
      ...current,
      productYears: { ...current.productYears, [id]: years },
      productIds: current.productIds.includes(id)
        ? current.productIds
        : [...current.productIds, id],
    }));
  }, []);

  const clearAllCover = useCallback(() => {
    setDraft((current) => ({
      ...current,
      productIds: [],
      productYears: {},
    }));
  }, []);

  const addRecommendedCover = useCallback(() => {
    setDraft((current) => {
      const productYears = { ...current.productYears };
      const productIds = new Set(current.productIds);
      for (const id of RECOMMENDED_COVER_IDS) {
        productIds.add(id);
        productYears[id] = productYears[id] ?? 1;
      }
      return {
        ...current,
        productIds: Array.from(productIds),
        productYears,
      };
    });
  }, []);

  const productImpact = useCallback(
    (id: string) => {
      if (!vehicle) {
        return 0;
      }
      return productMonthlyImpact(
        toInput(vehicle, draft),
        id,
        profileForCalc,
        model.config,
      );
    },
    [draft, model.config, profileForCalc, vehicle],
  );

  const setDecision = useCallback((decision: DealDecisionInput) => {
    setDraft((current) => ({ ...current, decision }));
  }, []);

  const markStepComplete = useCallback((step: DealStepName) => {
    setDraft((current) => {
      const stepsCompleted = Array.from(
        new Set([...(current.stepsCompleted ?? []), step]),
      );
      return { ...current, stepsCompleted };
    });
  }, []);

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
      updatePartExchange,
      setSettlement,
      clearPartExchange,
      toggleProduct,
      removeProduct,
      setProductYears,
      clearAllCover,
      addRecommendedCover,
      productImpact,
      setDecision,
      markStepComplete,
      retryCalculation,
      markSaved,
    };
  }, [
    addRecommendedCover,
    applyDepositGap,
    applyPartExchange,
    calculation,
    clearAllCover,
    clearPartExchange,
    draft,
    markSaved,
    markStepComplete,
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
    setDecision,
    setFinanceType,
    setProductYears,
    setSettlement,
    setTerm,
    startPartExchange,
    toggleProduct,
    updatePartExchange,
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
