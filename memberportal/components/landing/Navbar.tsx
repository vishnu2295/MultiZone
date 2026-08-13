"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Button from "@/components/ui/Button";
import { siteContent } from "@/content/site";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  const authHref = user ? "/auth/logout" : "/auth/login";
  const authLabel = user ? "Logout" : siteContent.loginButton;

  return (
    <header className="absolute left-0 top-0 z-20 w-full border-b border-[#E9E9E9] bg-white">
      <div className="mx-auto flex h-[54px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-[56px]">
        <Link href="/" aria-label="RMA home" className="shrink-0">
          <Image
            src="/company/brand/rma-logo.svg"
            alt="RMA"
            width={96}
            height={30}
            className="h-5.5 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <nav className="flex items-center gap-7">
            {siteContent.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  link.label === "Go to randmutual.co.za"
                    ? "text-[12px] font-normal leading-none !text-[#13537B] border-b border-[#13537B] pb-[1px] hover:opacity-80"
                    : "text-[12px] font-normal leading-none !text-[#13537B] hover:opacity-80"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            href={authHref}
            external
            className="h-8 min-w-[100px] px-4 text-[12px] font-semibold"
          >
            {authLabel}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            href={authHref}
            external
            className="h-8 min-w-[100px] px-4 text-[12px] font-semibold"
          >
            {authLabel}
          </Button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E9E9E9] text-[#13537B] transition hover:bg-[#F6F9FB]"
          >
            <span className="sr-only">Open menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          <aside className="fixed right-0 top-[54px] z-40 w-[180px] border-l border-t border-b border-[#E9E9E9] bg-white px-3 py-4 shadow-2xl md:hidden">
            <nav className="flex flex-col gap-3">
              {siteContent.navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.label === "Go to randmutual.co.za" ? "_blank" : undefined}
                  rel={
                    link.label === "Go to randmutual.co.za"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-[12px] font-normal leading-none !text-[#13537B] hover:opacity-80"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </header>
  );
}
