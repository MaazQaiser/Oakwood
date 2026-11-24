import {
  ifBody,
  ifSectionTitle,
  ifSoftPanel,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import {
  buildDeal,
  minCashDeposit,
  type InterestFreeDeal,
} from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import { cn } from "@/lib/cn";

export function ConditionsAndRep({
  deal,
  hero,
}: {
  deal: InterestFreeDeal | null;
  hero: InterestFreeStockCar | null;
}) {
  const example = resolveExample(deal, hero);

  return (
    <section aria-labelledby="if-conditions-heading">
      <h2 id="if-conditions-heading" className={ifSectionTitle}>
        {INTEREST_FREE_COPY.conditionsTitle}
      </h2>
      <ul className="mt-5 space-y-3">
        {INTEREST_FREE_COPY.conditions.map((line) => (
          <li key={line} className="flex gap-3 text-sm text-[#002852]">
            <span className="mt-0.5 font-semibold text-[#0B6B4A]" aria-hidden>
              ✓
            </span>
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>

      {example ? <RepExample deal={example.deal} live={example.live} /> : null}

      <p className="mt-6 text-xs text-muted">{INTEREST_FREE_COPY.brokerDisclaimer}</p>
    </section>
  );
}

function resolveExample(
  deal: InterestFreeDeal | null,
  hero: InterestFreeStockCar | null,
): { deal: InterestFreeDeal; live: boolean } | null {
  if (deal?.showRepresentativeExample) {
    return { deal, live: true };
  }
  if (!hero) return null;
  const cash = minCashDeposit(hero);
  return {
    deal: buildDeal({ vehicle: hero, cashDeposit: cash, term: 18 }),
    live: false,
  };
}

function RepExample({ deal, live }: { deal: InterestFreeDeal; live: boolean }) {
  const { vehicle: c, pkg: p } = deal;
  return (
    <div className={cn(ifSoftPanel, "mt-8 p-5")}>
      <p className="text-base font-semibold text-[#002852]">
        Representative example{live ? " for the deal above" : ""}
      </p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <Row label="Cash price of goods" value={formatPounds(deal.total)} />
        <Row label="Vehicle" value={formatPounds(c.cashPrice)} indent />
        <Row label="Oakwood Package" value={formatPounds(p.total)} indent />
        <Row label="Deposit" value={formatPounds(deal.deposit)} />
        {deal.shortfall > 0 ? (
          <Row
            label="Negative equity added to credit"
            value={formatPounds(deal.shortfall)}
          />
        ) : null}
        <Row label="Total amount of credit" value={formatPounds(deal.advance)} />
        <Row label="Duration" value={`${deal.term} months`} />
        <Row
          label={`${deal.term - 1} monthly payments of`}
          value={formatPounds(deal.regular, { exact: true })}
        />
        <Row
          label="Final payment of"
          value={formatPounds(deal.finalPayment, { exact: true })}
        />
        <Row label="Rate of interest" value="0% fixed" />
        <Row label="Total charge for credit" value="£0" />
        <Row
          label="Total amount payable"
          value={formatPounds(deal.total + deal.shortfall)}
        />
        <Row label="Representative" value="0% APR" />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  indent,
}: {
  label: string;
  value: string;
  indent?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 ${indent ? "pl-3 text-muted" : ""}`}>
      <dt>{label}</dt>
      <dd className="font-semibold tabular-nums text-[#002852]">{value}</dd>
    </div>
  );
}
