"use client";

import { useEffect, useState } from "react";

import PensionLedgerCard from "@/components/pension/PensionLedgerCard";
import Skeleton from "@/components/ui/Skeleton";
import {
  mapApiPensionLedgers,
  PENSIONER_API_BASE_URL,
  type ApiPensionLedgersResponse,
  type PensionLedgerEntry,
} from "@/content/pensionServices";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";

const PAGE_SIZE = 10;

function PensionLedgerCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[2.805px_2.805px_28.05px_0px_#122E4D0D] sm:p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3.5 w-3/4" />
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fetches and renders the pensioner's ledger entries (page 1 of the paginated list), filterable by search. */
export default function PensionLedgerList() {
  const [entries, setEntries] = useState<PensionLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setSearchFilter(searchInput.trim()),
      400,
    );
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function loadLedgers() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiPensionLedgersResponse>(
          `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/ledgers`,
          {
            token,
            params: { page: 1, pageSize: PAGE_SIZE, searchFilter },
          },
        );

        if (!cancelled) setEntries(mapApiPensionLedgers(response));
      } catch (error) {
        console.error("Failed to load pension ledgers:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadLedgers();
    return () => {
      cancelled = true;
    };
  }, [searchFilter]);

  return (
    <div className="mt-6 flex flex-col">
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search pension ledgers"
            className="w-full rounded-xl border border-black/8 bg-white py-2.5 pl-4 pr-10 text-[13px] text-[#13537B] placeholder:text-[#94A3B8] shadow-[0px_2px_16px_0px_#00000012] focus:outline-none focus:ring-2 focus:ring-[#07C1E9]/30"
          />
          <img
            src="/individual/icons/search.svg"
            alt="Search"
            className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#13537B]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <PensionLedgerCardSkeleton key={index} />
          ))
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <PensionLedgerCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#6B7F8C] shadow-[2.805px_2.805px_28.05px_0px_#122E4D0D]">
            There are no pension ledgers to display.
          </div>
        )}
      </div>
    </div>
  );
}
