import { Button } from "@/components/ui/Button";
import { getUsedCarsUrl } from "@/config/routes";
import { formatPounds } from "@/lib/format/money";
import { PX_CHECK_ANOTHER, PX_USE_AS_DEPOSIT } from "@/lib/part-exchange/copy";
import type { PxEquityType } from "@/types/part-exchange";

export function PxApplyToDeal({
  equityType,
  equity,
  hasDeal,
  busy,
  onApply,
  onRestart,
}: {
  equityType: PxEquityType;
  equity: number;
  hasDeal: boolean;
  busy?: boolean;
  onApply: () => void;
  onRestart: () => void;
}) {
  const positive = equityType === "positive" && equity > 0;

  return (
    <div className="mt-6 flex flex-col gap-3">
      {hasDeal ? (
        <Button onClick={onApply} busy={busy} className="w-full">
          {positive ? PX_USE_AS_DEPOSIT(formatPounds(equity)) : "Add to my deal"}
        </Button>
      ) : (
        <>
          {positive ? (
            <Button onClick={onApply} busy={busy} className="w-full">
              {PX_USE_AS_DEPOSIT(formatPounds(equity))}
            </Button>
          ) : (
            <Button href={getUsedCarsUrl()} className="w-full">
              Choose a car
            </Button>
          )}
          <p className="text-caption text-muted">
            {positive
              ? "Choose a car to use this towards. Your valuation stays with this visit."
              : "You can still part-exchange this car. We'll show the shortfall on the deal."}
          </p>
        </>
      )}
      <Button variant="text" className="self-start px-0" onClick={onRestart}>
        {PX_CHECK_ANOTHER}
      </Button>
    </div>
  );
}
