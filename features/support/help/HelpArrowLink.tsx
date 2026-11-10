import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrow } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const tones = {
  navy: {
    shell: "bg-[#002852] text-white hover:bg-[#001c3d]",
    chip: "bg-white text-[#002852]",
  },
  white: {
    shell: "bg-white text-[#002852] hover:bg-[#E7F1F8]",
    chip: "bg-[#E7F1F8] text-[#002852]",
  },
} as const;

export function HelpArrowLink({
  href,
  children,
  tone = "navy",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  const style = tones[tone];
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-between gap-3 rounded-[14px] py-1 pr-1 pl-4 text-sm font-semibold no-underline",
        style.shell,
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-[10px]",
          style.chip,
        )}
      >
        <IconArrow width={16} height={16} />
      </span>
    </Link>
  );
}
