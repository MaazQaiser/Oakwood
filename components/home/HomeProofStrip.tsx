import { cn } from "@/lib/cn";
import { HOME_PROOF_ITEMS } from "@/lib/home/copy";

export function HomeProofStrip({ className }: { className?: string }) {
  return (
    <dl
      aria-label="Oakwood at a glance"
      className={cn(
        "grid w-full grid-cols-2 gap-y-4 rounded-[28px] bg-white px-4 py-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)] sm:px-6 md:grid-cols-4 md:gap-y-0 md:py-6",
        className,
      )}
    >
      {HOME_PROOF_ITEMS.map((point) => (
        <div
          key={point.lead}
          className="min-w-0 border-ink/15 max-md:odd:pr-4 max-md:even:border-l max-md:even:pl-4 md:border-l md:px-4 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
        >
          <dt className="m-0 text-base font-semibold leading-tight tracking-[-0.02em] text-ink tabular-nums md:text-lg">
            {point.lead}
          </dt>
          <dd className="m-0 mt-1 text-sm leading-snug text-secondary">
            {point.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}
