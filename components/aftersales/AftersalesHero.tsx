import { PageBanner } from "@/components/layout/PageBanner";
import { getBookingUrl } from "@/config/routes";

export function AftersalesHero({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <PageBanner
      title={title}
      description={description}
      primary={primary}
      secondary={secondary}
    />
  );
}

export function AftersalesHubHero() {
  return (
    <AftersalesHero
      title="Keep your car running at its best"
      description="Book servicing, MOTs and support with Oakwood."
      primary={{
        href: getBookingUrl({ type: "service", source: "aftersales" }),
        label: "Book a service",
      }}
      secondary={{
        href: getBookingUrl({ type: "mot", source: "aftersales" }),
        label: "Book an MOT",
      }}
    />
  );
}
