"use client";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/layout/Container";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  CONTACT_CALL,
  CONTACT_CALLBACK,
  CONTACT_CHAT_UNAVAILABLE,
  CONTACT_DIRECTIONS,
  CONTACT_MESSAGE,
  CONTACT_METHOD_TITLE,
  CONTACT_OUT_OF_HOURS,
  SUPPORT_CHAT_CONNECTED,
} from "@/lib/support/copy";
import { toTelHref } from "@/lib/format/phone";

export function ContactOptions({
  telephone,
  directionsHref,
}: {
  telephone?: string;
  directionsHref: string;
}) {
  const track = (method: string) => {
    trackEvent(analyticsEvents.contactMethodClicked, { method });
  };

  return (
    <Section>
      <Container>
        <h2 id="contact-methods" className="text-h2">
          {CONTACT_METHOD_TITLE}
        </h2>
        <p className="mt-3 max-w-2xl text-body text-muted">{CONTACT_OUT_OF_HOURS}</p>
        {!SUPPORT_CHAT_CONNECTED ? (
          <p className="mt-2 max-w-2xl text-body-sm text-muted">
            {CONTACT_CHAT_UNAVAILABLE}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {telephone ? (
            <Button
              href={toTelHref(telephone)}
              size="lg"
              onClick={() => track("call")}
            >
              {CONTACT_CALL}
            </Button>
          ) : null}
          <Button
            href="#contact-form"
            variant={telephone ? "secondary" : "primary"}
            size="lg"
            onClick={() => track("message")}
          >
            {CONTACT_MESSAGE}
          </Button>
          <Button
            href="#contact-form"
            variant="secondary"
            size="lg"
            onClick={() => {
              track("callback");
              trackEvent(analyticsEvents.callbackRequested, { source: "contact" });
            }}
          >
            {CONTACT_CALLBACK}
          </Button>
          <Button
            href={directionsHref}
            variant="text"
            onClick={() => track("directions")}
          >
            {CONTACT_DIRECTIONS}
          </Button>
        </div>
        {telephone ? (
          <p className="mt-4 text-body-sm">
            <a
              href={toTelHref(telephone)}
              className="text-primary underline-offset-4 hover:underline"
              onClick={() => track("call")}
            >
              {telephone}
            </a>
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
