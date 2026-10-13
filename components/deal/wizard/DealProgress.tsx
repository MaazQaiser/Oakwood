"use client";

import type { DealStep } from "@/config/routes";
import { DEAL_STEP_META, DEAL_STEPS } from "@/lib/deal/steps";

export function DealProgress({ step }: { step: DealStep }) {
  const meta = DEAL_STEP_META[step];
  const total = DEAL_STEPS.length;
  const progress = (meta.index / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption text-muted">
          Step {meta.index} of {total}
        </p>
        <p className="text-caption text-muted">{meta.shortTitle}</p>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={meta.index}
        aria-label={`Step ${meta.index} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
