import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Stock / cars count. */
export function IconProofCar(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      width="40"
      height="40"
      {...props}
    >
      <rect width="40" height="40" rx="12" fill="#E6F4FB" />
      <path
        d="M12 24.5h16.5M14.2 24.5l1.4-6.2c.2-.8.9-1.4 1.7-1.4h6.8c.8 0 1.5.6 1.7 1.4l1.4 6.2"
        stroke="#0061A2"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 18.2h9.5"
        stroke="#0061A2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15.2" cy="24.5" r="1.6" fill="#0061A2" />
      <circle cx="25.3" cy="24.5" r="1.6" fill="#0061A2" />
    </svg>
  );
}

/** AA mark — matched to the blue proof-icon set. */
export function IconAaBadge(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      width="40"
      height="40"
      {...props}
    >
      <rect width="40" height="40" rx="12" fill="#E6F4FB" />
      <circle cx="20" cy="20" r="12" fill="#0061A2" />
      <text
        x="20"
        y="24.2"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="800"
        fontFamily="Arial Black, Arial, sans-serif"
        letterSpacing="-0.04em"
      >
        AA
      </text>
    </svg>
  );
}

/** 12-month warranty — shield with a clear “12”, fully inside the badge. */
export function IconWarrantyBadge(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      width="40"
      height="40"
      {...props}
    >
      <rect width="40" height="40" rx="12" fill="#E6F4FB" />
      <path
        d="M20 8.5 29.5 12.4v8.4c0 6.2-4 10.1-9.5 12.1-5.5-2-9.5-5.9-9.5-12.1v-8.4L20 8.5Z"
        fill="#0061A2"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="12"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        12
      </text>
    </svg>
  );
}

/** Two locations / showrooms. */
export function IconProofLocations(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      width="40"
      height="40"
      {...props}
    >
      <rect width="40" height="40" rx="12" fill="#E6F4FB" />
      <path
        d="M20 28.5s6-5.4 6-9.4a6 6 0 1 0-12 0c0 4 6 9.4 6 9.4Z"
        stroke="#0061A2"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="19" r="2" fill="#0061A2" />
    </svg>
  );
}
