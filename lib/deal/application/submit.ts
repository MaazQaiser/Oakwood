import { financeProviderIntegration } from "@/lib/api/integrations";
import { applicationReference, mockSubmitDelayMs } from "@/lib/deal/application/mock";
import { bankDetailsProvided } from "@/lib/deal/application/validation";
import type { DealDraft } from "@/types/deal";
import type {
  DealApplicationFormState,
  DealApplicationResult,
  DealFinanceApplicationDraft,
} from "@/types/deal-application";

export type ApplicationSubmitResult =
  | { ok: true; result: DealApplicationResult }
  | { ok: false };

/**
 * Saves the embedded application on the Oakwood deal.
 * Hero/Admiral (finance-provider) is used only when that integration is live.
 * A missing provider queues the application for an advisor. It does not invent
 * an approval, referral, decline, or APR.
 */
export async function submitEmbeddedApplication(input: {
  dealId: string;
  draft: DealDraft;
  application: DealFinanceApplicationDraft;
  form: DealApplicationFormState;
}): Promise<ApplicationSubmitResult> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, mockSubmitDelayMs());
  });

  const providerLive = Boolean(financeProviderIntegration.implemented);
  if (providerLive) {
    return { ok: false };
  }

  const result: DealApplicationResult = {
    submittedAt: new Date().toISOString(),
    reference: applicationReference(input.dealId),
    bankDetailsProvided: bankDetailsProvided(input.form),
    provider: "queued",
  };
  const application: DealFinanceApplicationDraft = {
    ...input.application,
    section: "licence",
    form: input.form,
    result,
    submitError: undefined,
  };

  try {
    const response = await fetch("/api/deal/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dealId: input.dealId,
        draft: { ...input.draft, financeApplication: application },
      }),
    });
    if (!response.ok) {
      return { ok: false };
    }
    const body = (await response.json()) as { ok?: boolean };
    if (!body.ok) {
      return { ok: false };
    }
    return { ok: true, result };
  } catch {
    return { ok: false };
  }
}
