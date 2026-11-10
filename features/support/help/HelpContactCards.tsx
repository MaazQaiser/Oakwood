import type { ReactNode } from "react";
import { IconMessage, IconPhone } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { HelpArrowLink } from "@/features/support/help/HelpArrowLink";
import { IconClock, IconWrench } from "@/features/support/help/HelpIcons";
import { HELP_CONTACT_CARDS } from "@/lib/support/help-hub";
import { cn } from "@/lib/cn";

const ICONS: Record<string, ReactNode> = {
  call: <IconPhone width={20} height={20} />,
  message: <IconMessage width={20} height={20} />,
  callback: <IconClock width={20} height={20} />,
  claim: <IconWrench width={20} height={20} />,
};

export function HelpContactCards() {
  return (
    <section
      id="contact"
      aria-labelledby="help-contact-heading"
      className="scroll-mt-[calc(var(--oak-header-height)+1rem)] px-6 pb-16 lg:px-0 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[var(--oak-width-wide)] lg:px-[var(--oak-page-x)] max-[480px]:max-w-[350px]">
        <div className="rounded-[32px] bg-[#ECF3F8] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="help-contact-heading"
                className="text-[1.9rem] font-semibold leading-tight tracking-[-0.03em] text-[#002852] sm:text-[2.25rem]"
              >
                Still need help?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-secondary">
                Call us if you can. If we can&apos;t pick up, send a message or ask us
                to call you back.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_CONTACT_CARDS.map((card) => {
              const featured = Boolean(card.featured);
              return (
                <article
                  key={card.id}
                  className={cn(
                    "flex min-w-0 flex-col rounded-[24px] p-5 sm:p-6",
                    featured
                      ? "bg-[#002852] text-white"
                      : "bg-white shadow-[0_10px_24px_rgba(16,40,72,0.06)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-[10px]",
                      featured ? "bg-white text-[#002852]" : "bg-[#002852] text-white",
                    )}
                  >
                    {ICONS[card.id]}
                  </span>
                  <h3
                    className={cn(
                      "mt-4 text-lg font-semibold leading-snug tracking-[-0.02em]",
                      featured ? "text-white" : "text-[#002852]",
                    )}
                  >
                    {card.title}
                  </h3>
                  {card.branches ? (
                    <div className="mt-3 space-y-3">
                      {card.branches.map((branch) => (
                        <div key={branch.name}>
                          <p className="text-xs font-semibold tracking-[0.04em] text-[#9fd3f2] uppercase">
                            {branch.name}
                          </p>
                          <a
                            href={branch.telHref}
                            className="mt-0.5 block text-lg font-semibold tabular-nums text-white no-underline hover:underline"
                          >
                            {branch.phone}
                          </a>
                          <p className="text-xs text-white/65">{branch.hours}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {card.body ? (
                    <p className="mt-2 text-sm leading-snug text-secondary">{card.body}</p>
                  ) : null}
                  {card.cta ? (
                    <div className="mt-auto pt-5">
                      <HelpArrowLink href={card.cta.href} className="w-full">
                        {card.cta.label}
                      </HelpArrowLink>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-secondary">
            Unhappy with something?{" "}
            <a href={routes.complaints} className="font-semibold text-primary">
              Raise a complaint
            </a>{" "}
            online or by phone.
          </p>
        </div>
      </div>
    </section>
  );
}
