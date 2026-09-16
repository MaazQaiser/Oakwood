"use client";

import { EligibilitySingleChoice } from "@/components/eligibility/controls";
import type { BookingSlot, BookingTimeWindow } from "@/types/booking";

const WINDOWS: { value: BookingTimeWindow; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "any", label: "No preference" },
];

export function BookingTimePicker({
  value,
  onChange,
  labelledBy,
  slots,
  selectedSlotId,
  onSelectSlot,
}: {
  value?: BookingTimeWindow;
  onChange: (value: BookingTimeWindow) => void;
  labelledBy?: string;
  slots?: BookingSlot[];
  selectedSlotId?: string;
  onSelectSlot?: (slotId: string) => void;
}) {
  if (slots && slots.length > 0) {
    return (
      <EligibilitySingleChoice
        name="booking-slot"
        labelledBy={labelledBy}
        value={selectedSlotId}
        onChange={(next) => onSelectSlot?.(next)}
        options={slots.map((slot) => ({ value: slot.id, label: slot.label }))}
      />
    );
  }

  return (
    <EligibilitySingleChoice
      name="booking-time"
      labelledBy={labelledBy}
      value={value}
      onChange={(next) => onChange(next as BookingTimeWindow)}
      options={WINDOWS}
    />
  );
}
