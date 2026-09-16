import { SellMyCarExperience } from "@/components/part-exchange/SellMyCarExperience";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Find out what your car is worth",
  description:
    "Get an estimated part-exchange valuation using just your registration and mileage.",
  path: routes.sellMyCar,
});

export default function Page() {
  return <SellMyCarExperience />;
}
