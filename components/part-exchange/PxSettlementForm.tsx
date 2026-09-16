import { EligibilityCurrencyInput, EligibilitySingleChoice } from "@/components/eligibility/controls";
import {
  PX_FINANCE_NO,
  PX_FINANCE_YES,
  PX_SETTLEMENT_HELPER,
} from "@/lib/part-exchange/copy";

export function PxSettlementForm({
  mode = "finance",
  financeOutstanding,
  settlement,
  error,
  onFinanceChange,
  onSettlementChange,
}: {
  mode?: "finance" | "amount";
  financeOutstanding?: boolean;
  settlement: string;
  error?: string;
  onFinanceChange: (value: boolean) => void;
  onSettlementChange: (value: string) => void;
}) {
  if (mode === "amount") {
    return (
      <div className="mt-6">
        <EligibilityCurrencyInput
          id="px-settlement"
          label="Settlement figure"
          hint={PX_SETTLEMENT_HELPER}
          error={error}
          value={settlement}
          onChange={onSettlementChange}
          placeholder="7500"
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <EligibilitySingleChoice
        name="px-finance"
        labelledBy="px-question"
        value={
          financeOutstanding === undefined
            ? undefined
            : financeOutstanding
              ? "yes"
              : "no"
        }
        onChange={(value) => onFinanceChange(value === "yes")}
        options={[
          { value: "no", label: PX_FINANCE_NO },
          { value: "yes", label: PX_FINANCE_YES },
        ]}
      />
    </div>
  );
}
