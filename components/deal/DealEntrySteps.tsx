import { reservationConfig } from "@/config/reservation";
import { DEAL_STEPS } from "@/lib/deal/steps";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

const ENTRY_COPY: Record<(typeof DEAL_STEPS)[number], [string, string]> = {
  "part-exchange": [
    "Value your part exchange",
    "Optional. Our price, no middleman.",
  ],
  budget: ["Finance preferences", "Deposit, term, miles. One screen."],
  decision: ["Instant decision", "Soft check, no credit score impact."],
  cover: ["Build your cover", "Warranty, service, MOT, Supagard."],
  quote: ["Your quote", "HP or PCP, your real rate."],
  reserve: [
    `Reserve for ${reservationAmountLabel(reservationConfig.amount)}`,
    `Fully refundable. Car held ${formatHoldPeriod()}.`,
  ],
};

/** The six-step preview on the vehicle page's "Build your deal" card (spec §2). */
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
