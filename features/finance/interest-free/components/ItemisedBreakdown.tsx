import { ifCard, ifLabel } from "@/features/finance/interest-free/ui";
import type { InterestFreeDeal } from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import { cn } from "@/lib/cn";

export function ItemisedBreakdown({ deal }: { deal: InterestFreeDeal }) {
  const { vehicle: c, pkg: p } = deal;

  return (
    <div className={cn(ifCard, "p-5")}>
      <p className={ifLabel}>What you are paying for</p>
      <dl className="mt-3 divide-y divide-[#E7EEF4] text-sm">
        <Row
          label={`${c.year} ${c.make} ${c.model}`}
          value={formatPounds(c.cashPrice)}
        />
        <Row label="Oakwood Package" value={formatPounds(p.total)} />
        <Row label="AA warranty, 3 years" value={formatPounds(p.warranty)} sub />
        <Row label="Service plan, 3 years" value={formatPounds(p.service)} sub />
        <Row label="MOT plan, 3 years" value={formatPounds(p.mot)} sub />
        <Row label="Supagard" value={formatPounds(p.supagard)} sub />
        <Row label="Total price" value={formatPounds(deal.total)} strong />
        {deal.equity > 0 ? (
          <Row
            label="Less your part exchange"
            value={`−${formatPounds(deal.equity)}`}
            tone="success"
          />
        ) : null}
        {deal.shortfall > 0 ? (
          <Row
            label="Negative equity from your part exchange"
            value={`+${formatPounds(deal.shortfall)}`}
            tone="warn"
          />
        ) : null}
        <Row
          label="Less cash deposit"
          value={`−${formatPounds(deal.cashDeposit)}`}
        />
        <Row
          label="Amount of credit"
          value={formatPounds(Math.max(0, deal.advance))}
          strong
        />
        <Row
          label="Charge for credit"
          value={deal.charge === 0 ? "£0" : formatPounds(deal.charge)}
          tone={deal.charge === 0 ? "success" : "warn"}
        />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  strong,
  tone,
}: {
  label: string;
  value: string;
  sub?: boolean;
  strong?: boolean;
  tone?: "success" | "warn";
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-3 py-2.5",
        strong && "text-base font-semibold",
        sub && "pl-3 text-muted",
      )}
    >
      <dt>{label}</dt>
      <dd
        className={cn(
          "tabular-nums font-semibold",
          tone === "success" && "text-[#0B6B4A]",
          tone === "warn" && "text-[#8A5A00]",
          !tone && "text-[#002852]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
