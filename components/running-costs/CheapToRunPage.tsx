"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Container, Section } from "@/components/layout/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconChevron,
  IconMessage,
  IconPhone,
} from "@/components/ui/icons";
import { showroomProfiles } from "@/config/locations";
import { getContactUrl, getVehicleUrl } from "@/config/routes";
import {
  ANNUAL_MILEAGES,
  CASH_PRICE_CAPS,
  DRIVER_AGES,
  INSURANCE_GROUP_CAPS,
  RUNNING_COST_DEPOSIT_RATIO,
  RUNNING_COST_RATES,
  type ChargingAccess,
  type DriverAge,
} from "@/config/running-costs";
import { cn } from "@/lib/cn";
import { REPRESENTATIVE_APR } from "@/lib/finance/interest-free";
import { formatApr, formatPounds } from "@/lib/format/money";
import { toTelHref } from "@/lib/format/phone";
import { vehicleCardImage } from "@/lib/media/stock";
import { vehicleForRunningCost } from "@/lib/running-costs/stock-link";
import {
  budgetSteps,
  formatEfficiency,
  fuelYearly,
  insuranceYearly,
  isElectric,
  monthlyRunningCosts,
  runningCostTerm,
  sortRunningCostCars,
  type DriverProfile,
  type RunningCostCar,
  type RunningCostSort,
} from "@/lib/running-costs";
import type { BreadcrumbItem } from "@/lib/seo";

const cardClass =
  "rounded-[24px] border border-[#E7EEF4] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]";
const headingClass =
  "mt-3 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#002852]";

const SORT_OPTIONS: { value: RunningCostSort; label: string }[] = [
  { value: "total", label: "Cheapest to run" },
  { value: "insurance", label: "Lowest insurance group" },
  { value: "price", label: "Price, low to high" },
  { value: "efficiency", label: "Most efficient" },
  { value: "newest", label: "Newest" },
];

const FIRST_CAR_TIPS = [
  {
    title: "Get the insurance quote before you fall in love with the car",
    body: "Every quote is free and takes minutes. Two cars that look identical on the forecourt can be a thousand pounds apart.",
  },
  {
    title: "A black box usually beats a cheaper car",
    body: "Telematics tends to cut a young driver's premium by more than dropping two insurance groups would.",
  },
  {
    title: "Do not modify it",
    body: "Alloys, exhausts and tints all push the group up or void the policy. Keep it standard until the premium comes down.",
  },
  {
    title: "Finance needs you to be 18 and in work",
    body: "Under 18, or without an income, a parent can take the agreement instead. Plenty do.",
  },
];

interface Filters {
  total: number | null;
  group: number | null;
  fuel: string;
  transmission: string;
  body: string;
  price: number | null;
  location: string;
}

const NO_FILTERS: Filters = {
  total: null,
  group: null,
  fuel: "",
  transmission: "",
  body: "",
  price: null,
  location: "",
};

function Chip({
  pressed,
  onClick,
  tone = "light",
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  tone?: "light" | "white";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors",
        pressed
          ? "bg-[#002852] text-white"
          : tone === "white"
            ? "bg-white text-[#002852] shadow-[0_4px_12px_rgba(16,40,72,0.05)] hover:bg-[#E7F1F8]"
            : "bg-[#ECF3F8] text-[#002852] hover:bg-[#E0ECF5]",
      )}
    >
      {children}
    </button>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="mt-2 flex w-full min-w-0 flex-wrap gap-2"
      >
        {children}
      </div>
    </div>
  );
}

