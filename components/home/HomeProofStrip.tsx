import { cn } from "@/lib/cn";

const proofPoints = [
  { lead: ">500", detail: "cars" },
  { lead: "Every car", detail: "AA inspected" },
  { lead: "AA", detail: "warranty available" },
  { lead: "Two showrooms", detail: "+ own workshop" },
] as const;

export function HomeProofStrip({ className }: { className?: string }) {
  return (
    <dl
      aria-label="Oakwood at a glance"
      className={cn(
        "grid w-full grid-cols-2 gap-y-3 md:grid-cols-4 md:gap-y-0",
        className,
      )}
    >
      {proofPoints.map((point) => (
        <div
          key={point.lead}
          className="min-w-0 border-ink/15 max-md:odd:pr-4 max-md:even:border-l max-md:even:pl-4 md:border-l md:px-4 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
        >
          <dt className="m-0 text-base font-semibold leading-tight tracking-[-0.02em] text-ink tabular-nums md:text-lg">
            {point.lead}
          </dt>
          <dd className="m-0 mt-1 text-sm leading-snug text-secondary">{point.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
