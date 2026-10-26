import Link from "next/link";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { trustRoutes } from "@/config/routes";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VdpV2GalleryShell({ vehicle }: { vehicle: VehicleDetail }) {
  const showAa = vehicle.inspection.available;

  return (
    <div className="vdp-v2-gallery relative min-w-0">
      {showAa ? (
        <Link
          href={trustRoutes.aaStandards}
          className="absolute left-3 top-3 z-10 inline-flex min-h-9 items-center rounded-full bg-[#FFD500] px-3 py-1 text-[12px] font-bold text-[#102747] shadow-sm"
        >
          AA inspected
        </Link>
      ) : null}
      <VehicleGallery vehicle={vehicle} presentation="vdp-v2" />
      {vehicle.highlight ? (
        <p className="mt-2 px-1 text-[14px] leading-[21px] text-[#68778B] lg:px-0">
          {vehicle.highlight}
        </p>
      ) : null}
    </div>
  );
}
