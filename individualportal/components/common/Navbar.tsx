"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/content/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/common/icons";

export type NavItem = { label: string; href: string };

export interface NavbarProps {
  /** Text shown next to the logo/divider. Defaults to the home page brand string. */
  portalName?: string;
  /** Right-aligned nav links. Defaults to the home page's link set. */
  navItems?: NavItem[];
  /** Label for the trailing profile dropdown. */
  profileLabel?: string;
  /** Optional click handler for the profile dropdown (desktop + mobile). */
  onProfileClick?: () => void;
  /** Override the brand logo image. */
  logoSrc?: string;
  /**
   * Whether the bar pins to the viewport (`fixed`, the home page's original
   * behavior) or sits in normal document flow (used when a wrapper like
   * IndividualBackground is already handling page-level layout).
   * Defaults to true to keep existing callers unchanged.
   */
  fixed?: boolean;
}

/**
 * Common, reusable Navbar shared across portal screens.
 * Structurally adapted from the Member Portal's home navigation
 * (dark 72px header, brand lockup, right-aligned nav + profile menu,
 * mobile hamburger drawer) so all portals stay visually consistent.
 */
export default function Navbar({
  portalName = homeContent.brand,
  navItems = homeContent.navLinks,
  profileLabel = homeContent.profileLabel,
  onProfileClick,
  logoSrc = "/brand/rma-logo.svg",
  fixed = true,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`${
        fixed ? "fixed left-0 top-0 z-30" : "relative z-10"
      } h-[72px] w-full overflow-hidden bg-[#11252D]`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-14">
        <Link href="/" aria-label="RMA home" className="flex shrink-0 items-center">
          <Image src={logoSrc} alt="RMA" width={95} height={29} priority />
          <span className="ml-3 hidden h-[19px] w-px bg-[#F3F7FA]/40 sm:block" aria-hidden />
          <span className="ml-[15px] hidden text-[16px] font-bold leading-[19px] text-white sm:block">
            {portalName}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-[42px] lg:flex">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-1 whitespace-nowrap text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
          >
            {profileLabel}
            <ChevronDownIcon className="h-5 w-5" />
          </button>
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
          {navItems.map((link) => (
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

          <button
            type="button"
            onClick={onProfileClick}
            className="flex items-center gap-1 text-[15px] font-normal text-white/90 transition hover:text-white"
          >
            {profileLabel}
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </nav>
      </aside>
    </header>
  );
}
