"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Button } from "@/components/ui/Button";
import { Field, Select, Slider } from "@/components/forms/FormControls";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { getFinanceCalculatorUrl, getFinanceIntentUrl, routes } from "@/config/routes";
import { formatPounds, formatTerm } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function FinanceControls() {
  const {
    financeType,
    setFinanceType,
    deposit,
    extraDeposit,
    term,
    termOptions,
    setTermValue,
    adjustDeposit,
    setDepositValue,
    monthlyPayment,
    cashPrice,
    totalPayable,
    maxDeposit,
    depositStep,
    displayState,
    negativeEquity,
    vehicle,
  } = useVehicleDeal();

  return (
    <section
      id="finance-this-car"
      aria-labelledby="finance-this-car-heading"
      className="scroll-mt-24 rounded-lg border border-border bg-surface p-4 md:p-5"
    >
      <h2 id="finance-this-car-heading" className="text-h3">
        Finance this car
      </h2>
      <p className="mt-1 text-body-sm text-muted">
        Change the deposit, term and finance type here. Figures update as you go.
      </p>

      <fieldset className="mt-5">
        <legend className="text-label">Finance type</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            variant={financeType === "hp" ? "primary" : "secondary"}
            aria-pressed={financeType === "hp"}
            onClick={() => setFinanceType("hp")}
          >
            Hire Purchase
          </Button>
          <Button
            variant={financeType === "pcp" ? "primary" : "secondary"}
            aria-pressed={financeType === "pcp"}
            onClick={() => setFinanceType("pcp")}
          >
            Personal Contract Purchase
          </Button>
        </div>
      </fieldset>

      <div className="mt-6">
        <p className="text-label">Deposit</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="secondary"
            aria-label={`Decrease deposit by ${formatPounds(depositStep)}`}
            onClick={() => adjustDeposit(-depositStep)}
            disabled={deposit <= 0}
          >
            − {formatPounds(depositStep)}
          </Button>
          <p className="min-w-24 flex-1 text-center">
            <FinancialNumber value={formatPounds(deposit)} size="sm" />
          </p>
          <Button
            variant="secondary"
            aria-label={`Increase deposit by ${formatPounds(depositStep)}`}
            onClick={() => adjustDeposit(depositStep)}
            disabled={deposit >= maxDeposit}
          >
            + {formatPounds(depositStep)}
          </Button>
        </div>
        <div className="mt-3">
          <Slider
            id="vdp-deposit"
            name="deposit"
            label="Deposit amount"
            min={0}
            max={maxDeposit}
            step={depositStep}
            value={deposit}
            onChange={(event) => setDepositValue(Number(event.target.value))}
          />
        </div>
        {extraDeposit > 0 ? (
          <p className="mt-2 text-caption text-success">
            {formatPounds(extraDeposit)} added to your deposit from part exchange.
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <Field label="Term" htmlFor="vdp-term">
          <Select
            id="vdp-term"
            name="term"
            value={term}
            onChange={(event) => setTermValue(Number(event.target.value))}
          >
            {termOptions.map((option) => (
              <option key={option} value={option}>
                {formatTerm(option)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-body-sm">
        <div>
          <dt className="text-caption text-muted">Monthly payment</dt>
          <dd className="mt-1">
            <FinancialNumber
              value={formatPounds(monthlyPayment)}
              suffix={displayState === "representative" ? "/month*" : "/month"}
              size="sm"
              className="text-primary"
            />
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Cash price</dt>
          <dd className="mt-1">
            <FinancialNumber value={formatPounds(cashPrice)} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Deposit</dt>
          <dd className="mt-1">
            <FinancialNumber value={formatPounds(deposit + extraDeposit)} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Term</dt>
          <dd className="mt-1">
            <span className="financial-number financial-number--sm">{formatTerm(term)}</span>
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-caption text-muted">Total payable</dt>
          <dd className="mt-1">
            <FinancialNumber value={formatPounds(totalPayable)} size="sm" />
          </dd>
        </div>
      </dl>

      {negativeEquity > 0 ? (
        <p className="mt-3 text-caption text-warning">
          {formatPounds(negativeEquity)} of existing finance is included in this illustration.
        </p>
      ) : null}

      <p className={cn("mt-4 text-caption text-muted")}>
        This is an illustration only, not a lender offer. No credit decision is made
        on this page.
      </p>
      <p className="mt-3">
        <Button href={routes.finance} variant="text">
          How does car finance work?
        </Button>
        <Button href={getFinanceIntentUrl("pcp")} variant="text">
          HP vs PCP
        </Button>
        <Button
          href={getFinanceCalculatorUrl({ stockId: vehicle.stockId })}
          variant="text"
        >
          Finance calculator
        </Button>
      </p>
    </section>
  );
}
