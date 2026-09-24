"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { VehicleCard } from "@/components/cards/Card";
import { Container, Grid, Inline, ScrollRow, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { featuredVehicles } from "@/lib/mock/home";
import { getSearchUrl, routes } from "@/config/routes";

export function FeaturedVehicles() {
  const { mode, maxAdvance, deposit, term, setAssumptionsOpen } = useCustomerFinance();
  const eligible = mode === "personalised";
  const ineligible = mode === "ineligible";

  return (
    <Section>
      <Container>
        <SectionIntro
          eyebrow={eligible ? "Picked for you" : "Popular right now"}
          heading={
            eligible
              ? "Cars that fit your finance profile."
              : "Cars worth taking a look at."
          }
          action={
            featuredVehicles.length > 0 ? (
              <Button href={routes.usedCars} variant="text" className="hidden md:inline-flex">
                View all cars
              </Button>
            ) : undefined
          }
        >
          {eligible
            ? "These vehicles are within the finance profile you've already checked."
            : "Explore some of the cars customers are viewing today."}
        </SectionIntro>

        {ineligible ? (
          <div className="mt-6">
            <Alert title="Some cars may be outside your current finance profile." tone="warning">
              You can still view every vehicle. A larger deposit or a lower-priced car may bring more options within reach.
            </Alert>
            <Inline className="mt-4">
              <Button href={getSearchUrl({ monthly_max: 250 })} variant="secondary">
                View cars within budget
              </Button>
              <Button variant="tertiary" onClick={() => setAssumptionsOpen(true)}>
                Change deposit
              </Button>
              <Button href={getSearchUrl({ max_price: 15000 })} variant="text">
                Explore lower-priced cars
              </Button>
              <Button href={routes.getAQuote} variant="text">
                Speak to Oakwood
              </Button>
            </Inline>
          </div>
        ) : null}

        {featuredVehicles.length === 0 ? (
          <EmptyState
            className="mt-8"
            title="No featured cars to show right now."
            actions={
              <Button href={routes.usedCars} variant="secondary">
                View all cars
              </Button>
            }
          >
            You can still browse the full Oakwood range.
          </EmptyState>
        ) : (
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
                    monthly={getIllustratedMonthly(
                      vehicle,
                      deposit,
                      term,
                    )}
                    state={state}
                    gapAmount={state === "ineligible" ? gapAmount : undefined}
                  />
                </div>
              );
            })}
          </ScrollRow>
        </Grid>
        )}
        {featuredVehicles.length > 0 ? (
        <div className="mt-8 md:hidden">
          <Button href={routes.usedCars} variant="text">
            View all cars
          </Button>
        </div>
        ) : null}
        {mode === "anonymous" ? (
          <p className="mt-4 max-w-2xl text-caption text-muted">
            Monthly figures are a representative example. Check eligibility to
            see personalised pricing.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
