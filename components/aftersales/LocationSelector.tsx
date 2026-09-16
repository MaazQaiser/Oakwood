"use client";

import { EligibilitySingleChoice } from "@/components/eligibility/controls";
import { showrooms } from "@/config/locations";

export function LocationSelector({
  value,
  onChange,
  labelledBy,
}: {
  value?: string;
  onChange: (value: string) => void;
  labelledBy?: string;
}) {
  return (
    <EligibilitySingleChoice
      name="aftersales-location"
      labelledBy={labelledBy}
      value={value}
      onChange={onChange}
      options={showrooms.map((location) => ({
        value: location.slug,
        label: location.postcode
          ? `${location.name} · ${location.postcode}`
          : location.name,
      }))}
    />
  );
}
