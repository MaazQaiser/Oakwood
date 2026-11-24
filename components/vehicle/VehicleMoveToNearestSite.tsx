import { Button } from "@/components/ui/Button";
import { showrooms } from "@/config/locations";
import { getDeliveryAndCollectionUrl } from "@/config/routes";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleMoveToNearestSite({ vehicle }: { vehicle: VehicleDetail }) {
  if (vehicle.availability !== "available") {
    return null;
  }

  const current = showrooms.find((item) => item.slug === vehicle.locationSlug);
  const destination = showrooms.find((item) => item.slug !== vehicle.locationSlug);

  if (!current?.isShowroom || !destination) {
    return null;
  }

  const href = getDeliveryAndCollectionUrl({
    context: "move-car",
    stockId: vehicle.stockId,
    from: current.slug,
    to: destination.slug,
  });

  return (
    <div className="rounded-[16px] bg-[#ECF3F8] px-4 py-3">
      <p className="text-body-sm text-ink">
        This car is at Oakwood {current.name}. Want it at {destination.name} instead?
      </p>
      <Button href={href} variant="secondary" size="sm" className="mt-3">
        Move to my nearest site
      </Button>
    </div>
  );
}