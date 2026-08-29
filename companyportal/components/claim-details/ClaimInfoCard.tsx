"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { claimSections, claimSectionSlugs } from "@/content/claimDetails";
import apiService from "@/lib/api/apiService";
import Skeleton from "@/components/ui/Skeleton";
import type { ApiClaim } from "@/content/claims";

type ClaimInfoCardProps = {
  claimId: string;
  claimantName: string;
  initials: string;
  status: string;
  claimRef: string;
};

type ClaimIdentity = {
  claimantName: string;
  initials: string;
  status: string;
  claimRef: string;
};

function getInitialsFromName(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return initials.slice(0, 2).toUpperCase();
}

export default function ClaimInfoCard({
  claimId,
  claimantName: fallbackClaimantName,
  initials: fallbackInitials,
  status: fallbackStatus,
  claimRef: fallbackClaimRef,
}: ClaimInfoCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const fallback: ClaimIdentity = {
    claimantName: fallbackClaimantName,
    initials: fallbackInitials,
    status: fallbackStatus,
    claimRef: fallbackClaimRef,
  };

  // No mock placeholder while a real ref is loading — showing then swapping
  // out fake claimant data reads as a bug, so this stays null (skeleton)
  // until the real claim resolves.
  const [identity, setIdentity] = useState<ClaimIdentity | null>(
    ref ? null : fallback,
  );

  useEffect(() => {
    if (!ref) return;

    let cancelled = false;
    setIdentity(null);

    async function loadClaim() {
      try {
        const claim = await apiService.get<ApiClaim>("/company/api/claim", {
          baseUrl: "",
          skipAuth: true,
          params: { ref: ref as string },
        });

        if (cancelled) return;
        setIdentity({
          claimantName: claim.claimantDisplayName,
          initials: getInitialsFromName(claim.claimantDisplayName),
          status: claim.claimStatus,
          claimRef: claim.claimReferenceNumber ?? (ref as string),
        });
      } catch (error) {
        console.error("Failed to load claim:", error);
        if (!cancelled) setIdentity(fallback);
      }
    }

    loadClaim();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const basePath = `/company/claims/${claimId}`;
  const isIndexActive = pathname === basePath;
  const queryString = ref ? `?ref=${encodeURIComponent(ref)}` : "";

  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-11 w-[47px] items-center justify-center rounded-lg bg-[#ECB143]">
            {identity ? (
              <span className="text-[14px] font-bold leading-[17px] text-white">
                {identity.initials}
              </span>
            ) : (
              <Skeleton className="h-4 w-6 rounded bg-white/40" />
            )}
          </div>
          {identity ? (
            <span className="rounded-full bg-[#10AD5E66] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-black">
              {identity.status}
            </span>
          ) : (
            <Skeleton className="h-6 w-16 rounded-full" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          {identity ? (
            <p className="text-[16px] font-bold leading-[19px] text-[#24577A]">
              {identity.claimantName}
            </p>
          ) : (
            <Skeleton className="h-4 w-32" />
          )}
          {identity ? (
            <p className="text-[14px] font-normal leading-[17px] text-[#24577A]">
              Claim Ref No : {identity.claimRef}
            </p>
          ) : (
            <Skeleton className="h-3.5 w-40" />
          )}
        </div>
      </div>

      <span className="mt-5 block h-px w-full bg-black/5" aria-hidden />

      <nav className="mt-4 flex flex-col gap-3">
        <Link
          href={`${basePath}${queryString}`}
          className={`flex items-center gap-1 text-left text-[12px] leading-[15px] text-[#13537B] transition ${
            isIndexActive
              ? "rounded-lg bg-[#F3F7FA] px-2 py-2.5 font-bold"
              : "px-2 py-0.5 font-normal hover:bg-[#F3F7FA] hover:rounded-lg"
          }`}
        >
          Claims
        </Link>

        {claimSections.map((section) => {
          const href = `${basePath}/${claimSectionSlugs[section]}`;
          const isActive = pathname === href;
          const hrefWithRef = `${href}${queryString}`;

          return (
            <Link
              key={section}
              href={hrefWithRef}
              className={`flex items-center gap-1 text-left text-[12px] leading-[15px] text-[#24577A] transition ${
                isActive
                  ? "rounded-lg bg-[#51B2E01A] px-2 py-2.5 font-bold"
                  : "px-2 py-0.5 font-normal hover:bg-[#51B2E01A] hover:rounded-lg"
              }`}
            >
              {section}
            </Link>
          );
        })}
      </nav>

      <span className="mt-4 block h-px w-full bg-black/5" aria-hidden />
    </aside>
  );
}
