/**
 * Finance intent page content.
 *
 * This is the CMS-shaped source until Sanity (or equivalent) is connected.
 * Do not put lender criteria, APRs, approval rates or guaranteed outcomes here.
 */

import {
  getEligibilityUrl,
  getFinanceCalculatorUrl,
  getFinanceIntentUrl,
  getUsedCarsUrl,
  getUsedVansUrl,
  routes,
} from "@/config/routes";
import type {
  FinanceComparisonRow,
  FinanceFaqItem,
  FinanceHubContent,
  FinanceIntentPageContent,
  FinanceRelatedLink,
} from "@/types/finance-intent";
import type { FinanceIntentSlug } from "@/types/finance";

function related(
  items: Array<{ href: string; label: string }>,
): FinanceRelatedLink[] {
  return items;
}

export const financeHubContent: FinanceHubContent = {
  eyebrow: "Car finance",
  h1: "Understand finance, then check what may be available",
  intro:
    "Oakwood is finance-first. Learn how deposits, monthly payments and finance types work, then check eligibility for a personalised profile. A regulated finance application happens later, when you build a deal on a specific vehicle.",
  metaTitle: "Car finance",
  metaDescription:
    "Understand HP, PCP, deposits and eligibility at Oakwood. Check your finance profile with a soft search, then browse used cars and vans.",
  journeyTitle: "How finance works at Oakwood",
  guidesTitle: "Finance guides",
};

export const financeJourneySteps = [
  {
    title: "Understand finance",
    body: "Read how deposits, terms, HP and PCP affect an estimated monthly payment. Use the calculator if you want to try figures.",
  },
  {
    title: "Check eligibility",
    body: "Answer a short set of questions. Oakwood uses a soft search, so this will not affect your credit score. It is not a finance application.",
  },
  {
    title: "Receive a finance profile",
    body: "If eligibility is successful, you get a personalised finance profile you can use while you browse. It is not a guaranteed final rate.",
  },
  {
    title: "Browse cars",
    body: "See monthly figures first. If a car is outside your current profile, you can increase the deposit, choose a lower-priced vehicle, or contact Oakwood.",
  },
  {
    title: "Build a deal",
    body: "Configure finance, part exchange and optional products on a specific vehicle. A regulated application is confirmed during that later step.",
  },
] as const;

export const hpPcpComparison: FinanceComparisonRow[] = [
  {
    label: "Monthly payment",
    hp: "The amount financed is spread across the term.",
    pcp: "Often lower because an optional final payment is held back until the end.",
  },
  {
    label: "Final payment",
    hp: "There is no optional balloon payment on HP.",
    pcp: "An optional final payment is usually due at the end of the agreement.",
  },
  {
    label: "Mileage",
    hp: "HP does not use a PCP-style annual mileage choice.",
    pcp: "Annual mileage is part of a PCP agreement and can change the illustration.",
  },
  {
    label: "Ownership",
    hp: "You own the vehicle once all payments are made.",
    pcp: "What you can do at the end is confirmed with the finance provider during application.",
  },
  {
    label: "Total payable",
    hp: "Shown with the monthly figure so you can see the overall cost of the illustration.",
    pcp: "Includes monthly payments, deposit and any optional final payment shown on the illustration.",
  },
];

