import { PageBanner } from "@/components/layout/PageBanner";

export function JourneyStart({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <PageBanner
      title={title}
      description={body}
      primary={primary}
      secondary={secondary}
      width="content"
    />
  );
}
