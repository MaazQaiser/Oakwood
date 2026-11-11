import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { StaffRefundForm } from "@/features/support/components/StaffRefundForm";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Request a refund",
  path: routes.requestRefund,
  description: "Staff form to log a customer refund request at Oakwood Motor Company.",
  indexable: false,
});

const STEPS = [
  { label: "Customer", detail: "Name and registration" },
  { label: "Payment", detail: "How they paid" },
  { label: "Reason", detail: "Why it is refunded" },
] as const;

export default function Page() {
  const breadcrumbs = createBreadcrumbs([
    { label: "Home", href: routes.home },
    { label: "Help and support", href: routes.help },
    { label: "Request a refund", href: routes.requestRefund },
  ]);

  return (
    <>
      <PageBanner
        title="Request a refund"
        description="Staff form for logging a cancelled sale, overpayment, or returned deposit."
        breadcrumbs={breadcrumbs}
        width="narrow"
      >
        <div className="rounded-[22px] bg-white/80 p-4 sm:p-5">
          <p className="oak-eyebrow">Staff only · 3 steps</p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.label} className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ECF3F8] text-sm font-semibold text-[#002852]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#002852]">{step.label}</p>
                  <p className="mt-0.5 text-caption text-secondary">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PageBanner>
      <Section className="relative overflow-hidden bg-[linear-gradient(180deg,#F4F8FC_0%,transparent_42%)]">
        <Container>
          <div className="mx-auto max-w-xl">
            <StaffRefundForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
