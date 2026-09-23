import { cookies } from "next/headers";
import {
  DEAL_SESSION_COOKIE,
  DEAL_SESSION_TTL_MS,
  createDealOpaqueId,
  createDealRecord,
  getDealRecord,
  isDealExpired,
  type DealSessionRecord,
} from "@/features/deal/store";
import type { DealDraft } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

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
  const record = getDealRecord(id);
  if (!record || isDealExpired(record)) {
    return null;
  }
  return record;
}

export async function getDealSession(
  dealId: string,
): Promise<DealSessionRecord | null> {
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
  return record;
}
