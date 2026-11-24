"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  MessageSquareText,
  Phone,
  PhoneCall,
} from "lucide-react";
import {
  CarPickerSheet,
  CoverRow,
  QuotePanel,
} from "@/components/finance/shared";
import { Container, Section } from "@/components/layout/Container";
import { IconArrow } from "@/components/ui/icons";
import { submitNegEquityLead } from "@/features/finance/negative-equity-actions";
import { useNegativeEquityBuilder } from "@/features/finance/negative-equity/hooks/useNegativeEquityBuilder";
import type { NegEquityStockCar } from "@/features/finance/negative-equity/types";
import {
  APPOINTMENT_SLOTS,
  NEG_EQUITY_CONTACT,
  dayLabel,
  smsHref,
  telHref,
  whatsappHref,
} from "@/lib/finance/negative-equity/contact";
import {
  BLOCKED_COPY,
  MAX_LTV,
  NEG_EQUITY_COPY,
  PROOF,
} from "@/lib/finance/negative-equity";
import { estimateSettlement } from "@/lib/finance/negative-equity/settlement";
import { quoteText } from "@/lib/finance/negative-equity/quote-text";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";
import type { NegEquityLeadSource } from "@/features/finance/negative-equity-store";

const cardClass =
  "rounded-[24px] border border-[#E7EEF4] bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]";
const headingClass =
  "mt-3 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#002852]";
const inputClass =
  "mt-2 min-h-12 w-full rounded-[14px] border border-[#D0D5DD] bg-white px-4 text-base font-semibold text-[#002852] placeholder:font-normal placeholder:text-[#98A2B3] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/25";
const primaryBtnClass =
  "min-h-12 w-full rounded-[14px] bg-[#002852] text-button text-white hover:bg-[#001c3d] disabled:opacity-60";


