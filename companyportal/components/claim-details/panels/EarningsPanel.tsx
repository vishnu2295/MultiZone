"use client";

import { useEffect, useState } from "react";
import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  mapApiDocuments,
  mapApiEarnings,
  type ApiClaimDocument,
  type ApiEarningsRecord,
  type ClaimEarningsRecord,
  type ClaimUploadDocument,
} from "@/content/claimDetails";

const tabs = ["Earnings", "Employee Earnings Documents"] as const;
type EarningsTab = (typeof tabs)[number];

export default function EarningsPanel({ claimId }: { claimId: string }) {
  const { token } = useCompanyProfile();
  const [earnings, setEarnings] = useState<ClaimEarningsRecord[]>([]);
  const [documents, setDocuments] = useState<ClaimUploadDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EarningsTab>(tabs[0]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadEarnings() {
      try {
        const [earningsResponse, documentsResponse] = await Promise.all([
          apiService.get<ApiEarningsRecord[]>(`/employer/earnings/${claimId}`, {
            token: token ?? undefined,
          }),
          apiService.get<ApiClaimDocument[]>(`/employer/documents/${claimId}`, {
            token: token ?? undefined,
          }),
        ]);

        if (!cancelled) {
          setEarnings(mapApiEarnings(earningsResponse));
          setDocuments(mapApiDocuments(documentsResponse).earningDocuments ?? []);
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
  }, [claimId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
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

          <div className="flex flex-wrap gap-4">
            {earnings.map((record, recordIndex) => (
              <div
                key={recordIndex}
                className="w-full max-w-[455px] rounded-xl bg-white px-5 py-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
              >
                {record.map((group, groupIndex) => (
                  <div key={group[0].label}>
                    {groupIndex > 0 && (
                      <span className="my-3 block h-px w-full bg-black/5" aria-hidden />
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
        <DocumentUploadList title={activeTab} documents={documents} claimId={claimId} />
      )}
    </div>
  );
}
