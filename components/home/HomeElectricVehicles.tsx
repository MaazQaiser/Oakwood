"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { VehicleCard } from "@/components/cards/Card";
import { Container, Grid, ScrollRow, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { homeElectricVehicles } from "@/lib/mock/home";
import { routes } from "@/config/routes";

export function HomeElectricVehicles() {
  const { mode, maxAdvance, deposit, term } = useCustomerFinance();

  return (
    <Section id="electric-stock" aria-label="Electric cars">
      <Container>
        <SectionIntro
          heading="Electric cars in stock"
          action={
            homeElectricVehicles.length > 0 ? (
              <div className="hidden md:block">
                <Button href={routes.electricCars} variant="outline">
                  View all electric cars
                </Button>
              </div>
            ) : undefined
          }
        >
          AA-inspected used EVs with battery health information where available.
        </SectionIntro>

        {homeElectricVehicles.length === 0 ? (
          <EmptyState
            className="mt-8"
            title="No electric cars to show right now."
            actions={
              <Button href={routes.electricCars} variant="outline">
                View electric stock
              </Button>
            }
          >
            Check back soon or browse the full range.
          </EmptyState>
        ) : (
          <Grid columns="featured" className="mt-8 md:grid xl:grid-cols-3!">
            <ScrollRow className="md:contents">
              {homeElectricVehicles.map((vehicle) => {
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
                    />
                  </div>
                );
              })}
            </ScrollRow>
          </Grid>
        )}
        {homeElectricVehicles.length > 0 ? (
          <div className="mt-8 md:hidden">
            <Button href={routes.electricCars} variant="outline">
              View all electric cars
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}