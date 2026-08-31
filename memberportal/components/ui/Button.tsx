import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  /**
   * Render a plain <a> instead of next/link. Required for the Auth0 routes
   * (/auth/login, /auth/logout) - client-side navigation breaks the redirect.
   */
  external?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  href,
  external = false,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bbe6]";

  const styles =
    variant === "primary"
      ? "bg-[linear-gradient(90deg,#0090B5_0%,#00BBE6_100%)] text-white shadow-[0_10px_20px_rgba(0,144,181,0.25)] hover:brightness-105"
      : "bg-transparent text-[#FFFFFF] hover:bg-white/10";

  const classes = `${base} ${styles} ${className}`.trim();

  if (href) {
    return external ? (
      <a href={href} className={classes}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
