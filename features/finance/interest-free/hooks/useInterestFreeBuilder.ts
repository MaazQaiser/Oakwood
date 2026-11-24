"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_PCP_MILEAGE,
  DEFAULT_ZERO_TERM,
  TERM_STOPS,
  type TermStop,
} from "@/lib/finance/interest-free/constants";
import {
  buildComparison,
  buildDeal,
  minCashDeposit,
  qualifiesAtDeposit,
  type InterestFreePxInput,
} from "@/lib/finance/interest-free/deal";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import type { DealPartExchangeInput } from "@/types/deal";

function pxFromDeal(
  px?: DealPartExchangeInput | null,
): InterestFreePxInput | null {
  if (!px) return null;
  return {
    value: px.value,
    settlement: px.settlement ?? px.outstandingFinanceAmount ?? 0,
  };
}

export function useInterestFreeBuilder(cars: InterestFreeStockCar[], initialStockId: string | null) {
  const initialCar =
    cars.find((c) => c.stockId === initialStockId) ?? cars[0] ?? null;

  const [stockId, setStockId] = useState(initialCar?.stockId ?? "");
  const [cashDeposit, setCashDeposit] = useState(() =>
    initialCar ? minCashDeposit(initialCar) : 0,
  );
  const [term, setTerm] = useState<TermStop>(DEFAULT_ZERO_TERM);
  const [px, setPx] = useState<DealPartExchangeInput | undefined>();
  const [annualMiles, setAnnualMiles] = useState(DEFAULT_PCP_MILEAGE);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const vehicle = useMemo(
    () => cars.find((c) => c.stockId === stockId) ?? cars[0] ?? null,
    [cars, stockId],
  );

  const pxInput = useMemo(() => pxFromDeal(px), [px]);

  const deal = useMemo(() => {
    if (!vehicle) return null;
    return buildDeal({
      vehicle,
      cashDeposit,
      px: pxInput,
      term,
    });
  }, [vehicle, cashDeposit, pxInput, term]);

  const comparison = useMemo(() => {
    if (!vehicle) return [];
    return buildComparison({
      vehicle,
      cashDeposit,
      px: pxInput,
      term,
      annualMiles,
    });
  }, [vehicle, cashDeposit, pxInput, term, annualMiles]);

  const qualifying = useMemo(() => {
    if (!deal) return [];
    return cars
      .filter((c) => qualifiesAtDeposit(c, deal.deposit))
      .sort((a, b) => b.cashPrice - a.cashPrice);
  }, [cars, deal]);

  function selectCar(id: string) {
    setStockId(id);
    // Deposit persists across car changes per the notes.
  }

  function setTermStop(next: number) {
    const stop = (TERM_STOPS as readonly number[]).includes(next)
      ? (next as TermStop)
      : DEFAULT_ZERO_TERM;
    setTerm(stop);
  }

  function resetToMinDeposit() {
    if (!vehicle) return;
    setCashDeposit(minCashDeposit(vehicle, pxInput));
  }

  function addToDeposit(amount: number) {
    setCashDeposit((d) => Math.ceil((d + amount) / 100) * 100);
  }

  return {
    vehicle,
    cashDeposit,
    setCashDeposit,
    term,
    setTermStop,
    px,
    setPx,
    clearPx: () => setPx(undefined),
    pxInput,
    annualMiles,
    setAnnualMiles,
    deal,
    comparison,
    qualifying,
    pickerOpen,
    setPickerOpen,
    applyOpen,
    setApplyOpen,
    selectCar,
    resetToMinDeposit,
    addToDeposit,
    cars,
  };
}

export type InterestFreeBuilder = ReturnType<typeof useInterestFreeBuilder>;
