import type { NegEquityVehicle } from "@/lib/finance/negative-equity/quote";

/** Prototype stock used by the verification harnesses. */
export const FIXTURE_CARS: NegEquityVehicle[] = [
  { id: "0", year: 2016, make: "Vauxhall", model: "Astra", derivative: "1.4T SRi", cashPrice: 6995, mileage: 72400, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Hatchback", locationName: "Chorley" },
  { id: "1", year: 2017, make: "Mercedes-Benz", model: "A Class", derivative: "A180d SE", cashPrice: 10495, mileage: 58900, fuelType: "Diesel", transmission: "Automatic", bodyStyle: "Hatchback", locationName: "Chorley" },
  { id: "2", year: 2021, make: "Vauxhall", model: "Corsa", derivative: "1.2 SE Premium", cashPrice: 9995, mileage: 24600, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Hatchback", locationName: "Chorley" },
  { id: "3", year: 2020, make: "Ford", model: "Focus", derivative: "1.0 EcoBoost Titanium", cashPrice: 11995, mileage: 38400, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Hatchback", locationName: "Bury" },
  { id: "4", year: 2019, make: "SEAT", model: "Leon", derivative: "1.5 TSI EVO FR", cashPrice: 12495, mileage: 45600, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Hatchback", locationName: "Bury" },
  { id: "5", year: 2019, make: "Volkswagen", model: "Golf", derivative: "1.5 TSI Match", cashPrice: 13495, mileage: 42100, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Hatchback", locationName: "Bury" },
  { id: "6", year: 2020, make: "Peugeot", model: "3008", derivative: "1.5 BlueHDi Allure", cashPrice: 13995, mileage: 47200, fuelType: "Diesel", transmission: "Manual", bodyStyle: "SUV", locationName: "Chorley" },
  { id: "7", year: 2020, make: "Skoda", model: "Octavia", derivative: "1.5 TSI SE L", cashPrice: 13995, mileage: 41800, fuelType: "Petrol", transmission: "Manual", bodyStyle: "Estate", locationName: "Chorley" },
  { id: "8", year: 2020, make: "Ford", model: "Puma", derivative: "1.0 EcoBoost ST-Line", cashPrice: 14495, mileage: 33800, fuelType: "Petrol", transmission: "Manual", bodyStyle: "SUV", locationName: "Chorley" },
  { id: "9", year: 2018, make: "BMW", model: "3 Series", derivative: "320d M Sport", cashPrice: 14995, mileage: 61200, fuelType: "Diesel", transmission: "Automatic", bodyStyle: "Saloon", locationName: "Bury" },
  { id: "10", year: 2023, make: "MG", model: "MG4 EV", derivative: "Long Range SE", cashPrice: 15995, mileage: 14200, fuelType: "Electric", transmission: "Automatic", bodyStyle: "Hatchback", locationName: "Chorley" },
  { id: "11", year: 2021, make: "Hyundai", model: "Tucson", derivative: "1.6 T-GDi SE Connect", cashPrice: 16995, mileage: 29700, fuelType: "Petrol", transmission: "Manual", bodyStyle: "SUV", locationName: "Bury" },
  { id: "12", year: 2022, make: "Toyota", model: "Corolla", derivative: "1.8 Hybrid Icon Tech", cashPrice: 17495, mileage: 24900, fuelType: "Hybrid", transmission: "Automatic", bodyStyle: "Estate", locationName: "Bury" },
  { id: "13", year: 2022, make: "Nissan", model: "Qashqai", derivative: "1.3 DiG-T Acenta Premium", cashPrice: 17995, mileage: 28300, fuelType: "Petrol", transmission: "Automatic", bodyStyle: "SUV", locationName: "Chorley" },
  { id: "14", year: 2021, make: "Audi", model: "A3", derivative: "35 TFSI Sport", cashPrice: 18995, mileage: 31400, fuelType: "Petrol", transmission: "Automatic", bodyStyle: "Hatchback", locationName: "Bury" },
  { id: "15", year: 2023, make: "Cupra", model: "Born", derivative: "58kWh V2", cashPrice: 19995, mileage: 17600, fuelType: "Electric", transmission: "Automatic", bodyStyle: "Hatchback", locationName: "Bury" },
  { id: "16", year: 2020, make: "Ford", model: "Kuga", derivative: "1.5 EcoBoost ST-Line", cashPrice: 20000, mileage: 30100, fuelType: "Petrol", transmission: "Manual", bodyStyle: "SUV", locationName: "Bury" },
  { id: "17", year: 2023, make: "Kia", model: "Niro EV", derivative: "64.8kWh '3'", cashPrice: 21995, mileage: 19800, fuelType: "Electric", transmission: "Automatic", bodyStyle: "SUV", locationName: "Bury" },
  { id: "18", year: 2022, make: "Tesla", model: "Model 3", derivative: "Long Range", cashPrice: 24995, mileage: 26500, fuelType: "Electric", transmission: "Automatic", bodyStyle: "Saloon", locationName: "Bury" },
  { id: "19", year: 2022, make: "Volvo", model: "XC40", derivative: "B4 Plus Dark", cashPrice: 26995, mileage: 22400, fuelType: "Petrol", transmission: "Automatic", bodyStyle: "SUV", locationName: "Bury" },
];