function StatRow({
  items,
  inverse = false,
}: {
  items: { value: string; label: string }[];
  inverse?: boolean;
}) {
  return (
    <dl
      className={cn(
        "mt-6 grid grid-cols-3 gap-4 border-t pt-5",
        inverse ? "border-white/15" : "border-[#D9E6F0]",
      )}
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd
            className={cn(
              "text-xl font-semibold tabular-nums sm:text-2xl",
              inverse ? "text-white" : "text-[#002852]",
            )}
          >
            {item.value}
          </dd>
          <dd
            className={cn(
              "mt-1 text-xs leading-snug sm:text-sm",
              inverse ? "text-white/70" : "text-muted",
            )}
          >
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CarCard({
  car,
  driver,
  cheapest,
  open,
  onToggle,
}: {
  car: RunningCostCar;
  driver: DriverProfile;
  cheapest: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const costs = monthlyRunningCosts(car, driver);
  const vehicle = vehicleForRunningCost(car);
  const breakdown = [
    [`Finance, ${runningCostTerm(car)} months at ${formatApr(REPRESENTATIVE_APR * 100)}`, costs.finance],
    [`Insurance, indication for ${driver.age}`, costs.insurance],
    ["Road tax", costs.roadTax],
    [
      `${
        isElectric(car)
          ? `Charging, ${driver.charging === "home" ? "at home" : "public rapid"}`
          : "Fuel"
      } at ${driver.annualMiles / 1000}k miles`,
      costs.fuel,
    ],
    ["Servicing and wear", costs.servicing],
  ] as const;

  return (
    <article
      className={cn(
        cardClass,
        "flex flex-col overflow-hidden",
        cheapest && "border-[#12805B] ring-2 ring-[#12805B]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[12px] bg-[#ECF3F8]">
          <Image
            src={vehicleCardImage({ stockId: car.id, bodyStyle: car.bodyStyle })}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
          <span className="absolute bottom-1 right-1 rounded-[6px] bg-[#002852]/85 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
            Grp {car.insuranceGroup}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.95rem] font-semibold leading-snug text-[#002852]">
            {car.year} {car.make} {car.model}
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            {car.derivative}
            <br />
            {car.transmission} · {formatEfficiency(car)} · {formatPounds(car.cashPrice)}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-2xl font-semibold leading-none text-[#002852] tabular-nums">
            {formatPounds(costs.total)}
          </span>
          <span className="mt-1 block text-[0.7rem] leading-tight text-muted">
            a month
            <br />
            all in
          </span>
        </span>
      </button>

      {cheapest ? (
        <span className="mx-4 mb-3 inline-flex self-start rounded-full bg-[#D1FADF] px-2.5 py-1 text-xs font-semibold text-[#0B6B4A]">
          Cheapest to run of these
        </span>
      ) : null}

      {open ? (
        <dl className="border-t border-[#E7EEF4] bg-[#F7FAFC] px-4 py-3 text-sm">
          {breakdown.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 py-1 text-muted">
              <dt>{label}</dt>
              <dd className="font-semibold text-[#002852] tabular-nums">{formatPounds(value)}</dd>
            </div>
          ))}
          <div className="mt-1 flex justify-between gap-3 border-t border-[#E7EEF4] pt-2 font-semibold text-[#002852]">
            <dt>Total a month</dt>
            <dd className="tabular-nums">{formatPounds(costs.total)}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-auto grid grid-cols-2 gap-2 p-4 pt-3">
        <Link
          href={vehicle ? getVehicleUrl(vehicle) : "/used-cars"}
          className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#002852] text-button text-white no-underline hover:bg-[#001c3d]"
        >
          See this car
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#ECF3F8] text-button text-[#002852] hover:bg-[#E0ECF5]"
        >
          {open ? "Hide" : "Cost breakdown"}
        </button>
      </div>
    </article>
  );
}

export function CheapToRunPage({
  breadcrumbs,
  cars,
}: {
  breadcrumbs: BreadcrumbItem[];
  cars: RunningCostCar[];
}) {
  const [age, setAge] = useState<DriverAge>("17-19");
  const [annualMiles, setAnnualMiles] = useState<number>(8_000);
  const [charging, setCharging] = useState<ChargingAccess>("home");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sort, setSort] = useState<RunningCostSort>("total");
  const [moreOpen, setMoreOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const driver = useMemo<DriverProfile>(
    () => ({ age, annualMiles, charging }),
    [age, annualMiles, charging],
  );

  function updateDriver(apply: () => void) {
    apply();
    setFilters((current) => ({ ...current, total: null }));
  }

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  const fuels = useMemo(() => [...new Set(cars.map((car) => car.fuelType))], [cars]);
  const bodies = useMemo(() => [...new Set(cars.map((car) => car.bodyStyle))], [cars]);
  const steps = useMemo(() => budgetSteps(cars, driver), [cars, driver]);

  const results = useMemo(() => {
    const matches = cars.filter((car) => {
      if (filters.group && car.insuranceGroup > filters.group) return false;
      if (filters.fuel && car.fuelType !== filters.fuel) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.body && car.bodyStyle !== filters.body) return false;
      if (filters.price && car.cashPrice > filters.price) return false;
      if (filters.location && car.location !== filters.location) return false;
      if (filters.total && monthlyRunningCosts(car, driver).total > filters.total) return false;
      return true;
    });
    return sortRunningCostCars(matches, sort, driver);
  }, [cars, filters, sort, driver]);

  const cheapestTotal = results.length
    ? Math.min(...results.map((car) => monthlyRunningCosts(car, driver).total))
    : null;

  const advancedCount = [
    filters.fuel,
    filters.transmission,
    filters.body,
    filters.price,
    filters.location,
  ].filter(Boolean).length;

  const activeFilters = [
    filters.total ? `under ${formatPounds(filters.total)} a month all in` : null,
    filters.group ? `insurance group ${filters.group} or under` : null,
    filters.fuel.toLowerCase() || null,
    filters.transmission.toLowerCase() || null,
    filters.body.toLowerCase() || null,
    filters.location || null,
    filters.price ? `under ${formatPounds(filters.price)}` : null,
  ].filter((item): item is string => Boolean(item));

  const lowGroupCar = cars.find((car) => car.insuranceGroup === 4) ?? cars[0];
  const highGroupCar = cars.find((car) => car.insuranceGroup === 20) ?? cars[cars.length - 1];

  const electric = sortRunningCostCars(cars.filter(isElectric), "total", driver)[0];
  const petrolMatch =
    electric &&
    [...cars]
      .filter((car) => car.fuelType === "Petrol" && Math.abs(car.cashPrice - electric.cashPrice) < 4_000)
      .sort(
        (a, b) =>
          Math.abs(a.cashPrice - electric.cashPrice) - Math.abs(b.cashPrice - electric.cashPrice),
      )[0];
  const evFuel = electric ? fuelYearly(electric, driver) / 12 : 0;
  const petrolFuel = petrolMatch ? fuelYearly(petrolMatch, driver) / 12 : 0;

  const bury = showroomProfiles.find((profile) => profile.slug === "bury");
  const enquiry = getContactUrl({ topic: "cheap-to-run" });

  return (
    <>
      <PageBanner
        breadcrumbs={breadcrumbs}
        title="The cheapest cars to run, not just to buy"
        description="A first car that costs £6,000 can cost £4,000 a year to insure, and one that costs £11,000 can cost £1,200. The sticker price is the part that matters least. Tell us who is driving and we will show you what each car actually costs a month, all in."
      >
        <div className={cn(cardClass, "max-w-3xl p-5 sm:p-6")}>
          <p className="text-lg font-semibold text-[#002852]">Who is driving?</p>
          <p className="mt-1 text-sm text-muted">
            This changes every figure on the page, insurance most of all.
          </p>
          <div className="mt-5">
            <ChipRow label="Driver age">
              {DRIVER_AGES.map((item) => (
                <Chip
                  key={item.id}
                  pressed={age === item.id}
                  onClick={() => updateDriver(() => setAge(item.id))}
                >
                  {item.id}
                </Chip>
              ))}
            </ChipRow>
            <ChipRow label="Miles a year">
              {ANNUAL_MILEAGES.map((miles) => (
                <Chip
                  key={miles}
                  pressed={annualMiles === miles}
                  onClick={() => updateDriver(() => setAnnualMiles(miles))}
                >
                  {miles / 1000}k miles
                </Chip>
              ))}
            </ChipRow>
            <ChipRow label="Charging, for the electric ones">
              <Chip
                pressed={charging === "home"}
                onClick={() => updateDriver(() => setCharging("home"))}
              >
                I can charge at home
              </Chip>
              <Chip
                pressed={charging === "public"}
                onClick={() => updateDriver(() => setCharging("public"))}
              >
                Public charging only
              </Chip>
            </ChipRow>
          </div>
          <p className="mt-5 border-t border-[#E7EEF4] pt-4 text-sm leading-relaxed text-muted">
            Showing costs for a <strong className="text-[#002852]">{age}</strong> driver
            covering{" "}
            <strong className="text-[#002852]">
              {(annualMiles / 1000).toFixed(0)},000 miles a year
            </strong>
            {charging === "home"
              ? ", charging at home where it is electric."
              : ", on public rapid charging where it is electric."}
          </p>
        </div>
      </PageBanner>

      <Section id="results">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Cheap to run</p>
          <h2 className={headingClass}>What fits</h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            Sorted by what it costs to run, cheapest first. Tap any car to see where the money
            goes.
          </p>

          <div className="mt-6 rounded-[24px] bg-[#F7FAFC] p-5 sm:p-6">
            <ChipRow label="Total a month, everything in">
              <Chip tone="white" pressed={!filters.total} onClick={() => setFilter("total", null)}>
                Any
              </Chip>
              {steps.map((value) => (
                <Chip
                  key={value}
                  tone="white"
                  pressed={filters.total === value}
                  onClick={() => setFilter("total", value)}
                >
                  Under {formatPounds(value)}
                </Chip>
              ))}
            </ChipRow>
            <ChipRow label="Insurance group, no higher than">
              <Chip tone="white" pressed={!filters.group} onClick={() => setFilter("group", null)}>
                Any group
              </Chip>
              {INSURANCE_GROUP_CAPS.map((value) => (
                <Chip
                  key={value}
                  tone="white"
                  pressed={filters.group === value}
                  onClick={() => setFilter("group", value)}
                >
                  Group {value} or under
                </Chip>
              ))}
            </ChipRow>

            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="cheap-to-run-more"
              onClick={() => setMoreOpen((value) => !value)}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-white text-sm font-semibold text-primary shadow-[0_4px_12px_rgba(16,40,72,0.05)] hover:bg-[#E7F1F8]"
            >
              {moreOpen
                ? "Fewer filters"
                : advancedCount
                  ? `${advancedCount} filter${advancedCount > 1 ? "s" : ""} on`
                  : "More filters"}
              <IconChevron
                width={14}
                height={14}
                className={cn("transition-transform", moreOpen && "rotate-180")}
              />
            </button>

            <div id="cheap-to-run-more" hidden={!moreOpen} className="mt-5">
              <ChipRow label="Fuel">
                <Chip tone="white" pressed={!filters.fuel} onClick={() => setFilter("fuel", "")}>
                  Any
                </Chip>
                {fuels.map((value) => (
                  <Chip
                    key={value}
                    tone="white"
                    pressed={filters.fuel === value}
                    onClick={() => setFilter("fuel", value)}
                  >
                    {value}
                  </Chip>
                ))}
              </ChipRow>
              <ChipRow label="Gearbox">
                <Chip
                  tone="white"
                  pressed={!filters.transmission}
                  onClick={() => setFilter("transmission", "")}
                >
                  Any
                </Chip>
                {["Manual", "Automatic"].map((value) => (
                  <Chip
                    key={value}
                    tone="white"
                    pressed={filters.transmission === value}
                    onClick={() => setFilter("transmission", value)}
                  >
                    {value}
                  </Chip>
                ))}
              </ChipRow>
              <ChipRow label="Body">
                <Chip tone="white" pressed={!filters.body} onClick={() => setFilter("body", "")}>
                  Any
                </Chip>
                {bodies.map((value) => (
                  <Chip
                    key={value}
                    tone="white"
                    pressed={filters.body === value}
                    onClick={() => setFilter("body", value)}
                  >
                    {value}
                  </Chip>
                ))}
              </ChipRow>
              <ChipRow label="Cash price">
                <Chip tone="white" pressed={!filters.price} onClick={() => setFilter("price", null)}>
                  Any
                </Chip>
                {CASH_PRICE_CAPS.map((value) => (
                  <Chip
                    key={value}
                    tone="white"
                    pressed={filters.price === value}
                    onClick={() => setFilter("price", value)}
                  >
                    Under {formatPounds(value)}
                  </Chip>
                ))}
              </ChipRow>
              <ChipRow label="Showroom">
                <Chip
                  tone="white"
                  pressed={!filters.location}
                  onClick={() => setFilter("location", "")}
                >
                  Either
                </Chip>
                {["Bury", "Chorley"].map((value) => (
                  <Chip
                    key={value}
                    tone="white"
                    pressed={filters.location === value}
                    onClick={() => setFilter("location", value)}
                  >
                    {value}
                  </Chip>
                ))}
              </ChipRow>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#002852] tabular-nums" aria-live="polite">
              {results.length} {results.length === 1 ? "car" : "cars"}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as RunningCostSort)}
                className="min-h-10 rounded-[12px] border border-[#D0D5DD] bg-white px-3 text-sm font-semibold text-[#002852]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className={cn(cardClass, "mt-4 px-6 py-8 text-center text-sm leading-relaxed text-muted")}>
              <p className="text-base font-semibold text-[#002852]">Nothing fits that.</p>
              {activeFilters.length ? (
                <p className="mt-3">
                  You are asking for{" "}
                  {activeFilters.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? ", " : null}
                      <strong className="text-[#002852]">{item}</strong>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
              <p className="mt-3">
                A {age} driver on a group 20 car is where the money goes. Try a lower group
                first.
              </p>
              <button
                type="button"
                onClick={() => setFilters(NO_FILTERS)}
                className="mt-5 inline-flex min-h-11 items-center rounded-[14px] bg-[#ECF3F8] px-5 text-button text-[#002852] hover:bg-[#E0ECF5]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  driver={driver}
                  cheapest={monthlyRunningCosts(car, driver).total === cheapestTotal}
                  open={Boolean(expanded[car.id])}
                  onToggle={() =>
                    setExpanded((current) => ({ ...current, [car.id]: !current[car.id] }))
                  }
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">The real cost</p>
          <h2 className={headingClass}>Where the money actually goes</h2>
          <div className="mt-8 rounded-[24px] bg-[#ECF3F8] p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#002852]">
              Four costs, and the car price is not one of them
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#3d4f63]">
              Insurance is usually the biggest for anyone under 25, and it is set by the
              insurance group, which is a property of the car and nothing to do with what you
              pay for it. A group 4 car at £8,000 can be half the premium of a group 20 car at
              £6,000.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#3d4f63]">
              Then road tax, which for almost everything here is a flat{" "}
              {formatPounds(RUNNING_COST_RATES.roadTaxStandard)} a year. Then fuel, which is
              where mileage bites. Then servicing, which we fix with a plan so it does not
              arrive as a surprise.
            </p>
            <StatRow
              items={[
                {
                  value: formatPounds(insuranceYearly(lowGroupCar, driver)),
                  label: `A year, group ${lowGroupCar.insuranceGroup}, age ${age}`,
                },
                {
                  value: formatPounds(insuranceYearly(highGroupCar, driver)),
                  label: `A year, group ${highGroupCar.insuranceGroup}, same driver`,
                },
                {
                  value: formatPounds(RUNNING_COST_RATES.roadTaxStandard),
                  label: "Road tax a year, nearly everything",
                },
              ]}
            />
          </div>
          <p className="mt-4 max-w-3xl text-caption text-muted">
            <strong className="text-[#002852]">About the insurance figures.</strong> They are
            indications based on typical market pricing for each car&apos;s insurance group and
            the driver age you chose. They are not quotes, we do not arrange insurance, and your
            own premium will depend on your postcode, licence, claims history, who else drives
            it and plenty besides. Always get a real quote before you commit to a car.
          </p>
        </Container>
      </Section>

      {electric && petrolMatch ? (
        <Section>
          <Container>
            <p className="text-sm font-semibold text-primary-secondary">Electric</p>
            <h2 className={headingClass}>Worth a look at electric</h2>
            <div className="mt-8 rounded-[24px] bg-[#002852] p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                If you can charge at home
              </p>
              <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                {electric.year} {electric.make} {electric.model}, {formatPounds(evFuel)} a month
                to charge
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
                {charging === "home"
                  ? `Against ${formatPounds(petrolFuel)} a month of petrol in the ${petrolMatch.make} ${petrolMatch.model} at the same mileage. Servicing is lower too, because there is far less to go wrong.`
                  : `On public rapid charging only, which at ${(RUNNING_COST_RATES.rapidPerKwh * 100).toFixed(0)}p a unit costs more per mile than petrol. The ${petrolMatch.make} ${petrolMatch.model} would cost you ${formatPounds(petrolFuel)} a month in fuel. Electric only makes sense here if you can charge at home.`}
              </p>
              <StatRow
                inverse
                items={[
                  {
                    value: formatPounds(evFuel),
                    label: `A month to ${charging === "home" ? "charge at home" : "charge publicly"}`,
                  },
                  { value: formatPounds(petrolFuel), label: "Petrol equivalent, same miles" },
                  {
                    value: formatPounds(
                      charging === "home" ? Math.max(0, (petrolFuel - evFuel) * 12) : 0,
                    ),
                    label: "Saved a year on fuel",
                  },
                ]}
              />
            </div>
            <p className="mt-4 max-w-3xl text-caption text-muted">
              Electric cars pay road tax now, at the same{" "}
              {formatPounds(RUNNING_COST_RATES.roadTaxStandard)} standard rate as everything
              else, so the saving is fuel and servicing rather than tax. If you cannot charge at
              home, public rapid charging costs more per mile than petrol and an electric car is
              the wrong answer.
            </p>
          </Container>
        </Section>
      ) : null}

      <Section className="bg-[#F7FAFC]!">
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">First cars</p>
          <h2 className={headingClass}>If this is a first car</h2>
          <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
            {FIRST_CAR_TIPS.map((tip) => (
              <li key={tip.title} className={cn(cardClass, "flex gap-3 p-5")}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-primary">
                  <IconCheck />
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#002852]">{tip.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{tip.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="text-sm font-semibold text-primary-secondary">Get in touch</p>
          <h2 className={headingClass}>Talk it through</h2>
          <p className="mt-3 max-w-2xl text-body text-muted">
            We will tell you honestly which cars a young driver can actually insure, because we
            see the quotes every week.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={enquiry}
              className="inline-flex min-h-16 items-center justify-between gap-3 rounded-[14px] bg-[#002852] py-2 pl-5 pr-2 text-white no-underline hover:bg-[#001c3d] sm:col-span-2 lg:col-span-1"
            >
              <span className="flex items-center gap-3">
                <IconCalendar />
                <span>
                  <span className="block text-button">Book a look round</span>
                  <span className="block text-xs text-white/70">Bury or Chorley, seven days</span>
                </span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
                <IconArrow width={20} height={20} />
              </span>
            </Link>
            {bury?.telephone ? (
              <a
                href={toTelHref(bury.telephone)}
                className="inline-flex min-h-16 items-center gap-3 rounded-[14px] bg-[#ECF3F8] px-5 text-[#002852] no-underline hover:bg-[#E0ECF5]"
              >
                <IconPhone />
                <span>
                  <span className="block text-button">Call us</span>
                  <span className="block text-xs text-muted">Open 7 days</span>
                </span>
              </a>
            ) : null}
            <Link
              href={enquiry}
              className="inline-flex min-h-16 items-center gap-3 rounded-[14px] bg-[#ECF3F8] px-5 text-[#002852] no-underline hover:bg-[#E0ECF5]"
            >
              <IconMessage />
              <span>
                <span className="block text-button">Send us a message</span>
                <span className="block text-xs text-muted">
                  For a {age} driver, {annualMiles / 1000}k miles a year
                </span>
              </span>
            </Link>
          </div>
          <p className="mt-8 max-w-3xl text-caption text-muted">
            Fuel at {(RUNNING_COST_RATES.petrolPerLitre * 100).toFixed(1)}p a litre petrol and{" "}
            {(RUNNING_COST_RATES.dieselPerLitre * 100).toFixed(1)}p diesel, UK averages for the
            week ending {RUNNING_COST_RATES.fuelPricesWeekEnding}. Electricity at{" "}
            {(RUNNING_COST_RATES.homePerKwh * 100).toFixed(0)}p a unit at home and{" "}
            {(RUNNING_COST_RATES.rapidPerKwh * 100).toFixed(0)}p on public rapid chargers. Road
            tax at the {formatPounds(RUNNING_COST_RATES.roadTaxStandard)} standard rate for{" "}
            {RUNNING_COST_RATES.roadTaxYear}. Finance shown at{" "}
            {formatApr(REPRESENTATIVE_APR * 100)} with a{" "}
            {RUNNING_COST_DEPOSIT_RATIO * 100}% deposit over the longest term each car
            qualifies for. Cars shown are illustrative and insurance figures are indications, not
            quotes. All figures are estimates to compare cars with.
          </p>
        </Container>
      </Section>
    </>
  );
}
