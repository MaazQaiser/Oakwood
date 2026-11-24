"use server";

import {
  autoconvertIntegration,
  eskimoIntegration,
} from "@/lib/api/integrations";

export interface InterestFreeAckPayload {
  stockId: string;
  cashDeposit: number;
  advance: number;
  term: number;
  total: number;
  shortfall: number;
  acknowledgedAt: string;
}

/**
 * Stub: records the hard-search acknowledgement for Eskimo and flags the
 * proposal for Autoconvert as the 0% product. Real CRM wiring is an open item.
 */
export async function submitInterestFreeApplication(
  payload: InterestFreeAckPayload,
): Promise<{ ok: true; leadId: string } | { ok: false; error: string }> {
  if (!payload.acknowledgedAt) {
    return { ok: false, error: "Acknowledgement required" };
  }

  const leadId = `if-${payload.stockId}-${Date.parse(payload.acknowledgedAt)}`;

  // Boundaries: eskimoIntegration + autoconvertIntegration remain unimplemented.
  void eskimoIntegration;
  void autoconvertIntegration;
  void payload;

  return { ok: true, leadId };
}
