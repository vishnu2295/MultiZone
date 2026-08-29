"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import { homeContent } from "@/content/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/home/icons";
import ProfileMenuCard from "@/components/home/ProfileMenuCard";

export default function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const pathname = usePathname();

  // useUser() is backed by SWR, which revalidates /auth/profile in the
  // background (e.g. on window refocus). A transient revalidation error
  // makes the hook return `user: null` even after a successful load, which
  // would otherwise flicker the profile card back to a plain "Logout" link.
  // Once we've seen a real user, keep treating the session as authenticated
  // client-side — an actual logout is a full page navigation anyway.
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  useEffect(() => {
    if (user) setHasAuthenticated(true);
  }, [user]);
  const isAuthenticated = Boolean(user) || hasAuthenticated;

  const authHref = isAuthenticated ? "/auth/logout" : "/auth/login";
  const authLabel = isAuthenticated ? "Logout" : homeContent.profileLabel;
  // The full "My Profile" card (with the Switch Profile selector) shows
  // across the whole /company zone, not just the dashboard root.
  const showProfileCard = isAuthenticated && pathname?.startsWith("/company");
  // Both portals are separate apps mounted at /company and /individual, so
  // the logo should return to whichever zone the user is currently in
  // rather than a shared "/" that neither app actually serves.
  const logoHref = pathname?.startsWith("/individual")
    ? "/individual"
    : "/company";

  // Close the profile dropdown on outside click or Escape.
  useEffect(() => {
    if (!isProfileOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const insideMenu =
        profileRef.current?.contains(target) ||
        mobileProfileRef.current?.contains(target);
      if (!insideMenu) setIsProfileOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <header className="fixed left-0 top-0 z-30 h-[72px] w-full bg-[#24577A]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-14">
        <Link
          href={logoHref}
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

          {showProfileCard ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                className="flex items-center gap-1 text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
              >
                {homeContent.profileLabel}
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform cursor-pointer  ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <ProfileMenuCard
                  onLogout={() => setIsProfileOpen(false)}
                  className="absolute right-0 top-[calc(100%+18px)] z-50 w-[320px] max-w-[calc(100vw-2rem)]"
                />
              )}
            </div>
          ) : (
            <Link
              href={authHref}
              className="flex items-center gap-1 text-[14px] font-normal leading-[17px] text-[#F3F7FA] opacity-90 transition hover:opacity-100"
            >
              {authLabel}
              {!isAuthenticated && <ChevronDownIcon className="h-4 w-4" />}
            </Link>
          )}
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
        onClick={() => {
          setIsMenuOpen(false);
          setIsProfileOpen(false);
        }}
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
            onClick={() => {
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
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

          {showProfileCard ? (
            <div ref={mobileProfileRef} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                className="flex items-center gap-1 text-[15px] font-normal text-white/90 transition hover:text-white"
              >
                {homeContent.profileLabel}
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <ProfileMenuCard
                  onLogout={() => {
                    setIsProfileOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                />
              )}
            </div>
          ) : (
            <Link
              href={authHref}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-1 text-[15px] font-normal text-white/90 transition hover:text-white"
            >
              {authLabel}
              {!isAuthenticated && <ChevronDownIcon className="h-4 w-4" />}
            </Link>
          )}
        </nav>
      </aside>
    </header>
  );
}
