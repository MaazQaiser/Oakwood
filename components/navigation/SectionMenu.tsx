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
  Percent,
  ShieldCheck,
  Van,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  browseBodyTypeLinks,
  browseCashBudgetLinks,
  browseFuelLinks,
  browseMonthlyBudgetLinks,
} from "@/config/navigation";
import {
  getBookingUrl,
  getFaqUrl,
  getLocationStockUrl,
  routes,
} from "@/config/routes";
import { cn } from "@/lib/cn";
import { guaranteeCopy } from "@/lib/guarantee/copy";

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
  | "info"
  | "percent";

export interface SectionMenuLink {
  label: string;
  href: string;
  /** Semi-bold price fragment shown after the label, e.g. "£200". */
  price?: string;
  /** Show a trailing arrow on the link. */
  arrow?: boolean;
  external?: boolean;
}

export interface SectionMenuGroup {
  label: string;
  links: SectionMenuLink[];
}

export interface SectionMenuCard {
  title: string;
  description: string;
  href: string;
  icon: MenuIcon;
  /** Span both card columns — used for the Sell Part exchange CTA. */
  featured?: boolean;
  external?: boolean;
}

export interface SectionMenuContent {
  /** Flat list column. Prefer `linkGroups` when links need sub-headings. */
  listLabel?: string;
  links?: SectionMenuLink[];
  /** Grouped browse column (Fiverr-style section labels). */
  linkGroups?: SectionMenuGroup[];
  /** Optional second browse column. */
  secondaryListLabel?: string;
  secondaryLinks?: SectionMenuLink[];
  secondaryLinkGroups?: SectionMenuGroup[];
  cards: SectionMenuCard[];
  sideLabel: string;
  sideLinks: { label: string; href: string }[];
}

