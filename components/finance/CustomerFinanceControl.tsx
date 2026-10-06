"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Dialogs";
import { Slider } from "@/components/forms/FormControls";
import { PersonalisedPricingIndicator } from "@/components/finance/FinancePrimitives";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { financeCta } from "@/config/navigation";
import { getSearchUrl, routes } from "@/config/routes";
import { formatApr, formatPounds } from "@/lib/format/money";

export function CustomerFinanceControl() {
  const pathname = usePathname();
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
  const eligibilityAction = useMemo(() => {
    if (personalised) {
      if (pathname === routes.eligibilityResult) {
        return {
          href: getSearchUrl({ affordable: "1" }),
          label: "Browse affordable cars",
        };
      }
      return {
        href: routes.eligibilityResult,
        label: "View my eligibility result",
      };
    }
    if (
      pathname === routes.eligibilityQuestions ||
      pathname === routes.eligibilityResume
    ) {
      return null;
    }
    return {
      href: routes.eligibilityQuestions,
      label: "Check my eligibility",
    };
  }, [pathname, personalised]);

  return (
    <>
      <div className="hidden shrink-0 lg:block">
        {personalised ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAssumptionsOpen(true)}
            className="h-10! min-h-10! max-w-[12rem] truncate border-border! bg-white! px-4! text-[0.72rem]! font-semibold! uppercase! tracking-[0.08em]! text-ink! tabular-nums! xl:max-w-none"
          >
            <span className="xl:hidden">{formatApr(apr)}</span>
            <span className="hidden xl:inline">Your finance: {formatApr(apr)}</span>
          </Button>
        ) : (
          <Button
            href={financeCta.href}
            size="sm"
            className="h-10! min-h-10! rounded-[14px]! border-0! bg-primary! px-5! text-[0.72rem]! font-semibold! uppercase! tracking-[0.12em]! text-white! hover:bg-primary-hover!"
          >
            {financeCta.anonymousShortLabel}
          </Button>
        )}
      </div>
      <Modal
        open={assumptionsOpen}
        title="Finance assumptions"
        onClose={() => setAssumptionsOpen(false)}
      >
        <PersonalisedPricingIndicator
          state={
            mode === "ineligible"
              ? "ineligible"
              : mode === "personalised"
                ? "personalised"
                : "anonymous"
          }
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
          {eligibilityAction ? (
            <Button
              variant="secondary"
              href={eligibilityAction.href}
              onClick={() => setAssumptionsOpen(false)}
            >
              {eligibilityAction.label}
            </Button>
          ) : null}
          <p className="text-caption">
            Changes apply to this session only. No finance profile is stored in
            the browser.
          </p>
        </div>
      </Modal>
    </>
  );
}
