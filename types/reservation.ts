export type ReservationStockState =
  | "available"
  | "reserved"
  | "refund_requested"
  | "refunded"
  | "sold"
  | "expired"
  | "reconciliation";

/** @deprecated Use ReservationStockState */
export type ReservationState =
  | "available"
  | "reserved"
  | "refund-requested"
  | "refunded"
  | "sold"
  | "expired";

export type ReservationPaymentState =
  | "pending"
  | "paid"
  | "failed"
  | "refund_pending"
  | "refunded";

export type ReservationUiPhase =
  | "AVAILABLE"
  | "PAYMENT"
  | "PROCESSING"
  | "RESERVED"
  | "REFUND_REQUESTED"
  | "REFUNDED"
  | "EXPIRED"
  | "SOLD"
  | "UNAVAILABLE"
  | "ERROR";

export type RefundReasonCode =
  | "cheaper_elsewhere"
  | "finance_elsewhere"
  | "changed_mind"
  | "unable_to_attend"
  | "px_offer_too_low"
  | "other";

export type MockPaymentOutcome =
  | "succeed"
  | "fail"
  | "pending"
  | "conflict"
  | "reconcile"
  | "expire"
  | "sold"
  | "finance_unavailable";

/**
 * Payment state and stock state are independent fields.
 * They must never be coupled.
 */
export interface Reservation {
  id: string;
  vehicleId: string;
  vehicleStockId: string;
  amount: number;
  holdDays: number;
  stockState: ReservationStockState;
  paymentState: ReservationPaymentState;
  createdAt: string;
  expiresAt?: string;
  reference?: string;
  dealId?: string;
}

export interface ReservationDealSnapshot {
  dealId: string;
  vehiclePrice: number;
  cashDeposit: number;
  pxEquity: number;
  financeType: "hp" | "pcp";
  term: number;
  annualMileage?: number;
  monthlyPayment: number;
}

export interface ReservationRefundRequest {
  reason: RefundReasonCode;
  requestedAt: string;
}
