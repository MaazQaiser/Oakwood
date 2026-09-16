import { cn } from "@/lib/cn";

const STEPS = [
  { id: "registration", label: "Registration" },
  { id: "vehicle", label: "Vehicle" },
  { id: "mileage", label: "Mileage" },
  { id: "valuation", label: "Valuation" },
  { id: "settlement", label: "Finance" },
] as const;

export type PxProgressStage = (typeof STEPS)[number]["id"];

export function PxProgress({ stage }: { stage?: PxProgressStage }) {
  if (!stage) {
    return null;
  }

  const currentIndex = STEPS.findIndex((item) => item.id === stage);
  const stageLabel = STEPS[currentIndex]?.label ?? "Part exchange";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-muted">{stageLabel}</p>
      <ol className="flex items-center gap-2" aria-hidden="true">
        {STEPS.map((item, index) => {
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
              {index < STEPS.length - 1 ? (
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
        {stageLabel}. Step {currentIndex + 1} of {STEPS.length}.
      </p>
    </div>
  );
}
