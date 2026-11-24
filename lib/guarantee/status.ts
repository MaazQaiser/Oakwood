import { guaranteeConfig } from "@/config/guarantee";
import type {
  GuaranteeRequestRecord,
  GuaranteeRequestStatus,
} from "@/types/guarantee";

export const GUARANTEE_STATUS_LABELS: Record<GuaranteeRequestStatus, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  return_booked: "Return booked",
  inspected: "Inspected",
  closed: "Closed",
};

export const GUARANTEE_STATUS_FLOW: GuaranteeRequestStatus[] = [
  "submitted",
  "reviewed",
  "return_booked",
  "inspected",
  "closed",
];

export function statusTargetMs(status: GuaranteeRequestStatus): number | null {
  switch (status) {
    case "submitted":
      return guaranteeConfig.advisorCallTargetWorkingDays * 24 * 60 * 60 * 1000;
    case "reviewed":
      return guaranteeConfig.returnWithinHoursOfAcceptance * 60 * 60 * 1000;
    case "inspected":
      return guaranteeConfig.refundPaymentDays * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

export function isStatusOverdue(
  record: GuaranteeRequestRecord,
  now = Date.now(),
): boolean {
  if (record.status === "closed") {
    return false;
  }
  const started =
    record.statusTimestamps[record.status] ?? record.updatedAt ?? record.createdAt;
  const target = statusTargetMs(record.status);
  if (target === null) {
    return false;
  }
  return now - started > target;
}

export function statusTargetLabel(status: GuaranteeRequestStatus): string {
  switch (status) {
    case "submitted":
      return `Advisor call within ${guaranteeConfig.advisorCallTargetWorkingDays} working day`;
    case "reviewed":
      return `Return within ${guaranteeConfig.returnWithinHoursOfAcceptance} hours of acceptance`;
    case "return_booked":
      return "Awaiting inspection";
    case "inspected":
      return `Refund within ${guaranteeConfig.refundPaymentDays} days of inspection`;
    case "closed":
      return "Complete";
    default:
      return "";
  }
}
