"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Container, Section } from "@/components/layout/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconPhone,
  IconPin,
} from "@/components/ui/icons";
import { guaranteeConfig } from "@/config/guarantee";
import { reservationConfig } from "@/config/reservation";
import { routes } from "@/config/routes";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPounds } from "@/lib/format/money";
import type { BreadcrumbItem } from "@/lib/seo";
import { toTelHref } from "@/lib/format/phone";
import {
  DAY_NAMES,
  FREE_DELIVERY_MILES,
  OAKWOOD_REASONS,
  findNearestShowroom,
  formatHour,
  getOpenState,
  type NearestShowroomResult,
  type OpenState,
} from "@/lib/locations/visit";

export interface HubStockCar {
  stockId: string;
  href: string;
  title: string;
  image: string;
  transmission: string;
  mileage: number;
  monthly: number;
  interestFree: boolean;
}

export interface HubShowroom {
  slug: "bury" | "chorley";
  name: string;
  href: string;
  address: string;
  telephone?: string;
  photo: string;
  directionsHref: string;
  bookHref: string;
  stockHref: string;
  stockCount: number;
  stock: HubStockCar[];
}

const cardClass =
  "rounded-[24px] border border-[#E7EEF4] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]";
const headingClass =
  "mt-3 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#002852]";

function useOpenState(): OpenState | null {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return state;
}

function OpenNowPill({ state }: { state: OpenState | null }) {
  if (!state) {
    return <div className="h-10" aria-hidden />;
  }
  return (
    <p
      className={cn(
        "inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.75rem] font-semibold sm:px-4 sm:text-sm",
        state.open ? "bg-[#D1FADF] text-[#0B6B4A]" : "bg-[#FEF0C7] text-[#8A5A00]",
      )}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden />
      <span>
        {state.open
          ? `Open now until ${formatHour(state.closes)}`
          : `Closed, opens ${state.opensDay} at ${formatHour(state.opensAt)}`}{" "}
        <span className="whitespace-nowrap font-normal opacity-80">
          · {DAY_NAMES[state.day]}
        </span>
      </span>
    </p>
  );
}

