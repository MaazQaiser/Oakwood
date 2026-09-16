import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/layout/Container";
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
      <Section className="pb-0">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-h1">{CALCULATOR_H1}</h1>
          <p className="mt-3 max-w-2xl text-body text-muted">{CALCULATOR_INTRO}</p>
          <dl className="mt-6 space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            <div>
              <dt className="text-label">{CALCULATOR_ESTIMATE_LABEL}</dt>
              <dd className="mt-1 text-caption text-muted md:text-body-sm">
                {CALCULATOR_ESTIMATE_EXPLAIN}
              </dd>
            </div>
            <div>
              <dt className="text-label">{CALCULATOR_ELIGIBILITY_LABEL}</dt>
              <dd className="mt-1 text-caption text-muted md:text-body-sm">
                {CALCULATOR_ELIGIBILITY_EXPLAIN}
              </dd>
            </div>
            <div>
              <dt className="text-label">{CALCULATOR_APPLICATION_LABEL}</dt>
              <dd className="mt-1 text-caption text-muted md:text-body-sm">
                {CALCULATOR_APPLICATION_EXPLAIN}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>
      <FinanceCalculator model={model} />
      <CalculatorEducation />
    </>
  );
}
