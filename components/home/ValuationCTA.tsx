import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/layout/Container";
import { IconCheck } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { stockImages } from "@/lib/media/stock";

const points = [
  "No account needed",
  "Online figure is an estimate",
  "Use it towards your next deposit",
];

export function ValuationCTA() {
  return (
    <Section>
      <Container>
        <div className="overflow-hidden rounded-3xl bg-page-tint lg:grid lg:grid-cols-2">
          <div className="relative min-h-64 aspect-[16/10] lg:aspect-auto lg:min-h-[28rem]">
            <Image
              src={stockImages.carSide}
              alt="Used car ready for a part-exchange valuation"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-16">
            <p className="text-caption text-primary">Have a car to sell?</p>
            <h2 className="text-h2 mt-3">Get a valuation in minutes.</h2>
            <p className="mt-4 text-body text-muted">
              See how much your car could contribute to your deposit.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm">
                  <IconCheck className="mt-0.5 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={routes.sellMyCar} size="lg">
                Get my valuation
              </Button>
              <Button href={routes.partExchange} variant="text">
                Part exchange my car
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
