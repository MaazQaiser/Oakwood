import { ComparePage } from "@/components/compare/ComparePage";
import { parseCompareIds, routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Compare cars",
  path: routes.compare,
  description:
    "Compare up to two Oakwood used cars side by side, including monthly payments, cash price and key specification.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ids = parseCompareIds(
    typeof params.ids === "string" || Array.isArray(params.ids)
      ? params.ids
      : undefined,
  );
  return <ComparePage initialIds={ids} />;
}
