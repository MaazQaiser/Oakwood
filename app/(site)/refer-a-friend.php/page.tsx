import Link from "next/link";
import { EnquiryPage } from "@/components/templates/pages";
import { routes, supportRoutes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Refer a friend",
  path: routes.referAFriend,
  indexable: false,
});

export default function Page() {
  return (
    <EnquiryPage title="Refer a friend" route={routes.referAFriend}>
      <div className="space-y-4">
        <p className="text-body text-secondary">
          The refer-a-friend scheme is not live in this preview. Contact the
          showroom if you already have a referral code, or browse cars in the
          meantime.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={supportRoutes.contact}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white no-underline hover:bg-primary-hover"
          >
            Contact Oakwood
          </Link>
          <Link
            href={routes.search}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-semibold text-ink no-underline hover:bg-page-tint"
          >
            Browse cars
          </Link>
        </div>
      </div>
    </EnquiryPage>
  );
}
