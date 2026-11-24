"use client";

import Image from "next/image";
import {
  ifBody,
  ifCard,
  ifLink,
  ifSectionTitle,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { DEFAULT_ZERO_TERM } from "@/lib/finance/interest-free/constants";
import {
  monthlyForVehicle,
  needDepositTotal,
} from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import { cn } from "@/lib/cn";

export function QualifyingStock({
  deposit,
  term,
  cars,
  allCars,
  onSelect,
}: {
  deposit: number;
  term: number;
  cars: InterestFreeStockCar[];
  allCars: InterestFreeStockCar[];
  onSelect: (stockId: string) => void;
}) {
  const zeroTerm = term <= 18 ? term : DEFAULT_ZERO_TERM;

  return (
    <section aria-labelledby="if-qualify-heading">
      <h2 id="if-qualify-heading" className={ifSectionTitle}>
        {deposit > 0 ? "Cars you could have interest free" : "What your deposit gets you"}
      </h2>
      <p className={cn("mt-3", ifBody)}>
        {deposit > 0
          ? `With ${formatPounds(deposit)} down, these qualify today. Payments shown interest free over ${zeroTerm} months.`
          : "Set a deposit or value your part exchange above and we will show you every car that qualifies."}
      </p>

      {deposit <= 0 ? null : cars.length === 0 ? (
        <EmptyDeposit deposit={deposit} allCars={allCars} />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {cars.slice(0, 6).map((c) => {
            const r = monthlyForVehicle(c, deposit, null, zeroTerm);
            return (
              <button
                key={c.stockId}
                type="button"
                className={cn(ifCard, "overflow-hidden text-left")}
                onClick={() => onSelect(c.stockId)}
              >
                <div className="relative aspect-[16/10] bg-[#ECF3F8]">
                  <Image
                    src={c.imageSrc}
                    alt={c.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-[#12805B] px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                    0%
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3 p-4">
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-[#002852]">
                      {c.year} {c.make} {c.model}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {c.derivative} · {formatPounds(c.cashPrice)} · {c.locationName}
                    </span>
                  </span>
                  <span className="shrink-0 text-lg font-semibold tabular-nums text-[#002852]">
                    {formatPounds(r.monthly)}
                  </span>
                </div>
              </button>
            );
          })}
          {cars.length > 6 ? (
            <p className={cn("pt-1 sm:col-span-2", ifBody)}>
              And {cars.length - 6} more.{" "}
              <span className={ifLink}>Keep adjusting your deposit to see them.</span>
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function EmptyDeposit({
  deposit,
  allCars,
}: {
  deposit: number;
  allCars: InterestFreeStockCar[];
}) {
  const cheapest = [...allCars].sort(
    (a, b) => needDepositTotal(a) - needDepositTotal(b),
  )[0];
  if (!cheapest) return null;
  return (
    <div className={cn(ifSoftPanel, "mt-5 p-4")}>
      <p className="text-base font-semibold text-[#002852]">
        Nothing qualifies at {formatPounds(deposit)} yet
      </p>
      <p className={cn("mt-2", ifBody)}>
        The lowest deposit on any car in stock is {formatPounds(needDepositTotal(cheapest))}
        , on the {cheapest.year} {cheapest.make} {cheapest.model}. Everything else is
        available on Hire Purchase from a much smaller deposit.
      </p>
    </div>
  );
}
