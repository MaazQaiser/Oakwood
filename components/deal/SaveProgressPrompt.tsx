"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Dialogs";
import { Button } from "@/components/ui/Button";
import { SaveDeal } from "@/components/deal/SaveDeal";
import {
  DEAL_SAVE_PROGRESS_BODY,
  DEAL_SAVE_PROGRESS_CONTINUE,
  DEAL_SAVE_PROGRESS_SAVE,
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
  const [showForm, setShowForm] = useState(false);

  function closeAndContinue() {
    setShowForm(false);
    onContinue();
  }

  return (
    <Modal
      open={open}
      title={DEAL_SAVE_PROGRESS_TITLE}
      onClose={() => {
        setShowForm(false);
        onDismiss?.();
        onContinue();
      }}
    >
      <div className="space-y-4">
        <p className="text-body-sm text-muted">{DEAL_SAVE_PROGRESS_BODY}</p>
        {showForm ? (
          <>
            <SaveDeal defaultOpen compact />
            <Button type="button" className="w-full" onClick={closeAndContinue}>
              Continue to next step
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => setShowForm(true)}
            >
              {DEAL_SAVE_PROGRESS_SAVE}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={closeAndContinue}
            >
              {DEAL_SAVE_PROGRESS_CONTINUE}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
