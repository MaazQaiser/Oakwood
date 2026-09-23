import { PageBanner } from "@/components/layout/PageBanner";
import { CalculatorEducation } from "@/features/finance/calculator/components/CalculatorEducation";
import { FinanceCalculator } from "@/features/finance/calculator/components/FinanceCalculator";
import type { CalculatorPageModel } from "@/features/finance/calculator/types";
import { createBreadcrumbs } from "@/lib/seo";
import {
  CALCULATOR_APPLICATION_EXPLAIN,
  CALCULATOR_APPLICATION_LABEL,
  CALCULATOR_ELIGIBILITY_EXPLAIN,
  CALCULATOR_ELIGIBILITY_LABEL,
  CALCULATOR_ESTIMATE_EXPLAIN,
  CALCULATOR_ESTIMATE_LABEL,
  CALCULATOR_H1,
  CALCULATOR_INTRO,
} from "@/lib/finance/calculator-copy";
import { routes } from "@/config/routes";

export function FinanceCalculatorPage({
  model,
}: {
  model: CalculatorPageModel;
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Finance", href: routes.finance },
    { label: "Calculator", href: routes.financeCalculator },
  ]);

  return (
    <>
      <PageBanner
        eyebrow="Finance"
        title={CALCULATOR_H1}
        description={CALCULATOR_INTRO}
        breadcrumbs={breadcrumbs}
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-label text-[#002852]">{CALCULATOR_ESTIMATE_LABEL}</dt>
            <dd className="mt-1 text-sm text-[#5c6778]">{CALCULATOR_ESTIMATE_EXPLAIN}</dd>
          </div>
          <div>
            <dt className="text-label text-[#002852]">{CALCULATOR_ELIGIBILITY_LABEL}</dt>
            <dd className="mt-1 text-sm text-[#5c6778]">{CALCULATOR_ELIGIBILITY_EXPLAIN}</dd>
          </div>
          <div>
            <dt className="text-label text-[#002852]">{CALCULATOR_APPLICATION_LABEL}</dt>
            <dd className="mt-1 text-sm text-[#5c6778]">{CALCULATOR_APPLICATION_EXPLAIN}</dd>
          </div>
        </dl>
      </PageBanner>
      <FinanceCalculator model={model} />
      <CalculatorEducation />
    </>
  );
}
