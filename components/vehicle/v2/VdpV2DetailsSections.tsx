import { Accordion } from "@/components/ui/Accordion";
import { VehicleSpecifications } from "@/components/vehicle/VehicleSpecifications";
import { VehicleDocumentation } from "@/components/vehicle/VehicleDocumentation";
import { VehicleAskPanel } from "@/components/vehicle/VehicleAskPanel";
import { VehicleVideo } from "@/components/vehicle/VehicleVideo";
import { VehicleLocation } from "@/components/vehicle/VehicleLocation";
import { FinanceControls } from "@/components/vehicle/FinanceControls";
import { PartExchange } from "@/components/vehicle/PartExchange";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VdpV2DetailsSections({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <section
      aria-labelledby="vdp-v2-details-heading"
      className="vdp-v2__section lg:px-0"
    >
      <h2 id="vdp-v2-details-heading" className="vdp-v2__heading">
        Vehicle information
      </h2>
      <p className="mt-1.5 text-[14px] leading-[21px] text-[#34445B]">
        Specifications, history, finance tools and dealership details.
      </p>

      <div className="vdp-v2-accordion-wrap mt-3 overflow-hidden rounded-xl border border-[#DCE4ED] bg-white">
        <Accordion title="Key specification">
          <VehicleSpecifications vehicle={vehicle} embedded />
        </Accordion>
        <Accordion title="History and condition">
          <div className="[&_#vehicle-docs-heading]:sr-only [&_section]:border-0">
            <VehicleDocumentation vehicle={vehicle} />
          </div>
        </Accordion>
        <div id="vdp-v2-finance-full" className="[&_section]:scroll-mt-0">
          <FinanceControls hideInlineSummary />
        </div>
        <PartExchange />
        <Accordion title="Ask about this car">
          <div className="[&_section]:rounded-none [&_section]:border-0 [&_section]:bg-transparent [&_section]:p-0">
            <VehicleAskPanel vehicle={vehicle} />
          </div>
        </Accordion>
        <Accordion title="Video">
          <VehicleVideo vehicle={vehicle} />
        </Accordion>
        <Accordion title="Dealership and location">
          <VehicleLocation vehicle={vehicle} />
        </Accordion>
      </div>
    </section>
  );
}
