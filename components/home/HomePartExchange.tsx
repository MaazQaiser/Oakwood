import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { SectionIntro } from "@/components/home/SectionIntro";
import { IconArrow } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { HOME_PART_EXCHANGE } from "@/lib/home/copy";
import { PX_INTRO_CTA, PX_INTRO_SUPPORT } from "@/lib/part-exchange/copy";

export function HomePartExchange() {
  return (
    <Section
      id="part-exchange"
      aria-label="Part exchange"
      className="bg-[#002852]"
    >
      <Container>
        <SectionIntro
          heading={`${HOME_PART_EXCHANGE}.`}
          headingClassName="text-white"
          bodyClassName="text-white/80"
        >
          {PX_INTRO_SUPPORT}
        </SectionIntro>
        <p className="mt-6">
          <Link
            href={routes.partExchange}
            className="inline-flex h-11 items-center justify-between gap-2 rounded-[14px] bg-white py-1 pl-4 pr-1 text-sm font-semibold text-[#002852] no-underline hover:bg-[#E7F1F8]"
          >
            {PX_INTRO_CTA}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#002852] text-white">
              <IconArrow width={16} height={16} />
            </span>
          </Link>
        </p>
      </Container>
    </Section>
  );
}
