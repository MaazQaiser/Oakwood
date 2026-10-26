"use client";

import { useEffect, useId } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/Loading";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { PxVehicleSummary } from "@/components/part-exchange/PxVehicleSummary";
import { PxValuationResult } from "@/components/part-exchange/PxValuationResult";
import { Alert } from "@/components/ui/Alert";
import { useValuationEntry } from "@/components/valuation-entry/useValuationEntry";
import { VE_EXTRA_OPTIONS } from "@/lib/valuation-entry/extras";
import {
  VE_BACK,
  VE_CARD_REASSURANCE,
  VE_CONDITION_HEADING,
  VE_CONFIRM_CTA,
  VE_CONFIRM_HEADING,
  VE_CONFIRM_SUPPORT,
  VE_CONTINUE,
  VE_EMAIL_CONFIRM,
  VE_EMAIL_HEADING,
  VE_EMAIL_SUPPORT,
  VE_EXIT_CONTINUE,
  VE_EXIT_DECLINE,
  VE_EXIT_EMAIL,
  VE_EXIT_SAVE,
  VE_EXTRAS_HEADING,
  VE_EXTRAS_SUPPORT,
  VE_FINANCE_AMOUNT_LABEL,
  VE_FINANCE_HEADING,
  VE_FINANCE_LENDER_LABEL,
  VE_INSPECTION_NOTE,
  VE_LOOKUP_ERROR_MANUAL,
  VE_LOOKUP_ERROR_RETRY,
  VE_LOOKUP_LABEL,
  VE_MANUAL_HEADING,
  VE_MANUAL_SUPPORT,
  VE_MOCK_BADGE,
  VE_NOT_MY_CAR,
  VE_OTHER_DETAILS,
  VE_PRIVATE_PLATE_LABEL,
  VE_PRIVATE_RETAIN,
  VE_PRIVATE_SELL,
  VE_RESULT_HEADING,
  VE_RESULT_SUPPORT,
  VE_SAVE_CONFIRM,
  VE_SAVE_HEADING,
  VE_SAVE_RESUME_LABEL,
  VE_SAVE_SUPPORT,
  VE_SERVICE_HEADING,
  VE_VALUING_LABEL,
} from "@/lib/valuation-entry/copy";
import {
  negativeEquityBlocksDeal,
  partExchangePosition,
} from "@/lib/deal/valuation";
import {
  DEAL_PX_CALLBACK,
  DEAL_PX_EQUITY_LABEL,
  DEAL_PX_FINANCE_LABEL,
  DEAL_PX_NEGATIVE_BLOCKED,
  DEAL_PX_NEGATIVE_INCLUDED,
  DEAL_PX_SHORTFALL_LABEL,
  DEAL_PX_TOTAL_LABEL,
  DEAL_PX_VALUATION_LABEL,
} from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { formatRegistration, parsePounds } from "@/lib/part-exchange/validation";
import { cn } from "@/lib/cn";
import type { DealPxCondition, DealPxServiceHistory } from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";
import type { PxIdentifiedVehicle } from "@/types/part-exchange";

const CONDITION_OPTIONS: { value: DealPxCondition; label: string }[] = [
  { value: "needs-work", label: "Rough" },
  { value: "average", label: "Average" },
  { value: "good", label: "Good" },
  { value: "excellent", label: "Immaculate" },
];

const SERVICE_OPTIONS: { value: DealPxServiceHistory; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
  { value: "none", label: "None" },
];

