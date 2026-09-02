"use client";

import { useEffect, useRef, useState } from "react";

type LoginOption = {
  label: string;
  href: string;
};

type LoginMenuProps = {
  label: string;
  options: LoginOption[];
  className?: string;
  /** Anchors the panel to the right edge of the trigger. */
  align?: "left" | "right";
};

export default function LoginMenu({
  label,
  options,
  className = "",
  align = "right",
}: LoginMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[linear-gradient(90deg,#0090B5_0%,#00BBE6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,144,181,0.25)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bbe6] ${className}`.trim()}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className={`absolute top-[calc(100%+6px)] z-50 w-[160px] overflow-hidden rounded-lg border border-[#E9E9E9] bg-white py-1 shadow-[0_12px_24px_rgba(0,0,0,0.12)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => (
            // Plain <a> on purpose: the broker route is a rewrite and the Auth0
            // routes need a full navigation for the redirect to work.
            <a
              key={option.label}
              role="menuitem"
              href={option.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[12px] font-medium leading-none !text-[#13537B] transition hover:bg-[#F6F9FB]"
            >
              {option.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
