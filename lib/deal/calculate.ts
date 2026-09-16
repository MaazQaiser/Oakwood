import { ILLUSTRATION_BASE_DEPOSIT, ILLUSTRATION_BASE_TERM } from "@/lib/finance/illustration";
import {
  DEAL_PROVIDER_CONFIG,
  type DealProviderConfig,
} from "@/lib/deal/provider-config";
import { listSelectedProducts } from "@/lib/deal/products";
import { formatPounds, formatTerm } from "@/lib/format/money";
import type {
  DealCalculation,
  DealCalculationInput,
  DealConstraintMessage,
  DealFinanceProfileInput,
} from "@/types/deal";

const MOCK_APR_BASE = 16.9;

function roundPounds(value: number): number {
  return Math.max(0, Math.round(value));
}

function pxFigures(input: DealCalculationInput): {
  equity: number;
  negativeEquity: number;
} {
  if (input.pxValue === undefined) {
    return { equity: 0, negativeEquity: 0 };
  }
  const settlement = input.pxSettlement ?? 0;
  const difference = input.pxValue - settlement;
  return {
    equity: Math.max(0, roundPounds(difference)),
    negativeEquity: Math.max(0, roundPounds(-difference)),
  };
}

function mockPcpFinalPayment(
  vehiclePrice: number,
  amountFinanced: number,
  annualMileage: number,
  config: DealProviderConfig,
): number {
  const mileageDelta = (annualMileage - 8000) / 1000;
  const residual = Math.max(
    0.2,
    config.pcpBaseResidualRate - mileageDelta * config.pcpMileageResidualStep,
  );
  const balloon = roundPounds(vehiclePrice * residual);
  return Math.min(balloon, roundPounds(amountFinanced * 0.7));
}

/**
 * Mock payment engine. Scales the catalogue representative monthly figure.
 * This is not a lender quotation and must be replaced by the finance API.
 * APR is applied only as a labelled mock scaler so personalised deals can
 * differ from the catalogue example; it is not a rate matrix (OD2).
 */
function mockMonthlyPayment(options: {
  representativeMonthly: number;
  vehiclePrice: number;
  amountForMonthly: number;
  term: number;
  financeType: DealCalculationInput["financeType"];
  apr?: number;
}): number {
  const baseFinanced = Math.max(1, options.vehiclePrice - ILLUSTRATION_BASE_DEPOSIT);
  const termFactor = ILLUSTRATION_BASE_TERM / Math.max(12, options.term);
  const typeFactor = options.financeType === "pcp" ? 0.86 : 1;
  const aprFactor =
    options.apr && options.apr > 0 ? options.apr / MOCK_APR_BASE : 1;
  return Math.max(
    1,
    Math.round(
      options.representativeMonthly *
        (Math.max(0, options.amountForMonthly) / baseFinanced) *
        termFactor *
        typeFactor *
        aprFactor,
    ),
  );
}

function buildConstraints(
  input: DealCalculationInput,
  profile: DealFinanceProfileInput | undefined,
  config: DealProviderConfig,
  amounts: {
    cashDeposit: number;
    amountFinanced: number;
    requiredAdvance: number;
    maxDeposit: number;
  },
): DealConstraintMessage[] {
  const messages: DealConstraintMessage[] = [];

  if (amounts.cashDeposit < config.minDeposit) {
    messages.push({
      code: "min_deposit",
      title: `A deposit of at least ${formatPounds(config.minDeposit)} is required for this vehicle.`,
      body: "Increase your cash deposit to continue with this deal.",
      action: "add_deposit",
      depositGap: config.minDeposit - amounts.cashDeposit,
    });
  }

  if (amounts.cashDeposit > amounts.maxDeposit) {
    messages.push({
      code: "max_deposit",
      title: `The maximum deposit for this vehicle is ${formatPounds(amounts.maxDeposit)}.`,
      body: "Reduce your cash deposit to stay within the available range.",
    });
  }

  if (config.minAdvance !== undefined && amounts.amountFinanced < config.minAdvance) {
    messages.push({
      code: "min_advance",
      title: "This deal is below the minimum amount that can be financed.",
      body: "Reduce the deposit or add a financeable product. The minimum advance comes from the finance provider and is not set in this page.",
    });
  }

  if (amounts.amountFinanced < 1) {
    messages.push({
      code: "nothing_to_finance",
      title: "There's nothing left to finance on this deal.",
      body: "Reduce the deposit if you want to continue with a finance application.",
    });
  }

  const maxTerm = profile?.maximumTerm
    ? Math.min(profile.maximumTerm, Math.max(...config.termOptions))
    : Math.max(...config.termOptions);

  if (!config.termOptions.includes(input.term) || input.term > maxTerm) {
    messages.push({
      code: "term_unavailable",
      title: "This term is not available for this vehicle.",
      body: `Choose a term of ${formatTerm(maxTerm)} or less. The term is not changed automatically.`,
      action: "change_term",
    });
  }

  if (input.financeType === "pcp" && config.pcpEnabled) {
    const mileage = input.annualMileage;
    if (
      mileage === undefined ||
      !config.pcpMileageOptions.includes(mileage)
    ) {
      messages.push({
        code: "mileage_unavailable",
        title: "Choose an annual mileage for Personal Contract Purchase.",
        body: "Annual mileage options are shown only when the finance configuration supports PCP.",
        action: "change_mileage",
      });
    }
  }

  if (profile && amounts.requiredAdvance > profile.maximumAdvance) {
    const gap = roundPounds(amounts.requiredAdvance - profile.maximumAdvance);
    messages.push({
      code: "max_advance",
      title: "Your current finance profile doesn't cover this deal.",
      body: `Maximum advance: ${formatPounds(profile.maximumAdvance)}. Required: ${formatPounds(amounts.requiredAdvance)}. Gap: ${formatPounds(gap)}.`,
      action: "add_deposit",
      depositGap: gap,
    });
  }

  if (config.maxLtv !== undefined) {
    const ltv = amounts.requiredAdvance / Math.max(1, input.vehiclePrice);
    if (ltv > config.maxLtv) {
      messages.push({
        code: "ltv",
        title: "This deal is above the permitted loan-to-value.",
        body: "Increase the deposit. The LTV limit is a finance-provider rule and is not calculated here until that rule is supplied.",
        action: "add_deposit",
      });
    }
  }

  if (
    config.maxVehicleAgeAtTermEndYears !== undefined &&
    input.asOfYear !== undefined
  ) {
    const ageAtEnd = input.asOfYear - input.vehicleYear + input.term / 12;
    if (ageAtEnd > config.maxVehicleAgeAtTermEndYears) {
      messages.push({
        code: "vehicle_age",
        title: "This term is not available for this vehicle.",
        body: "The vehicle would be older than the provider allows at the end of the term.",
        action: "change_term",
      });
    }
  }

  if (config.maxMileageAtTermEnd !== undefined && input.annualMileage) {
    const mileageAtEnd = input.vehicleMileage + input.annualMileage * (input.term / 12);
    if (mileageAtEnd > config.maxMileageAtTermEnd) {
      messages.push({
        code: "vehicle_mileage",
        title: "This mileage is not available for this vehicle.",
        body: "The predicted mileage at the end of the term is above the provider limit.",
        action: "change_mileage",
      });
    }
  }

  return messages;
}

