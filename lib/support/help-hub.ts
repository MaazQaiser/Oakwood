import { routes } from "@/config/routes";

export type HelpTopicId =
  | "all"
  | "buying"
  | "finance"
  | "partex"
  | "reservations"
  | "delivery"
  | "servicing"
  | "warranty"
  | "contact";

export interface HelpTopic {
  id: HelpTopicId;
  name: string;
  blurb: string;
  serviceLink?: { label: string; href: string };
}

export interface HelpFaqLink {
  label: string;
  href: string;
  verified: boolean;
}

export interface HelpFaq {
  id: string;
  topicId: Exclude<HelpTopicId, "all">;
  group?: string;
  question: string;
  answer: string;
  link?: HelpFaqLink;
  needsConfirm?: boolean;
}

export interface HelpContactCard {
  id: string;
  title: string;
  body?: string;
  cta?: { label: string; href: string };
  featured?: boolean;
  branches?: Array<{ name: string; phone: string; telHref: string; hours: string }>;
}

export const HELP_TOPICS: HelpTopic[] = [
  { id: "all", name: "All topics", blurb: "Every question in one place. Pick a topic to narrow it down." },
  { id: "buying", name: "Buying a car", blurb: "How Oakwood's finance-first buying journey works.", serviceLink: { label: "How it works", href: routes.howItWorks } },
  { id: "finance", name: "Finance", blurb: "Eligibility, the calculator, HP and PCP, deposits and credit history.", serviceLink: { label: "Check my eligibility", href: routes.eligibility } },
  { id: "partex", name: "Part exchange", blurb: "Valuing your car and putting it towards your deposit.", serviceLink: { label: "Value my car", href: routes.sellMyCar } },
  { id: "reservations", name: "Reservations", blurb: "Holding a car for £99, refunds and what happens if plans change.", serviceLink: { label: "Reservation terms", href: routes.reservationTerms } },
  { id: "delivery", name: "Delivery and collection", blurb: "Getting your car from Bury or Chorley, or delivered.", serviceLink: { label: "Delivery and collection", href: routes.deliveryAndCollection } },
  { id: "servicing", name: "Servicing and MOT", blurb: "Booking a service or MOT at Bury or Chorley.", serviceLink: { label: "Book a service or MOT", href: routes.booking } },
  { id: "warranty", name: "Warranty", blurb: "Your 12-month warranty and how to make a claim.", serviceLink: { label: "Start a warranty claim", href: routes.warrantyClaims } },
  { id: "contact", name: "Contact and complaints", blurb: "Reaching the team, opening hours and raising a complaint.", serviceLink: { label: "Contact Oakwood", href: routes.contact } },
];

export const HELP_POPULAR_IDS = ["elig-credit", "res-99", "mot-book"] as const;

