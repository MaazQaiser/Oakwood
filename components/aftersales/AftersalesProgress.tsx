import { cn } from "@/lib/cn";

export function AftersalesProgress({
  steps,
  current,
}: {
  steps: { id: string; label: string }[];
  current: string;
}) {
  const currentIndex = steps.findIndex((item) => item.id === current);
  const stageLabel = steps[currentIndex]?.label ?? "";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-muted">{stageLabel}</p>
      <ol className="flex items-center gap-2" aria-hidden="true">
        {steps.map((item, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={item.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full",
                  active || complete ? "bg-primary" : "bg-border-strong",
                )}
              />
              {index < steps.length - 1 ? (
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
        {stageLabel}. Step {Math.max(currentIndex, 0) + 1} of {steps.length}.
      </p>
    </div>
  );
}
