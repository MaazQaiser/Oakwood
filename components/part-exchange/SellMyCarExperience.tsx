"use client";

import { useState, useTransition } from "react";
import { PxStandalone } from "@/components/part-exchange/PxFlow";
import { PageBanner } from "@/components/layout/PageBanner";
import { Container, Section } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field, Input } from "@/components/forms/FormControls";
import { routes } from "@/config/routes";
import { submitSellOutrightLeadAction } from "@/features/part-exchange/sell-outright-actions";
import {
  SELL_INTENT_COPY,
  type SellIntent,
} from "@/lib/part-exchange/sell-intent";
import { createBreadcrumbs } from "@/lib/seo";

function SellOutrightForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [registration, setRegistration] = useState("");
  const [mileage, setMileage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <>
        <PageBanner
          title={SELL_INTENT_COPY.sellSuccessHeading}
          description={SELL_INTENT_COPY.sellSuccessBody}
          breadcrumbs={createBreadcrumbs([
            { label: "Home", href: routes.home },
            { label: "Sell my car", href: routes.sellMyCar },
          ])}
          width="narrow"
        />
        <Section>
          <Container width="narrow">
            <Alert title="Passed to SCI" tone="success">
              <p>{SELL_INTENT_COPY.sellSuccessNote}</p>
            </Alert>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={routes.usedCars}>Browse Oakwood cars</Button>
              <Button href={routes.home} variant="secondary">
                Home
              </Button>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={SELL_INTENT_COPY.sellFormHeading}
        description={SELL_INTENT_COPY.sellFormSupport}
        breadcrumbs={createBreadcrumbs([
          { label: "Home", href: routes.home },
          { label: "Sell my car", href: routes.sellMyCar },
        ])}
        width="narrow"
      />
      <Section>
        <Container width="narrow">
          <div className="space-y-4 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
            <Field label="Name" htmlFor="sell-name">
              <Input
                id="sell-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="sell-email">
              <Input
                id="sell-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Mobile" htmlFor="sell-mobile">
              <Input
                id="sell-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Field>
            <Field label="Registration" htmlFor="sell-reg">
              <Input
                id="sell-reg"
                value={registration}
                onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Mileage (optional)" htmlFor="sell-miles">
              <Input
                id="sell-miles"
                inputMode="numeric"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </Field>
            {error ? (
              <Alert title="Could not send" tone="warning">
                <p>{error}</p>
              </Alert>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                busy={pending}
                onClick={() => {
                  setError(null);
                  startTransition(() => {
                    void submitSellOutrightLeadAction({
                      name,
                      email,
                      mobile,
                      registration,
                      mileage,
                    }).then((result) => {
                      if (!result.ok) {
                        setError(result.message);
                        return;
                      }
                      setDone(true);
                    });
                  });
                }}
              >
                Pass my details to SCI
              </Button>
              <Button type="button" variant="secondary" onClick={onBack}>
                Back
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function SellIntentChooser({
  onChoose,
}: {
  onChoose: (intent: SellIntent) => void;
}) {
  return (
    <>
      <PageBanner
        title={SELL_INTENT_COPY.heading}
        description={SELL_INTENT_COPY.support}
        breadcrumbs={createBreadcrumbs([
          { label: "Home", href: routes.home },
          { label: "Sell my car", href: routes.sellMyCar },
        ])}
        width="narrow"
      />
      <Section>
        <Container width="narrow">
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-[22px] bg-white p-6 text-left ring-1 ring-[#E7EEF4] transition hover:ring-[#8EBFDF]"
              onClick={() => onChoose("part-exchange")}
            >
              <p className="oak-eyebrow">{SELL_INTENT_COPY.eyebrow}</p>
              <h2 className="mt-2 text-h3">{SELL_INTENT_COPY.partExchangeTitle}</h2>
              <p className="mt-2 text-body-sm text-muted">
                {SELL_INTENT_COPY.partExchangeBody}
              </p>
            </button>
            <button
              type="button"
              className="rounded-[22px] bg-white p-6 text-left ring-1 ring-[#E7EEF4] transition hover:ring-[#8EBFDF]"
              onClick={() => onChoose("sell-outright")}
            >
              <p className="oak-eyebrow">Sell outright</p>
              <h2 className="mt-2 text-h3">{SELL_INTENT_COPY.sellOutrightTitle}</h2>
              <p className="mt-2 text-body-sm text-muted">
                {SELL_INTENT_COPY.sellOutrightBody}
              </p>
            </button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function SellMyCarExperience({
  initialRegistration,
  askIntent = false,
}: {
  initialRegistration?: string;
  /** When true, ask part exchange vs sell outright before continuing. */
  askIntent?: boolean;
}) {
  const [intent, setIntent] = useState<SellIntent | null>(
    askIntent ? null : "part-exchange",
  );

  if (askIntent && intent === null) {
    return <SellIntentChooser onChoose={setIntent} />;
  }

  if (intent === "sell-outright") {
    return <SellOutrightForm onBack={() => setIntent(null)} />;
  }

  return <PxStandalone initialRegistration={initialRegistration} />;
}
