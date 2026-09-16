import { DealResume } from "@/components/deal/DealResume";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Resume deal",
  path: routes.dealResume,
  indexable: false,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.token;
  const token = Array.isArray(raw) ? raw[0] : raw;

  return <DealResume token={token} />;
}
