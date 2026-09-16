import { DesignSystemShowcase } from "@/components/templates/DesignSystemShowcase";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Design system",
  path: routes.designSystem,
  indexable: false,
});

export default function Page() {
  return <DesignSystemShowcase />;
}
