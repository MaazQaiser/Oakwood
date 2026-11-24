"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Drawer } from "@/components/ui/Dialogs";
import { TERM_STOPS } from "@/lib/finance/interest-free/constants";
import {
  monthlyForVehicle,
  type InterestFreePxInput,
} from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import {
  interpretNaturalLanguage,
  removeNaturalLanguageTerm,
  type NaturalLanguageTerm,
} from "@/lib/vehicles/natural-language";
import { listVehicles } from "@/lib/vehicles/query";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import { ifCard, ifInput } from "@/features/finance/interest-free/ui";
import { cn } from "@/lib/cn";

type SortKey = "mlo" | "mhi" | "plo" | "phi" | "yhi" | "milo";

const EXAMPLES = [
  "automatic suv",
  "electric",
  "under £300 a month",
  "bmw",
  "£5k deposit",
];

export function CarPickerSheet({
  open,
  onClose,
  cars,
  selectedId,
  cashDeposit,
  term,
  px,
  onSelect,
  onDepositChange,
  onTermChange,
}: {
  open: boolean;
  onClose: () => void;
  cars: InterestFreeStockCar[];
  selectedId: string;
  cashDeposit: number;
  term: number;
  px?: InterestFreePxInput | null;
  onSelect: (stockId: string) => void;
  onDepositChange: (value: number) => void;
  onTermChange: (term: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [trans, setTrans] = useState("");
  const [sort, setSort] = useState<SortKey>("mlo");
  const [fromQuery, setFromQuery] = useState<Record<string, boolean>>({});

  const parsed = useMemo(
    () => interpretNaturalLanguage(query, listVehicles("car")),
    [query],
  );

  const bodies = useMemo(() => {
    const set = new Set(cars.map((c) => c.bodyStyle).filter(Boolean) as string[]);
    return [...set].sort();
  }, [cars]);

  function applyQuery(raw: string) {
    setQuery(raw);
    const result = interpretNaturalLanguage(raw, listVehicles("car"));
    const nextFrom: Record<string, boolean> = {};
    if (result.query.transmission) {
      setTrans(String(result.query.transmission));
      nextFrom.trans = true;
    } else if (fromQuery.trans) {
      setTrans("");
    }
    if (result.query.body_style) {
      setBody(String(result.query.body_style));
      nextFrom.body = true;
    } else if (fromQuery.body) {
      setBody("");
    }
    if (result.query.monthly_max) {
      setBudget(Number(result.query.monthly_max));
      nextFrom.budget = true;
    } else if (fromQuery.budget) {
      setBudget(null);
    }
    if (result.query.deposit) {
      onDepositChange(Number(result.query.deposit));
      nextFrom.dep = true;
    }
    // Deposit phrases the shared parser may not extract.
    const lower = ` ${raw.toLowerCase()} `;
    const bm = lower.match(
      /(?:under|below|max|upto|up to)?\s*£?\s*(\d{2,4})\s*(?:a month|pm|per month|p\/m|\/m|month|monthly|mth)/,
    );
    if (bm && !result.query.monthly_max) {
      setBudget(Number(bm[1]));
      nextFrom.budget = true;
    }
    const dm =
      lower.match(/£?\s*(\d{1,3})\s*k\s*(?:deposit|down)/) ||
      lower.match(/£?\s*(\d{3,6})\s*(?:deposit|down)/);
    if (dm) {
      const dep = dm[0].includes("k") ? Number(dm[1]) * 1000 : Number(dm[1]);
      onDepositChange(dep);
      nextFrom.dep = true;
    }
    setFromQuery(nextFrom);
  }

  const matches = useMemo(() => {
    const tokens = parsed.remainder
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const list = cars.filter((c) => {
      if (tokens.length) {
        const hay = [
          c.year,
          c.make,
          c.model,
          c.derivative,
          c.fuelType,
          c.bodyStyle,
          c.transmission,
          c.locationName,
          c.colour,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (tokens.some((t) => !hay.includes(t))) return false;
      }
      if (parsed.query.make) {
        const makeQ = String(parsed.query.make).replace(/-/g, " ");
        const makeSlug = c.make.toLowerCase().replace(/\s+/g, "-");
        if (
          makeSlug !== String(parsed.query.make) &&
          !c.make.toLowerCase().includes(makeQ)
        ) {
          return false;
        }
      }
      if (parsed.query.model) {
        const modelQ = String(parsed.query.model).replace(/-/g, " ");
        if (!c.model.toLowerCase().includes(modelQ)) return false;
      }
      if (
        parsed.query.colour &&
        c.colour?.toLowerCase() !== String(parsed.query.colour).toLowerCase()
      ) {
        return false;
      }
      const effectiveBody =
        body || (parsed.query.body_style ? String(parsed.query.body_style) : "");
      const effectiveTrans =
        trans ||
        (parsed.query.transmission ? String(parsed.query.transmission) : "");
      if (effectiveBody && c.bodyStyle !== effectiveBody) return false;
      if (effectiveTrans && c.transmission !== effectiveTrans) return false;
      const m = monthlyForVehicle(c, cashDeposit, px, term);
      if (budget != null && m.monthly > budget) return false;
      return true;
    });

    const sorter: Record<SortKey, (a: InterestFreeStockCar, b: InterestFreeStockCar) => number> = {
      mlo: (a, b) =>
        monthlyForVehicle(a, cashDeposit, px, term).monthly -
        monthlyForVehicle(b, cashDeposit, px, term).monthly,
      mhi: (a, b) =>
        monthlyForVehicle(b, cashDeposit, px, term).monthly -
        monthlyForVehicle(a, cashDeposit, px, term).monthly,
      plo: (a, b) => a.cashPrice - b.cashPrice,
      phi: (a, b) => b.cashPrice - a.cashPrice,
      yhi: (a, b) => b.year - a.year,
      milo: (a, b) => a.mileage - b.mileage,
    };
    return list.sort(sorter[sort]);
  }, [cars, parsed, body, trans, budget, cashDeposit, px, term, sort]);

  function dropTerm(termItem: NaturalLanguageTerm) {
    const next = removeNaturalLanguageTerm(query, termItem);
    applyQuery(next);
  }

  return (
    <Drawer open={open} title="Choose a car" size="full" onClose={onClose}>
      <div className="space-y-4">
        <input
          className={ifInput}
          placeholder="Try: automatic suv under £300 a month"
          value={query}
          onChange={(e) => applyQuery(e.target.value)}
          autoComplete="off"
        />

        <div className="flex flex-wrap gap-2">
          {parsed.terms.length === 0 && !query ? (
            <>
              <span className="text-caption text-muted">Try</span>
              {EXAMPLES.map((eg) => (
                <button
                  key={eg}
                  type="button"
                  className="rounded-full bg-page-tint px-3 py-1 text-caption font-semibold text-ink"
                  onClick={() => applyQuery(eg)}
                >
                  {eg}
                </button>
              ))}
            </>
          ) : (
            <>
              <span className="text-caption text-muted">Reading that as</span>
              {parsed.terms.map((t) => (
                <button
                  key={`${t.key}-${t.value}`}
                  type="button"
                  className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary"
                  onClick={() => dropTerm(t)}
                >
                  {t.label} ×
                </button>
              ))}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-caption text-muted">
            Deposit
            <input
              className={cn(ifInput, "mt-1 tabular-nums")}
              inputMode="numeric"
              value={cashDeposit ? formatPounds(cashDeposit) : ""}
              onChange={(e) =>
                onDepositChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)
              }
            />
          </label>
          <label className="block text-caption text-muted">
            Most per month
            <input
              className={cn(ifInput, "mt-1 tabular-nums")}
              inputMode="numeric"
              placeholder="Any"
              value={budget ? formatPounds(budget) : ""}
              onChange={(e) => {
                const v = Number(e.target.value.replace(/[^\d]/g, "")) || 0;
                setBudget(v || null);
              }}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {TERM_STOPS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={term === t}
              onClick={() => onTermChange(t)}
              className={`rounded-full px-3 py-1.5 text-caption font-semibold ${
                term === t ? "bg-primary text-white" : "bg-page-tint text-ink"
              }`}
            >
              {t} mo{t <= 18 ? " · 0%" : ""}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={!trans} onClick={() => setTrans("")}>
            Any gearbox
          </Chip>
          {["Manual", "Automatic"].map((x) => (
            <Chip key={x} active={trans === x} onClick={() => setTrans(x)}>
              {x}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={!body} onClick={() => setBody("")}>
            Any body
          </Chip>
          {bodies.map((b) => (
            <Chip key={b} active={body === b} onClick={() => setBody(b)}>
              {b}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-body-sm text-muted">
            {matches.length} {matches.length === 1 ? "car fits" : "cars fit"}
          </p>
          <select
            className="rounded-lg border border-border bg-white px-2 py-1.5 text-body-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="mlo">Monthly, low to high</option>
            <option value="mhi">Monthly, high to low</option>
            <option value="plo">Price, low to high</option>
            <option value="phi">Price, high to low</option>
            <option value="yhi">Newest year</option>
            <option value="milo">Lowest mileage</option>
          </select>
        </div>

        {matches.length === 0 ? (
          <p className="rounded-xl bg-page-tint p-4 text-body-sm text-muted">
            Nothing fits that yet.
            <br />
            Raise your monthly budget, add to your deposit, or lengthen the term.
          </p>
        ) : (
          <ul className="space-y-2 pb-8">
            {matches.map((c) => {
              const r = monthlyForVehicle(c, cashDeposit, px, term);
              return (
                <li key={c.stockId}>
                  <button
                    type="button"
                    aria-pressed={c.stockId === selectedId}
                    className={cn(
                      ifCard,
                      "flex w-full items-center gap-3 overflow-hidden p-2 text-left",
                      c.stockId === selectedId && "border-primary ring-2 ring-primary",
                    )}
                    onClick={() => {
                      onSelect(c.stockId);
                      onClose();
                    }}
                  >
                    <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-page-tint">
                      <Image
                        src={c.imageSrc}
                        alt={c.imageAlt}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      {r.qualifies ? (
                        <span className="absolute left-1 top-1 rounded-full bg-success px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                          0%
                        </span>
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1 py-1">
                      <span className="block truncate text-body font-medium text-navy">
                        {c.year} {c.make} {c.model}
                      </span>
                      <span className="block text-caption text-muted">
                        {c.derivative}
                        <br />
                        {c.transmission} · {c.mileage.toLocaleString("en-GB")} miles ·{" "}
                        {c.locationName}
                      </span>
                    </span>
                    <span className="shrink-0 py-1 pr-1 text-right">
                      <span className="financial-number block text-body text-navy">
                        {formatPounds(r.monthly)}
                      </span>
                      <span className="text-caption text-muted">
                        {r.qualifies ? "a month, 0%" : `a month, ${r.term}mo`}
                        <br />
                        {formatPounds(c.cashPrice)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Drawer>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-caption font-semibold ${
        active ? "bg-primary text-white" : "bg-page-tint text-ink"
      }`}
    >
      {children}
    </button>
  );
}
