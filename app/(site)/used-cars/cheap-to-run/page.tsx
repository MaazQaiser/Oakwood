import { CheapToRunPage } from "@/components/running-costs/CheapToRunPage";
import { routes } from "@/config/routes";
import { runningCostCars } from "@/lib/mock/running-costs";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Cheap to run used cars",
  path: routes.cheapToRun,
  description:
    "Used cars ranked by what they cost to run each month, all in: finance, insurance indication, road tax, fuel and servicing. Bury and Chorley.",
});

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Used cars", href: routes.usedCars },
    { label: "Cheap to run", href: routes.cheapToRun },
  ]);

  return <CheapToRunPage breadcrumbs={breadcrumbs} cars={runningCostCars} />;
}
