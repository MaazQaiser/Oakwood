import { reservationConfig } from "@/config/reservation";
import { DEAL_STEPS } from "@/lib/deal/steps";
import { reservationAmountLabel } from "@/lib/reservation/format";

const ENTRY_COPY: Record<(typeof DEAL_STEPS)[number], [string, string]> = {
  "part-exchange": [
    "Value your part exchange",
    "Valuation, finance and deposit contribution.",
  ],
  budget: ["Finance preferences", "Compare HP and PCP on one screen."],
  cover: ["Your deal", "Finance summary plus optional cover."],
  reserve: [
    "Choose your next step",
    `Reserve for ${reservationAmountLabel(reservationConfig.amount)}, apply, test drive or call.`,
  ],
};

/** Four-step preview on the vehicle page's "Build your deal" card (v4). */
export function DealEntrySteps() {
  return (
    <ol className="mt-3 divide-y divide-border">
      {DEAL_STEPS.map((step, index) => {
        const [title, body] = ENTRY_COPY[step];
        return (
          <li key={step} className="flex items-center gap-3 py-2.5">
            <span
              aria-hidden
              className={
                index === 0
                  ? "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-caption font-semibold! text-white"
                  : "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-page-tint text-caption font-semibold! text-muted"
              }
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-body-sm font-semibold! text-ink">{title}</p>
              <p className="text-caption text-muted">{body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
