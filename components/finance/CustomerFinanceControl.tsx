"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { Slider } from "@/components/forms/FormControls";
import { PersonalisedPricingIndicator } from "@/components/finance/FinancePrimitives";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { financeCta } from "@/config/navigation";
import { routes } from "@/config/routes";
import { formatApr, formatPounds } from "@/lib/format/money";

export function CustomerFinanceControl() {
  const {
    mode,
    apr,
    deposit,
    term,
    setDeposit,
    setTerm,
    assumptionsOpen,
    setAssumptionsOpen,
  } = useCustomerFinance();
  const personalised = mode === "personalised" || mode === "ineligible";

  return (
    <>
      <div className="hidden shrink-0 md:block">
        {personalised ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAssumptionsOpen(true)}
            className="max-w-[10rem] truncate xl:max-w-none"
          >
            <span className="xl:hidden">{formatApr(apr)}</span>
            <span className="hidden xl:inline">Your finance: {formatApr(apr)}</span>
          </Button>
        ) : (
          <Button href={financeCta.href} size="sm" className="whitespace-nowrap">
            <span className="xl:hidden">{financeCta.anonymousShortLabel}</span>
            <span className="hidden xl:inline">{financeCta.anonymousLabel}</span>
          </Button>
        )}
      </div>
      <Modal
        open={assumptionsOpen}
        title="Finance assumptions"
        onClose={() => setAssumptionsOpen(false)}
      >
        <PersonalisedPricingIndicator
          state={mode === "ineligible" ? "ineligible" : "personalised"}
        />
        <div className="mt-6 flex flex-col gap-6">
          <Slider
            name="deposit"
            label={`Deposit ${formatPounds(deposit)}`}
            min={0}
            max={5000}
            step={250}
            value={deposit}
            onChange={(event) => setDeposit(Number(event.target.value))}
          />
          <Slider
            name="term"
            label={`Term ${term} months`}
            min={24}
            max={60}
            step={6}
            value={term}
            onChange={(event) => setTerm(Number(event.target.value))}
          />
          <Button href={routes.eligibility} variant="secondary">
            Check my eligibility
          </Button>
          <p className="text-caption">
            Changes apply to this session only. No finance profile is stored in
            the browser.
          </p>
        </div>
      </Modal>
    </>
  );
}
