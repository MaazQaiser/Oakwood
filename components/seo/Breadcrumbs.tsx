import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";
import { cn } from "@/lib/cn";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 max-w-full">
      <ol className="flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden text-caption text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li
              key={`${item.href}-${item.label}`}
              className={cn(
                "flex min-w-0 items-center gap-1.5",
                last ? "shrink" : "shrink-0",
              )}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="shrink-0">
                  /
                </span>
              ) : null}
              {last ? (
                <span aria-current="page" className="truncate text-ink">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="whitespace-nowrap py-1 hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
