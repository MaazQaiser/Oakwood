import type { GuaranteeReasonCode } from "@/config/guarantee";

export type GuaranteeRoute = "guarantee" | "statutory";

export type GuaranteeChoice = "exchange" | "refund";

export type GuaranteeReturnMethod = "drop_off" | "collection";

export type GuaranteeRequestStatus =
  | "submitted"
  | "reviewed"
  | "return_booked"
  | "inspected"
  | "closed";

export type GuaranteeCloseOutcome =
  | "exchange_completed"
  | "refund_paid"
  | "withdrawn";

export type GuaranteePhotoSlot =
  | "front_left"
  | "front_right"
  | "rear_left"
  | "rear_right"
  | "interior"
  | "dashboard";

export interface GuaranteePhotos {
  front_left?: string;
  front_right?: string;
  rear_left?: string;
  rear_right?: string;
  interior?: string;
  dashboard?: string;
}

export interface GuaranteeHandoverPhotoSet {
  front_left: string;
  front_right: string;
  rear_left: string;
  rear_right: string;
  interior: string;
  dashboard: string;
}

export interface GuaranteeSaleFixture {
  registration: string;
  customerName: string;
  email: string;
  mobile: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  handoverDateIso: string;
  handoverMileage: number;
  sellingSiteSlug: string;
  sellingSiteName: string;
  saleType: "retail" | "trade" | "sold_as_seen";
  guaranteeEligible: boolean;
  finance?: {
    lender: string;
    agreementDateIso: string;
  };
  partExchangeValue?: number;
  salesperson: string;
  leadSource: "Hero" | "AutoTrader" | "website";
  previousGuaranteeRefundAtIso?: string;
  handoverPhotos: GuaranteeHandoverPhotoSet;
}

export interface GuaranteeInspectionLine {
  id: string;
  label: string;
  amount: number;
  note?: string;
}

export interface GuaranteeRequestRecord {
  id: string;
  reference: string;
  createdAt: number;
  updatedAt: number;
  status: GuaranteeRequestStatus;
  route: GuaranteeRoute;
  choice: GuaranteeChoice;
  reason: GuaranteeReasonCode;
  reasonDetail?: string;
  name: string;
  email: string;
  mobile: string;
  registration: string;
  currentMileage: number;
  excessMiles: number;
  excessMileageCharge: number;
  photos: GuaranteePhotos;
  exchangeStockId?: string;
  targetMonthlyPayment?: number;
  returnMethod: GuaranteeReturnMethod;
  collectionPostcode?: string;
  collectionDistanceMiles?: number;
  collectionCharge?: number;
  preferredReturnDateIso: string;
  declarations: {
    insured: boolean;
    noAccidentOrModification: boolean;
    allKeysAndItems: boolean;
  };
  sale: GuaranteeSaleFixture;
  statusTimestamps: Partial<Record<GuaranteeRequestStatus, number>>;
  inspectionLines: GuaranteeInspectionLine[];
  closeOutcome?: GuaranteeCloseOutcome;
  aftersalesAlert: boolean;
  staffNotes?: string;
}

export interface GuaranteeEligibilityResult {
  ok: boolean;
  reason?:
    | "unknown_registration"
    | "outside_period"
    | "trade"
    | "sold_as_seen"
    | "not_eligible";
  message: string;
  sale?: GuaranteeSaleFixture;
  refundBlockedByPriorRefund?: boolean;
}

export { type GuaranteeReasonCode };
