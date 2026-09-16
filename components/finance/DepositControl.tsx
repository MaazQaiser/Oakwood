"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Slider } from "@/components/forms/FormControls";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { formatPounds } from "@/lib/format/money";
import {
  CALCULATOR_CASH_DEPOSIT_LABEL,
  CALCULATOR_PX_EQUITY_LABEL,
  CALCULATOR_TOTAL_DEPOSIT_LABEL,
} from "@/lib/finance/calculator-copy";

export function DepositControl({
  cashDeposit,
  minDeposit,
  maxDeposit,
  step,
  error,
  pxEquity,
  totalDeposit,
  onChange,
}: {
  cashDeposit: number;
  minDeposit: number;
  maxDeposit: number;
  step: number;
  error?: string;
  pxEquity?: number;
  totalDeposit?: number;
  onChange: (value: number) => void;
}) {
  const [typed, setTyped] = useState<string>();
  const sliderMax = Math.max(minDeposit, maxDeposit);

  return (
    <section aria-labelledby="deposit-heading">
      <h2 id="deposit-heading" className="text-label">
        Your deposit
      </h2>
      <p className="mt-2">
        <FinancialNumber value={formatPounds(cashDeposit)} />
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          aria-label={`Decrease deposit by ${formatPounds(step)}`}
          onClick={() => onChange(cashDeposit - step)}
          disabled={cashDeposit <= minDeposit}
        >
          − {formatPounds(step)}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          aria-label={`Increase deposit by ${formatPounds(step)}`}
          onClick={() => onChange(cashDeposit + step)}
          disabled={cashDeposit >= sliderMax}
        >
          + {formatPounds(step)}
        </Button>
      </div>
      <div className="mt-4">
        <Slider
          id="finance-deposit-slider"
          name="finance-deposit"
          label="Deposit amount"
          min={minDeposit}
          max={sliderMax}
          step={step}
          value={Math.min(sliderMax, Math.max(minDeposit, cashDeposit))}
          aria-valuetext={formatPounds(cashDeposit)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <div className="mt-4">
        <Field
          htmlFor="finance-deposit-input"
          label="Deposit"
          hint={`Minimum ${formatPounds(minDeposit)}. Maximum ${formatPounds(sliderMax)}.`}
          error={error}
        >
          <Input
            id="finance-deposit-input"
            name="deposit"
            inputMode="numeric"
            autoComplete="off"
            error={Boolean(error)}
            value={typed ?? String(cashDeposit)}
            onChange={(event) => {
              const nextText = event.target.value;
              setTyped(nextText);
              const raw = nextText.replace(/,/g, "").replace(/£/g, "");
              const next = Number(raw);
              if (raw.trim() !== "" && Number.isFinite(next)) {
                onChange(next);
              }
            }}
            onBlur={() => {
              const raw = (typed ?? String(cashDeposit))
                .replace(/,/g, "")
                .replace(/£/g, "");
              const next = Number(raw);
              if (Number.isFinite(next)) {
                onChange(next);
              }
              setTyped(undefined);
            }}
          />
        </Field>
      </div>
      {pxEquity ? (
        <dl className="mt-4 space-y-1 text-body-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{CALCULATOR_PX_EQUITY_LABEL}</dt>
            <dd>
              <FinancialNumber value={`+ ${formatPounds(pxEquity)}`} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{CALCULATOR_CASH_DEPOSIT_LABEL}</dt>
            <dd>
              <FinancialNumber
                value={`+ ${formatPounds(cashDeposit)}`}
                size="sm"
              />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-label">{CALCULATOR_TOTAL_DEPOSIT_LABEL}</dt>
            <dd>
              <FinancialNumber
                value={formatPounds(totalDeposit ?? cashDeposit + pxEquity)}
                size="sm"
              />
            </dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
