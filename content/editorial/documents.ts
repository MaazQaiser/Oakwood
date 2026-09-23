import {
  getBlogPostUrl,
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getFinanceIntentUrl,
  getModelUrl,
  getSearchUrl,
  getValuationUrl,
  routes,
} from "@/config/routes";
import {
  CONTENT_CALCULATOR_CTA_BODY,
  CONTENT_CALCULATOR_CTA_LABEL,
  CONTENT_CALCULATOR_CTA_TITLE,
  CONTENT_FINANCE_CTA_BODY,
  CONTENT_FINANCE_CTA_LABEL,
  CONTENT_FINANCE_CTA_TITLE,
  CONTENT_PX_CTA_BODY,
  CONTENT_PX_CTA_LABEL,
  CONTENT_PX_CTA_TITLE,
  CONTENT_STOCK_CTA_BODY,
  CONTENT_STOCK_CTA_LABEL,
  CONTENT_STOCK_CTA_TITLE,
} from "@/lib/content/copy";
import { getModelsByBodyStyle } from "@/features/content/services/catalog";
import { INDICATIVE_DISCLAIMER } from "@/lib/eligibility/copy";
import { needCategories } from "@/lib/mock/home";
import { statusDisclosureCopy, whatToExpectSections } from "@/lib/trust/content";
import { getMakeName, getModelName } from "@/lib/vehicles/labels";
import type {
  BlogPost,
  ComparisonArticle,
  ContentCta,
  ContentEntry,
  ModelGuide,
} from "@/types/content";
import type { VehicleCategory } from "@/types/vehicle";

export const HATCHBACK_ARTICLE_SLUG =
  "top-10-most-popular-used-hatchbacks-in-the-uk";

const hatchbackSearchHref = getSearchUrl({
  body_style: "hatchback",
  need: "small",
});
const suvSearchHref = getSearchUrl({ body_style: "SUV" });

function financeCta(): ContentCta {
  return {
    kind: "finance",
    title: CONTENT_FINANCE_CTA_TITLE,
    body: CONTENT_FINANCE_CTA_BODY,
    href: getEligibilityUrl(),
    label: CONTENT_FINANCE_CTA_LABEL,
  };
}

function calculatorCta(): ContentCta {
  return {
    kind: "calculator",
    title: CONTENT_CALCULATOR_CTA_TITLE,
    body: CONTENT_CALCULATOR_CTA_BODY,
    href: getFinanceCalculatorUrl(),
    label: CONTENT_CALCULATOR_CTA_LABEL,
  };
}

function pxCta(): ContentCta {
  return {
    kind: "px",
    title: CONTENT_PX_CTA_TITLE,
    body: CONTENT_PX_CTA_BODY,
    href: getValuationUrl(),
    label: CONTENT_PX_CTA_LABEL,
  };
}

function stockCta(
  href: string,
  title = CONTENT_STOCK_CTA_TITLE,
  label = CONTENT_STOCK_CTA_LABEL,
): ContentCta {
  return {
    kind: "stock",
    title,
    body: CONTENT_STOCK_CTA_BODY,
    href,
    label,
  };
}

function modelGuideSlug(makeSlug: string, modelSlug: string): string {
  return `used-${makeSlug}-${modelSlug}`;
}

