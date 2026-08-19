"use client";

import { useEffect, useState } from "react";
import {
  mapApiPreAuthorization,
  medicalAuthorizationsContent as content,
  type ApiPreAuthorizationsResponse,
  type MedicalAuthorization,
} from "@/content/medicalAuthorizations";
import MedicalAuthorizationCard from "@/components/medicalAuthorizations/MedicalAuthorizationCard";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";

const PAGE_SIZE = 10;

function MedicalAuthorizationCardSkeleton() {
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

export default function MedicalAuthorizationsList() {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [authorizations, setAuthorizations] = useState<MedicalAuthorization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function loadAuthorizations() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiPreAuthorizationsResponse>(
          `/employee/${coidId}/preAuthorizations`,
          {
            token,
            params: { page, pageSize: PAGE_SIZE },
          },
        );

        if (!cancelled) {
          setAuthorizations(response.data.map(mapApiPreAuthorization));
          setPageCount(response.pageCount || 1);
        }
      } catch (error) {
        console.error("Failed to load medical authorizations:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAuthorizations();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="flex w-full max-w-[1040px] flex-col">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <MedicalAuthorizationCardSkeleton key={index} />
          ))
        ) : authorizations.length > 0 ? (
          authorizations.map((auth, index) => (
            <MedicalAuthorizationCard key={`${auth.preAuthNo}-${index}`} auth={auth} />
          ))
        ) : (
          <p className="text-[13px] text-[#6B7F8C]">{content.emptyMessage}</p>
        )}
      </div>

      {!isLoading && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}