function PostcodeChecker({
  result,
  onCheck,
}: {
  result: NearestShowroomResult | null;
  onCheck: (postcode: string) => void;
}) {
  const [postcode, setPostcode] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    onCheck(postcode);
  }

  return (
    <form onSubmit={submit} className={cn(cardClass, "max-w-xl p-5 sm:p-6")}>
      <label htmlFor="hub-postcode" className="block text-lg font-semibold text-[#002852]">
        Which one is nearer?
      </label>
      <p className="mt-1 text-sm text-muted">
        Pop your postcode in and we will tell you, with the drive time.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          id="hub-postcode"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          placeholder="e.g. BL1 4AB"
          autoComplete="postal-code"
          maxLength={9}
          className="min-h-12 min-w-0 flex-1 rounded-[14px] border border-[#D0D5DD] bg-white px-4 text-base font-semibold uppercase text-[#002852] placeholder:font-normal placeholder:normal-case placeholder:text-[#98A2B3] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/25"
        />
        <button
          type="submit"
          className="min-h-12 shrink-0 rounded-[14px] bg-[#002852] px-5 text-button text-white hover:bg-[#001c3d]"
        >
          Check
        </button>
      </div>
      <div aria-live="polite" className="text-sm leading-relaxed text-[#3d4f63]">
        {result?.status === "invalid" ? (
          <p className="mt-3">Enter a postcode and we will work it out.</p>
        ) : null}
        {result?.status === "unknown" ? (
          <p className="mt-3">
            We do not have a drive time for {result.area} yet.{" "}
            <strong className="text-[#002852]">Both showrooms are listed below</strong>, and
            either will tell you the run from your end if you ring.
          </p>
        ) : null}
        {result?.status === "found" ? (
          <p className="mt-3">
            From {result.town},{" "}
            <strong className="text-[#0B6B4A]">
              {result.nearest === "bury" ? "Bury" : "Chorley"} is your nearest at about{" "}
              {result.nearestMiles} miles.
            </strong>{" "}
            Roughly {result.driveMinutes} minutes outside rush hour.
            {result.inDeliveryArea
              ? " Inside our free delivery area too, if you would rather not travel."
              : null}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function HoursTable({ day }: { day: number | null }) {
  const rows = [
    { label: "Monday to Saturday", hours: "09:00 to 18:00", today: day !== null && day >= 1 },
    { label: "Sunday", hours: "10:00 to 17:00", today: day === 0 },
  ];
  return (
    <dl className="mt-4 rounded-[16px] bg-[#F7FAFC] px-4 py-3 text-sm">
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "py-1",
            row.today ? "font-semibold text-[#002852]" : "text-muted",
          )}
        >
          <dt>
            {row.label}
            {row.today ? " (today)" : null}
          </dt>
          <dd className={cn("mt-0.5 whitespace-nowrap tabular-nums", row.today ? "text-primary" : "text-[#002852]")}>
            {row.hours}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ShowroomCard({
  showroom,
  openState,
  nearestTo,
  distance,
}: {
  showroom: HubShowroom;
  openState: OpenState | null;
  nearestTo: string | null;
  distance: { miles: number; town: string } | null;
}) {
  return (
    <article
      className={cn(
        cardClass,
        "flex flex-col overflow-hidden",
        nearestTo && "border-primary ring-2 ring-primary",
      )}
    >
      <div className="relative aspect-[16/9] bg-[#ECF3F8]">
        <Image
          src={showroom.photo}
          alt={`Oakwood ${showroom.name} showroom`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {nearestTo ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Nearest to {nearestTo}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#002852]">
            <Link href={showroom.href} className="no-underline hover:underline">
              {showroom.name}
            </Link>
          </h3>
          {openState ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                openState.open ? "bg-[#D1FADF] text-[#0B6B4A]" : "bg-[#FEF0C7] text-[#8A5A00]",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
              {openState.open ? "Open now" : "Closed"}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {showroom.address}
          {distance ? (
            <>
              <br />
              <strong className="text-primary">
                {distance.miles} miles from {distance.town}
              </strong>
            </>
          ) : null}
          {showroom.telephone ? (
            <>
              <br />
              <a
                href={toTelHref(showroom.telephone)}
                className="font-semibold text-[#002852] no-underline tabular-nums hover:underline"
              >
                {showroom.telephone}
              </a>
            </>
          ) : null}
        </p>

        <HoursTable day={openState?.day ?? null} />

        <p className="mt-3 text-sm text-muted">
          Used cars, finance, part exchange, servicing, MOT and warranty. Free on site parking.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={showroom.bookHref}
            className="col-span-2 inline-flex min-h-14 items-center justify-between gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-4 pr-1.5 text-white no-underline hover:bg-[#001c3d] sm:pl-5"
          >
            <span className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap text-sm font-semibold sm:text-[length:var(--oak-size-button)]">
              <IconCalendar className="shrink-0" />
              Book a visit to {showroom.name}
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
              <IconArrow width={20} height={20} />
            </span>
          </Link>
          {showroom.telephone ? (
            <a
              href={toTelHref(showroom.telephone)}
              onClick={() =>
                trackEvent(analyticsEvents.locationPhoneClicked, { location: showroom.slug })
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ECF3F8] text-button text-[#002852] no-underline hover:bg-[#E0ECF5]"
            >
              <IconPhone />
              Call
            </a>
          ) : null}
          <a
            href={showroom.directionsHref}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent(analyticsEvents.locationDirectionsClicked, { location: showroom.slug })
            }
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#ECF3F8] text-button text-[#002852] no-underline hover:bg-[#E0ECF5]",
              !showroom.telephone && "col-span-2",
            )}
          >
            <IconPin />
            Directions
          </a>
        </div>
      </div>

      <div className="border-t border-[#E7EEF4] bg-[#F7FAFC] px-5 py-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-[#002852] tabular-nums">
            {showroom.stockCount} car{showroom.stockCount === 1 ? "" : "s"} at {showroom.name}
          </p>
          <Link
            href={showroom.stockHref}
            onClick={() =>
              trackEvent(analyticsEvents.locationStockClicked, { location: showroom.slug })
            }
            className="text-sm font-semibold text-[#0097DB] no-underline hover:underline"
          >
            See all
          </Link>
        </div>
        {showroom.stock.length > 0 ? (
          <ul className="-mx-1 mt-3 flex list-none gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showroom.stock.map((car) => (
              <li key={car.stockId} className="w-40 shrink-0">
                <Link
                  href={car.href}
                  onClick={() =>
                    trackEvent(analyticsEvents.locationStockClicked, {
                      location: showroom.slug,
                      stockId: car.stockId,
                    })
                  }
                  className="block rounded-[16px] border border-[#E7EEF4] bg-white p-2 no-underline hover:border-[#C9D9E6]"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-[12px] bg-[#ECF3F8]">
                    <Image src={car.image} alt="" fill sizes="160px" className="object-cover" />
                    {car.interestFree ? (
                      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-[#12805B] px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                        0%
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 block text-[0.8rem] font-semibold leading-snug text-[#002852]">
                    {car.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {car.transmission} · {Math.round(car.mileage / 1000)}k miles
                  </span>
                  <span className="mt-1.5 block text-lg font-semibold leading-none text-[#002852] tabular-nums">
                    {formatPounds(car.monthly)}{" "}
                    <span className="text-xs font-normal text-muted">a month</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Current stock for this showroom is listed on the used cars page.
          </p>
        )}
      </div>
    </article>
  );
}

export function LocationsHub({
  breadcrumbs,
  showrooms,
}: {
  breadcrumbs: BreadcrumbItem[];
  showrooms: HubShowroom[];
}) {
  const openState = useOpenState();
  const [result, setResult] = useState<NearestShowroomResult | null>(null);
  const found = result?.status === "found" ? result : null;

  const ordered = found
    ? [...showrooms].sort(
        (a, b) => Number(b.slug === found.nearest) - Number(a.slug === found.nearest),
      )
    : showrooms;
  const nearestName = found
    ? showrooms.find((item) => item.slug === found.nearest)?.name
    : null;

  function check(postcode: string) {
    const next = findNearestShowroom(postcode);
    setResult(next);
    if (next.status === "found") {
      window.requestAnimationFrame(() =>
        document.getElementById("showrooms")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  return (
    <>
      <PageBanner
        breadcrumbs={breadcrumbs}
        title="Two showrooms, 500 cars, open seven days"
        description="Bury and Chorley, and over 25 years of doing this. Every car AA inspected before it is advertised, six month warranty as standard, and no admin fees on any of them."
      >
        <OpenNowPill state={openState} />
        <div className="mt-6">
          <PostcodeChecker result={result} onCheck={check} />
        </div>
      </PageBanner>

      <Section id="showrooms">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Showrooms</p>
          <h2 className={headingClass}>
            {nearestName ? `${nearestName} is your nearest` : "Both showrooms"}
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            {nearestName
              ? "Shown first below. The other one is listed underneath, and we move cars between the two."
              : "Same stock, same prices, same people. The only difference is the drive."}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {ordered.map((showroom) => (
              <ShowroomCard
                key={showroom.slug}
                showroom={showroom}
                openState={openState}
                nearestTo={found?.nearest === showroom.slug ? found.town : null}
                distance={
                  found ? { miles: found.miles[showroom.slug], town: found.town } : null
                }
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Reserve before you travel</p>
          <h2 className={headingClass}>Seen one you like?</h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            You do not have to gamble on it still being there when you arrive.
          </p>
          <div className="mt-8 rounded-[24px] bg-[#002852] p-6 text-white sm:p-8">
            <h3 className="text-xl font-semibold sm:text-2xl">
              {formatPounds(reservationConfig.amount)} holds any car for{" "}
              {reservationConfig.holdDurationDays} days
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              It is a card authorisation, not a payment. We never take the money, it simply
              drops off your card when you collect, cancel or the{" "}
              {reservationConfig.holdDurationDays} days run out. The car comes off sale while
              you decide.
            </p>
            <dl className="mt-6 grid gap-4 border-t border-white/15 pt-5">
              {[
                [formatPounds(reservationConfig.amount), "Authorised, never taken"],
                [`${reservationConfig.holdDurationDays} days`, "Held and off sale"],
                [
                  `${guaranteeConfig.periodDays} days`,
                  "To exchange or get your money back",
                ],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl font-semibold tabular-nums sm:text-2xl">{value}</dd>
                  <dd className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 text-caption text-muted">
            Free local delivery within {FREE_DELIVERY_MILES} miles if you would rather not
            travel, though most people prefer to see the car first.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Why Oakwood</p>
          <h2 className={headingClass}>Why people come to us</h2>
          <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
            {OAKWOOD_REASONS.map((reason) => (
              <li key={reason.title} className={cn(cardClass, "flex gap-3 p-5")}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-primary">
                  <IconCheck />
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#002852]">
                    {reason.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {reason.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Next steps</p>
          <h2 className={headingClass}>Before you come</h2>
          <ul className="mt-8 grid list-none gap-3 p-0 md:grid-cols-3">
            {[
              {
                href: routes.eligibility,
                title: "Check what you can borrow",
                body: "Soft search, no mark on your credit file",
              },
              {
                href: routes.partExchange,
                title: "Value your part exchange",
                body: "Reg and mileage, takes a minute",
              },
              {
                href: routes.usedCars,
                title: "Browse all 500 cars",
                body: "Filter by what you want to pay a month",
              },
            ].map((step) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className={cn(
                    cardClass,
                    "flex min-h-20 items-center justify-between gap-3 px-5 py-4 no-underline hover:border-[#C9D9E6]",
                  )}
                >
                  <span>
                    <span className="block text-base font-semibold text-[#002852]">
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{step.body}</span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#ECF3F8] text-[#002852]">
                    <IconArrow width={18} height={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
            {[
              [routes.finance, "Finance"],
              [routes.aftersales, "Aftersales"],
              [routes.ourOnlineReviews, "Reviews"],
              [routes.howItWorks, "How it works"],
              [routes.contact, "Contact"],
              [routes.help, "Help and support"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#002852] no-underline shadow-[0_6px_16px_rgba(16,40,72,0.05)] hover:bg-[#ECF3F8]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-caption text-muted">
            Oakwood Motor Company Ltd. Finance is subject to status and affordability. Oakwood
            Motor Company Ltd is a credit broker, not a lender.
          </p>
        </Container>
      </Section>
    </>
  );
}
