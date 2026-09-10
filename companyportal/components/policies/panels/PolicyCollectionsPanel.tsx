"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import {
  mapApiPolicyInvoice,
  type ApiPolicyInvoice,
  type PolicyCollection,
} from "@/content/policyDetails";
import type { ApiPagedResponse } from "@/content/companyDetails";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { downloadBase64File } from "@/lib/utils/downloadFile";
import { computePageCount } from "@/lib/utils/pagination";

function CollectionRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function PolicyCollectionsPanel({ policyId }: { policyId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const [collections, setCollections] = useState<PolicyCollection[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadCollections() {
      try {
        const response = await apiService.get<ApiPagedResponse<ApiPolicyInvoice>>(
          `/employer/${rolePlayerId}/invoices`,
          {
            token: token ?? undefined,
            params: { page, pageSize: PAGE_SIZE, invoiceNumber: policyId },
          },
        );

        if (!cancelled) {
          setCollections(response.data.map(mapApiPolicyInvoice));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load policy collections:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCollections();
    return () => {
      cancelled = true;
    };
  }, [page, policyId, rolePlayerId, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CollectionRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
        There are no collections to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
              {collection.invoiceNumber}
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] leading-[17px] text-[#64748B]">
              <span>
                Collection Cycle
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.collectionCycle}
                </span>
              </span>
              <span>
                Amount
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.amount}
                </span>
              </span>
              <span>
                Document Date
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.documentDate}
                </span>
              </span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <StatusPill status={collection.status} />
            <button
              type="button"
              aria-label={`Download ${collection.invoiceNumber}`}
              disabled={!collection.attachment}
              onClick={() =>
                collection.attachment &&
                downloadBase64File(
                  collection.attachment.fileName,
                  collection.attachment.fileType,
                  collection.attachment.content,
                )
              }
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
