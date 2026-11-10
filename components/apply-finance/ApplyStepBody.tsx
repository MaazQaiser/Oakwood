"use client";

import { useState, type ReactNode } from "react";
import { ApplyChoiceList } from "@/components/apply-finance/ApplyStepper";
import { Field, Input } from "@/components/forms/FormControls";
import { EligibilityCurrencyInput } from "@/components/eligibility/controls";
import { Button } from "@/components/ui/Button";
import { FINANCE_LENDERS, lookupPostcode } from "@/lib/apply-finance/lookups";
import { getJointReviewRows, getReviewGroups } from "@/lib/apply-finance/review";
import { choiceValue } from "@/lib/apply-finance/steps";
import { adultDobLimit, digitsOnly, normalisePostcode, todayIso } from "@/lib/apply-finance/validators";
import { routes } from "@/config/routes";
import { MARKETING_CONSENT_WORDING } from "@/lib/eligibility/copy";
import { cn } from "@/lib/cn";
import type {
  ApplicationData,
  ApplyFieldErrors,
  ApplySectionId,
  ApplyStep,
  ApplyStepId,
} from "@/types/apply-finance";

function DateField({
  id,
  label,
  hint,
  error,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={id}
        type="date"
        min={min}
        max={max}
        value={value}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function MoneyField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <EligibilityCurrencyInput
      id={id}
      label={label}
      hint={hint}
      error={error}
      value={value}
      placeholder="0"
      onChange={(next) => onChange(digitsOnly(next))}
    />
  );
}

