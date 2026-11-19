import Link from "next/link";
import { RepresentativeExampleCard } from "@/components/finance/RepresentativeExampleCard";
import { OakwoodPhotoSlot } from "@/components/media/OakwoodPhotoSlot";
import { Button } from "@/components/ui/Button";
import {
  getFinanceCalculatorUrl,
  getSearchUrl,
  getVehicleUrl,
} from "@/config/routes";
import { getRepresentativeFinanceExample } from "@/lib/finance/representative-example";
import {
  HOME_REPRESENTATIVE_BUDGET_MONTHLY,
  HOME_REPRESENTATIVE_CTA,
  HOME_REPRESENTATIVE_DESCRIPTION,
  HOME_REPRESENTATIVE_HEADING,
} from "@/lib/home/copy";
import { representativeExamplePhotography } from "@/lib/home/photography";
import { findVehicleByStockId } from "@/lib/vehicles/query";

export function HomeRepresentativeExample() {
  const example = getRepresentativeFinanceExample();
  if (!example) {
    return null;
  }

  const vehicle = findVehicleByStockId(example.stockId);
  const photo = representativeExamplePhotography(vehicle);
  const title = `${example.year} ${example.make} ${example.model}`;
  const vehicleHref = getVehicleUrl(example.slug);
  const detailsHref = getFinanceCalculatorUrl({ stockId: example.stockId });
  const budgetHref = getSearchUrl({
    monthly_max: HOME_REPRESENTATIVE_BUDGET_MONTHLY,
  });

  return (
    <div>
      <header className="max-w-2xl">
        <h3
          id="home-representative-example-heading"
          className="text-h2 text-navy"
        >
          {HOME_REPRESENTATIVE_HEADING}
        </h3>
        <p className="mt-4 text-body text-muted">
          {HOME_REPRESENTATIVE_DESCRIPTION}
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <Link
          href={vehicleHref}
          aria-label={`View ${title}`}
          className="relative min-h-64 overflow-hidden rounded-[28px] no-underline sm:min-h-80 lg:min-h-[28rem]"
        >
          <OakwoodPhotoSlot
            slot={photo}
            fill
            sizes="(max-width: 1024px) 100vw, 36rem"
          />
        </Link>

        <div className="flex min-w-0 flex-col">
          <RepresentativeExampleCard
            example={example}
            className="h-full"
            showDisclaimer
          />
          <p className="mt-3 px-1">
            <Link
              href={detailsHref}
              className="text-sm font-semibold text-primary-secondary no-underline hover:underline"
            >
              Calculate this example
            </Link>
          </p>
          <div className="mt-4">
            <Button href={budgetHref} className="btn-compact w-full">
              {HOME_REPRESENTATIVE_CTA}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
