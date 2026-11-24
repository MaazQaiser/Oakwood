import { randomBytes } from "crypto";
import type {
  GuaranteeCloseOutcome,
  GuaranteeInspectionLine,
  GuaranteeRequestRecord,
  GuaranteeRequestStatus,
  GuaranteeRoute,
} from "@/types/guarantee";

const requests = new Map<string, GuaranteeRequestRecord>();

export function createGuaranteeReference(now = Date.now()): string {
  const numeric = String(now).slice(-6);
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `GR-${numeric}-${suffix}`;
}

export function createGuaranteeRequestId(): string {
  return randomBytes(16).toString("hex");
}

export function saveGuaranteeRequest(
  record: GuaranteeRequestRecord,
): GuaranteeRequestRecord {
  requests.set(record.id, record);
  return record;
}

export function getGuaranteeRequest(
  id: string,
): GuaranteeRequestRecord | null {
  return requests.get(id) ?? null;
}

export function findGuaranteeRequestByReference(
  reference: string,
): GuaranteeRequestRecord | null {
  const key = reference.trim().toUpperCase();
  for (const record of requests.values()) {
    if (record.reference.toUpperCase() === key) {
      return record;
    }
  }
  return null;
}

export function listGuaranteeRequests(): GuaranteeRequestRecord[] {
  return Array.from(requests.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function patchGuaranteeRequest(
  id: string,
  patch: Partial<GuaranteeRequestRecord>,
): GuaranteeRequestRecord | null {
  const current = requests.get(id);
  if (!current) {
    return null;
  }
  const next: GuaranteeRequestRecord = {
    ...current,
    ...patch,
    updatedAt: Date.now(),
  };
  requests.set(id, next);
  return next;
}

export function advanceGuaranteeStatus(
  id: string,
  status: GuaranteeRequestStatus,
  extras?: {
    route?: GuaranteeRoute;
    closeOutcome?: GuaranteeCloseOutcome;
    inspectionLines?: GuaranteeInspectionLine[];
    staffNotes?: string;
  },
): GuaranteeRequestRecord | null {
  const current = requests.get(id);
  if (!current) {
    return null;
  }
  const now = Date.now();
  const next: GuaranteeRequestRecord = {
    ...current,
    status,
    updatedAt: now,
    statusTimestamps: {
      ...current.statusTimestamps,
      [status]: now,
    },
    route: extras?.route ?? current.route,
    closeOutcome: extras?.closeOutcome ?? current.closeOutcome,
    inspectionLines: extras?.inspectionLines ?? current.inspectionLines,
    staffNotes: extras?.staffNotes ?? current.staffNotes,
    aftersalesAlert:
      (extras?.route ?? current.route) === "statutory" || current.aftersalesAlert,
  };
  requests.set(id, next);
  return next;
}
