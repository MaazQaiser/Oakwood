import { mockVehicleId } from "@/lib/mock/data";
import { reservationConfig } from "@/config/reservation";
import type { Reservation } from "@/types/reservation";

export function getMockReservation(vehicleId = mockVehicleId): Reservation {
  return {
    id: `res-${vehicleId}`,
    vehicleId,
    vehicleStockId: vehicleId,
    amount: reservationConfig.amount,
    holdDays: reservationConfig.holdDurationDays,
    stockState: "available",
    paymentState: "pending",
    createdAt: new Date(0).toISOString(),
  };
}
