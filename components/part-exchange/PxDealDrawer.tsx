"use client";

import { Drawer } from "@/components/ui/Dialogs";
import { PxFlow } from "@/components/part-exchange/PxFlow";
import type { DealPartExchangeInput } from "@/types/deal";

export function PxDealDrawer({
  open,
  initialPx,
  consideredStockId,
  vdp,
  onClose,
  onApplied,
}: {
  open: boolean;
  initialPx?: DealPartExchangeInput;
  consideredStockId?: string;
  vdp?: boolean;
  onClose: () => void;
  onApplied: (px: DealPartExchangeInput) => void | Promise<void>;
}) {
  return (
    <Drawer open={open} title="Part exchange" size="full" onClose={onClose}>
      {open ? (
        <PxFlow
          variant="inline"
          initialPx={initialPx}
          consideredStockId={consideredStockId}
          vdp={vdp}
          onApplied={async (px) => {
            await onApplied(px);
            onClose();
          }}
        />
      ) : null}
    </Drawer>
  );
}
