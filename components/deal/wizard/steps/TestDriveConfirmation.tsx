"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { DealResultHero } from "@/components/deal/wizard/DealResultHero";
import { DealStep4Summary } from "@/components/deal/wizard/steps/DealStep4Summary";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { loadTestDriveConfirmation } from "@/features/deal/test-drive-confirmation";
import { reservationConfig } from "@/config/reservation";
import { getVehicleUrl } from "@/config/routes";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import {
  STEP4_BACK_HUB,
  STEP4_DONE,
  STEP4_TD_CHANNELS,
  STEP4_TD_CONFIRM_ERROR,
  STEP4_TD_CONFIRM_LOADING,
} from "@/lib/deal/step4-copy";
import type {
  TestDriveConfirmationModel,
  TestDriveConfirmationRequest,
} from "@/lib/deal/test-drive-confirmation";
import { formatNumber, formatPounds } from "@/lib/format/money";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { reservationCopy } from "@/lib/reservation/copy";

function downloadCalendar(model: TestDriveConfirmationModel) {
  if (!model.calendar) return;
  const url = URL.createObjectURL(
    new Blob([model.calendar], { type: "text/calendar" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = model.calendarFilename;
  link.click();
  URL.revokeObjectURL(url);
}

export function TestDriveConfirmation({
  request,
  onBack,
}: {
  request: TestDriveConfirmationRequest;
  onBack: () => void;
}) {
  const { dealId, vehicle, navigateTo } = useDealBuilder();
  const [attempt, setAttempt] = useState(0);
  const [model, setModel] = useState<TestDriveConfirmationModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void loadTestDriveConfirmation(request).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setModel(null);
        setError(result.error);
        return;
      }
      setModel(result.model);
    });
    return () => {
      cancelled = true;
    };
  }, [
    attempt,
    request.reference,
    request.stockId,
    request.showroomSlug,
    request.dateYmd,
    request.time,
    request.whenLabel,
    request.channels,
    request.vehicleTitle,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 text-center">
        <LoadingState label={STEP4_TD_CONFIRM_LOADING} />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-1 flex-col gap-4 pb-5">
        <Alert title={STEP4_TD_CONFIRM_ERROR} tone="warning">
          <p>{error ?? STEP4_TD_CONFIRM_ERROR}</p>
          <Button className="mt-3" size="sm" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </Button>
        </Alert>
        <DealStepFooter
          showMonthly={false}
          onBack={onBack}
          backLabel={STEP4_BACK_HUB}
          onContinue={() => navigateTo(getVehicleUrl(vehicle.slug))}
          continueLabel={STEP4_DONE}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 pb-5">
      <DealResultHero
        eyebrow="Test drive"
        title={model.statusLabel}
        body={model.body}
      />
      <DealStep4Summary />

      <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label">Your appointment</p>
        <dl className="mt-3 space-y-2 text-body-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Status</dt>
            <dd>{model.statusLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Showroom</dt>
            <dd>Oakwood {model.showroomName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">When</dt>
            <dd>{model.whenLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd>{model.reference}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-card bg-surface shadow-card">
        {model.imageSrc ? (
          <div className="relative aspect-[16/10] bg-page">
            <Image
              src={model.imageSrc}
              alt={model.imageAlt || model.vehicleTitle}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40rem, 100vw"
              unoptimized={model.imageSrc.endsWith(".svg")}
            />
          </div>
        ) : null}
        <div className="p-5 sm:p-6">
          <p className="text-label">Vehicle</p>
          <h2 className="mt-2 text-h3 text-navy">{model.vehicleTitle}</h2>
          {model.derivative ? (
            <p className="mt-1 text-body-sm text-muted">{model.derivative}</p>
          ) : null}
          <p className="mt-2 text-body-sm text-muted">
            {formatNumber(model.mileage)} miles
          </p>
          <p className="mt-2 text-label">{formatPounds(model.cashPrice)}</p>
        </div>
      </section>

      <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label">Walkaround video</p>
        {model.video ? (
          <video
            className="mt-3 aspect-video w-full rounded-xl bg-ink"
            controls
            preload="none"
            playsInline
            src={model.video.src}
          />
        ) : (
          <div className="mt-3">
            <Alert title="Video unavailable" tone="warning">
              <p>{model.videoNotice}</p>
              <Button
                className="mt-3"
                size="sm"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try again
              </Button>
            </Alert>
          </div>
        )}
      </section>

      <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label">Showroom</p>
        <p className="mt-2 flex items-start gap-2 text-body-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>
            {model.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </p>
        <p className="mt-2 text-caption text-muted">{model.addressNotice}</p>
        {model.telephone ? (
          <p className="mt-3 flex items-center gap-2 text-body-sm">
            <Phone className="h-4 w-4 text-primary" aria-hidden />
            <a
              href={`tel:${model.telephone.replace(/\s/g, "")}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {model.telephone}
            </a>
          </p>
        ) : (
          <p className="mt-3 text-body-sm text-muted">{model.phoneNotice}</p>
        )}
        {model.mapsUrl ? (
          <a
            href={model.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-page-tint px-4 text-body-sm font-semibold! text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Google Maps
          </a>
        ) : (
          <p className="mt-3 text-body-sm text-muted">{model.mapNotice}</p>
        )}
      </section>

      <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label">What to bring</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm">
          {model.bring.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label">Confirmation messages</p>
        <p className="mt-2 text-body-sm text-muted">{model.messagesNotice}</p>
        {model.channelsRequested ? (
          <p className="mt-2 text-caption text-muted">{STEP4_TD_CHANNELS}</p>
        ) : null}
        <div className="mt-4 space-y-4">
          <MessagePreview label="Email" body={model.email} />
          <MessagePreview label="SMS" body={model.sms} />
          <MessagePreview label="WhatsApp" body={model.whatsapp} />
          <MessagePreview label="Reminder, two hours before" body={model.reminder} />
        </div>
        {model.calendar ? (
          <Button className="mt-4" variant="secondary" onClick={() => downloadCalendar(model)}>
            Download calendar file
          </Button>
        ) : (
          <p className="mt-3 text-body-sm text-muted">
            A calendar file isn't available for this time.
          </p>
        )}
      </section>

      {vehicle.availability === "available" ? (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
          <p className="text-label">Reserve this car</p>
          <p className="mt-1 text-body-sm text-muted">
            {reservationCopy.fullyRefundable}. Holds the car for{" "}
            {formatHoldPeriod(reservationConfig.holdDurationDays)}. The{" "}
            {reservationAmountLabel(reservationConfig.amount)} is applied to the
            purchase.
          </p>
          <StartReservationButton
            className="mt-3 w-full sm:w-auto"
            stockId={vehicle.stockId}
            dealId={dealId}
          />
        </section>
      ) : null}

      <DealStepFooter
        showMonthly={false}
        onBack={onBack}
        backLabel={STEP4_BACK_HUB}
        onContinue={() => navigateTo(getVehicleUrl(vehicle.slug))}
        continueLabel={STEP4_DONE}
      />
    </div>
  );
}

function MessagePreview({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-caption text-muted">{label}</p>
      <pre className="mt-1 whitespace-pre-wrap font-sans text-body-sm text-ink">
        {body}
      </pre>
    </div>
  );
}
