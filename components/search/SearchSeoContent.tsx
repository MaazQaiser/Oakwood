import { Container, Section } from "@/components/layout/Container";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import { getSeoCopy } from "@/lib/vehicles/inventory";

export function SearchSeoContent({
  context,
}: {
  context: InventoryPageContext;
}) {
  const copy = getSeoCopy(context);

  return (
    <Section className="bg-[#ECF3F8]">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-h2">{copy.heading}</h2>
          <p className="mt-3 text-body text-muted">{copy.paragraph}</p>
        </div>
      </Container>
    </Section>
  );
}
