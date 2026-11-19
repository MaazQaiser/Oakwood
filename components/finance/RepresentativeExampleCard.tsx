import Link from "next/link";
import { FinanceDisclaimer } from "@/components/finance/FinanceDisclaimer";
import { FinancialNumber } from "@/components/finance/FinancePrimitives";
import {
  assertRepresentativeExample,
  getExampleApr,
  getRepresentativeFinanceExample,
  type RepresentativeFinanceExample,
} from "@/lib/finance/representative-example";
import { formatApr, formatPounds, formatTerm } from "@/lib/format/money";
import { cn } from "@/lib/cn";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-caption text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

/**
 * Single shared representative example. Renders nothing if any required
 * field is missing or the figures do not reconcile.
 */
export function RepresentativeExampleCard({
  example: exampleProp,
  href,
  className,
  tone = "light",
  showDisclaimer = true,
}: {
  example?: RepresentativeFinanceExample;
  href?: string;
  className?: string;
  tone?: "light" | "dark-panel";
  showDisclaimer?: boolean;
}) {
  const example = exampleProp ?? getRepresentativeFinanceExample();
  if (assertRepresentativeExample(example) !== null || !example) {
    return null;
  }

  const apr = getExampleApr(example);
  if (apr === undefined) {
    return null;
  }

  const title = `${example.year} ${example.make} ${example.model}`;
  const financeTypeLabel = example.financeType === "pcp" ? "PCP" : "HP";
  const body = (
    <article
      className={cn(
        "flex min-w-0 flex-col rounded-[24px] p-5 sm:p-6",
        tone === "light"
          ? "bg-page-tint text-ink"
          : "bg-white text-[#002852] shadow-[0_16px_40px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
        Representative example
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] sm:text-xl">
        {title}
      </h3>
      {example.derivative ? (
        <p className="mt-0.5 text-sm text-secondary">{example.derivative}</p>
      ) : null}

      <p className="mt-5 text-caption text-muted">Monthly payment</p>
      <p className="mt-1 text-primary">
        <FinancialNumber
          value={formatPounds(example.monthlyPayment)}
          suffix="/month*"
          size="md"
        />
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <Field label="Cash price" value={formatPounds(example.cashPrice)} />
        <Field label="Deposit" value={formatPounds(example.deposit)} />
        <Field
          label="Total amount of credit"
          value={formatPounds(example.amountFinanced)}
        />
        <Field
          label="Total amount payable"
          value={formatPounds(example.totalPayable)}
        />
        <Field
          label="Term"
          value={`${formatTerm(example.term)} ${financeTypeLabel}`}
        />
        <Field label="APR" value={formatApr(apr)} />
      </dl>

      {showDisclaimer ? (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <FinanceDisclaimer personalised={false} />
        </div>
      ) : null}
    </article>
  );

  if (!href) {
    return body;
  }

  return (
    <Link href={href} className="block no-underline" aria-label={`View ${title}`}>
      {body}
    </Link>
  );
}
