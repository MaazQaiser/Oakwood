import {
  ifBody,
  ifCard,
  ifSectionTitle,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import { cn } from "@/lib/cn";

export function ReligiousFinance() {
  return (
    <section aria-labelledby="if-religious-heading">
      <h2 id="if-religious-heading" className={ifSectionTitle}>
        {INTEREST_FREE_COPY.religiousTitle}
      </h2>
      <p className={cn("mt-3", ifBody)}>{INTEREST_FREE_COPY.religiousLede}</p>

      <div className="mt-5 space-y-4">
        <div className={cn(ifCard, "p-5")}>
          <p className="text-base font-semibold text-[#002852]">Our 0% deal</p>
          <p className={cn("mt-2", ifBody)}>{INTEREST_FREE_COPY.religiousDeal}</p>
        </div>
        <div className={cn(ifCard, "p-5")}>
          <p className="text-base font-semibold text-[#002852]">Longer than 18 months</p>
          <p className={cn("mt-2", ifBody)}>{INTEREST_FREE_COPY.religiousLonger}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {INTEREST_FREE_COPY.providers.map((p) => (
              <div key={p.name} className={cn(ifSoftPanel, "p-3")}>
                <p className="text-sm font-semibold text-[#002852]">{p.name}</p>
                <p className="mt-1 text-xs text-muted">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Your part exchange is handled exactly as it would be on any other deal. Speak to us
        before you arrange funding and we will have the invoice and the paperwork ready for
        your provider.
      </p>
    </section>
  );
}
