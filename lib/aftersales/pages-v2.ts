import { getBookingUrl, routes } from "@/config/routes";
import type { AftersalesFaqItem } from "@/types/aftersales";

export const WARRANTY_V2 = {
  eyebrow: "AA Warranty from Oakwood",
  title: "Drive away covered.",
  description:
    "Every car we sell is covered from day one. Want more peace of mind? Choose the AA Warranty cover that suits your car and the way you drive.",
  bullets: [
    "Hire car and recovery at every level",
    "Repairs carried out through the Oakwood garage",
    "Dedicated AA Warranty claims line",
  ],
  includedPill: "6-month warranty included with every Oakwood car",
  upgradeLine: "Or upgrade to AA Warranty cover",
  tiers: [
    {
      id: "lite-plus",
      name: "Protect Lite Plus",
      bars: 1,
      badge: null as string | null,
      bullets: [
        "Covers almost all mechanical and electrical parts",
        "Hire car and recovery included",
        "European cover for 30 days",
      ],
      bestFor: "Best for everyday cover on a budget",
    },
    {
      id: "essential",
      name: "Protect Essential",
      bars: 2,
      badge: null as string | null,
      bullets: [
        "Higher claim limits than Lite Plus",
        "Fewer exclusions on covered parts",
        "Key fobs and in-car entertainment included",
      ],
      bestFor: "Best for most drivers",
    },
    {
      id: "plus",
      name: "Protect Plus",
      bars: 3,
      badge: "Most complete cover",
      bullets: [
        "Highest claim limits and fewest exclusions",
        "Hybrid and electric drive parts included",
        "European cover for 60 days",
      ],
      bestFor: "Best for long-term peace of mind",
    },
  ],
  compareRows: [
    {
      label: "Claim limit per repair",
      values: ["£500 or £1,000", "£500 to £5,000", "Confirm"],
      highlight: [false, false, true],
    },
    {
      label: "Almost all mechanical and electrical parts",
      values: ["Yes", "Fewer exclusions", "Fewest exclusions"],
      highlight: [false, false, false],
    },
    { label: "Hire car", values: ["Yes", "Yes", "Yes"], highlight: [false, false, false] },
    {
      label: "Vehicle recovery",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "Overnight stay or rail fare",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "European cover",
      values: ["30 days", "30 days", "60 days"],
      highlight: [false, false, false],
    },
    {
      label: "Key fobs",
      values: ["£100", "£200", "£200"],
      highlight: [false, false, false],
    },
    {
      label: "In-car entertainment and sat nav",
      values: ["£200", "£500", "Within claim limit"],
      highlight: [false, false, false],
    },
    {
      label: "Diagnosis costs",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "Superchargers",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "Hybrid and electric drive parts",
      values: ["Not listed", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "Catalytic converter and DPF",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    { label: "Oil seals", values: ["Yes", "Yes", "Yes"], highlight: [false, false, false] },
    {
      label: "12V battery (first 6 months)",
      values: ["Yes", "Yes", "Yes"],
      highlight: [false, false, false],
    },
    {
      label: "Wear and tear",
      values: ["Up to 85,000 miles", "Up to 85,000 miles", "Up to 85,000 miles"],
      highlight: [false, false, false],
    },
  ] as const,
  compareFootnote:
    "Cover levels and limits are set by AA Warranty. Highlighted items need confirming with the AA before launch. Exact terms are in the AA Warranty booklet supplied with your car.",
  claimSteps: [
    {
      title: "Report the fault",
      body: "Contact AA Warranty within 7 days via aaclaim.opteven.co.uk or call 0345 222 4544.",
    },
    {
      title: "Repair authorised",
      body: "AA Warranty reviews the claim and authorises the repair through Oakwood.",
    },
    {
      title: "Your car is fixed",
      body: "Work is carried out at the Oakwood garage and you're back on the road.",
    },
  ],
  exclusions: [
    "Routine servicing and consumables",
    "Bodywork, paint and glass",
    "Tyres and wheels",
    "Damage from accidents or misuse",
    "Pre-existing faults",
    "Modifications not approved by the manufacturer",
    "Negligence or lack of maintenance",
    "Items listed as excluded in the AA Warranty booklet",
  ],
  exclusionsNote:
    "Keep your car serviced on time. Missed services can affect a warranty claim.",
  ctaTitle: "Not sure which level is right?",
  ctaBody:
    "Speak to the team at Bury or Chorley and we'll talk you through the cover that fits your car.",
};

export const SERVICE_V2 = {
  usp: "Trusted by Thousands for Over 25 Years",
  eyebrow: "Servicing and repairs",
  title: "Servicing and repairs, done properly",
  description:
    "VAG and German brand specialists in Bury and Chorley. All makes welcome.",
  bullets: [
    "Manufacturer-data diagnostics",
    "Dealer-standard technicians",
    "Workshops in Bury and Chorley",
  ],
  serviceCards: [
    {
      title: "Vehicle servicing",
      body: "Scheduled services that keep your car reliable and its history intact.",
      href: getBookingUrl({ type: "service", source: "service" }),
    },
    {
      title: "Electric car servicing",
      body: "EV and hybrid checks by technicians trained for high-voltage systems.",
      href: getBookingUrl({ type: "service", source: "service" }),
    },
    {
      title: "Diagnostics",
      body: "Find the fault first — clear answers before any work starts.",
      href: getBookingUrl({ type: "service", source: "service" }),
    },
    {
      title: "Repairs",
      body: "Mechanical and electrical repairs, carried out in our own workshops.",
      href: getBookingUrl({ type: "service", source: "service" }),
    },
    {
      title: "Tyres and wheel alignment",
      body: "Fitted and balanced on site, with alignment when you need it.",
      href: getBookingUrl({ type: "service", source: "service" }),
    },
    {
      title: "MOT testing",
      body: "DVSA-approved tests in Bury and Chorley — book early and keep your date.",
      href: routes.mot,
    },
  ],
  vagIntro:
    "Oakwood is a Volkswagen Group specialist workshop. We service and repair Volkswagen, Audi, ŠKODA, SEAT, CUPRA, Porsche and Volkswagen Commercial Vehicles with manufacturer technical data.",
  vagCallout:
    "VAG is short for Volkswagen Aktiengesellschaft — the Volkswagen Group of brands.",
  vagBrands: [
    { name: "Volkswagen", logo: "/images/brand-logos/volkswagen.png", tag: null },
    { name: "Audi", logo: "/images/brand-logos/audi.png", tag: null },
    { name: "ŠKODA", logo: "/images/brand-logos/skoda.svg", tag: null },
    { name: "SEAT", logo: "/images/brand-logos/seat.svg", tag: null },
    { name: "CUPRA", logo: "/images/brand-logos/cupra.svg", tag: null },
    { name: "Porsche", logo: "/images/brand-logos/porsche.svg", tag: null },
    {
      name: "Volkswagen Commercial Vehicles",
      logo: "/images/brand-logos/volkswagen.png",
      tag: "Vans",
    },
  ],
  germanIntro:
    "Technicians trained to dealership standards, with manufacturer technical data for every premium German make below. We also offer Audi manufacturer servicing.",
  germanBrands: [
    { name: "Audi", logo: "/images/brand-logos/audi.png", vag: true },
    { name: "BMW", logo: "/images/brand-logos/bmw.png", vag: false },
    { name: "Mercedes-Benz", logo: "/images/brand-logos/mercedes.png", vag: false },
    { name: "Porsche", logo: "/images/brand-logos/porsche.svg", vag: true },
    { name: "Volkswagen", logo: "/images/brand-logos/volkswagen.png", vag: true },
  ],
};

export const SERVICE_V2_FAQS: AftersalesFaqItem[] = [
  {
    question: "How do I book a service?",
    answer:
      "Use Book a service on this page, choose Bury or Chorley, and tell us your registration and the work you need. We'll confirm the appointment with you.",
  },
  {
    question: "Where can I have my car serviced?",
    answer:
      "Oakwood workshops are in Bury and Chorley. Bury is our VAG specialist workshop; both sites service all makes.",
  },
  {
    question: "How much does a service cost?",
    answer:
      "Prices depend on the make, model and the work required. We'll confirm the cost when we take your booking.",
  },
  {
    question: "When is my car's service due?",
    answer:
      "Check your handbook or service book for the interval. If you're unsure, bring the car in and we'll advise based on age, mileage and condition.",
  },
  {
    question: "Do you service cars that aren't Volkswagen Group makes?",
    answer:
      "Yes. We MOT, service and repair all makes and models, with specialist focus on Volkswagen Group and German brands.",
  },
];

export const MOT_V2 = {
  eyebrow: "MOT testing",
  title: "Quick, thorough MOTs in Bury and Chorley.",
  description:
    "A DVSA-approved test, with clear results and straight answers if anything needs fixing.",
  bullets: [
    "DVSA-approved test centre",
    "Book up to a month early",
    "Bury and Chorley",
  ],
  factCards: [
    {
      title: "Price",
      highlight: "Confirmed when you book",
      body: "The legal maximum for a car MOT is £54.85.",
    },
    {
      title: "When it's due",
      highlight: null as string | null,
      body: "First MOT by the car's third birthday, then every year. Book up to a month (minus a day) early and keep the same renewal date.",
    },
    {
      title: "If it fails",
      highlight: null as string | null,
      body: "We'll explain what needs fixing. Leave it with us for repairs and the retest within 10 working days is free.",
    },
  ],
  coversNote:
    "An MOT doesn't check the condition of the engine, clutch or gearbox. That's what a service is for.",
  checks: [
    "Lights, signalling and electrical equipment",
    "Brakes, steering and suspension",
    "Tyres, wheels and visible structure",
    "Visibility, wipers and washers",
    "Emissions and other items required by the test",
  ],
  results: [
    {
      label: "Dangerous",
      outcome: "Fail",
      tone: "fail" as const,
      body: "Don't drive it until it's repaired.",
    },
    {
      label: "Major",
      outcome: "Fail",
      tone: "fail" as const,
      body: "Must be repaired before it can pass.",
    },
    {
      label: "Minor",
      outcome: "Pass",
      tone: "pass-warn" as const,
      body: "Repair as soon as possible.",
    },
    {
      label: "Advisory",
      outcome: "Pass",
      tone: "pass" as const,
      body: "Keep an eye on it; may need work later.",
    },
  ],
  fines: [
    {
      title: "Up to £1,000 fine",
      body: "for driving without a valid MOT",
    },
    {
      title: "Up to £2,500 fine, a ban and 3 points",
      body: "for driving with a dangerous problem",
    },
  ],
  finesSource: "Source: GOV.UK, Getting an MOT.",
  motHistoryUrl: "https://www.gov.uk/check-mot-history",
};

export const MOT_V2_FAQS: AftersalesFaqItem[] = [
  {
    question: "How do I book an MOT?",
    answer:
      "Use Book an MOT on this page, choose Bury or Chorley, and we'll confirm the appointment with you.",
  },
  {
    question: "Can I get my MOT done early?",
    answer:
      "Yes. You can book up to a month (minus a day) early and keep the same renewal date.",
  },
  {
    question: "What happens if my car fails?",
    answer:
      "We'll explain what needs fixing. If you leave it with us for repairs, a retest within 10 working days is free.",
  },
  {
    question: "Can I drive to my MOT if it has expired?",
    answer:
      "Only if you're driving to a pre-booked MOT and the car is roadworthy. Driving with a dangerous fault can mean a fine, ban and points.",
  },
  {
    question: "How do I check when my MOT is due?",
    answer:
      "Use the GOV.UK MOT history service with your registration, or ask us when you book.",
  },
];
