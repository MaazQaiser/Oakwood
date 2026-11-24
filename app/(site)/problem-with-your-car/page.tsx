import { ProblemWithYourCarPage } from "@/features/support/ProblemWithYourCarPage";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Problem with your car",
  path: routes.problemWithYourCar,
  description:
    "Report a problem with a car you bought from Oakwood — warranty faults, put-it-right cases, or 30 day guarantee requests.",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const need = typeof query.need === "string" ? query.need : undefined;
  return <ProblemWithYourCarPage initialNeed={need} />;
}