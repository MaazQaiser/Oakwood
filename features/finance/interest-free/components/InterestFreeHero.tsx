import Image from "next/image";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  ifBody,
  ifCard,
} from "@/features/finance/interest-free/ui";
import { INTEREST_FREE_COPY } from "@/lib/finance/interest-free/content";
import { buildDeal, minCashDeposit } from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";
import type { InterestFreeStockCar } from "@/features/finance/interest-free/types";
import type { BreadcrumbItem } from "@/lib/seo";
import { cn } from "@/lib/cn";

export function InterestFreeHero({
  car,
  breadcrumbs,
}: {
  car: InterestFreeStockCar | null;
  breadcrumbs?: BreadcrumbItem[];
}) {
  if (!car) {
    return (
      <PageBanner
        title={INTEREST_FREE_COPY.headline}
        breadcrumbs={breadcrumbs}
        width="content"
        description={<p className={ifBody}>{INTEREST_FREE_COPY.lede}</p>}
      />
    );
  }

  const deposit = minCashDeposit(car);
  const deal = buildDeal({ vehicle: car, cashDeposit: deposit, term: 18 });

  return (
    <PageBanner
      title={INTEREST_FREE_COPY.headline}
      breadcrumbs={breadcrumbs}
      width="wide"
      description={<p className={ifBody}>{INTEREST_FREE_COPY.lede}</p>}
    >
      <div className={cn(ifCard, "max-w-md overflow-hidden")}>
        <div className="relative aspect-[16/10] bg-[#ECF3F8]">
          <Image
            src={car.imageSrc}
            alt={car.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em] text-[#002852]">
              {car.year} {car.make} {car.model}
            </p>
            <p className="mt-1 text-sm text-muted">{car.derivative}</p>
          </div>
          <p className="text-[1.75rem] font-semibold leading-none text-[#002852] tabular-nums">
            {formatPounds(deal.monthly, { exact: true })}{" "}
            <span className="text-sm font-normal text-muted">a month</span>
          </p>
          <dl className="space-y-1.5 text-sm">
            <Row label="Cash price" value={formatPounds(car.cashPrice)} />
            <Row label="Oakwood Package" value={formatPounds(deal.pkg.total)} />
            <Row label="Deposit" value={formatPounds(deal.deposit)} />
            <Row label="Amount of credit" value={formatPounds(deal.advance)} />
            <Row label="Interest charged" value="£0" strong />
          </dl>
          <p className="text-xs leading-relaxed text-muted">
            18 monthly payments of{" "}
            <span className="font-semibold text-[#002852]">
              {formatPounds(deal.monthly, { exact: true })}
            </span>
            . Total amount payable{" "}
            <span className="font-semibold text-[#002852]">
              {formatPounds(deal.total)}
            </span>
            .{" "}
            <span className="font-semibold text-[#002852]">0% APR representative.</span>{" "}
            Maximum credit £10,000 over a maximum of 18 months, with at least half the total
            price as a deposit. Oakwood Package included.
          </p>
        </div>
      </div>
    </PageBanner>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd
        className={
          strong
            ? "font-semibold text-[#0B6B4A]"
            : "font-semibold tabular-nums text-[#002852]"
        }
      >
        {value}
      </dd>
    </div>
  );
}
