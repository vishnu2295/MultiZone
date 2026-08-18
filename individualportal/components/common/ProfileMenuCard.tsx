"use client";

import Link from "next/link";
import { profileMenu } from "@/content/site";
import { LogoutIcon } from "@/components/common/icons";

export interface ProfileMenuCardProps {
  name?: string;
  email?: string;
  initials?: string;
  logoutLabel?: string;
  logoutHref?: string;
  /** Called after the logout link is clicked (used to close the menu/drawer). */
  onLogout?: () => void;
  className?: string;
}

/** Derives "JD" from "John Doe" when explicit initials aren't supplied. */
function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

/**
 * White card with the signed-in user's avatar, name, email and a logout action.
 * Rendered inside the navbar's desktop dropdown and mobile drawer.
 */
export default function ProfileMenuCard({
  name = profileMenu.name,
  email = profileMenu.email,
  initials = profileMenu.initials,
  logoutLabel = profileMenu.logoutLabel,
  logoutHref = profileMenu.logoutHref,
  onLogout,
  className = "",
}: ProfileMenuCardProps) {
  const avatarText = initials || initialsFrom(name);

  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-[0_12px_32px_rgba(17,37,45,0.18)] sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5CAFD6] text-[16px] font-semibold text-white sm:h-14 sm:w-14 sm:text-[18px]"
        >
          {avatarText}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[16px] font-medium leading-[20px] text-[#14607D] sm:text-[18px] sm:leading-[22px]">
            {name}
          </p>
          <p className="truncate text-[13px] leading-[18px] text-[#6B7B84] sm:text-[15px] sm:leading-[20px]">
            {email}
          </p>
        </div>
      </div>

      <span className="my-4 block h-px w-full bg-[#E3EAEE] sm:my-5" aria-hidden />

      <Link
        href={logoutHref}
        onClick={onLogout}
        className="flex items-center gap-3 rounded-lg px-1 py-1 text-[15px] font-medium text-[#D9534F] transition hover:opacity-80 sm:text-[17px]"
      >
        <LogoutIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        {logoutLabel}
      </Link>
    </div>
  );
}
