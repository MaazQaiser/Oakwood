import { HomePage } from "@/components/home/HomePage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Used cars that fit your budget",
  path: routes.home,
  description:
    "Check your finance eligibility in under 60 seconds, then browse used cars that fit your monthly budget. No impact on your credit score.",
});

export default function Page() {
  return <HomePage />;
}
