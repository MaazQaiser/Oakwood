"use client";

import { Field, Input, Select, Checkbox } from "@/components/forms/FormControls";
import { Button } from "@/components/ui/Button";
import { DEAL_APPLICATION_CONFIG } from "@/config/deal-application";
import {
  APP_ADDRESS_HISTORY_HINT,
  APP_BANK_OPTIONAL_HINT,
  APP_BANK_REQUIRED_HINT,
  APP_CONSENT_COMPLIANCE,
  APP_CONSENT_LABEL,
  APP_EMPLOYMENT_HISTORY_HINT,
  APP_EMPLOYMENT_OPTIONS,
  APP_INCOME_HINT,
  APP_LICENCE_HINT,
  APP_MARITAL_OPTIONS,
  APP_OPTIONAL,
  APP_OUTGOINGS_HINT,
} from "@/lib/deal/application/copy";
import type { SectionErrors } from "@/lib/deal/application/validation";
import type {
  DealApplicationAddress,
  DealApplicationEmployment,
  DealApplicationFormState,
} from "@/types/deal-application";

function formatSortCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  return digits.replace(/(\d{2})(?=\d)/g, "$1-").slice(0, 8);
}

function MonthInput({
  id,
  value,
  error,
  onChange,
}: {
  id: string;
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      id={id}
      type="month"
      value={value}
      error={error}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function PersonalSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  const { personal } = form;
  return (
    <div className="space-y-4">
      <Field htmlFor="app-full-name" label="Full name" error={errors.fullName}>
        <Input
          id="app-full-name"
          autoComplete="name"
          value={personal.fullName}
          error={Boolean(errors.fullName)}
          onChange={(event) =>
            onChange({
              ...form,
              personal: { ...personal, fullName: event.target.value },
            })
          }
        />
      </Field>
      <Field
        htmlFor="app-dob"
        label="Date of birth"
        error={errors.dateOfBirth}
      >
        <Input
          id="app-dob"
          type="date"
          autoComplete="bday"
          value={personal.dateOfBirth}
          error={Boolean(errors.dateOfBirth)}
          onChange={(event) =>
            onChange({
              ...form,
              personal: { ...personal, dateOfBirth: event.target.value },
            })
          }
        />
      </Field>
      <Field
        htmlFor="app-marital"
        label="Marital status"
        error={errors.maritalStatus}
        hint="Option list pending compliance confirmation."
      >
        <Select
          id="app-marital"
          value={personal.maritalStatus}
          error={Boolean(errors.maritalStatus)}
          onChange={(event) =>
            onChange({
              ...form,
              personal: {
                ...personal,
                maritalStatus: event.target
                  .value as typeof personal.maritalStatus,
              },
            })
          }
        >
          <option value="">Select…</option>
          {APP_MARITAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field htmlFor="app-email" label="Email" error={errors.email}>
          <Input
            id="app-email"
            type="email"
            autoComplete="email"
            value={personal.email}
            error={Boolean(errors.email)}
            onChange={(event) =>
              onChange({
                ...form,
                personal: { ...personal, email: event.target.value },
              })
            }
          />
        </Field>
        <Field htmlFor="app-phone" label="Mobile" error={errors.phone}>
          <Input
            id="app-phone"
            type="tel"
            autoComplete="tel"
            value={personal.phone}
            error={Boolean(errors.phone)}
            onChange={(event) =>
              onChange({
                ...form,
                personal: { ...personal, phone: event.target.value },
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

export function AddressSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  function updateAddress(
    index: number,
    patch: Partial<DealApplicationAddress>,
  ) {
    const addresses = form.addresses.map((address, i) =>
      i === index ? { ...address, ...patch } : address,
    );
    onChange({ ...form, addresses });
  }

  function addAddress() {
    onChange({
      ...form,
      addresses: [
        ...form.addresses,
        { line1: "", city: "", postcode: "", movedIn: "", movedOut: "" },
      ],
    });
  }

  function removeAddress(index: number) {
    if (index === 0 || form.addresses.length <= 1) return;
    onChange({
      ...form,
      addresses: form.addresses.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-caption text-muted">{APP_ADDRESS_HISTORY_HINT}</p>
      {errors.history ? (
        <p className="text-caption text-danger" role="alert">
          {errors.history}
        </p>
      ) : null}
      {form.addresses.map((address, index) => {
        const prefix = `address-${index}`;
        return (
          <div
            key={prefix}
            className="space-y-3 rounded-[16px] border border-border bg-page-tint p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-label">
                {index === 0 ? "Current address" : `Previous address ${index}`}
              </p>
              {index > 0 ? (
                <Button
                  type="button"
                  variant="text"
                  className="min-h-9 px-1 text-caption"
                  onClick={() => removeAddress(index)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <Field
              htmlFor={`${prefix}-line1`}
              label="Address line 1"
              error={errors[`${prefix}-line1`]}
            >
              <Input
                id={`${prefix}-line1`}
                autoComplete={index === 0 ? "address-line1" : "off"}
                value={address.line1}
                error={Boolean(errors[`${prefix}-line1`])}
                onChange={(event) =>
                  updateAddress(index, { line1: event.target.value })
                }
              />
            </Field>
            <Field htmlFor={`${prefix}-line2`} label="Address line 2 (optional)">
              <Input
                id={`${prefix}-line2`}
                autoComplete={index === 0 ? "address-line2" : "off"}
                value={address.line2 ?? ""}
                onChange={(event) =>
                  updateAddress(index, { line2: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                htmlFor={`${prefix}-city`}
                label="Town / city"
                error={errors[`${prefix}-city`]}
              >
                <Input
                  id={`${prefix}-city`}
                  autoComplete={index === 0 ? "address-level2" : "off"}
                  value={address.city}
                  error={Boolean(errors[`${prefix}-city`])}
                  onChange={(event) =>
                    updateAddress(index, { city: event.target.value })
                  }
                />
              </Field>
              <Field
                htmlFor={`${prefix}-postcode`}
                label="Postcode"
                error={errors[`${prefix}-postcode`]}
              >
                <Input
                  id={`${prefix}-postcode`}
                  autoComplete={index === 0 ? "postal-code" : "off"}
                  className="uppercase"
                  value={address.postcode}
                  error={Boolean(errors[`${prefix}-postcode`])}
                  onChange={(event) =>
                    updateAddress(index, {
                      postcode: event.target.value.toUpperCase(),
                    })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                htmlFor={`${prefix}-movedIn`}
                label="Moved in"
                error={errors[`${prefix}-movedIn`]}
              >
                <MonthInput
                  id={`${prefix}-movedIn`}
                  value={address.movedIn}
                  error={Boolean(errors[`${prefix}-movedIn`])}
                  onChange={(movedIn) => updateAddress(index, { movedIn })}
                />
              </Field>
              {index > 0 ? (
                <Field
                  htmlFor={`${prefix}-movedOut`}
                  label="Moved out"
                  error={errors[`${prefix}-movedOut`]}
                >
                  <MonthInput
                    id={`${prefix}-movedOut`}
                    value={address.movedOut ?? ""}
                    error={Boolean(errors[`${prefix}-movedOut`])}
                    onChange={(movedOut) => updateAddress(index, { movedOut })}
                  />
                </Field>
              ) : null}
            </div>
          </div>
        );
      })}
      <Button type="button" variant="secondary" onClick={addAddress}>
        Add previous address
      </Button>
    </div>
  );
}

export function EmploymentSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  function updateJob(
    index: number,
    patch: Partial<DealApplicationEmployment>,
  ) {
    const employment = form.employment.map((job, i) =>
      i === index ? { ...job, ...patch } : job,
    );
    onChange({ ...form, employment });
  }

  function addJob() {
    onChange({
      ...form,
      employment: [
        ...form.employment,
        {
          status: "employed",
          employerName: "",
          jobTitle: "",
          started: "",
          ended: "",
        },
      ],
    });
  }

  function removeJob(index: number) {
    if (index === 0 || form.employment.length <= 1) return;
    onChange({
      ...form,
      employment: form.employment.filter((_, i) => i !== index),
    });
  }

  const current = form.employment[0];
  const showHistoryHint =
    current?.status === "employed" || current?.status === "self-employed";

  return (
    <div className="space-y-5">
      {showHistoryHint ? (
        <p className="text-caption text-muted">{APP_EMPLOYMENT_HISTORY_HINT}</p>
      ) : null}
      {errors.history ? (
        <p className="text-caption text-danger" role="alert">
          {errors.history}
        </p>
      ) : null}
      {form.employment.map((job, index) => {
        const prefix = `job-${index}`;
        const needsEmployer =
          job.status === "employed" ||
          job.status === "self-employed" ||
          index > 0;
        return (
          <div
            key={prefix}
            className="space-y-3 rounded-[16px] border border-border bg-page-tint p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-label">
                {index === 0 ? "Current employment" : `Previous role ${index}`}
              </p>
              {index > 0 ? (
                <Button
                  type="button"
                  variant="text"
                  className="min-h-9 px-1 text-caption"
                  onClick={() => removeJob(index)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            {index === 0 ? (
              <Field
                htmlFor={`${prefix}-status`}
                label="Employment status"
                error={errors[`${prefix}-status`]}
              >
                <Select
                  id={`${prefix}-status`}
                  value={job.status}
                  error={Boolean(errors[`${prefix}-status`])}
                  onChange={(event) =>
                    updateJob(index, {
                      status: event.target.value as typeof job.status,
                    })
                  }
                >
                  <option value="">Select…</option>
                  {APP_EMPLOYMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}
            {needsEmployer ? (
              <>
                <Field
                  htmlFor={`${prefix}-employer`}
                  label={
                    job.status === "self-employed"
                      ? "Business name"
                      : "Employer name"
                  }
                  error={errors[`${prefix}-employer`]}
                >
                  <Input
                    id={`${prefix}-employer`}
                    value={job.employerName}
                    error={Boolean(errors[`${prefix}-employer`])}
                    onChange={(event) =>
                      updateJob(index, { employerName: event.target.value })
                    }
                  />
                </Field>
                <Field htmlFor={`${prefix}-title`} label="Job title (optional)">
                  <Input
                    id={`${prefix}-title`}
                    value={job.jobTitle}
                    onChange={(event) =>
                      updateJob(index, { jobTitle: event.target.value })
                    }
                  />
                </Field>
              </>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                htmlFor={`${prefix}-started`}
                label="Started"
                error={errors[`${prefix}-started`]}
              >
                <MonthInput
                  id={`${prefix}-started`}
                  value={job.started}
                  error={Boolean(errors[`${prefix}-started`])}
                  onChange={(started) => updateJob(index, { started })}
                />
              </Field>
              {index > 0 ? (
                <Field
                  htmlFor={`${prefix}-ended`}
                  label="Ended"
                  error={errors[`${prefix}-ended`]}
                >
                  <MonthInput
                    id={`${prefix}-ended`}
                    value={job.ended ?? ""}
                    error={Boolean(errors[`${prefix}-ended`])}
                    onChange={(ended) => updateJob(index, { ended })}
                  />
                </Field>
              ) : null}
            </div>
          </div>
        );
      })}
      {showHistoryHint ? (
        <Button type="button" variant="secondary" onClick={addJob}>
          Add previous employment
        </Button>
      ) : null}
    </div>
  );
}

export function IncomeSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  return (
    <div className="space-y-4">
      <Field
        htmlFor="app-income"
        label="Gross annual income"
        hint={APP_INCOME_HINT}
        error={errors.grossAnnualIncome}
      >
        <Input
          id="app-income"
          inputMode="numeric"
          className="tabular-number"
          value={
            form.income.grossAnnualIncome === ""
              ? ""
              : String(form.income.grossAnnualIncome)
          }
          error={Boolean(errors.grossAnnualIncome)}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "");
            onChange({
              ...form,
              income: {
                ...form.income,
                grossAnnualIncome: raw === "" ? "" : Number(raw),
              },
            });
          }}
        />
      </Field>
      <Field
        htmlFor="app-outgoings"
        label="Monthly outgoings"
        hint={APP_OUTGOINGS_HINT}
        error={errors.monthlyOutgoings}
      >
        <Input
          id="app-outgoings"
          inputMode="numeric"
          className="tabular-number"
          value={
            form.income.monthlyOutgoings === ""
              ? ""
              : String(form.income.monthlyOutgoings)
          }
          error={Boolean(errors.monthlyOutgoings)}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "");
            onChange({
              ...form,
              income: {
                ...form.income,
                monthlyOutgoings: raw === "" ? "" : Number(raw),
              },
            });
          }}
        />
      </Field>
    </div>
  );
}

function sortCodeParts(sortCode: string): [string, string, string] {
  const digits = sortCode.replace(/\D/g, "").slice(0, 6);
  return [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 6),
  ];
}

function joinSortCode(a: string, b: string, c: string): string {
  return formatSortCode(`${a}${b}${c}`);
}

export function BankSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  const bank = form.bank ?? {
    sortCode: "",
    accountNumber: "",
    yearsAtBank: "" as const,
    monthsAtBank: "" as const,
  };
  const optional = DEAL_APPLICATION_CONFIG.collectBankDetails === "optional";
  const [partA, partB, partC] = sortCodeParts(bank.sortCode);

  function setSortPart(index: 0 | 1 | 2, raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const next: [string, string, string] = [partA, partB, partC];
    next[index] = digits;
    onChange({
      ...form,
      bank: { ...bank, sortCode: joinSortCode(next[0], next[1], next[2]) },
    });
    if (digits.length === 2) {
      const nextId =
        index === 0 ? "app-sort-b" : index === 1 ? "app-sort-c" : null;
      if (nextId) {
        document.getElementById(nextId)?.focus();
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {optional ? (
          <span className="rounded-full bg-page-tint px-2.5 py-1 text-caption font-semibold! text-muted">
            {APP_OPTIONAL}
          </span>
        ) : null}
        <p className="text-caption text-muted">
          {optional ? APP_BANK_OPTIONAL_HINT : APP_BANK_REQUIRED_HINT}
        </p>
      </div>
      <fieldset>
        <legend className="text-label">Sort code</legend>
        {errors.sortCode ? (
          <p className="mt-1 text-caption text-danger" role="alert">
            {errors.sortCode}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <Input
            id="app-sort-a"
            inputMode="numeric"
            autoComplete="off"
            aria-label="Sort code first pair"
            className="w-16 text-center tabular-number"
            maxLength={2}
            value={partA}
            error={Boolean(errors.sortCode)}
            onChange={(event) => setSortPart(0, event.target.value)}
          />
          <span className="text-muted" aria-hidden>
            -
          </span>
          <Input
            id="app-sort-b"
            inputMode="numeric"
            autoComplete="off"
            aria-label="Sort code second pair"
            className="w-16 text-center tabular-number"
            maxLength={2}
            value={partB}
            error={Boolean(errors.sortCode)}
            onChange={(event) => setSortPart(1, event.target.value)}
          />
          <span className="text-muted" aria-hidden>
            -
          </span>
          <Input
            id="app-sort-c"
            inputMode="numeric"
            autoComplete="off"
            aria-label="Sort code third pair"
            className="w-16 text-center tabular-number"
            maxLength={2}
            value={partC}
            error={Boolean(errors.sortCode)}
            onChange={(event) => setSortPart(2, event.target.value)}
          />
        </div>
      </fieldset>
      <Field
        htmlFor="app-account"
        label="Account number"
        error={errors.accountNumber}
      >
        <Input
          id="app-account"
          inputMode="numeric"
          autoComplete="off"
          className="tabular-number"
          maxLength={8}
          value={bank.accountNumber}
          error={Boolean(errors.accountNumber)}
          onChange={(event) =>
            onChange({
              ...form,
              bank: {
                ...bank,
                accountNumber: event.target.value.replace(/\D/g, "").slice(0, 8),
              },
            })
          }
        />
      </Field>
      <fieldset>
        <legend className="text-label">Time at bank</legend>
        {errors.timeAtBank ? (
          <p className="mt-1 text-caption text-danger" role="alert">
            {errors.timeAtBank}
          </p>
        ) : null}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Field htmlFor="app-bank-years" label="Years">
            <Select
              id="app-bank-years"
              value={bank.yearsAtBank === "" ? "" : String(bank.yearsAtBank)}
              onChange={(event) => {
                const raw = event.target.value;
                onChange({
                  ...form,
                  bank: {
                    ...bank,
                    yearsAtBank: raw === "" ? "" : Number(raw),
                  },
                });
              }}
            >
              <option value="">Select…</option>
              {Array.from({ length: 51 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Field>
          <Field htmlFor="app-bank-months" label="Months">
            <Select
              id="app-bank-months"
              value={
                bank.monthsAtBank === "" ? "" : String(bank.monthsAtBank)
              }
              onChange={(event) => {
                const raw = event.target.value;
                onChange({
                  ...form,
                  bank: {
                    ...bank,
                    monthsAtBank: raw === "" ? "" : Number(raw),
                  },
                });
              }}
            >
              <option value="">Select…</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>
      <p className="text-caption text-muted">
        Bank details are never shown on your deal summary or confirmation
        screen. Open Banking is not used in this prototype.
      </p>
    </div>
  );
}

export function LicenceSection({
  form,
  errors,
  onChange,
}: {
  form: DealApplicationFormState;
  errors: SectionErrors;
  onChange: (next: DealApplicationFormState) => void;
}) {
  return (
    <div className="space-y-4">
      <Field
        htmlFor="app-licence"
        label="Driving licence number"
        hint={APP_LICENCE_HINT}
        error={errors.drivingLicenceNumber}
      >
        <Input
          id="app-licence"
          autoComplete="off"
          className="uppercase"
          value={form.licence.drivingLicenceNumber}
          error={Boolean(errors.drivingLicenceNumber)}
          onChange={(event) =>
            onChange({
              ...form,
              licence: {
                ...form.licence,
                drivingLicenceNumber: event.target.value.toUpperCase(),
              },
            })
          }
        />
      </Field>
      <div>
        <Checkbox
          id="app-consent"
          label={APP_CONSENT_LABEL}
          checked={form.licence.consentToSearch}
          onChange={(event) =>
            onChange({
              ...form,
              licence: {
                ...form.licence,
                consentToSearch: event.target.checked,
              },
            })
          }
        />
        {errors.consentToSearch ? (
          <p className="mt-1 text-caption text-danger" role="alert">
            {errors.consentToSearch}
          </p>
        ) : null}
        <p className="mt-2 text-caption text-muted">{APP_CONSENT_COMPLIANCE}</p>
      </div>
    </div>
  );
}
