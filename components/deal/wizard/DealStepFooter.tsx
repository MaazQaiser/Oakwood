"use client";

import { Button } from "@/components/ui/Button";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import { DEAL_BACK, DEAL_CONTINUE, DEAL_SKIP_PX } from "@/lib/deal/copy";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

/**
 * Sticky action bar for every wizard step. On mobile it also carries the
 * live monthly so the figure stays in view while the customer edits.
 */
export function DealStepFooter({
  onBack,
  onContinue,
  onSkip,
  continueLabel = DEAL_CONTINUE,
  skipLabel = DEAL_SKIP_PX,
  continueDisabled,
  busy,
  showMonthly = true,
  note,
  submit = false,
  backLabel = DEAL_BACK,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  skipLabel?: string;
  continueDisabled?: boolean;
  busy?: boolean;
  showMonthly?: boolean;
  /** Short line under the buttons, e.g. why Continue is disabled. */
  note?: string;
  /** Render the primary as a form submit so Enter works inside a form. */
  submit?: boolean;
  backLabel?: string;
}) {
  const { calculation, apr, navigating } = useDealBuilder();

  return (
    // Mobile: full-width bar lifted by a soft shadow. Desktop: a floating
    // rounded bar, like the home page's white panels.
    <div className="sticky bottom-0 z-10 -mx-4 mt-auto bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_24px_rgb(16_40_72/0.06)] backdrop-blur sm:-mx-6 sm:px-6 lg:bottom-5 lg:mx-0 lg:mb-5 lg:rounded-[22px] lg:px-4 lg:pb-3 lg:shadow-card">
      {showMonthly ? (
        <div className="mb-2 flex items-baseline justify-between gap-3 lg:hidden">
          <span className="text-caption text-muted">
            {apr !== undefined ? "Your monthly" : "Indicative monthly"}
          </span>
          <FinancialNumber
            value={formatPounds(calculation?.monthlyPayment ?? 0)}
            suffix="/mo"
            size="sm"
            className="text-primary"
          />
        </div>
      ) : null}
      <div
        className={cn(
          "grid gap-2",
          onBack && onSkip && "grid-cols-[auto_1fr_1fr]",
          onBack && !onSkip && "grid-cols-[auto_1fr]",
          // Skip and the primary stay equal weight (spec): stacked on phones.
          !onBack && onSkip && "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {onBack ? (
          <Button
            type="button"
            variant="tertiary"
            className="btn-compact w-full px-4"
            onClick={onBack}
          >
            {backLabel}
          </Button>
        ) : null}
        {onSkip ? (
          <Button
            type="button"
            variant="tertiary"
            className="btn-compact order-2 w-full min-w-0 sm:order-none"
            onClick={onSkip}
          >
            {skipLabel}
          </Button>
        ) : null}
        <Button
          type={submit ? "submit" : "button"}
          className="btn-compact w-full min-w-0 [&>span:first-child]:min-w-0"
          busy={busy || navigating}
          disabled={continueDisabled}
          onClick={submit ? undefined : onContinue}
        >
          <span className="truncate">{continueLabel}</span>
        </Button>
      </div>
      {note ? (
        <p className="mt-2 text-center text-caption text-muted">{note}</p>
      ) : null}
    </div>
  );
}
