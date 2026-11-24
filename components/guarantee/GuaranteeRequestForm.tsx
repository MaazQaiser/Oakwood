"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field, Input, Select, Textarea } from "@/components/forms/FormControls";
import {
  GUARANTEE_REASON_OPTIONS,
  type GuaranteeReasonCode,
  guaranteeConfig,
} from "@/config/guarantee";
import { routes } from "@/config/routes";
import {
  lookupCollectionChargeAction,
  lookupGuaranteeRegistrationAction,
  submitGuaranteeRequestAction,
} from "@/features/guarantee/actions";
import { useSavedVehicles } from "@/features/saved/SavedVehiclesProvider";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import {
  collectionChargeForDistance,
  excessMilesUsed,
  formatGuaranteeMoney,
  refundAdminFeeLabel,
} from "@/lib/guarantee/format";
import { GUARANTEE_HANDOVERS } from "@/lib/guarantee/handovers";
import { mockVehicles } from "@/lib/mock/data";
import type {
  GuaranteeChoice,
  GuaranteeEligibilityResult,
  GuaranteePhotos,
  GuaranteeReturnMethod,
  GuaranteeSaleFixture,
} from "@/types/guarantee";

const PHOTO_SLOTS: Array<{ key: keyof GuaranteePhotos; label: string }> = [
  { key: "front_left", label: "Front left" },
  { key: "front_right", label: "Front right" },
  { key: "rear_left", label: "Rear left" },
  { key: "rear_right", label: "Rear right" },
  { key: "interior", label: "Interior" },
  { key: "dashboard", label: "Dashboard" },
];

function tomorrowIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}

