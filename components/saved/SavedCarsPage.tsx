"use client";

import { VehicleCard } from "@/components/cards/Card";
import { Container, Grid, Section } from "@/components/layout/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { SaveVehicleButton } from "@/components/vehicle/SaveVehicleButton";
import { getVehicleUrl, routes } from "@/config/routes";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { useSavedVehicles } from "@/features/saved/SavedVehiclesProvider";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { resolveSavedVehicles } from "@/lib/saved/catalog";
import { createBreadcrumbs } from "@/lib/seo";

export function SavedCarsPage() {
  const { stockIds, ready } = useSavedVehicles();
  const finance = useCustomerFinance();
  const vehicles = resolveSavedVehicles(stockIds);
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Your cars", href: routes.savedCars },
  ]);

  return (
    <>
      <PageBanner
        title="Your cars"
        description={
          vehicles.length === 0
            ? "Cars you save with the heart stay in this list on this browser."
            : `${vehicles.length} saved ${vehicles.length === 1 ? "vehicle" : "vehicles"}.`
        }
        breadcrumbs={breadcrumbs}
      />
      <Section>
        <Container width="wide">
          {!ready ? (
            <p className="text-body-sm text-muted">Loading your cars…</p>
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="You haven't saved any cars yet."
              actions={<Button href={routes.usedCars}>Browse used cars</Button>}
            >
              Use the heart on a car to add it here.
            </EmptyState>
          ) : (
            <Grid columns="listing">
              {vehicles.map((vehicle) => {
                const state = getFinanceDisplayState(
                  finance.mode,
                  vehicle.cashPrice,
                  finance.maxAdvance,
                  finance.deposit,
                );
                return (
                  <VehicleCard
                    key={vehicle.stockId}
                    vehicle={vehicle}
                    monthly={getIllustratedMonthly(
                      vehicle,
                      finance.deposit,
                      finance.term,
                    )}
                    state={state}
                    gapAmount={
                      state === "ineligible"
                        ? getDepositGap(
                            vehicle.cashPrice,
                            finance.maxAdvance,
                            finance.deposit,
                          )
                        : undefined
                    }
                    term={finance.term}
                    toolbar={
                      <SaveVehicleButton
                        vehicleName={`${vehicle.make} ${vehicle.model}`}
                        stockId={vehicle.stockId}
                        category={vehicle.category}
                      />
                    }
                    action={
                      <Button href={getVehicleUrl(vehicle)} className="btn-compact w-full">
                        {vehicle.category === "van" ? "View van" : "View car"}
                      </Button>
                    }
                  />
                );
              })}
            </Grid>
          )}
        </Container>
      </Section>
    </>
  );
}
