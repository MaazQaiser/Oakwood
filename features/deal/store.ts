import { randomBytes } from "crypto";
import { mockDealId } from "@/lib/mock/data";
import {
  RECOMMENDED_COVER_IDS,
  defaultCoverYears,
} from "@/lib/deal/products";
import type { DealCreditTier, DealDraft, DealShareSnapshot } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

export const DEAL_SESSION_COOKIE = "oakwood_deal_session";
export const DEAL_SESSION_TTL_MS = 4 * 60 * 60 * 1000;
/** Resume deep-links remain valid for seven days (Deal Builder v4). */
export const DEAL_RESUME_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const DEAL_SHARE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface DealSessionRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  vehicleStockId: string;
  financeType: FinanceProductType;
  cashDeposit: number;
  term: number;
  annualMileage?: number;
  px?: DealDraft["px"];
  productIds: string[];
  productYears?: DealDraft["productYears"];
  creditTier?: DealCreditTier;
  decision?: DealDraft["decision"];
  financeApplication?: DealDraft["financeApplication"];
  stepsCompleted?: DealDraft["stepsCompleted"];
  email?: string;
  resume?: {
    token: string;
    email: string;
    /** Optional mobile for mock SMS resume — never sent externally in prototype. */
    phone?: string;
    expiresAt: number;
    used: boolean;
  };
  share?: {
    token: string;
    expiresAt: number;
    snapshot: DealShareSnapshot;
  };
}

const deals = new Map<string, DealSessionRecord>();
const resumeIndex = new Map<string, string>();
const shareIndex = new Map<string, string>();

export function createDealOpaqueId(): string {
  return randomBytes(16).toString("hex");
}

function isFresh(record: DealSessionRecord, now: number): boolean {
  return record.expiresAt > now;
}

export function createDealRecord(
  input: {
    id: string;
    vehicleStockId: string;
    cashDeposit: number;
    term: number;
    financeType?: FinanceProductType;
    annualMileage?: number;
    px?: DealDraft["px"];
  },
  now = Date.now(),
): DealSessionRecord {
  const record: DealSessionRecord = {
    id: input.id,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + DEAL_SESSION_TTL_MS,
    vehicleStockId: input.vehicleStockId,
    financeType: input.financeType ?? "hp",
    cashDeposit: input.cashDeposit,
    term: input.term,
    annualMileage: input.annualMileage,
    px: input.px,
    // Spec: all cover pre-ticked at Oakwood defaults (pending compliance sign-off).
    productIds: [...RECOMMENDED_COVER_IDS],
    productYears: defaultCoverYears(input.term),
  };
  deals.set(input.id, record);
  return record;
}

export function getDealRecord(
  id: string,
  now = Date.now(),
): DealSessionRecord | null {
  const record = deals.get(id);
  if (!record) {
    return null;
  }
  if (!isFresh(record, now)) {
    return { ...record };
  }
  return record;
}

/**
 * Re-seed the in-memory store from a persisted copy (the deal state cookie).
 * Serverless instances don't share memory, so a request can land on an
 * instance that has never seen this deal, or holds an older copy of it.
 */
export function restoreDealRecord(record: DealSessionRecord): void {
  const current = deals.get(record.id);
  if (current && current.updatedAt >= record.updatedAt) {
    return;
  }
  deals.set(record.id, {
    ...record,
    resume: current?.resume,
    share: current?.share,
  });
}

export function isDealExpired(record: DealSessionRecord, now = Date.now()): boolean {
  return record.expiresAt <= now;
}

export function touchDeal(
  id: string,
  patch: Partial<Omit<DealSessionRecord, "id" | "createdAt">>,
  now = Date.now(),
): DealSessionRecord | null {
  const current = deals.get(id);
  if (!current) {
    return null;
  }
  const next: DealSessionRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: now,
    expiresAt: now + DEAL_SESSION_TTL_MS,
  };
  deals.set(id, next);
  return next;
}

export function saveDealResumeToken(
  dealId: string,
  token: string,
  email: string,
  phone?: string,
  now = Date.now(),
): DealSessionRecord | null {
  const current = deals.get(dealId);
  if (!current || isDealExpired(current, now)) {
    return null;
  }
  if (current.resume?.token) {
    resumeIndex.delete(current.resume.token);
  }
  const normalisedPhone = phone?.replace(/\D/g, "") || undefined;
  const record = touchDeal(
    dealId,
    {
      email,
      resume: {
        token,
        email: email.trim().toLowerCase(),
        phone: normalisedPhone,
        expiresAt: now + DEAL_RESUME_TTL_MS,
        used: false,
      },
    },
    now,
  );
  resumeIndex.set(token, dealId);
  return record;
}

