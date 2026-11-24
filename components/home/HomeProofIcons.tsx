import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Google review mark for the 5-star proof box. */
export function IconGoogleReview(props: IconProps) {
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
      <g transform="translate(8 8) scale(0.5)">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </g>
    </svg>
  );
}

/**
 * AA brand mark — yellow disc + black AA letters, matching the AA Cars /
 * inspected-dealer badge treatment.
 */
export function IconAaBadge({
  tile = true,
  ...props
}: IconProps & { tile?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      width="40"
      height="40"
      {...props}
    >
      {tile ? <rect width="40" height="40" rx="12" fill="#E6F4FB" /> : null}
      <circle cx="20" cy="20" r={tile ? 13.5 : 18} fill="#FFD100" />
      <circle
        cx="20"
        cy="20"
        r={tile ? 13.5 : 18}
        stroke="#1A1A1A"
        strokeWidth="1.25"
      />
      <text
        x="20"
        y={tile ? 24.5 : 26}
        textAnchor="middle"
        fill="#1A1A1A"
        fontSize={tile ? 12 : 16}
        fontWeight="800"
        fontFamily="Arial Black, Arial, Helvetica, sans-serif"
        letterSpacing="-0.05em"
      >
        AA
      </text>
    </svg>
  );
}

/** 6-month warranty — shield with a clear “6”, fully inside the badge. */
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
        6
      </text>
    </svg>
  );
}

/** 30 Day Guarantee mark. */
export function IconGuaranteeBadge(props: IconProps) {
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
        d="M20 9.5 28 12.8v7.6c0 5.5-3.5 9-8 10.8-4.5-1.8-8-5.3-8-10.8v-7.6L20 9.5Z"
        stroke="#0061A2"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M15.8 20.2 18.6 23l5.6-6"
        stroke="#0061A2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stock count / cars available. */
export function IconProofStock(props: IconProps) {
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
        d="M11 24.5h18M13.5 24.5l1.2-7.2h10.6l1.2 7.2M15.2 17.3h9.6"
        stroke="#0061A2"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.2" cy="26.6" r="1.5" fill="#0061A2" />
      <circle cx="23.8" cy="26.6" r="1.5" fill="#0061A2" />
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