export const sectionMenus: Record<string, SectionMenuContent> = {
  buy: {
    linkGroups: [
      {
        label: "Monthly budget",
        links: [...browseMonthlyBudgetLinks],
      },
      {
        label: "Cash price",
        links: [...browseCashBudgetLinks.slice(0, 3)],
      },
    ],
    secondaryLinkGroups: [
      {
        label: "Body type",
        links: [...browseBodyTypeLinks.slice(0, 3)],
      },
      {
        label: "Fuel & drive",
        links: [
          ...browseFuelLinks.slice(0, 2),
          { label: "Automatics", href: routes.usedCarsAutomatic },
        ],
      },
      {
        label: "More ways to browse",
        links: [
          { label: "Cheap to run", href: routes.cheapToRun },
          {
            label: "Cars in Bury",
            href: getLocationStockUrl("bury"),
          },
          {
            label: "Cars in Chorley",
            href: getLocationStockUrl("chorley"),
          },
        ],
      },
    ],
    cards: [
      {
        title: "30 day guarantee",
        description: guaranteeCopy.proofDetail,
        href: routes.thirtyDayGuarantee,
        icon: "check",
      },
      {
        title: "How it works",
        description: "From browsing to collecting or delivery, step by step.",
        href: routes.howItWorks,
        icon: "info",
      },
      {
        title: "Price drops",
        description: "The biggest recent reductions across our stock.",
        href: routes.priceDrops,
        icon: "finance",
      },
    ],
    sideLabel: "Questions",
    sideLinks: [
      { label: "Can I reserve online?", href: getFaqUrl("reserve-online") },
      { label: "Where can I view a car?", href: getFaqUrl("view-a-car") },
      { label: "Can you deliver?", href: getFaqUrl("delivery") },
    ],
  },
  finance: {
    linkGroups: [
      {
        label: "Monthly budget",
        links: [...browseMonthlyBudgetLinks],
      },
    ],
    cards: [
      {
        title: "Check my rate",
        description:
          "See a personalised finance profile, with no impact on your credit score",
        href: routes.eligibilityQuestions,
        icon: "check",
      },
      {
        title: "0% finance",
        description: "0% APR on any car in stock, subject to status",
        href: routes.interestFree,
        icon: "percent",
      },
    ],
    sideLabel: "Questions",
    sideLinks: [
      {
        label: "Will checking affect my credit score?",
        href: getFaqUrl("credit-score"),
      },
      { label: "HP or PCP?", href: getFaqUrl("hp-or-pcp") },
    ],
  },
  sell: {
    listLabel: "Sell",
    links: [
      {
        label: "Sell my car",
        href: routes.sellMyCar,
      },
    ],
    cards: [
      {
        title: "Part exchange",
        description: "Use your current car towards the next one",
        href: routes.partExchange,
        icon: "exchange",
        featured: true,
      },
    ],
    sideLabel: "Questions",
    sideLinks: [
      { label: "How is my car valued?", href: getFaqUrl("how-valued") },
    ],
  },
  servicing: {
    listLabel: "Browse",
    links: [
      { label: "Servicing", href: routes.service },
      { label: "Manufacturer servicing", href: routes.servicingAudi },
      { label: "MOT", href: routes.mot },
      {
        label: "60 minute diagnostic",
        href: getBookingUrl({ type: "diagnostic" }),
      },
      { label: "Service plans", href: routes.servicingPlans },
    ],
    cards: [
      {
        title: "Book a service or MOT",
        description: "Arrange servicing, an MOT or a diagnostic at Oakwood",
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
    sideLabel: "Questions",
    sideLinks: [
      { label: "When is my MOT due?", href: getFaqUrl("mot-due") },
      {
        label: "How do I claim on my warranty?",
        href: getFaqUrl("warranty-claim"),
      },
    ],
  },
  about: {
    listLabel: "Browse",
    links: [
      { label: "About us", href: routes.about, arrow: true },
      { label: "Reviews", href: routes.ourOnlineReviews, arrow: true },
      { label: "Bury", href: `${routes.locations}/bury`, arrow: true },
      { label: "Chorley", href: `${routes.locations}/chorley`, arrow: true },
      { label: "AA standards", href: routes.aaStandards, arrow: true },
      { label: "Our garage", href: routes.ourGarage, arrow: true },
    ],
    cards: [
      {
        title: "Visit us",
        description: "See cars at our Bury and Chorley showrooms",
        href: routes.locations,
        icon: "pin",
      },
      {
        title: "Contact",
        description: "Phone, email or a callback from the team",
        href: routes.contact,
        icon: "info",
      },
    ],
    sideLabel: "Questions",
    sideLinks: [
      { label: "Do I need an account?", href: getFaqUrl("need-account") },
      { label: "How do I contact you?", href: getFaqUrl("contact-you") },
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
  percent: Percent,
};

function MenuGlyph({ name }: { name: MenuIcon }) {
  const Icon = menuIcons[name];
  return (
    <Icon aria-hidden className="h-8 w-8 text-primary" strokeWidth={1.75} />
  );
}

function gridTemplate(
  browseCols: number,
  hasCards: boolean,
  cardSlots: number,
  hasSide: boolean,
): string {
  const cols: string[] = [];
  for (let i = 0; i < browseCols; i += 1) {
    cols.push("minmax(10rem,12.5rem)");
  }
  if (hasCards) {
    cols.push(`minmax(${Math.max(cardSlots, 1) * 10.5}rem, ${cardSlots}fr)`);
  }
  if (hasSide) cols.push("minmax(10rem,13rem)");
  return cols.join(" ");
}

function MenuLinkItem({
  link,
  onNavigate,
}: {
  link: SectionMenuLink;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={link.href}
        className="flex items-center gap-1.5 rounded-md py-1 text-[0.84rem] leading-snug text-ink no-underline hover:underline"
        onClick={onNavigate}
        {...(link.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
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
            className="h-3 w-3 shrink-0"
            strokeWidth={1.75}
          />
        ) : null}
      </Link>
    </li>
  );
}

function MenuLinkList({
  label,
  links,
  onNavigate,
  headingId,
}: {
  label: string;
  links: SectionMenuLink[];
  onNavigate: () => void;
  headingId?: string;
}) {
  return (
    <div>
      <p
        id={headingId}
        className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-secondary"
      >
        {label}
      </p>
      <ul className="mt-2.5 space-y-0.5">
        {links.map((link) => (
          <MenuLinkItem
            key={link.href + link.label + (link.price ?? "")}
            link={link}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

function MenuLinkGroups({
  groups,
  onNavigate,
}: {
  groups: SectionMenuGroup[];
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <MenuLinkList
          key={group.label}
          label={group.label}
          links={group.links}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
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
  const primaryGroups =
    menu.linkGroups ??
    (menu.links?.length
      ? [{ label: menu.listLabel ?? "Browse", links: menu.links }]
      : []);
  const secondaryGroups =
    menu.secondaryLinkGroups ??
    (menu.secondaryLinks?.length
      ? [
          {
            label: menu.secondaryListLabel ?? "Browse",
            links: menu.secondaryLinks,
          },
        ]
      : []);
  const browseCols =
    (primaryGroups.length > 0 ? 1 : 0) + (secondaryGroups.length > 0 ? 1 : 0);
  const hasSide = menu.sideLinks.length > 0;
  const hasCards = menu.cards.length > 0;
  const hasFeatured = menu.cards.some((card) => card.featured);
  const cardSlots = !hasCards
    ? 0
    : hasFeatured
      ? Math.max(2, menu.cards.length)
      : menu.cards.length;
  const template = gridTemplate(browseCols, hasCards, cardSlots, hasSide);

  return (
    <div
      className="grid grid-cols-1 items-start gap-6 lg:gap-4 lg:[grid-template-columns:var(--menu-cols)] xl:gap-5"
      style={{ ["--menu-cols" as string]: template }}
    >
      {primaryGroups.length > 0 ? (
        <MenuLinkGroups groups={primaryGroups} onNavigate={onNavigate} />
      ) : null}

      {secondaryGroups.length > 0 ? (
        <MenuLinkGroups groups={secondaryGroups} onNavigate={onNavigate} />
      ) : null}

      {hasCards ? (
        <div
          className={cn(
            "grid grid-cols-1 items-stretch gap-3 self-start sm:grid-cols-2",
            cardSlots >= 3 && "xl:grid-cols-3",
            cardSlots === 2 && "xl:grid-cols-2",
            cardSlots === 1 && "xl:grid-cols-1",
          )}
        >
          {menu.cards.map((card) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              onClick={onNavigate}
              {...(card.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "group flex h-full min-h-[10.5rem] flex-col rounded-[12px] bg-white p-4 text-ink no-underline transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(66,69,78,0.12)]",
                card.featured && "sm:col-span-2",
              )}
            >
              <MenuGlyph name={card.icon} />
              <span className="mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold group-hover:underline">
                {card.title}
                <ArrowRight
                  aria-hidden
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />
              </span>
              <span className="mt-1.5 flex-1 text-[0.8rem] leading-relaxed text-secondary">
                {card.description}
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {hasSide ? (
        <div>
          <p
            id={labelledBy}
            className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-secondary"
          >
            {menu.sideLabel}
          </p>
          <ul className="mt-2.5 space-y-2" aria-labelledby={labelledBy}>
            {menu.sideLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="block text-[0.84rem] leading-snug text-ink no-underline hover:underline"
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
