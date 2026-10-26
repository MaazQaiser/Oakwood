"use client";

import { Modal } from "@/components/ui/Dialogs";
import { Button } from "@/components/ui/Button";
import { SaveDeal } from "@/components/deal/SaveDeal";
import {
  DEAL_SAVE_PROGRESS_BODY,
  DEAL_SAVE_PROGRESS_CONTINUE,
  DEAL_SAVE_PROGRESS_TITLE,
} from "@/lib/deal/copy";

/**
 * Soft “Save your progress?” modal (spec §13).
 * Used on the Step 2→3 transition, Step 4 inactivity, and supported exits.
 */
export function SaveProgressPrompt({
  open,
  onContinue,
  onDismiss,
  continueLabel = DEAL_SAVE_PROGRESS_CONTINUE,
}: {
  open: boolean;
  /** Proceed without a new save, or leave the prompt. */
  onContinue: () => void;
  onDismiss?: () => void;
  continueLabel?: string;
}) {
  return (
    <Modal
      open={open}
      title={DEAL_SAVE_PROGRESS_TITLE}
      onClose={() => onDismiss?.()}
    >
      <div className="space-y-5">
        <p className="text-body-sm text-muted">{DEAL_SAVE_PROGRESS_BODY}</p>
        <SaveDeal defaultOpen prompt />
        <Button type="button" className="w-full" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </Modal>
  );
}
