import { Button } from "@/components/ui/Button";
import { routes, trustRoutes } from "@/config/routes";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VdpV2Benefits({ vehicle }: { vehicle: VehicleDetail }) {
  const items = [
    vehicle.inspection.available
      ? {
          title: "AA inspection",
          body: vehicle.inspection.summary,
          href: trustRoutes.aaStandards,
        }
      : null,
    {
      title: "Warranty included",
      body: vehicle.warranty.summary,
      href: routes.warranty,
    },
    vehicle.preparation.completed
      ? {
          title: "Prepared for sale",
          body: vehicle.preparation.date
            ? `Preparation recorded${vehicle.preparation.technician ? ` by ${vehicle.preparation.technician}` : ""}${vehicle.preparation.date ? ` on ${vehicle.preparation.date}` : ""}.`
            : "This car has been through our preparation checks before listing.",
          href: trustRoutes.ourGarage,
        }
      : null,
    {
      title: "Part exchange welcome",
      body: "Value your current car online and see how it could reduce your deposit.",
      href: "#part-exchange",
    },
    {
      title: `At Oakwood ${vehicle.locationName}`,
      body: "Collect from the showroom or continue your purchase online.",
      href: routes.locations,
    },
  ].filter(Boolean) as Array<{ title: string; body: string; href: string }>;

  return (
    <section
      aria-labelledby="vdp-v2-benefits-heading"
      className="vdp-v2__section lg:px-0"
    >
      <h2 id="vdp-v2-benefits-heading" className="vdp-v2__heading">
        Why buy from Oakwood?
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-[10px] border border-[#DCE4ED] bg-white p-3"
          >
            <h3 className="text-[15px] font-semibold leading-snug text-[#102747]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[18px] text-[#68778B]">{item.body}</p>
            <p className="mt-2">
              <Button
                href={item.href}
                variant="text"
                className="min-h-11 px-0 text-[14px] font-semibold text-[#0875D1]"
              >
                Learn more
              </Button>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
