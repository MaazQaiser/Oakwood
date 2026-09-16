import { ReviewsPageView } from "@/components/trust/TrustPages";
import { routes } from "@/config/routes";
import { reviewsCopy } from "@/lib/trust/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: reviewsCopy.metaTitle,
  path: routes.ourOnlineReviews,
  description: reviewsCopy.metaDescription,
});

export default function Page() {
  return <ReviewsPageView />;
}
