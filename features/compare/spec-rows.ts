import { formatNumber, formatPounds } from "@/lib/format/money";
import type { Vehicle } from "@/types/vehicle";

export interface CompareSpecRow {
  id: string;
  label: string;
  value: (vehicle: Vehicle) => string;
}

export const compareSpecRows: CompareSpecRow[] = [
  { id: "year", label: "Year", value: (vehicle) => String(vehicle.year) },
  {
    id: "mileage",
    label: "Mileage",
    value: (vehicle) => `${formatNumber(vehicle.mileage)} miles`,
  },
  { id: "fuel", label: "Fuel", value: (vehicle) => vehicle.fuelType },
  {
    id: "transmission",
    label: "Transmission",
    value: (vehicle) => vehicle.transmission,
  },
  { id: "body", label: "Body type", value: (vehicle) => vehicle.bodyStyle },
  { id: "colour", label: "Colour", value: (vehicle) => vehicle.colour },
  {
    id: "doors",
    label: "Doors",
    value: (vehicle) => (vehicle.doors ? String(vehicle.doors) : "—"),
  },
  {
    id: "seats",
    label: "Seats",
    value: (vehicle) => (vehicle.seats ? String(vehicle.seats) : "—"),
  },
  {
    id: "location",
    label: "Location",
    value: (vehicle) => vehicle.locationName,
  },
  {
    id: "cash",
    label: "Cash price",
    value: (vehicle) => formatPounds(vehicle.cashPrice),
  },
];
