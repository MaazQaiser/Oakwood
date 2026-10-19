import { notFound } from "next/navigation";
import { DesignSystemShowcase } from "@/components/templates/DesignSystemShowcase";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Design system",
  path: routes.designSystem,
  indexable: false,
});

/**
 * Internal showcase only. Opt in with ALLOW_DESIGN_SYSTEM=1 so the public
 * preview never exposes component mock stock by default.
 */
export default function Page() {
  if (process.env.ALLOW_DESIGN_SYSTEM !== "1") {
    notFound();
  }

  return <DesignSystemShowcase />;
}
