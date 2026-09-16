"use client";

import { refundReasonOptions } from "@/config/reservation";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { RefundReasonCode } from "@/types/reservation";

export function RefundReasonSelector({
  value,
  onChange,
}: {
  value?: RefundReasonCode;
  onChange: (reason: RefundReasonCode) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-label">Reason</legend>
      {refundReasonOptions.map((option) => (
        <label
          key={option.code}
          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2"
        >
          <input
            type="radio"
            name="refund-reason"
            value={option.code}
            checked={value === option.code}
            onChange={() => {
              onChange(option.code);
              trackEvent(analyticsEvents.refundReasonSelected, {
                reason: option.code,
              });
            }}
            className="h-4 w-4"
          />
          <span className="text-body">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
