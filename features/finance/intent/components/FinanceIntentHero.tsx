import { PageBanner } from "@/components/layout/PageBanner";
import { FinanceHeroActions } from "@/features/finance/intent/components/FinanceHeroActions";
import type { BreadcrumbItem } from "@/lib/seo";
import type { FinanceIntentSlug } from "@/types/finance";

export function FinanceIntentHero({
  eyebrow,
  title,
  intro,
  intent,
  supporting,
  secondary,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  intent: FinanceIntentSlug | "hub";
  supporting?: string;
  secondary?: { href: string; label: string; event: "calculator" | "browse" | "px" };
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <PageBanner
      eyebrow={eyebrow}
      title={title}
      breadcrumbs={breadcrumbs}
      description={
        <>
          <p>{intro}</p>
          {supporting ? <p className="mt-3">{supporting}</p> : null}
        </>
      }
      actions={<FinanceHeroActions intent={intent} secondary={secondary} />}
    />
  );
}
