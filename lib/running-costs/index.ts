import {
  DRIVER_AGES,
  INSURANCE_BASE,
  RUNNING_COST_DEPOSIT_RATIO,
  RUNNING_COST_RATES,
  type ChargingAccess,
  type DriverAge,
} from "@/config/running-costs";
import { hpPayment, maxTermMonths } from "@/lib/finance/interest-free";

export interface RunningCostCar {
  id: string;
  year: number;
  make: string;
  model: string;
  derivative: string;
  cashPrice: number;
  mileage: number;
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  transmission: "Manual" | "Automatic";
  bodyStyle: string;
  location: "Bury" | "Chorley";
  /** Insurance group, 1 to 50. */
  insuranceGroup: number;
  /** mpg, or miles per kWh for electric cars. */
  efficiency: number;
  roadTax: number;
  /** Typical annual servicing and wear. */
  servicing: number;
}

export interface DriverProfile {
  age: DriverAge;
  annualMiles: number;
  charging: ChargingAccess;
}

export interface MonthlyRunningCosts {
  finance: number;
  insurance: number;
  roadTax: number;
  fuel: number;
  servicing: number;
  running: number;
  total: number;
}

export type RunningCostSort = "total" | "insurance" | "price" | "efficiency" | "newest";

export function isElectric(car: Pick<RunningCostCar, "fuelType">): boolean {
  return car.fuelType === "Electric";
}

/**
 * The lender caps by age and mileage at the end of the agreement. We add a cap of
 * our own: seven years of interest on a cheap first car is not something to show.
 */
export function runningCostTerm(car: Pick<RunningCostCar, "cashPrice" | "year" | "mileage">): number {
  const ours = car.cashPrice < 8_000 ? 48 : car.cashPrice < 12_000 ? 60 : 84;
  return Math.min(ours, maxTermMonths(car));
}

export function financeMonthly(car: RunningCostCar): number {
  const deposit = Math.round(car.cashPrice * RUNNING_COST_DEPOSIT_RATIO);
  return hpPayment(car.cashPrice - deposit, runningCostTerm(car));
}

function ageMultiplier(age: DriverAge): number {
  return DRIVER_AGES.find((item) => item.id === age)?.multiplier ?? 1;
}

/** An indication from the insurance group and driver age. Never a quote. */
export function insuranceYearly(car: RunningCostCar, driver: DriverProfile): number {
  const group = 1 + (car.insuranceGroup - 1) * 0.058;
  const mileage = 1 + (Math.max(0, driver.annualMiles - 8_000) / 1_000) * 0.012;
  return INSURANCE_BASE * group * ageMultiplier(driver.age) * mileage;
}

export function fuelYearly(car: RunningCostCar, driver: DriverProfile): number {
  if (isElectric(car)) {
    const rate =
      driver.charging === "home"
        ? RUNNING_COST_RATES.homePerKwh
        : RUNNING_COST_RATES.rapidPerKwh;
    return (driver.annualMiles / car.efficiency) * rate;
  }
  const perLitre =
    car.fuelType === "Diesel"
      ? RUNNING_COST_RATES.dieselPerLitre
      : RUNNING_COST_RATES.petrolPerLitre;
  return (driver.annualMiles / car.efficiency) * RUNNING_COST_RATES.litresPerGallon * perLitre;
}

export function monthlyRunningCosts(
  car: RunningCostCar,
  driver: DriverProfile,
): MonthlyRunningCosts {
  const finance = financeMonthly(car);
  const insurance = insuranceYearly(car, driver) / 12;
  const roadTax = car.roadTax / 12;
  const fuel = fuelYearly(car, driver) / 12;
  const servicing = car.servicing / 12;
  const running = insurance + roadTax + fuel + servicing;
  return { finance, insurance, roadTax, fuel, servicing, running, total: finance + running };
}

/** Electric efficiency is compared roughly like for like with mpg. */
function efficiencyScore(car: RunningCostCar): number {
  return isElectric(car) ? car.efficiency * 30 : car.efficiency;
}

export function sortRunningCostCars(
  cars: RunningCostCar[],
  sort: RunningCostSort,
  driver: DriverProfile,
): RunningCostCar[] {
  const total = (car: RunningCostCar) => monthlyRunningCosts(car, driver).total;
  const compare: Record<RunningCostSort, (a: RunningCostCar, b: RunningCostCar) => number> = {
    total: (a, b) => total(a) - total(b),
    insurance: (a, b) => a.insuranceGroup - b.insuranceGroup || total(a) - total(b),
    price: (a, b) => a.cashPrice - b.cashPrice,
    efficiency: (a, b) => efficiencyScore(b) - efficiencyScore(a),
    newest: (a, b) => b.year - a.year,
  };
  return [...cars].sort(compare[sort]);
}

/**
 * Budget steps built from what this driver can actually achieve, so a chip never
 * offers a figure that returns an empty list.
 */
export function budgetSteps(cars: RunningCostCar[], driver: DriverProfile): number[] {
  const cheapest = Math.min(...cars.map((car) => monthlyRunningCosts(car, driver).total));
  const floor = Math.ceil(cheapest / 25) * 25;
  return [floor + 25, floor + 75, floor + 150, floor + 300];
}

export function formatEfficiency(car: RunningCostCar): string {
  return isElectric(car) ? `${car.efficiency} mi/kWh` : `${car.efficiency} mpg`;
}
