import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { routes } from "@/config/routes";
import { guaranteeCopy } from "@/lib/guarantee/copy";
import { cn } from "@/lib/cn";

export function GuaranteeBadge({ className }: { className?: string }) {
  return (
    <Tooltip label={guaranteeCopy.badgeDetail}>
      <Link
        href={routes.thirtyDayGuarantee}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-[#E8F4FC] px-3 py-1.5 text-[0.75rem] font-semibold text-[#0875D1]",
          "ring-1 ring-[#0875D1]/20 transition hover:bg-[#dff0fb]",
          className,
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        {guaranteeCopy.badgeTitle}
      </Link>
    </Tooltip>
  );
}