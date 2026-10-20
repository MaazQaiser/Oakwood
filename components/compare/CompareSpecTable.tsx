"use client";

import {
  compareSpecGroups,
  compareSpecRows,
  valuesDiffer,
} from "@/features/compare/spec-rows";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { formatPounds } from "@/lib/format/money";
import { compareCopy } from "@/lib/compare/copy";
import { cn } from "@/lib/cn";
import type { Vehicle } from "@/types/vehicle";

export function CompareSpecTable({ vehicles }: { vehicles: Vehicle[] }) {
  const finance = useCustomerFinance();

  if (vehicles.length < 2) {
    return null;
  }

  const columnCount = vehicles.length;
  const labelColumn = "6.25rem";
  const valueColumn = "7rem";
  const gridStyle = {
    gridTemplateColumns: `${labelColumn} repeat(${columnCount}, minmax(${valueColumn}, 1fr))`,
  };

  function cellValue(rowId: string, vehicle: Vehicle): string {
    if (rowId === "monthly") {
      const monthly = getIllustratedMonthly(
        vehicle,
        finance.deposit,
        finance.term,
      );
      return monthly > 0
        ? `${formatPounds(monthly)}/month*`
        : compareCopy.financeUnavailable;
    }
    const row = compareSpecRows.find((item) => item.id === rowId);
    return row ? row.value(vehicle) : compareCopy.dash;
  }

  return (
    <section aria-labelledby="compare-spec-heading" className="mt-10 min-w-0 max-w-full">
      <h2 id="compare-spec-heading" className="text-h3">
        Specification
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Rows with different values are marked “{compareCopy.differs}” so you can
        spot changes without relying on colour alone.
      </p>

      <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain rounded-[22px] border border-border bg-surface">
        <div
          style={{
            minWidth: `calc(${labelColumn} + ${columnCount} * ${valueColumn})`,
          }}
        >
          {compareSpecGroups.map((group) => {
            const rows = compareSpecRows.filter((row) => row.group === group.id);
            if (rows.length === 0) {
              return null;
            }

            return (
              <div key={group.id}>
                <div className="border-b border-border bg-page-tint">
                  <h3 className="sticky left-0 w-fit bg-page-tint px-3 py-3 text-label text-ink">
                    {group.label}
                  </h3>
                </div>
                {rows.map((row) => {
                  const values = vehicles.map((vehicle) =>
                    cellValue(row.id, vehicle),
                  );
                  const differs = valuesDiffer(values);

                  return (
                    <div
                      key={row.id}
                      className="grid border-b border-border last:border-b-0"
                      style={gridStyle}
                    >
                      <div className="sticky left-0 z-10 min-w-0 border-r border-border bg-surface px-3 py-4">
                        <p className="text-caption font-semibold uppercase tracking-[0.04em] text-muted">
                          {row.label}
                        </p>
                        {differs ? (
                          <p className="mt-1 text-caption font-semibold text-primary">
                            {compareCopy.differs}
                          </p>
                        ) : (
                          <p className="mt-1 text-caption text-subtle">
                            {compareCopy.same}
                          </p>
                        )}
                      </div>
                      {values.map((value, index) => (
                        <p
                          key={`${row.id}-${vehicles[index]?.stockId ?? index}`}
                          className={cn(
                            "min-w-0 px-3 py-4 text-body-sm",
                            differs
                              ? "font-medium text-ink"
                              : "text-muted",
                          )}
                        >
                          {value}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-caption text-muted">
        Monthly figures are illustrations based on your current deposit and term
        assumptions. Representative examples are marked with *.
      </p>
    </section>
  );
}
