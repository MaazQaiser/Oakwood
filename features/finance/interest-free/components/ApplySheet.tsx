"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Dialogs";
import { submitInterestFreeApplication } from "@/features/finance/interest-free/actions";
import type { InterestFreeDeal } from "@/lib/finance/interest-free/deal";
import { formatPounds } from "@/lib/format/money";

export function ApplySheet({
  open,
  onClose,
  deal,
}: {
  open: boolean;
  onClose: () => void;
  deal: InterestFreeDeal;
}) {
  const [acked, setAcked] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { vehicle: c } = deal;

  function submit() {
    if (!acked) return;
    startTransition(async () => {
      const result = await submitInterestFreeApplication({
        stockId: c.stockId,
        cashDeposit: deal.cashDeposit,
        advance: deal.advance,
        term: deal.term,
        total: deal.total,
        shortfall: deal.shortfall,
        acknowledgedAt: new Date().toISOString(),
      });
      if (result.ok) {
        setDone(result.leadId);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Drawer
      open={open}
      title="Apply for 0%"
      size="full"
      onClose={() => {
        setAcked(false);
        setDone(null);
        setError(null);
        onClose();
      }}
      footer={
        done ? null : (
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-body-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={acked}
                onChange={(e) => setAcked(e.target.checked)}
              />
              <span>
                I understand this is a full credit search and will leave a footprint on my
                credit file.
              </span>
            </label>
            <Button
              variant="primary"
              className="w-full"
              disabled={!acked || pending}
              onClick={submit}
            >
              {pending ? "Submitting…" : "Submit my application"}
            </Button>
            {error ? <p className="text-body-sm text-danger">{error}</p> : null}
          </div>
        )
      }
    >
      {done ? (
        <div className="space-y-3 py-4">
          <p className="text-h4">Application submitted</p>
          <p className="text-body-sm text-muted">
            Reference <b className="text-ink">{done}</b>. Hard-search acknowledgement logged.
            The proposal is flagged as the 0% product for Autoconvert / Eskimo when those
            integrations are live.
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <span className="rounded-md bg-success-soft px-2 py-0.5 text-caption font-semibold text-success">
              0% APR product
            </span>
            <h3 className="mt-2 text-h4">
              {c.year} {c.make} {c.model}
            </h3>
            <dl className="mt-3 space-y-1.5 text-body-sm">
              <Row label="Cash price of goods" value={formatPounds(deal.total)} />
              <Row
                label={
                  deal.equity > 0 || deal.shortfall > 0
                    ? "Deposit including part exchange"
                    : "Deposit"
                }
                value={formatPounds(deal.deposit)}
              />
              {deal.shortfall > 0 ? (
                <Row
                  label="Negative equity added to credit"
                  value={formatPounds(deal.shortfall)}
                />
              ) : null}
              <Row label="Total amount of credit" value={formatPounds(deal.advance)} />
              <Row label="Term" value={`${deal.term} months`} />
              <Row
                label="Monthly payment"
                value={formatPounds(deal.monthly, { exact: true })}
              />
              <Row label="Rate of interest" value="0% fixed" />
              <Row label="Total charge for credit" value="£0" />
            </dl>
          </div>

          <ul className="space-y-3 text-body-sm text-muted">
            <li>
              Submitted to our lender panel{" "}
              <b className="text-ink">flagged as the 0% product</b>, so it is never proposed
              at a standard rate by mistake.
            </li>
            <li>
              A decision usually comes back <b className="text-ink">within a few minutes</b>.
            </li>
            <li>
              If it is declined, nobody will switch you onto a different product without
              asking you first.
            </li>
          </ul>

          <p className="text-body-sm">
            <b>This is a full credit search.</b> It will show on your credit file and other
            lenders can see it, whether you are accepted or not. 0% is only available to
            customers with a strong credit history, so if there is any doubt, check your
            rate first instead.
          </p>
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
