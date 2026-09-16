"use client";

import { getBudgetBandLabel, getEmploymentLabel } from "@/lib/eligibility/borrowing";
import { formatPounds } from "@/lib/format/money";
import { SOFT_SEARCH_CONSENT_WORDING } from "@/lib/eligibility/copy";
import type { EligibilityAnswers } from "@/types/eligibility";

export function EligibilitySummary({
  answers,
}: {
  answers: EligibilityAnswers;
}) {
  const rows = [
    { label: "Your details", value: answers.firstName ?? "—" },
    { label: "Employment", value: getEmploymentLabel(answers.employment) },
    {
      label: "Income",
      value:
        answers.monthlyIncome !== undefined
          ? `${formatPounds(answers.monthlyIncome)} / month`
          : "—",
    },
    {
      label: "Deposit",
      value:
        answers.deposit !== undefined ? formatPounds(answers.deposit) : "—",
    },
    {
      label: "Monthly budget",
      value: getBudgetBandLabel(answers.monthlyBudget),
    },
  ];

  return (
    <div>
      <h1 className="text-h2">Ready to check your eligibility?</h1>
      <p className="mt-3 text-body text-muted">{SOFT_SEARCH_CONSENT_WORDING}</p>
      <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <dt className="text-caption text-muted">{row.label}</dt>
            <dd className="text-body-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
