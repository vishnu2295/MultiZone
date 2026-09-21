"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { DocumentSetEnum } from "@/lib/constants";
import type { ApiDocumentSet, ApiPagedResponse } from "@/content/companyDetails";
import type { ApiClaim } from "@/content/claims";
import {
  mapApiEarnings,
  mapEarningsDocuments,
  type ApiClaimDocument,
  type ApiEarningsRecord,
  type ClaimEarningsRecord,
  type ClaimUploadDocument,
} from "@/content/claimDetails";

const tabs = ["Earnings", "Employee Earnings Documents"] as const;
type EarningsTab = (typeof tabs)[number];

export default function EarningsPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [earnings, setEarnings] = useState<ClaimEarningsRecord[]>([]);
  const [documents, setDocuments] = useState<ClaimUploadDocument[]>([]);
  const [personEventId, setPersonEventId] = useState<number | null>(null);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EarningsTab>(tabs[0]);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !ref) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadEarnings() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });

        const [earningsResult, documentsResult, documentTypesResult] =
          await Promise.allSettled([
            apiService.get<ApiEarningsRecord[]>(
              `/employer/${rolePlayerId}/earnings/${claim.personEventId}`,
              {
                token: token ?? undefined,
              },
            ),
            apiService.get<ApiPagedResponse<ApiClaimDocument>>(
              `/employer/${rolePlayerId}/documents`,
              {
                token: token ?? undefined,
                params: { keyName: "claimId", keyValue: claimId },
              },
            ),
            apiService.get<ApiDocumentSet[]>(
              `/employer/documentTypes/${DocumentSetEnum.EmployeeEarningsDocuments}`,
              { token: token ?? undefined },
            ),
          ]);

        if (earningsResult.status === "rejected") {
          console.error("Failed to load earnings records:", earningsResult.reason);
        }
        if (documentsResult.status === "rejected") {
          console.error("Failed to load earnings documents:", documentsResult.reason);
        }
        if (documentTypesResult.status === "rejected") {
          console.error(
            "Failed to load earnings document types:",
            documentTypesResult.reason,
          );
        }

        if (!cancelled) {
          setPersonEventId(claim.personEventId);
          setClaimStatus(claim.claimStatus);
          setEarnings(
            earningsResult.status === "fulfilled"
              ? mapApiEarnings(earningsResult.value)
              : [],
          );
          setDocuments(
            mapEarningsDocuments(
              documentsResult.status === "fulfilled"
                ? documentsResult.value.data
                : [],
              documentTypesResult.status === "fulfilled"
                ? documentTypesResult.value
                : [],
            ),
          );
        }
      } catch (error) {
        console.error("Failed to load earnings:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadEarnings();
    return () => {
      cancelled = true;
    };
  }, [claimId, ref, rolePlayerId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-4 flex scrollbar-none items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:sticky lg:top-18 lg:z-20 lg:bg-[#F3F7FA] lg:py-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
              activeTab === tab
                ? "bg-[#ECB143] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border-[0.625px] border-black/8 bg-white text-[#58585B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Earnings" ? (
        <div className="flex flex-col gap-6">
          <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {activeTab}
          </h2>

          {earnings.length === 0 && (
            <div className="rounded-xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
              No records found.
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {earnings.map((record, recordIndex) => (
              <div
                key={recordIndex}
                className="w-full max-w-[455px] rounded-xl bg-white px-5 py-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
              >
                {record.map((group, groupIndex) => (
                  <div key={group[0].label}>
                    {groupIndex > 0 && (
                      <span
                        className="my-3 block h-px w-full bg-black/5"
                        aria-hidden
                      />
                    )}

                    <div className="flex flex-col gap-4">
                      {group.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-[14px] font-normal leading-[21px] text-[#24577ACC]">
                            {row.label}
                          </span>
                          <span className="text-right text-[14px] font-bold leading-[21px] text-[#24577A]">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DocumentUploadList
          title={activeTab}
          documents={documents}
          personEventId={personEventId != null ? String(personEventId) : ""}
          showUploadButton={claimStatus !== "ClaimClosed"}
        />
      )}
    </div>
  );
}
