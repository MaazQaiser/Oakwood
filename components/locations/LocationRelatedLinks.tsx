import { aftersalesRoutes, getEligibilityUrl, routes, trustRoutes } from "@/config/routes";

const LINKS = [
  { href: routes.locations, label: "Locations" },
  { href: routes.usedCars, label: "Used cars" },
  { href: routes.finance, label: "Finance" },
  { href: getEligibilityUrl(), label: "Check my eligibility" },
  { href: routes.partExchange, label: "Part exchange" },
  { href: aftersalesRoutes.hub, label: "Aftersales" },
  { href: trustRoutes.ourOnlineReviews, label: "Reviews" },
  { href: trustRoutes.howItWorks, label: "How it works" },
  { href: routes.contact, label: "Contact" },
  { href: routes.faq, label: "FAQs" },
];

export function LocationRelatedLinks({ current }: { current?: string }) {
  const items = LINKS.filter((item) => item.href !== current);

  return (
    <nav aria-label="Related" className="border-t border-border pt-8">
      <h2 className="text-h4">Related</h2>
      <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="text-body-sm text-primary underline-offset-4 hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
