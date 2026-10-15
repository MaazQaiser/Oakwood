import { redirect } from "next/navigation";
import { DealWizardPage } from "@/components/deal/DealWizardPage";
import { DealStockBootstrap } from "@/components/deal/DealStockBootstrap";
import { loadDealPage } from "@/features/deal/load";
import { resolveDealId } from "@/features/deal/resolve";
import type { DealStep } from "@/config/routes";
import { getDealUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { DEAL_STEP_META } from "@/lib/deal/steps";
import { mockDealId } from "@/lib/mock/data";

export function dealStepStaticParams() {
  return [{ dealId: mockDealId }];
}

export async function dealStepMetadata(dealId: string, step: DealStep) {
  return createPageMetadata({
    title: DEAL_STEP_META[step].title,
    path: getDealUrl(dealId, step),
    indexable: false,
  });
}

export async function renderDealStepPage(
  dealIdParam: string,
  step: DealStep,
) {
  const resolved = await resolveDealId(dealIdParam);
  if (resolved.kind === "bootstrap") {
    return <DealStockBootstrap stockId={resolved.stockId} step={step} />;
  }

  const model = await loadDealPage(resolved.dealId);
  return <DealWizardPage model={model} step={step} />;
}

export async function redirectLegacyDealStep(
  dealIdParam: string,
  target: DealStep,
) {
  const resolved = await resolveDealId(dealIdParam);
  if (resolved.kind === "bootstrap") {
    redirect(getDealUrl(resolved.stockId, target));
  }
  redirect(getDealUrl(resolved.dealId, target));
}
