import { reservationConfig } from "@/config/reservation";
import { supportRoutes } from "@/config/routes";
import { showrooms } from "@/config/locations";
import { calculateDeal } from "@/lib/deal/calculate";
import { DEAL_PROVIDER_CONFIG } from "@/lib/deal/provider-config";
import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { getSimilarVehicles } from "@/lib/vehicles/similar";
import { isReservable } from "@/lib/vehicles/sold";
import { getDealRecord } from "@/features/deal/store";
import { readDealCookieId } from "@/features/deal/session";
import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import {
  applyDueTransitions,
  isActiveReservation,
  patchReservation,
  releaseStock,
  type ReservationRecord,
} from "@/features/reservation/store";
import { getBoundReservation } from "@/features/reservation/session";
import { toStatusSnapshot } from "@/features/reservation/status";
import type { DealVehicleSummary } from "@/types/deal";
import type {
  ReservationDealSnapshot,
  ReservationPaymentState,
  ReservationStockState,
  ReservationUiPhase,
} from "@/types/reservation";
import type { Vehicle } from "@/types/vehicle";

export type { ReservationStatusSnapshot } from "@/features/reservation/status";
export { toStatusSnapshot } from "@/features/reservation/status";

export interface ReservationPageModel {
  reservationId?: string;
  phase: ReservationUiPhase;
  stockState: ReservationStockState;
  paymentState: ReservationPaymentState;
  vehicle?: DealVehicleSummary;
  similar: Vehicle[];
  amount: number;
  currency: string;
  holdDurationDays: number;
  refundWindowDays: number;
  refundable: boolean;
  appliedToPurchase: boolean;
  dealSnapshot?: ReservationDealSnapshot;
  dealChanged?: boolean;
  existingReservationStockId?: string;
  reference?: string;
  createdAtIso?: string;
  reservedAtIso?: string;
  expiresAtIso?: string;
  emailMasked?: string;
  refundRequestedAtIso?: string;
  financeAllRoutesUnavailable?: boolean;
  reconciliationRequired: boolean;
  paymentFailed: boolean;
  confirming: boolean;
  contact: {
    telephone?: string;
    enquiryHref: string;
  };
  stripe: {
    connected: boolean;
    wallets: readonly string[];
  };
}

