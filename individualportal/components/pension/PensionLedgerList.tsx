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

/** Fetches and renders the pensioner's ledger entries (page 1 of the paginated list). */
export default function PensionLedgerList() {
  const [entries, setEntries] = useState<PensionLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLedgers() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiPensionLedgersResponse>(
          `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/ledgers`,
          { token, params: { page: 1, pageSize: PAGE_SIZE } },
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
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <PensionLedgerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="mt-6 rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#6B7F8C] shadow-[2.805px_2.805px_28.05px_0px_#122E4D0D]">
        There are no pension ledgers to display.
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {entries.map((entry) => (
        <PensionLedgerCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
