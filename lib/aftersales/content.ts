import { getBookingUrl, routes } from "@/config/routes";
import type { AftersalesFaqItem, AftersalesPageCopy } from "@/types/aftersales";

export const aftersalesHubCopy: AftersalesPageCopy = {
  eyebrow: "Aftersales",
  title: "Keep your car running at its best",
  description: "Book servicing, MOTs and support with Oakwood.",
  metaTitle: "Aftersales",
  metaDescription:
    "Book servicing, MOTs and warranty support with Oakwood Motor Company in Bury and Chorley.",
};

export const servicePageCopy: AftersalesPageCopy = {
  eyebrow: "Servicing",
  title: "Servicing at Oakwood",
  description:
    "Book a service at Oakwood in Bury or Chorley. We'll confirm the work needed for your vehicle.",
  metaTitle: "Car servicing",
  metaDescription:
    "Book car servicing with Oakwood Motor Company in Bury and Chorley. Manufacturer servicing is available for Audi.",
};

export const audiServiceCopy: AftersalesPageCopy = {
  eyebrow: "Manufacturer servicing",
  title: "Servicing Audi",
  description:
    "Book Audi servicing with Oakwood Motor Company. We'll take your request for Bury or Chorley and confirm the appointment with you.",
  metaTitle: "Servicing Audi",
  metaDescription:
    "Audi servicing with Oakwood Motor Company. Book a service at Bury or Chorley.",
};

export const motPageCopy: AftersalesPageCopy = {
  eyebrow: "MOT",
  title: "MOT testing at Oakwood",
  description:
    "Book an MOT at Oakwood in Bury or Chorley. We'll take your request and confirm the appointment.",
  metaTitle: "MOT",
  metaDescription:
    "Book an MOT with Oakwood Motor Company in Bury or Chorley. Find out what an MOT checks and what happens if a vehicle fails.",
};

export const warrantyPageCopy: AftersalesPageCopy = {
  eyebrow: "Warranty",
  title: "Oakwood warranty",
  description:
    "Available cars include a 12-month warranty. Claim details are listed with the vehicle.",
  metaTitle: "Warranty",
  metaDescription:
    "Learn how Oakwood's 12-month vehicle warranty works, what to expect, and how to make a claim.",
};

export const aftersalesServices = [
  {
    key: "service" as const,
    title: "Service",
    copy: "Book a service for your car at Bury or Chorley.",
    href: routes.service,
    cta: "View servicing",
  },
  {
    key: "mot" as const,
    title: "MOT",
    copy: "Book an MOT and find out what the test covers.",
    href: routes.mot,
    cta: "View MOT",
  },
  {
    key: "warranty" as const,
    title: "Warranty",
    copy: "See how Oakwood warranty cover works on available cars.",
    href: routes.warranty,
    cta: "View warranty",
  },
  {
    key: "warranty-claims" as const,
    title: "Warranty claims",
    copy: "Tell us about a problem and we'll review your claim request.",
    href: routes.warrantyClaims,
    cta: "Make a claim",
  },
  {
    key: "booking" as const,
    title: "Service booking",
    copy: "Request a service or MOT appointment with Oakwood.",
    href: getBookingUrl({ source: "aftersales" }),
    cta: "Book now",
  },
];

export const serviceOverview = [
  {
    title: "Service overview",
    body: "Oakwood services customer vehicles at our Bury and Chorley locations. Tell us your registration and the work you need, and we'll confirm the appointment with you.",
  },
  {
    title: "Why service your vehicle",
    body: "Regular servicing helps keep a car in good working order, maintains a service record, and is a chance to raise anything that needs attention before it becomes a bigger problem.",
  },
];

export const serviceIncludedStatus = {
  title: "What is included",
  body: "A full list of service inclusions is not published here until the aftersales content source is connected. Oakwood will confirm what your vehicle needs when we take your booking request.",
  pending: true,
} as const;

export const serviceIntervalsStatus = {
  title: "Service intervals",
  body: "Manufacturer service intervals are not published here until the aftersales content source is connected. Use your vehicle handbook, or ask Oakwood when you book.",
  pending: true,
} as const;

export const servicePricingStatus = {
  title: "Pricing",
  body: "Starting prices are not published here. Oakwood will confirm any cost when we take your booking request.",
  pending: true,
} as const;

