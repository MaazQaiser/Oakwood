import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, string> = {
  info: "bg-info-soft text-ink",
  success: "bg-success-soft text-ink",
  warning: "bg-warning-soft text-ink",
  danger: "bg-danger-soft text-ink",
};

export function Alert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children?: ReactNode;
  tone?: AlertTone;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-lg px-4 py-3", tones[tone])}
    >
      <p className="text-label">{title}</p>
      {children ? <div className="mt-1 text-body-sm">{children}</div> : null}
    </div>
  );
}
