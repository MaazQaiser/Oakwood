import type { GuaranteeReasonCode } from "@/config/guarantee";
import type {
  GuaranteeChoice,
  GuaranteePhotoSlot,
  GuaranteeReturnMethod,
} from "@/types/guarantee";

export type GuaranteeFormStep =
  | "registration"
  | "mileage"
  | "photos"
  | "choice"
  | "reason"
  | "exchange"
  | "return"
  | "date"
  | "deal"
  | "declarations";

export interface GuaranteeRequestFormInput {
  registration: string;
  currentMileage: number;
  dashboardMileagePhotoName?: string;
  photos: Partial<Record<GuaranteePhotoSlot, string>>;
  choice: GuaranteeChoice;
  reason: GuaranteeReasonCode;
  reasonDetail?: string;
  exchangeStockId?: string;
  targetMonthlyPayment?: number;
  returnMethod: GuaranteeReturnMethod;
  collectionPostcode?: string;
  preferredReturnDateIso: string;
  declarations: {
    insured: boolean;
    noAccidentOrModification: boolean;
    allKeysAndItems: boolean;
  };
}

export interface GuaranteeLookupResult {
  ok: boolean;
  message: string;
  sale?: import("@/types/guarantee").GuaranteeSaleFixture;
  refundBlockedByPriorRefund?: boolean;
}

export type GuaranteeSubmitResult =
  | {
      ok: true;
      reference: string;
      status: "submitted";
      route: import("@/types/guarantee").GuaranteeRoute;
    }
  | {
      ok: false;
      error: string;
    };