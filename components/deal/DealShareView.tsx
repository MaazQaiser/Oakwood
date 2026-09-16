import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Container, Section } from "@/components/layout/Container";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { getUsedCarsUrl } from "@/config/routes";
import { DEAL_SHARE_INTRO } from "@/lib/deal/copy";
import type { DealShareSnapshot } from "@/types/deal";

export function DealShareView({ snapshot }: { snapshot: DealShareSnapshot | null }) {
  if (!snapshot) {
    return (
      <Section>
        <Container width="narrow">
          <h1 className="text-h2">This shared deal is no longer available.</h1>
          <p className="mt-3 text-body text-muted">
            Shared summaries expire and never include a finance profile.
          </p>
          <div className="mt-8">
            <Button href={getUsedCarsUrl()}>Browse cars</Button>
          </div>
        </Container>
      </Section>
    );
  }

  const { vehicle, configuration } = snapshot;

  return (
    <Section>
      <Container width="narrow">
        <h1 className="text-h2">Shared deal summary</h1>
        <p className="mt-3 text-body text-muted">{DEAL_SHARE_INTRO}</p>
        <dl className="mt-6 space-y-2 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Vehicle</dt>
            <dd>
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.derivative ? ` ${vehicle.derivative}` : ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Cash price</dt>
            <dd>
              <FinancialNumber value={formatPounds(vehicle.cashPrice)} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Location</dt>
            <dd>{vehicle.locationName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Finance type</dt>
            <dd>{configuration.financeType === "pcp" ? "PCP" : "HP"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Term</dt>
            <dd>{formatTerm(configuration.term)}</dd>
          </div>
          {configuration.annualMileage ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Annual mileage</dt>
              <dd>{configuration.annualMileage.toLocaleString("en-GB")} miles</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Cash deposit</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(configuration.cashDeposit)}
                size="sm"
              />
            </dd>
          </div>
          {configuration.productNames.length ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Optional products</dt>
              <dd>{configuration.productNames.join(", ")}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Optional products</dt>
              <dd>None selected</dd>
            </div>
          )}
        </dl>
        <div className="mt-8">
          <Button href={getUsedCarsUrl()}>Browse cars at Oakwood</Button>
        </div>
      </Container>
    </Section>
  );
}
