import { HomeHero } from "@/components/home/HomeHero";
import { BrandMakesRow } from "@/components/home/BrandMakesRow";
import { MonthlyBudgetSection } from "@/components/home/MonthlyBudgetSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { BrowseByNeed } from "@/components/home/BrowseByNeed";
import { WhyOakwood } from "@/components/home/WhyOakwood";
import { FinanceEducation } from "@/components/home/FinanceEducation";
import { LocationSection } from "@/components/home/LocationSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ValuationCTA } from "@/components/home/ValuationCTA";
import { FinalFinanceCTA } from "@/components/home/FinalFinanceCTA";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <BrandMakesRow />
      <MonthlyBudgetSection />
      <FeaturedVehicles />
      <BrowseByNeed />
      <WhyOakwood />
      <FinanceEducation />
      <LocationSection />
      <ReviewsSection />
      <ValuationCTA />
      <FinalFinanceCTA />
    </>
  );
}
