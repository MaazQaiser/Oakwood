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
    <div className="text-caption text-muted">
      <ul className="list-disc space-y-2 pl-4 marker:text-primary">
        <li>
          {personalised
            ? DEAL_ILLUSTRATION_PERSONALISED
            : DEAL_ILLUSTRATION_REPRESENTATIVE}
        </li>
        <li>{INDICATIVE_DISCLAIMER}</li>
        <li>{DEAL_APPLICATION_BOUNDARY}</li>
        <li>{DEAL_SOFT_SEARCH}</li>
      </ul>
      <p className="mt-3">
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
