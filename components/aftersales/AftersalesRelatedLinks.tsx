import Link from "next/link";
import { aftersalesRoutes, routes } from "@/config/routes";

const LINKS = [
  { href: aftersalesRoutes.hub, label: "Aftersales" },
  { href: aftersalesRoutes.service, label: "Servicing" },
  { href: aftersalesRoutes.servicingAudi, label: "Audi servicing" },
  { href: aftersalesRoutes.mot, label: "MOT" },
  { href: aftersalesRoutes.warranty, label: "Warranty" },
  { href: aftersalesRoutes.warrantyClaims, label: "Warranty claims" },
  { href: aftersalesRoutes.booking, label: "Book a service" },
  { href: routes.bookingEnquiry, label: "Request a callback" },
];

export function AftersalesRelatedLinks({
  current,
}: {
  current?: string;
}) {
  const items = LINKS.filter((item) => item.href !== current);

  return (
    <nav aria-label="Aftersales">
      <h2 className="text-h4">Related aftersales</h2>
      <ul className="mt-3 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
