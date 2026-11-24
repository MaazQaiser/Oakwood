import { GuaranteeLandingPage } from "@/features/guarantee/components/GuaranteeLandingPage";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: guaranteeCopy.programmeName,
  path: routes.thirtyDayGuarantee,
  description: guaranteeCopy.metaDescription,
});

export default function Page() {
  return <GuaranteeLandingPage />;
}