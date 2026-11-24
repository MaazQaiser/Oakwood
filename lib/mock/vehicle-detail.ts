import { EV_RUNNING_COSTS } from "@/config/ev";
import { vehicleCardImage, vehicleGalleryImages, stockImages } from "@/lib/media/stock";
import { getGalleryItems } from "@/lib/vehicles/similar";
import { OAKWOOD_WARRANTY_VEHICLE_SUMMARY } from "@/lib/warranty/copy";
import type { Vehicle } from "@/types/vehicle";
import type {
  BatteryHealth,
  VehicleDetail,
  VehicleImage,
} from "@/types/vehicle-detail";

const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 1000;

function image(
  src: string,
  alt: string,
): VehicleImage {
  return { src, alt, width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
}

function viewAlt(vehicle: Vehicle, view: string): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${view}`;
}

function defaultImages(vehicle: Vehicle): VehicleImage[] {
  const hero = vehicle.image ?? vehicleCardImage(vehicle);
  const views = [
    "front three-quarter view",
    "nearside profile",
    "rear three-quarter view",
    "interior",
    "dashboard",
    "boot space",
  ];

  return vehicleGalleryImages(hero).map((src, index) =>
    image(src, viewAlt(vehicle, views[index] ?? "view")),
  );
}

function isElectrified(vehicle: Vehicle): boolean {
  const fuel = vehicle.fuelType.toLowerCase();
  return fuel === "electric" || fuel === "hybrid";
}

function defaultEvRunningCosts(vehicle: Vehicle) {
  if (vehicle.fuelType.toLowerCase() !== "electric") {
    return undefined;
  }
  const wltp = vehicle.evRangeMiles ?? 260;
  return {
    wltpRangeMiles: wltp,
    realRangeMiles: Math.round(wltp * EV_RUNNING_COSTS.realWorldRangeFactor),
    costPerMilePence: 8,
  };
}

function defaultBattery(vehicle: Vehicle): BatteryHealth | undefined {
  if (!isElectrified(vehicle)) {
    return undefined;
  }

  if (vehicle.avilooCertificate) {
    return {
      applicable: true,
      stateOfHealthPercent: 90,
      certificateAvailable: true,
      summary: "Aviloo battery certificate available",
    };
  }

  return {
    applicable: true,
    certificateAvailable: false,
    summary: "Battery health certificate unavailable",
  };
}

function defaultDetail(vehicle: Vehicle): VehicleDetail {
  const images = vehicle.image
    ? [image(vehicle.image, viewAlt(vehicle, "front three-quarter view")), ...defaultImages(vehicle).slice(1)]
    : defaultImages(vehicle);

  return {
    ...vehicle,
    images,
    video: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} walkaround`,
      poster: stockImages.lifestyleDrive,
      description: `See the ${vehicle.make} ${vehicle.model} in more detail.`,
    },
    mot: {
      latestDate: "12 March 2026",
      latestResult: "Pass",
      latestMileage: Math.max(1000, vehicle.mileage - 350),
      tests: [
        {
          date: "12 March 2026",
          result: "Pass",
          mileage: Math.max(1000, vehicle.mileage - 350),
          advisories: ["Front brake discs worn, but not excessively"],
          failures: [],
        },
        {
          date: "18 March 2025",
          result: "Pass",
          mileage: Math.max(800, vehicle.mileage - 9200),
          advisories: [],
          failures: [],
        },
      ],
    },
    motStatus: {
      validUntil: "12 March 2027",
    },
    recalls: {
      outstandingCount: 0,
      summary: "No outstanding safety recalls",
    },
    provenance: {
      outstandingFinance: "clear",
      writeOff: "clear",
      stolen: "clear",
      mileageAnomaly: "clear",
      plateChanges: 0,
      previousKeepers: 2,
    },
    vehicleCheck: {
      summary: "HPI and provenance checks completed",
      items: [
        { label: "Outstanding finance", value: "Clear" },
        { label: "Write-off status", value: "Clear" },
        { label: "Stolen marker", value: "Clear" },
        { label: "Mileage anomaly", value: "Clear" },
        { label: "Safety recalls", value: "No outstanding safety recalls" },
      ],
    },
    inspection: {
      available: false,
      summary: "Inspection certificate unavailable",
    },
    evRunningCosts: defaultEvRunningCosts(vehicle),
    batteryHealth: defaultBattery(vehicle),
    preparation: {
      completed: true,
      technician: "Oakwood preparation team",
      date: "4 September 2026",
      tyreTread: "Front 5.5 mm / Rear 6.0 mm",
      brakes: "Front 10 mm / Rear 8 mm",
      cambelt: "Not applicable / not due",
      diagnosticScan: "No stored faults",
    },
    serviceHistory: {
      summary: "No service history is available.",
      records: [],
    },
    vehicleItems: {
      keys: 2,
      v5c: true,
      lockingWheelNut: true,
      chargingCables: isElectrified(vehicle) ? 1 : undefined,
    },
    runningCosts: {
      cleanAirZone: vehicle.fuelType === "Diesel" ? "Check local CAZ rules" : "Typically ULEZ compliant",
      roadTaxBand: vehicle.fuelType === "Electric" ? "Band A" : "Band H",
      roadTaxCost: vehicle.fuelType === "Electric" ? 0 : 195,
      insuranceGroup: "24E",
    },
    warranty: {
      summary: OAKWOOD_WARRANTY_VEHICLE_SUMMARY,
      covered:
        vehicle.availability === "available"
          ? [
              "Cover for listed mechanical and electrical items during the warranty period.",
              "Work carried out through Oakwood or an authorised repairer.",
            ]
          : ["Warranty terms apply to available vehicles."],
      howToClaim:
        "Contact Oakwood with your vehicle details and we will explain the next step.",
      terms:
        "Warranty terms are provided with the vehicle. See the Oakwood warranty page for how to make a claim.",
    },
    imperfections: [],
    fullSpecification: {
      previousOwners: 2,
    },
  };
}

