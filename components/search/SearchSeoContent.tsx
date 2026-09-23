import Link from "next/link";
import { Container, Section } from "@/components/layout/Container";
import { routes, getMakeUrl, getModelUrl } from "@/config/routes";
import type { InventoryPageContext } from "@/lib/vehicles/inventory";
import { getSeoCopy } from "@/lib/vehicles/inventory";
import { getMakeName, getModelName } from "@/lib/vehicles/labels";

export function SearchSeoContent({
  context,
}: {
  context: InventoryPageContext;
}) {
  const copy = getSeoCopy(context);
  const category = context.category === "van" ? "vans" : "cars";
  const makeName = getMakeName(context.locked.make, context.category);
  const modelName = getModelName(
    context.locked.make,
    context.locked.model,
    context.category,
  );

  return (
    <Section className="bg-[#ECF3F8]">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-h2">{copy.heading}</h2>
          <p className="mt-3 text-body text-muted">{copy.paragraph}</p>
          <h3 className="text-h4 mt-8">Explore Oakwood</h3>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
            <li>
              <Link href={routes.usedCars} className="font-medium text-[#002852] hover:underline">
                Used Cars
              </Link>
            </li>
            <li>
              <Link href={routes.usedVans} className="font-medium text-[#002852] hover:underline">
                Used Vans
              </Link>
            </li>
            {context.locked.make ? (
              <li>
                <Link
                  href={getMakeUrl(context.locked.make, category)}
                  className="font-medium text-[#002852] hover:underline"
                >
                  {makeName}
                </Link>
              </li>
            ) : null}
            {context.locked.make && context.locked.model ? (
              <li>
                <Link
                  href={getModelUrl(
                    context.locked.make,
                    context.locked.model,
                    category,
                  )}
                  className="font-medium text-[#002852] hover:underline"
                >
                  {makeName} {modelName}
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={routes.finance} className="font-medium text-[#002852] hover:underline">
                Finance
              </Link>
            </li>
            <li>
              <Link href={routes.sellMyCar} className="font-medium text-[#002852] hover:underline">
                Sell My Car
              </Link>
            </li>
            <li>
              <Link href={`${routes.locations}/bury`} className="font-medium text-[#002852] hover:underline">
                Bury
              </Link>
            </li>
            <li>
              <Link
                href={`${routes.locations}/chorley`}
                className="font-medium text-[#002852] hover:underline"
              >
                Chorley
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
