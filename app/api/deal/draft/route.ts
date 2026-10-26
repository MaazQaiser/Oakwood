import { hydrateDealsFromCookie, persistDeal } from "@/features/deal/session";
import {
  ensureDemoDeal,
  getDealRecord,
  isDealExpired,
  isDealResumeStep,
  touchDeal,
} from "@/features/deal/store";
import { listSelectedProducts } from "@/lib/deal/products";
import { mockDealId } from "@/lib/mock/data";
import type { DealCreditTier, DealDraft } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";

/**
 * Deal builder autosave. A Route Handler rather than a Server Action: setting
 * the deal state cookie inside a Server Action re-renders the page, which hands
 * the builder a fresh model, re-triggers autosave and loops.
 */
export async function POST(request: Request) {
  let input: { dealId?: unknown; draft?: Partial<DealDraft> };
  try {
    input = await request.json();
  } catch {
    return Response.json({ ok: false, invalid: true }, { status: 400 });
  }
  const { dealId, draft } = input;
  if (
    typeof dealId !== "string" ||
    !draft ||
    typeof draft.cashDeposit !== "number" ||
    typeof draft.term !== "number" ||
    !Array.isArray(draft.productIds)
  ) {
    return Response.json({ ok: false, invalid: true }, { status: 400 });
  }

  await hydrateDealsFromCookie();
  const record =
    getDealRecord(dealId) ?? (dealId === mockDealId ? ensureDemoDeal() : null);
  if (!record || isDealExpired(record)) {
    return Response.json({ ok: false, expired: true });
  }

  const financeType: FinanceProductType =
    draft.financeType === "pcp" ? "pcp" : "hp";
  const creditTier: DealCreditTier | undefined =
    draft.creditTier === "excellent" ||
    draft.creditTier === "good" ||
    draft.creditTier === "average" ||
    draft.creditTier === "poor"
      ? draft.creditTier
      : undefined;
  const productIds = Array.from(new Set(draft.productIds)).filter(
    (id) => listSelectedProducts([id]).length > 0,
  );

  const updated = touchDeal(dealId, {
    financeType,
    cashDeposit: Math.max(0, Math.round(draft.cashDeposit)),
    term: Math.max(12, Math.round(draft.term)),
    annualMileage: draft.annualMileage,
    px: draft.px,
    productIds,
    productYears: draft.productYears,
    creditTier,
    decision: draft.decision,
    financeApplication: draft.financeApplication,
    stepsCompleted: draft.stepsCompleted,
    ...(isDealResumeStep(draft.resumeStep)
      ? { resumeStep: draft.resumeStep }
      : {}),
  });
  await persistDeal(updated);
  return Response.json({ ok: true });
}
