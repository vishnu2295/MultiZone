"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { documentSetLabel } from "@/lib/constants";
import type { ApiPagedResponse } from "@/content/companyDetails";
import type { ApiClaim } from "@/content/claims";
import {
  mapApiLetters,
  type ApiClaimDocumentGroup,
  type ClaimMedicalDocument,
} from "@/content/claimDetails";

export default function DocumentsPanel({ claimId }: { claimId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [groupedDocuments, setGroupedDocuments] = useState<
    Array<{ documentSet: number; label: string; documents: ClaimMedicalDocument[] }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !rolePlayerId || !ref) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadDocuments() {
      try {
        const claim = await apiService.get<ApiClaim>(`/employer/claim/${ref}`, {
          token: token ?? undefined,
          params: { rolePlayerId },
        });

        const response = await apiService.get<
          ApiPagedResponse<ApiClaimDocumentGroup>
        >(`/employer/${rolePlayerId}/documents`, {
          token: token ?? undefined,
          params: {
            keyName: "PersonEventId",
            keyValue: claim.personEventId,
            // 0 returns every document set, grouped by set.
            documentSet: 0,
            page: 1,
            pageSize: 10,
          },
        });
        if (!cancelled)
          setGroupedDocuments(
            response.data
              .map((group) => ({
                documentSet: group.documentSet,
                label: documentSetLabel(group.documentSet),
                documents: mapApiLetters(
                  (group.documents ?? []).filter((doc) => !doc.isDeleted),
                ),
              }))
              .filter((group) => group.documents.length > 0),
          );
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [claimId, ref, rolePlayerId, token]);

  if (isLoading) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Documents
      </h2>

      {groupedDocuments.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
          No documents found.
        </div>
      )}
      {groupedDocuments.map((group) => (
        <section key={group.documentSet} className="flex flex-col gap-4">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.label}
          </h3>

          {group.documents.map((document) => (
            <DocumentRow key={document.name} document={document} />
          ))}
        </section>
      ))}
    </div>
  );
}
