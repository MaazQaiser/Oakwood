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

export function SiteFooter() {
  const groups = visibleGroups(footerNavigation);
  const legal = visibleItems(legalNavigation);
  const phone = showrooms.find((item) => item.telephone)?.telephone;

  return (
    <footer className="mt-auto border-t border-border/70 bg-page">
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-2 min-w-0 md:col-span-3 xl:col-span-1">
            <Logo />
            <p className="mt-3 text-body-sm text-muted">
              Oakwood Motor Company
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.id} className="min-w-0">
              <h2 className="text-label">{group.label}</h2>
              <ul className="mt-3">
                {visibleItems(group.children).map((item) =>
                  item.href ? (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center text-body-sm text-muted hover:text-ink"
                      >
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
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-label">Contact</h2>
            <ul className="mt-3 text-body-sm text-muted">
              {showrooms.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`${routes.locations}/${location.slug}`}
                    className="inline-flex min-h-11 items-center hover:text-ink"
                  >
                    {location.name}
                    {location.postcode ? ` · ${location.postcode}` : ""}
                  </Link>
                </li>
              ))}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="inline-flex min-h-11 items-center hover:text-ink"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <h2 className="text-label">Legal</h2>
            <ul className="mt-3 flex flex-col md:flex-row md:flex-wrap md:gap-x-4">
              {legal.map((item) =>
                item.href ? (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-body-sm text-muted hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : null,
              )}
              <li>
                <PrivacySettingsButton />
              </li>
            </ul>
            {socialLinks.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-label">Social</h2>
                <ul className="mt-3">
                  {socialLinks.map((item) =>
                    item.href ? (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          className="inline-flex min-h-11 items-center text-body-sm text-muted hover:text-ink"
                        >
                          {item.label}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-caption">
          © 2026 Oakwood Motor Company. Oakwood Motor Company is a credit
          broker, not a lender. Finance is subject to status.
        </p>
      </Container>
    </footer>
  );
}
