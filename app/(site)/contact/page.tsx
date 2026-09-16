import { SupportContactPage } from "@/features/support/SupportPages";
import { getSupportVehicleContext } from "@/features/support/services/contact";
import { routes } from "@/config/routes";
import { SUPPORT_HUB_META_DESCRIPTION, SUPPORT_HUB_META_TITLE } from "@/lib/support/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: SUPPORT_HUB_META_TITLE,
  path: routes.contact,
  description: SUPPORT_HUB_META_DESCRIPTION,
});

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <SupportContactPage
      vehicle={getSupportVehicleContext(first(params.vehicle))}
      topic={first(params.topic)}
    />
  );
}
