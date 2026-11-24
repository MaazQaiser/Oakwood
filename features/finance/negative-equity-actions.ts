"use server";

import {
  autoconvertIntegration,
  eskimoIntegration,
} from "@/lib/api/integrations";
import {
  createNegEquityLead,
  type NegEquityLeadInput,
} from "@/features/finance/negative-equity-store";

/**
 * Five capture routes. Each is tagged by source so conversion can be measured
 * once Autoconvert and Eskimo are wired. Nothing is sent yet.
 */
export async function submitNegEquityLead(
  input: NegEquityLeadInput,
): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    if (!input.source) {
      return { ok: false, error: "Missing source." };
    }

    if (
      (input.source === "soft-search" ||
        input.source === "apply" ||
        input.source === "callback" ||
        input.source === "appointment" ||
        input.source === "human") &&
      !input.name?.trim()
    ) {
      return { ok: false, error: "Enter your full name." };
    }

    if (
      (input.source === "soft-search" ||
        input.source === "apply" ||
        input.source === "email-quote") &&
      !input.email?.trim()
    ) {
      return { ok: false, error: "Enter your email." };
    }

    if (
      (input.source === "soft-search" ||
        input.source === "apply" ||
        input.source === "callback" ||
        input.source === "appointment" ||
        input.source === "human") &&
      !input.telephone?.trim()
    ) {
      return { ok: false, error: "Enter your mobile number." };
    }

    if (input.source === "appointment" && (!input.site || !input.time)) {
      return { ok: false, error: "Pick a showroom and a time." };
    }

    const record = createNegEquityLead({
      ...input,
      twoAgreements: input.source === "apply" ? true : input.twoAgreements,
    });

    // Boundaries remain unimplemented — keep the tags so wiring is obvious.
    void autoconvertIntegration;
    void eskimoIntegration;

    return { ok: true, reference: record.reference };
  } catch {
    return { ok: false, error: "We could not send that just now." };
  }
}
