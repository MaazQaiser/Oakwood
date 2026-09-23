import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Divider } from "@/components/ui/Badge";
import { Logo } from "@/components/navigation/Logo";
import {
  footerNavigation,
  legalNavigation,
  socialLinks,
  visibleGroups,
  visibleItems,
} from "@/config/navigation";
import { routes } from "@/config/routes";
import { showrooms } from "@/config/locations";
import { PrivacySettingsButton } from "@/features/legal/components/PrivacySettings";

const linkClass =
  "inline-flex py-1 text-sm text-muted no-underline hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function SiteFooter() {
  const groups = visibleGroups(footerNavigation);
  const legal = visibleItems(legalNavigation);
  const phone = showrooms.find((item) => item.telephone)?.telephone;

  return (
    <footer className="mt-auto bg-[#d4e4ff]">
      <Container width="wide" className="py-10 md:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
            {showrooms.map((location) => (
              <Link
                key={location.slug}
                href={`${routes.locations}/${location.slug}`}
                className="hover:text-ink"
              >
                {location.name}
                {location.postcode ? ` · ${location.postcode}` : ""}
              </Link>
            ))}
            {phone ? (
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="font-medium text-ink hover:underline">
                {phone}
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {groups.map((group) => (
            <div key={group.id} className="min-w-0">
              <h2 className="text-label text-ink">{group.label}</h2>
              <ul className="mt-3">
                {visibleItems(group.children).map((item) =>
                  item.href ? (
                    <li key={item.id}>
                      <Link href={item.href} className={linkClass}>
                        {item.label}
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-8" />

        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {legal.map((item) =>
            item.href ? (
              <li key={item.id}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
          <li>
            <PrivacySettingsButton className={linkClass} />
          </li>
        </ul>

        {socialLinks.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-x-4">
            {socialLinks.map((item) =>
              item.href ? (
                <li key={item.id}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        ) : null}

        <p className="mt-6 max-w-3xl text-caption">
          © 2026 Oakwood Motor Company. Oakwood Motor Company is a credit{" "}
          <Link href={routes.statusDisclosure} className="underline-offset-4 hover:text-ink hover:underline">
            broker, not a lender
          </Link>
          . Finance is subject to status.
        </p>
      </Container>
    </footer>
  );
}
