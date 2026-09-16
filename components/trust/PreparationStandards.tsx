import type { TrustSection } from "@/types/trust";

export function PreparationStandards({
  sections,
}: {
  sections: TrustSection[];
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={`${section.title}-heading`}>
          <h2 id={`${section.title}-heading`} className="text-h3">
            {section.title}
          </h2>
          <p className="mt-3 text-body text-muted">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
