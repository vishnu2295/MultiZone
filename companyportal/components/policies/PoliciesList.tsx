"use client";

import { useEffect, useState } from "react";
import {
  policiesContent,
  mapApiPolicy,
  type ApiPolicy,
  type Policy,
} from "@/content/policies";
import type { ApiPagedResponse } from "@/content/companyDetails";
import PolicyCard from "@/components/policies/PolicyCard";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { computePageCount } from "@/lib/utils/pagination";

type Tab = (typeof policiesContent.tabs)[number];

function PolicyCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-2 h-3 w-32" />
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2 border-t border-black/5 pt-5">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

const tabStatus: Record<Tab, "active" | "inactive"> = {
  "Active Policies": "active",
  "Inactive Policies": "inactive",
};

const PAGE_SIZE = 10;

export default function PoliciesList() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [activeTab, setActiveTab] = useState<Tab>(policiesContent.tabs[0]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadPolicies() {
      try {
        const response = await apiService.get<ApiPagedResponse<ApiPolicy>>(
          `/employer/${rolePlayerId}/policies`,
          {
            token: token ?? undefined,
            params: {
              isActive: tabStatus[activeTab] === "active",
              page,
              pageSize: PAGE_SIZE,
            },
          },
        );

        if (!cancelled) {
          if (response.data.length === 0 && page > 1) {
            // The API's pageCount can overcount when a status filter is
            // applied, offering a "next" page that comes back empty. Snap
            // back to the last page that actually has data instead of
            // showing an empty state.
            setPageCount(page - 1);
            setPage(page - 1);
            return;
          }

          setPolicies(response.data.map(mapApiPolicy));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load policies:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPolicies();
    return () => {
      cancelled = true;
    };
  }, [activeTab, page, rolePlayerId, token]);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {policiesContent.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleTabChange(tab)}
            className={`rounded-md cursor-pointer px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <PolicyCardSkeleton key={index} />
          ))
        ) : policies.length > 0 ? (
          policies.map((policy, index) => (
            <PolicyCard key={`${policy.title}-${index}`} policy={policy} />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
            {policiesContent.emptyState}
          </div>
        )}
      </div>

      {!isLoading && policies.length > 0 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}
