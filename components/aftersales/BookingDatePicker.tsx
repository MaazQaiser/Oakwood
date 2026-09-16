"use client";

import { useMemo } from "react";
import { Field, Input } from "@/components/forms/FormControls";

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function BookingDatePicker({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const min = useMemo(() => todayIso(), []);

  return (
    <div className="mt-6">
      <Field
        htmlFor="booking-date"
        label="Preferred date"
        hint="This is a preference until Oakwood confirms the appointment."
        error={error}
      >
        <Input
          id="booking-date"
          name="booking-date"
          type="date"
          min={min}
          value={value}
          error={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    </div>
  );
}
