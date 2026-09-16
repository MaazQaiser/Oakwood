export type VehicleCategory = "car" | "van";

export type VehicleAvailability =
  | "available"
  | "reserved"
  | "sold"
  | "expired";

export interface Location {
  slug: string;
  name: string;
  region: string;
  regionSlug: string;
  postcode?: string;
  telephone?: string;
  /** Showroom pages are only published for retail customer sites. */
  isShowroom: boolean;
}

export interface Vehicle {
  stockId: string;
  slug: string;
  category: VehicleCategory;
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  derivative?: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyStyle: string;
  colour: string;
  doors?: number;
  seats?: number;
  cashPrice: number;
  monthlyPayment: number;
  listedAt: string;
  image?: string;
  locationSlug: string;
  locationName: string;
  regionSlug: string;
  availability: VehicleAvailability;
  registration?: string;
  /** ISO date. Present when the vehicle has been sold. */
  soldAt?: string;
}
