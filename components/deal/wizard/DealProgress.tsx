"use client";

import { Check } from "lucide-react";
import { useDealBuilder } from "@/components/deal/DealBuilderProvider";
import type { DealStep } from "@/config/routes";
import { getDealUrl } from "@/config/routes";
import { cn } from "@/lib/cn";
import { DEAL_STEP_META, DEAL_STEPS } from "@/lib/deal/steps";

function useStepState(step: DealStep) {
  const { dealId, draft, navigateTo } = useDealBuilder();
  const current = DEAL_STEP_META[step].index;
  const completed = new Set(draft.stepsCompleted ?? []);

  return DEAL_STEPS.map((item) => {
    const meta = DEAL_STEP_META[item];
    const isCurrent = item === step;
    const isDone = completed.has(item) || meta.index < current;
    return {
      item,
      meta,
      isCurrent,
      isDone,
      canJump: isDone && !isCurrent,
      go: () => navigateTo(getDealUrl(dealId, item)),
    };
  });
}

/** Thin segmented bar for the mobile header strip. */
export function DealProgressBar({ step }: { step: DealStep }) {
  const steps = useStepState(step);
  const meta = DEAL_STEP_META[step];

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={meta.index}
      aria-valuetext={`Step ${meta.index} of ${steps.length}: ${meta.shortTitle}`}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map(({ item, isCurrent, isDone }) => (
        <span
          key={item}
          className={cn(
            "h-1.5 rounded-full transition-colors",
            isCurrent ? "bg-primary" : isDone ? "bg-primary/45" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

/** Labelled stepper. `row` sits above a step heading; `stack` is the sidebar. */
export function DealProgress({
  step,
  layout = "stack",
}: {
  step: DealStep;
  layout?: "stack" | "row";
}) {
  const steps = useStepState(step);
  const row = layout === "row";

  return (
    <nav aria-label="Deal steps">
      <ol className={row ? "grid grid-cols-4 gap-1 sm:flex" : "space-y-0.5"}>
        {steps.map(({ item, meta, isCurrent, isDone, canJump, go }) => (
          <li key={item} className={row ? "flex min-w-0 sm:flex-1" : undefined}>
            <button
              type="button"
              disabled={!canJump}
              aria-current={isCurrent ? "step" : undefined}
              onClick={go}
              className={cn(
                "flex items-center rounded-[14px] text-body-sm transition-colors",
                row
                  ? "h-full w-full min-w-0 flex-col gap-1 px-0.5 py-2 text-center sm:flex-row sm:justify-start sm:gap-2 sm:px-2 sm:text-left"
                  : "w-full gap-3 px-2.5 py-2 text-left",
                isCurrent && "bg-surface-soft font-semibold! text-navy",
                !isCurrent && isDone && "text-ink hover:bg-page-tint",
                !isCurrent && !isDone && "text-muted",
                canJump ? "cursor-pointer" : "cursor-default",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-semibold!",
                  isCurrent && "bg-primary text-white",
                  !isCurrent && isDone && "bg-primary-soft text-primary",
                  !isCurrent && !isDone && "bg-page-tint text-muted",
                )}
              >
                {isDone && !isCurrent ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  meta.index
                )}
              </span>
              <span className="min-w-0 leading-tight sm:flex-1">
                <span className="block text-caption sm:truncate sm:text-body-sm">
                  {meta.shortTitle}
                </span>
                {canJump ? (
                  <span className="block text-caption text-primary">Edit</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
