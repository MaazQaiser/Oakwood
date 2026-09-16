import {
  getMakeUrl,
  getModelUrl,
  getVehicleUrl,
  routes,
} from "@/config/routes";
import type { BreadcrumbItem } from "@/lib/seo";
import type { Vehicle } from "@/types/vehicle";

export function getVehicleBreadcrumbs(vehicle: Vehicle): BreadcrumbItem[] {
  const category = vehicle.category === "van" ? "vans" : "cars";

  return [
    { label: "Home", href: routes.home },
    {
      label: vehicle.category === "van" ? "Used Vans" : "Used Cars",
      href: vehicle.category === "van" ? routes.usedVans : routes.usedCars,
    },
    { label: vehicle.make, href: getMakeUrl(vehicle.make, category) },
    { label: vehicle.model, href: getModelUrl(vehicle.make, vehicle.model, category) },
    {
      label: vehicle.derivative ?? `${vehicle.year} ${vehicle.model}`,
      href: getVehicleUrl(vehicle),
    },
  ];
}
