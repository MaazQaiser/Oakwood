"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container, Section } from "@/components/layout/Container";
import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { ComplaintForm } from "@/features/support/components/ComplaintForm";
import { PutRightComplaintForm } from "@/features/support/components/PutRightComplaintForm";
import { routes } from "@/config/routes";
import { createBreadcrumbs } from "@/lib/seo";
import type { ProblemWithCarNeed } from "@/types/complaint";
import { cn } from "@/lib/cn";

const CHOICES: Array<{
  id: ProblemWithCarNeed;
  title: string;
  body: string;
  hint: string;
  icon: LucideIcon;
  tone: "navy" | "soft" | "surface";
}> = [
  {
    id: "put-right",
    title: "Put it right",
    body: "Something is wrong with a car you bought from us. We will find your purchase and log the issue.",
    hint: "Complaint",
    icon: Wrench,
    tone: "navy",
  },
  {
    id: "warranty",
    title: "Warranty fault",
    body: "Start a warranty claim with your vehicle details and what has failed.",
    hint: "Cover claim",
    icon: ShieldCheck,
    tone: "soft",
  },
  {
    id: "thirty-day",
    title: "30 day swap or return",
    body: "Use the 30 Day Guarantee request form if your car is eligible.",
    hint: "Guarantee",
    icon: ArrowLeftRight,
    tone: "surface",
  },
];

function parseNeed(value?: string): ProblemWithCarNeed | undefined {
  if (value === "put-right" || value === "warranty" || value === "thirty-day") {
    return value;
  }
  return undefined;
}

export function ProblemWithYourCarPage({
  initialNeed,
  telephone,
}: {
  initialNeed?: string;
  telephone?: string;
}) {
  const [selected, setSelected] = useState<ProblemWithCarNeed | undefined>(() =>
    parseNeed(initialNeed),
  );

  const breadcrumbs = useMemo(
    () =>
      createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "Help and support", href: routes.help },
        { label: "Problem with your car", href: routes.problemWithYourCar },
      ]),
    [],
  );

  return (
    <>
      <PageBanner
        title="Problem with your car"
        description="Choose what you need. We will route you to the right form."
        breadcrumbs={breadcrumbs}
        width="narrow"
      />
      <Section className="pb-[var(--oak-section-y)]">
        <Container width="narrow" className="space-y-8">
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            role="radiogroup"
            aria-label="What do you need?"
          >
            {CHOICES.map((choice, index) => {
              const Icon = choice.icon;
              const active = selected === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={cn(
                    "group relative flex min-h-[14.5rem] flex-col overflow-hidden rounded-[22px] border p-5 text-left transition duration-200",
                    "hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    active
                      ? "border-transparent shadow-[0_18px_40px_rgba(0,40,82,0.16)]"
                      : "border-border/80 shadow-[0_10px_28px_rgba(0,40,82,0.04)] hover:border-primary/30",
                    !active && choice.tone === "navy" && "bg-[var(--oak-navy)] text-white",
                    !active && choice.tone === "soft" && "bg-[var(--oak-surface-soft)] text-ink",
                    !active && choice.tone === "surface" && "bg-white text-ink",
                    active && "bg-[var(--oak-navy)] text-white",
                  )}
                  onClick={() => setSelected(choice.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "font-[family-name:var(--oak-font-numeric)] text-[1.75rem] font-semibold leading-none",
                        active || choice.tone === "navy"
                          ? "text-white/30"
                          : "text-primary/25",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-[14px] transition",
                        active || choice.tone === "navy"
                          ? "bg-white/12 text-white"
                          : "bg-white text-primary",
                      )}
                    >
                      <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>

                  <p
                    className={cn(
                      "mt-6 text-caption font-semibold uppercase tracking-[0.12em]",
                      active || choice.tone === "navy"
                        ? "text-white/65"
                        : "text-primary",
                    )}
                  >
                    {choice.hint}
                  </p>
                  <h2
                    className={cn(
                      "mt-2 text-h4",
                      active || choice.tone === "navy" ? "text-white" : "text-ink",
                    )}
                  >
                    {choice.title}
                  </h2>
                  <p
                    className={cn(
                      "mt-3 flex-1 text-body-sm leading-relaxed",
                      active || choice.tone === "navy"
                        ? "text-white/85"
                        : "text-muted",
                    )}
                  >
                    {choice.body}
                  </p>
                  <span
                    className={cn(
                      "mt-5 inline-flex items-center gap-1.5 text-body-sm font-semibold",
                      active || choice.tone === "navy"
                        ? "text-white"
                        : "text-primary",
                    )}
                  >
                    {active ? "Selected" : "Choose"}
                    <ArrowRight
                      aria-hidden
                      className={cn(
                        "h-4 w-4 transition",
                        active ? "translate-x-0.5" : "group-hover:translate-x-0.5",
                      )}
                      strokeWidth={1.75}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {selected === "put-right" ? (
            <PutRightComplaintForm telephone={telephone} />
          ) : null}

          {selected === "warranty" ? (
            <ComplaintForm
              telephone={telephone}
              defaultCategory="warranty"
              lockCategory
              source="problem-with-your-car"
              hiddenNeed="warranty"
            />
          ) : null}

          {selected === "thirty-day" ? (
            <article className="overflow-hidden rounded-[22px] border border-border/80 bg-[linear-gradient(145deg,var(--oak-navy)_0%,#004e82_100%)] p-6 text-white md:p-8">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-white/65">
                30 Day Guarantee
              </p>
              <h3 className="mt-2 text-h3 text-white">Swap it or get your money back</h3>
              <p className="mt-3 max-w-xl text-body-sm leading-relaxed text-white/85">
                If your car is eligible, use the dedicated guarantee request form
                so we can review swap or return options with a reference number
                straight away.
              </p>
              <div className="mt-6">
                <Button href={routes.thirtyDayGuaranteeRequest}>
                  Start a guarantee request
                </Button>
              </div>
              <p className="mt-4 text-caption text-white/65">
                Or read the{" "}
                <Link
                  href={routes.thirtyDayGuarantee}
                  className="underline underline-offset-4 hover:text-white"
                >
                  full guarantee page
                </Link>
                .
              </p>
            </article>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
