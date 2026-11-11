import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";

export function ElectricCarsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Used cars", href: routes.usedCars },
    { label: "Electric cars", href: routes.electricCars },
  ]);

  return (
    <>
      <PageBanner
        title="Electric cars"
        description="Browse Oakwood’s EV stock with AA inspection and Aviloo battery credibility built in."
        breadcrumbs={breadcrumbs}
        width="wide"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-[20px] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
            <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase">
              AA inspected
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[#002852]">
              Independent AA certificate
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Every car we list can carry an AA inspection certificate on the vehicle
              page. Look for the AA badge before you reserve.
            </p>
          </article>
          <article className="rounded-[20px] bg-white p-5 shadow-[0_10px_24px_rgba(16,40,72,0.06)]">
            <p className="text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase">
              Aviloo tested
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[#002852]">
              Battery check beside the AA cert
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Where an Aviloo battery certificate is available for an EV, it sits next to
              the AA badge on the car page. We only show it when that report exists for
              that vehicle.
            </p>
          </article>
        </div>
        <p className="mt-4 text-sm text-secondary">
          Filter by range, charging time, road tax and size of car.{" "}
          <Link href={routes.search} className="font-semibold text-primary">
            Browse all cars
          </Link>
        </p>
      </PageBanner>
      <VehicleSearchPage
        searchParams={searchParams}
        locked={{ fuel: "Electric" }}
        variant="search"
        basePath={routes.electricCars}
        category="car"
        hideHeader
      />
    </>
  );
}
