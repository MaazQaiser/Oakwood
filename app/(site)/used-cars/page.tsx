import { VehicleSearchPage } from "@/components/search/VehicleSearchPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Used Cars for Sale",
  path: routes.usedCars,
  description:
    "Explore used cars for sale at Oakwood. See monthly payments first, then compare cash price, specification and location.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <VehicleSearchPage searchParams={params} />;
}
