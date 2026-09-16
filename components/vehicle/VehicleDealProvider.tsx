"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { illustrateFinance } from "@/lib/finance/illustration";
import { getMockValuation } from "@/lib/mock/vehicle-detail";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { isReservable } from "@/lib/vehicles/sold";
import type { FinanceDisplayState } from "@/components/finance/FinancePrimitives";
import type { FinanceType, VehicleDetail } from "@/types/vehicle-detail";

const TERM_OPTIONS = [24, 36, 48, 60] as const;
const DEPOSIT_STEP = 500;

export interface PartExchangeValuation {
  registration: string;
  mileage: number;
  value: number;
  settlement?: number;
}

interface VehicleDealContextValue {
  vehicle: VehicleDetail;
  financeType: FinanceType;
  deposit: number;
  term: number;
  termOptions: readonly number[];
  displayState: FinanceDisplayState;
  gapAmount?: number;
  monthlyPayment: number;
  totalPayable: number;
  amountFinanced: number;
  cashPrice: number;
  px?: PartExchangeValuation;
  equity: number;
  extraDeposit: number;
  negativeEquity: number;
  reservable: boolean;
  setFinanceType: (type: FinanceType) => void;
  adjustDeposit: (delta: number) => void;
  setDepositValue: (value: number) => void;
  setTermValue: (value: number) => void;
  applyPartExchange: (input: PartExchangeValuation) => void;
  startValuation: (registration: string, mileage: number) => void;
  setSettlement: (value?: number) => void;
  clearPartExchange: () => void;
  maxDeposit: number;
  depositStep: number;
}

const VehicleDealContext = createContext<VehicleDealContextValue | null>(null);

export function VehicleDealProvider({
  vehicle,
  children,
}: {
  vehicle: VehicleDetail;
  children: ReactNode;
}) {
  const finance = useCustomerFinance();
  const [financeType, setFinanceTypeState] = useState<FinanceType>("hp");
  const [px, setPx] = useState<PartExchangeValuation | undefined>();
  const [opened, setOpened] = useState(false);

  const markOpened = useCallback(() => {
    if (!opened) {
      setOpened(true);
      trackEvent(analyticsEvents.financeControlOpened, {
        stockId: vehicle.stockId,
      });
    }
  }, [opened, vehicle.stockId]);

  const equity = px ? px.value - (px.settlement ?? 0) : 0;
  const extraDeposit = Math.max(0, equity);
  const negativeEquity = Math.max(0, -equity);
  const cashDeposit = finance.deposit;
  const illustratedDeposit = cashDeposit + extraDeposit;
  const maxDeposit = Math.min(vehicle.cashPrice, 20000);

  const illustration = illustrateFinance({
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    deposit: illustratedDeposit,
    term: finance.term,
    financeType,
    negativeEquity,
  });

  const displayState = getFinanceDisplayState(
    finance.mode,
    vehicle.cashPrice,
    finance.maxAdvance,
    illustratedDeposit,
  );
  const gapAmount =
    displayState === "ineligible"
      ? getDepositGap(
          vehicle.cashPrice,
          finance.maxAdvance,
          illustratedDeposit,
        )
      : undefined;

  const setFinanceType = useCallback(
    (type: FinanceType) => {
      markOpened();
      setFinanceTypeState(type);
      trackEvent(analyticsEvents.financeTypeChanged, { type });
    },
    [markOpened],
  );

  const setDepositValue = useCallback(
    (value: number) => {
      markOpened();
      const next = Math.min(maxDeposit, Math.max(0, Math.round(value / DEPOSIT_STEP) * DEPOSIT_STEP));
      finance.setDeposit(next);
      trackEvent(analyticsEvents.depositChanged, { deposit: next });
    },
    [finance, markOpened, maxDeposit],
  );

  const adjustDeposit = useCallback(
    (delta: number) => {
      setDepositValue(finance.deposit + delta);
    },
    [finance.deposit, setDepositValue],
  );

  const setTermValue = useCallback(
    (value: number) => {
      markOpened();
      finance.setTerm(value);
      trackEvent(analyticsEvents.termChanged, { term: value });
    },
    [finance, markOpened],
  );

  const applyPartExchange = useCallback(
    (input: PartExchangeValuation) => {
      setPx(input);
      const nextEquity = input.value - (input.settlement ?? 0);
      trackEvent(analyticsEvents.pxAddedToDeal, { stockId: vehicle.stockId });
      if (nextEquity > 0) {
        trackEvent(analyticsEvents.pxEquityAdded, { stockId: vehicle.stockId });
      }
    },
    [vehicle.stockId],
  );

  const startValuation = useCallback(
    (registration: string, mileage: number) => {
      trackEvent(analyticsEvents.pxStarted, { stockId: vehicle.stockId });
      const value = getMockValuation(registration, mileage);
      setPx({ registration, mileage, value });
      trackEvent(analyticsEvents.pxValuationCompleted, { stockId: vehicle.stockId });
    },
    [vehicle.stockId],
  );

  const setSettlement = useCallback(
    (value?: number) => {
      setPx((current) => {
        if (!current) {
          return current;
        }
        const next = { ...current, settlement: value };
        const nextEquity = next.value - (value ?? 0);
        if (nextEquity > 0) {
          trackEvent(analyticsEvents.pxEquityAdded, { stockId: vehicle.stockId });
        }
        return next;
      });
    },
    [vehicle.stockId],
  );

  const clearPartExchange = useCallback(() => {
    setPx(undefined);
  }, []);

  const value = useMemo(
    () => ({
      vehicle,
      financeType,
      deposit: cashDeposit,
      term: finance.term,
      termOptions: TERM_OPTIONS,
      displayState,
      gapAmount,
      monthlyPayment: illustration.monthlyPayment,
      totalPayable: illustration.totalPayable,
      amountFinanced: illustration.amountFinanced,
      cashPrice: vehicle.cashPrice,
      px,
      equity,
      extraDeposit,
      negativeEquity,
      reservable: isReservable(vehicle),
      setFinanceType,
      adjustDeposit,
      setDepositValue,
      setTermValue,
      applyPartExchange,
      startValuation,
      setSettlement,
      clearPartExchange,
      maxDeposit,
      depositStep: DEPOSIT_STEP,
    }),
    [
      vehicle,
      financeType,
      cashDeposit,
      finance.term,
      displayState,
      gapAmount,
      illustration,
      px,
      equity,
      extraDeposit,
      negativeEquity,
      setFinanceType,
      adjustDeposit,
      setDepositValue,
      setTermValue,
      applyPartExchange,
      startValuation,
      setSettlement,
      clearPartExchange,
      maxDeposit,
    ],
  );

  return (
    <VehicleDealContext.Provider value={value}>
      {children}
    </VehicleDealContext.Provider>
  );
}

export function useVehicleDeal() {
  const context = useContext(VehicleDealContext);
  if (!context) {
    throw new Error("useVehicleDeal must be used within VehicleDealProvider");
  }
  return context;
}
