import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { formatNumber, formatPounds } from "@/lib/format/money";
import { compareCopy } from "@/lib/compare/copy";
import type { Vehicle } from "@/types/vehicle";

export type CompareSpecGroupId =
  | "price"
  | "details"
  | "ownership";

export interface CompareSpecRow {
  id: string;
  label: string;
  group: CompareSpecGroupId;
  value: (vehicle: Vehicle) => string;
}

export const compareSpecGroups: Array<{
  id: CompareSpecGroupId;
  label: string;
}> = [
  { id: "price", label: "Price and finance" },
  { id: "details", label: "Vehicle details" },
  { id: "ownership", label: "Ownership and condition" },
];

function detail(vehicle: Vehicle) {
  return getVehicleDetail(vehicle);
}

export const compareSpecRows: CompareSpecRow[] = [
  {
    id: "cash",
    label: "Cash price",
    group: "price",
    value: (vehicle) => formatPounds(vehicle.cashPrice),
  },
  {
    id: "monthly",
    label: "Monthly payment",
    group: "price",
    value: (vehicle) =>
      vehicle.monthlyPayment > 0
        ? `${formatPounds(vehicle.monthlyPayment)}/month*`
        : compareCopy.financeUnavailable,
  },
  {
    id: "year",
    label: "Year",
    group: "details",
    value: (vehicle) => String(vehicle.year),
  },
  {
    id: "mileage",
    label: "Mileage",
    group: "details",
    value: (vehicle) => `${formatNumber(vehicle.mileage)} miles`,
  },
  {
    id: "fuel",
    label: "Fuel",
    group: "details",
    value: (vehicle) => vehicle.fuelType,
  },
  {
    id: "transmission",
    label: "Transmission",
    group: "details",
    value: (vehicle) => vehicle.transmission,
  },
  {
    id: "body",
    label: "Body type",
    group: "details",
    value: (vehicle) => vehicle.bodyStyle,
  },
  {
    id: "colour",
    label: "Colour",
    group: "details",
    value: (vehicle) => vehicle.colour,
  },
  {
    id: "doors",
    label: "Doors",
    group: "details",
    value: (vehicle) => (vehicle.doors ? String(vehicle.doors) : compareCopy.dash),
  },
  {
    id: "seats",
    label: "Seats",
    group: "details",
    value: (vehicle) => (vehicle.seats ? String(vehicle.seats) : compareCopy.dash),
  },
  {
    id: "engine",
    label: "Engine",
    group: "details",
    value: (vehicle) =>
      detail(vehicle).fullSpecification?.engine ?? compareCopy.dash,
  },
  {
    id: "location",
    label: "Location",
    group: "ownership",
    value: (vehicle) => vehicle.locationName,
  },
  {
    id: "warranty",
    label: "Warranty",
    group: "ownership",
    value: (vehicle) => detail(vehicle).warranty.summary || compareCopy.dash,
  },
  {
    id: "inspection",
    label: "Inspection",
    group: "ownership",
    value: (vehicle) => detail(vehicle).inspection.summary || compareCopy.dash,
  },
  {
    id: "history",
    label: "Service history",
    group: "ownership",
    value: (vehicle) =>
      detail(vehicle).serviceHistory.summary || compareCopy.dash,
  },
];

export function valuesDiffer(values: string[]): boolean {
  const unique = new Set(values.map((value) => value.trim().toLowerCase()));
  return unique.size > 1;
}
