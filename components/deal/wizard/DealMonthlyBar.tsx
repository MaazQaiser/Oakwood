import { DEAL_YOUR_DEAL_APR_DISCLAIMER } from "@/lib/deal/copy";

/** Navy summary. The monthly figure is confirmed when the customer applies. */
export function DealMonthlyBar() {
  return (
    <div className="rounded-[20px] bg-navy px-4 py-4 text-white">
      <p className="text-[0.68rem] font-semibold! uppercase tracking-[0.14em] text-white/70">
        Monthly payment
      </p>
      <p className="mt-1.5 text-body-sm text-white" role="status">
        {DEAL_YOUR_DEAL_APR_DISCLAIMER}
      </p>
    </div>
  );
}
