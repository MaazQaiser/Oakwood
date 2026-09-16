import { WarrantyClaimForm } from "@/components/aftersales/WarrantyClaimForm";
import { getAftersalesVehicleContext } from "@/features/aftersales/context";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Warranty claim",
  path: routes.warrantyClaims,
  description: "Start a warranty claim request with Oakwood Motor Company.",
  indexable: false,
});

export default async function Page() {
  const context = await getAftersalesVehicleContext();
  return <WarrantyClaimForm context={context} />;
}
