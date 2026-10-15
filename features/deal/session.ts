import { cookies } from "next/headers";
import {
  DEAL_SESSION_COOKIE,
  DEAL_SESSION_TTL_MS,
  createDealOpaqueId,
  createDealRecord,
  getDealRecord,
  isDealExpired,
  restoreDealRecord,
  type DealSessionRecord,
} from "@/features/deal/store";
import { readStateCookie, writeStateCookie } from "@/lib/session/state-cookie";
import type { DealDraft } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

/**
 * Copy of the visitor's recent deals, so any server instance can rebuild them.
 * The in-memory store alone loses deals on a cold start or when a hard refresh
 * reaches a different instance. Resume/share tokens stay server-only.
 */
const DEAL_STATE_COOKIE = "oakwood_deal_state";
const MAX_PERSISTED_DEALS = 3;

function isPersistedDeal(value: unknown): value is DealSessionRecord {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    record.id.length <= 64 &&
    typeof record.vehicleStockId === "string" &&
    (record.financeType === "hp" || record.financeType === "pcp") &&
    typeof record.createdAt === "number" &&
    typeof record.updatedAt === "number" &&
    typeof record.expiresAt === "number" &&
    typeof record.cashDeposit === "number" &&
    typeof record.term === "number" &&
    Array.isArray(record.productIds)
  );
}

async function readPersistedDeals(): Promise<DealSessionRecord[]> {
  const saved = await readStateCookie(DEAL_STATE_COOKIE);
  return Array.isArray(saved) ? saved.filter(isPersistedDeal) : [];
}

/** Load the visitor's persisted deals into the store. Safe during RSC render. */
export async function hydrateDealsFromCookie(): Promise<void> {
  for (const record of await readPersistedDeals()) {
    restoreDealRecord(record);
  }
}

/** Save a deal to the state cookie. Server Functions / Route Handlers only. */
export async function persistDeal(
  record: DealSessionRecord | null,
): Promise<void> {
  if (!record) {
    return;
  }
  const now = Date.now();
  const others = (await readPersistedDeals()).filter(
    (item) => item.id !== record.id && !isDealExpired(item, now),
  );
  const next = [
    { ...record, resume: undefined, share: undefined },
    ...others,
  ].slice(0, MAX_PERSISTED_DEALS);
  await writeStateCookie(DEAL_STATE_COOKIE, next, DEAL_SESSION_TTL_MS);
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(DEAL_SESSION_TTL_MS / 1000),
  };
}

export { createDealOpaqueId };

export async function writeDealCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set(DEAL_SESSION_COOKIE, id, cookieOptions());
}

export async function readDealCookieId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(DEAL_SESSION_COOKIE)?.value;
}

export async function getBoundDeal(): Promise<DealSessionRecord | null> {
  const id = await readDealCookieId();
  if (!id) {
    return null;
  }
  await hydrateDealsFromCookie();
  const record = getDealRecord(id);
  if (!record || isDealExpired(record)) {
    return null;
  }
  return record;
}

export async function getDealSession(
  dealId: string,
): Promise<DealSessionRecord | null> {
  await hydrateDealsFromCookie();
  const record = getDealRecord(dealId);
  if (!record || isDealExpired(record)) {
    return record;
  }
  return record;
}

export async function createBoundDeal(input: {
  vehicleStockId: string;
  cashDeposit: number;
  term: number;
  financeType?: FinanceProductType;
  annualMileage?: number;
  px?: DealDraft["px"];
}): Promise<DealSessionRecord> {
  const id = createDealOpaqueId();
  const record = createDealRecord({
    id,
    vehicleStockId: input.vehicleStockId,
    cashDeposit: input.cashDeposit,
    term: input.term,
    financeType: input.financeType,
    annualMileage: input.annualMileage,
    px: input.px,
  });
  await writeDealCookie(id);
  await persistDeal(record);
  return record;
}
