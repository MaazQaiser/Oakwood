"use client";

import { Modal } from "@/components/ui/Dialogs";
import { Button } from "@/components/ui/Button";
import { SaveDeal } from "@/components/deal/SaveDeal";
import {
  DEAL_CONTINUE_TO_RESERVE,
  DEAL_SAVE_PROGRESS_BODY,
  DEAL_SAVE_PROGRESS_TITLE,
} from "@/lib/deal/copy";

/**
 * Soft “Save your progress?” modal (spec §13).
 * Used on Step 2→3 transition and Step 4 idle.
 */
export function SaveProgressPrompt({
  open,
  onContinue,
  onDismiss,
}: {
  open: boolean;
  /** Proceed to the next step / stay on hub after skip or save. */
  onContinue: () => void;
  onDismiss?: () => void;
}) {
  return (
    <Modal
      open={open}
      title={DEAL_SAVE_PROGRESS_TITLE}
      onClose={() => {
        onDismiss?.();
        onContinue();
      }}
    >
      <div className="space-y-5">
        <p className="text-body-sm text-muted">{DEAL_SAVE_PROGRESS_BODY}</p>
        <SaveDeal defaultOpen prompt />
        <Button type="button" className="w-full" onClick={onContinue}>
          {DEAL_CONTINUE_TO_RESERVE}
        </Button>
      </div>
    </Modal>
  );
}
