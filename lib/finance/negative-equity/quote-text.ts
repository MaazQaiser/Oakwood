import { money, money2 } from "@/lib/finance/negative-equity/math";
import type { QuoteResult } from "@/lib/finance/negative-equity/quote";

/**
 * Builds the WhatsApp and SMS body from the live quote. On a blocked deal it
 * rewrites itself to say the site could not quote it and a person is needed.
 */
export function quoteText(quote: QuoteResult): string {
  const c = quote.vehicle;
  const lines: string[] = [];
  lines.push(
    `Hi Oakwood, I am looking at the ${c.year} ${c.make} ${c.model} at ${money(c.cashPrice)}.`,
  );
  if (quote.settlementLoan > 0) {
    lines.push(
      `I have around ${money(quote.settlementLoan)} of negative equity on my current car.`,
    );
  }
  if (quote.ok) {
    lines.push(
      `Your site quoted me ${money2(quote.monthlyTotal)} a month in total, ${
        quote.product === "pcp" ? "PCP" : "Hire Purchase"
      } over ${quote.term} months${
        quote.settlementLoan > 0
          ? ` plus the settlement loan over ${quote.settlementTerm}`
          : ""
      }.`,
    );
  } else {
    lines.push(
      "Your site could not quote it, so I would like someone to look at it.",
    );
  }
  return lines.join(" ");
}