export const manufacturerServicing = {
  title: "Manufacturer-specific servicing",
  body: "Oakwood publishes manufacturer servicing for Audi. Other manufacturer schedules are not listed until the aftersales content source is connected.",
  href: routes.servicingAudi,
  cta: "Audi servicing",
} as const;

export const audiManufacturerCopy = {
  title: "Audi servicing",
  body: "This page is Oakwood's Audi servicing destination. Book a service and we'll confirm the work for your Audi at Bury or Chorley. Audi-specific schedules and prices are not listed until the aftersales content source is connected.",
};

export const motChecks = [
  "Lights, signalling and electrical equipment",
  "Brakes, steering and suspension",
  "Tyres, wheels and visible structure",
  "Visibility, wipers and washers",
  "Emissions and other items required by the MOT test",
];

export const motWhenRequired =
  "Most cars need an MOT by the third anniversary of first registration, then every year. This is a UK legal requirement, not an Oakwood policy.";

export const motFailCopy =
  "If a vehicle fails its MOT, it may need repair and a retest before it can be used on the road, except in limited circumstances such as travelling to a pre-arranged repair or retest. Oakwood will explain the next step if we carry out the test.";

export const warrantyCoverage = {
  summary: "Available cars include a 12-month warranty.",
  expect:
    "Cover is for listed mechanical and electrical items during the warranty period. Work is carried out through Oakwood or an authorised repairer.",
  howToUse:
    "Contact Oakwood with your vehicle details and we will explain the next step. You can also start a warranty claim request online.",
  covered: [
    "Cover for listed mechanical and electrical items during the warranty period.",
    "Work carried out through Oakwood or an authorised repairer.",
  ],
  notPublished:
    "A full list of what is and isn't covered is provided with the vehicle. It is not reproduced here until the warranty engine is connected.",
};

export const serviceFaqs: AftersalesFaqItem[] = [
  {
    question: "How do I book a service?",
    answer:
      "Request an appointment online or call Oakwood. We'll confirm the date and time with you.",
  },
  {
    question: "Where can I have my car serviced?",
    answer: "Oakwood services vehicles at Bury and Chorley.",
  },
  {
    question: "Do you publish service prices online?",
    answer:
      "Starting prices are not published here. We'll confirm any cost when we take your booking request.",
  },
  {
    question: "Do you offer manufacturer servicing?",
    answer:
      "Oakwood publishes manufacturer servicing for Audi. Ask us when you book if you need servicing for another make.",
  },
];

export const audiServiceFaqs: AftersalesFaqItem[] = [
  {
    question: "Can Oakwood service my Audi?",
    answer:
      "Yes. Use this page to request Audi servicing at Bury or Chorley. We'll confirm the appointment with you.",
  },
  ...serviceFaqs,
];

export const motFaqs: AftersalesFaqItem[] = [
  {
    question: "How do I book an MOT?",
    answer:
      "Request an MOT online or call Oakwood. We'll confirm the appointment with you.",
  },
  {
    question: "When does my car need an MOT?",
    answer: motWhenRequired,
  },
  {
    question: "What happens if my car fails?",
    answer: motFailCopy,
  },
  {
    question: "Where are MOTs carried out?",
    answer: "Oakwood takes MOT booking requests for Bury and Chorley.",
  },
];

export const warrantyFaqs: AftersalesFaqItem[] = [
  {
    question: "Do Oakwood cars include a warranty?",
    answer:
      "Available cars include a 12-month warranty. Claim details are listed with the vehicle.",
  },
  {
    question: "What does the warranty cover?",
    answer:
      "Cover is for listed mechanical and electrical items during the warranty period. The full terms are provided with the vehicle.",
  },
  {
    question: "How do I make a claim?",
    answer:
      "Start a warranty claim request online, or contact Oakwood with your vehicle details.",
  },
  {
    question: "Can I upload photos of the issue?",
    answer:
      "Supporting images are not collected online until the warranty engine is connected. Oakwood can ask for photos after we receive your request.",
  },
];

export const bookingNextSteps = [
  "We'll review your request for the location you chose.",
  "Oakwood will contact you to confirm the appointment.",
  "Bring any service history you have on the day.",
];

export const bookingInstructions =
  "This confirms we have received your booking request. Live diary confirmation is not connected yet, so the date and time remain a preference until Oakwood confirms them.";

export const claimNextSteps = [
  "We'll review the details you sent.",
  "Oakwood will contact you about the next step.",
  "Keep any documents that came with the vehicle.",
];
