import Link from "next/link";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";

export function GuaranteeStrip() {
  return (
    <div className="bg-primary text-white">
      <Link
        href={routes.thirtyDayGuarantee}
        className="flex min-h-9 items-center justify-center px-[var(--oak-page-x)] py-2 text-center text-[0.78rem] font-medium tracking-[-0.01em] text-white no-underline hover:underline sm:text-[0.82rem]"
      >
        {guaranteeCopy.badgeTitle}
      </Link>
    </div>
  );
}
