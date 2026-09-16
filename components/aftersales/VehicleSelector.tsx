"use client";

import { PxRegistrationForm } from "@/components/part-exchange/PxRegistrationForm";

export function VehicleSelector({
  value,
  error,
  onChange,
  onManual,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onManual?: () => void;
}) {
  return (
    <PxRegistrationForm
      id="aftersales-registration"
      value={value}
      error={error}
      onChange={onChange}
      onManual={onManual}
    />
  );
}
