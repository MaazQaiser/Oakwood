import { EligibilityResume } from "@/components/eligibility/EligibilityResume";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Resume eligibility",
  path: routes.eligibilityResume,
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

  return <EligibilityResume token={token} />;
}
