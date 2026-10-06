import { compareSpecRows } from "@/features/compare/spec-rows";
import { compareCopy } from "@/lib/compare/copy";
import type { Vehicle } from "@/types/vehicle";

export function CompareSpecTable({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return null;
  }

  const left = vehicles[0];
  const right = vehicles[1];

  return (
    <section aria-labelledby="compare-spec-heading" className="mt-10">
      <h2 id="compare-spec-heading" className="text-h3">
        Specification
      </h2>
      <div className="mt-4 overflow-hidden rounded-[22px] border border-border bg-surface">
        {compareSpecRows.map((row) => (
          <div
            key={row.id}
            className="grid gap-2 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[10rem_1fr_1fr] md:items-start md:gap-6"
          >
            <p className="text-caption font-semibold uppercase tracking-[0.06em] text-muted">
              {row.label}
            </p>
            <p className="text-body-sm text-ink">{row.value(left)}</p>
            <p className="text-body-sm text-ink">
              {right ? row.value(right) : compareCopy.dash}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
