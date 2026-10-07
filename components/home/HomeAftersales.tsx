import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { getBookingUrl, routes } from "@/config/routes";
import {
  HOME_AFTERSALES_CTA,
  HOME_AFTERSALES_EYEBROW,
  HOME_AFTERSALES_HEADING,
  HOME_AFTERSALES_IMAGE,
  HOME_AFTERSALES_SERVICES,
  HOME_AFTERSALES_SUPPORT,
  HOME_AFTERSALES_WORKSHOP,
} from "@/lib/home/copy";

const serviceHrefs = {
  mot: routes.mot,
  servicing: routes.service,
  diagnostics: routes.aftersales,
  mechanical: routes.aftersales,
} as const;

function WorkshopPhotoSlot() {
  const slot = HOME_AFTERSALES_IMAGE;
  const src = slot.src;

  if (src) {
    return (
      <figure className="relative m-0 h-full min-h-56 overflow-hidden rounded-[28px] bg-primary sm:min-h-72">
        <Image
          src={src}
          alt={slot.alt ?? slot.intended}
          fill
          sizes="(max-width: 1024px) 100vw, 36rem"
          className="object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary/75 to-transparent px-6 pt-16 pb-5 text-sm font-semibold text-white">
          {HOME_AFTERSALES_WORKSHOP}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="m-0 flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-primary p-6 sm:p-8">
      <figcaption>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/70">
          {slot.label}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-snug text-white/85">
          Oakwood photography of {slot.intended} will appear here when the image
          is connected.
        </p>
        <p className="mt-4 text-sm font-semibold text-white">
          {HOME_AFTERSALES_WORKSHOP}
        </p>
      </figcaption>
    </figure>
  );
}

export function HomeAftersales() {
  return (
    <Section id="aftersales">
      <Container width="wide">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col justify-between gap-8 rounded-[28px] bg-page-tint p-7 sm:p-9">
            <div className="max-w-md">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-primary-secondary">
                {HOME_AFTERSALES_EYEBROW}
              </p>
              <h2
                id="aftersales-heading"
                className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] text-primary sm:text-[2.15rem]"
              >
                {HOME_AFTERSALES_HEADING}
              </h2>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-secondary">
                {HOME_AFTERSALES_SUPPORT}
              </p>
            </div>
            <p className="m-0">
              <Button
                href={getBookingUrl({ type: "service", source: "aftersales" })}
                className="btn-compact w-full max-w-xs sm:w-auto"
              >
                {HOME_AFTERSALES_CTA}
              </Button>
            </p>
          </article>

          <WorkshopPhotoSlot />
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {HOME_AFTERSALES_SERVICES.map((service) => (
            <li key={service.key} className="min-w-0">
              <Link
                href={serviceHrefs[service.key]}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-[20px] bg-page-tint px-4 py-3 text-sm font-semibold leading-snug text-primary no-underline hover:bg-white"
              >
                {service.title}
                <IconArrow
                  width={16}
                  height={16}
                  className="shrink-0 text-primary opacity-0 transition-opacity duration-[var(--oak-motion-fast)] ease-[var(--oak-ease)] group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
