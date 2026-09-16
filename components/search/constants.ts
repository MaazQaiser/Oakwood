import type { SearchSort } from "@/lib/validation/search";

export const PRICE_OPTIONS = [
  5000, 8000, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 35000,
];

export const MONTHLY_OPTIONS = [150, 200, 250, 300, 350, 400, 500];

export const MILEAGE_OPTIONS = [
  10000, 20000, 30000, 40000, 50000, 80000, 100000,
];

export const DEPOSIT_OPTIONS = [0, 500, 1000, 2000, 3000, 5000];
export const TERM_OPTIONS = [24, 36, 48, 60];
export const AGE_OPTIONS = [
  { label: "Any age", minYear: undefined },
  { label: "Up to 3 years old", years: 3 },
  { label: "Up to 5 years old", years: 5 },
  { label: "Up to 8 years old", years: 8 },
  { label: "Up to 10 years old", years: 10 },
];

export const SORT_OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "monthly_asc", label: "Monthly payment: low to high" },
  { value: "monthly_desc", label: "Monthly payment: high to low" },
  { value: "price_asc", label: "Cash price: low to high" },
  { value: "price_desc", label: "Cash price: high to low" },
  { value: "mileage", label: "Lowest mileage" },
  { value: "newest", label: "Newest cars" },
  { value: "recent", label: "Recently added" },
];
