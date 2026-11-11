import { DistanceSellingPage } from "@/features/support/DistanceSellingPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Distance selling: your right to cancel",
  path: routes.distanceSelling,
  description:
    "Buy with confidence. Know your rights if you purchase a vehicle from Oakwood through a distance sale.",
});

export default function Page() {
  return <DistanceSellingPage />;
}
