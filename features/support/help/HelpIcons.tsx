import type { SVGProps } from "react";
import type { HelpTopicId } from "@/lib/support/help-hub";

const PATHS: Record<HelpTopicId, string> = {
  all: "M4 6h16M4 12h16M4 18h10",
  buying:
    "M5 17h14v-4l-2-5H7l-2 5zM5 13h14M8 17a1.6 1.6 0 1 0 0 .01M16 17a1.6 1.6 0 1 0 0 .01",
  finance: "M15 6.5A4 4 0 0 0 8 9v8M6 13h6M6 18h11",
  partex: "M7 7h12l-3-3M17 17H5l3 3",
  reservations: "M7 3h10v18l-5-4-5 4z",
  delivery:
    "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 17.5a1.6 1.6 0 1 0 0 .01M17 17.5a1.6 1.6 0 1 0 0 .01",
  servicing:
    "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  warranty: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  contact: "M4 4h16v12H8l-4 4z",
};

export function HelpTopicIcon({
  topic,
  ...props
}: { topic: HelpTopicId } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[topic]} />
    </svg>
  );
}

export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconWrench(props: SVGProps<SVGSVGElement>) {
  return <HelpTopicIcon topic="servicing" {...props} />;
}
