"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field, Input, Select, Textarea } from "@/components/forms/FormControls";
import { GUARANTEE_LAUNCH_BLOCKERS, guaranteeConfig } from "@/config/guarantee";
import {
  getGuaranteeRequestAction,
  listGuaranteeRequestsAction,
  updateGuaranteeStatusAction,
} from "@/features/guarantee/actions";
import { formatGuaranteeMoney, refundAdminFeeLabel } from "@/lib/guarantee/format";
import {
  GUARANTEE_STATUS_FLOW,
  GUARANTEE_STATUS_LABELS,
  isStatusOverdue,
  statusTargetLabel,
} from "@/lib/guarantee/status";
import type {
  GuaranteeCloseOutcome,
  GuaranteeInspectionLine,
  GuaranteeRequestRecord,
  GuaranteeRequestStatus,
  GuaranteeRoute,
} from "@/types/guarantee";

const PHOTO_LABELS = {
  front_left: "Front left",
  front_right: "Front right",
  rear_left: "Rear left",
  rear_right: "Rear right",
  interior: "Interior",
  dashboard: "Dashboard",
} as const;

export function GuaranteeStaffBoard() {
  const [pending, startTransition] = useTransition();
  const [records, setRecords] = useState<GuaranteeRequestRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<GuaranteeRequestRecord | null>(null);
  const [damageAmount, setDamageAmount] = useState("");
  const [damageNote, setDamageNote] = useState("");
  const [keysAmount, setKeysAmount] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    startTransition(() => {
      void listGuaranteeRequestsAction().then(setRecords);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    startTransition(() => {
      void getGuaranteeRequestAction(selectedId).then((record) => {
        setSelected(record);
        setStaffNotes(record?.staffNotes ?? "");
      });
    });
  }, [selectedId]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    for (const record of records) {
      byStatus[record.status] = (byStatus[record.status] ?? 0) + 1;
      byReason[record.reason] = (byReason[record.reason] ?? 0) + 1;
    }
    return { byStatus, byReason };
  }, [records]);

  function buildInspectionLines(
    record: GuaranteeRequestRecord,
  ): GuaranteeInspectionLine[] {
    const lines: GuaranteeInspectionLine[] = [];
    if (record.route === "guarantee" && record.excessMileageCharge > 0) {
      lines.push({
        id: "excess-miles",
        label: `Excess mileage (${record.excessMiles} miles)`,
        amount: record.excessMileageCharge,
      });
    }
    if (
      record.route === "guarantee" &&
      record.choice === "refund" &&
      guaranteeConfig.refundAdminFee > 0
    ) {
      lines.push({
        id: "admin-fee",
        label: "Refund admin fee",
        amount: guaranteeConfig.refundAdminFee,
      });
    }
    if (record.route === "guarantee" && record.collectionCharge) {
      lines.push({
        id: "collection",
        label: "Collection charge",
        amount: record.collectionCharge,
      });
    }
    const damage = Number(damageAmount);
    if (record.route === "guarantee" && Number.isFinite(damage) && damage > 0) {
      lines.push({
        id: "damage",
        label: "Damage not on handover report",
        amount: damage,
        note: damageNote || undefined,
      });
    }
    const keys = Number(keysAmount);
    if (record.route === "guarantee" && Number.isFinite(keys) && keys > 0) {
      lines.push({
        id: "keys",
        label: "Missing keys or items",
        amount: keys,
      });
    }
    const fuel = Number(fuelAmount);
    if (record.route === "guarantee" && Number.isFinite(fuel) && fuel > 0) {
      lines.push({
        id: "fuel",
        label: "Fuel or charge to handover level",
        amount: fuel,
      });
    }
    return lines;
  }

  function moveTo(
    status: GuaranteeRequestStatus,
    extras?: {
      route?: GuaranteeRoute;
      closeOutcome?: GuaranteeCloseOutcome;
    },
  ) {
    if (!selected) {
      return;
    }
    setMessage(null);
    const inspectionLines =
      status === "inspected" || status === "closed"
        ? buildInspectionLines(selected)
        : selected.inspectionLines;
    startTransition(() => {
      void updateGuaranteeStatusAction({
        id: selected.id,
        status,
        route: extras?.route,
        closeOutcome: extras?.closeOutcome,
        inspectionLines,
        staffNotes,
      }).then((result) => {
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        setSelected(result.record);
        refresh();
        setMessage(`Moved to ${GUARANTEE_STATUS_LABELS[status]}.`);
      });
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[22px] bg-[#FFF8E8] p-5 ring-1 ring-[#F0E0B8]">
        <p className="oak-eyebrow">Before launch</p>
        <ul className="mt-3 space-y-2">
          {GUARANTEE_LAUNCH_BLOCKERS.map((item) => (
            <li key={item} className="flex gap-2 text-body-sm text-ink">
              <span aria-hidden>☐</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-muted">
          Nothing is sent to Eskimo, Stripe or a lender in this prototype.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#E7EEF4]">
          <p className="text-label">By status</p>
          <ul className="mt-2 space-y-1 text-body-sm">
            {GUARANTEE_STATUS_FLOW.map((status) => (
              <li key={status} className="flex justify-between gap-3">
                <span>{GUARANTEE_STATUS_LABELS[status]}</span>
                <span className="tabular-nums">{counts.byStatus[status] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#E7EEF4]">
          <p className="text-label">By reason</p>
          <ul className="mt-2 space-y-1 text-body-sm">
            {Object.keys(counts.byReason).length === 0 ? (
              <li className="text-muted">No requests yet</li>
            ) : (
              Object.entries(counts.byReason).map(([reason, count]) => (
                <li key={reason} className="flex justify-between gap-3">
                  <span className="capitalize">{reason.replaceAll("_", " ")}</span>
                  <span className="tabular-nums">{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="rounded-[22px] bg-white ring-1 ring-[#E7EEF4]">
        <div className="flex items-center justify-between gap-3 border-b border-[#E7EEF4] px-5 py-4">
          <h2 className="text-h3">Requests</h2>
          <Button type="button" variant="secondary" size="sm" onClick={refresh} busy={pending}>
            Refresh
          </Button>
        </div>
        {records.length === 0 ? (
          <p className="px-5 py-6 text-body-sm text-muted">
            No guarantee requests yet. Submit one from the customer form.
          </p>
        ) : (
          <ul className="divide-y divide-[#E7EEF4]">
            {records.map((record) => {
              const overdue = isStatusOverdue(record);
              return (
                <li key={record.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col gap-1 px-5 py-4 text-left hover:bg-[#F4F8FC]"
                    onClick={() => setSelectedId(record.id)}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-label">{record.reference}</span>
                      <span className="rounded-full bg-[#ECF3F8] px-2 py-0.5 text-caption">
                        {GUARANTEE_STATUS_LABELS[record.status]}
                      </span>
                      {overdue ? (
                        <span className="rounded-full bg-warning-soft px-2 py-0.5 text-caption">
                          Overdue
                        </span>
                      ) : null}
                      {record.aftersalesAlert ? (
                        <span className="rounded-full bg-danger-soft px-2 py-0.5 text-caption">
                          Aftersales
                        </span>
                      ) : null}
                    </span>
                    <span className="text-body-sm text-muted">
                      {record.registration} · {record.name} · {record.choice} ·{" "}
                      {record.sale.salesperson} · {record.sale.leadSource}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {selected ? (
        <section className="space-y-5 rounded-[22px] bg-white p-6 ring-1 ring-[#E7EEF4]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="oak-eyebrow">{selected.reference}</p>
              <h2 className="mt-1 text-h2">
                {selected.sale.year} {selected.sale.make} {selected.sale.model}
              </h2>
              <p className="mt-1 text-body-sm text-muted">
                {GUARANTEE_STATUS_LABELS[selected.status]} · target:{" "}
                {statusTargetLabel(selected.status)}
                {isStatusOverdue(selected) ? " · overdue" : ""}
              </p>
            </div>
            {selected.aftersalesAlert ? (
              <Alert title="Aftersales alert" tone="warning">
                <p>Statutory route — no fee or deductions for the fault.</p>
              </Alert>
            ) : null}
          </div>

          <dl className="grid gap-3 text-body-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Customer</dt>
              <dd>
                {selected.name} · {selected.email} · {selected.mobile}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Route / choice</dt>
              <dd className="capitalize">
                {selected.route} · {selected.choice}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Mileage</dt>
              <dd>
                Current {selected.currentMileage} · handover{" "}
                {selected.sale.handoverMileage} · excess {selected.excessMiles}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Return</dt>
              <dd>
                {selected.returnMethod === "drop_off"
                  ? `Drop off at ${selected.sale.sellingSiteName}`
                  : `Collection ${selected.collectionPostcode} (${selected.collectionDistanceMiles} mi)`}
                {" · preferred "}
                {selected.preferredReturnDateIso}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Sales / lead</dt>
              <dd>
                {selected.sale.salesperson} · {selected.sale.leadSource}
              </dd>
            </div>
            {selected.sale.finance ? (
              <div>
                <dt className="text-muted">Finance</dt>
                <dd>
                  {selected.sale.finance.lender} ·{" "}
                  {selected.sale.finance.agreementDateIso}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-label">Customer photos</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(PHOTO_LABELS).map(([key, label]) => {
                  const src = selected.photos[key as keyof typeof PHOTO_LABELS];
                  return src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={key}
                      src={src}
                      alt={label}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <h3 className="text-label">Handover photos</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(PHOTO_LABELS).map(([key, label]) => {
                  const src =
                    selected.sale.handoverPhotos[
                      key as keyof typeof PHOTO_LABELS
                    ];
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={key}
                      src={src}
                      alt={`Handover ${label}`}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {selected.status === "return_booked" ||
          selected.status === "inspected" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Damage £" htmlFor="damage">
                <Input
                  id="damage"
                  value={damageAmount}
                  onChange={(e) => setDamageAmount(e.target.value)}
                  disabled={selected.route === "statutory"}
                />
              </Field>
              <Field label="Keys / items £" htmlFor="keys">
                <Input
                  id="keys"
                  value={keysAmount}
                  onChange={(e) => setKeysAmount(e.target.value)}
                  disabled={selected.route === "statutory"}
                />
              </Field>
              <Field label="Fuel / charge £" htmlFor="fuel">
                <Input
                  id="fuel"
                  value={fuelAmount}
                  onChange={(e) => setFuelAmount(e.target.value)}
                  disabled={selected.route === "statutory"}
                />
              </Field>
              <div className="sm:col-span-3">
                <Field label="Damage note" htmlFor="damage-note">
                  <Input
                    id="damage-note"
                    value={damageNote}
                    onChange={(e) => setDamageNote(e.target.value)}
                    disabled={selected.route === "statutory"}
                  />
                </Field>
              </div>
              {selected.route === "guarantee" && selected.choice === "refund" ? (
                <p className="sm:col-span-3 text-body-sm text-muted">
                  Admin fee {refundAdminFeeLabel()} is added automatically on
                  inspect for a guarantee refund.
                </p>
              ) : null}
            </div>
          ) : null}

          {selected.inspectionLines.length > 0 ? (
            <div>
              <h3 className="text-label">Deductions listed</h3>
              <ul className="mt-2 space-y-1 text-body-sm">
                {selected.inspectionLines.map((line) => (
                  <li key={line.id} className="flex justify-between gap-3">
                    <span>
                      {line.label}
                      {line.note ? ` — ${line.note}` : ""}
                    </span>
                    <span>{formatGuaranteeMoney(line.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Field label="Staff notes" htmlFor="staff-notes">
            <Textarea
              id="staff-notes"
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            {selected.status === "submitted" ? (
              <Button type="button" busy={pending} onClick={() => moveTo("reviewed")}>
                Mark reviewed
              </Button>
            ) : null}
            {selected.status === "reviewed" ? (
              <Button
                type="button"
                busy={pending}
                onClick={() => moveTo("return_booked")}
              >
                Book return
              </Button>
            ) : null}
            {selected.status === "return_booked" ? (
              <Button
                type="button"
                busy={pending}
                onClick={() => moveTo("inspected")}
              >
                Mark inspected
              </Button>
            ) : null}
            {selected.status === "inspected" ? (
              <>
                <Button
                  type="button"
                  busy={pending}
                  onClick={() =>
                    moveTo("closed", {
                      closeOutcome:
                        selected.choice === "exchange"
                          ? "exchange_completed"
                          : "refund_paid",
                    })
                  }
                >
                  Close —{" "}
                  {selected.choice === "exchange"
                    ? "exchange completed"
                    : "refund paid"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  busy={pending}
                  onClick={() =>
                    moveTo("closed", { closeOutcome: "withdrawn" })
                  }
                >
                  Close — withdrawn
                </Button>
              </>
            ) : null}
            {selected.route === "guarantee" ? (
              <Button
                type="button"
                variant="secondary"
                busy={pending}
                onClick={() => moveTo(selected.status, { route: "statutory" })}
              >
                Set statutory
              </Button>
            ) : null}
          </div>

          <Field label="Jump to status" htmlFor="jump-status">
            <Select
              id="jump-status"
              value={selected.status}
              onChange={(e) =>
                moveTo(e.target.value as GuaranteeRequestStatus)
              }
            >
              {GUARANTEE_STATUS_FLOW.map((status) => (
                <option key={status} value={status}>
                  {GUARANTEE_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </Field>

          {message ? (
            <Alert title="Updated" tone="success">
              <p>{message}</p>
            </Alert>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
