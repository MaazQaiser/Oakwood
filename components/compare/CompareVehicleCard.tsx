"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, IconButton } from "@/components/ui/Button";
import { IconClose } from "@/components/ui/icons";
import {
  CashPrice,
  MonthlyPayment,
} from "@/components/finance/FinancePrimitives";
import { StartDealButton } from "@/components/deal/StartDealButton";
import { StartReservationButton } from "@/components/reservation/StartReservationButton";
import { getVehicleUrl, routes } from "@/config/routes";
import { useCompare } from "@/features/compare/CompareProvider";
import { useCustomerFinance } from "@/features/eligibility/CustomerFinanceProvider";
import { getDepositGap, getFinanceDisplayState } from "@/lib/finance/display";
import { getIllustratedMonthly } from "@/lib/finance/illustration";
import { isReservable } from "@/lib/vehicles/sold";
import { compareCopy } from "@/lib/compare/copy";
import type { Vehicle } from "@/types/vehicle";

export function CompareVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { remove } = useCompare();
  const finance = useCustomerFinance();
  const state = getFinanceDisplayState(
    finance.mode,
    vehicle.cashPrice,
    finance.maxAdvance,
    finance.deposit,
  );
  const gapAmount =
    state === "ineligible"
      ? getDepositGap(vehicle.cashPrice, finance.maxAdvance, finance.deposit)
      : undefined;
  const monthly = getIllustratedMonthly(
    vehicle,
    finance.deposit,
    finance.term,
  );
  const reservable = isReservable(vehicle);
  const heading = [vehicle.make, vehicle.model].join(" ");

  return (
    <article className="flex h-full flex-col rounded-[22px] border border-border bg-surface p-4">
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-page-tint">
          <Image
            src={vehicle.image ?? "/images/vehicle-placeholder.svg"}
            alt={`${vehicle.year} ${heading}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={(vehicle.image ?? "").endsWith(".svg")}
            className="object-cover"
          />
        </div>
        <IconButton
          label={`${compareCopy.remove}: ${heading}`}
          className="absolute right-2 top-2 bg-surface shadow-sm"
          onClick={() => remove(vehicle.stockId)}
        >
          <IconClose />
        </IconButton>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h2 className="text-[1.25rem] font-medium leading-tight tracking-[-0.02em]">
          {heading}
        </h2>
        {vehicle.derivative ? (
          <p className="mt-1 text-body-sm text-muted">{vehicle.derivative}</p>
        ) : null}
        <div className="mt-4">
          <CashPrice amount={vehicle.cashPrice} state={state} />
        </div>
        <div className="mt-3">
          <MonthlyPayment
            amount={monthly}
            state={state}
            gapAmount={gapAmount}
            size="md"
            term={finance.term}
            financeType="pcp"
            showDisclaimer={false}
          />
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-6">
          {reservable && finance.mode === "anonymous" ? (
            <StartDealButton stockId={vehicle.stockId} className="w-full" />
          ) : null}
          {reservable && finance.mode !== "anonymous" ? (
            <>
              <StartReservationButton
                stockId={vehicle.stockId}
                className="w-full"
              />
              <StartDealButton
                stockId={vehicle.stockId}
                variant="secondary"
                className="w-full"
              />
            </>
          ) : null}
          <Button href={getVehicleUrl(vehicle)} variant="text" className="px-0">
            {compareCopy.viewCar}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function CompareEmptySlot() {
  return (
    <Link
      href={routes.usedCars}
      className="flex min-h-[22rem] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#002852]/30 bg-[#ECF3F8] p-6 text-center no-underline"
    >
      <p className="text-[1.05rem] font-semibold text-[#002852]">
        {compareCopy.addAnother}
      </p>
      <p className="mt-2 max-w-xs text-body-sm text-muted">
        {compareCopy.addAnotherHint}
      </p>
    </Link>
  );
}
