import { guaranteeConfig } from "@/config/guarantee";
import {
  collectionChargePerMileLabel,
  excessMileageChargeLabel,
  freeCollectionRadiusLabel,
  guaranteeMileageLabel,
  guaranteePeriodLabel,
  refundAdminFeeLabel,
  refundPaymentDaysLabel,
  returnWithinHoursLabel,
} from "@/lib/guarantee/format";
import { homeStockProofLead } from "@/lib/home/inventory";

const period = () => guaranteePeriodLabel();
const miles = () => guaranteeMileageLabel();
const excess = () => excessMileageChargeLabel();
const adminFee = () => refundAdminFeeLabel();
const freeRadius = () => freeCollectionRadiusLabel();
const collectionRate = () => collectionChargePerMileLabel();
const refundDays = () => refundPaymentDaysLabel();
const returnHours = () => returnWithinHoursLabel();

/** Same stock figure as the homepage proof strip — never "400+". */
export function guaranteeStockLabel(): string {
  return homeStockProofLead();
}

export function guaranteeStockShortLabel(): string {
  const lead = guaranteeStockLabel();
  const match = /^(\d+\+)?/.exec(lead);
  return match?.[1] ? `${match[1]} cars` : lead;
}

export const guaranteeCopy = {
  programmeName: "30 Day Exchange or Money Back Guarantee",
  badgeTitle: "30 Day Exchange or Money Back",
  get badgeDetail() {
    return `Live with it for ${period()} or ${miles()}. Swap it or get your money back. Conditions apply.`;
  },
  get vehiclePanel() {
    return `Not sure? Take ${guaranteeConfig.periodDays} days. Swap to any car in stock with no fee, or return it for a refund. Finance handled for you.`;
  },
  get checkoutTick() {
    return `I have read the ${guaranteeCopy.programmeName} terms. I understand they are in addition to my legal rights.`;
  },
  get confirmationEmail() {
    return `Your ${guaranteeConfig.periodDays} day guarantee starts on the day you collect or receive your car and ends after ${period()} or ${miles()}. To use it, complete the online guarantee request form.`;
  },
  get metaDescription() {
    return `Every eligible Oakwood car comes with a 30 Day Exchange or Money Back Guarantee: ${period()} or ${miles()} to make sure it is right.`;
  },
  get adLine() {
    return `${guaranteeConfig.periodDays} days to love it, or swap it. ${guaranteeStockShortLabel()} on finance.`;
  },
  get headline() {
    return `Live with it for ${period()}. Not right? Swap it or get your money back.`;
  },
  get subheadline() {
    return `Every eligible Oakwood car comes with our 30 Day Exchange or Money Back Guarantee, with up to ${miles()} to make sure it fits your life.`;
  },
  get intro() {
    return `A test drive round the block tells you very little. The school run, the commute, the weekend away tell you everything. That's why we give you ${guaranteeConfig.periodDays} days to live with your car. If it isn't right, choose another from our ${guaranteeStockShortLabel()}, or hand it back for a refund.`;
  },
  browseCta: "Browse cars with the 30 Day Guarantee",
  requestCta: "Start a guarantee request",
  get footerLine() {
    return `Conditions apply. ${guaranteeConfig.periodDays} days or ${miles()}, whichever comes first. See full terms.`;
  },
  get howItWorks() {
    return [
      {
        title: "Drive it home",
        body: `Your ${guaranteeConfig.periodDays} days and ${miles()} start the day you collect or we deliver.`,
      },
      {
        title: "Live with it",
        body: "Use it exactly as you normally would.",
      },
      {
        title: "Not right? Tell us online",
        body: `Complete our online guarantee request form within ${guaranteeConfig.periodDays} days. You get a reference number straight away.`,
      },
      {
        title: "Swap or refund",
        body: `Pick another car from our stock with no admin fee, or return it for a refund, paid within ${refundDays()} of the car coming back.`,
      },
    ] as const;
  },
  promises: [
    {
      title: "Exchange first, no fee",
      body: "Swap to any car in stock. Pay or get back the difference in price.",
    },
    {
      title: "Finance handled for you",
      body: "If your car is on finance, we deal with the lender directly. You never chase the finance company.",
    },
    {
      title: "No hidden deductions",
      body: "We inspect the car against the handover photos and report you signed. Any charge is shown to you before your refund is paid.",
    },
    {
      title: "Your legal rights stay in full",
      body: "This guarantee is extra. It does not replace your rights under the Consumer Rights Act 2015, the Consumer Contracts Regulations 2013 or the Consumer Credit Act 1974. If you are cancelling or rejecting under those laws, you can tell us in any clear way — you do not have to use the guarantee form.",
    },
  ] as const,
  get faqs() {
    return [
      {
        id: "which-cars",
        question: "Which cars are covered?",
        answer:
          "Every car showing the 30 Day Guarantee badge, bought by a private customer. Trade sales and cars sold as seen are not covered.",
      },
      {
        id: "when-starts",
        question: `When do my ${guaranteeConfig.periodDays} days start?`,
        answer: `On the day you collect the car or we deliver it. The guarantee ends after ${period()} or ${miles()}, whichever comes first.`,
      },
      {
        id: "over-miles",
        question: `What if I go over ${miles()}?`,
        answer: `You can still use the guarantee. Each extra mile is charged at ${excess()} and taken off your refund.`,
      },
      {
        id: "fee",
        question: "Is there a fee?",
        answer: `No fee to exchange. A ${adminFee()} admin fee applies if you choose a refund instead.`,
      },
      {
        id: "finance",
        question: "My car is on finance. What happens?",
        answer:
          "If you exchange, we arrange finance on the new car, subject to the lender's approval. If you take a refund, we settle the agreement with the lender for you, including any interest, and refund your deposit less any deductions.",
      },
      {
        id: "part-exchange",
        question: "What about my part exchange?",
        answer:
          "We will usually have sold it already, so we refund the agreed part exchange value in money rather than return the car.",
      },
      {
        id: "return",
        question: "Do I have to bring the car back?",
        answer: `You can return it to the site you bought from. We collect free within ${freeRadius()} of that site. Further than that, collection is ${collectionRate()} per mile for the round trip.`,
      },
      {
        id: "refund-speed",
        question: "How fast is my refund?",
        answer: `Within ${refundDays()} of the car coming back and being inspected, to the payment method you used.`,
      },
      {
        id: "deductions",
        question: "What could be deducted?",
        answer:
          "Only damage not shown on your handover report, extra miles, missing keys or items, and a car returned with less fuel or charge than at handover. We show you every charge before we pay the refund.",
      },
      {
        id: "legal-rights",
        question: "Does this affect my legal rights?",
        answer:
          "No. If the car has a fault, your rights under the Consumer Rights Act 2015 apply in full, with no fees or deductions for that fault. You can tell us about a statutory cancellation or rejection in any clear way.",
      },
    ] as const;
  },
  get searchIntro() {
    return `Eligible cars include our ${guaranteeCopy.programmeName}: ${period()} or ${miles()} to make sure it is right.`;
  },
  get howItWorksJourneyStep() {
    return {
      number: "8",
      title: "30 Day Guarantee",
      copy: `Eligible cars come with ${period()} or ${miles()} to live with the car. Swap with no fee, or return for a refund. Conditions apply.`,
      cta: "30 Day Guarantee",
    };
  },
  get whatToExpectSentence() {
    return ` Eligible cars include the ${guaranteeCopy.programmeName}: ${period()} or ${miles()}, whichever comes first.`;
  },
  get proofDetail() {
    return `${period()} or ${miles()}. Swap or get your money back.`;
  },
};
