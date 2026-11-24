"use client";

import { Container, Section, Stack } from "@/components/layout/Container";
import { PageBannerScope } from "@/components/layout/PageBanner";
import { Builder } from "@/features/finance/interest-free/components/Builder";
import { ConditionsAndRep } from "@/features/finance/interest-free/components/ConditionsAndRep";
import { HowItWorks } from "@/features/finance/interest-free/components/HowItWorks";
import { InterestFreeHero } from "@/features/finance/interest-free/components/InterestFreeHero";
import { PackageSection } from "@/features/finance/interest-free/components/PackageSection";
import { QualifyingStock } from "@/features/finance/interest-free/components/QualifyingStock";
import { ReligiousFinance } from "@/features/finance/interest-free/components/ReligiousFinance";
import { useInterestFreeBuilder } from "@/features/finance/interest-free/hooks/useInterestFreeBuilder";
import type { InterestFreePageModel } from "@/features/finance/interest-free/types";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";

export function InterestFreePage({ model }: { model: InterestFreePageModel }) {
  const builder = useInterestFreeBuilder(model.cars, model.initialStockId);
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Finance", href: routes.finance },
    { label: "0% finance", href: routes.interestFree },
  ]);

  return (
    <PageBannerScope breadcrumbs={breadcrumbs}>
      <InterestFreeHero car={model.hero} breadcrumbs={breadcrumbs} />
      <Section>
        <Container>
          <Stack gap="8">
            <HowItWorks />
            <Builder builder={builder} />
            <QualifyingStock
              deposit={builder.deal?.deposit ?? 0}
              term={builder.term}
              cars={builder.qualifying}
              allCars={model.cars}
              onSelect={(id) => {
                builder.selectCar(id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            {builder.deal ? <PackageSection pkg={builder.deal.pkg} /> : null}
            <ReligiousFinance />
            <ConditionsAndRep deal={builder.deal} hero={model.hero} />
          </Stack>
        </Container>
      </Section>
    </PageBannerScope>
  );
}
