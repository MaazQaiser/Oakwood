"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { submitPriceDropAlert } from "@/features/alerts/actions";
import type { PriceAlertChannel } from "@/types/price-alert";
import type { VehicleDetail } from "@/types/vehicle-detail";

const CHANNEL_OPTIONS: { id: PriceAlertChannel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
];

export function VehiclePriceDropAlert({ vehicle }: { vehicle: VehicleDetail }) {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [channels, setChannels] = useState<PriceAlertChannel[]>(["email"]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (vehicle.availability !== "available") {
    return null;
  }

  function toggleChannel(channel: PriceAlertChannel) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  return (
    <section
      aria-labelledby="price-drop-alert-heading"
      className="rounded-[20px] border border-border bg-white px-4 py-4 md:px-5"
    >
      <h2 id="price-drop-alert-heading" className="text-body font-semibold text-ink">
        Tell me if the price drops
      </h2>
      <p className="mt-1 text-body-sm text-muted">
        Pick how we should reach you. This preview stores your alert until pricing alerts
        are connected live.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError(undefined);
          setMessage(undefined);
          startTransition(async () => {
            const result = await submitPriceDropAlert({
              stockId: vehicle.stockId,
              email,
              telephone,
              channels,
            });
            if (result.ok) {
              setMessage(`Alert saved. Reference ${result.reference}.`);
              setEmail("");
              setTelephone("");
            } else {
              setError(result.error);
            }
          });
        }}
      >
        <fieldset>
          <legend className="text-label text-muted">Alert me by</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHANNEL_OPTIONS.map((option) => {
              const active = channels.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`min-h-10 rounded-full px-3 text-body-sm ${
                    active
                      ? "bg-primary text-white"
                      : "bg-[#ECF3F8] text-ink ring-1 ring-[#E7EEF4]"
                  }`}
                  aria-pressed={active}
                  onClick={() => toggleChannel(option.id)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        {channels.includes("email") ? (
          <Field htmlFor="price-alert-email" label="Email">
            <Input
              id="price-alert-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
        ) : null}
        {channels.includes("sms") || channels.includes("whatsapp") ? (
          <Field htmlFor="price-alert-phone" label="Mobile">
            <Input
              id="price-alert-phone"
              type="tel"
              autoComplete="tel"
              value={telephone}
              onChange={(event) => setTelephone(event.target.value)}
            />
          </Field>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Saving…" : "Create price drop alert"}
        </Button>
      </form>
      {message ? (
        <p className="mt-3 text-body-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-body-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}