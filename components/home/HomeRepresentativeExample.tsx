import Link from "next/link";
import { FinanceDisclaimer } from "@/components/finance/FinanceDisclaimer";
import { FinanceSummary } from "@/components/finance/FinancePrimitives";
import { getFinanceCalculatorUrl } from "@/config/routes";
import {
  getExampleApr,
  getRepresentativeFinanceExample,
} from "@/lib/finance/representative-example";

export function HomeRepresentativeExample() {
  const example = getRepresentativeFinanceExample();
  if (!example) {
    return null;
  }

  const title = `${example.year} ${example.make} ${example.model}`;

  return (
    <article
      aria-labelledby="home-representative-example-heading"
      className="rounded-[28px] bg-white p-6 sm:p-8"
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
        Representative example
      </p>
      <h3
        id="home-representative-example-heading"
        className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl"
      >
        {title}
      </h3>
      {example.derivative ? (
        <p className="mt-1 text-sm text-secondary">{example.derivative}</p>
      ) : null}
      <div className="mt-5">
        <FinanceSummary
          monthly={example.monthlyPayment}
          cash={example.cashPrice}
          apr={getExampleApr(example)}
          deposit={example.deposit}
          term={example.term}
          totalPayable={example.totalPayable}
          financeType={example.financeType}
          state="representative"
          showDisclaimer={false}
        />
      </div>
      <div className="mt-5">
        <FinanceDisclaimer personalised={false} />
      </div>
      <p className="mt-5">
        <Link
          href={getFinanceCalculatorUrl({ stockId: example.stockId })}
          className="text-sm font-semibold text-primary-secondary no-underline hover:underline"
        >
          Calculate this example
        </Link>
      </p>
    </article>
  );
}
