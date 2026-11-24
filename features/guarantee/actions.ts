"use server";

import {
  GUARANTEE_REASON_OPTIONS,
  type GuaranteeReasonCode,
  guaranteeConfig,
} from "@/config/guarantee";
import { checkGuaranteeEligibility } from "@/lib/guarantee/eligibility-check";
import {
  collectionChargeForDistance,
  excessMilesUsed,
} from "@/lib/guarantee/format";
import {
  lookupCollectionDistance,
} from "@/lib/guarantee/handovers";
import {
  advanceGuaranteeStatus,
  createGuaranteeReference,
  createGuaranteeRequestId,
  getGuaranteeRequest,
  listGuaranteeRequests,
  saveGuaranteeRequest,
} from "@/features/guarantee/store";
import type {
  GuaranteeChoice,
  GuaranteeCloseOutcome,
  GuaranteeInspectionLine,
  GuaranteePhotos,
  GuaranteeRequestRecord,
  GuaranteeRequestStatus,
  GuaranteeReturnMethod,
  GuaranteeRoute,
} from "@/types/guarantee";

const MAX_PHOTO_CHARS = 180_000;

function clampPhoto(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value.length > MAX_PHOTO_CHARS) {
    return value.slice(0, MAX_PHOTO_CHARS);
  }
  return value;
}

function clampPhotos(photos: GuaranteePhotos): GuaranteePhotos {
  return {
    front_left: clampPhoto(photos.front_left),
    front_right: clampPhoto(photos.front_right),
    rear_left: clampPhoto(photos.rear_left),
    rear_right: clampPhoto(photos.rear_right),
    interior: clampPhoto(photos.interior),
    dashboard: clampPhoto(photos.dashboard),
  };
}

export async function lookupGuaranteeRegistrationAction(registration: string) {
  return checkGuaranteeEligibility(registration);
}

export async function previewGuaranteeMileageAction(input: {
  registration: string;
  currentMileage: number;
}) {
  const eligibility = checkGuaranteeEligibility(input.registration);
  if (!eligibility.ok || !eligibility.sale) {
    return { ok: false as const, error: eligibility.message };
  }
  const preview = excessMilesUsed(
    input.currentMileage,
    eligibility.sale.handoverMileage,
  );
  return {
    ok: true as const,
    used: preview.used,
    excess: preview.excess,
    charge: preview.charge,
  };
}

export async function lookupCollectionChargeAction(postcode: string) {
  const distance = lookupCollectionDistance(postcode);
  if (distance === undefined) {
    return {
      ok: false as const,
      message:
        "We do not have a live distance for that postcode in this prototype. Try BL8 1AA, M1 1AE, L1 1DE or BD1 1IJ.",
    };
  }
  const charge = collectionChargeForDistance(distance);
  return {
    ok: true as const,
    distanceMiles: distance,
    miles: distance,
    charge,
    freeRadius: guaranteeConfig.freeCollectionRadiusMiles,
  };
}

export async function previewCollectionChargeAction(input: {
  siteSlug?: string;
  postcode: string;
}) {
  void input.siteSlug;
  return lookupCollectionChargeAction(input.postcode);
}

export async function listGuaranteeExchangeStockAction() {
  const { mockVehicles } = await import("@/lib/mock/data");
  return mockVehicles
    .filter(
      (vehicle) =>
        vehicle.availability === "available" && vehicle.category === "car",
    )
    .slice(0, 24)
    .map((vehicle) => ({
      stockId: vehicle.stockId,
      label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      monthlyPayment: vehicle.monthlyPayment,
      cashPrice: vehicle.cashPrice,
    }));
}

export async function submitGuaranteeRequestAction(input: {
  registration: string;
  name: string;
  email: string;
  mobile: string;
  currentMileage: number;
  choice: GuaranteeChoice;
  reason: GuaranteeReasonCode;
  reasonDetail?: string;
  photos: GuaranteePhotos;
  exchangeStockId?: string;
  targetMonthlyPayment?: number;
  returnMethod: GuaranteeReturnMethod;
  collectionPostcode?: string;
  preferredReturnDateIso: string;
  insured: boolean;
  noAccidentOrModification: boolean;
  allKeysAndItems: boolean;
}): Promise<
  | { ok: true; reference: string; id: string; record: GuaranteeRequestRecord }
  | { ok: false; message: string }
