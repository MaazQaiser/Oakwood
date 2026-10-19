"use client";

import { ExitIntelModal } from "@/components/deal/ExitIntelModal";

/** Valuation-entry decline modal — shared exit-intel pattern (v4 Decision 16). */
export function BeforeYouGoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ExitIntelModal
      open={open}
      onClose={onClose}
      source="entry_hook"
      idPrefix="ve-decline"
    />
  );
}
