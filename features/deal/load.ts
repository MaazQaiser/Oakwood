import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import {
  ensureDemoDeal,
  getDealRecord,
  isDealExpired,
  toDealDraft,
} from "@/features/deal/store";
import { DEAL_PROVIDER_CONFIG } from "@/lib/deal/provider-config";
import { MOCK_OPTIONAL_PRODUCTS } from "@/lib/deal/products";
import { mockDealId } from "@/lib/mock/data";
import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { getSimilarVehicles } from "@/lib/vehicles/similar";
import { showrooms } from "@/config/locations";
import { supportRoutes } from "@/config/routes";
import type { DealFinanceContext, DealPageModel, DealVehicleSummary } from "@/types/deal";
import type { Vehicle } from "@/types/vehicle";

export type { DealPageModel, DealFinanceContext } from "@/types/deal";

function toVehicleSummary(vehicle: Vehicle): DealVehicleSummary {
  const detail = getVehicleDetail(vehicle);
  const image = detail.images[0];
  return {
    stockId: vehicle.stockId,
    slug: vehicle.slug,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    derivative: vehicle.derivative,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    locationName: vehicle.locationName,
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    imageSrc: image?.src ?? "/images/vehicle-placeholder.svg",
    imageAlt: image?.alt ?? `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    availability: vehicle.availability,
  };
}

function isProfileExpired(iso?: string, now = Date.now()): boolean {
  if (!iso) {
    return false;
  }
  const stamp = Date.parse(iso);
  return Number.isFinite(stamp) && stamp <= now;
}

export async function loadDealPage(dealId: string): Promise<DealPageModel> {
  const record =
    dealId === mockDealId
      ? ensureDemoDeal()
      : getDealRecord(dealId);

  const eligibility = await getEligibilitySession();
  const eligibilityExpired = !eligibility || isSessionExpired(eligibility);
  const profile = !eligibilityExpired ? eligibility.profile : undefined;
  const profileExpired = isProfileExpired(profile?.expiry);
  const hasLiveProfile = Boolean(
    profile &&
      !profileExpired &&
      (eligibility?.outcome === "accepted" || eligibility?.outcome === "conditional"),
  );

  const finance: DealFinanceContext = {
    hasProfile: hasLiveProfile,
    expired: Boolean(profile && profileExpired),
    profile:
      profile && (hasLiveProfile || profileExpired)
        ? {
            apr: profile.apr,
            maximumAdvance: profile.maximumAdvance,
            maximumTerm: profile.maximumTerm,
            productType: profile.productType,
            expiresAt: profile.expiry,
          }
        : undefined,
  };

  const contact = {
    telephone: showrooms[0]?.telephone,
    enquiryHref: supportRoutes.bookingEnquiry,
  };

  if (!record) {
    return {
      status: "not_found",
      dealId,
      similar: [],
      finance,
      products: MOCK_OPTIONAL_PRODUCTS,
      config: DEAL_PROVIDER_CONFIG,
      contact,
    };
  }

  if (isDealExpired(record) && dealId !== mockDealId) {
    return {
      status: "expired",
      dealId,
      similar: [],
      finance,
      products: MOCK_OPTIONAL_PRODUCTS,
      config: DEAL_PROVIDER_CONFIG,
      contact,
    };
  }

  const vehicle = findVehicleByStockId(record.vehicleStockId);
  if (!vehicle) {
    return {
      status: "not_found",
      dealId,
      similar: [],
      finance,
      products: MOCK_OPTIONAL_PRODUCTS,
      config: DEAL_PROVIDER_CONFIG,
      contact,
    };
  }

  const draft = toDealDraft(record);
  if (hasLiveProfile && eligibility?.display) {
    if (draft.cashDeposit === 0 && eligibility.display.deposit) {
      draft.cashDeposit = eligibility.display.deposit;
    }
  }

  return {
    status: "ready",
    dealId,
    vehicle: toVehicleSummary(vehicle),
    similar: getSimilarVehicles(vehicle),
    draft,
    finance,
    products: MOCK_OPTIONAL_PRODUCTS,
    config: DEAL_PROVIDER_CONFIG,
    contact,
  };
}

export async function loadDealShare(token: string) {
  const { getDealShareSnapshot } = await import("@/features/deal/store");
  return getDealShareSnapshot(token);
}
