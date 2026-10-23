"use client";

import { useEffect, useId, useState } from "react";
import { Field, Input } from "@/components/forms/FormControls";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import {
  DealCard,
  useDealStepNavigation,
} from "@/components/deal/wizard/DealWizardShell";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
] as const;

const NOT_AVAILABLE = "Not available";

type Employment = (typeof EMPLOYMENT_OPTIONS)[number]["value"];

type FormErrors = Partial<
  Record<"name" | "dob" | "postcode" | "address" | "employment" | "income", string>
>;

type SavedDecision = {
  fullName: string;
  dateOfBirth: string;
  postcode: string;
  addressLine: string;
  employment?: Employment;
  income: string;
  showResult: boolean;
  lookupDone: boolean;
  callbackConfirmed: boolean;
};

function storageKey(dealId: string) {
  return `oakwood-deal-decision:${dealId}`;
}

function digits(value: string, maxLength: number): string {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function withCommas(value: string): string {
  return value === "" ? "" : Number(value).toLocaleString("en-GB");
}

function parseDob(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function ageOn(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) {
    age -= 1;
  }
  return age;
}

function isEmployment(value: string): value is Employment {
  return EMPLOYMENT_OPTIONS.some((option) => option.value === value);
}

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function DealDecisionStep() {
  const { dealId } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("decision");
  const nameId = useId();
  const dobId = useId();
  const postcodeId = useId();
  const addressId = useId();
  const incomeId = useId();
  const employmentId = useId();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [employment, setEmployment] = useState<Employment | undefined>();
  const [income, setIncome] = useState("");
  const [lookupDone, setLookupDone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [callbackConfirmed, setCallbackConfirmed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(storageKey(dealId));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Partial<SavedDecision>;
        setFullName(saved.fullName ?? "");
        setDateOfBirth(saved.dateOfBirth ?? "");
        setPostcode(saved.postcode ?? "");
        const savedAddress = saved.addressLine ?? "";
        setAddressLine(
          /sampletown|mock street|mock road/i.test(savedAddress)
            ? ""
            : savedAddress,
        );
        setEmployment(
          saved.employment && isEmployment(saved.employment)
            ? saved.employment
            : undefined,
        );
        setIncome(digits(String(saved.income ?? ""), 7));
        setShowResult(Boolean(saved.showResult));
        setLookupDone(Boolean(saved.lookupDone));
        setCallbackConfirmed(Boolean(saved.callbackConfirmed));
      } catch {
        window.sessionStorage.removeItem(storageKey(dealId));
      }
    }
    setHydrated(true);
  }, [dealId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const saved: SavedDecision = {
      fullName,
      dateOfBirth,
      postcode,
      addressLine,
      employment,
      income,
      showResult,
      lookupDone,
      callbackConfirmed,
    };
    window.sessionStorage.setItem(storageKey(dealId), JSON.stringify(saved));
  }, [
    addressLine,
    callbackConfirmed,
    dateOfBirth,
    dealId,
    employment,
    fullName,
    hydrated,
    income,
    lookupDone,
    postcode,
    showResult,
  ]);

  function clear(key: keyof FormErrors) {
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (fullName.trim().split(/\s+/).filter(Boolean).length < 2) {
      next.name = "Enter your first and last name.";
    }
    const dob = parseDob(dateOfBirth);
    if (!dateOfBirth) {
      next.dob = "Enter your date of birth.";
    } else if (!dob) {
      next.dob = "Enter a valid date of birth.";
    } else if (ageOn(dob) < 18) {
      next.dob = "You must be 18 or over.";
    }
    if (addressLine.trim().length < 4) {
      next.address = "Enter your address.";
    }
    if (!employment) {
      next.employment = "Choose your employment status.";
    }
    const yearly = Number(income);
    if (!income || !Number.isFinite(yearly) || yearly <= 0) {
      next.income = "Enter your gross annual income.";
    }
    return next;
  }

  function focusFirst(next: FormErrors) {
    const id = next.name
      ? nameId
      : next.dob
        ? dobId
        : next.postcode
          ? postcodeId
          : next.address
            ? addressId
            : next.income
              ? incomeId
              : next.employment
                ? employmentId
                : undefined;
    if (id) {
      document.getElementById(id)?.focus();
    }
  }

  function findAddress() {
    const compact = postcode.replace(/\s/g, "");
    if (compact.length < 5) {
      setErrors((current) => ({
        ...current,
        postcode: "Enter a postcode to look up an address.",
      }));
      document.getElementById(postcodeId)?.focus();
      return;
    }
    setLookupDone(true);
    clear("postcode");
  }

  function viewStatus() {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirst(next);
      return;
    }
    setCallbackConfirmed(false);
    setShowResult(true);
  }

  const continueLabel = showResult ? "View my quote" : "View decision status";

  return (
    <form
      noValidate
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        if (!showResult) {
          viewStatus();
        }
      }}
    >
      {showResult ? (
        <DealCard>
          <DecisionResult
            callbackConfirmed={callbackConfirmed}
            onEdit={() => setShowResult(false)}
            onCallback={() => setCallbackConfirmed(true)}
          />
        </DealCard>
      ) : (
        <DealCard>
          <div className="space-y-5">
            <Field htmlFor={nameId} label="Full name" error={errors.name}>
              <Input
                id={nameId}
                value={fullName}
                autoComplete="name"
                placeholder="Full name"
                error={Boolean(errors.name)}
                onChange={(event) => {
                  setFullName(event.target.value);
                  clear("name");
                }}
              />
            </Field>

            <Field
              htmlFor={dobId}
              label="Date of birth"
              hint="You need to be 18 or over."
              error={errors.dob}
            >
              <Input
                id={dobId}
                type="date"
                value={dateOfBirth}
                autoComplete="bday"
                max={todayIso()}
                min="1900-01-01"
                error={Boolean(errors.dob)}
                onChange={(event) => {
                  setDateOfBirth(event.target.value);
                  clear("dob");
                }}
              />
            </Field>

            <div className="space-y-3">
              <Field
                htmlFor={postcodeId}
                label="Postcode"
                error={errors.postcode}
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id={postcodeId}
                    value={postcode}
                    autoComplete="postal-code"
                    placeholder="Postcode"
                    className="uppercase sm:flex-1"
                    error={Boolean(errors.postcode)}
                    onChange={(event) => {
                      setPostcode(event.target.value);
                      setLookupDone(false);
                      clear("postcode");
                    }}
                  />
                  <Button
                    type="button"
                    variant="tertiary"
                    className="w-full shrink-0 sm:w-auto"
                    onClick={findAddress}
                  >
                    Find address
                  </Button>
                </div>
              </Field>

              {lookupDone ? (
                <p className="text-caption text-muted" role="status">
                  Address lookup is not available. Enter the address below.
                </p>
              ) : null}

              <Field htmlFor={addressId} label="Address" error={errors.address}>
                <Input
                  id={addressId}
                  value={addressLine}
                  autoComplete="street-address"
                  placeholder="Address"
                  error={Boolean(errors.address)}
                  onChange={(event) => {
                    setAddressLine(event.target.value);
                    clear("address");
                  }}
                />
              </Field>
            </div>

            <div id={employmentId} tabIndex={-1} className="outline-none">
              <DealChipGroup
                label="Employment status"
                value={employment}
                options={[...EMPLOYMENT_OPTIONS]}
                columns={2}
                onChange={(value) => {
                  setEmployment(value);
                  clear("employment");
                }}
              />
              {errors.employment ? (
                <p className="mt-1.5 text-caption text-danger" role="alert">
                  {errors.employment}
                </p>
              ) : null}
            </div>

            <Field
              htmlFor={incomeId}
              label="Gross annual income"
              hint="Before tax, per year."
              error={errors.income}
            >
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                  £
                </span>
                <Input
                  id={incomeId}
                  inputMode="numeric"
                  autoComplete="off"
                  className="pl-7 tabular-number"
                  value={withCommas(income)}
                  placeholder="Amount"
                  error={Boolean(errors.income)}
                  onChange={(event) => {
                    setIncome(digits(event.target.value, 7));
                    clear("income");
                  }}
                />
              </div>
            </Field>
          </div>
        </DealCard>
      )}

      <DealStepFooter
        onBack={() => goBack("budget")}
        onContinue={showResult ? () => goNext("cover") : viewStatus}
        continueLabel={continueLabel}
        submit={!showResult}
        showMonthly={false}
      />
    </form>
  );
}

function DecisionResult({
  callbackConfirmed,
  onEdit,
  onCallback,
}: {
  callbackConfirmed: boolean;
  onEdit: () => void;
  onCallback: () => void;
}) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="rounded-2xl border border-border bg-page-tint px-4 py-4">
        <p className="text-caption font-semibold! uppercase tracking-[0.08em] text-muted">
          Decision status
        </p>
        <h2 className="mt-1 text-h5 text-navy">{NOT_AVAILABLE}</h2>
        <p className="mt-2 text-caption text-muted">
          Entering your details does not produce a lending decision.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border-strong px-4 py-4">
        <p className="text-label text-navy">Personal APR</p>
        <p className="mt-1 text-h4 text-navy">{NOT_AVAILABLE}</p>
      </div>

      {callbackConfirmed ? (
        <Alert title="Not available" tone="info">
          A callback is not available. No request has been sent.
        </Alert>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onCallback}
        >
          Request a callback
        </Button>
      )}

      <Button
        type="button"
        variant="text"
        className="min-h-11 px-0 text-body font-semibold!"
        onClick={onEdit}
      >
        Edit details
      </Button>
    </div>
  );
}
