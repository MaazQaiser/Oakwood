import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/cards/Card";
import { Container, Grid, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { getLocationUrl } from "@/config/routes";
import {
  WHY_OAKWOOD_AA_INSPECTED,
  WHY_OAKWOOD_AA_NOTE,
  WHY_OAKWOOD_AA_POINTS,
  WHY_OAKWOOD_CARS,
  WHY_OAKWOOD_CARS_HANDED_OVER,
  WHY_OAKWOOD_CMS_NOTICE,
  WHY_OAKWOOD_ESTABLISHED_YEAR,
  WHY_OAKWOOD_HEADING,
  WHY_OAKWOOD_IMAGES,
  WHY_OAKWOOD_INTRO,
  WHY_OAKWOOD_LINKS,
  WHY_OAKWOOD_PREPARATION,
  WHY_OAKWOOD_SHOWROOMS,
  WHY_OAKWOOD_TECHNICIANS,
  WHY_OAKWOOD_WARRANTY,
  WHY_OAKWOOD_WARRANTY_COPY,
  WHY_OAKWOOD_WORKSHOP,
  type WhyOakwoodImageSlot,
  type WhyOakwoodTechnician,
} from "@/lib/home/why-oakwood";
import { oakwoodInventoryImage } from "@/lib/media/oakwood";

function ContentSlot({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-ink/20 bg-white/70 px-4 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
        {label}
      </p>
      <p className="mt-2 text-body-sm text-muted">{children}</p>
    </div>
  );
}

function PhotoSlot({ slot }: { slot: WhyOakwoodImageSlot }) {
  const src = oakwoodInventoryImage(slot.src);

  if (src) {
    return (
      <figure className="overflow-hidden rounded-[22px] bg-page-tint">
        <div className="relative aspect-[16/10] max-h-40 w-full sm:max-h-56">
          <Image
            src={src}
            alt={slot.alt ?? slot.intended}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <figcaption className="px-4 py-3 text-body-sm text-ink">
          {slot.label}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-[22px] bg-page-tint">
      <div
        className="flex aspect-[16/10] max-h-40 w-full flex-col justify-end p-3 sm:max-h-56 sm:p-4"
        role="img"
        aria-label={`${slot.label} photography slot. ${slot.intended}.`}
      >
        <figcaption>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
            {slot.label}
          </p>
          <p className="mt-1 text-body-sm leading-snug text-secondary">
            Photography will appear here when the image is connected.
          </p>
        </figcaption>
      </div>
    </figure>
  );
}

function TechnicianSlot({ person, index }: { person?: WhyOakwoodTechnician; index: number }) {
  if (person?.name) {
    return (
      <Card as="article" className="border-0 shadow-sm">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
          Technician
        </p>
        <h3 className="mt-2 text-h5">{person.name}</h3>
        {person.qualifications ? (
          <p className="mt-2 text-body-sm text-muted">{person.qualifications}</p>
        ) : (
          <p className="mt-2 text-body-sm text-muted">
            Qualifications will appear here when the content source is connected.
          </p>
        )}
        {person.yearsOfService ? (
          <p className="mt-1 text-body-sm text-muted">{person.yearsOfService}</p>
        ) : (
          <p className="mt-1 text-body-sm text-muted">
            Years of service will appear here when the content source is connected.
          </p>
        )}
      </Card>
    );
  }

  return (
    <ContentSlot label={index === 0 ? "Named technicians" : `Technician ${index + 1}`}>
      Technician names, qualifications and years of service will appear here when
      the content source is connected.
    </ContentSlot>
  );
}

export function WhyOakwood() {
  const people =
    WHY_OAKWOOD_TECHNICIANS.length > 0 ? WHY_OAKWOOD_TECHNICIANS : [undefined];

  return (
    <Section
      id="why-oakwood"
      aria-label="Why Oakwood"
      className="bg-page-tint"
    >
      <Container>
        <SectionIntro
          align="center"
          heading={WHY_OAKWOOD_HEADING}
          headingClassName="text-primary"
        >
          {WHY_OAKWOOD_INTRO}
        </SectionIntro>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="flex flex-col justify-between rounded-[28px] bg-primary p-6 text-white sm:p-8 lg:col-span-2">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                Vehicle checks
              </p>
              <h3 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.9rem]">
                {WHY_OAKWOOD_AA_INSPECTED}
              </h3>
              <p className="mt-3 text-lg font-medium text-white/85">
                {WHY_OAKWOOD_AA_POINTS}
              </p>
              <p className="mt-4 max-w-xl text-body-sm leading-relaxed text-white/75">
                {WHY_OAKWOOD_AA_NOTE}
              </p>
            </div>
            <p className="mt-6">
              <Button href={WHY_OAKWOOD_LINKS.aaStandards} variant="secondary">
                AA standards
              </Button>
            </p>
          </article>

          <article className="flex flex-col rounded-[28px] bg-white p-6 sm:p-7">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-secondary">
              Oakwood experience
            </p>
            <div className="mt-5 space-y-4">
              {WHY_OAKWOOD_ESTABLISHED_YEAR ? (
                <div>
                  <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-oakwood tabular-nums">
                    {WHY_OAKWOOD_ESTABLISHED_YEAR}
                  </p>
                  <p className="mt-2 text-body-sm text-muted">Established</p>
                </div>
              ) : (
                <ContentSlot label="Established">
                  Not in the content source yet.
                </ContentSlot>
              )}
              {WHY_OAKWOOD_CARS_HANDED_OVER ? (
                <div>
                  <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-oakwood tabular-nums">
                    {WHY_OAKWOOD_CARS_HANDED_OVER}
                  </p>
                  <p className="mt-2 text-body-sm text-muted">Cars handed over</p>
                </div>
              ) : (
                <div>
                  <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-oakwood tabular-nums">
                    {WHY_OAKWOOD_CARS}
                  </p>
                  <p className="mt-2 text-body-sm text-muted">Oakwood used cars</p>
                </div>
              )}
            </div>
          </article>
        </div>

        <Grid columns="default" className="mt-4 xl:grid-cols-3">
          <Card as="article" className="border-0 shadow-sm">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-secondary">
              Warranty
            </p>
            <h3 className="mt-3 text-h5">{WHY_OAKWOOD_WARRANTY}</h3>
            <p className="mt-2 text-body-sm text-muted">{WHY_OAKWOOD_WARRANTY_COPY}</p>
            <p className="mt-4">
              <Button href={WHY_OAKWOOD_LINKS.warranty} variant="text" className="px-0">
                Warranty details
              </Button>
            </p>
          </Card>

          <Card as="article" className="border-0 shadow-sm">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-secondary">
              Preparation
            </p>
            <h3 className="mt-3 text-h5">In-house vehicle preparation</h3>
            <p className="mt-2 text-body-sm text-muted">{WHY_OAKWOOD_PREPARATION}</p>
            <p className="mt-4">
              <Button href={WHY_OAKWOOD_LINKS.garage} variant="text" className="px-0">
                Our garage
              </Button>
            </p>
          </Card>

          <Card as="article" className="border-0 shadow-sm">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-secondary">
              Locations and workshop
            </p>
            <h3 className="mt-3 text-h5">
              Two showrooms + {WHY_OAKWOOD_WORKSHOP.toLowerCase()}
            </h3>
            <ul className="mt-3 space-y-1 text-body-sm text-muted">
              {WHY_OAKWOOD_SHOWROOMS.map((showroom) => (
                <li key={showroom.slug}>
                  <Button
                    href={getLocationUrl(showroom.slug)}
                    variant="text"
                    className="px-0"
                  >
                    {showroom.name}
                  </Button>
                </li>
              ))}
              <li>{WHY_OAKWOOD_WORKSHOP}</li>
            </ul>
            <p className="mt-4">
              <Button href={WHY_OAKWOOD_LINKS.locations} variant="text" className="px-0">
                All locations
              </Button>
            </p>
          </Card>
        </Grid>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {WHY_OAKWOOD_IMAGES.map((slot) => (
            <PhotoSlot key={slot.id} slot={slot} />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-h4 text-primary">People</h3>
          <p className="mt-2 max-w-2xl text-body-sm text-muted">
            Named technicians, qualifications and years of service are published
            here only when they are in the Oakwood content source.
          </p>
          <Grid columns="two" className="mt-4">
            {people.map((person, index) => (
              <TechnicianSlot
                key={person?.name ?? `technician-slot-${index}`}
                person={person}
                index={index}
              />
            ))}
          </Grid>
        </div>

        <p className="mt-8 text-center text-caption text-muted">
          {WHY_OAKWOOD_CMS_NOTICE}
        </p>
      </Container>
    </Section>
  );
}
