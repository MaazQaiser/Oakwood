import { VehicleDealProvider } from "@/components/vehicle/VehicleDealProvider";
import { VehicleDetailPageV1 } from "@/components/vehicle/VehicleDetailPageV1";
import { VehicleDetailPageV2 } from "@/components/vehicle/v2/VehicleDetailPageV2";
import { VdpVariantProvider } from "@/components/vehicle/vdp/VdpVariantProvider";
import { VdpVariantSwitch } from "@/components/vehicle/vdp/VdpVariantSwitch";
import { VehicleViewTracker } from "@/components/vehicle/VehicleViewTracker";
import { TrackLastViewedVehicle } from "@/components/vehicle/TrackLastViewedVehicle";
import { VdpVariantGate } from "@/components/vehicle/vdp/VdpVariantGate";
import { createVehicleJsonLd } from "@/lib/seo/json-ld";
import type { VdpLayoutVariant } from "@/lib/vdp/variant";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VehicleDetailPage({
  vehicle,
  similar,
  breadcrumbs,
  initialVdpVariant = 1,
}: {
  vehicle: VehicleDetail;
  similar: Vehicle[];
  breadcrumbs: BreadcrumbItem[];
  initialVdpVariant?: VdpLayoutVariant;
}) {
  const jsonLd = createVehicleJsonLd(vehicle, breadcrumbs);

  return (
    <VehicleDealProvider vehicle={vehicle}>
      <VehicleViewTracker stockId={vehicle.stockId} />
      <TrackLastViewedVehicle stockId={vehicle.stockId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VdpVariantProvider initialVariant={initialVdpVariant}>
        <VdpVariantSwitch />
        <VdpVariantGate vehicle={vehicle} similar={similar} breadcrumbs={breadcrumbs} />
      </VdpVariantProvider>
    </VehicleDealProvider>
  );
}
