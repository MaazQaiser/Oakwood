import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import type { FinanceRelatedLink } from "@/types/finance-intent";

export function FinanceRelatedLinks({
  links,
  heading = "Related finance pages",
}: {
  links: FinanceRelatedLink[];
  heading?: string;
}) {
  const unique = links.filter(
    (link, index, list) =>
      list.findIndex((item) => item.href === link.href) === index,
  );

  if (unique.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <nav aria-label={heading}>
          <h2 className="text-h2">{heading}</h2>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2">
            {unique.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-body-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  );
}
