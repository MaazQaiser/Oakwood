import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import { IconArrow } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "text"
  | "icon";

export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "rounded-[14px]! border border-transparent bg-[#002852] text-white hover:bg-[#001c3d]",
  secondary:
    "min-h-14! rounded-[14px]! border border-transparent bg-white px-5! text-[#002852] hover:bg-[#E7F1F8]",
  tertiary: "rounded-[14px]! bg-[#E7F1F8] text-[#002852] border border-transparent hover:bg-white",
  destructive: "bg-danger text-white hover:bg-danger/90 border border-transparent",
  text: "bg-transparent text-primary border border-transparent hover:underline underline-offset-4 px-2",
  icon: "bg-transparent text-ink border border-transparent hover:bg-page",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3",
  md: "min-h-11 px-4",
  lg: "min-h-12 px-5",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  busy?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function isAppHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function BusySpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

function isIconOnly(className?: string) {
  return Boolean(className && /(?:^|\s)(?:px-0!?|w-11)\b/.test(className));
}

function isCompact(className?: string) {
  return Boolean(className && /(?:^|\s)btn-compact\b/.test(className));
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  busy = false,
  ...props
}: ButtonProps) {
  const compact = isCompact(className);
  const withArrow = variant === "primary" && size !== "sm" && !isIconOnly(className);
  const classes = cn(
    "inline-flex items-center text-button",
    "transition-colors duration-[var(--oak-motion-fast)] ease-[var(--oak-ease)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:translate-y-px",
    compact && variant === "primary"
      ? "h-11 min-h-11 justify-between gap-2 rounded-[14px] bg-[#002852] py-1 pl-4 pr-1 text-white hover:bg-[#001c3d]"
      : compact && variant === "secondary"
        ? "h-11 min-h-11 justify-center rounded-[14px] border border-transparent bg-white px-4 text-[#002852] hover:bg-[#E7F1F8]"
        : withArrow
          ? "min-h-14 justify-between gap-3 rounded-[14px] bg-[#002852] py-1.5 pl-5 pr-1.5 text-white hover:bg-[#001c3d]"
          : cn(
              "justify-center gap-2 rounded-full",
              variant === "icon" ? "min-h-11 min-w-11 px-0" : sizeClass[size],
              variantClass[variant],
            ),
    className,
  );
  const content = (
    <>
      {busy ? <BusySpinner /> : null}
      {withArrow ? <span>{children}</span> : children}
      {withArrow ? (
        <span
          className={
            compact
              ? "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-white text-[#002852]"
              : "grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-[#002852]"
          }
        >
          <IconArrow width={compact ? 16 : 20} height={compact ? 16 : 20} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    const {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      id,
      role,
      tabIndex,
    } = props;

    const linkProps = {
      className: classes,
      onClick: onClick as MouseEventHandler<HTMLAnchorElement> | undefined,
      onMouseEnter: onMouseEnter as MouseEventHandler<HTMLAnchorElement> | undefined,
      onMouseLeave: onMouseLeave as MouseEventHandler<HTMLAnchorElement> | undefined,
      onFocus: onFocus as FocusEventHandler<HTMLAnchorElement> | undefined,
      onBlur: onBlur as FocusEventHandler<HTMLAnchorElement> | undefined,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      id,
      role,
      tabIndex,
    };

    if (!isAppHref(href)) {
      return (
        <a href={href} aria-busy={busy || undefined} {...linkProps}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} aria-busy={busy || undefined} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props;

  return (
    <button
      className={classes}
      type="button"
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink",
        "transition-colors hover:bg-page",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
