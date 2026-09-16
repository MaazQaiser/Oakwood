import type { Vehicle } from "@/types/vehicle";

export type GalleryItemKind = "image" | "video";

export interface VehicleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface VehicleVideo {
  title: string;
  poster: string;
  description: string;
  /** Omitted until a media file is connected. */
  src?: string;
}

export interface VehicleGalleryItem {
  kind: GalleryItemKind;
  src: string;
  alt: string;
  poster?: string;
  title?: string;
  width: number;
  height: number;
}

export interface MotTest {
  date: string;
  result: "Pass" | "Fail";
  mileage: number;
  advisories: string[];
  failures: string[];
}

export interface MotHistory {
  latestDate: string;
  latestResult: "Pass" | "Fail";
  latestMileage: number;
  tests: MotTest[];
}

export interface MotStatus {
  validUntil: string;
  minimumCommitmentMonths?: number;
}

export interface RecallStatus {
  outstandingCount: number;
  summary: string;
}

export type ProvenanceFlag = "clear" | "recorded" | "unknown";

export interface Provenance {
  outstandingFinance: ProvenanceFlag;
  writeOff: ProvenanceFlag;
  stolen: ProvenanceFlag;
  mileageAnomaly: ProvenanceFlag;
  plateChanges: number;
  previousKeepers: number;
  notes?: string;
}

export interface InspectionRecord {
  available: boolean;
  summary: string;
  completedOn?: string;
  inspector?: string;
}

export interface BatteryHealth {
  applicable: boolean;
  stateOfHealthPercent?: number;
  certificateAvailable: boolean;
  summary: string;
}

export interface PreparationRecord {
  completed: boolean;
  technician?: string;
  date?: string;
  tyreTread?: string;
  brakes?: string;
  cambelt?: string;
  diagnosticScan?: string;
}

export interface ServiceRecord {
  date: string;
  description: string;
  mileage?: number;
}

export interface ServiceHistory {
  summary: string;
  records: ServiceRecord[];
}

export interface VehicleItems {
  keys: number;
  v5c: boolean;
  lockingWheelNut: boolean;
  chargingCables?: number;
}

export interface RunningCosts {
  cleanAirZone: string;
  roadTaxBand: string;
  roadTaxCost?: number;
  insuranceGroup?: string;
}

export interface Warranty {
  summary: string;
  covered: string[];
  howToClaim: string;
  terms: string;
}

export interface VehicleImperfection {
  id: string;
  location: string;
  description: string;
  image: VehicleImage;
}

export interface FullSpecification {
  engine?: string;
  economy?: string;
  co2?: string;
  previousOwners?: number;
}

export type FinanceType = "hp" | "pcp";

export interface VehicleFinanceIllustration {
  monthlyPayment: number;
  deposit: number;
  term: number;
  financeType: FinanceType;
  totalPayable: number;
}

export interface VehicleDetail extends Vehicle {
  images: VehicleImage[];
  video?: VehicleVideo;
  mot: MotHistory;
  motStatus: MotStatus;
  recalls: RecallStatus;
  provenance: Provenance;
  inspection: InspectionRecord;
  batteryHealth?: BatteryHealth;
  preparation: PreparationRecord;
  serviceHistory: ServiceHistory;
  vehicleItems: VehicleItems;
  runningCosts: RunningCosts;
  warranty: Warranty;
  imperfections: VehicleImperfection[];
  fullSpecification?: FullSpecification;
}
