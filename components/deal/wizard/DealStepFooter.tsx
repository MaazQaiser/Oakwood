"use client";

import { Button } from "@/components/ui/Button";
import {
  DEAL_BACK,
  DEAL_CONTINUE,
  DEAL_SKIP_PX,
} from "@/lib/deal/copy";

export function DealStepFooter({
  onBack,
  onContinue,
  onSkip,
  continueLabel = DEAL_CONTINUE,
  continueDisabled,
  busy,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  busy?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
      {onBack ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onBack}
        >
          {DEAL_BACK}
        </Button>
      ) : null}
      {onSkip ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:flex-1"
          onClick={onSkip}
        >
          {DEAL_SKIP_PX}
        </Button>
      ) : null}
      <Button
        type="button"
        className="w-full sm:flex-1"
        busy={busy}
        disabled={continueDisabled}
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
