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
  /** Short selling point from the stock feed. Omitted when the feed has none. */
  highlight?: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyStyle: string;
  colour: string;
  doors?: number;
  seats?: number;
  cashPrice: number;
  /** Previous list price when the car has been reduced. */
  previousPrice?: number;
  /** ISO timestamp for when the list price last dropped. */
  priceDroppedAt?: string;
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
  /** Electric stock only. Official or manufacturer WLTP range in miles. */
  evRangeMiles?: number;
  /** Electric stock only. Typical rapid-charge hours for a useful top-up. */
  evChargeHours?: number;
  /** Listing road tax for filters. Prefer detail.runningCosts when present. */
  roadTaxCost?: number;
  /** True when an Aviloo battery certificate is available for this car. */
  avilooCertificate?: boolean;
  /**
   * 30 Day Guarantee eligibility. Defaults to true when omitted.
   * Off for trade sales and sold-as-seen cars.
   */
  guaranteeEligible?: boolean;
  /** Present when the car is not sold to a private retail customer. */
  saleType?: "retail" | "trade" | "sold_as_seen";
}
