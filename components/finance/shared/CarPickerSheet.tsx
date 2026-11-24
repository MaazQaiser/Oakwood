"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { formatPounds, formatNumber } from "@/lib/format/money";
import { parseQuery } from "@/lib/finance/negative-equity/parse-query";
import { REASON_LABEL, type QuoteReason } from "@/lib/finance/negative-equity/constants";
import { cn } from "@/lib/cn";

export interface PickerCar {
  id: string;
  year: number;
  make: string;
  model: string;
  derivative?: string;
  cashPrice: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyStyle: string;
  locationName?: string;
  image?: string;
}

export interface PickerMonthly {
  monthly: number;
  ok: boolean;
  reason: QuoteReason;
  term: number;
}

export interface CarPickerSheetProps {
  open: boolean;
  onClose: () => void;
  cars: PickerCar[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  monthlyFor: (car: PickerCar) => PickerMonthly;
  deposit: number;
  onDepositChange: (value: number) => void;
  product: "hp" | "pcp";
  onProductChange: (product: "hp" | "pcp") => void;
  onlyFitLabel?: string | null;
  onlyFit?: boolean;
  onOnlyFitChange?: (value: boolean) => void;
  title?: string;
}

type SortKey = "mlo" | "mhi" | "plo" | "phi" | "yhi" | "milo";

const BUDGETS = [200, 300, 400, 500, 600];
const EXAMPLES = [
  "automatic suv",
  "electric",
  "under £300 a month",
  "bmw",
  "£2k deposit",
];

export function CarPickerSheet({
  open,
  onClose,
  cars,
  selectedId,
  onSelect,
  monthlyFor,
  deposit,
  onDepositChange,
  product,
  onProductChange,
  onlyFitLabel,
  onlyFit = false,
  onOnlyFitChange,
  title = "Find a car",
}: CarPickerSheetProps) {
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [body, setBody] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);
  const [fromQuery, setFromQuery] = useState<Record<string, boolean>>({});
  const [more, setMore] = useState(false);
  const [sort, setSort] = useState<SortKey>("mlo");
  const [fit, setFit] = useState(onlyFit);

