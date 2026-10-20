"use server";

import { cookies } from "next/headers";
import { withSessionPersistence } from "@/lib/session/persist";
import { getDealRecord, isDealExpired, touchDeal } from "@/features/deal/store";
import {
  hydrateDealsFromCookie,
  persistDeal,
  readDealCookieId,
} from "@/features/deal/session";
import {
  getOrCreatePxSession,
  getPxSession,
} from "@/features/part-exchange/session";
import {
  createPxOpaqueId,
  emptySnapshot,
  isPxExpired,
  recordPxLead,
  snapshotToDealPx,
  touchPxRecord,
} from "@/features/part-exchange/store";
import { getUsedCarsUrl, getVehicleUrl } from "@/config/routes";
import { lookupPartExchangeVehicle } from "@/lib/part-exchange/lookup";
import { LAST_VIEWED_STOCK_COOKIE } from "@/lib/vehicles/last-viewed";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { calculatePxEquity } from "@/lib/part-exchange/equity";
import { valuePartExchangeVehicle } from "@/lib/part-exchange/valuation";
import {
  isValidUkRegistration,
  mileageError,
  normaliseRegistration,
  parsePounds,
  settlementError,
} from "@/lib/part-exchange/validation";
import type { DealPartExchangeInput } from "@/types/deal";
import type {
  PartExchange,
  PxIdentifiedVehicle,
  PxLookupResult,
  PxSource,
  PxStep,
  PxValueResult,
} from "@/types/part-exchange";

export interface PxUiState {
  snapshot: PartExchange;
  step: PxStep;
  expired: boolean;
  dealId?: string;
}

function toIso(now: number): string {
  return new Date(now).toISOString();
}

function withEquity(snapshot: PartExchange): PartExchange {
  if (snapshot.estimatedValue === undefined) {
    return { ...snapshot, equityType: "unknown" };
  }
  if (snapshot.financeOutstanding === undefined) {
    return { ...snapshot, equityType: "unknown" };
  }
  const figures = calculatePxEquity(
    snapshot.estimatedValue,
    snapshot.financeOutstanding ? snapshot.settlementFigure : 0,
  );
  return {
    ...snapshot,
    equity: figures.equity,
    shortfall: figures.shortfall,
    equityType: figures.equityType,
  };
}

export const getPxUiState = withSessionPersistence(async function getPxUiState(): Promise<PxUiState | { empty: true }> {
  const record = await getPxSession();
  if (!record) {
    return { empty: true };
  }
  return {
    snapshot: record.snapshot,
    step: record.step,
    expired: isPxExpired(record),
    dealId: record.dealId,
  };
});

export const getActiveDealForPx = withSessionPersistence(async function getActiveDealForPx(): Promise<
  { ok: true; dealId: string } | { ok: false }
> {
  const dealId = await readDealCookieId();
  if (!dealId) {
    return { ok: false };
  }
  await hydrateDealsFromCookie();
  const record = getDealRecord(dealId);
  if (!record || isDealExpired(record)) {
    return { ok: false };
  }
  return { ok: true, dealId: record.id };
});

export const startPxSession = withSessionPersistence(async function startPxSession(source: PxSource): Promise<{ ok: true }> {
  await getOrCreatePxSession(source);
  return { ok: true };
});

export const lookupPxRegistration = withSessionPersistence(async function lookupPxRegistration(input: {
  registration: string;
  source: PxSource;
}): Promise<PxLookupResult> {
  const session = await getOrCreatePxSession(input.source);
  const cleaned = normaliseRegistration(input.registration);
  if (!isValidUkRegistration(cleaned)) {
    return {
      ok: false,
      reason: "not_found",
      message: "Enter a valid UK registration.",
    };
  }

  const result = lookupPartExchangeVehicle(cleaned);
  const snapshot: PartExchange = {
    ...session.snapshot,
    registration: cleaned,
    vehicle: result.ok ? result.vehicle : undefined,
    valuationStatus: result.ok
      ? "idle"
      : result.reason === "not_found"
        ? "not_found"
        : result.reason === "ineligible"
          ? "ineligible"
          : "unavailable",
    source: input.source,
    status: result.ok ? "identified" : "started",
  };

  touchPxRecord(session.id, {
    source: input.source,
    step: result.ok ? "vehicle" : "registration",
    snapshot,
  });

  return result;
});

