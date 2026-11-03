import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  BadgePoundSterling,
  CalendarPlus,
  Car,
  Info,
  KeyRound,
  MapPin,
  ShieldCheck,
  Van,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { getBookingUrl, getSearchUrl, routes } from "@/config/routes";
import { cn } from "@/lib/cn";

type MenuIcon =
  | "car"
  | "van"
  | "finance"
  | "check"
  | "key"
  | "exchange"
  | "wrench"
  | "shield"
  | "pin"
  | "info";

export interface SectionMenuLink {
  label: string;
  href: string;
  /** Semi-bold price fragment shown after the label, e.g. "£200". */
  price?: string;
  /** Show a trailing arrow on the link. */
  arrow?: boolean;
}

export interface SectionMenuCard {
  title: string;
  description: string;
  href: string;
  icon: MenuIcon;
  /** Span both card columns — used for the Sell Part exchange CTA. */
  featured?: boolean;
}

export interface SectionMenuContent {
  listLabel: string;
  links: SectionMenuLink[];
  cards: SectionMenuCard[];
  sideLabel: string;
  sideLinks: { label: string; href: string }[];
}

const browseByBudget: SectionMenuLink[] = [
  { label: "Cars under", price: "£200", href: getSearchUrl({ monthly_max: 200 }) },
  { label: "Cars under", price: "£300", href: getSearchUrl({ monthly_max: 300 }) },
  { label: "Cars under", price: "£400", href: getSearchUrl({ monthly_max: 400 }) },
  { label: "Cars under", price: "£500", href: getSearchUrl({ monthly_max: 500 }) },
  { label: "Cars over", price: "£500", href: getSearchUrl({ monthly_min: 500 }) },
];

