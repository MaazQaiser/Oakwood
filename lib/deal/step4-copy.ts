import { reservationConfig } from "@/config/reservation";
import {
  formatHoldPeriod,
  reservationAmountLabel,
} from "@/lib/reservation/format";

const amount = () => reservationAmountLabel(reservationConfig.amount);
const hold = () => formatHoldPeriod(reservationConfig.holdDurationDays);

export const STEP4_HUB_RESERVE = () => `Reserve this car for ${amount()}`;
export const STEP4_HUB_RESERVE_HINT = () =>
  `Fully refundable. We hold the car for ${hold()}.`;
export const STEP4_HUB_APPLY = "Apply for finance";
export const STEP4_HUB_APPLY_HINT =
  "Start a mock embedded finance application. Nothing is submitted to a live lender in this prototype.";
export const STEP4_HUB_TEST_DRIVE = "Test drive";
export const STEP4_HUB_TEST_DRIVE_HINT =
  "Book a showroom visit for this car.";
export const STEP4_HUB_CALL_NOW = "Call now";

export const STEP4_HUB_CALL_NOW_OPEN = "Call now · Open";
export const STEP4_HUB_CALL_BACK = "Call me back";
export const STEP4_HUB_CALL_BACK_HINT =
  "Leave your details and a preferred time.";

export const STEP4_RESERVE_TITLE = () => `Reserve for ${amount()}`;
export const STEP4_RESERVE_REFUNDABLE =
  "Fully refundable reservation fee, applied to your purchase.";
export const STEP4_RESERVE_HOLD = () =>
  `We hold this car for ${hold()} and take it off sale while you finish.`;
export const STEP4_RESERVE_MOCK =
  "Prototype only — no real payment is taken. Stripe is not connected.";
export const STEP4_RESERVE_PROCESSING = "Processing your reservation…";
export const STEP4_RESERVE_FAILED_TITLE = "We couldn't process your payment";
export const STEP4_RESERVE_FAILED_BODY =
  "No charge was made in this prototype. Check your details and try again, or choose another way to pay.";
export const STEP4_RESERVE_SUCCESS_TITLE = "Your car is reserved";
export const STEP4_RESERVE_SUCCESS_BODY = () =>
  `You're holding this car for ${hold()}. An Oakwood advisor will call shortly to confirm next steps.`;
export const STEP4_RESERVE_REFUND_INFO = () =>
  `Fully refundable within ${hold()} via the link in your confirmation email. The ${amount()} is applied to your purchase if you proceed.`;

export const STEP4_TD_TITLE = "Book a test drive";
export const STEP4_TD_SUBMIT =
  "Our sales team will be in touch soon to confirm who'll be looking after you.";
export const STEP4_TD_CHANNELS =
  "We'll prepare confirmation by SMS, WhatsApp and email (prototype — messages are not sent).";
export const STEP4_TD_CHANNELS_CHECK =
  "Send me confirmation by SMS, WhatsApp and email";
export const STEP4_TD_LOADING = "Checking availability…";
export const STEP4_TD_UNAVAILABLE =
  "That time isn't available. Please choose another slot.";
export const STEP4_TD_CONFIRM_TITLE = "Test drive requested";
export const STEP4_TD_CONFIRM_BODY =
  "We've recorded your booking request. Confirmation channels below are a prototype summary — nothing has been sent yet.";
export const STEP4_TD_WHAT_TO_BRING = [
  "Your driving licence (photocard)",
  "Proof of address if your licence address differs",
  "Any part-exchange documents you already have",
];
export const STEP4_TD_WALKAROUND_PLACEHOLDER =
  "Walkaround video for this car will appear here when the showroom has uploaded it.";

export const STEP4_CLOSED_TITLE = "Sorry, we are now closed";
export const STEP4_CLOSED_BODY = (nextOpenLabel: string) =>
  `Our team opens ${nextOpenLabel}. Pick a callback time below and we'll prioritise your call.`;
export const STEP4_CLOSED_HOURS_REF = "Today's published hours";

export const STEP4_CB_TITLE = "Call me back";
export const STEP4_CB_SUBMITTING = "Booking your callback…";
export const STEP4_CB_CONFIRM_TITLE = "Callback booked";
export const STEP4_CB_CONFIRM_BODY =
  "We've recorded your request (prototype). An Oakwood advisor will call at the time you chose — no SMS or email has been sent yet.";

export const STEP4_BACK_HUB = "Back to next steps";
/** Leaves the deal after a completed Step 4 action (reserve / test drive / callback). */
export const STEP4_DONE = "Done";
