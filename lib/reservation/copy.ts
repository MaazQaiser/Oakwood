import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";
import { guaranteeCopy } from "@/lib/guarantee/copy";

export function introSupportingCopy(amount: number): string {
  return `We place a ${reservationAmountLabel(amount)} card authorisation to hold this vehicle while you complete your purchase. The money is not taken.`;
}

export function heldForCopy(days: number): string {
  return `Your car is held for ${formatHoldPeriod(days)}.`;
}

export function payHeadingCopy(amount: number): string {
  return `Authorise ${reservationAmountLabel(amount)} to reserve`;
}

export function payBelowCopy(days: number): string {
  return `We place a card authorisation for the reservation amount. It is not charged unless you complete your purchase. The vehicle is held for ${formatHoldPeriod(days)}.`;
}

export function howItWorksSteps(amount: number, days: number): string[] {
  return [
    `We authorise ${reservationAmountLabel(amount)} on your card (not charged)`,
    `We hold the vehicle for ${formatHoldPeriod(days)}`,
    "The reservation is applied to your purchase if you go ahead",
    "Cancel your reservation any time from the manage page — we release the authorisation",
    "If the vehicle becomes unavailable, we release the authorisation",
  ];
}

export const reservationCopy = {
  entryHeading: "Reserve a car",
  entryBody: `Reservations start from a car. Authorise ${reservationAmountLabel()} on your card to hold a vehicle while you complete the purchase. The money is not taken.`,
  introHeading: "Reserve this car",
  cardAuthorisation: "Card authorisation only — not charged",
  appliedToPurchase: "Your reservation is applied to the purchase price if you proceed.",
  cancelReservation: "Cancel your reservation any time from the manage page.",
  amountPayableToday: "Authorisation today",
  payAbove:
    "We only place a card authorisation. The reservation amount is not taken unless you complete the purchase.",
  processing: "Processing your reservation...",
  confirming: "Confirming your reservation...",
  successHeading: "Your car is reserved.",
  successSupporting: "We're holding this vehicle for you.",
  notReserved: "Your vehicle has not been reserved.",
  paymentFailedHeading: "We couldn't process your payment.",
  stripeUnavailable:
    "We couldn't complete the card authorisation just now. Your car has not been reserved. You can try again.",
  paymentReassurance:
    "Card authorisation only. After it is confirmed, the car is held for the reservation period under the reservation terms.",
  cardFallback:
    "Card details are entered in Stripe. Oakwood does not store your card number.",
  concurrent:
    "Sorry, this vehicle has just been reserved by another customer.",
  reconciliation:
    "We've received your authorisation, but couldn't complete the reservation.",
  reconciliationSupport:
    "Your authorisation is being reviewed and we'll make sure this is resolved.",
  expiredHeading: "This reservation has expired.",
  expiredSupporting:
    "The vehicle is available again. We have released the card authorisation.",
  cancelledHeading: "Your reservation has been cancelled.",
  cancelledSupporting:
    "The vehicle is available again. We have released the card authorisation.",
  soldHeading: "This vehicle is no longer available.",
  soldSupporting:
    "We have released the card authorisation. Nothing was charged.",
  financeUnavailableHeading:
    "We couldn't find a finance option for this vehicle.",
  financeUnavailableSupporting:
    "We have released the card authorisation. Nothing was charged.",
  cancelHeading: "Cancel your reservation?",
  cancelSupporting:
    "We'll release the card authorisation and make the vehicle available again.",
  intercept:
    "Before you go, would you like to speak to the Oakwood team?",
  continueCancel: "Cancel reservation",
  cancelSubmitted: "Your reservation has been cancelled.",
  cancelReceived: "We've released the card authorisation.",
  alreadyCancelled: "This reservation has already been cancelled.",
  dealChanged:
    "Your deal has changed. Return to Deal Builder to review it before reserving.",
  termsUnpublished:
    "A dedicated reservation-terms page is not yet published. The summary on this page is the customer-facing explanation until that URL is confirmed.",
  confirmingTimeout:
    "This is taking longer than usual. We have received your authorisation request and will confirm by email.",
  lookupMissing: "Enter your email and reservation reference to view it.",
  guaranteeEmailSnippet: guaranteeCopy.confirmationEmail,
} as const;