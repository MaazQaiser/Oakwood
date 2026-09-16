import { LoadingState } from "@/components/ui/Loading";
import { reservationCopy } from "@/lib/reservation/copy";

export function ReservationProcessing({
  label = reservationCopy.processing,
}: {
  label?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6" role="status" aria-live="polite">
      <h1 className="text-h2">{label}</h1>
      <p className="mt-3 text-body text-muted">
        Please wait. We will confirm your reservation once payment is verified.
      </p>
      <div className="mt-5">
        <LoadingState label={label} />
      </div>
    </div>
  );
}