const pages: Record<FinanceIntentSlug, FinanceIntentPageContent> = {
  "bad-credit": {
    slug: "bad-credit",
    eyebrow: "Finance",
    h1: "Car finance with bad credit",
    intro:
      "A less-than-perfect credit history does not automatically mean there are no options. Oakwood starts with eligibility, not a full application, so you can see a personalised finance profile before you choose a car.",
    metaTitle: "Car finance with bad credit",
    metaDescription:
      "Understand car finance if your credit history is not perfect. Check Oakwood eligibility with a soft search, then browse cars that fit your profile.",
    whatThisMeans: {
      title: "What people mean by bad credit",
      paragraphs: [
        "Customers often use “bad credit” to describe missed payments, a thin credit file, or other marks on their credit history. It is a general phrase, not a lender decision.",
        "Credit history is one of the things a finance provider may consider. It does not, on its own, tell you whether finance will be available for a particular vehicle.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Oakwood is a credit broker, not a lender. We help you check eligibility, browse used cars with monthly figures first, and build a deal when you are ready.",
        "If a vehicle is outside your finance profile, you can increase the deposit, look at a lower-priced car, or contact Oakwood. We do not automatically extend the finance term to force a deal to work.",
      ],
    },
    eligibility: {
      title: "Eligibility, not an application",
      paragraphs: [
        "Check eligibility to get a personalised finance profile. That uses a soft search and does not affect your credit score.",
        "A regulated finance application happens later, when you build a deal on a specific vehicle. Your final terms are confirmed then.",
      ],
    },
    education: {
      title: "What happens next",
      steps: [
        {
          title: "Check eligibility",
          body: "Tell us about employment, income, housing, a monthly budget and a deposit you could put down. You will see the result on screen.",
        },
        {
          title: "Use your finance profile",
          body: "If you receive a profile, monthly figures on cars can reflect it. It is an illustration, not a guaranteed final rate.",
        },
        {
          title: "If a car is out of reach",
          body: "Increase the deposit, browse a lower-priced vehicle, or speak to Oakwood. Checking eligibility again is available if your profile expires.",
        },
      ],
    },
    faqs: [
      {
        question: "Can I get car finance with bad credit?",
        answer:
          "A weaker credit history does not automatically mean there are no options, and it does not mean finance is guaranteed. Check eligibility to see a personalised finance profile. That is a soft search, not an application.",
      },
      {
        question: "Will checking eligibility affect my credit score?",
        answer:
          "The soft search used for eligibility does not affect your credit file. A full application, later in the deal, is when a harder search may happen.",
      },
      {
        question: "Do you accept everyone?",
        answer:
          "No. Oakwood does not guarantee acceptance. Individual circumstances matter, and a lender decision is confirmed during a full application on a specific vehicle.",
      },
    ],
    related: related([
      { href: getFinanceIntentUrl("no-deposit"), label: "No deposit finance" },
      { href: getFinanceIntentUrl("ccj"), label: "Finance with a CCJ" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
    ]),
  },
  "no-deposit": {
    slug: "no-deposit",
    eyebrow: "Finance",
    h1: "Can you get car finance with no deposit?",
    intro:
      "A deposit is money you put towards the car at the start. Some customers want to put down as little as possible. That can change how much you finance and the estimated monthly payment. It is not a promise that every vehicle is available with £0 down.",
    metaTitle: "No deposit car finance",
    metaDescription:
      "Understand what no-deposit car finance means, how a deposit changes monthly payments, and how part exchange can contribute. Check eligibility with Oakwood.",
    whatThisMeans: {
      title: "What “no deposit” means",
      paragraphs: [
        "No deposit means you would put £0 cash towards the vehicle at the start of the agreement. The amount financed is then closer to the cash price, after any part-exchange equity.",
        "Eligibility lets you say how much you could put towards a deposit, including £0. You can change that later when you build a deal.",
      ],
    },
    howOakwoodHelps: {
      title: "How a deposit changes the picture",
      paragraphs: [
        "A higher deposit usually reduces the amount financed and can lower the estimated monthly payment. A lower deposit does the opposite.",
        "Part-exchange equity can be used towards the deposit. That uses Oakwood’s existing valuation journey — it is not a second calculator.",
      ],
    },
    eligibility: {
      title: "Eligibility still comes first",
      paragraphs: [
        "Check eligibility to see a personalised finance profile, including how much you may be able to finance. That uses a soft search and is not an application.",
        "Some vehicles still need more deposit if the amount to finance is above your maximum advance or other finance rules. In that case we show the gap rather than stretching the term automatically.",
      ],
    },
    education: {
      title: "Deposit, equity and monthly payments",
      cards: [
        {
          title: "Cash deposit",
          body: "Money you put in at the start. You can try different amounts in the calculator or deal builder.",
        },
        {
          title: "Part-exchange equity",
          body: "If your current car is worth more than any settlement figure, that equity can be added to the deposit.",
        },
        {
          title: "Amount financed",
          body: "Vehicle price minus total deposit, plus any amounts the provider includes in the advance. This drives the estimated monthly payment.",
        },
      ],
    },
    faqs: [
      {
        question: "Can I get a car without paying a deposit?",
        answer:
          "You can start eligibility with £0 deposit. That does not mean every vehicle will be available with no deposit. If the amount to finance is above your profile, you may need to add deposit or choose a lower-priced car.",
      },
      {
        question: "Does a deposit change my monthly payment?",
        answer:
          "Yes. The deposit changes the amount financed, which changes the estimated monthly payment and total payable on the illustration.",
      },
      {
        question: "Can part exchange replace a cash deposit?",
        answer:
          "Positive equity from part exchange can be used towards the deposit. The valuation is an estimate until the vehicle is inspected.",
      },
    ],
    related: related([
      { href: routes.partExchange, label: "Part exchange your car" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getFinanceIntentUrl("bad-credit"), label: "Finance with bad credit" },
    ]),
    secondaryCta: {
      href: routes.partExchange,
      label: "Part exchange your car",
      event: "px",
    },
  },
  ccj: {
    slug: "ccj",
    eyebrow: "Finance",
    h1: "Car finance with a CCJ",
    intro:
      "A County Court Judgment (CCJ) is part of someone’s credit history. It does not, on its own, mean finance will be approved or declined. Oakwood can help you check eligibility and understand the next step — this page is not legal or financial advice.",
    metaTitle: "Car finance with a CCJ",
    metaDescription:
      "Understand how a CCJ relates to car finance eligibility at Oakwood. Check a personalised finance profile with a soft search — not a full application.",
    whatThisMeans: {
      title: "What a CCJ means here",
      paragraphs: [
        "A CCJ is a court judgment about a debt. Lenders may treat it as part of your credit history. This page does not explain how to challenge or satisfy a CCJ.",
        "Whether finance is available depends on your overall circumstances and on a later application against a specific vehicle. Oakwood does not decide that on this page.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Start with eligibility. It is a soft search and does not affect your credit score. If you receive a finance profile, you can browse cars with monthly figures that reflect it.",
        "If a car sits outside that profile, increase the deposit, browse a lower-priced vehicle, or contact Oakwood. We will not present a CCJ as an automatic yes or no.",
      ],
    },
    eligibility: {
      title: "Individual circumstances matter",
      paragraphs: [
        "Eligibility looks at information such as employment, income, housing, a monthly budget and a deposit. A full application, later, is when the lender confirms terms.",
        "This page does not list lender-specific CCJ rules. Those stay with the finance provider and are assessed during eligibility and a later application.",
      ],
    },
    education: {
      title: "Practical next steps",
      steps: [
        {
          title: "Check eligibility",
          body: "See a personalised finance profile without a hard search. This is not legal advice and not an application.",
        },
        {
          title: "Browse within a budget",
          body: "Used cars and vans show monthly figures first so you can compare options calmly.",
        },
        {
          title: "Ask Oakwood if you are stuck",
          body: "If you are unsure how a vehicle fits your profile, contact Oakwood rather than guessing at a lender outcome.",
        },
      ],
    },
    faqs: [
      {
        question: "Can I get car finance with a CCJ?",
        answer:
          "A CCJ does not automatically mean approval or rejection. Check eligibility to see a personalised finance profile. A lender decision is confirmed later, during a full application.",
      },
      {
        question: "Should I take legal advice about a CCJ?",
        answer:
          "Oakwood cannot give legal advice. If you need advice about a CCJ itself, speak to a qualified adviser. This page only explains how to start Oakwood’s finance-first journey.",
      },
      {
        question: "Will you tell me the lender’s CCJ policy?",
        answer:
          "No. Internal lender rules are not shown on this website. Eligibility and, later, a full application are how your circumstances are assessed.",
      },
    ],
    related: related([
      { href: getFinanceIntentUrl("bad-credit"), label: "Finance with bad credit" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getUsedCarsUrl(), label: "Browse used cars" },
      { href: routes.contact, label: "Contact Oakwood" },
    ]),
  },
  "self-employed": {
    slug: "self-employed",
    eyebrow: "Finance",
    h1: "Car finance for self-employed drivers",
    intro:
      "Self-employed customers can check finance eligibility with Oakwood. The questions currently ask for your employment status and, if you are self-employed, how many months you have been in your current self-employment — along with income, housing, budget and deposit.",
    metaTitle: "Car finance for the self-employed",
    metaDescription:
      "See how Oakwood’s finance eligibility works if you are self-employed. Soft search, no impact on your credit score, then browse cars that fit.",
    whatThisMeans: {
      title: "Self-employed and car finance",
      paragraphs: [
        "Being self-employed does not stop you exploring finance. Eligibility is the same journey as for employed customers, with one extra question about how long you have been self-employed.",
        "Oakwood does not list extra documents on this page. Anything needed for a full application is confirmed later by the finance provider.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Check eligibility with a soft search. You will see a result on screen and can use a finance profile, if you receive one, while you browse.",
        "When you are ready, build a deal on a specific vehicle. That is when a regulated application happens — not on this educational page.",
      ],
    },
    eligibility: {
      title: "What eligibility currently asks",
      paragraphs: [
        "Employment status, and months of current self-employment if that applies. Monthly income, living situation, a comfortable monthly payment band, a deposit you could put down, and whether you have a car to part exchange.",
        "Further evidence, if a lender needs it, is confirmed later by the finance provider. This page does not invent a document list.",
      ],
    },
    education: {
      title: "From eligibility to a deal",
      steps: [
        {
          title: "Answer the questions",
          body: "Use your usual monthly income before tax, and the length of your current self-employment in months.",
        },
        {
          title: "See your profile",
          body: "If eligibility is successful, browse cars with personalised monthly figures. This is still an illustration.",
        },
        {
          title: "Build the deal later",
          body: "Configure HP or PCP, deposit and term on the vehicle. Final terms are confirmed during the application.",
        },
      ],
    },
    faqs: [
      {
        question: "Can self-employed people get car finance?",
        answer:
          "You can check eligibility as a self-employed customer. That does not guarantee a lender will offer finance. Individual circumstances are assessed during eligibility and, later, a full application.",
      },
      {
        question: "What documents do I need?",
        answer:
          "Eligibility currently asks the questions shown in the journey, including how many months you have been self-employed. Extra documents are not listed here until the finance provider confirms them.",
      },
      {
        question: "Is this an application?",
        answer:
          "No. Eligibility uses a soft search and does not affect your credit file. A regulated application happens when you build a deal on a specific vehicle.",
      },
    ],
    related: related([
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getFinanceIntentUrl("first-time-buyer"), label: "First-time buyers" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
      { href: getUsedVansUrl(), label: "Browse used vans" },
    ]),
  },
  "first-time-buyer": {
    slug: "first-time-buyer",
    eyebrow: "Finance",
    h1: "Car finance for first-time buyers",
    intro:
      "If you have not bought a car on finance before, start with the figures that matter: a monthly amount you are comfortable with, a deposit you could put down, and how long you want to pay. Then check eligibility before you fall for a particular car.",
    metaTitle: "Car finance for first-time buyers",
    metaDescription:
      "A practical guide to car finance if you are buying for the first time: deposit, monthly affordability, term, HP vs PCP, and Oakwood eligibility.",
    whatThisMeans: {
      title: "What to think about first",
      paragraphs: [
        "A monthly payment you can keep up with is more useful than starting from a car you like. Eligibility asks for a monthly budget band so the site can show cars around that level.",
        "A deposit reduces the amount you finance. Part exchange can contribute if you already have a car. Term is how many months the agreement lasts — Oakwood does not extend it automatically to make a deal fit.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Check eligibility with a soft search, browse used cars and vans with monthly figures first, then build a deal when you are ready.",
        "Use the finance calculator to see how price, deposit, term and HP or PCP change an estimated payment. It is an illustration, not an application.",
      ],
    },
    eligibility: {
      title: "Eligibility before you apply",
      paragraphs: [
        "Eligibility gives you a personalised finance profile with no impact on your credit score. You can then browse with more confidence.",
        "A regulated application is a later step on a specific vehicle. Your final terms are confirmed then.",
      ],
    },
    education: {
      title: "HP, PCP, deposit and term",
      cards: [
        {
          title: "Deposit",
          body: "What you put in at the start, including any part-exchange equity. You can change it later.",
        },
        {
          title: "Monthly affordability",
          body: "Choose a band that feels comfortable. Cars are easier to compare when the monthly figure comes first.",
        },
        {
          title: "Term",
          body: "Longer terms can lower the monthly illustration and raise the total payable. You choose the term yourself.",
        },
        {
          title: "HP or PCP",
          body: "HP spreads the amount financed until you own the car. PCP usually holds back an optional final payment and uses annual mileage.",
        },
      ],
      comparison: true,
    },
    faqs: [
      {
        question: "I’m new to car finance. Where do I start?",
        answer:
          "Check eligibility first. It takes a short set of questions and uses a soft search. Then browse cars with monthly figures, and use the calculator if you want to try different deposits or terms.",
      },
      {
        question: "Should I choose HP or PCP?",
        answer:
          "Neither product is universally better. HP is simpler ownership over the term. PCP often has a lower monthly illustration because of an optional final payment and includes annual mileage. Compare both, then confirm details in a deal.",
      },
      {
        question: "Do I need a large deposit?",
        answer:
          "Not necessarily. Eligibility lets you start from £0. A deposit still changes the amount financed. Some vehicles may need more deposit if they sit above your finance profile.",
      },
    ],
    related: related([
      { href: getFinanceIntentUrl("hp"), label: "How HP works" },
      { href: getFinanceIntentUrl("pcp"), label: "How PCP works" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
    ]),
    secondaryCta: {
      href: getFinanceCalculatorUrl(),
      label: "Finance calculator",
      event: "calculator",
    },
  },
  hp: {
    slug: "hp",
    eyebrow: "Hire Purchase",
    h1: "How does HP car finance work?",
    intro:
      "Hire Purchase (HP) spreads the amount you finance over a fixed term. You make a deposit, then monthly payments. You own the vehicle once all payments are made. Figures you see before a full application are illustrations.",
    metaTitle: "How HP car finance works",
    metaDescription:
      "Plain-language guide to Hire Purchase: deposit, monthly payments, term, ownership and total payable. Check eligibility with Oakwood, then browse cars.",
    whatThisMeans: {
      title: "How HP works",
      paragraphs: [
        "You agree a deposit and a term. The remaining amount is financed and repaid in monthly instalments.",
        "There is no PCP-style annual mileage choice and no optional balloon payment on HP. Total payable is shown alongside the monthly figure on Oakwood illustrations.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Check eligibility, then browse cars with monthly figures. On a vehicle, build a deal to try HP against PCP where both are available.",
        "The calculator and deal builder use the same finance rules. They do not replace a regulated application.",
      ],
    },
    eligibility: {
      title: "Eligibility then application",
      paragraphs: [
        "Eligibility is a soft search for a personalised finance profile. It is not “apply now”.",
        "Your final HP terms are confirmed during the application on a specific vehicle.",
      ],
    },
    education: {
      title: "The moving parts of HP",
      cards: [
        {
          title: "Deposit",
          body: "What you pay at the start, including any part-exchange equity.",
        },
        {
          title: "Monthly payments",
          body: "Estimated instalments over the term. Personalised if you have a finance profile; otherwise a representative illustration.",
        },
        {
          title: "Term",
          body: "How many months the agreement lasts. You choose from the options shown. We never extend it automatically.",
        },
        {
          title: "Ownership",
          body: "You own the vehicle once all payments under the agreement are made.",
        },
        {
          title: "Total payable",
          body: "The overall illustrated cost, shown with the monthly figure so you can compare honestly.",
        },
      ],
      comparison: true,
    },
    faqs: [
      {
        question: "Do I own the car with HP?",
        answer:
          "You own the vehicle once all payments under the Hire Purchase agreement are made. Until then you are hiring the vehicle with an option to own it at the end of those payments.",
      },
      {
        question: "Does HP have a mileage limit?",
        answer:
          "HP on Oakwood does not use the annual mileage selector that PCP uses. Mileage still matters for the vehicle itself, just not as a PCP contract mile limit on this site.",
      },
      {
        question: "Is HP cheaper than PCP?",
        answer:
          "Not universally. PCP often shows a lower monthly illustration because an optional final payment is held back. HP may cost more per month and has no balloon. Compare both on a vehicle rather than assuming one is better.",
      },
    ],
    related: related([
      { href: getFinanceIntentUrl("pcp"), label: "How PCP works" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getUsedCarsUrl(), label: "Browse used cars" },
    ]),
    secondaryCta: {
      href: getUsedCarsUrl(),
      label: "Browse cars",
      event: "browse",
    },
  },
  pcp: {
    slug: "pcp",
    eyebrow: "Personal Contract Purchase",
    h1: "How does PCP car finance work?",
    intro:
      "Personal Contract Purchase (PCP) usually has a lower monthly illustration than HP because an optional final payment is held back until the end of the agreement. Annual mileage is part of PCP. Exact end-of-agreement options come from the finance provider, not from this page.",
    metaTitle: "How PCP car finance works",
    metaDescription:
      "Plain-language guide to PCP: deposit, monthly payments, term, annual mileage and optional final payment. Check eligibility with Oakwood.",
    whatThisMeans: {
      title: "How PCP works",
      paragraphs: [
        "You pay a deposit, then monthly payments over a term, with an optional final payment shown on the illustration.",
        "Annual mileage affects a PCP illustration. Changing mileage on the calculator or deal builder updates the estimate. Provider-specific names for that final payment are not invented here.",
      ],
    },
    howOakwoodHelps: {
      title: "How Oakwood can help",
      paragraphs: [
        "Check eligibility, browse cars, then compare PCP with HP on a vehicle. The same calculation rules are used in the calculator and deal builder.",
        "If PCP is not available for a configuration, we explain that instead of showing a monthly figure.",
      ],
    },
    eligibility: {
      title: "Eligibility then application",
      paragraphs: [
        "Eligibility is a soft search. It does not affect your credit score and it is not a PCP application.",
        "Optional final payment, mileage and end-of-agreement choices are confirmed with the finance provider during a full application.",
      ],
    },
    education: {
      title: "The moving parts of PCP",
      cards: [
        {
          title: "Deposit",
          body: "What you pay at the start, including any part-exchange equity.",
        },
        {
          title: "Monthly payments",
          body: "Usually lower than HP on the same vehicle because an optional final payment is held back.",
        },
        {
          title: "Contract term",
          body: "How many months you pay. You choose the term. We do not extend it automatically.",
        },
        {
          title: "Annual mileage",
          body: "Shown only for PCP. It is part of the illustration and can change the optional final payment shown.",
        },
        {
          title: "Optional final payment",
          body: "Held until the end of the agreement on Oakwood illustrations. The provider’s official wording is used when it is supplied.",
        },
      ],
      comparison: true,
    },
    faqs: [
      {
        question: "What happens at the end of a PCP agreement?",
        answer:
          "There is usually an optional final payment. What you can do next — such as paying that amount, returning the vehicle, or another option the lender offers — is confirmed during application. This page does not invent those lender options.",
      },
      {
        question: "Why does mileage matter on PCP?",
        answer:
          "Annual mileage is part of a PCP agreement. Oakwood only shows mileage choices when PCP is selected, and the illustration updates when you change them.",
      },
      {
        question: "Is PCP better than HP?",
        answer:
          "Not for everyone. PCP often has a lower monthly illustration and an optional final payment. HP has no balloon and you own the car once all payments are made. Compare both.",
      },
    ],
    related: related([
      { href: getFinanceIntentUrl("hp"), label: "How HP works" },
      { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
      { href: getEligibilityUrl(), label: "Check my eligibility" },
      { href: getUsedCarsUrl(), label: "Browse used cars" },
    ]),
    secondaryCta: {
      href: getFinanceCalculatorUrl(),
      label: "Finance calculator",
      event: "calculator",
    },
  },
};

export function getFinanceIntentPageContent(
  slug: FinanceIntentSlug,
): FinanceIntentPageContent {
  return pages[slug];
}

export function listFinanceIntentPages(): FinanceIntentPageContent[] {
  return Object.values(pages);
}

export const financeHubFaqs: FinanceFaqItem[] = [
  {
    question: "Is checking eligibility a finance application?",
    answer:
      "No. Eligibility uses a soft search and does not affect your credit score. A regulated application happens later, when you build a deal on a specific vehicle.",
  },
  {
    question: "What is a finance profile?",
    answer:
      "If eligibility is successful, you receive a personalised finance profile you can use while you browse. Monthly figures are still illustrations. Final terms are confirmed during a full application.",
  },
  {
    question: "Can I use the calculator without checking eligibility?",
    answer:
      "Yes. The calculator is an estimate for planning. Check eligibility when you want a personalised finance profile.",
  },
];

export const financeHubRelated: FinanceRelatedLink[] = [
  { href: getEligibilityUrl(), label: "Check my eligibility" },
  { href: getFinanceCalculatorUrl(), label: "Finance calculator" },
  { href: getUsedCarsUrl(), label: "Used cars" },
  { href: getUsedVansUrl(), label: "Used vans" },
  { href: routes.partExchange, label: "Part exchange" },
  { href: getFinanceIntentUrl("hp"), label: "How HP works" },
  { href: getFinanceIntentUrl("pcp"), label: "How PCP works" },
];

export const financeHubGuides: Array<{
  slug: FinanceIntentSlug;
  title: string;
  description: string;
}> = [
  { slug: "bad-credit", title: "Car finance with bad credit", description: "Credit history does not automatically close every door — and it does not guarantee finance either." },
  { slug: "no-deposit", title: "No deposit car finance", description: "See how a deposit, including £0 and part-exchange equity, changes the amount you finance." },
  { slug: "ccj", title: "Car finance with a CCJ", description: "A CCJ is part of credit history. It is not an automatic yes or no on this website." },
  { slug: "self-employed", title: "Finance if you are self-employed", description: "Check eligibility as a self-employed customer without a made-up document list." },
  { slug: "first-time-buyer", title: "Finance for first-time buyers", description: "Start with monthly affordability, deposit, term, and HP versus PCP." },
  { slug: "hp", title: "How HP works", description: "Hire Purchase: deposit, monthly payments, term, ownership and total payable." },
  { slug: "pcp", title: "How PCP works", description: "Personal Contract Purchase: mileage, optional final payment, and how it differs from HP." },
];
