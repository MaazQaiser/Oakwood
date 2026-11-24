import {
  ifBody,
  ifSectionTitle,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";

export function HowItWorks() {
  return (
    <section aria-labelledby="if-how-heading">
      <h2 id="if-how-heading" className={ifSectionTitle}>
        {INTEREST_FREE_COPY.howItWorksTitle}
      </h2>
      <ol className="mt-5 space-y-4">
        {INTEREST_FREE_COPY.howItWorks.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002852] text-sm font-semibold text-white">
              {index + 1}
            </span>
            <span>
              <span className="block text-base font-semibold text-[#002852]">
                {step.title}
              </span>
              <span className={`mt-0.5 block ${ifBody}`}>{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
