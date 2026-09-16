import { SupportComplaintsPage } from "@/features/support/SupportPages";
import { routes } from "@/config/routes";
import {
  COMPLAINTS_META_DESCRIPTION,
  COMPLAINTS_META_TITLE,
} from "@/lib/support/copy";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: COMPLAINTS_META_TITLE,
  path: routes.complaints,
  description: COMPLAINTS_META_DESCRIPTION,
});

export default function Page() {
  return <SupportComplaintsPage />;
}
