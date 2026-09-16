import { Button } from "@/components/ui/Button";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { reservationCopy } from "@/lib/reservation/copy";
import { getUsedCarsUrl } from "@/config/routes";
import type { ReservationPageModel } from "@/features/reservation/load";

export function ReservationUnavailable({
  model,
  variant = "unavailable",
}: {
  model: ReservationPageModel;
  variant?: "unavailable" | "sold" | "conflict";
}) {
  const heading =
    variant === "sold"
      ? reservationCopy.soldHeading
      : variant === "conflict"
        ? reservationCopy.concurrent
        : "This vehicle is not available to reserve.";
  const support =
    variant === "sold" ? reservationCopy.soldSupporting : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h2">{heading}</h1>
        {support ? <p className="mt-2 text-body">{support}</p> : null}
      </header>
      <Button href={`${getUsedCarsUrl()}#similar-cars`}>View similar cars</Button>
      {model.similar.length ? <SimilarVehicles vehicles={model.similar} /> : null}
    </div>
  );
}