export function NegativeEquityBuilder({
  cars,
  initialStockId,
}: {
  cars: NegEquityStockCar[];
  initialStockId: string | null;
}) {
  const b = useNegativeEquityBuilder(cars, initialStockId);
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [estMonthly, setEstMonthly] = useState("");
  const [estRemaining, setEstRemaining] = useState("");
  const [estBalloon, setEstBalloon] = useState("");
  const [bookSite, setBookSite] = useState(0);
  const [bookDay, setBookDay] = useState(0);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [bestTime, setBestTime] = useState("");

  const estimated = useMemo(() => {
    const m = Number(estMonthly.replace(/[^\d]/g, "")) || 0;
    const n = Number(estRemaining.replace(/[^\d]/g, "")) || 0;
    const bal = Number(estBalloon.replace(/[^\d]/g, "")) || 0;
    return estimateSettlement(m, n, bal);
  }, [estMonthly, estRemaining, estBalloon]);

  const message = b.quote ? quoteText(b.quote) : "";

  function openCapture(kind: typeof b.capture) {
    setFormError(null);
    setBookTime(null);
    b.setCapture(kind);
  }

  function submit(source: NegEquityLeadSource) {
    setFormError(null);
    startTransition(async () => {
      const day = dayLabel(bookDay);
      const result = await submitNegEquityLead({
        source,
        name,
        email,
        telephone,
        bestTime: source === "callback" ? bestTime : undefined,
        site:
          source === "appointment"
            ? NEG_EQUITY_CONTACT.sites[bookSite]
            : undefined,
        date:
          source === "appointment"
            ? day.date.toISOString().slice(0, 10)
            : undefined,
        time: source === "appointment" ? bookTime ?? undefined : undefined,
        stockId: b.vehicle?.id,
        quoteSummary: message,
        twoAgreements: source === "apply",
      });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      b.setCapture("done");
    });
  }

  if (!b.vehicle || !b.quote) {
    return (
      <p className="px-4 py-8 text-muted">
        No cars are available to quote right now.
      </p>
    );
  }

  const q = b.quote;
  const e = b.equity;
  const ltvPct = Math.min(100, (q.ltv / MAX_LTV) * 100);
  const ltvOver = q.ltv > MAX_LTV;
  const ltvHot = !ltvOver && q.ltv > MAX_LTV * 0.9;

  return (
    <div>
      {/* Movement 1: equity inputs + amber/green panel */}
      <Section>
        <Container>
        <p className="text-sm font-semibold text-primary-secondary">
          {NEG_EQUITY_COPY.sectionEquity}
        </p>
        <h2 className={headingClass}>
          What do you owe, and what is the car worth?
        </h2>
        <p className="mt-3 max-w-2xl text-body text-muted">
          {NEG_EQUITY_COPY.sectionEquityLede}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Field
            label="Registration"
            value={b.reg}
            onChange={b.setReg}
            placeholder="AB12 CDE"
          />
          <Field
            label="Mileage"
            value={b.mileage}
            onChange={b.setMileage}
            placeholder="45,000"
            inputMode="numeric"
          />
        </div>
        <button
          type="button"
          onClick={b.applyValuationFromForm}
          className={cn(primaryBtnClass, "mt-2.5")}
        >
          Value my car
        </button>

        <label className="mt-4 block text-sm font-semibold text-[#002852]">
          Settlement figure
          <input
            value={b.settlement ? formatPounds(b.settlement) : ""}
            onChange={(ev) => {
              b.setSettlement(
                Number(ev.target.value.replace(/[^\d]/g, "")) || 0,
              );
              b.setOwnFigures(true);
            }}
            className={cn(inputClass, "tabular-nums")}
          />
        </label>

        <button
          type="button"
          onClick={() => b.setEstimatorOpen(!b.estimatorOpen)}
          className="mt-3 text-left text-sm font-semibold text-[#0097DB] underline underline-offset-2"
        >
          I do not know my settlement figure
        </button>

        <div
          hidden={!b.estimatorOpen}
          className={cn(cardClass, "mt-3 p-5 sm:p-6")}
        >
          <b className="block text-lg font-semibold text-[#002852]">
            Rough settlement
          </b>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Three things off your agreement or your bank statement. This is an
            estimate, not a quote, and we will confirm the real figure with your
            lender before anything is signed.
          </p>
          <div className="mt-3 grid gap-2">
            <Field
              label="Monthly payment"
              value={estMonthly}
              onChange={setEstMonthly}
              inputMode="numeric"
            />
            <Field
              label="Payments remaining"
              value={estRemaining}
              onChange={setEstRemaining}
              inputMode="numeric"
            />
            <Field
              label="Final or balloon payment, if you have one"
              value={estBalloon}
              onChange={setEstBalloon}
              inputMode="numeric"
            />
          </div>
          {estimated != null ? (
            <div className="mt-3 rounded-[16px] bg-[#F7FAFC] px-4 py-3.5">
              <p className="text-sm font-semibold text-muted">Roughly</p>
              <p className="mt-1 text-[2rem] font-semibold tracking-[-0.03em] tabular-nums text-[#002852]">
                {formatPounds(estimated)}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-muted">
                Based on {estRemaining} payment
                {estRemaining === "1" ? "" : "s"} of {formatPounds(Number(estMonthly.replace(/[^\d]/g, "")) || 0)}
                {Number(estBalloon.replace(/[^\d]/g, ""))
                  ? ` and a ${formatPounds(Number(estBalloon.replace(/[^\d]/g, "")))} final payment`
                  : ""}
                . The real figure will differ a little either way.
              </p>
              <button
                type="button"
                onClick={() => {
                  b.setSettlement(estimated);
                  b.setOwnFigures(true);
                  b.setEstimatorOpen(false);
                }}
                className={cn(primaryBtnClass, "mt-3")}
              >
                Use {formatPounds(estimated)}
              </button>
            </div>
          ) : null}
        </div>

        {e.known && e.negative > 0 ? (
          <div className="mt-4 rounded-[24px] border border-[#F5D9A8] bg-[#FEF0C7] p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#8A5A00]">
              Negative equity
            </p>
            <p className="mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#002852]">
              {formatPounds(e.negative)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#3d4f63]">
              You owe {formatPounds(e.settlement)} and the car is worth{" "}
              {formatPounds(e.valuation)}. That difference is what we would
              settle for you on its own agreement.
            </p>
            <div className="mt-3 space-y-1 border-t border-[#E8D0A0] pt-3 text-sm text-[#3d4f63]">
              <div className="flex justify-between gap-3">
                <span>Your car is worth</span>
                <b className="font-semibold tabular-nums text-[#002852]">
                  {formatPounds(e.valuation)}
                </b>
              </div>
              <div className="flex justify-between gap-3">
                <span>You owe</span>
                <b className="font-semibold tabular-nums text-[#002852]">
                  {formatPounds(e.settlement)}
                </b>
              </div>
            </div>
          </div>
        ) : null}

        {e.known && e.positive > 0 ? (
          <div className="mt-4 rounded-[24px] border border-[#A7E8C7] bg-[#D1FADF] p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#0B6B4A]">
              You have equity
            </p>
            <p className="mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#002852]">
              {formatPounds(e.positive)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#3d4f63]">
              Good news. Your car is worth more than you owe, so{" "}
              {formatPounds(e.positive)} becomes a deposit on the next one.
            </p>
          </div>
        ) : null}

        {/* Proof strip */}
        {e.known && e.negative > 0 ? (
          <div className={cn(cardClass, "mt-4 p-5")}>
            {e.negative > PROOF.most ? (
              <>
                <p className="text-base font-semibold leading-snug text-[#002852]">
                  {formatPounds(e.negative)} is more than we have settled in one
                  go before.
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  That does not make it impossible, but it is not something a
                  calculator should decide. Worth a conversation.
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold leading-snug text-[#002852]">
                  {e.negative < PROOF.typLo
                    ? `${formatPounds(e.negative)} is at the lower end of what we deal with every week.`
                    : e.negative <= PROOF.typHi
                      ? `${formatPounds(e.negative)} puts you right in the middle of where most of our customers are.`
                      : `${formatPounds(e.negative)} is higher than most, and comfortably inside what we have done.`}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Negative equity is ordinary here. It is most of what we sort
                  out.
                </p>
                <div className="mt-4 flex gap-4 border-t border-[#E7EEF4] pt-4">
                  <div className="min-w-0 flex-1">
                    <b className="block text-xl font-semibold tabular-nums tracking-[-0.02em] text-[#002852]">
                      {formatPounds(PROOF.typLo)} to {formatPounds(PROOF.typHi)}
                    </b>
                    <span className="mt-1 block text-xs leading-snug text-muted">
                      Where most of the people we help sit
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block text-xl font-semibold tabular-nums tracking-[-0.02em] text-[#002852]">
                      {formatPounds(PROOF.most)}
                    </b>
                    <span className="mt-1 block text-xs leading-snug text-muted">
                      Most we have settled on one deal
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Movement 2: works strip — do not tone down */}
        {e.known && e.negative > 0 ? (
          b.fitCount > 0 ? (
            <div className="mt-4 rounded-[24px] border-2 border-primary bg-[#ECF3F8] p-5">
              <p className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#0097DB]">
                {b.fitCount}
              </p>
              <p className="mt-2 text-base font-semibold leading-snug text-[#002852]">
                cars in stock work with your {formatPounds(e.negative)}
              </p>
              <p className="mt-1 text-sm leading-snug text-muted">
                Your settlement is already covered in every one of them.
              </p>
              <button
                type="button"
                onClick={() => {
                  b.setOnlyFit(true);
                  b.setPickerOpen(true);
                }}
                className="mt-4 min-h-12 w-full rounded-[14px] bg-[#002852] px-4 text-button text-white hover:bg-[#001c3d] sm:w-auto"
              >
                See them
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-[#F5D9A8] bg-[#FEF0C7] p-5">
              <p className="text-base font-semibold leading-snug text-[#002852]">
                Nothing in stock fits this on its own
              </p>
              <p className="mt-1 text-sm leading-snug text-muted">
                That does not make it impossible. It usually means a bit of cash
                or a different lender. Let us look at it.
              </p>
              <button
                type="button"
                onClick={() => openCapture("human")}
                className="mt-4 min-h-12 w-full rounded-[14px] bg-[#002852] px-4 text-button text-white hover:bg-[#001c3d] sm:w-auto"
              >
                Talk to us
              </button>
            </div>
          )
        ) : null}
        </Container>
      </Section>

      {/* Movement 3: choice + quote */}
      <Section className="bg-[#F7FAFC]!">
        <Container>
        <p className="text-sm font-semibold text-primary-secondary">
          {NEG_EQUITY_COPY.sectionDeal}
        </p>
        <h2 className={headingClass}>A car that works with your figure</h2>
        <p className="mt-3 max-w-2xl text-body text-muted">
          {NEG_EQUITY_COPY.sectionDealLede}
        </p>

        <button
          type="button"
          onClick={() => b.setPickerOpen(true)}
          className={cn(cardClass, "mt-6 w-full overflow-hidden text-left")}
        >
          <span className="relative block aspect-[16/10] w-full bg-[#ECF3F8]">
            {b.vehicle.imageSrc ? (
              <Image
                src={b.vehicle.imageSrc}
                alt={b.vehicle.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 36rem"
              />
            ) : null}
          </span>
          <span className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
            <span className="min-w-0 flex-1">
              <b className="block text-base font-semibold leading-snug tracking-[-0.02em] text-[#002852]">
                {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
              </b>
              <span className="mt-1 block text-sm text-muted">
                {b.vehicle.derivative}
              </span>
              <span className="mt-1.5 block text-lg font-semibold tabular-nums text-[#002852]">
                {formatPounds(b.vehicle.cashPrice)}
                <span className="text-sm font-normal text-muted">
                  {" "}
                  · {b.vehicle.locationName}
                </span>
              </span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#ECF3F8] text-[#002852]">
              <IconArrow width={18} height={18} />
            </span>
          </span>
        </button>

        <div
          className="mt-5 flex rounded-[16px] bg-white p-1 shadow-[inset_0_0_0_1px_#E7EEF4]"
          role="group"
          aria-label="Finance product"
        >
          {(
            [
              ["hp", "Hire Purchase"],
              ["pcp", "PCP"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={b.product === id}
              onClick={() => b.setProduct(id)}
              className={cn(
                "min-h-11 flex-1 rounded-[12px] text-sm font-semibold",
                b.product === id
                  ? "bg-[#002852] text-white"
                  : "text-[#0097DB]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={cn(cardClass, "mt-5 p-5 sm:p-6")}>
          <p className="text-base font-semibold text-[#002852]">Optional cover</p>
          <p className="mt-1 text-sm text-muted">
            Same prices as our interest free page. Switch on what you want.
          </p>
          {b.coverRows.map((row) => (
            <CoverRow
              key={row.id}
              id={row.id}
              name={row.name}
              description={row.description}
              price={row.price}
              enabled={row.enabled}
              years={row.years}
              hasTerm={row.hasTerm}
              onToggle={() => b.toggleCover(row.id)}
              onYearsChange={(years) =>
                b.setCoverYears(row.id, years as 1 | 2 | 3)
              }
            />
          ))}
          {b.coverAmount > 0 ? (
            <div className="mt-4 flex justify-between border-t border-[#E7EEF4] pt-4 text-base font-semibold text-[#002852]">
              <span>Cover total</span>
              <b className="text-xl tabular-nums tracking-[-0.02em]">
                {formatPounds(b.coverAmount)}
              </b>
            </div>
          ) : null}
        </div>

        <label className={cn(cardClass, "mt-5 block p-5 sm:p-6")}>
          <span className="text-base font-semibold text-[#002852]">
            Extra cash deposit
          </span>
          <input
            type="range"
            min={0}
            max={Math.min(10_000, Math.max(500, q.total))}
            step={50}
            value={Math.min(b.deposit, Math.min(10_000, Math.max(500, q.total)))}
            onChange={(ev) => b.setDeposit(Number(ev.target.value))}
            className="mt-4 w-full accent-[#002852]"
          />
          <div className="mt-2 flex justify-between text-sm font-semibold text-muted">
            <span>£0</span>
            <span className="tabular-nums text-[#002852]">
              {formatPounds(b.deposit)}
            </span>
            <span>
              {formatPounds(Math.min(10_000, Math.max(500, q.total)))}
            </span>
          </div>
          <span className="mt-2 block text-sm text-muted">
            {e.positive > 0
              ? `Your ${formatPounds(e.positive)} of equity is already in. Anything extra reduces both agreements.`
              : "Optional. Anything you put in reduces both agreements."}
          </span>
        </label>

        {/* LTV bar — red only past the limit */}
        <div className={cn(cardClass, "mt-5 p-5 sm:p-6")}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted">Borrowing against the car</span>
            <b className="font-semibold tabular-nums text-[#002852]">
              {(q.ltv * 100).toFixed(0)}% of {formatPounds(q.vehicle.cashPrice)}
            </b>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7EEF4]">
            <i
              className={cn(
                "block h-full rounded-full",
                ltvOver
                  ? "bg-[#B3261E]"
                  : ltvHot
                    ? "bg-[#F79009]"
                    : "bg-[#0097DB]",
              )}
              style={{ width: `${ltvPct}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-snug text-muted">
            {q.reason === "ltv"
              ? "Over our 150% limit. Reduce what you are borrowing or choose a different car."
              : q.ok
                ? q.ltv >= MAX_LTV - 0.02
                  ? "Right on our 150% limit. Anything more and it will not fit, so the figures above are the most we can stretch to on this car."
                  : `Our limit is 150%. You are at ${(q.ltv * 100).toFixed(0)}%, so there is room.`
                : "This part is fine. The 150% limit is not what is holding this deal up."}
          </p>
        </div>

        {/* Quote or blocked */}
        {q.ok ? (
          <QuotePanel
            className="mt-3.5"
            monthlyTotal={q.monthlyTotal}
            subtitle={`Across both agreements. ${
              q.product === "pcp" ? "PCP" : "Hire Purchase"
            } on the car over ${q.term} months${
              q.settlementLoan > 0
                ? `, settlement loan over ${q.settlementTerm} months`
                : ""
            }.`}
            agreements={[
              {
                title: "1. The car",
                monthly: q.carMonthly,
                rows: [
                  {
                    label: `Cash price${q.cover ? " with cover" : ""}`,
                    value: formatPounds(q.total),
                  },
                  { label: "Deposit", value: formatPounds(q.deposit) },
                  {
                    label: "Amount of credit",
                    value: formatPounds(q.carAdvance),
                  },
                  {
                    label: "Term and rate",
                    value: `${q.term} months at 12.9% APR`,
                  },
                  ...(q.gfv
                    ? [
                        {
                          label: "Final payment",
                          value: formatPounds(q.gfv),
                        },
                      ]
                    : []),
                ],
              },
              ...(q.settlementLoan > 0
                ? [
                    {
                      title: "2. The settlement loan",
                      monthly: q.settlementMonthly,
                      rows: [
                        {
                          label: "Clears your old agreement",
                          value: formatPounds(q.settlementLoan),
                        },
                        {
                          label: "Term and rate",
                          value: `${q.settlementTerm} months at 9.9% APR`,
                        },
                        {
                          label: "Cheaper than the car rate",
                          value: "9.9% v 12.9%",
                          emphasise: true,
                        },
                      ],
                    },
                  ]
                : []),
            ]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => openCapture("soft")}
                  className="flex min-h-14 w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-[14px] bg-white py-1.5 pl-3 pr-1.5 text-[#002852] sm:gap-3 sm:pl-5"
                >
                  <span className="min-w-0 flex-1 whitespace-nowrap text-left text-[clamp(0.72rem,3.4vw,0.9375rem)] font-semibold leading-none tracking-[-0.02em]">
                    Check my rate, no credit footprint
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-[#ECF3F8] text-[#002852] sm:h-11 sm:w-11 sm:rounded-[14px]">
                    <IconArrow width={16} height={16} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openCapture("apply")}
                  className="min-h-12 w-full rounded-[14px] border border-white/30 bg-transparent text-button text-white hover:bg-white/10"
                >
                  Apply for this now
                </button>
                <p className="max-w-full px-0.5 text-center text-xs leading-snug text-pretty text-white/70">
                  Applying runs{" "}
                  <b className="font-semibold text-white">
                    two full credit searches
                  </b>
                  , one for each agreement. Checking your rate runs none.
                </p>
                <button
                  type="button"
                  onClick={() => openCapture("save")}
                  className="min-h-10 text-sm font-semibold text-white underline underline-offset-2"
                >
                  Email this quote to me
                </button>
                <p className="text-center text-xs text-white/65">
                  Your {formatPounds(e.valuation)} valuation holds for 7 days.
                </p>
              </>
            }
          />
        ) : (
          <div className="mt-4 rounded-[24px] border border-[#F5D9A8] bg-[#FEF0C7] p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#8A5A00]">
              {BLOCKED_COPY[q.reason === "ok" ? "ltv" : q.reason].eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#002852] sm:text-2xl">
              {BLOCKED_COPY[q.reason === "ok" ? "ltv" : q.reason].heading}
            </h3>
            {b.blockedParagraphs.map((p) => (
              <p key={p} className="mt-2 text-sm leading-relaxed text-[#3d4f63]">
                {p}
              </p>
            ))}
            {q.settlementLoan > 0 && q.settlementLoan <= PROOF.most ? (
              <p className="mt-2 text-sm leading-relaxed text-[#3d4f63]">
                For what it is worth, {formatPounds(q.settlementLoan)} is well
                inside what we settle regularly. It is this car that will not
                carry it, not you.
              </p>
            ) : null}
            {b.fixes.filter((f) => f.kind !== "human").length === 0 ? (
              <p className="mt-2 text-sm leading-relaxed text-[#3d4f63]">
                Nothing we can change on this page gets this one over the line,
                but that is the calculator talking, not a person. A lot of these
                still get done.
              </p>
            ) : null}
            <div className="mt-4 grid gap-2">
              {b.fixes.map((fix) => (
                <button
                  key={`${fix.kind}-${fix.label}`}
                  type="button"
                  onClick={() => b.applyFix(fix)}
                  className="min-h-12 rounded-[14px] bg-white px-4 text-left text-sm font-semibold text-[#002852] shadow-[inset_0_0_0_1px_#E7EEF4]"
                >
                  {fix.label}{" "}
                  <b className="text-[#0097DB]">{fix.hint}</b>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Representative examples — never on declined deals */}
        <div className="mt-5 space-y-3">
          {q.ok ? (
            <>
              <RepExample
                title="Representative example, the car"
                rows={[
                  ["Cash price of goods", formatPounds(q.total)],
                  ["Deposit", formatPounds(q.deposit)],
                  ["Total amount of credit", formatPounds(q.carAdvance)],
                  ["Duration", `${q.term} months`],
                  [
                    "Monthly payment",
                    formatPounds(q.carMonthly, { exact: true }),
                  ],
                  ...(q.gfv
                    ? [["Optional final payment", formatPounds(q.gfv)] as const]
                    : []),
                  ["Rate of interest", "12.9% fixed"],
                  [
                    "Total charge for credit",
                    formatPounds(q.carMonthly * q.term + q.gfv - q.carAdvance),
                  ],
                  [
                    "Total amount payable",
                    formatPounds(
                      q.carMonthly * q.term + q.gfv + q.deposit,
                    ),
                  ],
                  ["Representative", "12.9% APR"],
                ]}
              />
              {q.settlementLoan > 0 ? (
                <RepExample
                  title="Representative example, the settlement loan"
                  rows={[
                    [
                      "Total amount of credit",
                      formatPounds(q.settlementLoan),
                    ],
                    ["Duration", `${q.settlementTerm} months`],
                    [
                      "Monthly payment",
                      formatPounds(q.settlementMonthly, { exact: true }),
                    ],
                    ["Rate of interest", "9.9% fixed"],
                    [
                      "Total charge for credit",
                      formatPounds(
                        q.settlementMonthly * q.settlementTerm - q.settlementLoan,
                      ),
                    ],
                    [
                      "Total amount payable",
                      formatPounds(
                        q.settlementMonthly * q.settlementTerm,
                      ),
                    ],
                    ["Representative", "9.9% APR"],
                  ]}
                />
              ) : null}
            </>
          ) : (
            <div className={cn(cardClass, "p-5 text-sm leading-relaxed text-muted")}>
              Build a quote above and the representative example for each
              agreement will appear here in full.
            </div>
          )}
        </div>

        <p className="mt-5 rounded-[16px] border border-[#F5D9A8] bg-[#FEF0C7] px-4 py-3 text-sm leading-relaxed text-[#8A5A00]">
          {NEG_EQUITY_COPY.hardSearchFull}
        </p>
        </Container>
      </Section>

      {/* Movement 4: contact on every state */}
      <Section>
        <Container>
        <p className="text-sm font-semibold text-primary-secondary">Talk to us</p>
        <h2 className={headingClass}>
          {q.ok ? "Rather talk it through?" : "Want a person to look at this?"}
        </h2>
        <p className="mt-3 max-w-2xl text-body text-muted">
          {q.ok
            ? "Whichever you pick, your quote goes with it, so nobody asks you to start again."
            : "The calculator works to one set of rules. We have more room than it does."}
        </p>

        <div className="ne-contact-grid mt-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => openCapture("book")}
            className="inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-left text-white hover:bg-[#001c3d]"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5">
              <CalendarDays className="h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden />
              <span className="min-w-0 leading-snug">
                <span className="block text-button">Book an appointment</span>
                <span className="mt-0.5 block text-xs font-medium text-white/70">
                  Bury or Chorley, pick your time
                </span>
              </span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]">
              <IconArrow width={20} height={20} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => openCapture("callback")}
            className="inline-flex min-h-12 w-full items-center gap-3 rounded-[14px] bg-[#ECF3F8] px-4 text-left text-button text-[#002852] hover:bg-[#E0ECF5]"
          >
            <PhoneCall className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
            <span className="min-w-0 leading-snug">
              Call me back
              <span className="mt-0.5 block text-xs font-medium text-muted">
                Pick a time
              </span>
            </span>
          </button>
          <a
            href={telHref()}
            className="inline-flex min-h-12 w-full items-center gap-3 rounded-[14px] bg-[#ECF3F8] px-4 text-left text-button text-[#002852] no-underline hover:bg-[#E0ECF5]"
          >
            <Phone className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
            <span className="min-w-0 leading-snug">
              Call us now
              <span className="mt-0.5 block text-xs font-medium text-muted">
                Open 7 days
              </span>
            </span>
          </a>
          <a
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center gap-3 rounded-[14px] bg-[#1EA952] px-4 text-left text-button text-white no-underline hover:bg-[#189447]"
          >
            <WhatsAppIcon />
            <span className="min-w-0 leading-snug">
              WhatsApp
              <span className="mt-0.5 block text-xs font-medium text-white/85">
                Quote attached
              </span>
            </span>
          </a>
          <a
            href={smsHref(message)}
            className="inline-flex min-h-12 w-full items-center gap-3 rounded-[14px] bg-[#ECF3F8] px-4 text-left text-button text-[#002852] no-underline hover:bg-[#E0ECF5]"
          >
            <MessageSquareText className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
            <span className="min-w-0 leading-snug">
              Text us
              <span className="mt-0.5 block text-xs font-medium text-muted">
                Quote attached
              </span>
            </span>
          </a>
        </div>

        {/* Capture / booking panels */}
        <div className="mt-3">
          {b.capture === "done" ? (
            <div className="mt-4 flex gap-3 rounded-[24px] border border-[#A7E8C7] bg-[#D1FADF] p-5 text-[#002852]">
              <span>
                <b className="block text-base font-semibold">Got it, thank you</b>
                <span className="mt-1 block text-sm text-[#3d4f63]">
                  Someone will come back to you today. Your reference is held
                  against this quote.
                </span>
              </span>
            </div>
          ) : null}

          {b.capture === "book" ? (
            <div className="mt-4 rounded-[24px] border border-primary bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)] sm:p-6">
              <b className="block text-lg font-semibold text-[#002852]">
                Book an appointment
              </b>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Bring the car you are part exchanging and we will get the real
                settlement figure from your lender while you are here.
              </p>
              <p className="mt-4 text-sm font-semibold text-muted">Showroom</p>
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {NEG_EQUITY_CONTACT.sites.map((site, i) => (
                  <button
                    key={site}
                    type="button"
                    aria-pressed={bookSite === i}
                    onClick={() => setBookSite(i)}
                    className={cn(
                      "min-h-11 flex-none rounded-[14px] px-4 text-sm font-semibold",
                      bookSite === i
                        ? "bg-[#002852] text-white"
                        : "bg-[#ECF3F8] text-[#002852]",
                    )}
                  >
                    {site}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">Day</p>
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                  const label = dayLabel(offset);
                  return (
                    <button
                      key={offset}
                      type="button"
                      aria-pressed={bookDay === offset}
                      onClick={() => setBookDay(offset)}
                      className={cn(
                        "min-h-11 flex-none rounded-[14px] px-4 text-sm font-semibold",
                        bookDay === offset
                          ? "bg-[#002852] text-white"
                          : "bg-[#ECF3F8] text-[#002852]",
                      )}
                    >
                      {label.primary}
                      <span className="block text-xs font-medium opacity-70">
                        {label.secondary}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">Time</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {APPOINTMENT_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={bookTime === slot}
                    onClick={() => setBookTime(slot)}
                    className={cn(
                      "min-h-10 rounded-[12px] text-sm font-semibold tabular-nums",
                      bookTime === slot
                        ? "bg-[#002852] text-white"
                        : "bg-[#ECF3F8] text-[#002852]",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {bookTime ? (
                <div className="mt-4 grid gap-3">
                  <Field label="Full name" value={name} onChange={setName} />
                  <Field
                    label="Mobile"
                    value={telephone}
                    onChange={setTelephone}
                    inputMode="tel"
                  />
                  {formError ? (
                    <p className="text-sm text-danger">{formError}</p>
                  ) : null}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => submit("appointment")}
                    className="min-h-12 rounded-[14px] bg-[#002852] text-button text-white hover:bg-[#001c3d] disabled:opacity-60"
                  >
                    Book{" "}
                    {bookDay < 2
                      ? dayLabel(bookDay).primary
                      : `${dayLabel(bookDay).primary} ${dayLabel(bookDay).secondary}`}{" "}
                    at {bookTime}, {NEG_EQUITY_CONTACT.sites[bookSite]}
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Pick a time to carry on.
                </p>
              )}
              <button
                type="button"
                onClick={() => b.setCapture("")}
                className="mt-3 text-sm font-semibold text-[#0097DB] underline"
              >
                Not now
              </button>
            </div>
          ) : null}

          {b.capture === "soft" ||
          b.capture === "apply" ||
          b.capture === "save" ||
          b.capture === "callback" ||
          b.capture === "human" ? (
            <CaptureForm
              kind={b.capture}
              name={name}
              email={email}
              telephone={telephone}
              bestTime={bestTime}
              error={formError}
              pending={pending}
              onName={setName}
              onEmail={setEmail}
              onTelephone={setTelephone}
              onBestTime={setBestTime}
              onCancel={() => b.setCapture("")}
              onSubmit={() => {
                const map = {
                  soft: "soft-search",
                  apply: "apply",
                  save: "email-quote",
                  callback: "callback",
                  human: "human",
                } as const;
                submit(map[b.capture as keyof typeof map]);
              }}
            />
          ) : null}
        </div>
        </Container>
      </Section>

      <CarPickerSheet
        open={b.pickerOpen}
        onClose={() => b.setPickerOpen(false)}
        cars={b.cars}
        selectedId={b.vehicle.id}
        onSelect={b.setCarId}
        monthlyFor={(car) => b.monthlyFor(car)}
        deposit={b.deposit}
        onDepositChange={b.setDeposit}
        product={b.product}
        onProductChange={b.setProduct}
        onlyFit={b.onlyFit}
        onOnlyFitChange={b.setOnlyFit}
        onlyFitLabel={
          e.negative > 0
            ? `Only cars that work with my ${formatPounds(e.negative)}`
            : null
        }
      />
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.24.68-1.2 1.26-1.97 1.42-.53.11-1.21.2-3.51-.75-2.95-1.22-4.84-4.21-4.99-4.4-.14-.2-1.19-1.58-1.19-3.02s.76-2.14 1.03-2.44c.27-.3.58-.37.78-.37h.56c.18 0 .42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.1.2-.15.32-.3.49s-.31.38-.44.51c-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.36 1.45.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.71.81 2 .96.3.15.49.22.56.34.07.13.07.73-.17 1.41z" />
    </svg>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block text-sm font-semibold text-[#002852]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="mt-2 min-h-12 w-full rounded-[14px] border border-[#D0D5DD] bg-white px-4 text-base font-semibold text-[#002852] placeholder:font-normal placeholder:text-[#98A2B3] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/25"
      />
    </label>
  );
}

function RepExample({
  title,
  rows,
}: {
  title: string;
  rows: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="rounded-[24px] border border-[#E7EEF4] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
      <b className="block text-base font-semibold text-[#002852]">{title}</b>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="mt-1.5 flex justify-between gap-3 text-sm text-muted"
        >
          <span>{label}</span>
          <b className="font-semibold tabular-nums text-[#002852]">{value}</b>
        </div>
      ))}
    </div>
  );
}

function CaptureForm({
  kind,
  name,
  email,
  telephone,
  bestTime,
  error,
  pending,
  onName,
  onEmail,
  onTelephone,
  onBestTime,
  onCancel,
  onSubmit,
}: {
  kind: "soft" | "apply" | "save" | "callback" | "human";
  name: string;
  email: string;
  telephone: string;
  bestTime: string;
  error: string | null;
  pending: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onTelephone: (v: string) => void;
  onBestTime: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const copy = {
    soft: {
      title: "Check your rate in 60 seconds",
      body: "A soft search. It tells you where you stand on both agreements and leaves no mark on your file, whatever the answer.",
      cta: "Check my rate",
      showName: true,
      showTelephone: true,
      showEmail: true,
      showBestTime: false,
    },
    apply: {
      title: "Apply for this deal",
      body: "Two full credit searches, one for each agreement. Both leave a footprint other lenders can see, whether you are accepted or not.",
      cta: "Submit my application",
      showName: true,
      showTelephone: true,
      showEmail: true,
      showBestTime: false,
    },
    save: {
      title: "We will email you this quote",
      body: "Useful if you are off to find your real settlement figure. The quote holds for 7 days and you can pick it straight back up.",
      cta: "Send it over",
      showName: false,
      showTelephone: false,
      showEmail: true,
      showBestTime: false,
    },
    callback: {
      title: "When suits you?",
      body: "Tell us when and we will ring then, not whenever it happens to suit us. Your quote comes up on screen when we call.",
      cta: "Ask us to call",
      showName: true,
      showTelephone: true,
      showEmail: false,
      showBestTime: true,
    },
    human: {
      title: "Let us look at it properly",
      body: "The calculator works to one set of rules. A person has more room than that, and a lot of these get done. No obligation, no credit search.",
      cta: "Ask us to call",
      showName: true,
      showTelephone: true,
      showEmail: false,
      showBestTime: false,
    },
  }[kind];

  return (
    <div className="mt-4 rounded-[24px] border border-primary bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)] sm:p-6">
      <b className="block text-lg font-semibold text-[#002852]">{copy.title}</b>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{copy.body}</p>
      <div className="mt-4 grid gap-3">
        {copy.showName ? (
          <Field label="Full name" value={name} onChange={onName} />
        ) : null}
        {copy.showTelephone ? (
          <Field
            label="Mobile"
            value={telephone}
            onChange={onTelephone}
            inputMode="tel"
          />
        ) : null}
        {copy.showEmail ? (
          <Field
            label="Email"
            value={email}
            onChange={onEmail}
            inputMode="email"
          />
        ) : null}
        {copy.showBestTime ? (
          <Field
            label="Best time, eg this evening"
            value={bestTime}
            onChange={onBestTime}
          />
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="button"
          disabled={pending}
          onClick={onSubmit}
          className="min-h-12 rounded-[14px] bg-[#002852] text-button text-white hover:bg-[#001c3d] disabled:opacity-60"
        >
          {copy.cta}
        </button>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="mt-3 text-sm font-semibold text-[#0097DB] underline"
      >
        Not now
      </button>
    </div>
  );
}
