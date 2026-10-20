"use client";

import Link from "next/link";
import { IconHeart } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { useSavedVehicles } from "@/features/saved/SavedVehiclesProvider";
import { cn } from "@/lib/cn";

export function SavedCarsLink({ className }: { className?: string }) {
  const { count, ready } = useSavedVehicles();
  const saved = ready && count > 0;

  return (
    <Link
      href={routes.savedCars}
      aria-label={saved ? `Your cars, ${count} saved` : "Your cars"}
      className={cn(
        "relative inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-white/70",
        className,
      )}
    >
      <IconHeart filled={saved} width={22} height={22} className={saved ? "text-primary" : undefined} />
      {saved ? (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
