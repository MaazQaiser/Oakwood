import type { ReservationStep } from "@/config/routes";
import { getReserveUrl } from "@/config/routes";
import type { ReservationPageModel } from "@/features/reservation/load";

export function reservationStepRedirect(
  stockId: string,
  step: ReservationStep,
  model: ReservationPageModel,
): string | null {
  if (model.paymentFailed && step !== "failed") {
    return getReserveUrl(stockId, "failed");
  }

  if (model.confirming || model.phase === "PROCESSING") {
    if (step !== "success") {
      return getReserveUrl(stockId, "success");
    }
    return null;
  }

  if (model.phase === "RESERVED") {
    if (step === "reserve" || step === "payment" || step === "failed") {
      return getReserveUrl(stockId, "success");
    }
    return null;
  }

  if (model.phase === "REFUND_REQUESTED" || model.phase === "REFUNDED") {
    if (step === "payment" || step === "success" || step === "refund") {
      return step === "refund" ? null : getReserveUrl(stockId, "manage");
    }
  }

  if (step === "payment" && !model.reservationId) {
    return getReserveUrl(stockId);
  }

  if (step === "success" && model.phase === "AVAILABLE" && !model.reconciliationRequired) {
    return getReserveUrl(stockId);
  }

  if (step === "refund" && model.phase === "AVAILABLE") {
    return getReserveUrl(stockId);
  }

  return null;
}
