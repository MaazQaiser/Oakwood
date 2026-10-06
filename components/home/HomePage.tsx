import { HomeHero } from "@/components/home/HomeHero";
import { BrandMakesRow } from "@/components/home/BrandMakesRow";
import { BrowseByNeed } from "@/components/home/BrowseByNeed";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { WhyOakwood } from "@/components/home/WhyOakwood";
import { FinanceEducation } from "@/components/home/FinanceEducation";
import { HomePartExchange } from "@/components/home/HomePartExchange";
import { HomeAftersales } from "@/components/home/HomeAftersales";
import { LocationSection } from "@/components/home/LocationSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FinalFinanceCTA } from "@/components/home/FinalFinanceCTA";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <BrandMakesRow />
      <BrowseByNeed />
      <FeaturedVehicles />
      <WhyOakwood />
      <FinanceEducation />
      <HomePartExchange />
      <HomeAftersales />
      <LocationSection />
      <ReviewsSection />
      <FinalFinanceCTA />
    </>
  );
}
