import { Container, Section } from "@/components/layout/Container";
import { IconArrow } from "@/components/ui/icons";
import { budgetBands } from "@/lib/mock/home";
import Link from "next/link";

const BAND_DISPLAY: Record<string, { kicker: string; amount: string }> = {
  "under-150": { kicker: "Up to", amount: "£150" },
  "150-200": { kicker: "£150 to", amount: "£200" },
  "200-250": { kicker: "£200 to", amount: "£250" },
  "250-300": { kicker: "£250 to", amount: "£300" },
  "300-400": { kicker: "£300 to", amount: "£400" },
  "400-plus": { kicker: "Over", amount: "£400" },
};

export function BudgetCard({
  kicker,
  amount,
  count,
  href,
}: {
  kicker: string;
  amount: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col items-center rounded-[22px] bg-white px-3 py-6 text-center no-underline shadow-sm"
    >
      <span className="rounded-full bg-[#E7F1F8] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[#002852]">
        {kicker}
      </span>
      <span className="mt-4 text-[1.75rem] font-semibold leading-none text-[#002852] tabular-nums sm:text-[2rem]">
        {amount}
      </span>
      <span className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#002852]">
        Per month
      </span>
      <span className="mt-1 text-caption text-muted">{count} cars</span>
      <span className="mt-5 grid h-8 w-8 place-items-center rounded-full bg-[#E7F1F8] text-[#002852]">
        <IconArrow width={14} height={14} />
      </span>
    </Link>
  );
}

export function MonthlyBudgetSection() {
  return (
    <Section className="bg-[#ECF3F8] [background-image:radial-gradient(ellipse_at_88%_0%,#ffffff_0%,transparent_46%)]">
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#002852] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#002852]" aria-hidden="true" />
            Shop by monthly budget
          </p>
          <h2 className="text-h2 mt-4 text-ink">
            Browse by{" "}
            <span className="rounded-md bg-[#8EBFDF] px-1.5 text-[#002852]">monthly budget</span>.
          </h2>
        </header>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {budgetBands.map((band) => {
            const display = BAND_DISPLAY[band.id] ?? { kicker: "Up to", amount: band.label };
            return (
              <BudgetCard
                key={band.id}
                kicker={display.kicker}
                amount={display.amount}
                count={band.count}
                href={band.href}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
