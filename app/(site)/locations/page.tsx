import { LocationsHubPage } from "@/components/locations/LocationPages";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Locations",
  path: routes.locations,
  description:
    "Find your nearest Oakwood Motor Company showroom in Bury or Chorley.",
});

export default function Page() {
  return <LocationsHubPage />;
}
