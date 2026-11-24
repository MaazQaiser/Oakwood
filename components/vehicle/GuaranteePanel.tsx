import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GuaranteeBadge } from "@/components/vehicle/GuaranteeBadge";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { isGuaranteeEligible } from "@/lib/guarantee/eligibility";
import type { Vehicle } from "@/types/vehicle";

export function GuaranteePanel({
  vehicle,
}: {
  vehicle: Pick<Vehicle, "guaranteeEligible" | "saleType">;
}) {
  if (!isGuaranteeEligible(vehicle)) {
    return null;
  }

  return (
    <aside
      aria-label={guaranteeCopy.programmeName}
      className="rounded-[18px] border border-[#DCE4ED] bg-white p-4 shadow-[0_6px_18px_rgba(16,40,72,0.05)]"
    >
      <h2 className="text-[15px] font-semibold text-[#102747]">
        {guaranteeCopy.programmeName}
      </h2>
      <p className="mt-2 text-[13px] leading-[18px] text-[#68778B]">
        {guaranteeCopy.vehiclePanel}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <GuaranteeBadge />
        <Button
          href={routes.thirtyDayGuaranteeRequest}
          variant="text"
          className="min-h-11 px-0 text-[14px] font-semibold text-[#0875D1]"
        >
          Start a request
        </Button>
        <Link
          href={routes.thirtyDayGuaranteeTerms}
          className="text-[13px] text-[#68778B] underline-offset-4 hover:underline"
        >
          Full terms
        </Link>
      </div>
    </aside>
  );
}