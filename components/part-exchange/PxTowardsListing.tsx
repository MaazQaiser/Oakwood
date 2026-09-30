"use client";

import { VehicleCard } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Container, Grid, ScrollRow, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getVehicleUrl, routes } from "@/config/routes";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { featuredVehicles } from "@/lib/mock/home";
import {
  PX_LISTING_ACTION,
  PX_LISTING_EYEBROW,
  PX_LISTING_HEADING,
  PX_LISTING_SUPPORT,
} from "@/lib/part-exchange/copy";

export function PxTowardsListing() {
  const { mode, maxAdvance, deposit, term } = useCustomerFinance();

  if (featuredVehicles.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionIntro
          eyebrow={PX_LISTING_EYEBROW}
          heading={PX_LISTING_HEADING}
          action={
            <div className="hidden md:block">
              <Button href={routes.usedCars} variant="text">
                View all cars
              </Button>
            </div>
          }
        >
          {PX_LISTING_SUPPORT}
        </SectionIntro>
        <Grid columns="featured" className="mt-8 md:grid xl:grid-cols-3!">
          <ScrollRow className="md:contents">
            {featuredVehicles.map((vehicle) => {
              const state = getFinanceDisplayState(
                mode,
                vehicle.cashPrice,
                maxAdvance,
                deposit,
              );
              const gapAmount = getDepositGap(vehicle.cashPrice, maxAdvance, deposit);

              return (
                <div
                  key={vehicle.stockId}
                  className="w-[min(19.5rem,82vw)] shrink-0 md:w-auto"
                >
                  <VehicleCard
                    featured
                    vehicle={vehicle}
                    monthly={getIllustratedMonthly(vehicle, deposit, term)}
                    state={state}
                    gapAmount={state === "ineligible" ? gapAmount : undefined}
                    term={term}
                    action={
                      <Button
                        href={getVehicleUrl(vehicle)}
                        variant="secondary"
                        className="btn-compact h-11! min-h-11! w-full border-[#002852]! bg-white text-[#002852] hover:bg-[#E7F1F8]"
                      >
                        {PX_LISTING_ACTION}
                      </Button>
                    }
                  />
                </div>
              );
            })}
          </ScrollRow>
        </Grid>
        <div className="mt-8 md:hidden">
          <Button href={routes.usedCars} variant="text">
            View all cars
          </Button>
        </div>
      </Container>
    </Section>
  );
}
