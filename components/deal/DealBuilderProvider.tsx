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
import { useRouter } from "next/navigation";
import { calculateDeal, productMonthlyImpact } from "@/lib/deal/calculate";
import { valuePartExchange } from "@/lib/deal/valuation";
import {
  RECOMMENDED_COVER_IDS,
  defaultCoverYears,
} from "@/lib/deal/products";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { DealPageModel } from "@/types/deal";
import type {
  DealBuilderPhase,
  DealCalculation,
  DealCalculationInput,
  DealDecisionInput,
  DealDraft,
  DealFinanceProfileInput,
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
  /** The same deal priced as HP or PCP, for side-by-side quote tabs. */
  calculateFor: (type: FinanceProductType) => DealCalculation | undefined;
  /** Monthly added by the selected cover bundle versus no cover. */
  coverMonthly: number;
  /** APR used for figures: decision in principle, then eligibility profile. */
  apr?: number;
  setDecision: (decision: DealDecisionInput) => void;
  markStepComplete: (step: DealStepName) => void;
  /** Save the latest draft, then go to `href` (use for step changes). */
  navigateTo: (href: string) => void;
  /** True while saving before a step change. */
  navigating: boolean;
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
    productYears: draft.productYears,
  };
}

/**
 * Cash deposit ceiling: cash plus part-exchange equity can't exceed the
 * price, so the total deposit never passes the car's value.
 */
export function maxCashDeposit(
  cashPrice: number | undefined,
  cap: number,
  step: number,
  px?: DealDraft["px"],
): number {
  const equity = px ? Math.max(0, px.value - (px.settlement ?? 0)) : 0;
  const ceiling = Math.min(cap, Math.max(0, (cashPrice ?? cap) - equity));
  return Math.floor(ceiling / step) * step;
}

/**
 * A soft-check decision in principle sets the customer's personal APR, so it
 * must drive the monthly figure as well as the APR label.
 */
function resolveProfile(
  draft: DealDraft,
  finance: DealPageModel["finance"],
  termOptions: readonly number[],
): DealFinanceProfileInput | undefined {
  const base = finance.hasProfile ? finance.profile : undefined;
  const decision = draft.decision;
  const decisionApr =
    decision?.apr &&
    (decision.outcome === "approved" || decision.outcome === "approved_less")
      ? decision.apr
      : undefined;
  if (!decisionApr) {
    return base;
  }
  return base
    ? { ...base, apr: decisionApr }
    : {
        apr: decisionApr,
        maximumAdvance: Number.POSITIVE_INFINITY,
        maximumTerm: Math.max(...termOptions),
        productType: draft.financeType,
        expiresAt: "",
      };
}

/** Autosave via the Route Handler, which persists the draft without re-rendering the page. */
function saveDealDraft(dealId: string, draft: DealDraft): Promise<unknown> {
  return fetch("/api/deal/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dealId, draft }),
    keepalive: true,
  }).catch(() => undefined);
}

