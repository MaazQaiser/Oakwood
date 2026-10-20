import { SavedCarsPage } from "@/components/saved/SavedCarsPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Your cars",
  path: routes.savedCars,
  description: "Cars you saved while browsing Oakwood stock.",
  indexable: false,
});

export default function Page() {
  return <SavedCarsPage />;
}
