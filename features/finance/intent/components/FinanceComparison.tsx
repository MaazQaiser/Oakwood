import { Container, Section } from "@/components/layout/Container";
import type { FinanceComparisonRow } from "@/types/finance-intent";

export function FinanceComparison({
  title = "HP and PCP compared",
  rows,
}: {
  title?: string;
  rows: FinanceComparisonRow[];
}) {
  return (
    <Section>
      <Container>
        <h2 className="text-h2">{title}</h2>
        <p className="mt-3 max-w-2xl text-body-sm text-muted">
          Neither product is universally better. Use this as a guide, then
          compare both on a vehicle.
        </p>
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <section
              key={row.label}
              aria-labelledby={`compare-${row.label.replace(/\s+/g, "-").toLowerCase()}`}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <h3
                id={`compare-${row.label.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-h4"
              >
                {row.label}
              </h3>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-label">HP</dt>
                  <dd className="mt-1 text-body-sm text-muted">{row.hp}</dd>
                </div>
                <div>
                  <dt className="text-label">PCP</dt>
                  <dd className="mt-1 text-body-sm text-muted">{row.pcp}</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
