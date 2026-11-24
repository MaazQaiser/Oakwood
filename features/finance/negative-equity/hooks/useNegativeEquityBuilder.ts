"use client";

import { useCallback, useMemo, useState } from "react";
import {
  COVER_PRODUCTS,
  type QuoteProduct,
} from "@/lib/finance/negative-equity/constants";
import {
  EMPTY_COVER,
  coverTotal,
  priceCoverItem,
  type CoverSelection,
} from "@/lib/finance/negative-equity/cover";
import {
  blockedBody,
  offeredFixes,
  type SuggestedFix,
} from "@/lib/finance/negative-equity/fixes";
import {
  countFittingCars,
  equityFrom,
  quoteFor,
  type EquityBreakdown,
  type NegEquityVehicle,
  type QuoteResult,
} from "@/lib/finance/negative-equity/quote";
import type { NegEquityStockCar } from "@/features/finance/negative-equity/types";

export type CaptureKind =
  | ""
  | "soft"
  | "apply"
  | "save"
  | "callback"
  | "human"
  | "book"
  | "done";

export interface BuilderState {
  carId: string | null;
  valuation: number;
  settlement: number;
  deposit: number;
  product: QuoteProduct;
  cover: CoverSelection;
  ownFigures: boolean;
  pickerOpen: boolean;
  onlyFit: boolean;
  capture: CaptureKind;
  estimatorOpen: boolean;
}

const DEFAULT_VALUATION = 8_000;
const DEFAULT_SETTLEMENT = 11_500;
const DEFAULT_DEPOSIT = 500;

export function useNegativeEquityBuilder(cars: NegEquityStockCar[], initialStockId: string | null) {
  const [carId, setCarId] = useState<string | null>(initialStockId);
  const [valuation, setValuation] = useState(DEFAULT_VALUATION);
  const [settlement, setSettlement] = useState(DEFAULT_SETTLEMENT);
  const [deposit, setDeposit] = useState(DEFAULT_DEPOSIT);
  const [product, setProduct] = useState<QuoteProduct>("hp");
  const [cover, setCover] = useState<CoverSelection>(EMPTY_COVER);
  const [ownFigures, setOwnFigures] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [onlyFit, setOnlyFit] = useState(false);
  const [capture, setCapture] = useState<CaptureKind>("");
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [reg, setReg] = useState("");
  const [mileage, setMileage] = useState("");

  const vehicle = useMemo(
    () => cars.find((c) => c.id === carId) ?? cars[0] ?? null,
    [cars, carId],
  );

  const equity: EquityBreakdown = useMemo(
    () => equityFrom({ valuation, settlement }),
    [valuation, settlement],
  );

  const coverForCar = useCallback(
    (car: NegEquityVehicle) => coverTotal(car, cover),
    [cover],
  );

  const coverAmount = vehicle ? coverForCar(vehicle) : 0;

  const quote: QuoteResult | null = useMemo(() => {
    if (!vehicle) return null;
    return quoteFor(vehicle, product, coverAmount, deposit, equity);
  }, [vehicle, product, coverAmount, deposit, equity]);

  const fitCount = useMemo(
    () => countFittingCars(cars, product, coverForCar, deposit, equity),
    [cars, product, coverForCar, deposit, equity],
  );

  const fixes: SuggestedFix[] = useMemo(() => {
    if (!quote || !vehicle) return [];
    return offeredFixes(
      quote,
      cars,
      coverAmount,
      deposit,
      equity,
      coverForCar,
    );
  }, [quote, vehicle, cars, coverAmount, deposit, equity, coverForCar]);

  const blockedParagraphs = useMemo(
    () => (quote && !quote.ok ? blockedBody(quote) : []),
    [quote],
  );

  function toggleCover(id: keyof CoverSelection) {
    setCover((prev) => {
      const next = { ...prev };
      if (next[id]) {
        next[id] = 0;
      } else {
        next[id] = id === "g" ? 1 : 3;
      }
      return next;
    });
  }

  function setCoverYears(id: keyof CoverSelection, years: 1 | 2 | 3) {
    setCover((prev) => ({ ...prev, [id]: years }));
  }

  function applyValuationFromForm() {
    const miles = Number(mileage.replace(/[^\d]/g, "")) || 0;
    if (!reg.trim() || !miles) return;
    // Illustrative valuation until the live PX feed is wired.
    const rough = Math.max(500, Math.round((11_500 - miles / 11) / 50) * 50);
    setValuation(rough);
    setOwnFigures(true);
  }

  function applyFix(fix: SuggestedFix) {
    if (fix.kind === "deposit" && fix.deposit != null) {
      setDeposit(fix.deposit);
      return;
    }
    if (fix.kind === "remove-cover") {
      setCover(EMPTY_COVER);
      return;
    }
    if (fix.kind === "switch-car" && fix.stockId) {
      setCarId(fix.stockId);
      return;
    }
    if (fix.kind === "switch-hp") {
      setProduct("hp");
      return;
    }
    if (fix.kind === "human") {
      setCapture("human");
    }
  }

  const coverRows = useMemo(() => {
    if (!vehicle) return [];
    return COVER_PRODUCTS.map((productDef) => {
      const years = cover[productDef.id] || 0;
      const price = years
        ? priceCoverItem(vehicle, productDef.id, years)
        : priceCoverItem(vehicle, productDef.id, productDef.hasTerm ? 3 : 1);
      return {
        ...productDef,
        enabled: years > 0,
        years: years || 3,
        price,
      };
    });
  }, [vehicle, cover]);

  return {
    cars,
    vehicle,
    equity,
    quote,
    fitCount,
    fixes,
    blockedParagraphs,
    coverRows,
    coverAmount,
    cover,
    product,
    deposit,
    ownFigures,
    pickerOpen,
    onlyFit,
    capture,
    estimatorOpen,
    reg,
    mileage,
    valuation,
    settlement,
    setReg,
    setMileage,
    setValuation,
    setSettlement,
    setDeposit,
    setProduct,
    setPickerOpen,
    setOnlyFit,
    setCapture,
    setEstimatorOpen,
    setOwnFigures,
    setCarId,
    toggleCover,
    setCoverYears,
    applyValuationFromForm,
    applyFix,
    coverForCar,
    monthlyFor: (car: NegEquityVehicle) => {
      const q = quoteFor(car, product, coverForCar(car), deposit, equity);
      return {
        monthly: q.monthlyTotal,
        ok: q.ok,
        reason: q.reason,
        term: q.term,
      };
    },
  };
}
