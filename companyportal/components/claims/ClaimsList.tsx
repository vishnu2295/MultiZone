"use client";

import { useEffect, useState } from "react";
import {
  claimsContent,
  mapApiClaim,
  type ApiClaimsResponse,
  type Claim,
} from "@/content/claims";
import ClaimCard from "@/components/claims/ClaimCard";
import Pagination from "@/components/ui/Pagination";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import Skeleton from "../ui/Skeleton";

type Tab = (typeof claimsContent.tabs)[number];
function ClaimCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex-1">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-2 h-3 w-72 max-w-full" />
          <Skeleton className="mt-2 h-3 w-40" />
        </div>
        <div className="flex shrink-0 flex-col items-start gap-1.5 lg:items-end">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
const tabIsActive: Record<Tab, boolean> = {
  "Active Claims": true,
  "Past Claims": false,
};

const PAGE_SIZE = 3;

export default function ClaimsList() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [activeTab, setActiveTab] = useState<Tab>(claimsContent.tabs[0]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [claimReferenceNumber, setClaimReferenceNumber] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setClaimReferenceNumber(searchInput.trim()),
      400,
    );
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [claimReferenceNumber]);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadClaims() {
      try {
        const response = await apiService.get<ApiClaimsResponse>(
          `/employer/${rolePlayerId}/claims`,
          {
            token: token ?? undefined,
            params: {
              isActive: tabIsActive[activeTab],
              page,
              pageSize: PAGE_SIZE,
              claimReferenceNumber,
            },
          },
        );

        if (!cancelled) {
          setClaims(response.data.map(mapApiClaim));
          setPageCount(response.pageCount || 1);
        }
      } catch (error) {
        console.error("Failed to load claims:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadClaims();
    return () => {
      cancelled = true;
    };
  }, [activeTab, page, rolePlayerId, token, claimReferenceNumber]);

  return (
    <div className="flex min-h-130 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {claimsContent.tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`cursor-pointer rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition ${
                activeTab === tab
                  ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                  : "border border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by claim ref no"
            className="w-full rounded-lg border border-black/8 bg-white py-2.5 pl-4 pr-10 text-[13px] text-[#13537B] placeholder:text-[#94A3B8] shadow-[0px_2px_16px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#07C1E9]/30"
          />
          <img
            src="/company/icons/search.svg"
            alt="Search"
            className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#13537B]"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ClaimCardSkeleton key={index} />
          ))
        ) : claims.length > 0 ? (
          claims.map((claim, index) => (
            <ClaimCard key={`${claim.reference}-${index}`} claim={claim} />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
            {claimsContent.emptyState}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        {!isLoading && (
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
