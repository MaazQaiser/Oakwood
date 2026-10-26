"use client";

import { VehicleDetailPageV1 } from "@/components/vehicle/VehicleDetailPageV1";
import { VehicleDetailPageV2 } from "@/components/vehicle/v2/VehicleDetailPageV2";
import { useVdpVariant } from "@/components/vehicle/vdp/VdpVariantProvider";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VdpVariantGate({
  vehicle,
  similar,
  breadcrumbs,
}: {
  vehicle: VehicleDetail;
  similar: Vehicle[];
  breadcrumbs: BreadcrumbItem[];
}) {
  const { variant } = useVdpVariant();

  if (variant === 2) {
    return (
      <VehicleDetailPageV2
        vehicle={vehicle}
        similar={similar}
        breadcrumbs={breadcrumbs}
      />
    );
  }

  return (
    <VehicleDetailPageV1 vehicle={vehicle} similar={similar} breadcrumbs={breadcrumbs} />
  );
}
