"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Container, Section } from "@/components/layout/Container";
import { getSearchUrl, routes } from "@/config/routes";

const cards = [
  {
    id: "budget",
    title: "Cars under £200",
    copy: "Used cars with a cash price and an example monthly payment.",
    href: getSearchUrl({ monthly_max: 200 }),
    cta: "Shop by budget",
    tone: "blue",
  },
  {
    id: "finance",
    title: "See what you'll pay",
    copy: "Your finance profile follows you, so monthly figures stay personalised.",
    href: routes.eligibility,
    cta: "Check eligibility",
    tone: "pale",
  },
  {
    id: "view",
    title: "Ready to view",
    copy: "Cars at Bury and Chorley, with a cash price beside the monthly example.",
    href: routes.usedCars,
    cta: "Browse used cars",
    tone: "navy",
  },
  {
    id: "history",
    title: "Know the car",
    copy: "History, condition, specification and documents before you buy.",
    href: routes.usedCars,
    cta: "View used cars",
    tone: "ink",
  },
] as const;

const shell: Record<(typeof cards)[number]["tone"], string> = {
  blue: "bg-[#8EBFDF] text-[#002852]",
  pale: "bg-[#F2F4F7] text-[#002852]",
  navy: "bg-[#002852] text-white",
  ink: "bg-[#101828] text-white",
};

function ArrowButton({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-ink hover:bg-page-tint"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path
          d={direction === "prev" ? "M14.5 6 8.5 12l6 6" : "m9.5 6 6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function BudgetVisual() {
  return (
    <div className="mt-auto">
      <p className="text-[3.15rem] font-semibold leading-none tracking-tight tabular-nums">
        £189
        <span className="ml-1 align-baseline text-base font-semibold">/month</span>
      </p>
      <div className="relative mt-3 h-24">
        <Image
          src="/images/promo/budget-car.png"
          alt=""
          fill
          sizes="280px"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function FinanceVisual() {
  return (
    <div className="relative mt-auto h-44">
      <span className="absolute left-[4%] top-6 z-10 flex h-[4.75rem] w-[3.75rem] rotate-[12deg] flex-col items-center rounded-[14px] bg-[#002852] pt-1.5 text-white shadow-md">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        <span className="mt-1 grid h-9 w-9 place-items-center rounded-full border-2 border-white text-lg font-semibold">
          £
        </span>
      </span>
      <div className="absolute inset-x-[-6%] bottom-0 h-32">
        <Image
          src="/images/promo/deal-car.png"
          alt=""
          fill
          sizes="320px"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function CalendarVisual() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  return (
    <div className="mt-auto" aria-hidden="true">
      <div className="grid grid-cols-7 gap-y-1.5 text-center text-[0.68rem] font-medium text-white/40">
        {days.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
        {dates.map((date) =>
          date === 11 ? (
            <span key={date} className="grid place-items-center">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#8EBFDF] text-[#002852]">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <circle cx="8" cy="12" r="3.25" stroke="currentColor" strokeWidth="2" />
                  <path d="M11 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.5 12v2.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 12v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          ) : (
            <span key={date} className="grid h-8 place-items-center">
              {date}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function HistoryVisual() {
  return (
    <div className="relative mt-auto h-44">
      <div className="absolute left-0 top-2 z-10 w-[70%] rounded-2xl bg-white p-3 text-[#002852] shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold leading-tight">Audi A3</p>
            <p className="mt-1 text-xs text-[#667085]">£16,495</p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#8EBFDF] text-[#002852]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path
                d="M12 4.5c2.2 2.4 3.5 4.4 3.5 6.7a3.5 3.5 0 1 1-7 0c0-2.3 1.3-4.3 3.5-6.7Z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path d="M12 13.2v-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 right-[-8%] h-32 w-[84%]">
        <Image
          src="/images/promo/range-car.png"
          alt=""
          fill
          sizes="220px"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}

const visuals = {
  budget: BudgetVisual,
  finance: FinanceVisual,
  view: CalendarVisual,
  history: HistoryVisual,
};

export function WhyOakwood() {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollByPage(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    const distance = Math.round(node.clientWidth * 0.6) * direction;
    node.scrollTo({ left: node.scrollLeft + distance, behavior: "smooth" });
  }

  return (
    <Section>
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h3 text-ink">A simpler way to buy</h2>
          <div className="flex gap-2">
            <ArrowButton direction="prev" label="Show previous reasons" onClick={() => scrollByPage(-1)} />
            <ArrowButton direction="next" label="Show next reasons" onClick={() => scrollByPage(1)} />
          </div>
        </div>
        <ul
          ref={scroller}
          className="mt-6 flex gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => {
            const Visual = visuals[card.id];
            const light = card.tone === "blue" || card.tone === "pale";
            return (
              <li key={card.id} className="w-[17.5rem] shrink-0 lg:w-[calc((100%-3rem)/4)]">
                <Link
                  href={card.href}
                  className={`flex h-full min-h-[27.5rem] flex-col rounded-[22px] p-5 no-underline ${shell[card.tone]}`}
                >
                  <h3 className="text-[1.35rem] font-semibold leading-snug tracking-tight">{card.title}</h3>
                  <p className={`mt-2 text-sm leading-snug ${light ? "text-[#002852]/75" : "text-white/75"}`}>
                    {card.copy}
                  </p>
                  <Visual />
                  <span
                    className={`mt-4 flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold ${
                      light ? "bg-[#002852] text-white" : "bg-white text-[#002852]"
                    }`}
                  >
                    {card.cta}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