function createModelGuide(
  makeSlug: string,
  modelSlug: string,
  options?: {
    featured?: boolean;
    relatedSlugs?: string[];
    vehicleCategory?: VehicleCategory;
  },
): ModelGuide {
  const category = options?.vehicleCategory ?? "car";
  const make = getMakeName(makeSlug, category) ?? makeSlug;
  const model = getModelName(makeSlug, modelSlug, category) ?? modelSlug;
  const slug = modelGuideSlug(makeSlug, modelSlug);
  const stockHref = getModelUrl(makeSlug, modelSlug, category === "van" ? "vans" : "cars");
  const title = `Used ${make} ${model} cars`;

  return {
    type: "model-guide",
    slug,
    title,
    description: `See ${make} ${model} cars currently listed by Oakwood, then check eligibility or open a live vehicle page for that car’s specification.`,
    category: "Model guide",
    status: "published",
    featured: options?.featured,
    makeSlug,
    modelSlug,
    vehicleCategory: category,
    body: [
      {
        type: "heading",
        level: 2,
        id: "overview",
        text: "Model overview",
      },
      {
        type: "paragraph",
        text: `This guide is for researching used ${make} ${model} cars before you open live Oakwood stock. It does not replace the specification, history or finance figures shown on each vehicle page.`,
      },
      {
        type: "heading",
        level: 2,
        id: "consider",
        text: "What to consider",
      },
      {
        type: "paragraph",
        text: whatToExpectSections[1]?.body ??
          "Each vehicle page lists monthly and cash price, specification, location, MOT, provenance notes and the preparation work recorded for that car.",
      },
      {
        type: "list",
        items: [
          "Check the individual vehicle page for that car’s year, mileage, fuel type, transmission and location.",
          "Monthly figures on listings are illustrations until a full application.",
          "If a finance profile is already active, Oakwood can show personalised monthly figures on stock pages.",
        ],
      },
    ],
    relatedSlugs: options?.relatedSlugs ?? [
      HATCHBACK_ARTICLE_SLUG,
      "hatchbacks-and-suvs",
    ],
    relatedLinks: [
      { href: stockHref, label: `View ${model} cars` },
      { href: hatchbackSearchHref, label: "Used hatchbacks" },
      { href: routes.usedCars, label: "Used cars" },
      { href: getEligibilityUrl(), label: "Finance eligibility" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
      { href: getValuationUrl(), label: "Part exchange" },
    ],
    ctas: [
      stockCta(stockHref, `Looking for a ${make} ${model}?`, `View ${model} cars`),
      financeCta(),
      pxCta(),
    ],
    faqs: [
      {
        question: `How do I view available ${model} cars?`,
        answer: `Open the used ${make} ${model} listings. Each vehicle page shows that car’s specification, history notes and finance illustration.`,
      },
      {
        question: "Can I check finance before I choose a car?",
        answer: CONTENT_FINANCE_CTA_BODY,
      },
      {
        question: `What if Oakwood has no ${model} in stock?`,
        answer: "This guide will point you to similar cars from current listings, or you can browse the full used-car range.",
      },
    ],
    seo: {
      title,
      description: `Research used ${make} ${model} cars at Oakwood. View current listings, then continue to finance eligibility or a vehicle page.`,
      canonicalPath: getBlogPostUrl(slug),
      indexable: true,
    },
    missing: [
      `Approved ${make} ${model} model-guide narrative beyond live listing facts.`,
    ],
  };
}

const hatchbackGuides: ModelGuide[] = [
  createModelGuide("audi", "a3", { featured: true }),
  createModelGuide("volkswagen", "golf", { featured: true }),
  createModelGuide("volkswagen", "polo"),
  createModelGuide("ford", "focus"),
  createModelGuide("vauxhall", "corsa"),
  createModelGuide("bmw", "1-series"),
  createModelGuide("toyota", "yaris"),
  createModelGuide("mini", "cooper"),
  createModelGuide("mercedes-benz", "a-class"),
];

const suvGuide = createModelGuide("nissan", "qashqai", {
  relatedSlugs: ["hatchbacks-and-suvs", HATCHBACK_ARTICLE_SLUG],
});

const hatchbackNeed = needCategories.find((item) => item.id === "small");
const suvNeed = needCategories.find((item) => item.id === "suv");

export const hatchbackArticle: BlogPost = {
  type: "article",
  slug: HATCHBACK_ARTICLE_SLUG,
  title: "Top 10 most popular used hatchbacks in the UK",
  description:
    "Research used hatchbacks at Oakwood: models currently listed, what to check on a vehicle page, and how to continue into search, finance eligibility and part exchange.",
  category: "Used cars",
  status: "published",
  featured: true,
  body: [
    {
      type: "heading",
      level: 2,
      id: "about-this-guide",
      text: "About this guide",
    },
    {
      type: "paragraph",
      text: "This page is for customers comparing used hatchbacks, including searches such as best used hatchbacks, top 10 hatchbacks and best hatchbacks.",
    },
    {
      type: "paragraph",
      text: "Oakwood has not supplied a ranked UK popularity list. This page does not invent a top 10, sales-chart positions, or “best” scores.",
    },
    {
      type: "heading",
      level: 2,
      id: "used-hatchbacks",
      text: "Used hatchbacks",
    },
    {
      type: "paragraph",
      spans: [
        {
          text: hatchbackNeed?.description
            ? `On Oakwood search, small cars are described as: “${hatchbackNeed.description}” `
            : "Hatchbacks are grouped with small cars in Oakwood search. ",
        },
        { text: "View used hatchbacks currently listed.", href: hatchbackSearchHref },
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "models-currently-listed",
      text: "Hatchback models currently listed",
    },
    {
      type: "paragraph",
      text: "These are hatchback models Oakwood currently lists. The order is alphabetical. It is not a popularity ranking.",
    },
    {
      type: "linkList",
      items: getModelsByBodyStyle("hatchback").map((item) => {
        const slug = modelGuideSlug(item.makeSlug, item.modelSlug);
        const hasGuide = hatchbackGuides.some(
          (guide) =>
            guide.makeSlug === item.makeSlug && guide.modelSlug === item.modelSlug,
        );

        return {
          text: `${item.make} ${item.model}`,
          href: hasGuide
            ? getBlogPostUrl(slug)
            : getModelUrl(item.makeSlug, item.modelSlug, "cars"),
        };
      }),
    },
    {
      type: "paragraph",
      text: "Open a model guide for current listing facts, or open live stock for that model. Specification belongs on the vehicle page.",
    },
    {
      type: "heading",
      level: 2,
      id: "what-to-check",
      text: "What to check on a used hatchback",
    },
    {
      type: "paragraph",
      text: whatToExpectSections[1]?.body ??
        "Each vehicle page lists monthly and cash price, specification, location, MOT, provenance notes and the preparation work recorded for that car.",
    },
    {
      type: "list",
      items: [
        "Fuel type, transmission, year and mileage as listed on that car.",
        "Location — Bury, Chorley or another listed stock location.",
        "MOT, provenance and preparation notes on the vehicle page.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "finance",
      text: "Finance",
    },
    {
      type: "paragraph",
      text: INDICATIVE_DISCLAIMER,
    },
    {
      type: "paragraph",
      spans: [
        { text: `${statusDisclosureCopy.description} ` },
        { text: "Status disclosure", href: routes.statusDisclosure },
        { text: "." },
      ],
    },
    {
      type: "paragraph",
      spans: [
        { text: "Check eligibility" , href: getEligibilityUrl() },
        { text: " with a soft search, or use the " },
        { text: "finance calculator", href: getFinanceCalculatorUrl() },
        { text: " for an estimate. You can also read " },
        { text: "how HP works", href: getFinanceIntentUrl("hp") },
        { text: " and " },
        { text: "how PCP works", href: getFinanceIntentUrl("pcp") },
        { text: "." },
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "next-step",
      text: "Continue to live stock",
    },
    {
      type: "paragraph",
      spans: [
        { text: "View used hatchbacks", href: hatchbackSearchHref },
        { text: ", or browse all " },
        { text: "used cars", href: routes.usedCars },
        { text: "." },
      ],
    },
  ],
  relatedSlugs: [
    "hatchbacks-and-suvs",
    modelGuideSlug("volkswagen", "golf"),
    modelGuideSlug("audi", "a3"),
    modelGuideSlug("vauxhall", "corsa"),
  ],
  relatedLinks: [
    { href: hatchbackSearchHref, label: "Used hatchbacks" },
    { href: routes.usedCars, label: "Used cars" },
    { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
    { href: getEligibilityUrl(), label: "Finance eligibility" },
    { href: getValuationUrl(), label: "Part exchange" },
    { href: routes.aftersales, label: "Aftersales" },
    { href: routes.locations, label: "Locations" },
  ],
  ctas: [
    stockCta(hatchbackSearchHref, "Looking for a used hatchback?", "View used hatchbacks"),
    financeCta(),
    calculatorCta(),
    pxCta(),
  ],
  seo: {
    title: "Top 10 most popular used hatchbacks in the UK",
    description:
      "Research used hatchbacks at Oakwood. See models currently listed, what to check on a vehicle page, and continue to search, eligibility or part exchange. A ranked UK top 10 has not been supplied.",
    canonicalPath: getBlogPostUrl(HATCHBACK_ARTICLE_SLUG),
    indexable: true,
  },
  missing: [
    "Approved ranked “top 10 most popular used hatchbacks in the UK” article body, including popularity source, ranking criteria, and any claimed specifications.",
  ],
};

export const hatchbackSuvComparison: ComparisonArticle = {
  type: "comparison",
  slug: "hatchbacks-and-suvs",
  title: "Hatchbacks and SUVs",
  description:
    "A side-by-side look at hatchbacks and SUVs using Oakwood’s published search descriptions and facts from current listings. This page does not pick a winner.",
  category: "Comparison",
  status: "published",
  body: [
    {
      type: "heading",
      level: 2,
      id: "how-to-use",
      text: "How to use this comparison",
    },
    {
      type: "paragraph",
      text: "Use this page to decide which body type to browse. It does not rank vehicles and it does not invent boot space, running costs or “best for” claims beyond copy already used on Oakwood search.",
    },
    {
      type: "heading",
      level: 2,
      id: "search-descriptions",
      text: "How Oakwood describes these cars",
    },
    {
      type: "paragraph",
      text: hatchbackNeed
        ? `${hatchbackNeed.title}: ${hatchbackNeed.description}`
        : "Small cars are grouped with hatchbacks in Oakwood search.",
    },
    {
      type: "paragraph",
      text: suvNeed
        ? `${suvNeed.title}: ${suvNeed.description}`
        : "SUVs are listed as a body type in Oakwood search.",
    },
    {
      type: "heading",
      level: 2,
      id: "next",
      text: "Browse live stock",
    },
    {
      type: "paragraph",
      spans: [
        { text: "View used hatchbacks", href: hatchbackSearchHref },
        { text: " or " },
        { text: "view SUVs", href: suvSearchHref },
        { text: ". Open a vehicle page for that car’s specification." },
      ],
    },
  ],
  table: {
    caption:
      "How Oakwood search describes these body types. Listing attributes such as fuel and transmission are shown separately from current stock.",
    headers: ["", "Hatchback", "SUV"],
    rows: [
      ["Body type", "Hatchback", "SUV"],
      [
        "Typical use on Oakwood search",
        hatchbackNeed?.description ?? "",
        suvNeed?.description ?? "",
      ],
      ["Boot space", "", ""],
    ],
  },
  declareWinner: false,
  relatedSlugs: [
    HATCHBACK_ARTICLE_SLUG,
    modelGuideSlug("volkswagen", "golf"),
    modelGuideSlug("nissan", "qashqai"),
  ],
  relatedLinks: [
    { href: hatchbackSearchHref, label: "Used hatchbacks" },
    { href: suvSearchHref, label: "Used SUVs" },
    { href: routes.usedCars, label: "Used cars" },
    { href: getEligibilityUrl(), label: "Finance eligibility" },
    { href: getFinanceIntentUrl("hp"), label: "How HP works" },
    { href: getFinanceIntentUrl("pcp"), label: "How PCP works" },
  ],
  ctas: [
    stockCta(hatchbackSearchHref, "Looking for a hatchback?", "View used hatchbacks"),
    {
      kind: "stock",
      title: "Looking for an SUV?",
      body: CONTENT_STOCK_CTA_BODY,
      href: suvSearchHref,
      label: "View SUVs",
    },
    financeCta(),
    pxCta(),
  ],
  seo: {
    title: "Hatchbacks and SUVs",
    description:
      "Compare hatchbacks and SUVs using Oakwood search descriptions and current listing attributes. No winner is declared.",
    canonicalPath: getBlogPostUrl("hatchbacks-and-suvs"),
    indexable: true,
  },
  missing: [
    "Approved boot-space, running-cost and editorial “best for” comparison values.",
  ],
};

export const contentEntries: ContentEntry[] = [
  hatchbackArticle,
  hatchbackSuvComparison,
  ...hatchbackGuides,
  suvGuide,
];
