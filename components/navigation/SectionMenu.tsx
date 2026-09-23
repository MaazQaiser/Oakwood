import Link from "next/link";
import { IconArrow } from "@/components/ui/icons";
import { getFinanceIntentUrl, getSearchUrl, routes } from "@/config/routes";
import { cn } from "@/lib/cn";

type MenuIcon = "car" | "van" | "finance" | "check" | "key" | "exchange" | "wrench" | "shield" | "pin" | "info";

export interface SectionMenuContent {
  listLabel: string;
  links: { label: string; href: string; mark?: string }[];
  cards: {
    title: string;
    description: string;
    href: string;
    icon: MenuIcon;
  }[];
  sideLabel: string;
  sideLinks: { label: string; href: string }[];
}

const monthlySearch = [
  { label: "Cars under £200", href: getSearchUrl({ monthly_max: 200 }), mark: "£" },
  { label: "Cars under £300", href: getSearchUrl({ monthly_max: 300 }), mark: "£" },
  { label: "Cars under £400", href: getSearchUrl({ monthly_max: 400 }), mark: "£" },
  { label: "Cars under £500", href: getSearchUrl({ monthly_max: 500 }), mark: "£" },
  { label: "Cars over £500", href: getSearchUrl({ monthly_min: 500 }), mark: "£" },
];

export const sectionMenus: Record<string, SectionMenuContent> = {
  cars: {
    listLabel: "Monthly price search",
    links: monthlySearch,
    cards: [
      {
        title: "Used cars",
        description: "Browse cars in stock with a cash price and an example monthly payment.",
        href: routes.usedCars,
        icon: "car",
      },
      {
        title: "Used vans",
        description: "Practical vehicles for work, with the same clear pricing.",
        href: routes.usedVans,
        icon: "van",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "How does buying a car from Oakwood work?", href: routes.howItWorks },
      { label: "Can I reserve a car online?", href: routes.reserve },
      { label: "Where can I view a car?", href: routes.locations },
    ],
  },
  finance: {
    listLabel: "Monthly price search",
    links: monthlySearch,
    cards: [
      {
        title: "Finance",
        description: "Learn about buying your car with a monthly payment.",
        href: routes.finance,
        icon: "finance",
      },
      {
        title: "Check eligibility",
        description: "See a personalised finance profile, with no impact on your credit score.",
        href: routes.eligibility,
        icon: "check",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "Does checking eligibility affect my credit score?", href: routes.eligibility },
      { label: "How does HP car finance work?", href: getFinanceIntentUrl("hp") },
      { label: "How does PCP car finance work?", href: getFinanceIntentUrl("pcp") },
      { label: "Can I estimate a monthly payment first?", href: routes.financeCalculator },
    ],
  },
  sell: {
    listLabel: "Your car",
    links: [
      { label: "Sell my car", href: routes.sellMyCar },
      { label: "Part exchange", href: routes.partExchange },
      { label: "Get a valuation", href: routes.valuation },
    ],
    cards: [
      {
        title: "Valuation",
        description: "See how much your car could contribute to your deposit. The online figure is an estimate.",
        href: routes.valuation,
        icon: "key",
      },
      {
        title: "Part exchange",
        description: "Use your current car towards the next one.",
        href: routes.partExchange,
        icon: "exchange",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "Is the online valuation a final offer?", href: routes.valuation },
      { label: "Can I part exchange my car?", href: routes.partExchange },
      { label: "How do I sell my car to Oakwood?", href: routes.sellMyCar },
    ],
  },
  aftersales: {
    listLabel: "Car care",
    links: [
      { label: "Book a service", href: routes.booking },
      { label: "Servicing", href: routes.service },
      { label: "MOT", href: routes.mot },
      { label: "Warranty", href: routes.warranty },
      { label: "Warranty claims", href: routes.warrantyClaims },
    ],
    cards: [
      {
        title: "Book a service",
        description: "Arrange servicing or an MOT at Oakwood.",
        href: routes.booking,
        icon: "wrench",
      },
      {
        title: "Warranty",
        description: "See what cover applies, and how to make a claim.",
        href: routes.warranty,
        icon: "shield",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "When does my car need an MOT?", href: routes.mot },
      { label: "How do I book a service?", href: routes.booking },
      { label: "How do I make a warranty claim?", href: routes.warrantyClaims },
    ],
  },
  "about-trust": {
    listLabel: "Oakwood",
    links: [
      { label: "About us", href: routes.about },
      { label: "How it works", href: routes.howItWorks },
      { label: "Bury", href: `${routes.locations}/bury` },
      { label: "Chorley", href: `${routes.locations}/chorley` },
      { label: "Contact", href: routes.contact },
    ],
    cards: [
      {
        title: "How it works",
        description: "Check your budget, choose a car, then buy in a way that suits you.",
        href: routes.howItWorks,
        icon: "info",
      },
      {
        title: "Visit us",
        description: "See cars at our Bury and Chorley showrooms.",
        href: routes.locations,
        icon: "pin",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "Do I need an account?", href: routes.faq },
      { label: "How do I contact Oakwood?", href: routes.contact },
      { label: "How do I raise a complaint?", href: routes.complaints },
    ],
  },
};

