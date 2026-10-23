import { DEAL_STEPS, DEAL_STEP_META } from "@/lib/deal/steps";

/** Step preview on the vehicle page's "Build your deal" card. */
export function DealEntrySteps() {
  return (
    <ol className="mt-3 space-y-1.5">
      {DEAL_STEPS.map((step) => {
        const meta = DEAL_STEP_META[step];
        return (
          <li key={step} className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-page-tint text-caption font-semibold! text-muted"
            >
              {meta.index}
            </span>
            <p className="min-w-0 text-caption text-ink">{meta.title}</p>
          </li>
        );
      })}
    </ol>
  );
}
