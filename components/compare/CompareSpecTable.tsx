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

const labelCell =
  "sticky left-0 z-20 w-[8.5rem] min-w-[8.5rem] max-w-[8.5rem] border-r border-border bg-surface px-3 py-4 text-left align-top shadow-[8px_0_12px_-10px_rgba(16,40,72,0.45)]";
const valueCell =
  "relative z-0 min-w-[9.5rem] max-w-[14rem] break-words px-3 py-4 align-top text-body-sm";

export function CompareSpecTable({ vehicles }: { vehicles: Vehicle[] }) {
  const finance = useCustomerFinance();

  if (vehicles.length < 2) {
    return null;
  }

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
        <table className="w-max min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={cn(labelCell, "border-b border-border py-3")} scope="col">
                <span className="sr-only">Specification</span>
              </th>
              {vehicles.map((vehicle) => (
                <th
                  key={vehicle.stockId}
                  scope="col"
                  className="min-w-[9.5rem] border-b border-border bg-surface px-3 py-3 text-left align-bottom text-body-sm font-semibold text-ink"
                >
                  {[vehicle.make, vehicle.model].filter(Boolean).join(" ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareSpecGroups.map((group) => {
              const rows = compareSpecRows.filter((row) => row.group === group.id);
              if (rows.length === 0) {
                return null;
              }

              return (
                <GroupRows
                  key={group.id}
                  label={group.label}
                  columnCount={vehicles.length}
                  rows={rows.map((row) => {
                    const values = vehicles.map((vehicle) =>
                      cellValue(row.id, vehicle),
                    );
                    return {
                      id: row.id,
                      label: row.label,
                      values,
                      differs: valuesDiffer(values),
                    };
                  })}
                  vehicles={vehicles}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-caption text-muted">
        Monthly figures are illustrations based on your current deposit and term
        assumptions. Representative examples are marked with *.
      </p>
    </section>
  );
}

function GroupRows({
  label,
  columnCount,
  rows,
  vehicles,
}: {
  label: string;
  columnCount: number;
  rows: Array<{
    id: string;
    label: string;
    values: string[];
    differs: boolean;
  }>;
  vehicles: Vehicle[];
}) {
  return (
    <>
      <tr>
        <th
          colSpan={columnCount + 1}
          className="border-b border-border bg-page-tint p-0 text-left"
          scope="colgroup"
        >
          <span className="sticky left-0 inline-block bg-page-tint px-3 py-3 text-label text-ink">
            {label}
          </span>
        </th>
      </tr>
      {rows.map((row) => (
        <tr key={row.id}>
          <th className={cn(labelCell, "border-b border-border")} scope="row">
            <p className="text-caption font-semibold uppercase leading-tight tracking-[0.04em] text-muted">
              {row.label}
            </p>
            {row.differs ? (
              <p className="mt-1 text-caption font-semibold text-primary">
                {compareCopy.differs}
              </p>
            ) : (
              <p className="mt-1 text-caption text-subtle">
                {compareCopy.same}
              </p>
            )}
          </th>
          {row.values.map((value, index) => (
            <td
              key={`${row.id}-${vehicles[index]?.stockId ?? index}`}
              className={cn(
                valueCell,
                "border-b border-border",
                row.differs ? "font-medium text-ink" : "text-muted",
              )}
            >
              {value}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