function MenuGlyph({ name }: { name: MenuIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    className: "h-7 w-7 text-[#002852]",
  };

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="M12 3.5 14.2 8l4.8.4-3.7 3.1 1.2 4.7L12 13.8 7.5 16.2 8.7 11.5 5 8.4 9.8 8 12 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m9.2 11.2 1.7 1.7 3.6-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "finance" || name === "car" || name === "van") {
    return (
      <svg {...common}>
        <path d="M4 14.5h16l-1.2-4.2a2 2 0 0 0-1.9-1.4H7.1a2 2 0 0 0-1.9 1.4L4 14.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6.5 14.5v2.2M17.5 14.5v2.2M7.2 17.2h.1M16.7 17.2h.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16.5 6.1v1.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "key") {
    return (
      <svg {...common}>
        <circle cx="8" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 12h9M17 12v2.4M14.2 12v1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "exchange") {
    return (
      <svg {...common}>
        <path d="M7 7h10l-2.2-2.2M17 17H7l2.2 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7v3.5M17 17v-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "wrench") {
    return (
      <svg {...common}>
        <path d="M14.5 6.2a3.2 3.2 0 0 0-4.2 4.1L5 15.6 8.4 19l5.3-5.3a3.2 3.2 0 0 0 4.1-4.2l-2.2 2.2-1.6-1.6 2.2-2.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3.8 18.5 6.2v5.2c0 3.6-2.6 6.4-6.5 8.3-3.9-1.9-6.5-4.7-6.5-8.3V6.2L12 3.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 20s5.5-4.6 5.5-9A5.5 5.5 0 0 0 6.5 11c0 4.4 5.5 9 5.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SectionMenu({
  menu,
  pathname,
  labelledBy,
  onNavigate,
}: {
  menu: SectionMenuContent;
  pathname: string;
  labelledBy: string;
  onNavigate: () => void;
}) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(12rem,15rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(13rem,17rem)] lg:gap-5 xl:gap-8">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink">{menu.listLabel}</p>
        <ul className="mt-4 space-y-1">
          {menu.links.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-md py-1.5 text-[0.95rem] text-ink no-underline hover:underline"
                onClick={onNavigate}
              >
                {link.mark ? <span className="w-3 shrink-0 text-[0.95rem]">{link.mark}</span> : null}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {menu.cards.map((card) => (
        <Link
          key={card.href + card.title}
          href={card.href}
          onClick={onNavigate}
          className={cn(
            "flex h-full min-h-52 flex-col rounded-[14px] border border-[#d5deea] bg-white p-5 text-ink no-underline hover:border-[#002852]",
            pathname === card.href && "border-[#002852]",
          )}
        >
          <MenuGlyph name={card.icon} />
          <span className="mt-8 inline-flex items-center gap-2 text-[1.05rem] font-semibold">
            {card.title}
            <IconArrow className="h-4 w-4" />
          </span>
          <span className="mt-2 text-[0.92rem] leading-relaxed text-[#5c6b7a]">{card.description}</span>
        </Link>
      ))}
      <div>
        <p id={labelledBy} className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink">
          {menu.sideLabel}
        </p>
        <ul className="mt-4 space-y-3" aria-labelledby={labelledBy}>
          {menu.sideLinks.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                className="block text-[0.95rem] leading-snug text-ink no-underline hover:underline"
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
