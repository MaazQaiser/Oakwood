"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/forms/FormControls";
import { formatNumber, formatPounds } from "@/lib/format/money";
import type { VehicleDetail } from "@/types/vehicle-detail";

function answerFor(vehicle: VehicleDetail, question: string): string {
  const q = question.toLowerCase();
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  if (q.includes("price") || q.includes("cost") || q.includes("monthly")) {
    return `${title} is ${formatPounds(vehicle.cashPrice)} cash, with a representative figure of ${formatPounds(vehicle.monthlyPayment)} a month. That monthly figure is an illustration until you build a deal.`;
  }
  if (q.includes("mile")) {
    return `The recorded mileage is ${formatNumber(vehicle.mileage)} miles.`;
  }
  if (q.includes("fuel") || q.includes("petrol") || q.includes("diesel") || q.includes("electric")) {
    return `${title} is ${vehicle.fuelType}, ${vehicle.transmission}.`;
  }
  if (q.includes("where") || q.includes("location") || q.includes("collect")) {
    return `This car is listed at Oakwood ${vehicle.locationName}. You can book a test drive or viewing on this page.`;
  }
  if (q.includes("service") || q.includes("history") || q.includes("mot")) {
    return vehicle.serviceHistory?.summary ?? "Service history is shown in the documentation section on this page.";
  }
  if (q.includes("battery")) {
    return vehicle.batteryHealth?.summary ?? "Battery health is shown when it applies to this car.";
  }
  if (q.includes("owner") || q.includes("keeper")) {
    const keepers = vehicle.fullSpecification?.previousOwners;
    return keepers !== undefined
      ? `Previous keepers: ${keepers}.`
      : "Previous keepers are listed in the key specification when we have them.";
  }
  if (q.includes("reserve") || q.includes("hold")) {
    return "Use Reserve on this page to hold the car. The reservation amount and refund terms are shown before you pay.";
  }
  if (q.includes("finance") || q.includes("hp") || q.includes("pcp")) {
    return "Open Finance this car to switch HP and PCP, change the deposit and term, and see an illustrative monthly payment.";
  }
  return `${title} is a ${vehicle.colour} ${vehicle.bodyStyle} with ${formatNumber(vehicle.mileage)} miles, listed at ${formatPounds(vehicle.cashPrice)}. Ask about price, mileage, fuel, location, service history or finance.`;
}

export function VehicleAskPanel({ vehicle }: { vehicle: VehicleDetail }) {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string>();
  const suggestions = useMemo(
    () => ["What's the monthly price?", "Where is this car?", "How many miles?"],
    [],
  );

  return (
    <section aria-labelledby="ask-car-heading" className="rounded-[28px] border border-border bg-[#ECF3F8] p-5 md:p-6">
      <h2 id="ask-car-heading" className="text-h3">
        Ask about this car
      </h2>
      <p className="mt-2 text-body-sm text-muted">
        Answers use the details published on this page.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <Button
            key={item}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setReply(answerFor(vehicle, item))}
          >
            {item}
          </Button>
        ))}
      </div>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setReply(answerFor(vehicle, question));
        }}
      >
        <div className="min-w-0 flex-1">
          <Field htmlFor="ask-car" label="Your question">
            <Input
              id="ask-car"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about this car"
            />
          </Field>
        </div>
        <Button type="submit">Ask</Button>
      </form>
      {reply ? (
        <p className="mt-4 text-body-sm text-ink" role="status">
          {reply}
        </p>
      ) : null}
    </section>
  );
}
