"use client";

import { AnnualMileageSelector as AnnualMileageSelectorControl } from "@/components/finance/AnnualMileageSelector";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";

export function AnnualMileageSelector() {
  const { draft, config, setAnnualMileage } = useDealBuilder();

  if (draft.financeType !== "pcp" || !config.pcpEnabled) {
    return null;
  }

  return (
    <AnnualMileageSelectorControl
      value={draft.annualMileage}
      options={config.pcpMileageOptions}
      onChange={setAnnualMileage}
    />
  );
}