export function ValuationEntryFlow({
  stockId,
  initialRegistration,
  initialMileage,
  cashDeposit,
  term,
  financeType,
  initialVehicle,
  onReachedResult,
  onRequestDecline,
  onCloseRequest,
}: {
  stockId: string;
  initialRegistration: string;
  initialMileage: string;
  cashDeposit?: number;
  term?: number;
  financeType?: FinanceProductType;
  initialVehicle?: PxIdentifiedVehicle;
  onReachedResult?: () => void;
  onRequestDecline: () => void;
  onCloseRequest: (opts: { fromResult: boolean }) => void;
}) {
  const flow = useValuationEntry({
    stockId,
    initialRegistration,
    initialMileage,
    cashDeposit,
    term,
    financeType,
    initialVehicle,
    onCloseRequest,
  });

  useEffect(() => {
    if (flow.step === "result") {
      onReachedResult?.();
    }
  }, [flow.step, onReachedResult]);

  const regId = useId();
  const milesId = useId();
  const settleId = useId();
  const lenderId = useId();
  const otherId = useId();

  const heading =
    flow.step === "lookup"
      ? VE_LOOKUP_LABEL
      : flow.step === "error"
        ? "We couldn't find that registration"
        : flow.step === "vehicle"
          ? VE_CONFIRM_HEADING
          : flow.step === "manual"
            ? VE_MANUAL_HEADING
            : flow.step === "condition"
              ? VE_CONDITION_HEADING
              : flow.step === "service"
                ? VE_SERVICE_HEADING
                : flow.step === "extras"
                  ? VE_EXTRAS_HEADING
                  : flow.step === "finance"
                    ? VE_FINANCE_HEADING
                    : flow.step === "valuing"
                      ? VE_VALUING_LABEL
                      : VE_RESULT_HEADING;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col pb-4">
      <p className="text-caption font-semibold uppercase tracking-[0.06em] text-muted">
        {VE_MOCK_BADGE}
      </p>
      <h1 className="mt-2 text-h2 text-navy">{heading}</h1>
      {flow.step === "vehicle" ? (
        <p className="mt-2 text-body-sm text-muted">{VE_CONFIRM_SUPPORT}</p>
      ) : null}
      {flow.step === "manual" ? (
        <p className="mt-2 text-body-sm text-muted">{VE_MANUAL_SUPPORT}</p>
      ) : null}
      {flow.step === "extras" ? (
        <p className="mt-2 text-body-sm text-muted">{VE_EXTRAS_SUPPORT}</p>
      ) : null}
      {flow.step === "result" ? (
        <p className="mt-2 text-body-sm text-muted">{VE_RESULT_SUPPORT}</p>
      ) : null}

      {flow.step === "lookup" || flow.step === "valuing" ? (
        <div className="mt-8">
          <LoadingState
            label={flow.step === "lookup" ? VE_LOOKUP_LABEL : VE_VALUING_LABEL}
          />
        </div>
      ) : null}

      {flow.step === "error" ? (
        <div className="mt-6 space-y-4">
          <Alert title="Lookup unavailable" tone="warning">
            {flow.lookupError ?? "Please check the registration and try again."}
          </Alert>
          <div className="grid grid-cols-2 gap-3">
            <Field htmlFor={regId} label="Registration">
              <Input
                id={regId}
                className="font-semibold! tracking-wider uppercase"
                value={formatRegistration(flow.registration)}
                onChange={(event) => flow.setRegistration(event.target.value)}
              />
            </Field>
            <Field htmlFor={milesId} label="Mileage">
              <Input
                id={milesId}
                inputMode="numeric"
                value={flow.mileage}
                onChange={(event) => flow.setMileage(event.target.value)}
              />
            </Field>
          </div>
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <Button onClick={flow.retryLookup}>{VE_LOOKUP_ERROR_RETRY}</Button>
            <Button variant="secondary" onClick={flow.enterManual}>
              {VE_LOOKUP_ERROR_MANUAL}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "vehicle" && flow.vehicle ? (
        <div className="mt-4 space-y-4">
          <PxVehicleSummary vehicle={flow.vehicle} mileage={flow.miles} />
          <p className="text-caption text-muted">
            {formatRegistration(flow.registration)}
          </p>
          <Button className="w-full" onClick={() => void flow.confirmVehicle()}>
            {VE_CONFIRM_CTA}
          </Button>
          <Button variant="text" className="px-0" onClick={flow.enterManual}>
            {VE_NOT_MY_CAR}
          </Button>
        </div>
      ) : null}

      {flow.step === "manual" ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field htmlFor={`${regId}-year`} label="Year">
              <Input
                id={`${regId}-year`}
                inputMode="numeric"
                value={flow.manual.year}
                onChange={(event) =>
                  flow.setManual((current) => ({
                    ...current,
                    year: event.target.value,
                  }))
                }
              />
            </Field>
            <Field htmlFor={`${regId}-make`} label="Make">
              <Input
                id={`${regId}-make`}
                value={flow.manual.make}
                onChange={(event) =>
                  flow.setManual((current) => ({
                    ...current,
                    make: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
          <Field htmlFor={`${regId}-model`} label="Model">
            <Input
              id={`${regId}-model`}
              value={flow.manual.model}
              onChange={(event) =>
                flow.setManual((current) => ({
                  ...current,
                  model: event.target.value,
                }))
              }
            />
          </Field>
          <Field htmlFor={`${regId}-variant`} label="Variant (optional)">
            <Input
              id={`${regId}-variant`}
              value={flow.manual.variant}
              onChange={(event) =>
                flow.setManual((current) => ({
                  ...current,
                  variant: event.target.value,
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field htmlFor={`${regId}-fuel`} label="Fuel">
              <Select
                id={`${regId}-fuel`}
                value={flow.manual.fuelType}
                onChange={(event) =>
                  flow.setManual((current) => ({
                    ...current,
                    fuelType: event.target.value,
                  }))
                }
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </Select>
            </Field>
            <Field htmlFor={`${regId}-gear`} label="Transmission">
              <Select
                id={`${regId}-gear`}
                value={flow.manual.transmission}
                onChange={(event) =>
                  flow.setManual((current) => ({
                    ...current,
                    transmission: event.target.value,
                  }))
                }
              >
                <option>Manual</option>
                <option>Automatic</option>
              </Select>
            </Field>
          </div>
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={flow.goBack}>
              {VE_BACK}
            </Button>
            <Button className="flex-1" onClick={flow.saveManual}>
              {VE_CONTINUE}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "condition" ? (
        <div className="mt-5 space-y-4">
          <DealChipGroup
            label="Condition"
            value={flow.condition}
            options={CONDITION_OPTIONS}
            columns={2}
            onChange={(value) => {
              flow.setCondition(value);
              flow.setFieldError(undefined);
            }}
          />
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={flow.goBack}>
              {VE_BACK}
            </Button>
            <Button className="flex-1" onClick={flow.continueCondition}>
              {VE_CONTINUE}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "service" ? (
        <div className="mt-5 space-y-4">
          <DealChipGroup
            label="Service history"
            value={flow.serviceHistory}
            options={SERVICE_OPTIONS}
            columns={3}
            onChange={(value) => {
              flow.setServiceHistory(value);
              flow.setFieldError(undefined);
            }}
          />
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={flow.goBack}>
              {VE_BACK}
            </Button>
            <Button className="flex-1" onClick={flow.continueService}>
              {VE_CONTINUE}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "extras" ? (
        <div className="mt-5 space-y-4">
          <fieldset>
            <legend className="text-label">Extras</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {VE_EXTRA_OPTIONS.map((option) => {
                const selected = flow.extras.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border px-2 text-center text-body-sm transition-colors",
                      selected
                        ? "border-primary bg-primary font-semibold! text-white"
                        : "border-transparent bg-page-tint text-ink hover:bg-surface-soft",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected}
                      onChange={() => flow.toggleExtra(option.id)}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          {flow.extras.includes("private-plate") ? (
            <DealChipGroup
              label={VE_PRIVATE_PLATE_LABEL}
              value={flow.privatePlateDisposition}
              options={[
                { value: "retain", label: VE_PRIVATE_RETAIN },
                { value: "sell", label: VE_PRIVATE_SELL },
              ]}
              columns={2}
              onChange={(value) => {
                flow.setPrivatePlateDisposition(value);
                flow.setFieldError(undefined);
              }}
            />
          ) : null}
          {flow.extras.includes("other") ? (
            <Field htmlFor={otherId} label={VE_OTHER_DETAILS}>
              <Input
                id={otherId}
                value={flow.otherNotes}
                onChange={(event) => flow.setOtherNotes(event.target.value)}
              />
            </Field>
          ) : null}
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={flow.goBack}>
              {VE_BACK}
            </Button>
            <Button className="flex-1" onClick={flow.continueExtras}>
              {VE_CONTINUE}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "finance" ? (
        <div className="mt-5 space-y-4">
          <DealChipGroup
            label="Outstanding finance"
            value={
              flow.financeOutstanding === undefined
                ? undefined
                : flow.financeOutstanding
                  ? "yes"
                  : "no"
            }
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            columns={2}
            onChange={(value) => {
              flow.setFinanceOutstanding(value === "yes");
              if (value === "no") {
                flow.setSettlement("");
                flow.setLender("");
              }
              flow.setFieldError(undefined);
            }}
          />
          {flow.financeOutstanding ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field htmlFor={settleId} label={VE_FINANCE_AMOUNT_LABEL}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                    £
                  </span>
                  <Input
                    id={settleId}
                    className="pl-7"
                    inputMode="numeric"
                    value={flow.settlement}
                    onChange={(event) => flow.setSettlement(event.target.value)}
                  />
                </div>
              </Field>
              <Field htmlFor={lenderId} label={VE_FINANCE_LENDER_LABEL}>
                <Input
                  id={lenderId}
                  value={flow.lender}
                  placeholder="e.g. Black Horse"
                  onChange={(event) => flow.setLender(event.target.value)}
                />
              </Field>
            </div>
          ) : null}
          {flow.fieldError ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={flow.goBack}>
              {VE_BACK}
            </Button>
            <Button
              className="flex-1"
              onClick={() => void flow.continueFinance()}
            >
              {VE_CONTINUE}
            </Button>
          </div>
        </div>
      ) : null}

      {flow.step === "result" && flow.valuation ? (
        <ResultStep flow={flow} onRequestDecline={onRequestDecline} />
      ) : null}
    </div>
  );
}

function ResultStep({
  flow,
  onRequestDecline,
}: {
  flow: ReturnType<typeof useValuationEntry>;
  onRequestDecline: () => void;
}) {
  const emailId = useId();
  const phoneId = useId();
  if (!flow.valuation) {
    return null;
  }
  const settlement = flow.financeOutstanding
    ? parsePounds(flow.settlement) ?? 0
    : 0;
  const position = partExchangePosition(flow.valuation.estimatedValue, settlement);
  const blocked = negativeEquityBlocksDeal(position.negativeEquity);

  return (
        <div className="mt-4 space-y-5">
          {flow.vehicle ? (
            <PxVehicleSummary
              vehicle={flow.vehicle}
              mileage={flow.miles}
            />
          ) : null}
          <PxValuationResult
            estimatedValue={flow.valuation.estimatedValue}
            deductions={flow.valuation.deductions}
          />
          <ValuationEquity position={position} blocked={blocked} />
          {blocked ? (
            <Button
              className="w-full"
              busy={flow.busy}
              onClick={() => void flow.requestCallback()}
            >
              {DEAL_PX_CALLBACK}
            </Button>
          ) : null}
          <Alert title="Subject to inspection" tone="info">
            {VE_INSPECTION_NOTE}
          </Alert>

          {flow.exitPanel === "none" ? (
            <div className="flex flex-col gap-2">
              {blocked ? null : (
              <Button
                className="w-full"
                busy={flow.busy}
                onClick={() => void flow.continueToDeal()}
              >
                {VE_EXIT_CONTINUE}
              </Button>
              )}
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  flow.setExitPanel("email");
                  flow.setFieldError(undefined);
                }}
              >
                {VE_EXIT_EMAIL}
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  flow.setExitPanel("save");
                  flow.setFieldError(undefined);
                }}
              >
                {VE_EXIT_SAVE}
              </Button>
              <Button
                variant="text"
                className="px-0"
                onClick={onRequestDecline}
              >
                {VE_EXIT_DECLINE}
              </Button>
            </div>
          ) : null}

          {flow.exitPanel === "email" ? (
            <div className="space-y-3 rounded-xl border border-border bg-page p-4">
              <p className="text-label">{VE_EMAIL_HEADING}</p>
              <p className="text-caption text-muted">{VE_EMAIL_SUPPORT}</p>
              {flow.emailSent ? (
                <p className="text-body-sm text-success" role="status">
                  {VE_EMAIL_CONFIRM}
                </p>
              ) : (
                <>
                  <Field htmlFor={emailId} label="Email" error={flow.fieldError}>
                    <Input
                      id={emailId}
                      type="email"
                      autoComplete="email"
                      value={flow.email}
                      onChange={(event) => flow.setEmail(event.target.value)}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => flow.setExitPanel("none")}
                    >
                      {VE_BACK}
                    </Button>
                    <Button className="flex-1" onClick={flow.submitEmail}>
                      Send mock email
                    </Button>
                  </div>
                </>
              )}
              {flow.emailSent ? (
                <Button
                  variant="text"
                  className="px-0"
                  onClick={() => flow.setExitPanel("none")}
                >
                  Back to options
                </Button>
              ) : null}
            </div>
          ) : null}

          {flow.exitPanel === "save" ? (
            <div className="space-y-3 rounded-xl border border-border bg-page p-4">
              <p className="text-label">{VE_SAVE_HEADING}</p>
              <p className="text-caption text-muted">{VE_SAVE_SUPPORT}</p>
              {flow.saved ? (
                <div className="space-y-2" role="status">
                  <p className="text-body-sm text-success">{VE_SAVE_CONFIRM}</p>
                  <p className="text-caption text-muted">
                    {VE_SAVE_RESUME_LABEL}:{" "}
                    <span className="break-all text-ink">{flow.resumeLink}</span>
                  </p>
                </div>
              ) : (
                <>
                  <Field htmlFor={emailId} label="Email" error={flow.fieldError}>
                    <Input
                      id={emailId}
                      type="email"
                      autoComplete="email"
                      value={flow.email}
                      onChange={(event) => flow.setEmail(event.target.value)}
                    />
                  </Field>
                  <Field htmlFor={phoneId} label="Mobile number">
                    <Input
                      id={phoneId}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={flow.phone}
                      onChange={(event) => flow.setPhone(event.target.value)}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => flow.setExitPanel("none")}
                    >
                      {VE_BACK}
                    </Button>
                    <Button className="flex-1" onClick={flow.submitSave}>
                      Save (mock)
                    </Button>
                  </div>
                </>
              )}
              {flow.saved ? (
                <Button
                  variant="text"
                  className="px-0"
                  onClick={() => flow.setExitPanel("none")}
                >
                  Back to options
                </Button>
              ) : null}
            </div>
          ) : null}

          {flow.fieldError && flow.exitPanel === "none" ? (
            <p className="text-caption text-danger" role="alert">
              {flow.fieldError}
            </p>
          ) : null}

          <p className="text-caption text-muted">{VE_CARD_REASSURANCE}</p>
          <Button variant="text" className="px-0" onClick={flow.goBack}>
            {VE_BACK}
          </Button>
        </div>
  );
}

function ValuationEquity({
  position,
  blocked,
}: {
  position: ReturnType<typeof partExchangePosition>;
  blocked: boolean;
}) {
  return (
    <dl className="space-y-2 text-body-sm">
      <div className="flex justify-between gap-4">
        <dt>{DEAL_PX_VALUATION_LABEL}</dt>
        <dd className="font-semibold!">{formatPounds(position.value)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>{DEAL_PX_FINANCE_LABEL}</dt>
        <dd className="font-semibold!">
          {position.settlement > 0
            ? `−${formatPounds(position.settlement)}`
            : formatPounds(0)}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>{DEAL_PX_EQUITY_LABEL}</dt>
        <dd className="font-semibold!">{formatPounds(position.equity)}</dd>
      </div>
      {position.negativeEquity > 0 ? (
        <div className="flex justify-between gap-4">
          <dt>{DEAL_PX_SHORTFALL_LABEL}</dt>
          <dd className="font-semibold!">{formatPounds(position.negativeEquity)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4 border-t border-border pt-2">
        <dt className="text-label">{DEAL_PX_TOTAL_LABEL}</dt>
        <dd className="font-semibold! text-primary">
          {formatPounds(position.depositContribution)}
        </dd>
      </div>
      {position.negativeEquity > 0 ? (
        <p className="text-body-sm text-navy">
          {blocked ? DEAL_PX_NEGATIVE_BLOCKED : DEAL_PX_NEGATIVE_INCLUDED}
        </p>
      ) : null}
    </dl>
  );
}
