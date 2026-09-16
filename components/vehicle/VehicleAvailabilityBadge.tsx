import { Badge } from "@/components/ui/Badge";
import type { VehicleAvailability } from "@/types/vehicle";

const labels: Record<
  Exclude<VehicleAvailability, "available">,
  { label: string; tone: "warning" | "neutral" }
> = {
  reserved: { label: "Reserved", tone: "warning" },
  sold: { label: "Sold", tone: "neutral" },
  expired: { label: "Unavailable", tone: "neutral" },
};

export function VehicleAvailabilityBadge({
  availability,
}: {
  availability: VehicleAvailability;
}) {
  if (availability === "available") {
    return null;
  }

  const item = labels[availability];

  return <Badge tone={item.tone}>{item.label}</Badge>;
}
