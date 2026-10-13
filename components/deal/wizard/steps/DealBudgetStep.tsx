"use client";

import { useState } from "react";
import { DepositControl } from "@/components/deal/DepositControl";
import { TermSelector } from "@/components/deal/TermSelector";
import { FinanceTypeSelector } from "@/components/deal/FinanceTypeSelector";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DealChipGroup } from "@/components/deal/wizard/DealChipGroup";
import { DealStepFooter } from "@/components/deal/wizard/DealStepFooter";
import { useDealStepNavigation } from "@/components/deal/wizard/DealWizardShell";

function mileageLabel(miles: number): string {
  if (miles >= 1000) {
    return `${Math.round(miles / 1000)}k`;
  }
  return String(miles);
}

export function DealBudgetStep() {
  const { draft, config, setAnnualMileage } = useDealBuilder();
  const { goNext, goBack } = useDealStepNavigation("budget");
  const presetMiles = config.pcpMileageOptions;
  const isPreset = draft.annualMileage
    ? presetMiles.includes(draft.annualMileage)
    : true;
  const [otherSelected, setOtherSelected] = useState(!isPreset);
  const [otherValue, setOtherValue] = useState(
    !isPreset && draft.annualMileage ? String(draft.annualMileage) : "",
  );

  const mileageOptions = [
    ...presetMiles.map((miles) => ({
      value: String(miles),
      label: mileageLabel(miles),
    })),
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <FinanceTypeSelector />
      <DepositControl />
      <TermSelector />

      {draft.financeType === "pcp" && config.pcpEnabled ? (
        <div className="space-y-3">
          <DealChipGroup
            label="Annual mileage"
            value={otherSelected ? "other" : String(draft.annualMileage ?? "")}
            options={mileageOptions}
            onChange={(value) => {
              if (value === "other") {
                setOtherSelected(true);
                return;
              }
              setOtherSelected(false);
              setAnnualMileage(Number(value));
            }}
          />
          {otherSelected ? (
            <label className="block">
              <span className="text-label">Custom annual mileage</span>
              <input
                className="mt-1 w-full min-h-11 rounded-md border border-border-strong bg-page px-3"
                inputMode="numeric"
                value={otherValue}
                onChange={(event) => {
                  setOtherValue(event.target.value);
                  const next = Number(event.target.value);
                  if (Number.isFinite(next) && next > 0) {
                    setAnnualMileage(next);
                  }
                }}
              />
            </label>
          ) : null}
          <p className="text-caption text-muted">
            Annual mileage applies to PCP only.
          </p>
        </div>
      ) : null}

      <p className="text-caption text-muted">
        72 and 84 month terms are available on HP only.
      </p>

      <DealStepFooter
        onBack={() => goBack("part-exchange")}
        onContinue={() => goNext("decision")}
      />
    </div>
  );
}
