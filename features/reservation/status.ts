import type {
  ReservationPaymentState,
  ReservationStockState,
  ReservationUiPhase,
} from "@/types/reservation";
import type { ReservationRecord } from "@/features/reservation/store";

export interface ReservationStatusSnapshot {
  reservationId: string;
  phase: ReservationUiPhase;
  stockState: ReservationStockState;
  paymentState: ReservationPaymentState;
  reference?: string;
  reservedAtIso?: string;
  expiresAtIso?: string;
  refundRequestedAtIso?: string;
  financeAllRoutesUnavailable?: boolean;
  reconciliationRequired: boolean;
  paymentFailed: boolean;
  confirming: boolean;
}

export function phaseFromStates(
  stock: ReservationStockState,
  payment: ReservationPaymentState,
  vehicleAvailable: boolean,
): ReservationUiPhase {
  if (stock === "reconciliation") {
    return "ERROR";
  }
  if (stock === "sold") {
    return "SOLD";
  }
  if (stock === "expired") {
    return "EXPIRED";
  }
  if (stock === "refund_requested") {
    return "REFUND_REQUESTED";
  }
  if (stock === "refunded") {
    return "REFUNDED";
  }
  if (stock === "reserved" && payment === "paid") {
    return "RESERVED";
  }
  if (payment === "failed") {
    return "ERROR";
  }
  if (!vehicleAvailable) {
    return "UNAVAILABLE";
  }
  return "AVAILABLE";
}

export function toStatusSnapshot(
  record: ReservationRecord,
  vehicleAvailable = true,
): ReservationStatusSnapshot {
  const confirming = Boolean(
    record.paymentIntentId &&
      record.paymentState === "pending" &&
      !record.webhookApplied,
  );
  let phase = phaseFromStates(
    record.stockState,
    record.paymentState,
    vehicleAvailable,
  );
  if (confirming) {
    phase = "PROCESSING";
  }
  if (record.paymentState === "failed") {
    phase = "ERROR";
  }

  return {
    reservationId: record.id,
    phase,
    stockState: record.stockState,
    paymentState: record.paymentState,
    reference: record.reference,
    reservedAtIso: record.reservedAtIso,
    expiresAtIso: record.expiresAtIso,
    refundRequestedAtIso: record.refund?.requestedAtIso,
    financeAllRoutesUnavailable: record.financeAllRoutesUnavailable,
    reconciliationRequired:
      record.stockState === "reconciliation" && record.paymentState === "paid",
    paymentFailed: record.paymentState === "failed",
    confirming,
  };
}