export const HELP_FAQS: HelpFaq[] = [
  {
    id: "buy-how",
    topicId: "buying",
    question: "How does buying a car from Oakwood work?",
    answer: "Start with your budget, not the car. Check your finance eligibility, find a car that fits, build your deal, add a part exchange if you have one, reserve the car, complete your purchase, then collect it or have it delivered.",
    link: { label: "See how it works", href: "/how-it-works", verified: false },
  },
  {
    id: "buy-account",
    topicId: "buying",
    question: "Do I need an account to check finance or send a message?",
    answer: "No. You don't need an account to check your finance eligibility or to send us a message.",
    link: { label: "Check my eligibility", href: "/finance-eligibility", verified: true },
  },
  {
    id: "buy-vehicle",
    topicId: "buying",
    question: "What information is on a vehicle page?",
    answer: "Each vehicle page shows the monthly and cash price, specification, location, MOT, provenance notes and the preparation work recorded for that car.",
    link: { label: "Browse used cars", href: "/used-cars", verified: false },
  },
  {
    id: "buy-where",
    topicId: "buying",
    question: "Where can I see the cars?",
    answer: "Our cars are at Oakwood Bury (BL8 1SW) and Oakwood Chorley. Each vehicle page shows which showroom the car is at.",
    link: { label: "Find a showroom", href: "/locations", verified: false },
  },
  {
    id: "elig-credit",
    topicId: "finance",
    group: "Checking eligibility",
    question: "Does checking my eligibility affect my credit score?",
    answer: "No. Checking eligibility uses a soft search, which doesn't affect your credit file. A full finance application, with a harder search, only happens later, when you build a deal on a specific car.",
    link: { label: "Check my eligibility", href: "/finance-eligibility", verified: true },
    needsConfirm: true,
  },
  {
    id: "elig-app",
    topicId: "finance",
    group: "Checking eligibility",
    question: "Is checking eligibility a finance application?",
    answer: "No. Eligibility is a soft search. The regulated application happens later, when you build a deal on a specific vehicle.",
    link: { label: "Car finance explained", href: "/finance.php", verified: false },
  },
  {
    id: "elig-profile",
    topicId: "finance",
    group: "Checking eligibility",
    question: "What is a finance profile?",
    answer: "If your eligibility check is successful, you get a personalised finance profile to use while you browse. Monthly figures are still illustrations; final terms are confirmed in a full application.",
    link: { label: "Car finance explained", href: "/finance.php", verified: false },
  },
  {
    id: "elig-calc",
    topicId: "finance",
    group: "Checking eligibility",
    question: "Can I use the finance calculator without checking eligibility?",
    answer: "Yes. The calculator gives you an estimate for planning. It isn't an eligibility check or a finance application. Check eligibility when you want a personalised finance profile.",
    link: { label: "Open the calculator", href: "/finance.php/calculator", verified: false },
  },
  {
    id: "elig-start",
    topicId: "finance",
    group: "Checking eligibility",
    question: "I'm new to car finance. Where do I start?",
    answer: "Check eligibility first: it's a short set of questions and a soft search. Then browse cars with monthly figures, and use the calculator to try different deposits or terms.",
    link: { label: "Finance for first-time buyers", href: "/finance.php/first-time-buyer", verified: false },
  },
  {
    id: "hp-how",
    topicId: "finance",
    group: "HP and PCP",
    question: "How does HP car finance work?",
    answer: "Hire Purchase (HP) spreads the amount you finance over a fixed term. You own the car once all payments are made. Figures shown before a full application are illustrations.",
    link: { label: "How HP works", href: "/finance.php/hp", verified: false },
  },
  {
    id: "hp-own",
    topicId: "finance",
    group: "HP and PCP",
    question: "Do I own the car with HP?",
    answer: "You own it once all payments under the HP agreement are made. Until then, you're hiring the car with the option to own it at the end.",
    link: { label: "How HP works", href: "/finance.php/hp", verified: false },
  },
  {
    id: "hp-miles",
    topicId: "finance",
    group: "HP and PCP",
    question: "Does HP have a mileage limit?",
    answer: "HP doesn't have the annual mileage limit that PCP has.",
    link: { label: "How HP works", href: "/finance.php/hp", verified: false },
  },
  {
    id: "pcp-how",
    topicId: "finance",
    group: "HP and PCP",
    question: "How does PCP car finance work?",
    answer: "Personal Contract Purchase (PCP) usually has lower monthly payments because an optional final payment is held back until the end of the agreement. Your annual mileage is part of the agreement.",
    link: { label: "How PCP works", href: "/finance.php/pcp", verified: false },
  },
  {
    id: "pcp-end",
    topicId: "finance",
    group: "HP and PCP",
    question: "What happens at the end of a PCP agreement?",
    answer: "There's usually an optional final payment. Your options at the end, such as paying it or returning the car, are set by the lender and confirmed during your application.",
    link: { label: "How PCP works", href: "/finance.php/pcp", verified: false },
    needsConfirm: true,
  },
  {
    id: "pcp-miles",
    topicId: "finance",
    group: "HP and PCP",
    question: "Why does mileage matter on PCP?",
    answer: "Your annual mileage is part of a PCP agreement and affects the monthly figure. You choose a mileage when you select PCP, and the illustration updates as you change it.",
    link: { label: "How PCP works", href: "/finance.php/pcp", verified: false },
  },
  {
    id: "hp-vs-pcp",
    topicId: "finance",
    group: "HP and PCP",
    question: "Should I choose HP or PCP?",
    answer: "Neither is better for everyone. HP is simpler: you own the car at the end and there's no final payment. PCP often has lower monthly payments because of the optional final payment, and includes a mileage limit. Compare both on the car you like.",
    link: { label: "Compare HP and PCP", href: "/finance.php/pcp", verified: false },
  },
  {
    id: "dep-none",
    topicId: "finance",
    group: "Deposits",
    question: "Can I get a car without paying a deposit?",
    answer: "You can start your eligibility check with a £0 deposit, but not every car will be available with no deposit. If the amount to finance is above your profile, you may need to add a deposit or choose a lower-priced car.",
    link: { label: "No-deposit car finance", href: "/finance.php/no-deposit", verified: false },
  },
  {
    id: "dep-monthly",
    topicId: "finance",
    group: "Deposits",
    question: "Does my deposit change my monthly payment?",
    answer: "Yes. Your deposit changes the amount you borrow, which changes the estimated monthly payment and the total payable.",
    link: { label: "Open the calculator", href: "/finance.php/calculator", verified: false },
  },
  {
    id: "dep-large",
    topicId: "finance",
    group: "Deposits",
    question: "Do I need a large deposit?",
    answer: "Not necessarily. You can start from £0. A bigger deposit lowers the amount financed, and some cars may need more deposit if they sit above your finance profile.",
    link: { label: "Finance for first-time buyers", href: "/finance.php/first-time-buyer", verified: false },
  },
  {
    id: "cr-bad",
    topicId: "finance",
    group: "Credit history",
    question: "Can I get car finance with bad credit?",
    answer: "A weaker credit history doesn't automatically rule you out, but finance isn't guaranteed. Check your eligibility to see a personalised finance profile; it's a soft search, not an application.",
    link: { label: "Finance with bad credit", href: "/finance.php/bad-credit", verified: false },
  },
  {
    id: "cr-all",
    topicId: "finance",
    group: "Credit history",
    question: "Do you accept everyone for finance?",
    answer: "No. Acceptance isn't guaranteed. Your circumstances matter, and the lender's decision is confirmed during a full application on a specific car.",
    link: { label: "Finance with bad credit", href: "/finance.php/bad-credit", verified: false },
  },
  {
    id: "cr-ccj",
    topicId: "finance",
    group: "Credit history",
    question: "Can I get car finance with a CCJ?",
    answer: "A CCJ doesn't automatically mean approval or rejection. Check eligibility to see your finance profile; the lender confirms its decision during a full application. We can't share lenders' internal rules or give legal advice about a CCJ.",
    link: { label: "Finance with a CCJ", href: "/finance.php/ccj", verified: false },
  },
  {
    id: "se-can",
    topicId: "finance",
    group: "Self-employed",
    question: "Can I get car finance if I'm self-employed?",
    answer: "Yes, you can check eligibility as a self-employed customer. Finance isn't guaranteed; your circumstances are assessed during eligibility and the full application.",
    link: { label: "Self-employed car finance", href: "/finance.php/self-employed", verified: false },
  },
  {
    id: "se-docs",
    topicId: "finance",
    group: "Self-employed",
    question: "What documents do I need if I'm self-employed?",
    answer: "The eligibility check asks how long you've been self-employed. Any documents the lender needs are confirmed during your full application.",
    link: { label: "Self-employed car finance", href: "/finance.php/self-employed", verified: false },
    needsConfirm: true,
  },
  {
    id: "px-deposit",
    topicId: "partex",
    question: "How does my part-exchange value affect my deposit?",
    answer: "Value the car you want to part-exchange, then put that estimate towards an Oakwood car. Any positive equity can go towards your deposit.",
    link: { label: "Value my car", href: "/sell-my-car", verified: false },
  },
  {
    id: "px-cash",
    topicId: "partex",
    question: "Can my part exchange replace a cash deposit?",
    answer: "Yes. Positive equity from your part exchange can be used instead of, or as well as, a cash deposit.",
    link: { label: "Value my car", href: "/sell-my-car", verified: false },
  },
  {
    id: "px-change",
    topicId: "partex",
    question: "Will my part-exchange valuation change?",
    answer: "The online valuation is an estimate. Your final offer is confirmed after we inspect the car, and it may change.",
    link: { label: "Value my car", href: "/sell-my-car", verified: false },
  },
  {
    id: "res-99",
    topicId: "reservations",
    question: "How does the £99 reservation work?",
    answer: "Pay £99 to hold a car for 48 hours while you complete your purchase. It's fully refundable, and it comes off the purchase price.",
    link: { label: "Reserve a car", href: "/reserve", verified: false },
  },
  {
    id: "res-refund",
    topicId: "reservations",
    question: "Can I get a refund on my reservation?",
    answer: "Yes. Your reservation is fully refundable. Request a refund if you change your mind; the car is released once you submit the request.",
    link: { label: "Reservation terms", href: "/legal/reservation", verified: false },
  },
  {
    id: "res-expire",
    topicId: "reservations",
    question: "What happens when my reservation expires?",
    answer: "After 48 hours the reservation ends and the car becomes available to other buyers again.",
    link: { label: "Reservation terms", href: "/legal/reservation", verified: false },
    needsConfirm: true,
  },
  {
    id: "res-gone",
    topicId: "reservations",
    question: "What if the car I reserved becomes unavailable?",
    answer: "If the car is no longer available, your £99 reservation is refunded.",
    link: { label: "Cancellation and refund terms", href: "/legal/cancellation-refund", verified: false },
  },
  {
    id: "del-options",
    topicId: "delivery",
    question: "Can I collect my car or have it delivered?",
    answer: "You can collect from Oakwood Bury or Oakwood Chorley, from the showroom shown on the vehicle page. If delivery is available for your purchase, we'll confirm where we can deliver and what you need to do on the day.",
    link: { label: "Delivery and collection", href: "/delivery-and-collection", verified: false },
    needsConfirm: true,
  },
  {
    id: "del-bring",
    topicId: "delivery",
    question: "What do I need to bring when I collect my car?",
    answer: "Bring photo identification and any documents we ask for when we confirm your collection appointment.",
    link: { label: "Delivery and collection", href: "/delivery-and-collection", verified: false },
  },
  {
    id: "svc-book",
    topicId: "servicing",
    group: "Servicing",
    question: "How do I book a service?",
    answer: "Request an appointment online or call us. We'll confirm the date and time with you.",
    link: { label: "Book a service", href: "/booking?type=service", verified: true },
  },
  {
    id: "svc-where",
    topicId: "servicing",
    group: "Servicing",
    question: "Where can I have my car serviced?",
    answer: "We service cars at our Bury and Chorley showrooms.",
    link: { label: "Book a service", href: "/booking?type=service", verified: true },
  },
  {
    id: "svc-price",
    topicId: "servicing",
    group: "Servicing",
    question: "How much does a service cost?",
    answer: "We don't publish service prices online yet. We'll confirm the cost when we take your booking.",
    link: { label: "Book a service", href: "/booking?type=service", verified: true },
    needsConfirm: true,
  },
  {
    id: "svc-manu",
    topicId: "servicing",
    group: "Servicing",
    question: "Do you offer manufacturer servicing?",
    answer: "Yes, for Audi, at Bury or Chorley. If you have another make, ask when you book.",
    link: { label: "Audi servicing", href: "/servicing-audi.php", verified: false },
  },
  {
    id: "mot-when",
    topicId: "servicing",
    group: "MOT",
    question: "When does my car need an MOT?",
    answer: "Most cars need their first MOT by the third anniversary of first registration, then every year. This is a UK legal requirement.",
    link: { label: "MOT at Oakwood", href: "/mot", verified: false },
  },
  {
    id: "mot-book",
    topicId: "servicing",
    group: "MOT",
    question: "How do I book an MOT?",
    answer: "Request an MOT online or call us. We'll confirm the appointment with you. MOTs are carried out at Bury and Chorley.",
    link: { label: "Book an MOT", href: "/booking?type=mot", verified: true },
  },
  {
    id: "mot-fail",
    topicId: "servicing",
    group: "MOT",
    question: "What happens if my car fails its MOT?",
    answer: "It may need repairs and a retest before it can be driven, except in limited cases such as driving to a pre-booked repair or retest. If we carried out the test, we'll explain your next steps.",
    link: { label: "MOT at Oakwood", href: "/mot", verified: false },
  },
  {
    id: "war-incl",
    topicId: "warranty",
    question: "Do Oakwood cars come with a warranty?",
    answer: "Yes. Every car we sell comes with a 12-month warranty. Claim details are provided with your car.",
    link: { label: "About our warranty", href: "/warranty", verified: false },
  },
  {
    id: "war-cover",
    topicId: "warranty",
    question: "What does the warranty cover?",
    answer: "Listed mechanical and electrical items during the warranty period. You get the full terms with your car.",
    link: { label: "About our warranty", href: "/warranty", verified: false },
  },
  {
    id: "war-claim",
    topicId: "warranty",
    question: "How do I make a warranty claim?",
    answer: "Start a claim online, or contact us with your vehicle details.",
    link: { label: "Start a warranty claim", href: "/warranty-claims", verified: true },
  },
  {
    id: "war-photos",
    topicId: "warranty",
    question: "Can I send photos of the problem?",
    answer: "Yes. After we receive your claim, we may ask you to send photos of the issue.",
    link: { label: "Start a warranty claim", href: "/warranty-claims", verified: true },
    needsConfirm: true,
  },
  {
    id: "con-hours",
    topicId: "contact",
    question: "How do I contact Oakwood, and when are you open?",
    answer: "Call Bury on 0161 762 1000 or Chorley on 01257 826 530, Monday to Saturday, 09:00 to 18:00. You can also send a message or request a callback at any time.",
    link: { label: "Contact Oakwood", href: "/contact", verified: true },
  },
  {
    id: "con-chat",
    topicId: "contact",
    question: "Do you have live chat?",
    answer: "Not yet. Send us a message or request a callback and we'll get back to you.",
    link: { label: "Request a callback", href: "/booking_enquiry.php", verified: true },
  },
  {
    id: "con-complain",
    topicId: "contact",
    question: "How do I make a complaint?",
    answer: "Use the complaint form or call us. Include enough detail for us to understand what happened, plus your order or reservation reference if you have one. We'll review it and contact you using the details you give.",
    link: { label: "Raise a complaint", href: "/complaints", verified: true },
    needsConfirm: true,
  }
];

