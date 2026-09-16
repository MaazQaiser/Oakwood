"use client";

import { EligibilitySingleChoice } from "@/components/eligibility/controls";
import type { AftersalesBookingType } from "@/config/routes";

export function ServiceSelector({
  value,
  onChange,
  labelledBy,
}: {
  value?: AftersalesBookingType;
  onChange: (value: AftersalesBookingType) => void;
  labelledBy?: string;
}) {
  return (
    <EligibilitySingleChoice
      name="aftersales-service"
      labelledBy={labelledBy}
      value={value}
      onChange={(next) => onChange(next as AftersalesBookingType)}
      options={[
        { value: "service", label: "Service" },
        { value: "mot", label: "MOT" },
      ]}
    />
  );
}
