import type { AftersalesFaqItem } from "@/types/aftersales";

export function AftersalesFaq({
  items,
  heading = "Frequently asked questions",
}: {
  items: AftersalesFaqItem[];
  heading?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="aftersales-faq-heading">
      <h2 id="aftersales-faq-heading" className="text-h3">
        {heading}
      </h2>
      <div className="mt-4">
        {items.map((item) => (
          <details key={item.question} className="border-b border-border py-3">
            <summary className="cursor-pointer list-none text-label outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              <span className="flex min-h-11 items-center justify-between gap-4">
                {item.question}
                <span aria-hidden="true" className="text-subtle">
                  +
                </span>
              </span>
            </summary>
            <p className="pb-3 pt-1 text-body-sm text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
