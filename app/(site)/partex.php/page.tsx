import { SellMyCarExperience } from "@/components/part-exchange/SellMyCarExperience";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Part exchange",
  description:
    "Get an estimated part-exchange valuation using just your registration and mileage.",
  path: routes.partExchange,
});

export default function Page() {
  return <SellMyCarExperience />;
}
