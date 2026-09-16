import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Valuation",
  path: routes.valuation,
  indexable: false,
});

export default function Page() {
  redirect(routes.sellMyCar);
}
