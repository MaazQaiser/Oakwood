"use client";

import { useEffect, useState } from "react";
import { VehicleViewingCard } from "@/components/vehicle/VehicleViewingCard";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function VdpV2TestDriveSection({ vehicle }: { vehicle: VehicleDetail }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === "#book-test-drive") {
        setExpanded(true);
      }
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  if (!expanded) {
    return (
      <div
        id="vdp-v2-test-drive"
        className="scroll-mt-20"
        aria-hidden
      />
    );
  }

  return (
    <section
      id="vdp-v2-test-drive"
      aria-labelledby="vdp-v2-test-drive-heading"
      className="vdp-v2__section scroll-mt-20 lg:px-0"
    >
      <div className="vdp-v2__card overflow-hidden p-0!">
        <div className="border-b border-[#DCE4ED] px-4 py-3">
          <h2
            id="vdp-v2-test-drive-heading"
            className="text-[20px] font-bold leading-[26px] text-[#102747]"
          >
            Book a test drive
          </h2>
        </div>
        <div className="[&_section]:rounded-none [&_section]:border-0 [&_section]:p-4">
          <VehicleViewingCard vehicle={vehicle} />
        </div>
      </div>
    </section>
  );
}
