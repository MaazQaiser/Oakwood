import { formatApr } from "@/lib/format/money";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import { cn } from "@/lib/cn";

export function HomeFinanceRateLine({
  variant = "full",
  layout = "inline",
  className,
}: {
  variant?: "full" | "short";
  layout?: "inline" | "row";
  className?: string;
}) {
  const example = getRepresentativeFinanceExample();
  if (!example) {
    return null;
  }

  const rates =
    example.ratesFromApr !== undefined ? (
      <span key="rates">Rates from {formatApr(example.ratesFromApr)}</span>
    ) : null;

  const zero = example.zeroPercentOnSelectedCars ? (
    <span key="zero">
      0%{variant === "short" ? " selected cars" : " available on selected cars"}
    </span>
  ) : null;

  if (!rates && !zero) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-ink",
        layout === "row" && "flex flex-wrap gap-x-4 gap-y-1",
        className,
      )}
    >
      {rates}
      {layout === "inline" && rates && zero ? (
        <span className="px-1.5" aria-hidden="true">
          ·
        </span>
      ) : null}
      {zero}
    </p>
  );
}
