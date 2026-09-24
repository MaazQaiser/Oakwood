"use client";

import { useState } from "react";
import { StatusDisclosureLink } from "@/components/finance/StatusDisclosureLink";
import { Button } from "@/components/ui/Button";
import { Field, Select } from "@/components/forms/FormControls";
import { Card } from "@/components/cards/Card";
import { routes } from "@/config/routes";

export function FinanceEligibilityCard() {
  const [monthly, setMonthly] = useState(200);
  const [deposit, setDeposit] = useState(1000);
  const [term, setTerm] = useState(48);

  return (
    <Card className="border-0 p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:w-72 lg:shrink-0">
          <p className="text-h5">What could you afford?</p>
          <p className="mt-2 text-body-sm text-muted">
            Set a starting point, then check eligibility. This does not calculate a
            finance offer.
          </p>
          <p className="mt-4 text-caption">
            <StatusDisclosureLink />
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
          <Field htmlFor="hero-monthly" label="Monthly budget">
            <Select
              id="hero-monthly"
              name="monthly"
              value={monthly}
              onChange={(event) => setMonthly(Number(event.target.value))}
            >
              <option value={150}>Under £150</option>
              <option value={200}>£200</option>
              <option value={250}>£250</option>
              <option value={300}>£300</option>
              <option value={400}>£400+</option>
            </Select>
          </Field>
          <Field htmlFor="hero-deposit" label="Deposit">
            <Select
              id="hero-deposit"
              name="deposit"
              value={deposit}
              onChange={(event) => setDeposit(Number(event.target.value))}
            >
              <option value={0}>£0</option>
              <option value={500}>£500</option>
              <option value={1000}>£1,000</option>
              <option value={2000}>£2,000</option>
              <option value={3000}>£3,000</option>
            </Select>
          </Field>
          <Field htmlFor="hero-term" label="Term">
            <Select
              id="hero-term"
              name="term"
              value={term}
              onChange={(event) => setTerm(Number(event.target.value))}
            >
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
            </Select>
          </Field>
          </div>
          <Button
            href={routes.eligibility}
            className="btn-compact w-full shrink-0 sm:w-auto"
          >
            Check my eligibility
          </Button>
        </div>
      </div>
    </Card>
  );
}