export const HELP_CONTACT_CARDS: HelpContactCard[] = [
  {
    id: "call",
    title: "Call a showroom",
    featured: true,
    branches: [
      { name: "Oakwood Bury", phone: "0161 762 1000", telHref: "tel:01617621000", hours: "Mon to Sat, 09:00 to 18:00 · BL8 1SW" },
      { name: "Oakwood Chorley", phone: "01257 826 530", telHref: "tel:01257826530", hours: "Mon to Sat, 09:00 to 18:00 · Lancashire" },
    ],
  },
  {
    id: "message",
    title: "Send us a message",
    body: "Tell us what you need help with and which showroom suits you. No account needed.",
    cta: { label: "Send a message", href: routes.contact },
  },
  {
    id: "callback",
    title: "Request a callback",
    body: "Pick a time that works and we'll ring you back.",
    cta: { label: "Request a callback", href: routes.bookingEnquiry },
  },
  {
    id: "claim",
    title: "Report a problem with your car",
    body: "Bought from us and something's not right? Start a warranty claim with your vehicle details.",
    cta: { label: "Start a claim", href: routes.warrantyClaims },
  },
];

export function countFaqsForTopic(topicId: HelpTopicId): number {
  if (topicId === "all") return HELP_FAQS.length;
  return HELP_FAQS.filter((faq) => faq.topicId === topicId).length;
}

export function filterHelpFaqs(topicId: HelpTopicId, query: string): HelpFaq[] {
  const q = query.trim().toLowerCase();
  return HELP_FAQS.filter((faq) => {
    if (topicId !== "all" && faq.topicId !== topicId) return false;
    if (!q) return true;
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      (faq.group?.toLowerCase().includes(q) ?? false)
    );
  });
}

export function getHelpFaqById(id: string): HelpFaq | undefined {
  return HELP_FAQS.find((faq) => faq.id === id);
}