function AddressFields({
  idPrefix,
  postcode,
  address,
  postcodeError,
  addressError,
  onPostcode,
  onAddress,
}: {
  idPrefix: string;
  postcode?: string;
  address?: string;
  postcodeError?: string;
  addressError?: string;
  onPostcode: (value: string) => void;
  onAddress: (postcode: string, address: string) => void;
}) {
  const [hits, setHits] = useState<{ id: string; label: string }[] | null>(null);
  const [lookupError, setLookupError] = useState<string>();

  function find() {
    const results = lookupPostcode(postcode ?? "");
    if (!results) {
      setHits(null);
      setLookupError("Enter a valid UK postcode.");
      return;
    }
    setLookupError(undefined);
    setHits(results);
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        htmlFor={`${idPrefix}-postcode`}
        label="Postcode"
        error={lookupError ?? postcodeError}
      >
        <Input
          id={`${idPrefix}-postcode`}
          name={`${idPrefix}-postcode`}
          autoComplete="postal-code"
          placeholder="Enter postcode"
          value={postcode ?? ""}
          error={Boolean(lookupError ?? postcodeError)}
          onChange={(event) => {
            setHits(null);
            setLookupError(undefined);
            onPostcode(event.target.value.toUpperCase());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              find();
            }
          }}
        />
      </Field>
      <Button type="button" variant="outline" className="self-start" onClick={find}>
        Find address
      </Button>
      {hits ? (
        <div>
          <p className="text-caption text-muted">
            Sample addresses for this preview. Choose the closest match.
          </p>
          <div className="mt-3 flex flex-col gap-2" role="listbox" aria-label="Addresses">
            {hits.map((hit) => {
              const selected = address === hit.label;
              return (
                <button
                  key={hit.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() =>
                    onAddress(normalisePostcode(postcode ?? "") ?? postcode ?? "", hit.label)
                  }
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-body-sm",
                    selected
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  {hit.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {address ? (
        <p className="text-body-sm">
          <span className="text-muted">Selected. </span>
          {address}
        </p>
      ) : null}
      {addressError ? (
        <p className="text-caption text-danger" role="alert">
          {addressError}
        </p>
      ) : null}
    </div>
  );
}

function LenderField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const query = value.trim().toLowerCase();
  const matches =
    query.length > 0
      ? FINANCE_LENDERS.filter((lender) => lender.toLowerCase().includes(query)).slice(0, 6)
      : [];
  const showMatches = matches.length > 0 && !(matches.length === 1 && matches[0].toLowerCase() === query);

  return (
    <div className="flex flex-col gap-3">
      <Field htmlFor="partExchangeLender" label="Lender" error={error}>
        <Input
          id="partExchangeLender"
          name="partExchangeLender"
          autoComplete="organization"
          placeholder="Search or type a lender"
          value={value}
          error={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
      {showMatches ? (
        <div className="flex flex-col gap-2">
          {matches.map((lender) => (
            <button
              key={lender}
              type="button"
              onClick={() => onChange(lender)}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-body-sm hover:border-border-strong"
            >
              {lender}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ConsentCheck({
  id,
  checked,
  error,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-5 w-5 accent-primary"
        />
        <label htmlFor={id} className="text-body-sm">
          {children}
        </label>
      </div>
      {error ? (
        <p className="mt-1 text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReviewList({
  groups,
  onEditSection,
}: {
  groups: ReturnType<typeof getReviewGroups>;
  onEditSection: (section: ApplySectionId) => void;
}) {
  const [openId, setOpenId] = useState(groups[0]?.id ?? "");

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => {
        const open = openId === group.id;
        return (
          <section key={group.id} className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <button
                type="button"
                className="text-left text-label"
                aria-expanded={open}
                onClick={() => setOpenId(open ? "" : group.id)}
              >
                {group.title}
              </button>
              <button
                type="button"
                className="text-caption text-primary"
                onClick={() => onEditSection(group.section)}
              >
                Edit
              </button>
            </div>
            {open ? (
              <dl className="divide-y divide-border border-t border-border">
                {group.rows.map((item) => (
                  <div key={item.label} className="px-4 py-3">
                    <dt className="text-caption text-muted">{item.label}</dt>
                    <dd className="mt-1 text-body-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export function ApplyStepBody({
  step,
  data,
  errors,
  labelledBy,
  onChange,
  onChoice,
  onEditSection,
  onEditStep,
}: {
  step: ApplyStep;
  data: ApplicationData;
  errors: ApplyFieldErrors;
  labelledBy: string;
  onChange: (patch: Partial<ApplicationData>) => void;
  onChoice: (value: string) => void;
  onEditSection: (section: ApplySectionId) => void;
  onEditStep: (stepId: ApplyStepId) => void;
}) {
  if (step.kind === "choice" && step.choices) {
    const selected = choiceValue(step.id, data);
    return (
      <ApplyChoiceList
        name={step.id}
        labelledBy={labelledBy}
        options={step.choices}
        value={selected}
        onSelect={onChoice}
      />
    );
  }

  return (
    <StepFields
      step={step}
      data={data}
      errors={errors}
      onChange={onChange}
      onEditSection={onEditSection}
      onEditStep={onEditStep}
    />
  );
}

function StepFields({
  step,
  data,
  errors,
  onChange,
  onEditSection,
  onEditStep,
}: {
  step: ApplyStep;
  data: ApplicationData;
  errors: ApplyFieldErrors;
  onChange: (patch: Partial<ApplicationData>) => void;
  onEditSection: (section: ApplySectionId) => void;
  onEditStep: (stepId: ApplyStepId) => void;
}) {
  const adultMax = adultDobLimit();
  const today = todayIso();

  switch (step.id) {
    case "name":
      return (
        <div className="flex flex-col gap-4">
          <Field htmlFor="firstName" label="First name" error={errors.firstName}>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              value={data.firstName ?? ""}
              error={Boolean(errors.firstName)}
              onChange={(event) => onChange({ firstName: event.target.value })}
            />
          </Field>
          <Field htmlFor="lastName" label="Last name" error={errors.lastName}>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={data.lastName ?? ""}
              error={Boolean(errors.lastName)}
              onChange={(event) => onChange({ lastName: event.target.value })}
            />
          </Field>
        </div>
      );
    case "ja-name":
      return (
        <div className="flex flex-col gap-4">
          <Field htmlFor="jointFirstName" label="First name" error={errors.jointFirstName}>
            <Input
              id="jointFirstName"
              autoComplete="given-name"
              value={data.jointFirstName ?? ""}
              error={Boolean(errors.jointFirstName)}
              onChange={(event) => onChange({ jointFirstName: event.target.value })}
            />
          </Field>
          <Field htmlFor="jointLastName" label="Last name" error={errors.jointLastName}>
            <Input
              id="jointLastName"
              autoComplete="family-name"
              value={data.jointLastName ?? ""}
              error={Boolean(errors.jointLastName)}
              onChange={(event) => onChange({ jointLastName: event.target.value })}
            />
          </Field>
        </div>
      );
    case "mobile":
      return (
        <Field htmlFor="mobile" label="Mobile number" error={errors.mobile}>
          <Input
            id="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07..."
            value={data.mobile ?? ""}
            error={Boolean(errors.mobile)}
            onChange={(event) => onChange({ mobile: event.target.value })}
          />
        </Field>
      );
    case "ja-mobile":
      return (
        <Field htmlFor="jointMobile" label="Mobile number" error={errors.jointMobile}>
          <Input
            id="jointMobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07..."
            value={data.jointMobile ?? ""}
            error={Boolean(errors.jointMobile)}
            onChange={(event) => onChange({ jointMobile: event.target.value })}
          />
        </Field>
      );
    case "email":
      return (
        <Field htmlFor="email" label="Email" error={errors.email}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@email.com"
            value={data.email ?? ""}
            error={Boolean(errors.email)}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </Field>
      );
    case "ja-email":
      return (
        <Field htmlFor="jointEmail" label="Email" error={errors.jointEmail}>
          <Input
            id="jointEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@email.com"
            value={data.jointEmail ?? ""}
            error={Boolean(errors.jointEmail)}
            onChange={(event) => onChange({ jointEmail: event.target.value })}
          />
        </Field>
      );
    case "dob":
      return (
        <DateField
          id="dateOfBirth"
          label="Date of birth"
          error={errors.dateOfBirth}
          value={data.dateOfBirth ?? ""}
          min="1900-01-01"
          max={adultMax}
          onChange={(value) => onChange({ dateOfBirth: value })}
        />
      );
    case "ja-dob":
      return (
        <DateField
          id="jointDateOfBirth"
          label="Date of birth"
          error={errors.jointDateOfBirth}
          value={data.jointDateOfBirth ?? ""}
          min="1900-01-01"
          max={adultMax}
          onChange={(value) => onChange({ jointDateOfBirth: value })}
        />
      );
    case "passport-country":
      return (
        <Field htmlFor="passportCountry" label="Country" error={errors.passportCountry}>
          <Input
            id="passportCountry"
            autoComplete="country-name"
            placeholder="Country"
            value={data.passportCountry ?? ""}
            error={Boolean(errors.passportCountry)}
            onChange={(event) => onChange({ passportCountry: event.target.value })}
          />
        </Field>
      );
    case "address":
      return (
        <AddressFields
          idPrefix="address"
          postcode={data.postcode}
          address={data.address}
          postcodeError={errors.postcode}
          addressError={errors.address}
          onPostcode={(value) => onChange({ postcode: value, address: undefined })}
          onAddress={(postcode, address) => onChange({ postcode, address })}
        />
      );
    case "previous-address":
      return (
        <AddressFields
          idPrefix="previous-address"
          postcode={data.previousPostcode}
          address={data.previousAddress}
          postcodeError={errors.previousPostcode}
          addressError={errors.previousAddress}
          onPostcode={(value) => onChange({ previousPostcode: value, previousAddress: undefined })}
          onAddress={(postcode, address) =>
            onChange({ previousPostcode: postcode, previousAddress: address })
          }
        />
      );
    case "ja-address":
      return (
        <AddressFields
          idPrefix="ja-address"
          postcode={data.jointPostcode}
          address={data.jointAddress}
          postcodeError={errors.jointPostcode}
          addressError={errors.jointAddress}
          onPostcode={(value) => onChange({ jointPostcode: value, jointAddress: undefined })}
          onAddress={(postcode, address) => onChange({ jointPostcode: postcode, jointAddress: address })}
        />
      );
    case "ja-previous-address":
      return (
        <AddressFields
          idPrefix="ja-previous-address"
          postcode={data.jointPreviousPostcode}
          address={data.jointPreviousAddress}
          postcodeError={errors.jointPreviousPostcode}
          addressError={errors.jointPreviousAddress}
          onPostcode={(value) =>
            onChange({ jointPreviousPostcode: value, jointPreviousAddress: undefined })
          }
          onAddress={(postcode, address) =>
            onChange({ jointPreviousPostcode: postcode, jointPreviousAddress: address })
          }
        />
      );
    case "previous-address-duration":
      return (
        <div className="flex flex-col gap-4">
          <DateField
            id="previousAddressMovedIn"
            label="Moved in"
            error={errors.previousAddressMovedIn}
            value={data.previousAddressMovedIn ?? ""}
            min="1900-01-01"
            max={today}
            onChange={(value) => onChange({ previousAddressMovedIn: value })}
          />
          <DateField
            id="previousAddressMovedOut"
            label="Moved out"
            error={errors.previousAddressMovedOut}
            value={data.previousAddressMovedOut ?? ""}
            min="1900-01-01"
            max={today}
            onChange={(value) => onChange({ previousAddressMovedOut: value })}
          />
        </div>
      );
    case "ja-previous-address-duration":
      return (
        <div className="flex flex-col gap-4">
          <DateField
            id="jointPreviousMovedIn"
            label="Moved in"
            error={errors.jointPreviousMovedIn}
            value={data.jointPreviousMovedIn ?? ""}
            min="1900-01-01"
            max={today}
            onChange={(value) => onChange({ jointPreviousMovedIn: value })}
          />
          <DateField
            id="jointPreviousMovedOut"
            label="Moved out"
            error={errors.jointPreviousMovedOut}
            value={data.jointPreviousMovedOut ?? ""}
            min="1900-01-01"
            max={today}
            onChange={(value) => onChange({ jointPreviousMovedOut: value })}
          />
        </div>
      );
    case "employer":
      return (
        <Field
          htmlFor="employerName"
          label={data.employmentStatusFull === "self-employed" ? "Business name" : "Employer name"}
          error={errors.employerName}
        >
          <Input
            id="employerName"
            autoComplete="organization"
            value={data.employerName ?? ""}
            error={Boolean(errors.employerName)}
            onChange={(event) => onChange({ employerName: event.target.value })}
          />
        </Field>
      );
    case "ja-employer":
      return (
        <Field
          htmlFor="jointEmployerName"
          label={
            data.jointEmploymentStatusFull === "self-employed" ? "Business name" : "Employer name"
          }
          error={errors.jointEmployerName}
        >
          <Input
            id="jointEmployerName"
            autoComplete="organization"
            value={data.jointEmployerName ?? ""}
            error={Boolean(errors.jointEmployerName)}
            onChange={(event) => onChange({ jointEmployerName: event.target.value })}
          />
        </Field>
      );
    case "job-title":
      return (
        <Field htmlFor="jobTitle" label="Job title" error={errors.jobTitle}>
          <Input
            id="jobTitle"
            autoComplete="organization-title"
            value={data.jobTitle ?? ""}
            error={Boolean(errors.jobTitle)}
            onChange={(event) => onChange({ jobTitle: event.target.value })}
          />
        </Field>
      );
    case "ja-job-title":
      return (
        <Field htmlFor="jointJobTitle" label="Job title" error={errors.jointJobTitle}>
          <Input
            id="jointJobTitle"
            autoComplete="organization-title"
            value={data.jointJobTitle ?? ""}
            error={Boolean(errors.jointJobTitle)}
            onChange={(event) => onChange({ jointJobTitle: event.target.value })}
          />
        </Field>
      );
    case "previous-employer":
      return (
        <Field htmlFor="previousEmployerName" label="Employer name" error={errors.previousEmployerName}>
          <Input
            id="previousEmployerName"
            value={data.previousEmployerName ?? ""}
            error={Boolean(errors.previousEmployerName)}
            onChange={(event) => onChange({ previousEmployerName: event.target.value })}
          />
        </Field>
      );
    case "ja-previous-employer":
      return (
        <Field
          htmlFor="jointPreviousEmployerName"
          label="Employer name"
          error={errors.jointPreviousEmployerName}
        >
          <Input
            id="jointPreviousEmployerName"
            value={data.jointPreviousEmployerName ?? ""}
            error={Boolean(errors.jointPreviousEmployerName)}
            onChange={(event) => onChange({ jointPreviousEmployerName: event.target.value })}
          />
        </Field>
      );
    case "previous-job-title":
      return (
        <Field htmlFor="previousJobTitle" label="Job title" error={errors.previousJobTitle}>
          <Input
            id="previousJobTitle"
            value={data.previousJobTitle ?? ""}
            error={Boolean(errors.previousJobTitle)}
            onChange={(event) => onChange({ previousJobTitle: event.target.value })}
          />
        </Field>
      );
    case "ja-previous-job-title":
      return (
        <Field htmlFor="jointPreviousJobTitle" label="Job title" error={errors.jointPreviousJobTitle}>
          <Input
            id="jointPreviousJobTitle"
            value={data.jointPreviousJobTitle ?? ""}
            error={Boolean(errors.jointPreviousJobTitle)}
            onChange={(event) => onChange({ jointPreviousJobTitle: event.target.value })}
          />
        </Field>
      );
    case "previous-employment-start":
      return (
        <DateField
          id="previousEmploymentStart"
          label="Start date"
          error={errors.previousEmploymentStart}
          value={data.previousEmploymentStart ?? ""}
          min="1900-01-01"
          max={today}
          onChange={(value) => onChange({ previousEmploymentStart: value })}
        />
      );
    case "previous-employment-end":
      return (
        <DateField
          id="previousEmploymentEnd"
          label="End date"
          error={errors.previousEmploymentEnd}
          value={data.previousEmploymentEnd ?? ""}
          min="1900-01-01"
          max={today}
          onChange={(value) => onChange({ previousEmploymentEnd: value })}
        />
      );
    case "ja-previous-employment-start":
      return (
        <DateField
          id="jointPreviousEmploymentStart"
          label="Start date"
          error={errors.jointPreviousEmploymentStart}
          value={data.jointPreviousEmploymentStart ?? ""}
          min="1900-01-01"
          max={today}
          onChange={(value) => onChange({ jointPreviousEmploymentStart: value })}
        />
      );
    case "ja-previous-employment-end":
      return (
        <DateField
          id="jointPreviousEmploymentEnd"
          label="End date"
          error={errors.jointPreviousEmploymentEnd}
          value={data.jointPreviousEmploymentEnd ?? ""}
          min="1900-01-01"
          max={today}
          onChange={(value) => onChange({ jointPreviousEmploymentEnd: value })}
        />
      );
    case "income":
      return (
        <MoneyField
          id="monthlyIncome"
          label="Monthly income"
          error={errors.monthlyIncome}
          value={data.monthlyIncome ?? ""}
          onChange={(value) => onChange({ monthlyIncome: value })}
        />
      );
    case "other-income":
      return (
        <MoneyField
          id="otherIncome"
          label="Other income"
          hint="Optional"
          error={errors.otherIncome}
          value={data.otherIncome ?? ""}
          onChange={(value) => onChange({ otherIncome: value })}
        />
      );
    case "ja-income":
      return (
        <MoneyField
          id="jointMonthlyIncome"
          label="Monthly income"
          error={errors.jointMonthlyIncome}
          value={data.jointMonthlyIncome ?? ""}
          onChange={(value) => onChange({ jointMonthlyIncome: value })}
        />
      );
    case "px-registration":
      return (
        <div className="flex flex-col gap-4">
          <Field
            htmlFor="partExchangeRegistration"
            label="Registration"
            error={errors.partExchangeRegistration}
          >
            <Input
              id="partExchangeRegistration"
              autoCapitalize="characters"
              placeholder="AB12 CDE"
              disabled={data.partExchangeRegUnknown}
              value={data.partExchangeRegistration ?? ""}
              error={Boolean(errors.partExchangeRegistration)}
              onChange={(event) =>
                onChange({ partExchangeRegistration: event.target.value.toUpperCase() })
              }
            />
          </Field>
          <div className="flex items-start gap-3">
            <input
              id="partExchangeRegUnknown"
              type="checkbox"
              checked={Boolean(data.partExchangeRegUnknown)}
              onChange={(event) => onChange({ partExchangeRegUnknown: event.target.checked })}
              className="mt-1 h-5 w-5 accent-primary"
            />
            <label htmlFor="partExchangeRegUnknown" className="text-body-sm">
              I don’t know the plate
            </label>
          </div>
        </div>
      );
    case "px-mileage":
      return (
        <Field htmlFor="partExchangeMileage" label="Mileage" error={errors.partExchangeMileage}>
          <Input
            id="partExchangeMileage"
            inputMode="numeric"
            placeholder="Miles"
            value={data.partExchangeMileage ?? ""}
            error={Boolean(errors.partExchangeMileage)}
            onChange={(event) => onChange({ partExchangeMileage: digitsOnly(event.target.value) })}
          />
        </Field>
      );
    case "px-lender":
      return (
        <LenderField
          value={data.partExchangeLender ?? ""}
          error={errors.partExchangeLender}
          onChange={(value) => onChange({ partExchangeLender: value })}
        />
      );
    case "px-monthly-payment":
      return (
        <MoneyField
          id="partExchangeMonthlyPayment"
          label="Monthly payment"
          error={errors.partExchangeMonthlyPayment}
          value={data.partExchangeMonthlyPayment ?? ""}
          onChange={(value) => onChange({ partExchangeMonthlyPayment: value })}
        />
      );
    case "px-settlement":
      return (
        <MoneyField
          id="settlementAmount"
          label="Settlement figure"
          hint="Optional"
          error={errors.settlementAmount}
          value={data.settlementAmount ?? ""}
          onChange={(value) => onChange({ settlementAmount: value })}
        />
      );
    case "ja-review":
      return (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {getJointReviewRows(data).map((item) => (
            <li key={item.stepId + item.label} className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-caption text-muted">{item.label}</p>
                <p className="mt-1 text-body-sm">{item.value}</p>
              </div>
              <button
                type="button"
                className="text-caption text-primary"
                onClick={() => onEditStep(item.stepId)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      );
    case "consent":
      return (
        <div className="flex flex-col gap-6">
          <ReviewList groups={getReviewGroups(data)} onEditSection={onEditSection} />
          <div className="flex flex-col gap-4">
            <ConsentCheck
              id="termsAccepted"
              checked={Boolean(data.termsAccepted)}
              error={errors.termsAccepted}
              onChange={(checked) => onChange({ termsAccepted: checked })}
            >
              I agree to the{" "}
              <a
                href={routes.termsOfUse}
                className="text-primary underline underline-offset-4"
                onClick={(event) => event.stopPropagation()}
              >
                terms of use
              </a>
              .
            </ConsentCheck>
            <ConsentCheck
              id="privacyAccepted"
              checked={Boolean(data.privacyAccepted)}
              error={errors.privacyAccepted}
              onChange={(checked) => onChange({ privacyAccepted: checked })}
            >
              I agree to the{" "}
              <a
                href={routes.privacyPolicy}
                className="text-primary underline underline-offset-4"
                onClick={(event) => event.stopPropagation()}
              >
                privacy policy
              </a>{" "}
              and a soft search of these details.
            </ConsentCheck>
            <ConsentCheck
              id="marketingConsent"
              checked={Boolean(data.marketingConsent)}
              onChange={(checked) => onChange({ marketingConsent: checked })}
            >
              {MARKETING_CONSENT_WORDING}
            </ConsentCheck>
          </div>
        </div>
      );
    default:
      return null;
  }
}
