import { guaranteeConfig } from "@/config/guarantee";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
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
import type { LegalDocument } from "@/types/legal";

const period = guaranteePeriodLabel();
const miles = guaranteeMileageLabel();
const excess = excessMileageChargeLabel();
const adminFee = refundAdminFeeLabel();
const freeRadius = freeCollectionRadiusLabel();
const collectionRate = collectionChargePerMileLabel();
const refundDays = refundPaymentDaysLabel();
const returnHours = returnWithinHoursLabel();

export function buildGuaranteeTermsDocument(): LegalDocument {
  return {
    slug: "30-day-guarantee",
    title: guaranteeCopy.programmeName,
    path: routes.thirtyDayGuaranteeTerms,
    canonicalPath: routes.thirtyDayGuaranteeTerms,
    metaTitle: guaranteeCopy.programmeName,
    metaDescription: guaranteeCopy.metaDescription,
    hubLabel: "30 Day Guarantee terms",
    hubDescription: `Voluntary ${period} exchange or money-back terms for eligible Oakwood cars.`,
    intro:
      "30 Day Exchange or Money Back Guarantee, offered by Oakwood Motor Company. These terms use the live guarantee configuration published on this website.",
    parent: { label: "30 Day Guarantee", href: routes.thirtyDayGuarantee },
    missing: [
      "Solicitor and compliance sign-off against Consumer Duty and the CPRs.",
      "Published damage charge schedule at SMART repair rates.",
      "Lender confirmation for day 15 to 30 settlement and commission clawback.",
    ],
    sections: [
      {
        id: "what-this-is",
        title: "1. What this guarantee is",
        paragraphs: [
          "This is a voluntary guarantee given in addition to your statutory rights. It does not reduce or replace your rights under the Consumer Rights Act 2015, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 or the Consumer Credit Act 1974.",
          "If you are entitled to cancel or reject under those laws, those rights apply in full and the fees and deductions in these terms do not apply to that cancellation or rejection. You can tell us about a statutory cancellation or rejection in any clear way, and you do not have to use the guarantee request form.",
        ],
      },
      {
        id: "who-covered",
        title: "2. Who and what is covered",
        paragraphs: [
          "The guarantee applies to vehicles marked with the 30 Day Guarantee badge, bought by a consumer for private use.",
          "It does not apply to trade sales, business purchases, vehicles sold as seen, or vehicles used for hire and reward (taxi, private hire, courier or delivery work) during the guarantee period.",
          `You may receive ${guaranteeConfig.maxRefundsPerCustomer} refund under this guarantee in any ${guaranteeConfig.refundsPerCustomerMonths} month period. Exchanges are not limited.`,
        ],
      },
      {
        id: "period",
        title: "3. The guarantee period",
        paragraphs: [
          "The period starts on the day you collect the vehicle or it is delivered to you, as shown on your handover document.",
          `It ends after ${period} or once the vehicle has covered ${miles} above the handover mileage, whichever comes first. Past ${miles} you may still use the guarantee within ${period}, with excess miles charged at ${excess} per mile.`,
          "To use the guarantee, you must submit our online guarantee request form before the period ends. The date of your request is the date the form is submitted. If you cannot use the form, your sales advisor will complete it with you by phone.",
        ],
      },
      {
        id: "options",
        title: "4. Your options",
        paragraphs: [
          "Exchange: you may exchange the vehicle for any other vehicle in our stock. Any price difference is paid by you or refunded to you. No admin fee applies to an exchange. The replacement vehicle does not carry a new 30 day guarantee.",
          `Refund: you may return the vehicle for a refund of the price paid, less the deductions in clause 6 and an admin fee of ${adminFee}.`,
        ],
      },
      {
        id: "returning",
        title: "5. Returning the vehicle",
        paragraphs: [
          `Once we accept your request, the vehicle must be returned within ${returnHours} unless we agree another time.`,
          `You may return it to the site you bought it from. We will collect it free of charge within ${freeRadius} of that site. Beyond ${freeRadius}, collection is charged at ${collectionRate} per mile for the round trip from that site.`,
          "The vehicle must be returned with all keys, the V5C if issued to you, the service book, the locking wheel nut and every item supplied with it.",
          "The vehicle must stay insured by you and taxed until we take it back. You are responsible for any fines, penalty charges, tolls or congestion charges incurred before the vehicle is returned.",
        ],
      },
      {
        id: "inspection",
        title: "6. Inspection and deductions",
        paragraphs: [
          "We inspect the vehicle on return against the handover condition report and photos you signed for, and the handover mileage.",
          "We may deduct: the cost of damage not recorded at handover, at the rates in our published damage charge schedule; excess mileage under clause 3.2; missing keys or items at replacement cost; and the cost of refuelling or recharging to the level at handover.",
          "We do not deduct for fair wear and tear consistent with the mileage covered.",
          "We will tell you every deduction, with photos, before we pay the refund.",
          "The guarantee does not apply if the vehicle has been modified, involved in an accident, written off by an insurer, or has had its registration changed during the period. Any fault present at handover is dealt with under your statutory rights, not these terms.",
        ],
      },
      {
        id: "refunds",
        title: "7. Refunds",
        paragraphs: [
          `We pay refunds within ${refundDays} of the vehicle being returned and inspected, to the payment method you used.`,
          "The refund covers the vehicle price paid by you, your reservation deposit, and any refundable products under clause 9, less deductions and the admin fee.",
          "Delivery charges are refunded only where you are cancelling within your 14 day statutory cancellation right for a distance sale.",
        ],
      },
      {
        id: "finance",
        title: "8. Vehicles bought on finance",
        paragraphs: [
          "Exchange: we will submit a finance proposal for the replacement vehicle. Approval is at the lender's discretion. If finance is declined, you may choose a refund instead.",
          "Refund within 14 days of your credit agreement: you are entitled to withdraw from the agreement under section 66A of the Consumer Credit Act 1974. We will settle the credit with the lender for you, including any interest accrued.",
          "Refund from day 15 to day 30: we will settle your finance agreement in full with the lender, including any interest accrued, so nothing remains owed to the lender on that agreement.",
          "In both cases we refund the money you paid to us directly, such as your deposit, less the deductions in clause 6 and the admin fee.",
        ],
      },
      {
        id: "part-exchange",
        title: "9. Part exchange",
        paragraphs: [
          "We do not guarantee to return your part exchange vehicle. We refund the agreed part exchange value in money instead.",
          "If we settled outstanding finance on your part exchange, that settlement is not refunded, and any negative equity added to the deal is deducted from your refund.",
        ],
      },
      {
        id: "products",
        title: "10. Additional products",
        paragraphs: [
          "Products sold with the vehicle, such as warranty, GAP insurance and paint protection, are cancelled when the vehicle is refunded. Each is refunded according to its own cancellation terms.",
          "If we transferred a private registration to the vehicle at your request, any DVLA fee to move it back is payable by you.",
        ],
      },
      {
        id: "changes",
        title: "11. Changes and contact",
        paragraphs: [
          "These terms apply to vehicles ordered while this version is published. The version in force on your order date applies to your purchase.",
          `To use the guarantee, submit the online guarantee request form on our website at ${routes.thirtyDayGuaranteeRequest}.`,
        ],
      },
    ],
    related: [
      { href: routes.thirtyDayGuarantee, label: "30 Day Guarantee" },
      { href: routes.thirtyDayGuaranteeRequest, label: "Guarantee request form" },
      { href: routes.vehiclePurchaseTerms, label: "Purchase terms" },
      { href: routes.distanceSelling, label: "Distance selling" },
      { href: routes.contact, label: "Contact Oakwood" },
    ],
  };
}
