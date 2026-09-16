"use client";

import { Field, Input } from "@/components/forms/FormControls";

export function MoneyInput({
  id,
  name,
  label,
  hint,
  error,
  value,
  onChange,
  onBlur,
}: {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <Field htmlFor={id} label={label} hint={hint} error={error}>
      <Input
        id={id}
        name={name ?? id}
        inputMode="numeric"
        autoComplete="off"
        enterKeyHint="done"
        error={Boolean(error)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
    </Field>
  );
}
