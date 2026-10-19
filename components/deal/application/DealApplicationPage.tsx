"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  DealBuilderProvider,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";
import { DealFailureState } from "@/components/deal/DealFailureState";
import { DealApplicationFlow } from "@/components/deal/application/DealApplicationFlow";
import { DealPinnedVehicle } from "@/components/deal/wizard/DealPinnedVehicle";
import { JourneyChrome } from "@/components/layout/JourneyChrome";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getDealUrl, getVehicleUrl } from "@/config/routes";
import type { DealPageModel } from "@/types/deal";

function ApplicationInner() {
  const { vehicle, dealId, phase } = useDealBuilder();

  return (
    <>
      <JourneyChrome />
      <div className="flex min-h-[calc(100dvh-var(--oak-header-height))] flex-col bg-page-tint lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-6 lg:pt-6">
        <div className="sticky top-[var(--oak-header-height)] z-20 space-y-2.5 bg-surface px-4 pt-2.5 pb-3 shadow-card lg:hidden">
          <Link
            href={getVehicleUrl(vehicle.slug)}
            aria-label={`Back to the ${vehicle.make} ${vehicle.model} page`}
            className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <DealPinnedVehicle
              layout="strip"
              trailing={
                <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 text-caption font-semibold! text-navy">
                  Apply
                </span>
              }
            />
          </Link>
        </div>

        <aside className="hidden lg:sticky lg:top-[calc(var(--oak-header-height)+1.5rem)] lg:flex lg:max-h-[calc(100dvh-var(--oak-header-height)-3rem)] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:rounded-card lg:bg-surface lg:p-4 lg:shadow-card">
          <DealPinnedVehicle layout="card" />
          <p className="text-caption text-muted">
            Your selected deal stays pinned while you apply. This is outside the
            four-step builder progress.
          </p>
          <Button
            href={getDealUrl(dealId, "reserve")}
            variant="text"
            className="min-h-9 self-start px-1 text-caption"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to next step
          </Button>
          <Button
            href={getVehicleUrl(vehicle.slug)}
            variant="text"
            className="min-h-9 self-start px-1 text-caption"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to vehicle
          </Button>
        </aside>

        <section className="deal-wizard flex min-w-0 flex-1 flex-col lg:min-h-[calc(100dvh-var(--oak-header-height)-1.5rem)]">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 sm:px-6 lg:px-0">
            {phase === "VEHICLE_UNAVAILABLE" ? (
              <div className="pb-3 pt-6">
                <DealFailureState kind="vehicle" />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col pt-6 lg:pt-2">
              <DealApplicationFlow />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function DealApplicationPage({ model }: { model: DealPageModel }) {
  if (model.status !== "ready" || !model.vehicle || !model.draft) {
    return (
      <>
        <JourneyChrome />
        <div className="px-[var(--oak-page-x)] py-6">
          <Container width="narrow" className="px-0">
            <DealFailureState
              kind={
                model.status === "expired"
                  ? "session"
                  : model.status === "not_found" && !model.vehicle
                    ? "not_found"
                    : "vehicle"
              }
            />
            <p className="mt-4 text-caption text-muted">
              Return to a vehicle to build a deal before applying for finance.
            </p>
          </Container>
        </div>
      </>
    );
  }

  return (
    <DealBuilderProvider model={model}>
      <ApplicationInner />
    </DealBuilderProvider>
  );
}
