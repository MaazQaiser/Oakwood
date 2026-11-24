"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { routes } from "@/config/routes";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { OAKWOOD_WARRANTY_VEHICLE_SUMMARY } from "@/lib/warranty/copy";
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

const DEFAULT_AA_CHECKLIST = [
  { category: "Exterior", check: "Panels and paint", result: "Pass" as const },
  { category: "Wheels", check: "Tyre tread and pressure", result: "Advisory" as const },
  { category: "Brakes", check: "Discs and pads", result: "Pass" as const },
  { category: "Underbody", check: "Corrosion check", result: "Pass" as const },
  { category: "Interior", check: "Controls and warning lights", result: "Pass" as const },
];

export function VehicleDocumentation({ vehicle }: { vehicle: VehicleDetail }) {
  const checklist =
    vehicle.inspection.checklist ??
    (vehicle.inspection.available ? DEFAULT_AA_CHECKLIST : []);

  const vehicleCheck = vehicle.vehicleCheck ?? {
    summary: "Vehicle check completed",
    items: [
      { label: "Outstanding finance", value: "Clear" },
      { label: "Write-off status", value: "Clear" },
      { label: "Stolen marker", value: "Clear" },
      { label: "Mileage anomaly", value: "Clear" },
      {
        label: "Safety recalls",
        value:
          vehicle.recalls.outstandingCount > 0
            ? `${vehicle.recalls.outstandingCount} outstanding`
            : vehicle.recalls.summary,
      },
    ],
  };

  const paperworkTabs = [
    {
      id: "aa-checklist",
      label: "AA checklist",
      content: vehicle.inspection.available ? (
        <div>
          <p className="text-body-sm text-ink">{vehicle.inspection.summary}</p>
          {vehicle.inspection.result ? (
            <p className="mt-2 text-body-sm">
              Result: <Badge tone="success">{vehicle.inspection.result}</Badge>
            </p>
          ) : null}
          {vehicle.inspection.completedOn ? (
            <p className="mt-1 text-caption text-muted">
              Completed {vehicle.inspection.completedOn}
              {vehicle.inspection.inspector
                ? ` · ${vehicle.inspection.inspector}`
                : ""}
            </p>
          ) : null}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-label text-muted">
                  <th className="pb-2 pr-3 font-medium">Category</th>
                  <th className="pb-2 pr-3 font-medium">Check</th>
                  <th className="pb-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((row) => (
                  <tr key={`${row.category}-${row.check}`} className="border-b border-border/60">
                    <td className="py-2 pr-3">{row.category}</td>
                    <td className="py-2 pr-3">{row.check}</td>
                    <td className="py-2">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-body-sm text-muted">
          An AA inspection checklist is not available for this vehicle in this preview.
        </p>
      ),
    },
    {
      id: "mot",
      label: "MOT expiry",
      content: (
        <div>
          <p>MOT valid until {vehicle.motStatus.validUntil}</p>
          <p className="mt-2">
            Latest test: {vehicle.mot.latestDate} · {vehicle.mot.latestResult} ·{" "}
            {formatNumber(vehicle.mot.latestMileage)} miles
          </p>
          {vehicle.motStatus.minimumCommitmentMonths ? (
            <p className="mt-2">
              Minimum MOT commitment: {vehicle.motStatus.minimumCommitmentMonths} months
            </p>
          ) : null}
          <details className="mt-3">
            <summary className="cursor-pointer text-primary">Full MOT history</summary>
            <ul className="mt-3 space-y-4">
              {vehicle.mot.tests.map((test) => (
                <li key={`${test.date}-${test.mileage}`}>
                  <p>
                    {test.date} · {test.result} · {formatNumber(test.mileage)} miles
                  </p>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ),
    },
    {
      id: "service",
      label: "Service history",
      content: (
        <div>
          <p>{vehicle.serviceHistory.summary}</p>
          {vehicle.serviceHistory.records.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[18rem] text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border text-label text-muted">
                    <th className="pb-2 pr-3 font-medium">Date</th>
                    <th className="pb-2 pr-3 font-medium">Description</th>
                    <th className="pb-2 font-medium">Mileage</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.serviceHistory.records.map((record) => (
                    <tr
                      key={`${record.date}-${record.description}`}
                      className="border-b border-border/60"
                    >
                      <td className="py-2 pr-3">{record.date}</td>
                      <td className="py-2 pr-3">{record.description}</td>
                      <td className="py-2">
                        {record.mileage ? `${formatNumber(record.mileage)} mi` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2">No service history is available.</p>
          )}
        </div>
      ),
    },
    {
      id: "vehicle-check",
      label: "Vehicle check",
      content: (
        <div>
          <p>{vehicleCheck.summary}</p>
          <div className="mt-3">
            {vehicleCheck.items.map((item) => (
              <Row key={item.label} label={item.label}>
                {item.value}
              </Row>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <Row label="Plate changes">{vehicle.provenance.plateChanges}</Row>
            <Row label="Previous keepers">{vehicle.provenance.previousKeepers}</Row>
            {vehicle.provenance.notes ? (
              <p className="mt-2 text-body-sm">{vehicle.provenance.notes}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "v5-keys",
      label: "V5 and keys",
      content: (
        <div className="space-y-1 text-body-sm">
          <p>{vehicle.vehicleItems.keys} keys</p>
          <p>{vehicle.vehicleItems.v5c ? "V5C present" : "V5C not confirmed"}</p>
          <p>
            {vehicle.vehicleItems.lockingWheelNut
              ? "Locking wheel nut present"
              : "Locking wheel nut not confirmed"}
          </p>
          {vehicle.vehicleItems.chargingCables !== undefined ? (
            <p>
              {vehicle.vehicleItems.chargingCables} charging cable
              {vehicle.vehicleItems.chargingCables === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section
      id="vehicle-documentation"
      aria-labelledby="vehicle-docs-heading"
    >
      <h2
        id="vehicle-docs-heading"
        className="text-[1.75rem] font-medium leading-[1.15em] tracking-[-0.03em] text-navy sm:text-[2rem]"
      >
        Paperwork
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        Every document for this car, in one place.
      </p>
      <div className="mt-6 rounded-[24px] bg-white px-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4] md:px-6 [&>*:last-child]:border-b-0">
        <Tabs items={paperworkTabs} label="Vehicle paperwork" />

        {vehicle.batteryHealth ? (
          <Accordion title="Battery health">
            <p>{vehicle.batteryHealth.summary}</p>
            {vehicle.batteryHealth.stateOfHealthPercent !== undefined ? (
              <p className="mt-2">
                State of health: {vehicle.batteryHealth.stateOfHealthPercent}%
              </p>
            ) : null}
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
        </Accordion>

        <Accordion title="Running costs">
          <Row label="Clean Air Zone status">{vehicle.runningCosts.cleanAirZone}</Row>
          <Row label="Road tax band">{vehicle.runningCosts.roadTaxBand}</Row>
          <Row label="Road tax cost">
            {vehicle.runningCosts.roadTaxCost === undefined
              ? "Not confirmed"
              : formatPounds(vehicle.runningCosts.roadTaxCost)}
          </Row>
        </Accordion>

        <Accordion title="Warranty">
          <p>{vehicle.warranty.summary || OAKWOOD_WARRANTY_VEHICLE_SUMMARY}</p>
          <p className="mt-3">
            <Link href={routes.warranty} className="text-primary underline-offset-4 hover:underline">
              Oakwood warranty
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
      </div>
    </section>
  );
}