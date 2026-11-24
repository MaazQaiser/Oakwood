import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  CalendarDays,
  CarFront,
  FileCheck2,
  Scale,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { PageBanner, PageBannerScope } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { Container, Section } from "@/components/layout/Container";
import { FAQAccordion } from "@/features/support/components/FAQAccordion";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { createBreadcrumbs } from "@/lib/seo";
import { createFaqJsonLd } from "@/lib/seo/json-ld";
import type { SupportFaqItem } from "@/types/support";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const faqItems: SupportFaqItem[] = guaranteeCopy.faqs.map((item) => ({
  id: item.id,
  category: "guarantee",
  question: item.question,
  answer: item.answer,
}));

const stepIcons = [CarFront, CalendarDays, FileCheck2, ArrowLeftRight] as const;

const promiseBento = [
  {
    title: "Exchange first, no fee",
    icon: ArrowLeftRight,
    image: "/images/guarantee/exchange.jpg",
    imageAlt: "Couple collecting keys for their Oakwood car",
    layout: "hero" as const,
    className: "md:col-span-7 md:row-span-2 min-h-[22rem] md:min-h-0",
  },
  {
    title: "Finance handled for you",
    icon: Wallet,
    image: "/images/guarantee/finance.jpg",
    imageAlt: "Customer reviewing finance paperwork with an adviser",
    layout: "stack" as const,
    className: "md:col-span-5 min-h-[16rem]",
  },
  {
    title: "No hidden deductions",
    icon: ShieldCheck,
    image: "/images/guarantee/inspect.jpg",
    imageAlt: "Vehicle handover checklist and car keys on a desk",
    layout: "stack" as const,
    className: "md:col-span-5 min-h-[16rem]",
  },
  {
    title: "Your legal rights stay in full",
    icon: Scale,
    image: "/images/guarantee/rights.jpg",
    imageAlt: "Family leaving the showroom after collecting their car",
    layout: "banner" as const,
    className: "md:col-span-12 min-h-[14rem]",
  },
] as const;

function HeroCta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  const primary = variant === "primary";
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-14 min-h-14 w-full max-w-[22rem] items-center gap-3 rounded-[14px] py-1.5 pl-5 pr-1.5 text-button no-underline sm:w-[22rem]",
        primary
          ? "bg-[var(--oak-navy)] text-white hover:bg-[var(--oak-navy-deep)]"
          : "bg-white text-[var(--oak-navy)] hover:bg-[#E7F1F8]",
      )}
    >
      <span className="min-w-0 flex-1 text-left leading-snug">{label}</span>
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-[14px]",
          primary
            ? "bg-white text-[var(--oak-navy)]"
            : "bg-[#E7F1F8] text-[var(--oak-navy)]",
        )}
      >
        <IconArrow width={20} height={20} />
      </span>
    </Link>
  );
}

