"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Field, Input, Select } from "@/components/forms/FormControls";
import { Checkbox } from "@/components/forms/FormControls";
import { cn } from "@/lib/cn";
import type { EligibilityChoiceOption } from "@/types/eligibility";

function ChoiceButton({
  selected,
  label,
  onSelect,
  name,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      name={name}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center rounded-lg border px-4 text-left text-body",
        selected
          ? "border-primary bg-primary-soft text-ink"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      {label}
    </button>
  );
}

export function EligibilitySingleChoice({
  name,
  labelledBy,
  options,
  value,
  onChange,
}: {
  name: string;
  labelledBy?: string;
  options: EligibilityChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-col gap-3">
      {options.map((option) => (
        <ChoiceButton
          key={option.value}
          name={name}
          label={option.label}
          selected={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

export function EligibilityYesNo({
  name,
  labelledBy,
  value,
  onChange,
}: {
  name: string;
  labelledBy?: string;
  value?: string;
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <EligibilitySingleChoice
      name={name}
      labelledBy={labelledBy}
      value={value}
      onChange={(next) => onChange(next as "yes" | "no")}
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
    />
  );
}

function PrefixInput({
  prefix,
  children,
}: {
  prefix: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-12 items-stretch overflow-hidden rounded-md border border-border bg-surface">
      <span className="flex items-center bg-page px-3 text-body text-muted" aria-hidden>
        {prefix}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function EligibilityInput(props: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <Input {...props} />;
}

export function EligibilityCurrencyInput({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  placeholder = "Amount",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <PrefixInput prefix="£">
        <input
          id={id}
          name={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          className="financial-number h-12 w-full border-0 bg-transparent px-3 text-body outline-none"
        />
      </PrefixInput>
    </Field>
  );
}

export function EligibilityNumberInput({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={id}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
      />
    </Field>
  );
}

export function EligibilityDateInput({
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
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={id}
        type="date"
        value={value}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

export function EligibilityTextInput({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

export function EligibilityPostcodeInput({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  placeholder = "Enter postcode",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <EligibilityTextInput
      id={id}
      label={label}
      hint={hint}
      error={error}
      value={value}
      placeholder={placeholder}
      autoComplete="postal-code"
      onChange={(next) => onChange(next.toUpperCase())}
    />
  );
}

export function EligibilityDropdown({
  id,
  label,
  hint,
  error,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  options: EligibilityChoiceOption[];
  onChange: (value: string) => void;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Select
        id={id}
        name={id}
        value={value}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Choose an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function EligibilityAutocomplete({
  id,
  label,
  hint,
  error,
  value,
  options,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const listId = useId();
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={id}
        list={listId}
        placeholder={placeholder}
        value={value}
        error={Boolean(error)}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </Field>
  );
}

export function EligibilityConsent({
  id,
  label,
  checked,
  onChange,
  note,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        id={id}
        name={id}
        label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {note ? <p className="text-caption text-muted">{note}</p> : null}
    </div>
  );
}