export const savePxVehicle = withSessionPersistence(async function savePxVehicle(input: {
  vehicle: PxIdentifiedVehicle;
  source: PxSource;
}): Promise<{ ok: true }> {
  const session = await getOrCreatePxSession(input.source);
  touchPxRecord(session.id, {
    step: "mileage",
    snapshot: {
      ...session.snapshot,
      vehicle: input.vehicle,
      status: "identified",
    },
  });
  return { ok: true };
});

export const valuePxVehicle = withSessionPersistence(async function valuePxVehicle(input: {
  registration: string;
  mileage: number;
  vehicle?: PxIdentifiedVehicle;
  source: PxSource;
}): Promise<PxValueResult> {
  const session = await getOrCreatePxSession(input.source);
  const mileageIssue = mileageError(String(input.mileage));
  if (mileageIssue) {
    return {
      ok: false,
      reason: "unavailable",
      message: mileageIssue,
    };
  }

  const now = Date.now();
  const result = valuePartExchangeVehicle({
    registration: input.registration,
    mileage: input.mileage,
    valuationDate: toIso(now),
  });

  if (!result.ok) {
    touchPxRecord(
      session.id,
      {
        step: "mileage",
        snapshot: {
          ...session.snapshot,
          registration: normaliseRegistration(input.registration),
          mileage: input.mileage,
          vehicle: input.vehicle ?? session.snapshot.vehicle,
          valuationStatus:
            result.reason === "ineligible" ? "ineligible" : "unavailable",
          source: input.source,
        },
      },
      now,
    );
    return result;
  }

  const snapshot = withEquity({
    ...session.snapshot,
    registration: normaliseRegistration(input.registration),
    mileage: input.mileage,
    vehicle: input.vehicle ?? session.snapshot.vehicle,
    estimatedValue: result.valuation.estimatedValue,
    valuationStatus: "valued",
    valuationDate: result.valuation.valuationDate,
    deductions: result.valuation.deductions,
    source: input.source,
    status: "valued",
    equityType: "unknown",
  });

  touchPxRecord(
    session.id,
    {
      step: "valuation",
      snapshot,
    },
    now,
  );

  return result;
});

export const savePxSettlement = withSessionPersistence(async function savePxSettlement(input: {
  financeOutstanding: boolean;
  settlementFigure?: string;
  source: PxSource;
}): Promise<
  | { ok: true; snapshot: PartExchange }
  | { ok: false; message: string }
> {
  const session = await getOrCreatePxSession(input.source);
  if (isPxExpired(session)) {
    return { ok: false, message: "Your part-exchange session has expired." };
  }

  let settlementFigure: number | undefined;
  if (input.financeOutstanding) {
    const error = settlementError(input.settlementFigure ?? "");
    if (error) {
      return { ok: false, message: error };
    }
    settlementFigure = parsePounds(input.settlementFigure ?? "");
  } else {
    settlementFigure = 0;
  }

  const snapshot = withEquity({
    ...session.snapshot,
    financeOutstanding: input.financeOutstanding,
    settlementFigure,
    status: "ready",
  });

  touchPxRecord(session.id, {
    step: "result",
    snapshot,
  });

  return { ok: true, snapshot };
});

export const savePxProgress = withSessionPersistence(async function savePxProgress(input: {
  snapshot: PartExchange;
  step: PxStep;
  source: PxSource;
}): Promise<{ ok: true } | { ok: false; expired: true }> {
  const session = await getOrCreatePxSession(input.source);
  if (isPxExpired(session)) {
    return { ok: false, expired: true };
  }
  touchPxRecord(session.id, {
    step: input.step,
    snapshot: input.snapshot,
    source: input.source,
  });
  return { ok: true };
});

