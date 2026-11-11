import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";

const SUPPORT_EMAIL = "Support@oakwoodmotorcompany.com";

const HIGHLIGHTS = [
  { value: "14 days", label: "To cancel after delivery or collection" },
  { value: "20 miles", label: "Standard test-drive allowance" },
  { value: "£1.50", label: "Per extra mile deducted from a refund" },
] as const;

const SECTIONS = [
  {
    id: "your-right",
    title: "Your right to cancel",
    paragraphs: [
      "If you purchase a vehicle from Oakwood Motor Company through a distance sale, you have the right to cancel your contract within 14 days, without giving a reason.",
      "Your cancellation period begins on the day that you, or someone acting on your behalf, collects or takes delivery of your vehicle.",
    ],
  },
  {
    id: "how-to-cancel",
    title: "How to cancel your purchase",
    paragraphs: [
      "If you decide to cancel your contract, simply let us know with a clear statement before the 14-day cancellation period expires.",
      "You can contact us by post or email:",
      "Oakwood Motor Company, Whitelegge Street, Bury, BL8 1SW",
      `Email: ${SUPPORT_EMAIL}`,
      "To meet the cancellation deadline, you only need to send your notice of cancellation before the 14-day period has ended.",
    ],
  },
  {
    id: "what-you-need",
    title: "What you need to know",
    paragraphs: [
      "Can I drive the vehicle? You are entitled to inspect and assess the vehicle, in the same way you would when considering a purchase in person.",
      "We allow a standard test drive of up to 20 miles. If the vehicle is driven more than 20 miles, we may make a deduction of £1.50 for every additional mile from your refund.",
      "We may also make deductions for any damage, excess wear or other reduction in the vehicle's value caused by unnecessary handling.",
    ],
  },
  {
    id: "returning",
    title: "Returning the vehicle",
    paragraphs: [
      "If you cancel your purchase, you are responsible for returning the vehicle to us without undue delay and no later than 14 days after telling us that you wish to cancel.",
      "You are responsible for the direct cost of returning the vehicle.",
      "You are responsible for ensuring the vehicle is returned safely.",
      "You remain responsible for the vehicle until it has been accepted back at our premises.",
      "You remain liable for vehicle tax, insurance, fines, charges and penalties until the vehicle is accepted back.",
      "Please also return all items and documents supplied with the vehicle, including service history, V5 documentation, keys and any other supplied accessories.",
    ],
  },
  {
    id: "refund",
    title: "When will I receive my refund?",
    paragraphs: [
      "Once we have received the vehicle and all relevant documentation back in good order, we will process your reimbursement without undue delay.",
      "We will make the reimbursement no later than 14 days after receiving the returned vehicle and relevant paperwork.",
      "Your refund will normally be made using the same method of payment you used for the original transaction, unless we have agreed otherwise.",
      "We may withhold reimbursement until the vehicle and all required documentation have been returned.",
    ],
  },
  {
    id: "delivery-costs",
    title: "What about delivery costs?",
    paragraphs: [
      "If you cancel your contract, we will reimburse payments received from you, including the cost of standard delivery.",
      "Please note that additional costs may not be refunded if you chose delivery instead of collection, or a delivery option more expensive than the least expensive standard delivery option offered by us.",
    ],
  },
  {
    id: "part-exchange",
    title: "What happens to my part exchange?",
    paragraphs: [
      "Where a part-exchange vehicle has been included in your transaction, the return of that vehicle will be considered as part of the cancellation process where it is still available.",
      "Where applicable, you may also remain responsible for any outstanding negative equity associated with the transaction.",
    ],
  },
] as const;

const RETURN_CHECKLIST = [
  "Return within 14 days of telling us you want to cancel",
  "Cover the direct cost of returning the vehicle",
  "Keep the vehicle safe until we accept it back",
  "Return keys, V5, service history and accessories",
] as const;

export function DistanceSellingPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Legal", href: routes.legal },
    { label: "Distance selling", href: routes.distanceSelling },
  ]);

  return (
    <>
      <PageBanner
        title="Distance selling: your right to cancel"
        description="Buy with confidence. Know your rights."
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <div className="grid gap-px overflow-hidden rounded-[22px] bg-[#D7E6F2] sm:grid-cols-3">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.value}
              className="bg-[#F4F8FC] px-5 py-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-[1.85rem] font-medium tracking-[-0.04em] text-[#002852]">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-secondary">{item.label}</p>
            </div>
          ))}
        </div>
      </PageBanner>

      <Section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(142,191,223,0.28),_transparent_70%)]"
        />
        <Container width="narrow" className="relative">
          <nav aria-label="On this page" className="mb-10">
            <p className="oak-eyebrow">On this page</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-10 items-center text-body-sm text-primary underline-offset-4 hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-prose space-y-12">
            {SECTIONS.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm tabular-nums text-[#8EBFDF]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-h2">{section.title}</h2>
                </div>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-body text-muted">
                    {paragraph}
                  </p>
                ))}
                {section.id === "returning" ? (
                  <ul className="mt-6 space-y-3 rounded-[22px] bg-[#F4F8FC] p-5 sm:p-6">
                    {RETURN_CHECKLIST.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-body-sm text-ink">
                        <span className="mt-0.5 text-[#002852]">
                          <IconCheck width={18} height={18} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section
              id="contact"
              className="scroll-mt-24 overflow-hidden rounded-[28px] bg-[#002852] p-6 text-white sm:p-8"
            >
              <p className="oak-eyebrow !text-[#8EBFDF]">Ready to cancel?</p>
              <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.02em]">
                Need to cancel or have a question?
              </h2>
              <p className="mt-3 max-w-md text-body text-white/75">
                We&apos;re here to help. If you wish to exercise your right to cancel, or have
                any questions about distance selling, please contact us.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-6 inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-[14px] bg-white py-1.5 pr-1.5 pl-5 text-[#002852] no-underline transition-[transform,background-color] duration-[var(--oak-motion-base)] hover:bg-[#E7F1F8] hover:translate-y-[-1px] sm:w-auto"
              >
                <span className="text-button">{SUPPORT_EMAIL}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#ECF3F8] text-[#002852]">
                  <IconArrow width={20} height={20} />
                </span>
              </a>
              <p className="mt-5 text-sm text-white/65">
                Oakwood Motor Company
                <br />
                Whitelegge Street, Bury, BL8 1SW
              </p>
            </section>

            <nav aria-label="Related" className="border-t border-[#D7E6F2] pt-8">
              <h2 className="text-h2">Related</h2>
              <ul className="mt-4 divide-y divide-[#E7EEF4]">
                {[
                  { href: routes.deliveryAndCollection, label: "Delivery and collection" },
                  { href: routes.cancellationRefund, label: "Cancellation and refund" },
                  { href: routes.help, label: "Help and support" },
                  { href: routes.contact, label: "Contact Oakwood" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-12 items-center justify-between gap-3 text-body-sm text-primary no-underline"
                    >
                      <span className="underline-offset-4 group-hover:underline">{link.label}</span>
                      <IconArrow width={16} height={16} className="opacity-50 transition-transform duration-[var(--oak-motion-fast)] group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </Section>
    </>
  );
}
