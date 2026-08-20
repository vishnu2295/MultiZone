"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  homeContent,
  mapOrganizationProfile,
  profileMenu,
  type ApiOrganizationProfileResponse,
} from "@/content/site";
import { ChevronDownIcon, LogoutIcon } from "@/components/home/icons";
import apiService, { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import {
  findRmaId,
  getRmaProfiles,
  hasIndividualAndOrganizationRoles,
} from "@/lib/auth/employerClaims";

export interface ProfileMenuCardProps {
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
 * White card with the signed-in user's avatar, name, email, an optional
 * "Switch Profile" selector (shown only when the user's rma_ids span both an
 * individual and an organization role), and a logout action.
 */
export default function ProfileMenuCard({
  onLogout,
  className = "",
}: ProfileMenuCardProps) {
  const [canSwitchProfile, setCanSwitchProfile] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    memberName: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { token, rmaIds } = await getRmaProfiles();
        if (!cancelled) {
          setCanSwitchProfile(hasIndividualAndOrganizationRoles(rmaIds));
        }

        const coidId = findRmaId(rmaIds, "organization")?.coidId;
        if (!coidId) return;

        const response = await apiService.get<ApiOrganizationProfileResponse>(
          `${API_ROOT_BASE_URL}/profile/organization/${coidId}`,
          { token },
        );

        if (!cancelled) setProfile(mapOrganizationProfile(response));
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const showSkeleton = isLoading && !profile;
  const name = profile?.name ?? profileMenu.name;
  const email = profile?.email ?? profileMenu.email;
  const memberName = profile?.memberName ?? homeContent.memberName;
  const avatarText = profile ? initialsFrom(name) : profileMenu.initials;

  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-[0_12px_32px_rgba(17,37,45,0.18)] sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        {showSkeleton ? (
          <span
            aria-hidden
            className="shimmer h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#07C1E9] text-[16px] font-semibold text-white sm:h-14 sm:w-14 sm:text-[18px]"
          >
            {avatarText}
          </span>
        )}
        <div className="min-w-0">
          {showSkeleton ? (
            <div className="flex flex-col gap-2">
              <span className="shimmer h-4 w-32 rounded-full sm:h-[18px] sm:w-40" />
              <span className="shimmer h-3 w-40 rounded-full sm:h-[15px] sm:w-48" />
            </div>
          ) : (
            <>
              <p className="truncate text-[16px] font-medium leading-[20px] text-[#14607D] sm:text-[18px] sm:leading-[22px]">
                {name}
              </p>
              <p className="truncate text-[13px] leading-[18px] text-[#6B7B84] sm:text-[15px] sm:leading-[20px]">
                {email}
              </p>
            </>
          )}
        </div>
      </div>

      {canSwitchProfile && (
        <>
          <span className="my-4 block h-px w-full bg-[#E3EAEE] sm:my-5" aria-hidden />

          <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#13537B]">
            {profileMenu.switchProfileLabel}
          </p>

          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setIsSwitcherOpen((open) => !open)}
              aria-expanded={isSwitcherOpen}
              aria-haspopup="listbox"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#EAF6FE] px-4 py-2.5 text-left text-[14px] font-medium text-[#13537B] transition hover:bg-[#DCF0FB]"
            >
              {memberName}
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  isSwitcherOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSwitcherOpen && (
              <div
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-lg border border-black/8 bg-white shadow-[0_8px_24px_rgba(17,37,45,0.15)]"
              >
                <span
                  role="option"
                  aria-selected="true"
                  className="block bg-[#EAF6FE] px-4 py-2.5 text-[14px] font-medium text-[#13537B]"
                >
                  {memberName}
                </span>
                {/*
                  Plain anchor, not next/link: /individual is served by a
                  separate Next.js app (individualportal) behind memberportal's
                  rewrite proxy, not a route this app knows about, so a
                  client-side soft navigation 404s. A full browser navigation
                  is required to cross zones.
                */}
                <a
                  href={profileMenu.individualProfileHref}
                  role="option"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="block px-4 py-2.5 text-[14px] font-medium text-[#13537B] transition hover:bg-[#F3F7FA]"
                >
                  My Individual Profile
                </a>
              </div>
            )}
          </div>
        </>
      )}

      <span className="my-4 block h-px w-full bg-[#E3EAEE] sm:my-5" aria-hidden />

      <Link
        href={profileMenu.logoutHref}
        onClick={onLogout}
        className="flex items-center gap-3 rounded-lg px-1 py-1 text-[15px] font-medium text-[#D9534F] transition hover:opacity-80 sm:text-[17px]"
      >
        <LogoutIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        {profileMenu.logoutLabel}
      </Link>
    </div>
  );
}
