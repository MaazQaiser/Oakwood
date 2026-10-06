import Link from "next/link";
import { HomeFinanceRateLine } from "@/components/home/HomeFinanceRateLine";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import {
  HOME_FINANCE_BEAT_OFFER,
  HOME_FINANCE_ELIGIBILITY,
} from "@/lib/home/copy";

const shell =
  "flex flex-col gap-3 rounded-[20px] px-4 py-4 text-sm leading-snug sm:px-5 lg:px-6";

export function HomeFinanceStrip({
  variant = "reassurance",
  className,
}: {
  variant?: "reassurance" | "eligibility";
  className?: string;
}) {
  if (variant === "eligibility") {
    return (
      <nav
        aria-label="Finance routes"
        className={cn(
          shell,
          "bg-page-tint text-ink lg:flex-row lg:items-center lg:justify-between lg:gap-6",
          className,
        )}
      >
        <Link
          href={routes.eligibility}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          {HOME_FINANCE_ELIGIBILITY}
        </Link>
        <Link
          href={routes.eligibility}
          className="font-semibold text-primary-secondary underline-offset-2 hover:underline lg:shrink-0 lg:text-right"
        >
          {HOME_FINANCE_BEAT_OFFER}
        </Link>
      </nav>
    );
  }

  return (
    <div
      className={cn(
        shell,
        "bg-white/80 text-ink xl:flex-row xl:items-center xl:justify-between xl:gap-8",
        className,
      )}
    >
      <Link
        href={routes.eligibility}
        className="text-base font-semibold leading-snug text-primary underline-offset-2 hover:underline xl:max-w-[28rem]"
      >
        {HOME_FINANCE_ELIGIBILITY}
      </Link>
      <HomeFinanceRateLine
        variant="short"
        layout="row"
        className="m-0 text-sm leading-snug"
      />
      <Link
        href={routes.eligibility}
        className="text-primary-secondary underline decoration-primary-secondary/40 underline-offset-2 hover:text-primary hover:decoration-primary xl:shrink-0"
      >
        {HOME_FINANCE_BEAT_OFFER}
      </Link>
    </div>
  );
}
