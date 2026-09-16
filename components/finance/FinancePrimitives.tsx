import { cn } from "@/lib/cn";
import { formatApr, formatPounds, formatTerm } from "@/lib/format/money";
import { Skeleton } from "@/components/ui/Loading";
import { Badge } from "@/components/ui/Badge";

export type FinanceDisplayState =
  | "representative"
  | "personalised"
  | "ineligible"
  | "missing"
  | "loading";

export function FinancialNumber({
  value,
  suffix,
  size = "md",
  className,
}: {
  value: string;
  suffix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "financial-number financial-number--lg"
      : size === "sm"
        ? "financial-number financial-number--sm"
        : "financial-number";

  return (
    <span className={cn(sizeClass, className)}>
      {value}
      {suffix ? (
        <span className="text-body-sm font-normal tracking-normal text-muted">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

export function MonthlyPayment({
  amount,
  state = "representative",
  gapAmount,
  size = "lg",
}: {
  amount?: number;
  state?: FinanceDisplayState;
  gapAmount?: number;
  size?: "md" | "lg";
}) {
  if (state === "loading") {
    return (
      <div>
        <p className="text-caption text-muted">Monthly payment</p>
        <Skeleton className="mt-2 h-8 w-28" />
      </div>
    );
  }

  if (state === "missing") {
    return (
      <div>
        <p className="text-caption text-muted">Monthly payment</p>
        <p className="mt-1 text-h3 text-muted">Check my eligibility</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-caption text-muted">
        {state === "personalised"
          ? "Your estimated monthly payment"
          : state === "ineligible"
            ? "Outside your current finance profile"
            : "Monthly payment"}
      </p>
      <p className="mt-1 text-primary">
        <FinancialNumber
          value={amount === undefined ? "—" : formatPounds(amount)}
          suffix={state === "representative" ? "/month*" : "/month"}
          size={size}
        />
      </p>
      {state === "representative" ? (
        <p className="mt-1 text-caption text-muted">Representative example</p>
      ) : null}
      {state === "ineligible" ? (
        <p className="mt-1 text-caption text-warning">
          {gapAmount !== undefined
            ? `${formatPounds(gapAmount)} more deposit may make this affordable.`
            : "Outside your current budget"}
        </p>
      ) : null}
    </div>
  );
}

export function CashPrice({
  amount,
  state = "representative",
}: {
  amount?: number;
  state?: FinanceDisplayState;
}) {
  if (state === "loading") {
    return (
      <div>
        <p className="text-caption text-muted">Cash price</p>
        <Skeleton className="mt-1 h-5 w-20" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-caption text-muted">Cash price</p>
      <p className="mt-1 text-muted">
        <FinancialNumber
          value={amount === undefined ? "—" : formatPounds(amount)}
          size="sm"
          className="text-muted"
        />
      </p>
    </div>
  );
}

export function APR({
  value,
  state = "representative",
}: {
  value?: number;
  state?: FinanceDisplayState;
}) {
  const label =
    state === "personalised" ? "Your APR from" : "APR from";

  return (
    <p className="text-body-sm text-muted">
      {label}{" "}
      <span className="financial-number financial-number--sm text-ink">
        {value === undefined || state === "missing" || state === "loading"
          ? "—"
          : formatApr(value)}
      </span>
    </p>
  );
}

export function Deposit({ amount }: { amount?: number }) {
  return (
    <p className="text-body-sm">
      <span className="text-muted">Deposit </span>
      <span className="financial-number financial-number--sm">
        {amount === undefined ? "—" : formatPounds(amount)}
      </span>
    </p>
  );
}

export function FinanceTerm({ months }: { months?: number }) {
  return (
    <p className="text-body-sm">
      <span className="text-muted">Term </span>
      <span className="financial-number financial-number--sm">
        {months === undefined ? "—" : formatTerm(months)}
      </span>
    </p>
  );
}

export function FinanceBadge({
  state = "representative",
}: {
  state?: FinanceDisplayState;
}) {
  if (state === "personalised") {
    return <Badge tone="finance">Personalised</Badge>;
  }
  if (state === "ineligible") {
    return <Badge tone="warning">Needs more deposit</Badge>;
  }
  if (state === "representative") {
    return <Badge>Representative</Badge>;
  }
  return null;
}

export function PersonalisedPricingIndicator({
  state = "anonymous",
}: {
  state?: "anonymous" | "personalised" | "ineligible";
}) {
  if (state === "personalised") {
    return (
      <p className="text-body-sm text-primary">Your finance is personalised</p>
    );
  }

  if (state === "ineligible") {
    return (
      <p className="text-body-sm text-muted">
        Some cars may be outside your current finance profile.
      </p>
    );
  }

  return (
    <p className="text-body-sm text-muted">Check your finance eligibility</p>
  );
}

export function FinanceSummary({
  monthly,
  cash,
  apr,
  deposit,
  term,
  state = "representative",
  gapAmount,
}: {
  monthly?: number;
  cash?: number;
  apr?: number;
  deposit?: number;
  term?: number;
  state?: FinanceDisplayState;
  gapAmount?: number;
}) {
  return (
    <aside className="rounded-lg border border-border bg-page-tint p-5">
      <div className="flex items-start justify-between gap-3">
        <MonthlyPayment amount={monthly} state={state} gapAmount={gapAmount} />
        <FinanceBadge state={state} />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <CashPrice amount={cash} state={state} />
        <APR value={apr} state={state} />
        <Deposit amount={deposit} />
        <FinanceTerm months={term} />
      </div>
    </aside>
  );
}