const featuredCClass: Partial<VehicleDetail> = {
  mot: {
    latestDate: "12 March 2026",
    latestResult: "Pass",
    latestMileage: 28100,
    tests: [
      {
        date: "12 March 2026",
        result: "Pass",
        mileage: 28100,
        advisories: [
          "Nearside front tyre worn close to legal limit",
          "Offside rear brake disc worn, but not excessively",
        ],
        failures: [],
      },
      {
        date: "9 March 2025",
        result: "Pass",
        mileage: 21440,
        advisories: [],
        failures: [],
      },
      {
        date: "2 March 2024",
        result: "Fail",
        mileage: 16210,
        advisories: [],
        failures: ["Registration plate lamp not working"],
      },
    ],
  },
  motStatus: {
    validUntil: "12 March 2027",
  },
  inspection: {
    available: true,
    summary: "Vehicle inspection completed",
    completedOn: "5 September 2026",
    inspector: "Oakwood technician",
    result: "Pass",
    checklist: [
      { category: "Exterior", check: "Panels and paint", result: "Pass" },
      { category: "Wheels", check: "Tyre tread", result: "Advisory" },
      { category: "Brakes", check: "Discs and pads", result: "Pass" },
      { category: "Engine", check: "Oil leaks", result: "Pass" },
      { category: "Road test", check: "Noise and vibration", result: "Pass" },
    ],
  },
  pricePosition: {
    amountBelowAverage: 1240,
    comparableCount: 16,
  },
  serviceHistory: {
    summary: "Full service history",
    records: [
      { date: "March 2026", description: "Manufacturer service", mileage: 27800 },
      { date: "March 2025", description: "Manufacturer service", mileage: 21200 },
      { date: "April 2024", description: "Manufacturer service", mileage: 15400 },
    ],
  },
  imperfections: [
    {
      id: "imp-1",
      location: "Front passenger door",
      description: "Light scratch",
      image: image(
        stockImages.carSide,
        "Light scratch on the front passenger door of a 2021 Mercedes-Benz C-Class",
      ),
    },
  ],
  fullSpecification: {
    engine: "2.0 litre diesel",
    economy: "Combined figure not confirmed in this preview",
    co2: "Not confirmed in this preview",
    previousOwners: 1,
  },
  runningCosts: {
    cleanAirZone: "Check local CAZ rules for this diesel",
    roadTaxBand: "Band H",
    roadTaxCost: 195,
    insuranceGroup: "32E",
  },
};

