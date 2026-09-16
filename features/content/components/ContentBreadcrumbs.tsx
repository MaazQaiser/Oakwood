import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";

export function ContentBreadcrumbs({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Breadcrumbs
      items={createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "Blog", href: routes.blog },
        { label: title, href },
      ])}
    />
  );
}
