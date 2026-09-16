"use client";

import { FinanceTypeSelector as FinanceTypeSelectorControl } from "@/components/finance/FinanceTypeSelector";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";

export function FinanceTypeSelector() {
  const { draft, config, setFinanceType } = useDealBuilder();

  return (
    <FinanceTypeSelectorControl
      value={draft.financeType}
      onChange={setFinanceType}
      pcpEnabled={config.pcpEnabled}
    />
  );
}