> {
  const eligibility = checkGuaranteeEligibility(input.registration);
  if (!eligibility.ok || !eligibility.sale) {
    return { ok: false, message: eligibility.message };
  }

  if (
    input.choice === "refund" &&
    eligibility.refundBlockedByPriorRefund
  ) {
    return {
      ok: false,
      message:
        "A refund under this guarantee has already been used in the last 12 months. You can still request an exchange.",
    };
  }

  if (
    !input.insured ||
    !input.noAccidentOrModification ||
    !input.allKeysAndItems
  ) {
    return {
      ok: false,
      message: "Confirm every declaration before submitting.",
    };
  }

  const reasonOk = GUARANTEE_REASON_OPTIONS.some(
    (option) => option.value === input.reason,
  );
  if (!reasonOk) {
    return { ok: false, message: "Choose a reason for the request." };
  }
  if (input.reason === "other" && !input.reasonDetail?.trim()) {
    return { ok: false, message: "Tell us more when the reason is Other." };
  }

  const requiredSlots: Array<keyof GuaranteePhotos> = [
    "front_left",
    "front_right",
    "rear_left",
    "rear_right",
    "interior",
    "dashboard",
  ];
  for (const slot of requiredSlots) {
    if (!input.photos[slot]) {
      return {
        ok: false,
        message: "Upload photos of four corners, the interior, and the dashboard.",
      };
    }
  }

  let collectionDistanceMiles: number | undefined;
  let collectionCharge: number | undefined;
  if (input.returnMethod === "collection") {
    if (!input.collectionPostcode?.trim()) {
      return { ok: false, message: "Enter a postcode for collection." };
    }
    const distance = lookupCollectionDistance(input.collectionPostcode);
    if (distance === undefined) {
      return {
        ok: false,
        message:
          "We could not price collection for that postcode in this prototype.",
      };
    }
    collectionDistanceMiles = distance;
    collectionCharge = collectionChargeForDistance(distance);
  }

  const sale = eligibility.sale;
  const mileage = excessMilesUsed(input.currentMileage, sale.handoverMileage);
  const route: GuaranteeRoute =
    input.reason === "fault" ? "statutory" : "guarantee";
  const now = Date.now();
  const id = createGuaranteeRequestId();
  const reference = createGuaranteeReference(now);

  const record: GuaranteeRequestRecord = {
    id,
    reference,
    createdAt: now,
    updatedAt: now,
    status: "submitted",
    route,
    choice: input.choice,
    reason: input.reason,
    reasonDetail: input.reasonDetail?.trim() || undefined,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    mobile: input.mobile.trim(),
    registration: sale.registration,
    currentMileage: input.currentMileage,
    excessMiles: mileage.excess,
    excessMileageCharge: route === "statutory" ? 0 : mileage.charge,
    photos: clampPhotos(input.photos),
    exchangeStockId: input.exchangeStockId,
    targetMonthlyPayment: input.targetMonthlyPayment,
    returnMethod: input.returnMethod,
    collectionPostcode: input.collectionPostcode?.trim().toUpperCase(),
    collectionDistanceMiles,
    collectionCharge: route === "statutory" ? 0 : collectionCharge,
    preferredReturnDateIso: input.preferredReturnDateIso,
    declarations: {
      insured: input.insured,
      noAccidentOrModification: input.noAccidentOrModification,
      allKeysAndItems: input.allKeysAndItems,
    },
    sale,
    statusTimestamps: { submitted: now },
    inspectionLines: [],
    aftersalesAlert: route === "statutory",
  };

  saveGuaranteeRequest(record);
  return { ok: true, reference, id, record };
}

export async function listGuaranteeRequestsAction() {
  return listGuaranteeRequests();
}

export async function getGuaranteeRequestAction(id: string) {
  return getGuaranteeRequest(id);
}

export async function updateGuaranteeStatusAction(input: {
  id: string;
  status: GuaranteeRequestStatus;
  route?: GuaranteeRoute;
  closeOutcome?: GuaranteeCloseOutcome;
  inspectionLines?: GuaranteeInspectionLine[];
  staffNotes?: string;
}) {
  const updated = advanceGuaranteeStatus(input.id, input.status, {
    route: input.route,
    closeOutcome: input.closeOutcome,
    inspectionLines: input.inspectionLines,
    staffNotes: input.staffNotes,
  });
  if (!updated) {
    return { ok: false as const, message: "Request not found." };
  }
  return { ok: true as const, record: updated };
}
