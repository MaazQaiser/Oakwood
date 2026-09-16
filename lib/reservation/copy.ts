import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

export function introSupportingCopy(amount: number): string {
  return `Pay ${reservationAmountLabel(amount)} to hold this vehicle while you complete your purchase.`;
}

export function heldForCopy(days: number): string {
  return `Your car is held for ${formatHoldPeriod(days)}.`;
}

export function payHeadingCopy(amount: number): string {
  return `Pay ${reservationAmountLabel(amount)} to reserve`;
}

export function payBelowCopy(days: number): string {
  return `Your reservation will hold this vehicle for ${formatHoldPeriod(days)} and the reservation amount will be applied to your purchase.`;
}

export function howItWorksSteps(amount: number, days: number): string[] {
  return [
    `Pay ${reservationAmountLabel(amount)}`,
    `We hold the vehicle for ${formatHoldPeriod(days)}`,
    "Your reservation is applied to the purchase",
    "You can request a refund",
    "If the vehicle becomes unavailable, your reservation is refunded",
  ];
}

export const reservationCopy = {
  introHeading: "Reserve this car",
  fullyRefundable: "Fully refundable",
  appliedToPurchase: "Your reservation is applied to the purchase price.",
  requestRefund: "Request a refund if you change your mind.",
  amountPayableToday: "Amount payable today",
  payAbove: "Your reservation is fully refundable.",
  processing: "Processing your reservation...",
  confirming: "Confirming your reservation...",
  successHeading: "Your car is reserved.",
  successSupporting: "We're holding this vehicle for you.",
  notReserved: "Your vehicle has not been reserved.",
  paymentFailedHeading: "We couldn't process your payment.",
  concurrent:
    "Sorry, this vehicle has just been reserved by another customer.",
  reconciliation:
    "We've received your payment, but couldn't complete the reservation.",
  reconciliationSupport:
    "Your payment is being reviewed and we'll make sure this is resolved.",
  expiredHeading: "This reservation has expired.",
  expiredSupporting: "The vehicle is available again.",
  soldHeading: "This vehicle is no longer available.",
  soldSupporting: "Your reservation will be refunded.",
  financeUnavailableHeading:
    "We couldn't find a finance option for this vehicle.",
  financeUnavailableSupporting: "Your reservation will be refunded.",
  refundHeading: "Request your reservation refund?",
  refundSupporting:
    "Your vehicle will be released once the refund request is submitted.",
  intercept:
    "Before you go, would you like to speak to the Oakwood team?",
  continueRefund: "Continue with refund",
  refundSubmitted: "Your refund request has been submitted.",
  refundReceived: "We've received your request.",
  alreadyRefundRequested: "We've already received your refund request.",
  dealChanged:
    "Your deal has changed. Return to Deal Builder to review it before reserving.",
  termsUnpublished:
    "A dedicated reservation-terms page is not yet published. The summary on this page is the customer-facing explanation until that URL is confirmed.",
  confirmingTimeout:
    "This is taking longer than usual. We have received your payment request and will confirm by email.",
  lookupMissing: "Enter your email and reservation reference to view it.",
} as const;
