"use server";

import { findVehicleByStockId } from "@/lib/vehicles/query";
import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { findSupportEnquiryByReference } from "@/features/support/store";
import {
  buildTestDriveConfirmation,
  type TestDriveConfirmationModel,
  type TestDriveConfirmationRequest,
} from "@/lib/deal/test-drive-confirmation";
import { STEP4_TD_CONFIRM_ERROR } from "@/lib/deal/step4-copy";

export async function loadTestDriveConfirmation(
  request: TestDriveConfirmationRequest,
): Promise<
  | { ok: true; model: TestDriveConfirmationModel }
  | { ok: false; error: string }
> {
  try {
    const enquiry = findSupportEnquiryByReference(request.reference);
    if (
      !enquiry ||
      enquiry.stockId !== request.stockId ||
      enquiry.locationSlug !== request.showroomSlug
    ) {
      return { ok: false, error: STEP4_TD_CONFIRM_ERROR };
    }

    const vehicle = findVehicleByStockId(request.stockId);
    const detail = vehicle ? getVehicleDetail(vehicle) : undefined;
    const model = buildTestDriveConfirmation(
      request,
      detail?.video?.src,
      detail?.video?.title,
    );
    if (!model) {
      return { ok: false, error: STEP4_TD_CONFIRM_ERROR };
    }
    return { ok: true, model };
  } catch {
    return { ok: false, error: STEP4_TD_CONFIRM_ERROR };
  }
}
