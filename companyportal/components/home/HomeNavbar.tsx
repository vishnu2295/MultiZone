"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { homeContent } from "@/content/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/home/icons";

export default function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const authHref = user ? "/auth/logout" : "/auth/login";
  const authLabel = user ? "Logout" : homeContent.profileLabel;

  return (
    <header className="fixed left-0 top-0 z-30 h-[72px] w-full bg-[#11252D]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-14">
        <Link
          href="/"
          aria-label="RMA home"
          className="flex shrink-0 items-center gap-[19px]"
        >
          <Image
            src="/company/brand/rma-logo.svg"
            alt="RMA"
            width={95}
            height={29}
            priority
          />
          <span
            className="hidden h-5 w-px bg-[#F3F7FA]/40 sm:block"
            aria-hidden
          />
          <span className="hidden text-[15.8px] font-bold leading-[19px] text-white sm:block">
            {homeContent.brand}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-[35px] lg:flex">
          {homeContent.navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={authHref}
            className="flex items-center gap-1 text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
          >
            {authLabel}
            <ChevronDownIcon className="h-4 w-4" />
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          className="ml-auto flex h-10 w-10 items-center justify-center text-white lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[280px] max-w-[80vw] bg-[#11252D] shadow-xl transition-transform lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-[72px] items-center justify-end px-4">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 py-4">
          {homeContent.navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[15px] font-normal text-white/90 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <span className="h-px w-full bg-white/10" aria-hidden />

          <Link
            href={authHref}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-normal text-white/90 transition hover:text-white"
          >
            {authLabel}
            <ChevronDownIcon className="h-4 w-4" />
          </Link>
        </nav>
      </aside>
    </header>
  );
}
