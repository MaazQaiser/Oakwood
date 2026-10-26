import type { SVGProps } from "react";

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconV2Cash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden width={22} height={22} {...props}>
      <path
        d="M14.5 8.25A3.75 3.75 0 0 0 10.75 4.5H9v15h2.25a3.75 3.75 0 0 0 0-7.5H9"
        {...stroke}
      />
      <path d="M9 10.5h4.25" {...stroke} />
    </svg>
  );
}

export function IconV2Finance(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden width={22} height={22} {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="2" {...stroke} />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" {...stroke} />
      <path d="M15.5 15.5 17 17l2.5-2.5" {...stroke} />
    </svg>
  );
}

export function IconV2PartExchange(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden width={22} height={22} {...props}>
      <path
        d="M5 9.5h10.5l-2.25-2.25M13.25 9.5 15.5 7.25M19 14.5H8.5l2.25 2.25M10.75 14.5 8.5 16.75"
        {...stroke}
      />
      <path d="M7.25 17.25h2.75a1.75 1.75 0 0 0 1.75-1.75v-1M16.75 6.75H14a1.75 1.75 0 0 0-1.75 1.75v1" {...stroke} />
    </svg>
  );
}

export function IconV2TestDrive(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden width={22} height={22} {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
      <path d="M8 3.5v3M16 3.5v3M4 10.5h16" {...stroke} />
      <circle cx="12" cy="15" r="2.25" {...stroke} />
      <path d="M12 13.5v-1" {...stroke} />
    </svg>
  );
}
