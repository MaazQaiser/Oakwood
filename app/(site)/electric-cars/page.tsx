import { ElectricCarsPage } from "@/features/electric/ElectricCarsPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Electric cars",
  path: routes.electricCars,
  description:
    "Browse used electric cars at Oakwood with AA inspection and Aviloo battery certificates where available.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <ElectricCarsPage searchParams={params} />;
}
