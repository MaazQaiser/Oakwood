"use client";

import { PromoPanel } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getSearchUrl, routes } from "@/config/routes";

export function FinalFinanceCTA() {
  const { mode } = useCustomerFinance();
  const eligible = mode === "personalised";

  return (
    <Section>
      <Container>
        <PromoPanel>
          <SectionIntro
            align="center"
            eyebrow="Ready when you are"
            heading={
              eligible
                ? "Your finance profile is ready."
                : "Know your budget before you shop."
            }
          >
            {eligible
              ? "Browse cars within your current finance profile. Monthly figures are based on your eligibility result."
              : "Check your finance eligibility in around 60 seconds, then browse cars based on what works for you."}
          </SectionIntro>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href={eligible ? getSearchUrl({ affordable: 1 }) : routes.eligibility} size="lg">
              {eligible ? "Browse cars within my budget" : "Check my eligibility"}
            </Button>
            <Button href={routes.financeCalculator} variant="secondary" size="lg">
              Finance calculator
            </Button>
          </div>
          <p className="mt-4 text-center text-body-sm text-muted">
            No impact on your credit score.
          </p>
        </PromoPanel>
      </Container>
    </Section>
  );
}