export const sectionMenus: Record<string, SectionMenuContent> = {
  cars: {
    listLabel: "Browse by budget",
    links: browseByBudget,
    cards: [
      {
        title: "Used cars",
        description:
          "Browse cars in stock with a cash price and an example monthly payment",
        href: routes.usedCars,
        icon: "car",
      },
      {
        title: "Used vans",
        description: "Practical vehicles for work, with the same clear pricing",
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
    listLabel: "Browse by budget",
    links: browseByBudget,
    cards: [
      {
        title: "Check eligibility",
        description:
          "See a personalised finance profile, with no impact on your credit score",
        href: routes.eligibilityQuestions,
        icon: "check",
      },
      {
        title: "Finance",
        description: "Learn about buying your car with a monthly payment",
        href: routes.finance,
        icon: "finance",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [],
  },
  sell: {
    listLabel: "Your car",
    links: [{ label: "Get a valuation", href: routes.valuation }],
    cards: [
      {
        title: "Part exchange",
        description: "Use your current car towards the next one",
        href: routes.partExchange,
        icon: "exchange",
        featured: true,
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [],
  },
  aftersales: {
    listLabel: "Car care",
    links: [
      { label: "Servicing", href: routes.service },
      { label: "MOT", href: routes.mot },
      { label: "Warranty claims", href: routes.warrantyClaims },
      {
        label: "Book a 60-minute diagnosis",
        href: getBookingUrl({ type: "service" }),
      },
      {
        label: "Make a complaint",
        href: `${routes.complaints}#complaint-form`,
      },
    ],
    cards: [
      {
        title: "Book a service",
        description: "Arrange servicing or an MOT at Oakwood",
        href: routes.booking,
        icon: "wrench",
      },
      {
        title: "Warranty",
        description: "See what cover applies, and how to make a claim",
        href: routes.warranty,
        icon: "shield",
      },
    ],
    sideLabel: "FAQs",
    sideLinks: [
      { label: "When does my car need an MOT?", href: routes.mot },
      { label: "How do I book a service?", href: routes.booking },
      { label: "How do I make a warranty claim?", href: routes.warrantyClaims },
      {
        label: "How do I get a refund?",
        href: routes.cancellationRefund,
      },
    ],
  },
  "about-trust": {
    listLabel: "Oakwood",
    links: [
      { label: "About us", href: routes.about, arrow: true },
      { label: "Contact", href: routes.contact, arrow: true },
    ],
    cards: [
      {
        title: "How finance works",
        description:
          "Check your budget, choose a car, then buy in a way that suits you",
        href: routes.howItWorks,
        icon: "info",
      },
      {
        title: "Visit us",
        description: "See cars at our Bury and Chorley showrooms",
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

const menuIcons: Record<MenuIcon, LucideIcon> = {
  car: Car,
  van: Van,
  finance: BadgePoundSterling,
  check: BadgeCheck,
  key: KeyRound,
  exchange: ArrowLeftRight,
  wrench: CalendarPlus,
  shield: ShieldCheck,
  pin: MapPin,
  info: Info,
};

function MenuGlyph({ name }: { name: MenuIcon }) {
  const Icon = menuIcons[name];
  return <Icon aria-hidden className="h-11 w-11 text-primary" strokeWidth={1.75} />;
}

function gridTemplate(
  hasList: boolean,
  cardSlots: number,
  hasSide: boolean,
): string {
  const cols: string[] = [];
  if (hasList) cols.push("minmax(12rem,15rem)");
  for (let i = 0; i < cardSlots; i += 1) {
    cols.push("minmax(0,1fr)");
  }
  if (hasSide) cols.push("minmax(13rem,17rem)");
  return cols.join(" ");
}

export function SectionMenu({
  menu,
  labelledBy,
  onNavigate,
}: {
  menu: SectionMenuContent;
  pathname: string;
  labelledBy: string;
  onNavigate: () => void;
}) {
  const hasList = menu.links.length > 0;
  const hasSide = menu.sideLinks.length > 0;
  const hasFeatured = menu.cards.some((card) => card.featured);
  // Featured single card spans two card columns so it reads as the main CTA.
  const cardSlots =
    menu.cards.length === 0
      ? 0
      : hasFeatured
        ? Math.max(2, menu.cards.length)
        : menu.cards.length;
  const template = gridTemplate(hasList, cardSlots, hasSide);

  return (
    <div
      className="grid grid-cols-1 items-stretch gap-6 lg:gap-5 lg:[grid-template-columns:var(--menu-cols)] xl:gap-8"
      style={{ ["--menu-cols" as string]: template }}
    >
      {hasList ? (
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink">
            {menu.listLabel}
          </p>
          <ul className="mt-4 space-y-1">
            {menu.links.map((link) => (
              <li key={link.href + link.label + (link.price ?? "")}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-md py-1.5 text-[0.95rem] text-ink no-underline hover:underline"
                  onClick={onNavigate}
                >
                  <span>
                    {link.label}
                    {link.price ? (
                      <>
                        {" "}
                        <span className="font-semibold">{link.price}</span>
                      </>
                    ) : null}
                  </span>
                  {link.arrow ? (
                    <ArrowRight
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0"
                      strokeWidth={1.75}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {menu.cards.map((card) => (
        <Link
          key={card.href + card.title}
          href={card.href}
          onClick={onNavigate}
          className={cn(
            "group flex h-full min-h-52 flex-col rounded-[14px] bg-white p-5 text-ink no-underline transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(66,69,78,0.12)]",
            card.featured && "lg:col-span-2",
          )}
        >
          <MenuGlyph name={card.icon} />
          <span className="mt-8 inline-flex items-center gap-2 text-[1.05rem] font-semibold group-hover:underline">
            {card.title}
            <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="mt-2 text-[0.92rem] leading-relaxed text-secondary">
            {card.description}
          </span>
        </Link>
      ))}

      {hasSide ? (
        <div>
          <p
            id={labelledBy}
            className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink"
          >
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
      ) : null}
    </div>
  );
}