/** Prototype-only: force an already-expired resume token for QA of the expired state. */
export function saveExpiredDealResumeToken(
  dealId: string,
  token: string,
  email: string,
  now = Date.now(),
): DealSessionRecord | null {
  const current = deals.get(dealId);
  if (!current) {
    return null;
  }
  if (current.resume?.token) {
    resumeIndex.delete(current.resume.token);
  }
  const record = touchDeal(
    dealId,
    {
      email,
      resume: {
        token,
        email: email.trim().toLowerCase(),
        expiresAt: now - 1,
        used: false,
      },
    },
    now,
  );
  resumeIndex.set(token, dealId);
  return record;
}

export function peekDealResumeToken(token: string): {
  status: "ok" | "expired" | "invalid" | "used";
  dealId?: string;
  email?: string;
} {
  const dealId = resumeIndex.get(token);
  if (!dealId) {
    // Special mock token for expired-link demos without a live session.
    if (token === "mock-expired") {
      return { status: "expired" };
    }
    return { status: "invalid" };
  }
  const record = deals.get(dealId);
  if (!record?.resume) {
    return { status: "invalid" };
  }
  if (record.resume.used) {
    return { status: "used", dealId, email: record.resume.email };
  }
  if (record.resume.expiresAt <= Date.now()) {
    return { status: "expired", dealId, email: record.resume.email };
  }
  return { status: "ok", dealId, email: record.resume.email };
}

export function consumeDealResumeToken(
  token: string,
  email: string,
  now = Date.now(),
): DealSessionRecord | null {
  const dealId = resumeIndex.get(token);
  if (!dealId) {
    return null;
  }
  const record = deals.get(dealId);
  if (!record?.resume) {
    return null;
  }
  if (record.resume.used || record.resume.expiresAt <= now) {
    return null;
  }
  if (record.resume.email !== email.trim().toLowerCase()) {
    return null;
  }
  const next = touchDeal(
    dealId,
    { resume: { ...record.resume, used: true } },
    now,
  );
  // Keep the token so a second visit can ask for the email again.
  return next;
}

export function findDealByResumeToken(token: string): DealSessionRecord | null {
  const dealId = resumeIndex.get(token);
  return dealId ? deals.get(dealId) ?? null : null;
}

export function saveDealShareToken(
  dealId: string,
  token: string,
  snapshot: DealShareSnapshot,
  now = Date.now(),
): DealSessionRecord | null {
  const current = deals.get(dealId);
  if (!current || isDealExpired(current, now)) {
    return null;
  }
  if (current.share?.token) {
    shareIndex.delete(current.share.token);
  }
  const record = touchDeal(
    dealId,
    {
      share: {
        token,
        expiresAt: now + DEAL_SHARE_TTL_MS,
        snapshot,
      },
    },
    now,
  );
  shareIndex.set(token, dealId);
  return record;
}

export function getDealShareSnapshot(
  token: string,
  now = Date.now(),
): DealShareSnapshot | null {
  const dealId = shareIndex.get(token);
  if (!dealId) {
    return null;
  }
  const record = deals.get(dealId);
  if (!record?.share || record.share.expiresAt <= now) {
    return null;
  }
  return record.share.snapshot;
}

export function ensureDemoDeal(now = Date.now()): DealSessionRecord {
  const existing = deals.get(mockDealId);
  if (existing && !isDealExpired(existing, now)) {
    return existing;
  }
  return createDealRecord(
    {
      id: mockDealId,
      vehicleStockId: "7848117",
      cashDeposit: 2000,
      term: 48,
      financeType: "hp",
      annualMileage: 10000,
    },
    now,
  );
}

export function toDealDraft(record: DealSessionRecord): DealDraft {
  return {
    financeType: record.financeType,
    cashDeposit: record.cashDeposit,
    term: record.term,
    annualMileage: record.annualMileage,
    px: record.px,
    productIds: record.productIds,
    productYears: record.productYears,
    creditTier: record.creditTier,
    decision: record.decision,
    financeApplication: record.financeApplication,
    stepsCompleted: record.stepsCompleted,
  };
}
