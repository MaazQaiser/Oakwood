import { loadFinanceCalculatorPage } from "@/features/finance/calculator/load";
import { FinanceCalculatorPage } from "@/features/finance/calculator/FinanceCalculatorPage";
import { routes } from "@/config/routes";
import { CALCULATOR_META_DESCRIPTION } from "@/lib/finance/calculator-copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Finance calculator",
  path: routes.financeCalculator,
  description: CALCULATOR_META_DESCRIPTION,
});

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const model = await loadFinanceCalculatorPage({
    stockId: first(params.vehicle),
  });

  return <FinanceCalculatorPage model={model} />;
}
