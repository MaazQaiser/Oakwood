"use client";

import { TermSelector as TermSelectorControl } from "@/components/finance/TermSelector";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";

export function TermSelector() {
  const { draft, config, finance, setTerm } = useDealBuilder();
  const maxTerm = finance.profile?.maximumTerm ?? Math.max(...config.termOptions);
  const options =
    draft.financeType === "pcp"
      ? config.termOptions.filter((term) => term <= 60)
      : config.termOptions;

  return (
    <TermSelectorControl
      value={draft.term}
      options={options}
      maxTerm={maxTerm}
      onChange={setTerm}
    />
  );
}
