import { cn } from "@/lib/cn";
import { ELIGIBILITY_STAGES } from "@/lib/eligibility/questions";
import type { EligibilityStageId } from "@/types/eligibility";

export function EligibilityProgress({
  stage,
  step,
  total,
}: {
  stage: EligibilityStageId;
  step: number;
  total: number;
}) {
  const currentIndex = ELIGIBILITY_STAGES.findIndex((item) => item.id === stage);
  const stageLabel =
    ELIGIBILITY_STAGES.find((item) => item.id === stage)?.label ?? "Eligibility";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-muted">{stageLabel}</p>
      <ol className="flex items-center gap-2" aria-hidden="true">
        {ELIGIBILITY_STAGES.map((item, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={item.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full",
                  current || complete ? "bg-primary" : "bg-border-strong",
                )}
              />
              {index < ELIGIBILITY_STAGES.length - 1 ? (
                <span
                  className={cn(
                    "block h-px w-5",
                    complete ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        {stageLabel}. Step {step} of {total}.
      </p>
    </div>
  );
}