function toVehicleSummary(vehicle: Vehicle): DealVehicleSummary {
  const detail = getVehicleDetail(vehicle);
  const image = detail.images[0];
  return {
    stockId: vehicle.stockId,
    slug: vehicle.slug,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.derivative,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    locationName: vehicle.locationName,
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    imageSrc: image?.src ?? "/images/vehicle-placeholder.svg",
    imageAlt: image?.alt ?? `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    availability: vehicle.availability,
  };
}

function snapshotFromDeal(
  dealId: string,
  vehicle: Vehicle,
): ReservationDealSnapshot | undefined {
  const deal = getDealRecord(dealId);
  if (!deal || deal.vehicleStockId !== vehicle.stockId) {
    return undefined;
  }
  const calculation = calculateDeal(
    {
      vehiclePrice: vehicle.cashPrice,
      vehicleYear: vehicle.year,
      vehicleMileage: vehicle.mileage,
      representativeMonthly: vehicle.monthlyPayment,
      cashDeposit: deal.cashDeposit,
      pxValue: deal.px?.value,
      pxSettlement: deal.px?.settlement,
      financeType: deal.financeType,
      term: deal.term,
      annualMileage: deal.annualMileage,
      productIds: deal.productIds,
    },
    undefined,
    DEAL_PROVIDER_CONFIG,
  );
  const pxEquity = Math.max(0, (deal.px?.value ?? 0) - (deal.px?.settlement ?? 0));
  return {
    dealId,
    vehiclePrice: vehicle.cashPrice,
    cashDeposit: deal.cashDeposit,
    pxEquity,
    financeType: deal.financeType,
    term: deal.term,
    annualMileage: deal.annualMileage,
    monthlyPayment: calculation.monthlyPayment,
  };
}

function dealHasChanged(
  snapshot: ReservationDealSnapshot | undefined,
  vehicle: Vehicle,
): boolean {
  if (!snapshot) {
    return false;
  }
  const current = snapshotFromDeal(snapshot.dealId, vehicle);
  if (!current) {
    return false;
  }
  return (
    current.cashDeposit !== snapshot.cashDeposit ||
    current.term !== snapshot.term ||
    current.financeType !== snapshot.financeType ||
    current.annualMileage !== snapshot.annualMileage ||
    current.pxEquity !== snapshot.pxEquity
  );
}

function maskEmail(email?: string): string | undefined {
  if (!email || !email.includes("@")) {
    return undefined;
  }
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}•••@${domain}`;
}

function emptyModel(_stockId: string, vehicle?: Vehicle): ReservationPageModel {
  const available = vehicle ? isReservable(vehicle) : false;
  return {
    phase: available ? "AVAILABLE" : "UNAVAILABLE",
    stockState: "available",
    paymentState: "pending",
    vehicle: vehicle ? toVehicleSummary(vehicle) : undefined,
    similar: vehicle ? getSimilarVehicles(vehicle) : [],
    amount: reservationConfig.amount,
    currency: reservationConfig.currency,
    holdDurationDays: reservationConfig.holdDurationDays,
    refundWindowDays: reservationConfig.refundWindowDays,
    refundable: reservationConfig.refundable,
    appliedToPurchase: reservationConfig.appliedToPurchase,
    reconciliationRequired: false,
    paymentFailed: false,
    confirming: false,
    contact: {
      telephone: showrooms[0]?.telephone,
      enquiryHref: supportRoutes.bookingEnquiry,
    },
    stripe: {
      connected: false,
      wallets: ["apple_pay", "google_pay", "card"],
    },
  };
}

function toPageModel(
  record: ReservationRecord,
  vehicle: Vehicle | undefined,
  extras?: Partial<ReservationPageModel>,
): ReservationPageModel {
  const available = vehicle ? isReservable(vehicle) : false;
  const status = toStatusSnapshot(record, available);
  return {
    reservationId: record.id,
    phase: extras?.phase ?? status.phase,
    stockState: record.stockState,
    paymentState: record.paymentState,
    vehicle: vehicle ? toVehicleSummary(vehicle) : undefined,
    similar: vehicle ? getSimilarVehicles(vehicle) : [],
    amount: record.amount,
    currency: record.currency,
    holdDurationDays: record.holdDurationDays,
    refundWindowDays: reservationConfig.refundWindowDays,
    refundable: reservationConfig.refundable,
    appliedToPurchase: reservationConfig.appliedToPurchase,
    dealSnapshot: record.dealSnapshot,
    dealChanged: vehicle ? dealHasChanged(record.dealSnapshot, vehicle) : false,
    reference: record.reference,
    createdAtIso: record.createdAtIso,
    reservedAtIso: record.reservedAtIso,
    expiresAtIso: record.expiresAtIso,
    emailMasked: maskEmail(record.email),
    refundRequestedAtIso: record.refund?.requestedAtIso,
    financeAllRoutesUnavailable: record.financeAllRoutesUnavailable,
    reconciliationRequired: status.reconciliationRequired,
    paymentFailed: status.paymentFailed,
    confirming: status.confirming,
    contact: {
      telephone: showrooms[0]?.telephone,
      enquiryHref: supportRoutes.bookingEnquiry,
    },
    stripe: {
      connected: false,
      wallets: ["apple_pay", "google_pay", "card"],
    },
    ...extras,
  };
}

async function attachDealSnapshot(
  record: ReservationRecord,
  vehicle: Vehicle,
): Promise<ReservationRecord> {
  if (record.dealSnapshot) {
    return record;
  }
  const dealId = record.dealId ?? (await readDealCookieId());
  if (!dealId) {
    return record;
  }
  const snapshot = snapshotFromDeal(dealId, vehicle);
  if (!snapshot) {
    return record;
  }
  return (
    patchReservation(record.id, {
      dealSnapshot: snapshot,
      dealId: snapshot.dealId,
    }) ?? record
  );
}

function applyVehicleSold(
  record: ReservationRecord,
  vehicle: Vehicle | undefined,
): ReservationRecord {
  if (!vehicle || isReservable(vehicle) || record.stockState !== "reserved") {
    return record;
  }
  const next = patchReservation(record.id, {
    stockState: "sold",
    paymentState: reservationConfig.sameDayRefundOnVehicleUnavailable
      ? "refunded"
      : "refund_pending",
  });
  if (next) {
    releaseStock(record.vehicleStockId, record.id);
    return next;
  }
  return record;
}

async function applyFinanceUnavailable(
  record: ReservationRecord,
): Promise<ReservationRecord> {
  if (record.stockState !== "reserved") {
    return record;
  }
  const eligibility = await getEligibilitySession();
  if (
    !eligibility ||
    isSessionExpired(eligibility) ||
    eligibility.outcome !== "alternative" ||
    !reservationConfig.sameDayRefundOnFinanceUnavailable
  ) {
    return record;
  }
  if (reservationConfig.releaseStockOnRefundRequest) {
    releaseStock(record.vehicleStockId, record.id);
  }
  return (
    patchReservation(record.id, {
      financeAllRoutesUnavailable: true,
      stockState: "refund_requested",
      paymentState: "refunded",
    }) ?? record
  );
}

export async function loadReservationPage(
  stockId: string,
): Promise<ReservationPageModel> {
  const vehicle = findVehicleByStockId(stockId);
  let bound = await getBoundReservation();

  if (bound) {
    bound = applyDueTransitions(bound);
    bound = applyVehicleSold(bound, findVehicleByStockId(bound.vehicleStockId));
    bound = await applyFinanceUnavailable(bound);

    if (bound.vehicleStockId !== stockId) {
      if (isActiveReservation(bound)) {
        return {
          ...emptyModel(stockId, vehicle),
          existingReservationStockId: bound.vehicleStockId,
        };
      }
      bound = null;
    }
  }

  if (!bound) {
    return emptyModel(stockId, vehicle);
  }

  if (vehicle) {
    bound = await attachDealSnapshot(bound, vehicle);
  }

  return toPageModel(bound, vehicle);
}