export function GuaranteeLandingPage() {
  const steps = guaranteeCopy.howItWorks;

  return (
    <PageBannerScope
      breadcrumbs={createBreadcrumbs([
        { label: "Home", href: routes.home },
        { label: "30 Day Guarantee", href: routes.thirtyDayGuarantee },
      ])}
    >
      <JsonLd data={createFaqJsonLd(faqItems)} />
      <PageBanner
        title={guaranteeCopy.headline}
        description={guaranteeCopy.subheadline}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <HeroCta
              href={routes.usedCars}
              label={guaranteeCopy.browseCta}
              variant="primary"
            />
            <HeroCta
              href={routes.thirtyDayGuaranteeRequest}
              label={guaranteeCopy.requestCta}
              variant="secondary"
            />
          </div>
        }
      />

      <Section>
        <Container width="narrow">
          <p className="text-body-lg text-muted">{guaranteeCopy.intro}</p>
        </Container>
      </Section>

      <Section className="bg-[var(--oak-page-canvas)]">
        <Container>
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">
            Four steps
          </p>
          <h2 className="mt-2 text-h2">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((item, index) => {
              const Icon = stepIcons[index] ?? CarFront;
              return (
                <li
                  key={item.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border/70 bg-white p-5 shadow-[0_10px_30px_rgba(0,40,82,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,40,82,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-[family-name:var(--oak-font-numeric)] text-[2rem] font-semibold leading-none text-primary/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[var(--oak-surface-soft)] text-primary">
                      <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <h3 className="mt-8 text-h4 text-ink">{item.title}</h3>
                  <p className="mt-3 flex-1 text-body-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 right-[-0.65rem] hidden h-px w-6 -translate-y-1/2 bg-border xl:block"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">
            What we promise
          </p>
          <h2 className="mt-2 text-h2">Our promises</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[minmax(15rem,1fr)_minmax(15rem,1fr)_minmax(13rem,auto)]">
            {guaranteeCopy.promises.map((item, index) => {
              const meta =
                promiseBento.find((entry) => entry.title === item.title) ??
                promiseBento[0];
              const Icon = meta.icon;
              const delayClass =
                index === 0
                  ? ""
                  : index === 1
                    ? "[animation-delay:80ms]"
                    : index === 2
                      ? "[animation-delay:140ms]"
                      : "[animation-delay:200ms]";

              if (meta.layout === "hero") {
                return (
                  <article
                    key={item.title}
                    className={cn(
                      "group relative isolate overflow-hidden rounded-[28px] text-white shadow-[0_18px_40px_rgba(0,40,82,0.12)]",
                      "animate-[oak-rise_700ms_cubic-bezier(0.22,1,0.36,1)_both]",
                      delayClass,
                      meta.className,
                    )}
                  >
                    <Image
                      src={meta.image}
                      alt={meta.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 58vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      priority
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,40,82,0.18)_0%,rgba(0,40,82,0.42)_42%,rgba(0,28,58,0.92)_100%)]"
                    />
                    <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-between p-6 sm:p-8 md:min-h-full">
                      <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-white/14 text-white backdrop-blur-sm ring-1 ring-white/20">
                        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div className="max-w-md translate-y-1 transition duration-500 group-hover:translate-y-0">
                        <p className="text-caption font-semibold uppercase tracking-[0.14em] text-white/70">
                          Promise 01
                        </p>
                        <h3 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.9rem]">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-body-sm leading-relaxed text-white/88 sm:text-body">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              }

              if (meta.layout === "banner") {
                return (
                  <article
                    key={item.title}
                    className={cn(
                      "group relative isolate grid overflow-hidden rounded-[28px] bg-[#ECF3F8] shadow-[0_12px_30px_rgba(0,40,82,0.06)] md:grid-cols-[minmax(12rem,0.9fr)_1.4fr]",
                      "animate-[oak-rise_700ms_cubic-bezier(0.22,1,0.36,1)_both]",
                      delayClass,
                      meta.className,
                    )}
                  >
                    <div className="relative min-h-[11rem] overflow-hidden md:min-h-full">
                      <Image
                        src={meta.image}
                        alt={meta.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 36vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,#ECF3F8)] max-md:bg-[linear-gradient(180deg,transparent_40%,#ECF3F8)]"
                      />
                    </div>
                    <div className="relative z-10 flex flex-col justify-center gap-4 p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-primary">
                            Promise 04
                          </p>
                          <h3 className="mt-2 max-w-lg text-h3 text-navy">
                            {item.title}
                          </h3>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-primary shadow-sm">
                          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                      </div>
                      <p className="max-w-2xl text-body-sm leading-relaxed text-secondary">
                        {item.body}
                      </p>
                    </div>
                  </article>
                );
              }

              const promiseNumber = index === 1 ? "02" : "03";
              return (
                <article
                  key={item.title}
                  className={cn(
                    "group relative isolate flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(0,40,82,0.06)] ring-1 ring-[#D7E6F2]/80",
                    "animate-[oak-rise_700ms_cubic-bezier(0.22,1,0.36,1)_both]",
                    delayClass,
                    meta.className,
                  )}
                >
                  <div className="relative h-[9.5rem] shrink-0 overflow-hidden sm:h-[10.5rem]">
                    <Image
                      src={meta.image}
                      alt={meta.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,40,82,0.05)_0%,rgba(0,40,82,0.28)_100%)]"
                    />
                    <span className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-[14px] bg-white/92 text-primary shadow-sm backdrop-blur-sm">
                      <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-end p-5 sm:p-6">
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-primary">
                      Promise {promiseNumber}
                    </p>
                    <h3 className="mt-2 text-h4 text-navy">{item.title}</h3>
                    <p className="mt-3 text-body-sm leading-relaxed text-secondary">
                      {item.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-8">
            <Button href={routes.usedCars}>{guaranteeCopy.browseCta}</Button>
          </p>
        </Container>
      </Section>

      <FAQAccordion
        items={faqItems}
        heading="Guarantee questions"
        hideEmptyCategories
      />

      <Section>
        <Container width="narrow">
          <p className="text-body-sm text-muted">
            {guaranteeCopy.footerLine}{" "}
            <a
              href={routes.thirtyDayGuaranteeTerms}
              className="text-primary underline-offset-4 hover:underline"
            >
              Read full terms
            </a>
            .
          </p>
        </Container>
      </Section>
    </PageBannerScope>
  );
}
