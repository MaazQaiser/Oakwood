"use client";

import { DepositControl as DepositControlInput } from "@/components/finance/DepositControl";
import {
  maxCashDeposit,
  useDealBuilder,
} from "@/components/deal/DealBuilderProvider";

export function DepositControl() {
  const { draft, calculation, config, vehicle, setCashDeposit } = useDealBuilder();
  const maxDeposit = maxCashDeposit(
    vehicle.cashPrice,
    config.maxDepositCap,
    config.depositStep,
    draft.px,
  );

  return (
    <DepositControlInput
      cashDeposit={draft.cashDeposit}
      minDeposit={config.minDeposit}
      maxDeposit={maxDeposit}
      step={config.depositStep}
      pxEquity={calculation?.pxEquity}
      totalDeposit={calculation?.totalDeposit}
      onChange={setCashDeposit}
    />
  );
}
