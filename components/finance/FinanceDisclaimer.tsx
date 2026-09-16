import {
  DEAL_APPLICATION_BOUNDARY,
  DEAL_ILLUSTRATION_PERSONALISED,
  DEAL_ILLUSTRATION_REPRESENTATIVE,
  DEAL_SOFT_SEARCH,
  INDICATIVE_DISCLAIMER,
} from "@/lib/finance/calculator-copy";
import { routes } from "@/config/routes";

export function FinanceDisclaimer({
  personalised,
}: {
  personalised: boolean;
}) {
  return (
    <div className="space-y-2 text-caption text-muted">
      <p>
        {personalised
          ? DEAL_ILLUSTRATION_PERSONALISED
          : DEAL_ILLUSTRATION_REPRESENTATIVE}
      </p>
      <p>{INDICATIVE_DISCLAIMER}</p>
      <p>{DEAL_APPLICATION_BOUNDARY}</p>
      <p>{DEAL_SOFT_SEARCH}</p>
      <p>
        <a
          href={routes.statusDisclosure}
          className="text-primary underline-offset-4 hover:underline"
        >
          Status disclosure
        </a>
        {" · "}
        <a
          href={routes.vehiclePurchaseTerms}
          className="text-primary underline-offset-4 hover:underline"
        >
          Vehicle purchase terms
        </a>
      </p>
    </div>
  );
}
