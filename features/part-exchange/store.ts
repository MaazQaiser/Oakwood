import { randomBytes } from "crypto";
import { calculatePxEquity } from "@/lib/part-exchange/equity";
import type { DealPartExchangeInput } from "@/types/deal";
import type { Lead } from "@/types/lead";
import type {
  PartExchange,
  PxIdentifiedVehicle,
  PxSource,
  PxStep,
} from "@/types/part-exchange";

export const PX_SESSION_COOKIE = "oakwood_px_session";
export const PX_SESSION_TTL_MS = 4 * 60 * 60 * 1000;

export interface PxSessionRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  source: PxSource;
  step: PxStep;
  snapshot: PartExchange;
  consideredStockId?: string;
  dealId?: string;
  locationSlug?: string;
}

const sessions = new Map<string, PxSessionRecord>();
const leads = new Map<string, Lead & { context?: Record<string, unknown> }>();

export function createPxOpaqueId(): string {
  return randomBytes(16).toString("hex");
}

function isFresh(record: PxSessionRecord, now: number): boolean {
  return record.expiresAt > now;
}

export function isPxExpired(record: PxSessionRecord, now = Date.now()): boolean {
  return record.expiresAt <= now;
}

export function emptySnapshot(source: PxSource): PartExchange {
  return {
    valuationStatus: "idle",
    equityType: "unknown",
    source,
    status: "started",
  };
}

export function createPxRecord(
  id: string,
  source: PxSource,
  now = Date.now(),
): PxSessionRecord {
  const record: PxSessionRecord = {
    id,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + PX_SESSION_TTL_MS,
    source,
    step: source === "standalone" ? "intro" : "registration",
    snapshot: emptySnapshot(source),
  };
  sessions.set(id, record);
  return record;
}

export function getPxRecord(
  id: string,
  now = Date.now(),
): PxSessionRecord | null {
  const record = sessions.get(id);
  if (!record) {
    return null;
  }
  if (!isFresh(record, now)) {
    return { ...record };
  }
  return record;
}

export function touchPxRecord(
  id: string,
  patch: Partial<Omit<PxSessionRecord, "id" | "createdAt">>,
  now = Date.now(),
): PxSessionRecord | null {
  const current = sessions.get(id);
  if (!current) {
    return null;
  }
  const next: PxSessionRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: now,
    expiresAt: now + PX_SESSION_TTL_MS,
  };
  sessions.set(id, next);
  return next;
}

export function snapshotToDealPx(
  snapshot: PartExchange,
): DealPartExchangeInput | undefined {
  if (
    !snapshot.registration ||
    snapshot.mileage === undefined ||
    snapshot.estimatedValue === undefined
  ) {
    return undefined;
  }

  return {
    registration: snapshot.registration,
    mileage: snapshot.mileage,
    value: snapshot.estimatedValue,
    settlement: snapshot.settlementFigure,
    vehicle: snapshot.vehicle
      ? {
          year: snapshot.vehicle.year,
          make: snapshot.vehicle.make,
          model: snapshot.vehicle.model,
          variant: snapshot.vehicle.variant,
          fuelType: snapshot.vehicle.fuelType,
          transmission: snapshot.vehicle.transmission,
        }
      : undefined,
    financeOutstanding: snapshot.financeOutstanding,
    valuationDate: snapshot.valuationDate,
  };
}

export function dealPxToSnapshot(
  input: DealPartExchangeInput,
  source: PxSource,
): PartExchange {
  const figures = calculatePxEquity(input.value, input.settlement);
  const vehicle: PxIdentifiedVehicle | undefined = input.vehicle
    ? { ...input.vehicle, source: "lookup" }
    : undefined;

  return {
    registration: input.registration,
    vehicle,
    mileage: input.mileage,
    estimatedValue: input.value,
    valuationStatus: "valued",
    settlementFigure: input.settlement,
    financeOutstanding: input.financeOutstanding ?? input.settlement !== undefined,
    equity: figures.equity,
    shortfall: figures.shortfall,
    equityType: input.settlement === undefined && !input.financeOutstanding
      ? "unknown"
      : figures.equityType,
    valuationDate: input.valuationDate,
    source,
    status: "valued",
  };
}

export function recordPxLead(input: {
  id: string;
  source?: string;
  dealId?: string;
  vehicleStockId?: string;
  requestedAction?: string;
  context?: Record<string, unknown>;
}): void {
  leads.set(input.id, {
    id: input.id,
    identity: {},
    source: {
      source: input.source,
      sessionIdentifier: input.id,
    },
    dealId: input.dealId,
    vehicleStockId: input.vehicleStockId,
    requestedAction: input.requestedAction,
    context: input.context,
  });
}

export function getPxLead(id: string) {
  return leads.get(id) ?? null;
}
