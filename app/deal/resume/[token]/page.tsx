import { DealResume } from "@/components/deal/DealResume";
import { getDealResumeUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return createPageMetadata({
    title: "Resume deal",
    path: getDealResumeUrl(token),
    indexable: false,
  });
}

/** Spec URL pattern: /deal/resume/{token} (alias of ?token=). */
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <DealResume token={token} />;
}