export function calculateDeal(
  input: DealCalculationInput,
  financeProfile?: DealFinanceProfileInput,
  config: DealProviderConfig = DEAL_PROVIDER_CONFIG,
): DealCalculation {
  const maxDeposit = Math.min(input.vehiclePrice, config.maxDepositCap);
  const cashDeposit = roundPounds(
    Math.min(maxDeposit, Math.max(0, input.cashDeposit)),
  );
  const { equity: pxEquity, negativeEquity: pxNegativeEquity } = pxFigures(input);
  const totalDeposit = cashDeposit + pxEquity;
  const selected = listSelectedProducts(input.productIds);
  const financedProducts = selected
    .filter((product) => product.financeable)
    .reduce((sum, product) => sum + product.price, 0);
  const cashProducts = selected
    .filter((product) => !product.financeable)
    .reduce((sum, product) => sum + product.price, 0);
  const productsTotal = financedProducts + cashProducts;
  const financeableNegativeEquity = config.includeNegativeEquityInAdvance
    ? pxNegativeEquity
    : 0;
  const amountFinanced = roundPounds(
    input.vehiclePrice - totalDeposit + financeableNegativeEquity + financedProducts,
  );
  const requiredAdvance = amountFinanced;
  const constraints = buildConstraints(input, financeProfile, config, {
    cashDeposit,
    amountFinanced,
    requiredAdvance,
    maxDeposit,
  });

  const finalPayment =
    input.financeType === "pcp" && config.pcpEnabled
      ? mockPcpFinalPayment(
          input.vehiclePrice,
          amountFinanced,
          input.annualMileage ?? config.pcpMileageOptions[0] ?? 8000,
          config,
        )
      : undefined;

  const amountForMonthly = Math.max(
    0,
    amountFinanced - (finalPayment ?? 0),
  );

  const monthlyPayment =
    amountFinanced < 1
      ? 0
      : mockMonthlyPayment({
          representativeMonthly: input.representativeMonthly,
          vehiclePrice: input.vehiclePrice,
          amountForMonthly,
          term: input.term,
          financeType: input.financeType,
          apr: financeProfile?.apr,
        });

  const totalPayable = roundPounds(
    monthlyPayment * input.term +
      totalDeposit +
      cashProducts +
      (finalPayment ?? 0),
  );

  const advanceGap =
    financeProfile && requiredAdvance > financeProfile.maximumAdvance
      ? roundPounds(requiredAdvance - financeProfile.maximumAdvance)
      : undefined;

  const valid = constraints.length === 0;

  return {
    cashDeposit,
    pxEquity,
    pxNegativeEquity,
    totalDeposit,
    productsTotal,
    financedProducts,
    cashProducts,
    amountFinanced,
    requiredAdvance,
    monthlyPayment,
    totalPayable,
    finalPayment,
    valid,
    eligibility: advanceGap ? "advance_gap" : valid ? "ok" : "constraint",
    advanceGap,
    maximumAdvance: financeProfile?.maximumAdvance,
    constraints,
    source: "mock",
  };
}

export function productMonthlyImpact(
  input: DealCalculationInput,
  productId: string,
  financeProfile?: DealFinanceProfileInput,
  config?: DealProviderConfig,
): number {
  const without = calculateDeal(
    {
      ...input,
      productIds: input.productIds.filter((id) => id !== productId),
    },
    financeProfile,
    config,
  );
  const withProduct = calculateDeal(
    {
      ...input,
      productIds: Array.from(new Set([...input.productIds, productId])),
    },
    financeProfile,
    config,
  );
  return Math.max(0, withProduct.monthlyPayment - without.monthlyPayment);
}
