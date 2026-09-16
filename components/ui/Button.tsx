import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
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
    "bg-primary text-white hover:bg-primary-hover border border-transparent",
  secondary:
    "bg-surface text-ink border border-border-strong hover:bg-page",
  tertiary: "bg-primary-soft text-primary border border-transparent hover:bg-primary-soft",
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
  return href.startsWith("/") || href.startsWith("#");
}

function BusySpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
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
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-button",
    "transition-colors duration-[var(--oak-motion-fast)] ease-[var(--oak-ease)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:translate-y-px",
    variant === "icon" ? "min-h-11 min-w-11 px-0" : sizeClass[size],
    variantClass[variant],
    className,
  );
  const content = (
    <>
      {busy ? <BusySpinner /> : null}
      {children}
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
