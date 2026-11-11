"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { EligibilityTextInput } from "@/components/eligibility/controls";
import { SubmissionConfirmation } from "@/features/support/components/SubmissionConfirmation";
import { SupportErrorState } from "@/features/support/components/SupportErrorState";
import { submitStaffRefundRequest } from "@/features/support/actions";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  formatSortCode,
  type RefundPaymentMethod,
} from "@/lib/support/refund-form";
import { SUPPORT_CRM_NOTICE } from "@/lib/support/copy";

const STEP_COPY = {
  1: {
    title: "Customer and vehicle",
    body: "Who is the refund for, and which car was involved?",
  },
  2: {
    title: "How they paid",
    body: "Choose the original payment method so the refund goes back the same way.",
  },
  3: {
    title: "Reason for refund",
    body: "A short note for the customer file is enough.",
  },
} as const;

export function StaffRefundForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState("");
  const [registration, setRegistration] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<RefundPaymentMethod | "">("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string>();
  const [reference, setReference] = useState<string>();
  const [busy, setBusy] = useState(false);

  function chooseMethod(next: RefundPaymentMethod) {
    setPaymentMethod(next);
    setAccountNumber("");
    setSortCode("");
    setCardNumber("");
    setCardExpiry("");
    setError(undefined);
  }

  async function submit() {
    if (!paymentMethod) {
      setError("Choose how they paid.");
      return;
    }
    setBusy(true);
    setError(undefined);
    const result = await submitStaffRefundRequest({
      customerName,
      registration,
      salesExecutive: salesExecutive || undefined,
      paymentMethod,
      accountNumber: paymentMethod === "bacs" ? accountNumber : undefined,
      sortCode: paymentMethod === "bacs" ? sortCode : undefined,
      cardNumber: paymentMethod === "card" ? cardNumber : undefined,
      cardExpiry: paymentMethod === "card" ? cardExpiry : undefined,
      reason,
    });
    setBusy(false);
    if (result.ok) {
      setReference(result.reference);
      return;
    }
    setError(result.error);
  }

  if (reference) {
    return (
      <SubmissionConfirmation
        title="Refund request logged"
        reference={reference}
        nextStep="Keep this reference with the customer file. The CRM is not connected yet."
        href={routes.help}
        hrefLabel="Back to help"
      />
    );
  }

  const copy = STEP_COPY[step];

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#D7E6F2] bg-white shadow-[0_18px_40px_rgba(0,40,82,0.06)]">
      <div className="border-b border-[#E7EEF4] bg-[#F7FAFC] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption font-semibold tracking-[0.08em] text-[#002852] uppercase">
            Step {step} of 3
          </p>
          <p className="text-caption text-muted">Staff form</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map((item) => (
            <div
              key={item}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-[var(--oak-motion-base)]",
                item <= step ? "bg-[#002852]" : "bg-[#D7E6F2]",
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <form
        id="staff-refund-form"
        className="space-y-5 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 3) {
            if (step === 1) {
              if (!customerName.trim() || !registration.trim()) {
                setError("Enter the customer name and vehicle registration.");
                return;
              }
              setError(undefined);
              setStep(2);
              return;
            }
            if (!paymentMethod) {
              setError("Choose how they paid.");
              return;
            }
            if (paymentMethod === "bacs") {
              if (
                accountNumber.replace(/\D/g, "").length !== 8 ||
                sortCode.replace(/\D/g, "").length !== 6
              ) {
                setError("Enter a valid account number and sort code.");
                return;
              }
            } else if (
              cardNumber.replace(/\D/g, "").length !== 16 ||
              !/^\d{2}\/\d{2}$/.test(cardExpiry.trim())
            ) {
              setError("Enter a valid card number and expiry.");
              return;
            }
            setError(undefined);
            setStep(3);
            return;
          }
          void submit();
        }}
      >
        <div>
          <h3 className="text-h3">{copy.title}</h3>
          <p className="mt-1 text-sm text-muted">{copy.body}</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <EligibilityTextInput
              id="refund-customer-name"
              label="Customer name"
              autoComplete="name"
              value={customerName}
              onChange={setCustomerName}
            />
            <EligibilityTextInput
              id="refund-registration"
              label="Vehicle registration"
              autoComplete="off"
              value={registration}
              onChange={(value) => setRegistration(value.toUpperCase())}
            />
            <EligibilityTextInput
              id="refund-sales-executive"
              label="Sales executive who took the payment*"
              autoComplete="off"
              value={salesExecutive}
              onChange={setSalesExecutive}
            />
            <p className="text-caption text-muted">* Optional</p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["bacs", "BACS"],
                  ["card", "Card"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={paymentMethod === value}
                  onClick={() => chooseMethod(value)}
                  className={cn(
                    "min-h-14 rounded-[16px] px-4 text-sm font-semibold transition-[background-color,color,transform] duration-[var(--oak-motion-fast)]",
                    paymentMethod === value
                      ? "bg-[#002852] text-white"
                      : "bg-[#F2F7FB] text-[#002852] hover:bg-[#E7F1F8]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {paymentMethod === "bacs" ? (
              <>
                <EligibilityTextInput
                  id="refund-account-number"
                  label="Account number"
                  inputMode="numeric"
                  autoComplete="off"
                  value={accountNumber}
                  onChange={(value) => setAccountNumber(value.replace(/\D/g, "").slice(0, 8))}
                />
                <Field htmlFor="refund-sort-code" label="Sort code">
                  <Input
                    id="refund-sort-code"
                    inputMode="numeric"
                    autoComplete="off"
                    value={sortCode}
                    onChange={(event) => setSortCode(formatSortCode(event.target.value))}
                    placeholder="NN-NN-NN"
                  />
                </Field>
              </>
            ) : null}
            {paymentMethod === "card" ? (
              <>
                <EligibilityTextInput
                  id="refund-card-number"
                  label="16-digit card number"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cardNumber}
                  onChange={(value) => setCardNumber(value.replace(/\D/g, "").slice(0, 16))}
                />
                <EligibilityTextInput
                  id="refund-card-expiry"
                  label="Expiry date"
                  autoComplete="off"
                  value={cardExpiry}
                  onChange={(value) => {
                    const digits = value.replace(/\D/g, "").slice(0, 4);
                    setCardExpiry(
                      digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`,
                    );
                  }}
                />
              </>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <Field htmlFor="refund-reason" label="Reason for refund">
            <textarea
              id="refund-reason"
              className="min-h-32 w-full rounded-[14px] border border-[#E7EEF4] bg-[#F7FAFC] px-4 py-3 text-body"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
            />
          </Field>
        ) : null}

        {error ? (
          <SupportErrorState title={error} onRetry={() => setError(undefined)} />
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setError(undefined);
                setStep((current) => (current === 3 ? 2 : 1));
              }}
            >
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={busy}>
            {step === 3 ? (busy ? "Submitting…" : "Submit refund request") : "Continue"}
          </Button>
        </div>
        <p className="text-caption text-muted">{SUPPORT_CRM_NOTICE}</p>
      </form>
    </div>
  );
}
