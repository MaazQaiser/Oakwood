"use client";

import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import { Skeleton } from "@/components/ui/Loading";
import { useVehicleDeal } from "@/components/vehicle/VehicleDealProvider";
import { formatPounds } from "@/lib/format/money";

export function VdpV2CashPriceBlock() {
  const { cashPrice, displayState } = useVehicleDeal();

  return (
    <div className="min-w-0">
      <div className="w-full max-w-full rounded-xl border border-[#DCE4ED] bg-gradient-to-br from-[#F4FAFF] via-[#EEF6FD] to-[#E3F0FA] p-4">
        <p className="text-[13px] font-semibold leading-[18px] text-[#68778B]">Cash price</p>
        {displayState === "loading" ? (
          <Skeleton className="mt-1 h-9 w-40" />
        ) : (
          <p className="mt-1 text-[32px] font-bold leading-[38px] text-[#08264B]">
            <FinancialNumber value={formatPounds(cashPrice)} size="lg" className="text-[#08264B]" />
          </p>
        )}
        {displayState === "representative" ? (
          <p className="mt-2 text-[12px] leading-[17px] text-[#68778B]">
            Representative finance figures are shown in the finance preview below.
          </p>
        ) : null}
      </div>
    </div>
  );
}
