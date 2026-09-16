import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { payAndReserveLabel, reservationAmountLabel } from "@/lib/reservation/format";

export function ReservationMobileCTA({
  amount,
  href,
  onPay,
  disabled,
  label,
}: {
  amount: number;
  href?: string;
  onPay?: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const cta = label ?? payAndReserveLabel(amount);

  return (
    <StickyActionBar>
      <div className="mx-auto flex max-w-[var(--oak-width-content)] items-center gap-3">
        <div className="min-w-0">
          <p className="text-caption text-muted">To pay today</p>
          <p className="text-label">{reservationAmountLabel(amount)}</p>
        </div>
        {href ? (
          <Button href={href} className="min-w-0 flex-1" disabled={disabled}>
            {cta}
          </Button>
        ) : (
          <Button className="min-w-0 flex-1" onClick={onPay} disabled={disabled}>
            {cta}
          </Button>
        )}
      </div>
    </StickyActionBar>
  );
}
