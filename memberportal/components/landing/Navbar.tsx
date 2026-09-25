"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/auth/AuthModal";
import { siteContent } from "@/content/site";
import { cognitoLogout, useCognitoUser } from "@/lib/useCognitoUser";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [loggingOut, setLoggingOut] = useState(false);
  const { signedIn: isAuthenticated } = useCognitoUser();

  function openAuth(mode: "login" | "signup") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await cognitoLogout();
    window.location.href = "/";
  }

  const authControl = isAuthenticated ? (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="h-8 min-w-[100px] px-4 text-[12px] font-semibold"
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </Button>
  ) : (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => openAuth("login")}
        className="text-[12px] cursor-pointer font-semibold text-[#13537B] underline underline-offset-2 hover:opacity-80"
      >
        Login
      </button>
      <Button
        type="button"
        onClick={() => openAuth("signup")}
        className="h-8 min-w-32.5 px-4 cursor-pointer text-[12px] font-semibold"
      >
        New Here? Sign Up
      </Button>
    </div>
  );

  return (
    <header className="absolute left-0 top-0 z-20 w-full border-b border-[#E9E9E9] bg-white">
      <div className="mx-auto flex h-[54px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-[56px]">
        <Link href="/" aria-label="RMA home" className="shrink-0">
          <Image
            src="/rma_blue_icon.png"
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

          {authControl}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {authControl}

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
                  target={
                    link.label === "Go to randmutual.co.za"
                      ? "_blank"
                      : undefined
                  }
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

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}