const q4Battery: Partial<VehicleDetail> = {
  batteryHealth: {
    applicable: true,
    stateOfHealthPercent: 91,
    certificateAvailable: true,
    summary: "State of health: 91%",
  },
  vehicleItems: {
    keys: 2,
    v5c: true,
    lockingWheelNut: true,
    chargingCables: 2,
  },
  runningCosts: {
    cleanAirZone: "Typically ULEZ compliant",
    roadTaxBand: "Band A",
    roadTaxCost: 0,
    insuranceGroup: "33E",
  },
};

const overrides: Record<string, Partial<VehicleDetail>> = {
  "7848117": featuredCClass,
  "1000002": {
    ...q4Battery,
    inspection: {
      available: true,
      summary: "AA independent inspection completed",
      completedOn: "2 September 2026",
      inspector: "AA engineer",
      result: "Pass",
      checklist: [
        { category: "Exterior", check: "Corrosion", result: "Pass" },
        { category: "Battery", check: "High-voltage warnings", result: "Pass" },
        { category: "Charging", check: "Charge port", result: "Pass" },
      ],
    },
  },
  "1000091": {
    batteryHealth: {
      applicable: true,
      stateOfHealthPercent: 88,
      certificateAvailable: true,
      summary: "Aviloo battery certificate available",
    },
    inspection: {
      available: true,
      summary: "AA independent inspection completed",
      completedOn: "8 September 2026",
      inspector: "AA engineer",
      result: "Pass",
    },
  },
  "1000093": {
    batteryHealth: {
      applicable: true,
      stateOfHealthPercent: 94,
      certificateAvailable: true,
      summary: "Aviloo battery certificate available",
    },
    inspection: {
      available: true,
      summary: "AA independent inspection completed",
      completedOn: "12 September 2026",
      inspector: "AA engineer",
      result: "Pass",
    },
  },
};

export function getVehicleDetail(vehicle: Vehicle): VehicleDetail {
  const base = defaultDetail(vehicle);
  const extra = overrides[vehicle.stockId];
  if (!extra) {
    return base;
  }

  return {
    ...base,
    ...extra,
    mot: extra.mot ?? base.mot,
    motStatus: extra.motStatus ?? base.motStatus,
    recalls: extra.recalls ?? base.recalls,
    provenance: extra.provenance ?? base.provenance,
    inspection: extra.inspection ?? base.inspection,
    vehicleCheck: extra.vehicleCheck ?? base.vehicleCheck,
    evRunningCosts: extra.evRunningCosts ?? base.evRunningCosts,
    pricePosition: extra.pricePosition ?? base.pricePosition,
    batteryHealth: extra.batteryHealth ?? base.batteryHealth,
    preparation: extra.preparation ?? base.preparation,
    serviceHistory: extra.serviceHistory ?? base.serviceHistory,
    vehicleItems: extra.vehicleItems ?? base.vehicleItems,
    runningCosts: extra.runningCosts ?? base.runningCosts,
    warranty: extra.warranty ?? base.warranty,
    imperfections: extra.imperfections ?? base.imperfections,
    fullSpecification: extra.fullSpecification ?? base.fullSpecification,
    images: extra.images ?? base.images,
    video: extra.video ?? base.video,
  };
}

export function getVehicleGallery(vehicle: VehicleDetail) {
  return getGalleryItems(vehicle.images, vehicle.video);
}

export function getMockValuation(registration: string, mileage: number): number {
  const cleaned = registration.replace(/\s+/g, "").toUpperCase();
  if (cleaned === "AB21CDE") {
    return 8500;
  }

  let hash = 0;
  for (let index = 0; index < cleaned.length; index += 1) {
    hash = (hash * 31 + cleaned.charCodeAt(index)) % 1000;
  }

  const mileagePenalty = Math.min(9000, Math.round(mileage / 8));
  const value = 11800 + hash * 3 - mileagePenalty;
  return Math.max(1500, Math.round(value / 50) * 50);
}