  useEffect(() => {
    setFit(onlyFit);
  }, [onlyFit]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const bodies = useMemo(
    () => Array.from(new Set(cars.map((c) => c.bodyStyle))).filter(Boolean),
    [cars],
  );
  const fuels = useMemo(
    () => Array.from(new Set(cars.map((c) => c.fuelType))).filter(Boolean),
    [cars],
  );

  function applyRaw(raw: string) {
    setQuery(raw);
    const parsed = parseQuery(raw);
    const nextFrom: Record<string, boolean> = { ...fromQuery };

    if (parsed.transmission) {
      setTransmission(parsed.transmission);
      nextFrom.trans = true;
    } else if (fromQuery.trans) {
      setTransmission("");
      nextFrom.trans = false;
    }
    if (parsed.body) {
      setBody(parsed.body);
      nextFrom.body = true;
    } else if (fromQuery.body) {
      setBody("");
      nextFrom.body = false;
    }
    if (parsed.fuel) {
      setFuel(parsed.fuel);
      nextFrom.fuel = true;
    } else if (fromQuery.fuel) {
      setFuel("");
      nextFrom.fuel = false;
    }
    if (parsed.budget != null) {
      setBudget(parsed.budget);
      nextFrom.budget = true;
    } else if (fromQuery.budget) {
      setBudget(null);
      nextFrom.budget = false;
    }
    if (parsed.deposit != null) {
      onDepositChange(parsed.deposit);
      nextFrom.dep = true;
    }
    if (parsed.transmission || parsed.fuel || parsed.body) {
      setMore(true);
    }
    setTokens(parsed.tokens);
    setFromQuery(nextFrom);
  }

  const matches = useMemo(() => {
    const list = cars.filter((c) => {
      if (tokens.length) {
        const hay =
          `${c.year} ${c.make} ${c.model} ${c.derivative ?? ""} ${c.fuelType} ${c.bodyStyle} ${c.transmission} ${c.locationName ?? ""}`.toLowerCase();
        for (const token of tokens) {
          if (!hay.includes(token)) return false;
        }
      }
      if (body && c.bodyStyle !== body) return false;
      if (transmission && c.transmission !== transmission) return false;
      if (fuel && c.fuelType !== fuel) return false;
      const result = monthlyFor(c);
      if (fit && !result.ok) return false;
      if (budget != null && (!result.ok || result.monthly > budget)) return false;
      return true;
    });

    const byMonthly = (dir: number) => (a: PickerCar, b: PickerCar) => {
      const x = monthlyFor(a);
      const y = monthlyFor(b);
      if (x.ok !== y.ok) return x.ok ? -1 : 1;
      return dir * (x.monthly - y.monthly);
    };

    return list.sort(
      (
        {
          mlo: byMonthly(1),
          mhi: byMonthly(-1),
          plo: (a, b) => a.cashPrice - b.cashPrice,
          phi: (a, b) => b.cashPrice - a.cashPrice,
          yhi: (a, b) => b.year - a.year,
          milo: (a, b) => a.mileage - b.mileage,
        } as Record<SortKey, (a: PickerCar, b: PickerCar) => number>
      )[sort],
    );
  }, [
    cars,
    tokens,
    body,
    transmission,
    fuel,
    fit,
    budget,
    sort,
    monthlyFor,
  ]);

  const activeFilters: string[] = [];
  if (fit && onlyFitLabel) activeFilters.push(onlyFitLabel);
  if (budget != null) activeFilters.push(`under ${formatPounds(budget)} a month`);
  if (transmission) activeFilters.push(transmission.toLowerCase());
  if (fuel) activeFilters.push(fuel.toLowerCase());
  if (body) activeFilters.push(body.toLowerCase());
  for (const token of tokens) activeFilters.push(`"${token}"`);

  const advancedCount =
    (transmission ? 1 : 0) +
    (fuel ? 1 : 0) +
    (body ? 1 : 0) +
    (product === "pcp" ? 1 : 0);

  const chips: { key: string; label: string }[] = [];
  if (fromQuery.trans && transmission)
    chips.push({ key: "trans", label: transmission });
  if (fromQuery.body && body) chips.push({ key: "body", label: body });
  if (fromQuery.fuel && fuel) chips.push({ key: "fuel", label: fuel });
  if (fromQuery.budget && budget != null)
    chips.push({
      key: "budget",
      label: `Under ${formatPounds(budget)} a month`,
    });
  if (fromQuery.dep && deposit)
    chips.push({ key: "dep", label: `${formatPounds(deposit)} deposit` });
  for (const token of tokens) chips.push({ key: `tok:${token}`, label: token });

  function clearAll() {
    setBody("");
    setTransmission("");
    setFuel("");
    setBudget(null);
    setTokens([]);
    setFromQuery({});
    setQuery("");
    setFit(false);
    onOnlyFitChange?.(false);
  }

  function dropChip(key: string) {
    if (key === "dep") {
      onDepositChange(0);
      setFromQuery((f) => ({ ...f, dep: false }));
      return;
    }
    if (key === "budget") {
      setBudget(null);
      setFromQuery((f) => ({ ...f, budget: false }));
      return;
    }
    if (key === "trans") {
      setTransmission("");
      setFromQuery((f) => ({ ...f, trans: false }));
      return;
    }
    if (key === "body") {
      setBody("");
      setFromQuery((f) => ({ ...f, body: false }));
      return;
    }
    if (key === "fuel") {
      setFuel("");
      setFromQuery((f) => ({ ...f, fuel: false }));
      return;
    }
    if (key.startsWith("tok:")) {
      const token = key.slice(4);
      setTokens((t) => t.filter((x) => x !== token));
    }
  }

  return (
    <>
      <div
        hidden={!open}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl bg-page shadow-lg md:inset-y-4 md:right-4 md:left-auto md:w-full md:max-w-md md:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-[17px] font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-md text-[15px] font-semibold text-primary"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <label className="sr-only" htmlFor="ne-picker-q">
            Search cars
          </label>
          <input
            id="ne-picker-q"
            value={query}
            onChange={(e) => applyRaw(e.target.value)}
            placeholder="e.g. automatic SUV under £300"
            className="min-h-12 w-full rounded-lg border border-border-input bg-page px-3 text-[16px] font-semibold tabular-number"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {chips.length ? (
              <>
                <span className="text-[12px] font-semibold text-muted">
                  Reading that as
                </span>
                {chips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[12.5px] font-semibold text-ink"
                  >
                    {chip.key.startsWith("tok:") ? (
                      <b>{chip.label}</b>
                    ) : (
                      chip.label
                    )}
                    {!chip.key.startsWith("tok:") ? (
                      <button
                        type="button"
                        aria-label={`Remove ${chip.label}`}
                        onClick={() => dropChip(chip.key)}
                        className="text-muted"
                      >
                        ×
                      </button>
                    ) : null}
                  </span>
                ))}
              </>
            ) : (
              <>
                <span className="text-[12px] font-semibold text-muted">Try</span>
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => applyRaw(example)}
                    className="rounded-full bg-page-tint px-2.5 py-1 text-[12.5px] font-semibold text-primary"
                  >
                    {example}
                  </button>
                ))}
              </>
            )}
          </div>

          {onlyFitLabel ? (
            <button
              type="button"
              aria-pressed={fit}
              onClick={() => {
                const next = !fit;
                setFit(next);
                onOnlyFitChange?.(next);
              }}
              className={cn(
                "mt-3 min-h-10 w-full rounded-lg px-3 text-left text-[13.5px] font-semibold",
                fit
                  ? "bg-primary text-white"
                  : "bg-page-tint text-ink shadow-[inset_0_0_0_1px_var(--oak-border)]",
              )}
            >
              {onlyFitLabel}
            </button>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip
              pressed={budget == null}
              onClick={() => {
                setBudget(null);
                setFromQuery((f) => ({ ...f, budget: false }));
              }}
            >
              Any budget
            </Chip>
            {BUDGETS.map((value) => (
              <Chip
                key={value}
                pressed={budget === value}
                onClick={() => {
                  setBudget(value);
                  setFromQuery((f) => ({ ...f, budget: false }));
                }}
              >
                Under £{value}
              </Chip>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-[12px] font-semibold text-muted">
              Deposit
              <input
                value={deposit ? formatPounds(deposit) : ""}
                onChange={(e) =>
                  onDepositChange(
                    Number(e.target.value.replace(/[^\d]/g, "")) || 0,
                  )
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-border-input px-3 text-[15px] font-semibold tabular-number"
              />
            </label>
            <label className="text-[12px] font-semibold text-muted">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-1 min-h-11 w-full rounded-lg border border-border-input px-3 text-[15px] font-semibold"
              >
                <option value="mlo">Monthly: low to high</option>
                <option value="mhi">Monthly: high to low</option>
                <option value="plo">Price: low to high</option>
                <option value="phi">Price: high to low</option>
                <option value="yhi">Newest first</option>
                <option value="milo">Lowest mileage</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            aria-expanded={more}
            onClick={() => setMore((v) => !v)}
            className="mt-3 text-[13.5px] font-semibold text-primary underline underline-offset-2"
          >
            {more
              ? "Fewer filters"
              : advancedCount
                ? `${advancedCount} filter${advancedCount > 1 ? "s" : ""} on`
                : "More filters"}
          </button>

          <div hidden={!more} className="mt-2 space-y-2">
            <FilterRow label="Product">
              <Chip
                pressed={product === "hp"}
                onClick={() => onProductChange("hp")}
              >
                Hire Purchase
              </Chip>
              <Chip
                pressed={product === "pcp"}
                onClick={() => onProductChange("pcp")}
              >
                PCP
              </Chip>
            </FilterRow>
            <FilterRow label="Gearbox">
              <Chip
                pressed={!transmission}
                onClick={() => {
                  setTransmission("");
                  setFromQuery((f) => ({ ...f, trans: false }));
                }}
              >
                Any
              </Chip>
              {["Manual", "Automatic"].map((value) => (
                <Chip
                  key={value}
                  pressed={transmission === value}
                  onClick={() => {
                    setTransmission(value);
                    setFromQuery((f) => ({ ...f, trans: false }));
                  }}
                >
                  {value}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Fuel">
              <Chip
                pressed={!fuel}
                onClick={() => {
                  setFuel("");
                  setFromQuery((f) => ({ ...f, fuel: false }));
                }}
              >
                Any
              </Chip>
              {fuels.map((value) => (
                <Chip
                  key={value}
                  pressed={fuel === value}
                  onClick={() => {
                    setFuel(value);
                    setFromQuery((f) => ({ ...f, fuel: false }));
                  }}
                >
                  {value}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Body">
              <Chip
                pressed={!body}
                onClick={() => {
                  setBody("");
                  setFromQuery((f) => ({ ...f, body: false }));
                }}
              >
                Any
              </Chip>
              {bodies.map((value) => (
                <Chip
                  key={value}
                  pressed={body === value}
                  onClick={() => {
                    setBody(value);
                    setFromQuery((f) => ({ ...f, body: false }));
                  }}
                >
                  {value}
                </Chip>
              ))}
            </FilterRow>
          </div>

          <p className="mt-3 text-[13px] font-semibold text-muted">
            {matches.length === 1
              ? "1 car fits"
              : `${matches.length} cars fit`}
          </p>

          {!matches.length ? (
            <div className="mt-3 rounded-xl bg-page-tint p-4">
              <p className="text-[14px] leading-relaxed text-ink">
                Nothing fits that yet.
                {activeFilters.length ? (
                  <>
                    <br />
                    <br />
                    You are asking for{" "}
                    <b>{activeFilters.join(", ")}</b>.
                  </>
                ) : null}
                <br />
                <br />
                Raise your monthly budget, add to your deposit, or start again.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-3 min-h-12 w-full rounded-lg bg-primary text-[15px] font-semibold text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {matches.map((car) => {
                const result = monthlyFor(car);
                return (
                  <li key={car.id}>
                    <button
                      type="button"
                      aria-pressed={car.id === selectedId}
                      onClick={() => {
                        onSelect(car.id);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 py-3 text-left",
                        car.id === selectedId && "bg-primary-soft/60",
                      )}
                    >
                      <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-md bg-page-tint text-[13px] font-semibold text-warning">
                        {result.ok ? "" : "!"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block text-[15px] text-ink">
                          {car.year} {car.make} {car.model}
                        </b>
                        <span className="block text-[12.5px] text-muted">
                          {car.derivative}
                          <br />
                          {car.transmission} · {formatNumber(car.mileage)} miles
                          {car.locationName ? ` · ${car.locationName}` : ""}
                        </span>
                      </span>
                      <span className="flex-none text-right">
                        <b className="block tabular-number text-[16px] text-ink">
                          {result.ok ? formatPounds(result.monthly) : "—"}
                        </b>
                        <span className="block text-[11.5px] text-muted">
                          {result.ok
                            ? `a month, ${result.term}mo`
                            : result.reason !== "ok"
                              ? REASON_LABEL[result.reason]
                              : ""}
                          <br />
                          {formatPounds(car.cashPrice)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function Chip({
  children,
  pressed,
  onClick,
}: {
  children: React.ReactNode;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-md px-3 text-[13px] font-semibold",
        pressed
          ? "bg-primary text-white"
          : "bg-page-tint text-ink shadow-[inset_0_0_0_1px_var(--oak-border)]",
      )}
    >
      {children}
    </button>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-muted">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
