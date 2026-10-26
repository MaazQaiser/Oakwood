import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import {
  DEAL_CALCULATION_UNAVAILABLE,
  DEAL_ILLUSTRATION_PERSONALISED,
  DEAL_SOFT_SEARCH,
  DEAL_TOTAL_PAYABLE_LABEL,
  DEAL_YOUR_DEAL_TIER_HINT,
} from "@/lib/deal/copy";
import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { getRatesFromLabel } from "@/lib/finance/representative-example";
import { formatPounds } from "@/lib/format/money";

/** Navy summary. Figures come from the current deal calculation. */
export function DealMonthlyBar() {
  const { calculation, draft, phase } = useDealBuilder();
  const ratesFrom = getRatesFromLabel(FINANCE_CALCULATOR_CONFIG.ratesFromApr);
  const unavailable =
    phase === "CALCULATION_ERROR" || calculation === undefined;

  return (
    <div className="rounded-[20px] bg-navy px-4 py-4 text-white">
      <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
        Monthly payment
      </p>
      {unavailable ? (
        <p className="mt-1.5 text-body-sm text-white" role="status">
          {DEAL_CALCULATION_UNAVAILABLE}
        </p>
      ) : (
        <p className="mt-2" role="status">
          <FinancialNumber
            value={formatPounds(calculation.monthlyPayment)}
            suffix="/mo"
            size="sm"
            className="text-white"
          />
        </p>
      )}
      <p className="mt-1 text-caption text-white/80">
        {draft.financeType === "pcp" ? "Personal Contract Purchase" : "Hire Purchase"}
        {calculation ? ` · ${DEAL_TOTAL_PAYABLE_LABEL} ${formatPounds(calculation.totalPayable)}` : ""}
      </p>
      <p className="mt-1.5 text-caption text-white/75">
        {DEAL_ILLUSTRATION_PERSONALISED} {DEAL_SOFT_SEARCH} {DEAL_YOUR_DEAL_TIER_HINT}
        {ratesFrom ? ` ${ratesFrom}.` : ""}
      </p>
    </div>
  );
}
