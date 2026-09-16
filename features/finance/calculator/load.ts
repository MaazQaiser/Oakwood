import { getEligibilitySession } from "@/features/eligibility/session";
import { isSessionExpired } from "@/features/eligibility/store";
import { getPxSession } from "@/features/part-exchange/session";
import { isPxExpired, snapshotToDealPx } from "@/features/part-exchange/store";
import { FINANCE_CALCULATOR_CONFIG } from "@/lib/finance/calculator-config";
import { getVehicleDetail } from "@/lib/mock/vehicle-detail";
import { findVehicleByStockId } from "@/lib/vehicles/query";
import { isReservable } from "@/lib/vehicles/sold";
import type { Vehicle } from "@/types/vehicle";
import type {
  CalculatorFinanceContext,
  CalculatorPageModel,
  CalculatorVehicle,
} from "@/features/finance/calculator/types";

function isProfileExpired(iso?: string, now = Date.now()): boolean {
  if (!iso) {
    return false;
  }
  const stamp = Date.parse(iso);
  return Number.isFinite(stamp) && stamp <= now;
}

function toCalculatorVehicle(vehicle: Vehicle): CalculatorVehicle {
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
    cashPrice: vehicle.cashPrice,
    representativeMonthly: vehicle.monthlyPayment,
    imageSrc: image?.src ?? "/images/vehicle-placeholder.svg",
    imageAlt: image?.alt ?? `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    availability: vehicle.availability,
    financeable: isReservable(vehicle),
  };
}

async function loadFinanceContext(): Promise<CalculatorFinanceContext> {
  try {
    const eligibility = await getEligibilitySession();
    const eligibilityExpired = !eligibility || isSessionExpired(eligibility);
    const profile = !eligibilityExpired ? eligibility.profile : undefined;
    const profileExpired = isProfileExpired(profile?.expiry);
    const hasLiveProfile = Boolean(
      profile &&
        !profileExpired &&
        (eligibility?.outcome === "accepted" ||
          eligibility?.outcome === "conditional"),
    );

    return {
      hasProfile: hasLiveProfile,
      expired: Boolean(profile && profileExpired),
      unavailable: false,
      suggestedDeposit: hasLiveProfile
        ? eligibility?.display?.deposit
        : undefined,
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
  } catch {
    return {
      hasProfile: false,
      expired: false,
      unavailable: true,
    };
  }
}

export async function loadFinanceCalculatorPage(input: {
  stockId?: string;
}): Promise<CalculatorPageModel> {
  const finance = await loadFinanceContext();
  const pxSession = await getPxSession();
  const px =
    pxSession && !isPxExpired(pxSession)
      ? snapshotToDealPx(pxSession.snapshot)
      : undefined;

  const selected = input.stockId
    ? findVehicleByStockId(input.stockId)
    : undefined;
  const example = findVehicleByStockId(
    FINANCE_CALCULATOR_CONFIG.catalogueExampleStockId,
  );

  return {
    vehicle: selected ? toCalculatorVehicle(selected) : undefined,
    exampleVehicle: example ? toCalculatorVehicle(example) : undefined,
    px,
    finance,
    config: FINANCE_CALCULATOR_CONFIG,
  };
}