export function GuaranteeRequestForm() {
  const { stockIds } = useSavedVehicles();
  const [pending, startTransition] = useTransition();
  const [registration, setRegistration] = useState("");
  const [eligibility, setEligibility] = useState<GuaranteeEligibilityResult | null>(
    null,
  );
  const [sale, setSale] = useState<GuaranteeSaleFixture | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [choice, setChoice] = useState<GuaranteeChoice>("exchange");
  const [reason, setReason] = useState<GuaranteeReasonCode | "">("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [photos, setPhotos] = useState<GuaranteePhotos>({});
  const [exchangeStockId, setExchangeStockId] = useState("");
  const [targetMonthly, setTargetMonthly] = useState("");
  const [returnMethod, setReturnMethod] = useState<GuaranteeReturnMethod>("drop_off");
  const [collectionPostcode, setCollectionPostcode] = useState("");
  const [collectionInfo, setCollectionInfo] = useState<{
    distanceMiles: number;
    charge: number;
  } | null>(null);
  const [preferredDate, setPreferredDate] = useState(tomorrowIso());
  const [insured, setInsured] = useState(false);
  const [noAccident, setNoAccident] = useState(false);
  const [allKeys, setAllKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    reference: string;
    id: string;
  } | null>(null);

  const savedOptions = useMemo(
    () => mockVehicles.filter((vehicle) => stockIds.includes(vehicle.stockId)),
    [stockIds],
  );
  const stockOptions = useMemo(
    () =>
      mockVehicles.filter(
        (vehicle) =>
          vehicle.availability === "available" &&
          vehicle.guaranteeEligible !== false,
      ),
    [],
  );

  const mileageSummary = useMemo(() => {
    if (!sale || !currentMileage) {
      return null;
    }
    const miles = Number(currentMileage);
    if (!Number.isFinite(miles)) {
      return null;
    }
    return excessMilesUsed(miles, sale.handoverMileage);
  }, [sale, currentMileage]);

  const routeIsStatutory = reason === "fault";

  function lookupRegistration() {
    setError(null);
    startTransition(() => {
      void lookupGuaranteeRegistrationAction(registration).then((result) => {
        setEligibility(result);
        if (result.ok && result.sale) {
          setSale(result.sale);
          setName(result.sale.customerName);
          setEmail(result.sale.email);
          setMobile(result.sale.mobile);
          if (result.refundBlockedByPriorRefund && choice === "refund") {
            setChoice("exchange");
          }
        } else {
          setSale(null);
        }
      });
    });
  }

  function lookupCollection() {
    startTransition(() => {
      void lookupCollectionChargeAction(collectionPostcode).then((result) => {
        if (!result.ok) {
          setCollectionInfo(null);
          setError(result.message);
          return;
        }
        setError(null);
        setCollectionInfo({
          distanceMiles: result.distanceMiles,
          charge: result.charge,
        });
      });
    });
  }

  function submit() {
    if (!sale || !reason) {
      setError("Match a registration and choose a reason before submitting.");
      return;
    }
    setError(null);
    startTransition(() => {
      void submitGuaranteeRequestAction({
        registration: sale.registration,
        name,
        email,
        mobile,
        currentMileage: Number(currentMileage),
        choice,
        reason,
        reasonDetail: reason === "other" ? reasonDetail : undefined,
        photos,
        exchangeStockId: choice === "exchange" ? exchangeStockId || undefined : undefined,
        targetMonthlyPayment:
          choice === "exchange" && targetMonthly
            ? Number(targetMonthly)
            : undefined,
        returnMethod,
        collectionPostcode:
          returnMethod === "collection" ? collectionPostcode : undefined,
        preferredReturnDateIso: preferredDate,
        insured,
        noAccidentOrModification: noAccident,
        allKeysAndItems: allKeys,
      }).then((result) => {
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setSubmitted({ reference: result.reference, id: result.id });
      });
    });
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-[22px] bg-white p-6 shadow-[0_10px_24px_rgba(16,40,72,0.06)] ring-1 ring-[#E7EEF4]">
        <p className="oak-eyebrow">Request received</p>
        <h2 className="text-h2">Reference {submitted.reference}</h2>
        <p className="text-body text-muted">
          Confirmation would be sent by email and SMS in production. In this
          prototype, keep this reference and open the staff screen to progress
          the request.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-body-sm text-muted">
          <li>A sales advisor calls within 1 working day.</li>
          <li>Return is booked once the exchange conversation is complete.</li>
          <li>Refunds, if chosen, follow inspection.</li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <Button href={routes.guaranteeRequests}>Open staff requests</Button>
          <Button href={routes.thirtyDayGuarantee} variant="secondary">
            Back to guarantee
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[22px] bg-[#F4F8FC] p-5 text-body-sm text-muted">
        <p className="font-semibold text-ink">Demo registrations</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {GUARANTEE_HANDOVERS.map((item) => (
            <li key={item.registration}>
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => setRegistration(item.registration)}
              >
                {item.registration}
              </button>
              {" — "}
              {item.saleType === "retail"
                ? item.previousGuaranteeRefundAtIso
                  ? "prior refund (exchange only)"
                  : item.finance
                    ? "finance + part exchange"
                    : item.handoverDateIso <
                        new Date(
                          Date.now() -
                            guaranteeConfig.periodDays * 86400000,
                        )
                          .toISOString()
                          .slice(0, 10)
                      ? `outside ${guaranteeConfig.periodDays} days`
                      : "eligible cash"
                : item.saleType}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
        <h2 className="text-h3">1. Find your sale</h2>
        <Field label="Registration" htmlFor="guar-reg">
          <Input
            id="guar-reg"
            value={registration}
            onChange={(event) => setRegistration(event.target.value.toUpperCase())}
            autoCapitalize="characters"
          />
        </Field>
        <Button type="button" onClick={lookupRegistration} busy={pending}>
          Check eligibility
        </Button>
        {eligibility ? (
          <Alert
            title={eligibility.ok ? "Eligible to continue" : "Not eligible"}
            tone={eligibility.ok ? "info" : "warning"}
          >
            <p>{eligibility.message}</p>
            {eligibility.refundBlockedByPriorRefund ? (
              <p className="mt-2">
                A refund has already been used in the last{" "}
                {guaranteeConfig.refundsPerCustomerMonths} months. Exchange is
                still available.
              </p>
            ) : null}
          </Alert>
        ) : null}
      </section>

      {sale && eligibility?.ok ? (
        <>
          <section className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
            <h2 className="text-h3">2. Your details</h2>
            <Field label="Name" htmlFor="guar-name">
              <Input id="guar-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email" htmlFor="guar-email">
              <Input
                id="guar-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Mobile" htmlFor="guar-mobile">
              <Input
                id="guar-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Field>
            <Field label="Current mileage" htmlFor="guar-miles">
              <Input
                id="guar-miles"
                inputMode="numeric"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(e.target.value)}
              />
            </Field>
            {mileageSummary ? (
              <p className="text-body-sm text-muted">
                {mileageSummary.used} miles used against{" "}
                {guaranteeConfig.mileageAllowance}. Excess{" "}
                {mileageSummary.excess} mile(s)
                {routeIsStatutory
                  ? " — no excess charge on a statutory route."
                  : mileageSummary.excess > 0
                    ? ` · ${formatGuaranteeMoney(mileageSummary.charge)} charge on a refund.`
                    : "."}
              </p>
            ) : null}

            <fieldset className="space-y-2">
              <legend className="text-label">Exchange or refund</legend>
              <label className="flex items-center gap-2 text-body-sm">
                <input
                  type="radio"
                  name="choice"
                  checked={choice === "exchange"}
                  onChange={() => setChoice("exchange")}
                />
                Exchange (listed first, no admin fee)
              </label>
              <label className="flex items-center gap-2 text-body-sm">
                <input
                  type="radio"
                  name="choice"
                  checked={choice === "refund"}
                  disabled={Boolean(eligibility.refundBlockedByPriorRefund)}
                  onChange={() => setChoice("refund")}
                />
                Refund
                {eligibility.refundBlockedByPriorRefund
                  ? " (not available — prior refund in 12 months)"
                  : ` (${refundAdminFeeLabel()} admin fee)`}
              </label>
            </fieldset>

            <Field label="Reason" htmlFor="guar-reason">
              <Select
                id="guar-reason"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as GuaranteeReasonCode | "")
                }
              >
                <option value="">Choose a reason</option>
                {GUARANTEE_REASON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            {reason === "other" ? (
              <Field label="Tell us more" htmlFor="guar-detail">
                <Textarea
                  id="guar-detail"
                  value={reasonDetail}
                  onChange={(e) => setReasonDetail(e.target.value)}
                />
              </Field>
            ) : null}
            {routeIsStatutory ? (
              <Alert title="Statutory route" tone="info">
                <p>
                  A fault or problem is logged as statutory. No admin fee or
                  mileage deductions apply. Aftersales is alerted. You can also
                  tell us about a statutory cancellation by phone, email or
                  letter — the form is not required for that.
                </p>
              </Alert>
            ) : null}

            {sale.finance || sale.partExchangeValue !== undefined ? (
              <div className="rounded-[14px] bg-[#F4F8FC] p-4 text-body-sm">
                <p className="font-semibold text-ink">From your deal</p>
                {sale.finance ? (
                  <p className="mt-1 text-muted">
                    Lender {sale.finance.lender} · agreement{" "}
                    {sale.finance.agreementDateIso}
                  </p>
                ) : null}
                {sale.partExchangeValue !== undefined ? (
                  <p className="mt-1 text-muted">
                    Part exchange value{" "}
                    {formatGuaranteeMoney(sale.partExchangeValue)}
                  </p>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
            <h2 className="text-h3">3. Photos</h2>
            <p className="text-body-sm text-muted">
              Required: four corners, interior, dashboard. Compared with handover
              photos before the return is booked.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {PHOTO_SLOTS.map((slot) => (
                <Field key={slot.key} label={slot.label} htmlFor={`photo-${slot.key}`}>
                  <Input
                    id={`photo-${slot.key}`}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      void readFileAsDataUrl(file).then((dataUrl) => {
                        setPhotos((prev) => ({ ...prev, [slot.key]: dataUrl }));
                      });
                    }}
                  />
                  {photos[slot.key] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photos[slot.key]}
                      alt={`${slot.label} preview`}
                      className="mt-2 h-24 w-full rounded-lg object-cover"
                    />
                  ) : null}
                </Field>
              ))}
            </div>
          </section>

          {choice === "exchange" ? (
            <section className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
              <h2 className="text-h3">4. Cars to swap to (optional)</h2>
              <Field label="From stock" htmlFor="guar-stock">
                <Select
                  id="guar-stock"
                  value={exchangeStockId}
                  onChange={(e) => setExchangeStockId(e.target.value)}
                >
                  <option value="">No preference yet</option>
                  {stockOptions.slice(0, 20).map((vehicle) => (
                    <option key={vehicle.stockId} value={vehicle.stockId}>
                      {vehicle.year} {vehicle.make} {vehicle.model} ·{" "}
                      {formatGuaranteeMoney(vehicle.monthlyPayment)}/mo
                    </option>
                  ))}
                </Select>
              </Field>
              {savedOptions.length > 0 ? (
                <Field label="From saved favourites" htmlFor="guar-saved">
                  <Select
                    id="guar-saved"
                    value={
                      savedOptions.some((v) => v.stockId === exchangeStockId)
                        ? exchangeStockId
                        : ""
                    }
                    onChange={(e) => setExchangeStockId(e.target.value)}
                  >
                    <option value="">Choose a saved car</option>
                    {savedOptions.map((vehicle) => (
                      <option key={vehicle.stockId} value={vehicle.stockId}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}
              <Field label="Target monthly payment" htmlFor="guar-target">
                <Input
                  id="guar-target"
                  inputMode="numeric"
                  value={targetMonthly}
                  onChange={(e) => setTargetMonthly(e.target.value)}
                />
              </Field>
            </section>
          ) : null}

          <section className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
            <h2 className="text-h3">5. Return</h2>
            <fieldset className="space-y-2">
              <legend className="text-label">Return method</legend>
              <label className="flex items-center gap-2 text-body-sm">
                <input
                  type="radio"
                  checked={returnMethod === "drop_off"}
                  onChange={() => setReturnMethod("drop_off")}
                />
                Drop off at {sale.sellingSiteName}
              </label>
              <label className="flex items-center gap-2 text-body-sm">
                <input
                  type="radio"
                  checked={returnMethod === "collection"}
                  onChange={() => setReturnMethod("collection")}
                />
                Collection
              </label>
            </fieldset>
            {returnMethod === "collection" ? (
              <div className="space-y-3">
                <Field label="Collection postcode" htmlFor="guar-pc">
                  <Input
                    id="guar-pc"
                    value={collectionPostcode}
                    onChange={(e) => setCollectionPostcode(e.target.value)}
                  />
                </Field>
                <Button type="button" variant="secondary" onClick={lookupCollection}>
                  Check collection charge
                </Button>
                {collectionInfo ? (
                  <p className="text-body-sm text-muted">
                    {collectionInfo.distanceMiles} miles from {sale.sellingSiteName}.
                    Charge{" "}
                    {formatGuaranteeMoney(
                      routeIsStatutory
                        ? 0
                        : collectionChargeForDistance(collectionInfo.distanceMiles),
                    )}{" "}
                    (miles beyond {guaranteeConfig.freeCollectionRadiusMiles}, both
                    ways).
                  </p>
                ) : null}
              </div>
            ) : null}
            <Field label="Preferred return date" htmlFor="guar-date">
              <Input
                id="guar-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </Field>
            <p className="text-caption text-muted">
              Within {guaranteeConfig.returnWithinHoursOfAcceptance} hours of
              acceptance unless we agree another time.
            </p>
          </section>

          <section className="space-y-3 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
            <h2 className="text-h3">6. Declarations</h2>
            <label className="flex items-start gap-2 text-body-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={insured}
                onChange={(e) => setInsured(e.target.checked)}
              />
              The car is insured by me until Oakwood takes it back.
            </label>
            <label className="flex items-start gap-2 text-body-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={noAccident}
                onChange={(e) => setNoAccident(e.target.checked)}
              />
              No accident or modification during the guarantee period.
            </label>
            <label className="flex items-start gap-2 text-body-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={allKeys}
                onChange={(e) => setAllKeys(e.target.checked)}
              />
              I still hold all keys and every item supplied with the car.
            </label>
          </section>

          {error ? (
            <Alert title="Could not submit" tone="warning">
              <p>{error}</p>
            </Alert>
          ) : null}

          <Button type="button" className="w-full" busy={pending} onClick={submit}>
            Submit guarantee request
          </Button>
          <p className="text-caption text-muted">
            {guaranteeCopy.footerLine}{" "}
            <Link
              href={routes.thirtyDayGuaranteeTerms}
              className="text-primary underline-offset-4 hover:underline"
            >
              Full terms
            </Link>
          </p>
        </>
      ) : null}
    </div>
  );
}
