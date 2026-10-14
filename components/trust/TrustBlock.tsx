import { Button } from "@/components/ui/Button";
import { routes, trustRoutes } from "@/config/routes";

const points = [
  {
    title: "Prepared to our standards",
    copy: "Each car is prepared before it is offered for sale, with the work we have recorded listed on the page.",
    href: trustRoutes.ourGarage,
  },
  {
    title: "Clear vehicle history",
    copy: "MOT, provenance, recalls and condition notes are shown here rather than held back for an enquiry.",
    href: trustRoutes.aaStandards,
  },
  {
    title: "Warranty included",
    copy: "Available cars include a 12-month warranty. Claim details are listed with the vehicle.",
    href: routes.warranty,
  },
  {
    title: "Visit us in Bury or Chorley",
    copy: "See the car in person at the showroom where it is located, or continue the purchase online.",
    href: routes.locations,
  },
];

export function TrustBlock() {
  return (
    <section
      aria-labelledby="why-oakwood-heading"
      className="rounded-[32px] bg-[#ECF3F8] px-6 py-8 text-[#002852] md:px-10 md:py-10"
    >
      <h2 id="why-oakwood-heading" className="text-h3">
        Why buy from Oakwood?
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {points.map((point) => (
          <li key={point.title} className="min-w-0">
            <h3 className="text-h4">{point.title}</h3>
            <p className="mt-2 text-body-sm text-secondary">{point.copy}</p>
            {point.href ? (
              <p className="mt-3">
                <Button href={point.href} variant="text">
                  Learn more
                </Button>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
