import { notFound } from "next/navigation";
import { LocationShowroomPage } from "@/components/locations/LocationPages";
import { getShowroomProfile, showrooms } from "@/config/locations";
import { getLocationUrl } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return showrooms.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const profile = getShowroomProfile(location);

  return createPageMetadata({
    title: profile?.metaTitle ?? location,
    path: getLocationUrl(location, "canonical"),
    description: profile?.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const profile = getShowroomProfile(location);

  if (!profile) {
    notFound();
  }

  return <LocationShowroomPage profile={profile} variant="canonical" />;
}