export const applyPxToDealAction = withSessionPersistence(async function applyPxToDealAction(input: {
  dealId?: string;
  px?: DealPartExchangeInput;
  source: PxSource;
  consideredStockId?: string;
}): Promise<
  | { ok: true; dealId: string; px: DealPartExchangeInput }
  | { ok: false; reason: "no_deal" | "expired" | "incomplete"; href?: string }
> {
  const session = await getPxSession();
  const fromSession = session ? snapshotToDealPx(session.snapshot) : undefined;
  const px = input.px ?? fromSession;
  if (!px) {
    return { ok: false, reason: "incomplete" };
  }

  const dealId = input.dealId ?? (await readDealCookieId());
  if (!dealId) {
    if (session) {
      touchPxRecord(session.id, {
        consideredStockId: input.consideredStockId,
        snapshot: { ...session.snapshot, status: "ready" },
      });
    }
    const jar = await cookies();
    const lastViewed = jar.get(LAST_VIEWED_STOCK_COOKIE)?.value;
    const stockId =
      input.consideredStockId ||
      session?.consideredStockId ||
      (lastViewed ? decodeURIComponent(lastViewed) : undefined);
    const vehicle = stockId ? findVehicleByStockId(stockId) : undefined;
    return {
      ok: false,
      reason: "no_deal",
      href: vehicle ? getVehicleUrl(vehicle) : getUsedCarsUrl(),
    };
  }

  await hydrateDealsFromCookie();
  const deal = getDealRecord(dealId);
  if (!deal || isDealExpired(deal)) {
    return { ok: false, reason: "expired" };
  }

  await persistDeal(touchDeal(dealId, { px }));
  if (session) {
    touchPxRecord(session.id, {
      dealId,
      consideredStockId: input.consideredStockId ?? deal.vehicleStockId,
      snapshot: { ...session.snapshot, status: "applied" },
    });
    recordPxLead({
      id: createPxOpaqueId(),
      source: input.source,
      dealId,
      vehicleStockId: input.consideredStockId ?? deal.vehicleStockId,
      requestedAction: "part-exchange",
      context: {
        registration: px.registration,
        mileage: px.mileage,
        estimatedValue: px.value,
        settlementFigure: px.settlement,
        equityType: session.snapshot.equityType,
        journeyStage: "px_applied",
        customerIntent: "part-exchange",
        location: session.locationSlug,
      },
    });
  }

  return { ok: true, dealId, px };
});

export const clearPxSessionAction = withSessionPersistence(async function clearPxSessionAction(): Promise<{ ok: true }> {
  const session = await getPxSession();
  if (session) {
    touchPxRecord(session.id, {
      step: "intro",
      snapshot: emptySnapshot(session.source),
      dealId: undefined,
    });
  }
  return { ok: true };
});

export const recordPxCompletionLead = withSessionPersistence(async function recordPxCompletionLead(input: {
  source: PxSource;
  consideredStockId?: string;
}): Promise<{ ok: true }> {
  const session = await getPxSession();
  if (!session || session.snapshot.estimatedValue === undefined) {
    return { ok: true };
  }

  recordPxLead({
    id: createPxOpaqueId(),
    source: input.source,
    dealId: session.dealId,
    vehicleStockId: input.consideredStockId ?? session.consideredStockId,
    requestedAction: "part-exchange",
    context: {
      registration: session.snapshot.registration,
      mileage: session.snapshot.mileage,
      estimatedValue: session.snapshot.estimatedValue,
      settlementFigure: session.snapshot.settlementFigure,
      equity: session.snapshot.equity,
      shortfall: session.snapshot.shortfall,
      equityType: session.snapshot.equityType,
      journeyStage: session.snapshot.status,
      customerIntent: "part-exchange",
    },
  });
  return { ok: true };
});