export function DealBuilderProvider({
  model,
  children,
}: {
  model: Extract<DealPageModel, { status: "ready" }> | DealPageModel;
  children: ReactNode;
}) {
  const vehicle = model.vehicle;
  const defaultMileage = model.config.pcpMileageOptions[2] ?? 10000;
  const [draft, setDraft] = useState<DealDraft>(() =>
    model.draft
      ? {
          ...model.draft,
          // HP deals arrive without mileage; preselect the PCP default so the
          // Step 2 chips and the PCP quote tab always have a value.
          annualMileage: model.draft.annualMileage ?? defaultMileage,
        }
      : {
          financeType: "hp",
          cashDeposit: 500,
          term: 48,
          annualMileage: defaultMileage,
          productIds: [],
          productYears: {},
          stepsCompleted: [],
        },
  );
  const pendingSave = useRef<number | null>(null);
  const router = useRouter();
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [pxError, setPxError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const started = useRef(false);

  const vehicleUnavailable = Boolean(
    vehicle && vehicle.availability !== "available",
  );
  const needsEligibility = !model.finance.hasProfile;
  const profileForCalc = useMemo(
    () => resolveProfile(draft, model.finance, model.config.termOptions),
    [draft, model.finance, model.config.termOptions],
  );

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
      pendingSave.current = null;
      void saveDealDraft(model.dealId, draft);
      trackEvent(analyticsEvents.dealRecalculated);
      if (calculation && !calculation.valid) {
        trackEvent(analyticsEvents.dealInvalid);
      }
    }, RECALC_MS);
    pendingSave.current = timer;
    return () => window.clearTimeout(timer);
  }, [calculation, draft, model.dealId, vehicle]);

  /**
   * Leaving a step unmounts this provider and cancels the debounced save
   * above, which used to drop the last edit before every Continue. Step
   * navigation goes through here instead: once the latest draft has
   * committed, save it, then change route.
   */
  useEffect(() => {
    if (!navTarget) {
      return;
    }
    let cancelled = false;
    if (pendingSave.current !== null) {
      window.clearTimeout(pendingSave.current);
      pendingSave.current = null;
    }
    void saveDealDraft(model.dealId, draft).finally(() => {
      if (!cancelled) {
        router.push(navTarget);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [draft, model.dealId, navTarget, router]);

  const navigateTo = useCallback((href: string) => setNavTarget(href), []);

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
      setDraft((current) => {
        const max = maxCashDeposit(
          vehicle?.cashPrice,
          model.config.maxDepositCap,
          step,
          current.px,
        );
        const next = Math.min(
          max,
          Math.max(0, Math.round(value / step) * step),
        );
        return { ...current, cashDeposit: next };
      });
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
      setDraft((current) => ({ ...current, px: input }));
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
      return { ...current, px: next };
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
      // Keep the chosen duration when switching off, so switching back on
      // restores it and the off-state price matches the card.
      const productYears = { ...current.productYears };
      if (!selected && !productYears[id]) {
        productYears[id] = defaultCoverYears(current.term)[id] ?? 1;
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
    setDraft((current) => ({ ...current, productIds: [] }));
  }, []);

  const addRecommendedCover = useCallback(() => {
    setDraft((current) => {
      const productYears = { ...current.productYears };
      const productIds = new Set(current.productIds);
      const defaults = defaultCoverYears(current.term);
      for (const id of RECOMMENDED_COVER_IDS) {
        productIds.add(id);
        if (defaults[id]) {
          productYears[id] = productYears[id] ?? defaults[id];
        }
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
      // Price unselected products at the duration the card shows.
      return productMonthlyImpact(
        {
          ...toInput(vehicle, draft),
          productYears: {
            ...defaultCoverYears(draft.term),
            ...draft.productYears,
          },
        },
        id,
        profileForCalc,
        model.config,
      );
    },
    [draft, model.config, profileForCalc, vehicle],
  );

  const calculateFor = useCallback(
    (type: FinanceProductType) => {
      if (!vehicle) {
        return undefined;
      }
      try {
        return calculateDeal(
          {
            ...toInput(vehicle, draft),
            financeType: type,
            term: type === "pcp" ? Math.min(draft.term, 60) : draft.term,
            annualMileage:
              draft.annualMileage ?? model.config.pcpMileageOptions[2] ?? 10000,
          },
          profileForCalc,
          model.config,
        );
      } catch {
        return undefined;
      }
    },
    [draft, model.config, profileForCalc, vehicle],
  );

  const coverMonthly = useMemo(() => {
    if (!vehicle || !calculation || draft.productIds.length === 0) {
      return 0;
    }
    try {
      const bare = calculateDeal(
        { ...toInput(vehicle, draft), productIds: [] },
        profileForCalc,
        model.config,
      );
      return Math.max(0, calculation.monthlyPayment - bare.monthlyPayment);
    } catch {
      return 0;
    }
  }, [calculation, draft, model.config, profileForCalc, vehicle]);

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
      calculateFor,
      coverMonthly,
      apr: profileForCalc?.apr,
      setDecision,
      markStepComplete,
      navigateTo,
      navigating: navTarget !== null,
      retryCalculation,
      markSaved,
    };
  }, [
    addRecommendedCover,
    applyDepositGap,
    applyPartExchange,
    calculateFor,
    calculation,
    clearAllCover,
    coverMonthly,
    clearPartExchange,
    draft,
    navigateTo,
    navTarget,
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
    profileForCalc?.apr,
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
