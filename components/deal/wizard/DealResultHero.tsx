import type { ReactNode } from "react";
import { Check } from "lucide-react";

/** Navy result banner shared by the decision outcome and the reservation confirmation. */
export function DealResultHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="relative isolate overflow-hidden rounded-card bg-navy px-5 py-7 text-center text-white shadow-card"
      role="status"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-oakwood/25 blur-3xl"
      />
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15">
        <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
      </span>
      <p className="mt-3 text-caption uppercase tracking-[0.08em] text-white/75">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-h5 text-white">{title}</h2>
      <p className="mt-1 text-body-sm text-white/80">{body}</p>
      {children}
    </div>
  );
}
