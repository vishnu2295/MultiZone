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
import Skeleton from "@/components/ui/Skeleton";
import { SearchIcon } from "@/components/common/icons";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";

const PAGE_SIZE = 10;

function ClaimCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-[0px_2px_16px_0px_#00000012]">
      <div className="flex-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-2 h-3 w-64 max-w-full" />
      </div>
      <div className="ml-4 flex shrink-0 flex-col items-end gap-1.5">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3.5 w-14" />
      </div>
    </div>
  );
}

export default function ClaimsList() {
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
    let cancelled = false;
    setIsLoading(true);

    async function loadClaims() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiClaimsResponse>(
          `/employee/${coidId}/claims`,
          {
            token,
            params: { page, pageSize: PAGE_SIZE, claimReferenceNumber },
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
  }, [page, claimReferenceNumber]);

  return (
    <div className="flex w-full max-w-[1040px] flex-col">
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by claim ref no"
            className="w-full rounded-xl border border-black/8 bg-white py-2.5 pl-4 pr-10 text-[13px] text-[#13537B] placeholder:text-[#94A3B8] shadow-[0px_2px_16px_0px_#00000012] focus:outline-none focus:ring-2 focus:ring-[#07C1E9]/30"
          />
<img
            src="/individual/icons/search.svg"
            alt="Search"
            className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#13537B]"
          />        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ClaimCardSkeleton key={index} />
          ))
        ) : claims.length > 0 ? (
          claims.map((claim, index) => (
            <ClaimCard key={`${claim.refNo}-${index}`} claim={claim} />
          ))
        ) : (
          <div className="rounded-xl bg-white p-6 text-center text-[13px] text-[#6B7F8C] shadow-[0px_2px_16px_0px_#00000012]">
            {claimsContent.emptyState}
          </div>
        )}
      </div>

      {!isLoading && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}
