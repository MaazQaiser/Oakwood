import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { routes } from "@/config/routes";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { ProvenanceFlag, VehicleDetail } from "@/types/vehicle-detail";

function Flag({ value }: { value: ProvenanceFlag }) {
  if (value === "clear") {
    return <Badge tone="success">Clear</Badge>;
  }
  if (value === "recorded") {
    return <Badge tone="warning">Recorded</Badge>;
  }
  return <Badge>Unknown</Badge>;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 py-2">
      <p className="text-body-sm text-muted">{label}</p>
      <div className="text-body-sm text-ink">{children}</div>
    </div>
  );
}

export function VehicleDocumentation({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <section
      id="vehicle-documentation"
      aria-labelledby="vehicle-docs-heading"
      className="rounded-lg border border-border bg-surface px-4 md:px-5"
    >
      <h2 id="vehicle-docs-heading" className="pt-5 text-h3">
        Vehicle history & condition
      </h2>
      <p className="mt-1 text-body-sm text-muted">
        Everything we have on this car is listed here, including items that need
        attention.
      </p>

      <Accordion title="MOT history" defaultOpen>
        <p>
          Latest MOT: {vehicle.mot.latestDate}
        </p>
        <p className="mt-1">Result: {vehicle.mot.latestResult}</p>
        <p className="mt-1">Mileage: {formatNumber(vehicle.mot.latestMileage)} miles</p>
        <details className="mt-3">
          <summary className="cursor-pointer text-primary">Test history</summary>
          <ul className="mt-3 space-y-4">
            {vehicle.mot.tests.map((test) => (
              <li key={`${test.date}-${test.mileage}`}>
                <p>
                  {test.date} · {test.result} · {formatNumber(test.mileage)} miles
                </p>
                {test.advisories.length > 0 ? (
                  <p className="mt-1">
                    Advisories: {test.advisories.join("; ")}
                  </p>
                ) : (
                  <p className="mt-1">No advisories recorded.</p>
                )}
                {test.failures.length > 0 ? (
                  <p className="mt-1">Failures: {test.failures.join("; ")}</p>
                ) : (
                  <p className="mt-1">No failures recorded on this test.</p>
                )}
              </li>
            ))}
          </ul>
        </details>
      </Accordion>

      <Accordion title="MOT status">
        <p>MOT valid until {vehicle.motStatus.validUntil}</p>
        {vehicle.motStatus.minimumCommitmentMonths ? (
          <p className="mt-2">
            Minimum MOT commitment: {vehicle.motStatus.minimumCommitmentMonths} months
          </p>
        ) : null}
      </Accordion>

      <Accordion title="Recall check">
        <p className="text-label">Safety recalls</p>
        <p className="mt-1">
          {vehicle.recalls.outstandingCount > 0
            ? `${vehicle.recalls.outstandingCount} outstanding recall${vehicle.recalls.outstandingCount === 1 ? "" : "s"}`
            : vehicle.recalls.summary}
        </p>
      </Accordion>

      <Accordion title="Provenance">
        <Row label="Outstanding finance">
          <Flag value={vehicle.provenance.outstandingFinance} />
        </Row>
        <Row label="Write-off status">
          <Flag value={vehicle.provenance.writeOff} />
        </Row>
        <Row label="Stolen marker">
          <Flag value={vehicle.provenance.stolen} />
        </Row>
        <Row label="Mileage anomaly">
          <Flag value={vehicle.provenance.mileageAnomaly} />
        </Row>
        <Row label="Plate changes">{vehicle.provenance.plateChanges}</Row>
        <Row label="Previous keepers">{vehicle.provenance.previousKeepers}</Row>
        {vehicle.provenance.notes ? (
          <p className="mt-2">{vehicle.provenance.notes}</p>
        ) : null}
      </Accordion>

      <Accordion title="Inspection certificate">
        <p>{vehicle.inspection.summary}</p>
        {vehicle.inspection.available ? (
          <details className="mt-3">
            <summary className="cursor-pointer text-primary">View inspection</summary>
            <p className="mt-2">
              Completed{vehicle.inspection.completedOn ? ` on ${vehicle.inspection.completedOn}` : ""}
              {vehicle.inspection.inspector ? ` by ${vehicle.inspection.inspector}` : ""}.
            </p>
          </details>
        ) : (
          <p className="mt-2">
            A certificate is not available for this vehicle in this preview.
          </p>
        )}
      </Accordion>

      {vehicle.batteryHealth ? (
        <Accordion title="Battery health">
          <p>{vehicle.batteryHealth.summary}</p>
          {vehicle.batteryHealth.stateOfHealthPercent !== undefined ? (
            <p className="mt-2">
              State of health: {vehicle.batteryHealth.stateOfHealthPercent}%
            </p>
          ) : null}
          {vehicle.batteryHealth.certificateAvailable ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-primary">View certificate</summary>
              <p className="mt-2">
                Battery health is recorded at {vehicle.batteryHealth.stateOfHealthPercent}%.
                A downloadable certificate is not connected in this preview.
              </p>
            </details>
          ) : (
            <p className="mt-2">Battery health certificate unavailable.</p>
          )}
        </Accordion>
      ) : null}

      <Accordion title="Preparation record">
        <p>
          {vehicle.preparation.completed
            ? "Preparation completed"
            : "Preparation record unavailable"}
        </p>
        {vehicle.preparation.technician ? (
          <p className="mt-1">Technician: {vehicle.preparation.technician}</p>
        ) : null}
        {vehicle.preparation.date ? (
          <p className="mt-1">Date: {vehicle.preparation.date}</p>
        ) : null}
        {vehicle.preparation.tyreTread ? (
          <p className="mt-1">Tyre tread: {vehicle.preparation.tyreTread}</p>
        ) : null}
        {vehicle.preparation.brakes ? (
          <p className="mt-1">Brake measurements: {vehicle.preparation.brakes}</p>
        ) : null}
        {vehicle.preparation.cambelt ? (
          <p className="mt-1">Cambelt status: {vehicle.preparation.cambelt}</p>
        ) : null}
        {vehicle.preparation.diagnosticScan ? (
          <p className="mt-1">Diagnostic scan: {vehicle.preparation.diagnosticScan}</p>
        ) : null}
      </Accordion>

      <Accordion title="Service history">
        <p>{vehicle.serviceHistory.summary}</p>
        {vehicle.serviceHistory.records.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {vehicle.serviceHistory.records.map((record) => (
              <li key={`${record.date}-${record.description}`}>
                {record.date} · {record.description}
                {record.mileage ? ` · ${formatNumber(record.mileage)} miles` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">No service history is available.</p>
        )}
      </Accordion>

      <Accordion title="Vehicle items">
        <p>{vehicle.vehicleItems.keys} keys</p>
        <p className="mt-1">{vehicle.vehicleItems.v5c ? "V5C present" : "V5C not confirmed"}</p>
        <p className="mt-1">
          {vehicle.vehicleItems.lockingWheelNut
            ? "Locking wheel nut present"
            : "Locking wheel nut not confirmed"}
        </p>
        {vehicle.vehicleItems.chargingCables !== undefined ? (
          <p className="mt-1">
            {vehicle.vehicleItems.chargingCables} charging cable
            {vehicle.vehicleItems.chargingCables === 1 ? "" : "s"}
          </p>
        ) : null}
      </Accordion>

      <Accordion title="Running costs">
        <Row label="Clean Air Zone status">{vehicle.runningCosts.cleanAirZone}</Row>
        <Row label="Road tax band">{vehicle.runningCosts.roadTaxBand}</Row>
        <Row label="Road tax cost">
          {vehicle.runningCosts.roadTaxCost === undefined
            ? "Not confirmed"
            : formatPounds(vehicle.runningCosts.roadTaxCost)}
        </Row>
        <Row label="Insurance group">
          {vehicle.runningCosts.insuranceGroup ?? "Not confirmed"}
        </Row>
      </Accordion>

      <Accordion title="Warranty">
        <p>{vehicle.warranty.summary}</p>
        <p className="mt-3 text-label">What is covered</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {vehicle.warranty.covered.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-label">How to claim</p>
        <p className="mt-1">{vehicle.warranty.howToClaim}</p>
        <p className="mt-3 text-label">Terms</p>
        <p className="mt-1">{vehicle.warranty.terms}</p>
        <p className="mt-3">
          <Link href={routes.warranty} className="text-primary underline-offset-4 hover:underline">
            Oakwood warranty
          </Link>
          {" · "}
          <Link
            href={routes.warrantyClaims}
            className="text-primary underline-offset-4 hover:underline"
          >
            Make a warranty claim
          </Link>
        </p>
      </Accordion>

      <Accordion title="Imperfections">
        {vehicle.imperfections.length === 0 ? (
          <p>No photographed imperfections recorded.</p>
        ) : (
          <ul className="mt-2 space-y-4">
            {vehicle.imperfections.map((item) => (
              <li key={item.id}>
                <div className="relative aspect-[16/10] max-w-sm overflow-hidden rounded-md bg-page">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 24rem"
                    loading="lazy"
                    unoptimized={item.image.src.endsWith(".svg")}
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-label">{item.location}</p>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Accordion>
    </section>
  );
}
